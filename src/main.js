// src/main.js
let program1 = [
    0xB0, 0x05,       // MOV AL, 0x05        -> AX = 0x0005
    0xB4, 0x01,       // MOV AH, 0x01        -> AX = 0x0105
    0x04, 0xFF,       // ADD AL, 0xFF        -> AX = 0x01 + 0x04?? (check overflow) AX=0x0104, CF=1
    0x3C, 0x04,       // CMP AL, 0x04        -> ZF=0
    0x50,             // PUSH AX             -> SP -= 2, stack[SP]=AX
    0xB8, 0x34, 0x12, // MOV AX, 0x1234      -> AX = 0x1234
    0x58,             // POP AX              -> AX recupera 0x0104
    0x74, 0x02,       // JZ +2               -> no salta porque ZF=0
    0xB0, 0x00,       // MOV AL, 0x00        -> AX = 0x0100
    0xEB, 0x01,       // JMP +1              -> PC salta una instrucción
    0xF4, 0xF4             // HLT                 -> detiene CPU
];

// Cargar en memoria en dirección 0x7C00
program1.forEach((byte, i) => {
    cpu.memory[0x7C00 + i] = byte;
});
BIOS.boot()