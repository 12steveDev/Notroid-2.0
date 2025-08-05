// scr/core/fs.js
let savedFS = localStorage.getItem("NotroidFS");
const defaultFS = {
    "$": { // Raíz
        "Notroid": {
            "system": {
                "config.json": [JSON.stringify({ theme: "dark", lang: "es" }), { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "installed_apps": [JSON.stringify([ "calculator", "notes" ]), { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "wallpaper.png": ["data:image/webp;base64,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", { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "bootmgr.nsh": ["ECHO bootmgr cargado\nLOG [OS] BOOTMGR inicializado\nEXEC Notroid/system/notkrnl.nsh\nONERROR BSOD Error: No se pudo iniciar Notroid. Falta el archivo /Notroid/system/notkrnl.nsh", { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "notkrnl.nsh": ["LOG [OS] NOTKRNL inicializado\nEXEC Notroid/system/drivers/display.nsh\nRUNAPP Notroid/apps/miapp.json", { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "drivers": {
                    "display.nsh": ["LOG [OS] DISPLAY inicializado\n// Cambiar modo de video a gráfico\nVIDEOMODE graphic\nRESOLUTION 100%-100%", { created: new Date().toISOString(), modified: new Date().toISOString() }]
                },
            },
            "apps": {
                "miapp.json": [JSON.stringify({
                    manifest: {
                        id: "miapp",
                        name: "Mi App",
                        icon: "https://placehold.co/150x150/008080/FFFFFF?text=Hola\\nMundo",
                        categories: [],
                        permissions: []
                    },
                    main: {
                        entry: "MAIN",
                        title: "Épico, ¿Verdad?",
                        functions: {},
                        lifecycle: {
                            onCreate: ["SHOW_TOAST", "Bienvenido, $name"],
                            onPause: [], // Todavía en duda!!!, no se en qué momento se ejecutaría
                            onDestroy: ["SHOW_TOAST", "Cerrando..."]
                        },
                        env: {
                            "name": "12steve"
                        }
                    },
                    window : {
                        width: "400px",
                        height: "200px",
                        draggable: true,
                        resizable: true,
                        fullscreen: false,     // No Toolbar
                        startState: "normal",  // normal/maximized
                        controls: true,        // [─][◻][✕]
                        singleInstance: false
                    },
                    screens: {
                        "MAIN": [
                            {type: "text", text: "Hola Mundo"},
                            {type: "button", text: "Detalles", action: ["NAVIGATE_TO", "Details"]}
                        ],
                        "Details": [
                            {type: "text", text: "Detalles..."},
                            {type: "button", text: "...", action: ["SHOW_TOAST", "Has sido un gran explorador, pequeño bro 🗿🔥"]}
                        ]
                    }
                }), { created: new Date().toISOString(), modified: new Date().toISOString() }]
            }
        },
        "home": {
            "user": {
                "documents": {},
                "downloads": {}
            }
        },
        "README.txt": ["Bienvenido a Notroid, mortal promedio. Intenta encontrar los eastereggs (ninguno) dentro de este OS con 1945 demandas de Google! :)", { created: new Date().toISOString(), modified: new Date().toISOString() }]
    },
}
const NotroidFS = (savedFS && JSON.parse(savedFS)) ? JSON.parse(savedFS) : defaultFS;
NotroidFS._save = function(){
    localStorage.setItem("NotroidFS", JSON.stringify(NotroidFS))
}
NotroidFS._path = function(path, curr=NotroidFS["$"]){
    const parts = path.split("/").filter(p => p !== ""); // Ignora partes vacías (ej: "home//user" → ["home", "user"])
    if (path.startsWith("/")){
        curr = NotroidFS["$"];
        parts.shift();
    }
    for (const part of parts){
        if (!curr[part]) return null; // ¡Ruta no existe!
        curr = curr[part]; // Avanza al siguiente nodo
    }
    return curr; // Retorna lo que haya (sea archivo [] o carpeta {})
},
// Formato de output: [returnCode, resultData/errorDetail]
NotroidFS.read = function(path){
    console.log(`[NotroidFS][read] ${path}`);
    const dir = NotroidFS._path(path);
    const fname = path.split("/").at(-1);
    if (dir === null) return [1, `El archivo '${fname}' no existe`];
    if (Array.isArray(dir)) return [0, dir[0], fname]; // Solo el contenido
    return [2, `El nombre '${fname}' pertenece a una carpeta`];
},
NotroidFS.write = function(path, data){
    console.log(`[NotroidFS][write] ${path}, ${data}`);
    const dir = NotroidFS._path(path);
    const fname = path.split("/").at(-1);
    if (dir === null) return [1, `El archivo '${fname}' no existe`];
    if (Array.isArray(dir)){
        dir[0] = data;
        dir[1]["modified"] = new Date().toISOString();
        NotroidFS._save();
        return [0, data];
    }
    return [2, `El nombre '${fname}' pertenece a una carpeta`];
},
NotroidFS.rm = function(path){ // jejeje, ¿como que huele a "rm -rf /" verdad?
    console.log(`[NotroidFS][rm] ${path}`);
    if (path === "/"){
        // 🔥 ALV
        NotroidFS["$"] = {};
        NotroidFS._save();
        return [911, "probablemente no veas esto"];
    }
    const parts = path.split("/").filter(p => p !== "");
    const fname = parts.pop(); // Nombre del archivo/carpeta a eliminar
    const parentPath = parts.join("/");

    const parentDir = parentPath ? NotroidFS._path(parentPath) : NotroidFS["$"];
    if (parentDir === null) return [1, `La carpeta '${parentPath}' no existe`];
    if (!parentDir[fname]) return [2, `El archivo o carpeta '${fname}' no existe`];

    delete parentDir[fname];
    NotroidFS._save();
    return [0, fname];
}

/*
TODO: Hacer que la carpeta Notroid de verdad sirva para algo (para que al borrarla dañe de verdad el sistema)

Ejemplo: wallpaper.png se carga desde el FS simulado y si no está obviamente no habrá fondo
Ejemplo2: Al iniciar Notroid en vez de ejecutar las funciones directas (como NotroidFS.init() o yo que se) necesitara "leer" archivos de inicialización
Ejepmlo3: Al borrar un .ttf que todo el HTML sea estilo "color: #00000000" (transparente) tipo "no hay fuente"

Resumen: hermano, que aburrido sería un Windows que cuando le eliminas "System32" no pase nada
Resumen legible:
"""
Un sistema de dependencias tipo System32 para que cada archivo tenga consecuencias reales cuando se borre
Un árbol de vida digital: cada archivo es una raíz del sistema, y si arrancas la raíz equivocada, todo el bosque Notroid colapsa
Un arranque script-driven: todo el OS depende archivos tipo boot.sh, y si se corrompen o se editan mal, Notroid se va alv desde el primer segundo
Un archivo tipo /Notroid/system/boot.sh y que el OS se configure leyendo línea por línea. Si alguien borra una línea, el OS pierde esa función
"""

Lema de "boot.sh":
"""Si dominas el boot.sh, dominas Notroid; si lo rompes, lo entierras"""
*/

/*
FLUJO PROPUESTO

/Notroid
 └── system
      ├── boot.sh                # Script maestro del arranque
      ├── drivers/
      │     ├── display.sh       # Configuración de pantalla
      │     ├── cursor.sh        # Cursor
      │     ├── keyboard.sh      # Teclado
      │     ├── audio.sh         # Sonido
      │     └── font.sh          # Cargar fuentes
      ├── desktop/
      │     └── launcher.sh      # Manejo del escritorio y apps
      ├── config.json            # Configs del usuario (theme, idioma, etc)
      ├── wallpaper.png          # Fondo de pantalla
      ├── fonts/
      │     └── main.ttf         # Fuente por defecto
      ├── cmd.sh                 # Intérprete para comandos extra
      └── sounds/
            └── startup.mp3      # Sonido de inicio

"SCRIPTS DE INICIALIZACIÓN" PROPUESTOS

# Boot principal de Notroid
LOAD /Notroid/system/config.json
EXEC /Notroid/system/drivers/display.sh
EXEC /Notroid/system/drivers/cursor.sh
EXEC /Notroid/system/drivers/keyboard.sh
EXEC /Notroid/system/drivers/font.sh
EXEC /Notroid/system/drivers/audio.sh
LOAD /Notroid/system/wallpaper.png
PLAY /Notroid/system/sounds/startup.mp3
EXEC /Notroid/system/desktop/launcher.sh

# Configura el display
SET_RESOLUTION 1920x1080
SET_THEME dark
ENABLE display

# Inicializa el mouse
ENABLE cursor
SET_CURSOR /Notroid/system/assets/cursor.png

# Detección de teclado
ENABLE keyboard
MAP_LAYOUT es-EC

# Fuente del sistema
LOAD_FONT /Notroid/system/fonts/main.ttf
SET_FONT main

# Inicia el escritorio
SET_WALLPAPER /Notroid/system/wallpaper.png
ENABLE desktop
LOAD_APPS /Notroid/apps/

# Driver de sonido
ENABLE audio
SET_VOLUME 70


*/