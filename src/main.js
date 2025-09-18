// src/main.js
// let program1 = [
//     0xB0, ord("H"), // mov al, 0x41
//     0xCD, 0x10,     // int 0x10
//     0xB0, ord("o"), // mov al, 0x41
//     0xCD, 0x10,     // int 0x10
//     0xB0, ord("l"), // mov al, 0x41
//     0xCD, 0x10,     // int 0x10
//     0xB0, ord("a"), // mov al, 0x41
//     0xCD, 0x10,     // int 0x10
//     0xF4
// ];

// // Cargar en memoria en dirección 0x7C00
// program1.forEach((byte, i) => {
//     ram.write(0x7C00 + i, byte);
// });
BIOS.boot();