// src/main.js
let program1 = [
    0xB0, ord("H"),
    0xCD, 0x10,
    0xB0, ord("i"),
    0xCD, 0x10,
    0xB8, 0x40, 0x00,
    0xB9, 0x7C, 0x13,
    0xBB, 0x7C, 0x14, // ! Hsta aquí llegé
    0xCD, 0x20,
    0xF4, // 0x7C13
    ord("b"), ord("o"), ord("o"), ord("t"), ord("."), ord("m"), ord("b"), ord("r"), 0x00,
];

// Cargar en memoria en dirección 0x7C00
program1.forEach((byte, i) => {
    ram.write(0x7C00 + i, byte);
});
BIOS.boot();