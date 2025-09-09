# Estructura de Notroid
```py (para resaltado bonito xdd)
📁 Notroid_2.0/
├── 📁 src/                      # Código fuente principal
│   ├── 📁 core/                 # Lógica del sistema operativo
│   │   ├── 🔗 notroid.js        # El OS. Creación de procesos, ejecuciones NotShell y ACTIONS (executeNotroid())
│   │   ├── 🔗 fs.js             # Filesystem simulado (¡el alma del proyecto!)
│   │   ├── 🔗 terminal.js       # Terminal antes de modo VGA
│   │   └── 🔗 bios.js           # El startup de Notroid
│   │
│   ├── 📁 ui/
│   │   └── 🔗 windows.js        # Expande la clase Notroid con método ".createWindowObj"
│   │
│   ├── 📁 utils/                # Utiles globales
│   │   └── 🔗 utils.js          # $() , $$() , sleep()
│   │
│   ├── 🔗 main.js               # Inicialización del OS (llama a la BIOS)
│   ├── ✨ styles.css            # Estilos globales
│   └── ✨ windows.css           # Estilos de ventanas
│
├── 📁 assets/                   # Recursos estáticos
│   ├── 📁 fonts/                # Fuentes de texto
│   │   └── 🅰 ibm_vga8x16.ttf   # Fuente BIOS
│   │
│   ├── 📁 icons/                # Íconos de apps
│   └── 📁 sounds/               # Efectos de sonido (ej: BSOD.wav)
│
├── 🌍 not.html                  # Punto de entrada
│
├── ⬇ README.md                 # Documentación épica
├── ⬇ CHANGELOG.md              # Historial de versiones (con humor)
├── ⬇ NOTES.md                  # Notas para mi
└── ⬇ STRUCTURE.md              # Estructura de archivos (este archivo w)
```