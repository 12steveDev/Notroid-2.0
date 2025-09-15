// src/utils/default-fs.js
class DefaultFS {
    static getDefaultFileSystem(){
        return {
            "Notroid": new Folder("Notroid", {

            }), // ! Aquí me quedé
            "boot.mbr": new NFile("boot.mbr", Uint8Array([0xB0,0x48]))
        }
    }
}