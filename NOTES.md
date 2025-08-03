-- NOTES.md --
## Flujo de Notroid
1. Cargar FS de localStorage o cargar el default (`src/core/fs.js`, `NotroidFS`)
2. Cargar apps de "src/apps/*.json" al FileSystem ficticio de Notroid en "apps" (y crear la carpeta si es necesario) (`src/core/apps.js`, `loadApps`)
- 2.2. Solo cargar esas apps "pre-hechas" si no hay ninguna app
3. 

## Sistema de archivos inicial de Notroid PROPUESTA:
```js
"$": { // Raíz
    "Notroid": {
        "system": {
            "config.json": [content, {metadata}]
        },
        "apps": {}
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

### OJO CON ESTO:
Si queremos añadir permisos a los archivos o añadirle metadatos (fecha de creación, tamaño, etc) tendremos dos opciones:
1. Separar el archivo y los metadatos con un caracter unicode raro
2. hacer los archivos un Array en el que "file[0]" sea el contenido y "file[1]" sea un Objeto con los metadatos

## Estructura de app Notroid
```js
"MiApp": {
    manifest: {
        id: "MiApp",
        name: "Mi App",
        icon: "https://placehold.co/150x150/008080/FFFFFF?text=Hola\\nMundo",
        categories: [],
        permissions: []
    },
    main: {
        entry: "MAIN",
        toolbarTitle: "Épico, ¿Verdad?",
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

## Acciones:
`SHOW_TOAST <text>`
`NAVIGATE_TO <screen>`
...

## Elementos:
- `text`: Un texto, parrafo
- `button`: Un botón tocable

### Atributos:
- `type`: El tipo de elemento (arriba)
- `text`: El contenido de texto
- `action`: Acción que ejecutará al ser tocado

## Dudas:
- ¿Cómo se cargarán las apps? ¿Desde el .json real de Notroid o esos .json se cargan al FS fictisio de Notroid y de ahí se cargan?
