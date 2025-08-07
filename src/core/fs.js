// scr/core/fs.js
let savedFS = localStorage.getItem("NotroidFS");
const defaultFS = {
    "$": { // Raíz
        "Notroid": {
            "System": {
                "launcher.png": ['data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="skyblue"/><circle cx="100" cy="100" r="80" fill="red"/></svg>',  { created: new Date().toISOString(), modified: new Date().toISOString() }]
            },
            "System64": {
                "bootmgr.nsh": ["ECHO bootmgr cargado\nLOG [OS] BOOTMGR inicializado\nREAD Notroid/System64/notkrnl.nsh\nONERROR BSOD Error: No se pudo iniciar Notroid. Falta el archivo /Notroid/System64/notkrnl.nsh\nEXEC ${__lastResult}", { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "notkrnl.nsh": ["LOG [OS] NOTKRNL inicializado\nREAD Notroid/System64/drivers/display.sys\nEXEC ${__lastResult}\nREAD Notroid/launcher.napp\nRUNAPP ${__lastResult}\nREAD Notroid/Apps/miapp.napp\nRUNAPP ${__lastResult}\nONERROR LOG Error al cargar app de inicio: ${__lastResult}", { created: new Date().toISOString(), modified: new Date().toISOString() }],
                "drivers": {
                    "display.sys": ["LOG [OS] DISPLAY inicializado\n// Cambiar modo de video a gráfico\nVIDEOMODE graphic\nRESOLUTION 100%-100%", { created: new Date().toISOString(), modified: new Date().toISOString() }]
                },
            },
            "Apps": {
                "miapp.napp": [JSON.stringify({
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
                            onCreate: ["LOG", "Bienvenido, ${name}"],
                            onDestroy: ["LOG", "Cerrando..."]
                        },
                        env: {
                            "name": "12steve"
                        }
                    },
                    window: {
                        x: "25px",
                        y: "25px",
                        width: "400px",
                        height: "200px",
                        draggable: true,
                        resizable: true,
                        fullscreen: false,
                        maximized: false,
                        controls: true
                    },
                    screens: {
                        "MAIN": [
                            {type: "text", id: "texto", text: "Hola Mundo"},
                            {type: "button", id: "miboton", background: "#f00", text: "Jejeje", action: [["SHOW_TOAST", "Hola Podre"], ["SHOW_TOAST", "Hola Rico jaja"], ["CLOSE_APP"]]},
                            {type: "button", text: "Detalles", action: ["NAVIGATE_TO", "Details"]}
                        ],
                        "Details": [
                            {type: "text", text: "Detalles..."},
                            {type: "button", text: "...", action: ["SHOW_TOAST", "Has sido un gran explorador, pequeño bro 🗿🔥 (${name})"]}
                        ]
                    }
                }), { created: new Date().toISOString(), modified: new Date().toISOString() }],
            },
            "launcher.napp": [JSON.stringify({
                manifest: {
                    id: "miapp",
                    name: "Mi App",
                    icon: "https://placehold.co/150x150/008080/FFFFFF?text=Hola\\nMundo",
                    categories: [],
                    permissions: []
                },
                main: {
                    entry: "Desktop",
                    title: "Notroid Desktop", // Esto no se ve
                    functions: {},
                    lifecycle: {
                        onCreate: [],
                        onDestroy: []
                    },
                    env: {}
                },
                window: {
                    x: "0",
                    y: "0",
                    width: "20px",
                    height: "100px",
                    draggable: false,
                    resizable: true,
                    fullscreen: true,
                    maximized: true,
                    controls: false
                },
                screens: {
                    "Desktop": [
                        {type: "img", width: "100%", height: "100%", src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="skyblue"/><circle cx="100" cy="100" r="80" fill="red"/></svg>'}
                    ]
                }
            }), { created: new Date().toISOString(), modified: new Date().toISOString() }]
        },
        "home": {
            "user": {
                "documents": {},
                "downloads": {},
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