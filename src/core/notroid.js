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
    static resolveValue(val, env={}){
        env["__lastResult"] = this.lastResult;
        env["__errorFlag"] = this.errorFlag;
        return val.replace(/\$\{(.*?)\}/g, (_, key)=>{
            return key in env ? env[key] : "[undefined]";
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
            appObj.main.entry;
            appObj.main.title;
            appObj.main.functions;
            appObj.main.lifecycle.onCreate;
            appObj.main.lifecycle.onDestroy;
            appObj.main.env;
            appObj.window.x;
            appObj.window.y;
            appObj.window.width;
            appObj.window.height;
            appObj.window.draggable;
            appObj.window.resizable;
            appObj.window.fullscreen;
            appObj.window.startState;
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
            console.log(`[executeNotShell] ${line}`)
            // alert()
            if (!line) continue;
            if (line.startsWith("LOG ")){
                console.log(this.resolveValue(line.slice(3).trim()));
            } else if (line.startsWith("ECHO ")){
                Terminal.writeln(this.resolveValue(line.slice(4).trim()));
            } else if (line.startsWith("EXEC ")){
                if (this._setResult(NotroidFS.read(this.resolveValue(line.slice(4).trim())))){
                    this.executeNotShell(this.lastResult, admin);
                }
            } else if (line.startsWith("ONERROR ")){
                if (this.errorFlag) this.executeNotShell(line.slice(7).trim(), admin);
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
                if (!this._setResult(NotroidFS.read(line.slice(6).trim()))) continue;
                const appObj = JSON.parse(this.lastResult);
                if (!this.verifyApp(appObj)){
                    this.errorFlag = true;
                    this.lastResult = `La app '${line.split("/").pop()}' está corrompida o incompleta`;
                    continue;
                }
                const pid = this.createProcess(appObj.manifest.id);
                this.createWindowObj(appObj, pid);
            } else if (line.startsWith("CLOSEAPP ")){ // OJO: No es lo mismo que KILL
                const pid = line.slice(8).trim();
                if (!this._setResult(this.getProcess(pid))) continue;
                // TODO: Ejecutar appObj.lifecycle.onDestroy
                this.executeNotShell(`KILL ${pid}`);
            } else if (line.startsWith("KILL ")){
                const pid = line.slice(4).trim();
                if (!this._setResult(this.getProcess(pid))) continue;
                this.killProcess(pid);
            } else {
                console.warn(`[executeNotShell] OP desconocido: ${line}`);
            }
        }
    }
    static executeNotroid(windowId, actionArray){
        //...
    }
    // ===== Processes ===== //
    static getNextPid(){
        let pid = 0;
        while (this.processes.hasOwnProperty(pid)){
            pid++;
        }
        return pid;
    }
    static createProcess(appId){
        const pid = this.getNextPid();
        this.processes[pid] = { appId: appId, state: "running", windowId: `win_${pid}` }
        console.log(`[createProcess] PID: ${pid} | AppId: ${appId} | WindowId: win_${pid}`);
        return pid;
    }
    static killProcess(pid){
        if (!this._setResult(this.getProcess(pid))) return;
        const r = this.getProcess(pid)[1];
        const process = r[0];
        const wdw = r[1];
        wdw.classList.add("minimized");
        setTimeout(()=>{
            wdw.remove();
        }, 300);
        delete this.processes[pid];
        console.log(`[killProcess] PID: ${pid}`);
        return pid;
    }
    static getProcess(tpid){
        // [PROCESS, WINDOW] //
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
        return [0, [process, wdw]];
    }
}