class Notroid {
    static bsod = $("#bsod");
    static vga = $("#vga");
    static terminal = $("#terminal");
    static processes = {};
    static lastResult = "";
    static errorFlag = false;
    static state = {
        videoMode: "text"
    }
    static _setResult(processResult){
        const success = processResult[0] === 0;
        console.log(`[_setResult] SUCCESS: ${success} | DATA: '''${processResult[1]}'''`)
        this.errorFlag = !success;
        this.lastResult = processResult[1];
        return success;
    }
    // ===== Utils ===== //
    static resolveValue(val, pid=null, parseJson=false){
        console.log(`[resolveValue] Value: ${val} | PID: ${pid}`);
        let env;
        if (!pid && pid !== 0){ // 15 horas de debugging para que la solución "pid !== 0"
            env = {};
        } else {
            const process = this.processes[pid];
            if (!process){
                env = {};
            } else {
                env = process.env;
            }
        }
        console.log("a", env);
        env["__lastResult"] = this.lastResult;
        env["__errorFlag"] = this.errorFlag;
        return val.replace(/\$\{(.*?)\}/g, (_, key)=>{
            if (!key in env) return "[undefined]";
            if (parseJson && typeof env[key] === "string" && (env[key].trim().startsWith("{") || env[key].trim().startsWith("["))){
                try {
                    return JSON.parse(env[key]);
                } catch (e){
                    return env[key];
                }
            }
            return env[key];
        })
    }
    static BSOD(msg){
        const p = $("#bsodPError", this.bsod);
        p.textContent = msg;
        this.bsod.classList.remove("hide");
    }
    static verifyApp(appObj){
        try {
            appObj.manifest.id;              // !
            // appObj.manifest.appName;
            // appObj.manifest.icon;
            appObj.manifest.categories;
            appObj.manifest.permissions;
            // appObj.main.entry;
            // appObj.main.title;
            appObj.main.functions;
            // appObj.main.lifecycle.onCreate;
            // appObj.main.lifecycle.onDestroy;
            appObj.main.env;
            appObj.window.x;
            appObj.window.y;
            appObj.window.width;
            appObj.window.height;
            appObj.window.draggable;
            appObj.window.resizable;
            appObj.window.fullscreen;
            appObj.window.maximized;
            appObj.window.controls;
            appObj.screens;
            return true;
        } catch (e){
            return false;
        }
    }
    // ===== Interpreters ===== //
    static executeNotShell(code, admin=false){
        this.errorFlag = false;
        let i = 0;
        const lines = code.split("\n");
        while (i < lines.length){
            const line = lines[i].split("//")[0].trim();
            i++;
            console.log(`[executeNotShell] ${line}`);
            // alert()
            if (!line) continue;
            if (line.startsWith("LOG ")){
                console.log(this.resolveValue(line.slice(3).trim()));
            } else if (line.startsWith("ECHO ")){
                Terminal.writeln(this.resolveValue(line.slice(4).trim()));
            } else if (line.startsWith("EXEC ")){
                this.executeNotShell(this.resolveValue(line.slice(4).trim()), admin);
            } else if (line.startsWith("ONERROR ")){
                if (this.errorFlag) this.executeNotShell(this.resolveValue(line.slice(7).trim()), admin);
            } else if (line.startsWith("BSOD ") && admin){
                this.BSOD(this.resolveValue(line.slice(4).trim()));
            } else if (line.startsWith("VIDEOMODE ") && admin){
                const mode = this.resolveValue(line.slice(9).trim());
                if (mode === "graphic"){
                    this.terminal.classList.add("hide");
                    this.vga.classList.remove("hide");
                } else if (mode === "text"){
                    this.terminal.classList.remove("hide");
                    this.vga.classList.add("hide");
                } else {
                    this.BSOD(`Error: Modo de video desconocido: ${mode}`)
                }
                this.state["videoMode"] = mode;
            } else if (line.startsWith("RESOLUTION ") && admin){
                const parts = this.resolveValue(line.slice(10).trim()).split("-", 2);
                if (this.state["videoMode"] === "graphic"){
                    this.vga.style.width = parts[0];
                    this.vga.style.height = parts[1];
                } else {
                    // TODO...
                }
            } else if (line.startsWith("RUNAPP ")){
                let appObj;
                try {
                    appObj = JSON.parse(this.resolveValue(line.slice(6).trim(), null, false));
                } catch (e){
                    this.errorFlag = true;
                    this.lastResult = `La app está corrompida (JSON Error: '''${e.message}''')`;
                    continue;
                }
                if (!this.verifyApp(appObj)){
                    this.errorFlag = true;
                    this.lastResult = `La app está incompleta (completa CICADA 3301 para ver detalles 𓆉)`;
                    continue;
                }
                const pid = this.createProcess(appObj.manifest.id, appObj.main.env, appObj.main.lifecycle.onDestroy);
                this.createWindowObj(appObj, pid);
                this.executeNotroid(pid, appObj.main?.lifecycle?.onCreate);
            } else if (line.startsWith("CLOSEAPP ")){ // OJO: No es lo mismo que KILL
                const pid = line.slice(8).trim();
                if (!this._setResult(this.getProcess(pid))) continue;
                this.executeNotroid(pid, this.lastResult["onDestroy"]);
                this.executeNotShell(`KILL ${pid}`);
            } else if (line.startsWith("KILL ")){
                const pid = line.slice(4).trim();
                if (!this._setResult(this.getProcess(pid))) continue;
                this.killProcess(pid);
            } else if (line.startsWith("READ ")){
                this._setResult(NotroidFS.read(this.resolveValue(line.slice(4).trim())));
            } else {
                console.warn(`[executeNotShell] OP desconocido: ${line}`);
            }
        }
    }
    static executeNotroid(pid, actionArray){
        if (!actionArray) return;
        console.log(`[executeNotroid] (PID: ${pid}) ${JSON.stringify(actionArray)}`);
        if (!this._setResult(this.getProcess(pid))) return;
        const appObj = this.lastResult[2];
        if (actionArray.length === 0) return;
        if (Array.isArray(actionArray[0])){ // ¿El OP es otra acción? Acciónes en cadena detectada
            for (const arr of actionArray){
                this.executeNotroid(pid, arr);
            }
            return;
        }
        switch (actionArray[0]){
            case "NAVIGATE_TO":
                this.navigateTo(pid, actionArray[1]);
                break;
            case "SHOW_TOAST":
                alert(`[Toast de bajo presupuesto]:\n${this.resolveValue(actionArray[1], pid)}`);
                break;
            case "CLOSE_APP":
                this.executeNotShell(`CLOSEAPP ${pid}`);
                break;
            case "LOG":
                this.executeNotShell(`LOG ${this.resolveValue(actionArray[1], pid)}`);
                break;
            case "SET_TEXT":
                this.getElemById(pid, actionArray[1]).textContent = this.resolveValue(actionArray[2], pid);
                break;
            case "SET_ENV":
                this.getProcess(pid)[1].env[actionArray[1]] = this.resolveValue(actionArray[2], pid);
                break;
            case "LOAD_FILE":
                this.executeNotShell(`READ ${this.resolveValue(actionArray[1], pid)}`);
                if (this.errorFlag) return;
                this.getProcess(pid)[1].env[actionArray[2]] = this.lastResult;
                break;
            case "APPEND_CHILD":
                this.getElemById(pid, actionArray[1]).appendChild(this._parseElem(actionArray[2], pid));
                break;
            default:
                console.warn(`[executeNotroid] ACTION desconocida: ${actionArray[0]}`);
        }
    }
    // ===== Processes ===== //
    static getNextPid(){
        let pid = 0;
        while (this.processes.hasOwnProperty(pid)){
            pid++;
        }
        return pid;
    }
    static createProcess(appId, env, onDestroy){
        // {APPID, STATE, WINDOWID, ENV, ONDESTROY} //
        const pid = this.getNextPid();
        env = env ? {...env} : {};
        this.processes[pid] = { appId: appId, state: "running", windowId: `win_${pid}`, env: env, onDestroy: onDestroy };
        console.log(`[createProcess] PID: ${pid} | AppId: ${appId} | WindowId: win_${pid} | Env: ${JSON.stringify(env)}`);
        return pid;
    }
    static killProcess(pid){
        if (!this._setResult(this.getProcess(pid))) return;
        const wdw = $(`#${this.lastResult["windowId"]}`);
        wdw.classList.add("minimized");
        setTimeout(()=>{
            wdw.remove();
        }, 300);
        delete this.processes[pid];
        console.log(`[killProcess] PID: ${pid}`);
        return pid;
    }
    static getProcess(tpid){
        // [APPID, STATE, WINDOWID, ENV] //
        if (!isDigit(tpid)){
            return [3, `PID inválido: '${tpid}'`];
        }
        const pid = Number(tpid);
        const process = this.processes[pid];
        if (!process){
            return [1, `No se encontró el proceso con PID '${pid}'`];
        }
        const wdw = $(`.window#win_${pid}`, $("#vga"));
        if (!wdw){
            return [2, `No se encontró la ventana con WindowId 'win_${pid}' (PID: ${pid})`];
        }
        return [0, process];
    }
}