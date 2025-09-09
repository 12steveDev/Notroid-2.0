// main.js
let program1 = [
    0xB4, 0x0E,       // MOV AH, 0x0E  ; función BIOS escribir carácter
    0xB8, 0x48, 0x0E, // MOV AX, 0x0E48 ; AL = 'H'
    0xCD, 0x10,       // INT 0x10      ; imprime 'H'
    
    0xB8, 0x49, 0x0E, // MOV AX, 0x0E49 ; AL = 'I'
    0xCD, 0x10,       // INT 0x10      ; imprime 'I'

    0xF4              // HLT
];

// Cargar en memoria en dirección 0x7C00
program1.forEach((byte, i) => {
    cpu.memory[0x7C00 + i] = byte;
});
BIOS.boot()