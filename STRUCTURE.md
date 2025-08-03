# Estructura de Notroid
```py (para resaltado bonito xdd)
📁 Notroid_2.0/
├── 📁 src/                      # Código fuente principal
│   ├── 📁 core/                 # Lógica del sistema operativo
│   │   ├── 📄 **actions.js**    # ¡El CORAZÓN de Notroid! (executeNotroid + acciones básicas)
│   │   ├── 📄 fs.js             # Filesystem simulado (¡el alma del proyecto!)
│   │   ├── 📄 apps.js           # Cargador/instalador de apps, INSTALL_APP()
│   │   ├── 📄 executeOS.js      # Ejecutador de comandos a nivel de OS
│   │   └── 📄 permissions.js    # Gestión de permisos (rwx, banan_access, etc.)
│   │
│   ├── 📁 ui/
│   │   ├── 📄 toasts.js         # SHOW_TOAST() (implementación real)
│   │   ├── 📄 navigation.js     # NAVIGATE_TO(), GO_BACK()
│   │   └── 📄 dialogs.js        # Alertas, permisos, etc
│   │
│   └── 📁 apps/                 # Apps del sistema (JSONs preinstalados)
│       ├── 📄 calculator.json   # App: Calculadora
│       ├── 📄 notes.json        # App: Bloc de Notas
│       └── 📄 hitleros.json     # App: HitlerOS Simulator (🛩🗼🔥)
│
├── 📁 assets/                   # Recursos estáticos
│   ├── 📁 icons/                # Íconos de apps
│   ├── 📁 sounds/               # Efectos de sonido (ej: BSOD.wav)
│   └── 📁 wallpapers/           # Fondos de pantalla épicos
│
├── 📄 not.html                  # Punto de entrada
├── 📄 main.js                   # Inicialización del OS
├── 📄 styles.css                # Estilos globales (antes static/main.css)
│
├── 📑 README.md                 # Documentación épica
├── 📑 CHANGELOG.md              # Historial de versiones (con humor)
├── 📑 NOTES.md                  # Notas para mi
├── 📑 STRUCTURE.md              # Estructura de archivos (este archivo w)
├── 📑 CONTRIBUTING.md           # Guía para contribuir (ej: "manda un toast")
└── 📑 TODO.md                   # Tareas pendientes (ej: "añadir BSOD() con sonido")
```