// src/utils/default-fs.js
class DefaultFS {
    static getDefaultFileSystem(){
        // * Devuelve un Map con todo el FS default * //
        // ! El contenido de los archivos todavía está en fase de prueba
        return new Map(Object.entries({
            "Notroid": new Folder("Notroid", {
                "System": new Folder ("System"),
                "System64": new Folder("System64", {
                    "bootmgr.sys": new NFile("bootmgr.sys", new Uint8Array([0xB0,0x41,0xCD,0x10,0xF4])), // Imprime A
                    "notkrnl.sys": new NFile("notkrnl.sys", new Uint8Array([0xB0,0x42,0xCD,0x10,0xF4])), // Imprime B
                }),
            }),
            "boot.mbr": new NFile("boot.mbr", new Uint8Array([
                0xB0, ord("H"), // mov al, 0x41
                0xCD, 0x10,     // int 0x10
                0xB0, ord("o"), // mov al, 0x41
                0xCD, 0x10,     // int 0x10
                0xB0, ord("l"), // mov al, 0x41
                0xCD, 0x10,     // int 0x10
                0xB0, ord("a"), // mov al, 0x41
                0xCD, 0x10,     // int 0x10
                0xF4,           // hlt
            ])), // Imprime H
        }))
    }
}