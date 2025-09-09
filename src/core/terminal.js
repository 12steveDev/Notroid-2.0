// src/core/terminal.js
class Terminal {
    static terminal = $("#terminal");

    static _styleMsg(msg, color, isBold){
        // == Devuelve un mensaje estilizado con color y negrita == //
        let styledMsg = msg.replace("<cursor>", "<span style='animation: blink infinite steps(1) 1s;'>_</span>");
        
        if (color) styledMsg = `<span style="color: ${color}">${styledMsg}</span>`;
        if (isBold) styledMsg = `<strong>${styledMsg}</strong>`;

        return styledMsg;
    }

    static write(msg, color="white", isBold=false){
        // == Escribe un mensaje en la terminal (sin salto de línea) == //
        let styledMsg = this._styleMsg(msg, color, isBold);

        this.terminal.innerHTML += styledMsg;
        this.scrollBottom();
    }

    static writeln(msg, color="white", isBold=false){
        // == Escribe un mensaje en la terminal con salto de línea == //
        this.write(msg + "<br>", color, isBold);
    }

    static overwrite(msg, color="white", isBold=false){
        // == Sobreescribir la última línea (sin salto de línea) == //
        let lines = this.terminal.innerHTML.split("<br>");
        let styledMsg = this._styleMsg(msg, color, isBold);
        
        // Reemplaza la última línea
        if (lines.length > 1){
            lines[lines.length - 1] = styledMsg;
        } else {
            lines[0] = styledMsg;
        }

        // Reemplaza todo el contenido
        this.terminal.innerHTML = lines.join("<br>");
        this.scrollBottom();
    }

    static overwriteln(msg, color="white", isBold=false){
        // == Sobreescribir la última línea con salto de línea == //
        this.overwrite(msg + "<br>", color, isBold);
    }

    static clear(){
        // == Limpia la terminal == //
        this.terminal.innerHTML = "";
    }

    static scrollBottom(){
        // == Desplaza el scroll de la terminal hacia abajo == //
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }
}