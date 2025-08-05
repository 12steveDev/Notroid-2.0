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
    // ===== Utils ===== //
    static BSOD(msg){
        const p = $("#bsodPError", this.bsod);
        p.textContent = msg;
        this.bsod.classList.remove("hide");
    }
    static verifyApp(appObj){
        try {
            appObj.manifest.id;
            appObj.manifest.appName;
            appObj.manifest.icon;
            appObj.manifest.categories;
            appObj.manifest.permissions;
            appObj.main.entry;
            appObj.main.title;
            appObj.main.functions;
            appObj.main.lifecycle.onCreate;
            appObj.main.lifecycle.onDestroy;
            appObj.main.env;
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
            return false
        }
    }
    // ===== Interpreters ===== //
    static executeNotShell(code, admin=false){
        let i = 0;
        const lines = code.split("\n");
        while (i < lines.length){
            const line = lines[i].split("//")[0].trim();
            i++;
            // console.log(`[executeNotShell] ${line}`)
            if (!line) continue;
            if (line.startsWith("LOG ")){
                console.log(line.slice(3).trim());
            } else if (line.startsWith("ECHO ")){
                Terminal.writeln(line.slice(4).trim());
            } else if (line.startsWith("EXEC ")){
                const f = NotroidFS.read(line.slice(4).trim());
                if (f[0] === 0){
                    this.errorFlag = false;
                    this.executeNotShell(f[1], admin);
                } else {
                    this.errorFlag = true;
                    this.lastResult = f[1];
                }
            } else if (line.startsWith("ONERROR")){
                if (this.errorFlag) this.executeNotShell(line.slice(7).trim(), admin);
            } else if (line.startsWith("BSOD ") && admin){
                this.BSOD(line.slice(4).trim());
            } else if (line.startsWith("VIDEOMODE ") && admin){
                const mode = line.slice(9).trim();
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
                const parts = line.slice(10).trim().split("-", 2);
                if (this.state["videoMode"] === "graphic"){
                    this.vga.style.width = parts[0];
                    this.vga.style.height = parts[1];
                } else {
                    // TODO...
                }
            } else if (line.startsWith("RUNAPP ")){
                const f = NotroidFS.read(line.slice(6).trim());
                if (f[0] !== 0){
                    this.errorFlag = true;
                    this.lastResult = f[1];
                    continue;
                }
                const appObj = JSON.parse(f[1]);
                if (!this.verifyApp(appObj)){
                    this.errorFlag = true;
                    this.lastResult = `La app '${line.split("/").pop()}' está corrompida o incompleta`;
                    continue;
                }
                this.createProcess(appObj.manifest.id);
                const wdw = this.createWindowObj(appObj);
            } else {
                console.warn(`[executeNotShell] OP desconocido: ${line}`);
            }
        }
    }
    static executeNotroid(appId, actionArray){
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
        this.processes[pid] = { appId: appId, state: "running", windowId: `win_${appId}` }
        console.log(`[createProcess] PID: ${pid} | AppId: ${appId}`);
    }
}