// src/core/terminal.js
class Terminal {
    static terminal = $("#terminal");

    static write(msg, color="", isBold=false){
        let styledMsg = msg;

        if (color) styledMsg = `<span style="color: ${color}">${styledMsg}</span>`;
        if (isBold) styledMsg = `<strong>${styledMsg}</strong>`;

        this.terminal.innerHTML += styledMsg;
        this.scrollBottom();
    }

    static clear(){
        this.terminal.innerHTML = "";
    }

    static writeln(msg, color="", isBold=false){
        this.write(msg + "<br>", color, isBold);
    }

    static scrollBottom(){
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
}