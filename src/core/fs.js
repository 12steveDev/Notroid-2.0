// src/core/fs.js
// ! En fase de prueba, luego añadir metadatos etc...
// ! hidden, readonly, created, modified
class NFile {
    // * Representa un archivo * //
    constructor(name, data=[]){
        this.name = name;
        this.data = data; // array de bytes
    }

    read(){
        // * Devuelve todo el contenido * //
        return this.data;
    }

    write(data){
        // * Reemplaza el contenido * //
        this.data = data;
    }
}
class Folder {
    // * Representa una carpeta / folder * //
    constructor(name, items=null){
        this.name = name;
        // Si se pasaron items, los transforma a Map, sino, da un Map vacío
        if (items !== null){
            this.items = isMap(items) ? items : objToMap(items);
        } else {
            this.items = new Map();
        }
    }

    add(item){
        // * Añade un item (File | Folder) * //
        this.items.set(item.name, item);
    }

    get(name){
        // * Devuelve un item * //
        return this.items.get(name);
    }

    list(){ //// showHidden = false
        // * Lista el contenido de la carpeta * //
        return Object.values(this.items)
            // .filter(i => showHidden || !i.hidden)
            .map(i => i.name);
    }
}
class FileSystem {
    // * El sistema de archivos de Notroid * //
    // TODO: Verificar si ya hay un FS guardado el localStorage
    static root = new Folder("/", DefaultFS.getDefaultFileSystem());

    static find(path){
        // * Buscar por ruta absoluta, tipo "/Notroid/Folder/file.txt" * //
        const parts = path.split("/").filter(Boolean);
        // console.log("parts", parts)
        let curr = this.root;
        const currArray = [];
        for (const part of parts){
            // ? El item actual es un archivo? (lo detecta antes de ir a otro item más)
            if (curr instanceof NFile) throw new Error(`'${currArray.pop()}' is not a directory`);
            curr = curr.get(part);
            currArray.push(part);
            // ? No hay item actual? (no existe)
            if (!curr) throw new Error(`No such file or folder '${part}'`);
        }
        return curr;
    }

    static read(path){
        const f = this.find(path);
        if (!(f instanceof NFile)) throw new Error(`'${f.name}' is not a file`);
        return f.read();
    }

    static write(path, data){
        const f = this.find(path);
        if (!(f instanceof NFile)) throw new Error(`'${f.name}' is not a folder`);
        // ! Hasta aquí llegué
    }
}
