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

    readString(addr){
        // * Lee bytes hasta encontrar 0x00 y retorna como string * //
        let chars = [];
        while (addr < this.data.length){
            const byte = this.read(addr);
            if (byte === 0x00) break;
            chars.push(String.fromCharCode(byte));
            addr++;
        }
        return chars.join("");
    }

    load(addr, bytes){
        // * Carga un bloque de bytes en memoria desde una posición * //
        if (!(bytes instanceof Uint8Array || Array.isArray(bytes))) throw new Error(`load() espera un Array o Uint8Array`);
        if (addr < 0 || addr + bytes.length > this.data.length) throw new Error(`Segmentation Fault al cargar en addr=${hex(addr)}`);
        this.data.set(bytes, addr);
    }
}

const ram = new Memory(SystemInfo.RAM.SIZE_BYTES);