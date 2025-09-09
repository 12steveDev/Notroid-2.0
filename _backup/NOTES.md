-- NOTES.md --
## Flujo de Notroid
1. Cargar FS de localStorage o cargar el default
2. Llamar a la BIOS para simular chequeo de componentes (CPU, RAM, etc...)
3. Pasar control a "Notroid/system/bootmgr.nsh" (aka ejecutarlo)
4. BOOTMGR ejecuta "Notroid/system/notkrnl.nsh"
5. NOTKRNL ejecuta los drivers (Notroid/system/drivers/*.sys)
6. `display.sys` maneja el modo de video y resolución (ya hay video, yayyy)
7. ...
8. NOTKRNL ejecuta la app de escritorio "Notroid/launcher.napp" automaticamente (aka el `explorer.exe` de Windows)
9. NOTKRNL ejecuta una app de inicio, en este caso "Notroid/Apps/miapp.napp"

## Sistema de archivos inicial de Notroid PROPUESTA:
```js
"$": { // Raíz
    "Notroid": {
        "System": {
            // "Assets" de sistema
        },
        "System64": {
            // Archivos de sistema
            "drivers": {
                // Drivers (ej: video o audio)
            }
        },
        "Apps": {
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
"miapp.napp": {
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
            onDestroy: ["SHOW_TOAST", "Cerrando..."]
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
        fullscreen: false,     // No Toolbar
        maximized: false,
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
`CLOSE_APP`: Cierra la app
`LOG`: Imprime en consola
`SET_TEXT <id> <text>`: Cambia el `textContent` de un elemento con el `id` especificado
`SET_ENV <env> <text>`: Crea o modifica una variable de entorno
`LOAD_FILE <fname> <env>`: Carga el contenido de archivo a una variable de entorno. ¡Si es posible, parsea a JSON! (objeto válido)
`APPEND_CHILD <id> <elemJson>`: Crea y añade un elemento dentro de otro elemento con el `id` especificado
[!] `INSTALL_APP <json>`: Instala una app en "Notroid/system/apps"
...

## Comandos (NotShell):
> Sintaxis: OP args...
> "(admin)": Necesita ejecutarse como **admin**
> "(proc)": Es un proceso, guarda el resultado en la variable `__lastResult` si salió todo bien, y si no se activará la `__errorFlag` y `__lastResult` tendrá detalles del error.
- `LOG <msg>`: Imprime en consola (`console.log()`)
- `ECHO <msg>`: Imprime en terminal, la gráfica (solo funciona si `Notroid.state["videoMode"] === "text"`)
- `EXEC <filePath>`: Ejecuta un archivo con NotShell (`Notroid.executeNotShell()`)
- `ONERROR <cmds...>`: Ejecuta esa línea si la `errorFlag` está activada
- `BSOD <msg>`: (**admin**) Lanza un *BSOD* con un mensaje (`Notroid.BSOD()`)
- `VIDEOMODE <videoMode>`: (**admin**) Cambia el modo de video. Solo hay `text` y `graphic`.
- `RESOLUTION <width>-<height>`: (**admin**) Ajusta la resolución de la pantalla en formato CSS (`1024px`, `100%`, etc...). Solo funciona si `Notroid.state["videoMode"] === "graphic"`, no sabemos que hace windows cuando es en modo `text` XD
- `RUNAPP`: Ejecuta una app con su JSON puro. Si quieres ejecutar una app desde su archivo, ejecuta un `READ` antes y usa `__lastResult` para obtener su JSON
- `CLOSEAPP`: Ejecuta todo el orden de cierre de la app (ejecutando su `onDestroy`) y mata su proceso
- `KILL`: Mata un proceso al instante
- `READ`: (**proc**) Lee un archivo
...

## Elementos:
- `text`: Un texto, parrafo
- `button`: Un botón tocable (obvio wtf)
- `img`: Una imagen
- `list`: Una lista

### Atributos:
- `type`: Tipo de elemento (arriba)
- `text`: Contenido de texto
- `color`: Color de texto
- `action`: Acción que ejecutará al ser tocado
- `id`: ID encapsulada en ese PID (formato `nid-win_{pid}-{id}`)
- `background`: Color de fondo
- `width`: Ancho del elemento
- `height`: Alto del elemento
- `src`: *Source* del elemento, más usado en `img`
- `format`: Formato de lista, más usado en `img`. Puede ser `grid`... na' más

## Dudas:
- Las *actions* (las que se ejecutan de apps) deberían poder ejecutar comandos *NotShell* con tipo `EXEC_NOTSHELL <expr>` o ya mucho poder??
- Para cosas persistentes, ¿Debería haber un comando tipo `SAVE_ENV` que guarde en `localStorage`? **oo**, ¿Crear archivos usando `WRITE`(no existe todavía) para datos persistentes aprovechando que hay FileSystem? 🗿✅
- ¿Cómo hacemos que de alguna manera `launcher.napp` pueda mostrar y listar todas las apps como buen launcher? ¿Acaso con comandos `["FOR_EACH", ...]`, `["LIST", "Notroid/Apps", ".napp"]`, `["APPEND_CHILD", "miLista", ...]` y elementos tipo `{type: "list", id: "miLista", format: "grid", columns: 4, width: "100%", height: "100%"}` o algo así?

## Reglas en código (las necesito)
1. Los argumentos de las OPs (NotShell) o ACTIONS deben de ser valores directos. Ninguna podrá leer archivos, de eso se encargará el script leyendo un archivo y ejecutando la acción con `__lastResult` (el archivo leído). Ejemplo: `EXEC Notroid/init.nsh` ==> `READ Notroid/init.nsh\nEXEC ${__lastResult}`
2. TODOS los argumentos deben haber pasado por "resolveValue"
3. Los argumentos al llamar a funciones (ej `Notroid.createProcess()`) deben ser directos, nada de `valor || []`, eso **se encargará el método**.

```py
"""
{
  "screens": {
    "Desktop": [
      {
        "type": "list", 
        "id": "appsList",
        "format": "grid",
        "columns": 4,
        "action": ["NAVIGATE_TO", "AppDetails"]
      }
    ],
    "AppDetails": [
      {"type": "text", "id": "appTitle"},
      {"type": "button", "text": "Abrir", "action": ["EXEC", "RUNAPP ${__lastResult}"]}
    ]
  },
  "main": {
    "onCreate": [
      ["LIST", "Notroid/Apps .napp"],
      ["FOR_EACH", "${__lastResult}", ["APPEND_CHILD", "appsList", 
        {"type": "button", "text": "${item}", "action": ["READ", "Notroid/Apps/${item}"], ["NAVIGATE_TO", "AppDetails"]}
      ]]
    ]
  }
}
"""
```