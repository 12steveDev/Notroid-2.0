-- NOTES.md --
## Flujo de Notroid
1. Cargar FS de localStorage o cargar el default
2. Llamar a la BIOS para simular chequeo de componentes (CPU, RAM, etc...)
3. Pasar control a "Notroid/system/bootmgr.nsh" (aka ejecutarlo)
4. BOOTMGR ejecuta "Notroid/system/notkrnl.nsh"
5. NOTKRNL ejecuta los drivers (Notroid/system/drivers/*.nsh)
- - display.nsh maneja el modo de video y resolución (ya hay video, yayyy)

## Sistema de archivos inicial de Notroid PROPUESTA:
```js
"$": { // Raíz
    "Notroid": {
        "system": {
            // Archivos de sistema
            "drivers": {
                // Drivers (ej: video o audio)
            }
        },
        "apps": {
            // JSONs de apps
        }
    },
    "home": {
        "user": {
            "documents": {},
            "downloads": {}
        }
    }
}
```
### "Tipos de elementos del FS":
- Carpeta: Un Objeto (`{}`)
- Archivo: Un Array  (`[content, {metadata}]`)

## Estructura de app Notroid
```js
"miapp": {
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
}
```
---

> Lo que tenga "[!]" es que no está implementado

## Acciones (actions):
> Sintaxis: ["OP", "args..."] o ["OP", ["OP", "args..."]] (array format 🔥)
`SHOW_TOAST <text>`: Muestra un Toast (gráfico)
`NAVIGATE_TO <screen>`: Navega a otra pantalla
[!] `INSTALL_APP <json>`: Instala una app en "Notroid/system/apps"
...

## Comandos (NotShell):
> Sintaxis: OP args...
`LOG <msg>`: Imprime en consola (`console.log()`)
`ECHO <msg>`: Imprime en terminal, la gráfica (solo funciona si `Notroid.state["videoMode"] === "text"`)
`EXEC <filePath>`: Ejecuta un archivo con NotShell (`Notroid.executeNotShell()`)
`ONERROR <cmds...>`: Ejecuta esa línea si la `errorFlag` está activada
`BSOD <msg>`: (**admin**) Lanza un *BSOD* con un mensaje (`Notroid.BSOD()`)
`VIDEOMODE <videoMode>`: (**admin**) Cambia el modo de video. Solo hay `text` y `graphic`.
`RESOLUTION <width>-<height>`: (**admin**) Ajusta la resolución de la pantalla en formato CSS (`1024px`, `100%`, etc...). Solo funciona si `Notroid.state["videoMode"] === "graphic"`, no sabemos que hace windows cuando es en modo `text` XD
...

## Elementos:
- `text`: Un texto, parrafo
- `button`: Un botón tocable (obvio wtf)

### Atributos:
- `type`: El tipo de elemento (arriba)
- `text`: El contenido de texto
- `action`: Acción que ejecutará al ser tocado
