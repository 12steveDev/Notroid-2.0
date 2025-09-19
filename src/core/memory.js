// src/core/memory.js
class Memory {
    constructor(size){
        this.data = new Uint8Array(size);
    }

    read(addr){
        // * Lee una dirección específica de la memoria * //
        if (addr < 0 || addr >= this.data.length) {
            throw new Error(`Segmentation Fault en addr=${hex(addr)}`);
        }
        return this.data[addr];
    }

    write(addr, value){
        // * Escribe en una dirección específica de la memoria * //
        if (addr < 0 || addr >= this.data.length){
            throw new Error(`Segmentation Fault en addr=${hex(addr)}`);
        }
        this.data[addr] = value & 0xFF; // Aseguramos 1 byte
    }

    dump(from=0, to=16){
        // * Devolver una parte de la memoria * //
        return [...this.data.slice(from, to)]
            .map(v => hex(v))
            .join(" ");
    }

    readStringAt(addr, max=1024*1024){
        // * Lee bytes hasta encontrar 0x00 y retorna como string. El último caracter se incluye (si max = 1024, leerá hasta 1024) * //
        let chars = [];
        let count = 0;
        while (addr < this.data.length){
            const byte = this.read(addr);
            if (byte === 0x00) break;
            chars.push(String.fromCharCode(byte));
            count++;
            if (count >= max) break;
            addr++;
        }
        return chars.join("");
    }

    writeStringAt(addr, data){
        // * Escribe un array de bytes en memoria * //
        // ! Hasta aquí llegué
    }

    load(addr, bytes){
        // * Carga un bloque de bytes en memoria desde una posición * //
        if (!(bytes instanceof Uint8Array || Array.isArray(bytes))) throw new Error(`load() espera un Array o Uint8Array`);
        if (addr < 0 || addr + bytes.length > this.data.length) throw new Error(`Segmentation Fault al cargar en addr=${hex(addr)}`);
        this.data.set(bytes, addr);
    }
}

const ram = new Memory(SystemInfo.RAM.SIZE_BYTES);