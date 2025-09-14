// src/core/cpu.js
// IMPORTANTISIMO: Cuando haya una instrucción que use "+=", ¡USA UNA VARIABLE PARA GUARDAR EL SIGUIENTE BYTE, NO DIRECTAMENTE "this.regs.PC += this.nextByte()..."!
// Usar siempre palabras comunes para variables ("offset", "result", etc...) pero de prefijo usar el hexadecimal del opcode, así evitamos conflictos
class CPU {
    constructor(){
        this.regs = {
            AX: 0, BX: 0, CX: 0, DX: 0,
            PC: 0  // Program Counter (El sistema lo pone en 0x7C00)
        };
        this.memory = new Uint8Array(65536);
        this.running = true;
    }

    nextByte(){
        // == Leer y devolver memory[PC] == //
        const v = this.memory[this.regs.PC];
        this.regs.PC++;
        return v;
    }

    nextWord(){
        // == Leer los siguientes 2 bytes y ordenarlos en little-endian == //
        let low = this.nextByte();
        let high = this.nextByte();
        return low | (high << 8);
    }

    step(){
        if (!this.running) return;
        
        // Guardar PC actual ANTES de leer el opcode
        const currentPC = this.regs.PC;
        let opcode = this.nextByte();
        
        console.log(`[CPU] OP: ${hex(opcode)} | PC: ${hex(currentPC)} | AX: ${hex(this.regs.AX, 4)} | SP: ${hex(this.regs.SP)} | ZF: ${this.flags.ZF} | CF: ${this.flags.CF}`);
        // NOTE: imm16 es little-endian, denada
        switch(opcode){
            case 0xB0: // MOV AL, imm8
                this.regs.AX = (this.regs.AX & 0xFF00) | this.nextByte();
                break;

            case 0xB4: // MOV AH, imm8
                this.regs.AX = (this.regs.AX & 0x00FF) | (this.nextByte() << 8);
                break;

            case 0xB8: // MOV AX, imm16
                this.regs.AX = this.nextWord();
                break;
            
            case 0xC3: // RET
                this.regs.PC = this.memory[this.regs.SP] | (this.memory[this.regs.SP + 1] << 8);
                this.regs.SP += 2;
                break;

            case 0xCD: // INT imm8
                this.handleInterrupt(this.nextByte());
                break;

            case 0xE8: // CALL rel16
                // guardar PC actual en stack
                let offsetE8 = this.nextWord();
                this.regs.SP -= 2;
                this.memory[this.regs.SP] = this.regs.PC & 0xFF;     // low byte
                this.memory[this.regs.SP + 1] = (this.regs.PC >> 8); // high byte
                this.regs.PC += toSigned16(offsetE8);
                break;

            case 0xEB: // JMP rel8
                let offsetEB = this.nextByte();
                this.regs.PC += toSigned8(offsetEB);
                return;

            case 0xF4: // HLT
                this.running = false;
                break;
            
            // ... más instrucciones

            default:
                Terminal.writeln(`Unknown opcode '${hex(opcode)}' at ${hex(currentPC)}`, "red");
                this.running = false;
        }
    }

    handleInterrupt(num){
        switch(num){
            case 0x10: // Servicios de video
                this.handleVideoInterrupt();
                break;
            case 0x13: // Servicios de disco
                this.handleDiskInterrupt();
                break;
            case 0x15: // Servicios del sistema
                this.handleSystemInterrupt();
                break;
            case 0x16: // Servicios de teclado
                this.handleKeyboardInterrupt();
                break;
            case 0x21: // Servicios DOS
                this.handleDOSInterrupt();
                break;
            default:
                Terminal.writeln(`Unknown interrupt '${hex(num)}'`, "red");
        }
    }

    handleVideoInterrupt(){
        let AH = (this.regs.AX >> 8) & 0xFF;
        let AL = this.regs.AX & 0xFF;

        switch(AH){
            case 0x00: // Establecer modo de video
                Terminal.clear();
                break;
            case 0x0E: // Escribir carácter en teletype
                let char = String.fromCharCode(AL);
                Terminal.write(char);
                break;
            case 0x13: // Escribir cadena (ES:BP = dirección, CX = longitud)
                let addr = (this.regs.ES << 4) + this.regs.BP;
                let length = this.regs.CX;
                let str = "";
                for (let i = 0; i < length; i++){
                    str += String.fromCharCode(this.memory[addr + i]);
                }
                Terminal.write(str);
                break;
            default:
                Terminal.writeln(`Unknown video function '${hex(AH)}'`, "red");
        }
    }

    run(){
        while (this.running){
            this.step();
        }
    }
}

const cpu = new CPU();