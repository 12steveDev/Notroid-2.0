// src/core/cpu.js
// IMPORTANTISIMO: Cuando haya una instrucción que use "+=", ¡USA UNA VARIABLE PARA GUARDAR EL SIGUIENTE BYTE, NO DIRECTAMENTE "this.regs.PC += this.nextByte()..."!
// Usar siempre palabras comunes para variables ("offset", "result", etc...) pero de prefijo usar el hexadecimal del opcode, así evitamos conflictos
class CPU {
    constructor(memory){
        this.regs = {
            AX: 0, BX: 0, CX: 0, DX: 0,
            PC: 0  // Program Counter (El sistema lo pone en 0x7C00)
        };
        this.memory = memory;
        this.running = true;
    }

    nextByte(){
        // * Leer y devolver memory[PC] * //
        const v = this.memory.read(this.regs.PC);
        this.regs.PC++;
        return v;
    }

    nextWord(){
        // * Leer los siguientes 2 bytes (no little-endian) * //
        return (this.nextByte() << 8) | this.nextByte();
    }

    step(){
        // * Ejecuta el opcode actual y suma PC * //
        if (!this.running) return;
        
        // Guardar PC actual ANTES de leer el opcode
        const currentPC = this.regs.PC;
        let opcode = this.nextByte();
        
        console.log(`[CPU] OP: ${hex(opcode)} | PC: ${hex(currentPC)} | AX: ${hex(this.regs.AX, 4)}`);
        // NOTE: imm16 no es little-endian, denada
        switch(opcode){
            case 0xB0: // mov al, imm8
                this.regs.AX = (this.regs.AX & 0xFF00) | this.nextByte();
                break;

            case 0xB4: // mov ah, imm8
                this.regs.AX = (this.regs.AX & 0x00FF) | (this.nextByte() << 8);
                break;

            case 0xB8: // mov ax, imm16
                this.regs.AX = this.nextWord();
                break;

            case 0xCD: // int imm8
                this.handleInterrupt(this.nextByte());
                break;

            case 0xF4: // hlt
                this.running = false;
                break;
            
            // ... más instrucciones

            default:
                Terminal.writeln(`Unknown opcode '${hex(opcode)}' at ${hex(currentPC)}`, "red");
                this.running = false;
        }
    }

    handleInterrupt(num){
        // * Maneja las interrupciones a la BIOS * //
        switch(num){
            case 0x00: // Modo de video
                if (this.regs.AX === 0x7C00){ // Modo text
                    Terminal.terminal.classList.remove("hide");
                    // TODO: Ocultar VGA
                } else if (this.regs.AX === 0xB800){ // Modo VGA
                    Terminal.terminal.classList.add("hide");
                    // TODO: Mostrar VGA
                } else {
                    // TODO: Hacer algo random si el videomode no es válido
                }
                break;

            case 0x01: // Limpiar Terminal
                Terminal.clear();
                break;

            case 0x10: // Imprimir caracter
                Terminal.write(String.fromCharCode(this.regs.AX & 0xFF));
                break;
        }
    }

    run(){
        // * Ejecuta lo que haya de PC en adelante * //
        while (this.running){
            this.step();
        }
    }
}

const cpu = new CPU(ram);