class Notroid {
    static bsod = $("#bsod");
    static desktop = $("#desktop");
    static terminal = $("#terminal");
    static state = {
        display: "Terminal"
    }
    static BSOD(msg){
        const p = $("#bsodPError", this.bsod);
        p.textContent = msg;
        this.bsod.classList.remove("hide");
    }
    static executeNotShell(code, admin=false){
        let errflag = false;
        let i = 0;
        const lines = code.split("\n");
        while (i < lines.length){
            const line = lines[i].split("//")[0].trim();
            i++;
            if (!line) continue;
            if (line.startsWith("ECHO ")){
                Terminal.writeln(line.slice(4).trim());
            } else if (line.startsWith("LOG ")){
                console.log(line.slice(3).trim());
            } else if (line.startsWith("EXEC ")){
                const f = NotroidFS.read(line.slice(4).trim());
                if (f[0] === 0){
                    errflag = false;
                    this.executeNotShell(f[1], admin);
                } else {
                    errflag = true;
                }
            } else if (line.startsWith("ONERROR")){
                if (errflag) this.executeNotShell(line.slice(7).trim(), admin);
            } else if (line.startsWith("BSOD ") && admin){
                this.BSOD(line.slice(4).trim());
            } else if (line.startsWith("DISPLAY ") && admin){
                const mode = line.slice(7).trim();
                if (mode === "graphic"){
                    this.terminal.classList.add("hide");
                    this.desktop.classList.remove("hide");
                } else if (mode === "text"){
                    this.terminal.classList.remove("hide");
                    this.desktop.classList.add("hide");
                } else {
                    this.BSOD(`Error: Modo de video desconocido: ${mode}`)
                }
                this.state["display"] = mode;
            } else if (line.startsWith("RESOLUTION")){
                const parts = line.slice(10).trim().split("-", 2);
                if (this.state["display"] === "graphic"){
                    this.desktop.style.width = parts[0];
                    this.desktop.style.height = parts[1];
                } else {
                    // TODO...
                }
            } else {
                console.warn(`[executeNotShell] OP desconocido: ${line}`);
            }
        }
    }
}