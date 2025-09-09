// src/core/cpu.js
class CPU {
    constructor(){
        this.regs = {
            AX:0, BX:0, CX:0, DX: 0,
            SP:0x7C00,  // Stack Pointer
            PC:0x7C00   // Program Counter
        };
        this.memory = new Uint8Array(65536);
        this.running = true;
    }

    nextByte(){
        const v = this.memory[this.regs.PC];
        this.regs.PC++;
        return v;
    }

    step(){
        if (!this.running) return;
        
        // Guardar PC actual ANTES de leer el opcode
        const currentPC = this.regs.PC;
        let opcode = this.nextByte();
        
        console.log(`[CPU] OP: ${hex(opcode)} | PC: ${hex(currentPC)} | AX: ${hex(this.regs.AX)} | SP: ${hex(this.regs.SP)}`);
        // NOTE: imm16 es little-endian, denada
        switch(opcode){
            case 0x50: // PUSH AX
                this.regs.SP -= 2; // bajamos SP 2 bytes
                this.memory[this.regs.SP] = this.regs.AX & 0xFF;     // low byte
                this.memory[this.regs.SP + 1] = (this.regs.AX >> 8); // high byte
                break;
            
            case 0x58: // POP AX
                this.regs.AX = this.memory[this.regs.SP] | (this.memory[this.regs.SP + 1] << 8);
                this.regs.SP += 2;
                break;

            case 0xB0: // MOV AL, imm8
                this.regs.AX = (this.regs.AX & 0xFF00) | this.nextByte();
                break;
            
            case 0xB4: // MOV AH, imm8
                this.regs.AX = (this.regs.AX & 0x00FF) | (this.nextByte() << 8);
                break;

            case 0xB8: // MOV AX, imm16
                this.regs.AX = this.nextByte() | (this.nextByte() << 8)
                break;
            
            case 0xC3: // RET
                this.regs.PC = this.memory[this.regs.SP] | (this.memory[this.SP + 1] << 8);
                this.regs.SP += 2;
                break;
            
            case 0xCD: // INT imm8
                this.handleInterrupt(this.nextByte());
                break;
            
            case 0xE8: // CALL imm16 (absolute)
                // guardar PC actual en stack
                this.regs.SP -= 2;
                this.memory[this.regs.SP] = this.regs.PC & 0xFF;     // low byte
                this.memory[this.regs.SP + 1] = (this.regs.PC >> 8); // high byte
                this.regs.PC = this.nextByte() | (this.nextByte() << 8);
                break;
            
            case 0xE9: // JMP imm16 (absolute)
                this.regs.PC = this.nextByte() | (this.nextByte() << 8);
                break;
            
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
        if (num == 0x10){
            let AH = (this.regs.AX >> 8) & 0xFF; // high byte
            let AL = this.regs.AX & 0xFF;        // low byte

            if (AH === 0x0E){
                // INT 0x10/AH=0x0E - Escribir carácter
                let char = String.fromCharCode(AL);
                Terminal.write(char);
            }
        }
    }

    run(){
        while (this.running){
            this.step();
        }
    }
}

const cpu = new CPU();