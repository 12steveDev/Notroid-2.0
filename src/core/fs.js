// src/core/fs.js
class NFile {
    // * Representa un archivo * //
    constructor(name, content=[], metadata={}){
        this.name = name;
        this.content = content; // array de bytes
        this.hidden = !!metadata.hidden;
        this.readonly = !!metadata.readonly;
        this.created = new Date().toISOString();
        this.modified = new Date().toISOString();
    }

    read(){
        // * Devuelve todo el contenido * //
        return this.content;
    }

    write(data){
        // * Reemplaza el contenido * //
        if (this.readonly) throw new Error(`File '${this.name}' is readonly`);
        this.content = data;
        this.modified = new Date().toISOString();
    }
}
class Folder {
    // * Representa una carpeta / folder * //
    constructor(name, items=null){
        this.name = name;
        this.items = items || {}; // name -> File | Folder
        this.created = new Date().toISOString();
    }

    add(item){
        // * Añade un item (File | Folder) * //
        this.items[item.name] = item;
    }

    get(name){
        // * Devuelve un item * //
        return this.items[name];
    }

    list(showHidden = false){
        return Object.values(this.items)
            .filter(i => showHidden || !i.hidden)
            .map(i => i.name);
    }
}
class FileSystem {
    constructor(){
        // TODO: Verificar si ya hay un FS guardado el localStorage
        this.root = DefaultFS.getDefaultFileSystem();
    }
    static read(){}
    static write(){}
}