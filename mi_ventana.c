// ventana.c
#include <windows.h> // Toda la WinAPI vive aquí

// -------------------- WndProc: el "callback" que recibe los mensajes --------------------
LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    switch (msg)
    {
    case WM_DESTROY:
        // PostQuitMessage pide al loop de mensajes que termine.
        // El argumento 0 es el código de salida que se devolverá como msg.wParam.
        PostQuitMessage(0);
        return 0; // devolvemos 0 indicando que manejamos el mensaje

    // Si quieres dibujar: maneja WM_PAINT aquí (ej. BeginPaint/EndPaint)
    default:
        // Si no manejamos el mensaje, devolvemos lo que DefWindowProc diga.
        // DefWindowProc realiza el comportamiento por defecto de Windows.
        return DefWindowProc(hwnd, msg, wParam, lParam);
    }
}

// -------------------- WinMain: punto de entrada para aplicaciones Windows --------------------
int WINAPI WinMain(HINSTANCE hInstance,        // handle a esta instancia del programa
                   HINSTANCE hPrevInstance,    // siempre NULL en Win32 moderno (obsoleto)
                   LPSTR lpCmdLine,            // línea de comandos en ANSI (char*)
                   int nCmdShow)               // flag que indica cómo mostrar la ventana
{
    // ----- 1) Registramos una "clase" de ventana -----
    WNDCLASSEXA wc;              // estructura que describe la clase de ventana (ANSI)
    ZeroMemory(&wc, sizeof(wc)); // ponemos todo a 0 para evitar basura
    wc.cbSize = sizeof(WNDCLASSEXA);
    wc.style = CS_HREDRAW | CS_VREDRAW;
    // lpfnWndProc: puntero a la función que manejará los mensajes (nuestro WndProc)
    wc.lpfnWndProc = WndProc;
    wc.cbClsExtra = 0;          // bytes extra para la clase (normalmente 0)
    wc.cbWndExtra = 0;          // bytes extra por ventana (normalmente 0)
    wc.hInstance = hInstance;   // instancia del ejecutable (se pasa a WinMain)
    // Icono grande: NULL y IDI_APPLICATION -> icono por defecto del sistema
    wc.hIcon = LoadIconA(NULL, IDI_APPLICATION);
    // Cursor por defecto (flecha)
    wc.hCursor = LoadCursorA(NULL, IDC_ARROW);
    // Color de fondo: COLOR_WINDOW+1 -> blanco del sistema (cast a HBRUSH)
    wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.lpszMenuName = NULL;     // sin menú
    wc.lpszClassName = "MiClaseVentana"; // nombre de la clase (ANSI string)
    // Icono pequeño (en la barra de título)
    wc.hIconSm = LoadIconA(NULL, IDI_APPLICATION);

    // RegisterClassExA recibe un puntero a la estructura WNDCLASSEX (ANSI)
    ATOM a = RegisterClassExA(&wc);
    if (a == 0) {
        // MessageBoxA: (hwndOwner, texto, título, flags)
        MessageBoxA(NULL, "Fallo al registrar la clase de ventana", "Error", MB_ICONERROR);
        return 0;
    }

    // ----- 2) Creamos la ventana -----
    HWND hwnd = CreateWindowExA(
        0,                      // DWORD dwExStyle -> estilos extendidos (0 = ninguno)
        wc.lpszClassName,       // LPCSTR lpClassName -> nombre de la clase registrada
        "Mi Ventana Pobre Weon", // LPCSTR lpWindowName -> texto del título de la ventana
        WS_OVERLAPPEDWINDOW,    // DWORD dwStyle -> estilo de ventana (borda, barra, etc.)
        CW_USEDEFAULT,          // int X -> posición X inicial (CW_USEDEFAULT = deja al SO elegir)
        CW_USEDEFAULT,          // int Y -> posición Y inicial
        800,                    // int nWidth -> ancho en píxeles
        600,                    // int nHeight -> alto en píxeles
        NULL,                   // HWND hWndParent -> ventana padre (NULL = ventana independiente)
        NULL,                   // HMENU hMenu -> handle a menú o id child (NULL = sin menú)
        hInstance,              // HINSTANCE hInstance -> handle a la instancia (igual que en WinMain)
        NULL                    // LPVOID lpParam -> parámetro adicional pasado a WM_CREATE (NULL si no se usa)
    );

    if (hwnd == NULL) {
        MessageBoxA(NULL, "Fallo CreateWindowEx", "Error", MB_ICONERROR);
        return 0;
    }

    // ----- 3) Mostrar y actualizar la ventana -----
    ShowWindow(hwnd, nCmdShow); // muestra la ventana. nCmdShow viene de WinMain (por ejemplo SW_SHOWDEFAULT)
    UpdateWindow(hwnd);         // fuerza WM_PAINT inmediato (si hay que pintar)

    // ----- 4) Loop de mensajes -----
    MSG msg;
    // GetMessageA(&msg, hwndFilter, wMsgFilterMin, wMsgFilterMax)
    // - primer arg: puntero a MSG que llenará GetMessage
    // - segundo arg: HWND para filtrar mensajes de UNA ventana (NULL = todas las del hilo)
    // - tercero/cuarto: rango de mensajes a filtrar (0,0 = todos)
    while (GetMessageA(&msg, NULL, 0, 0) > 0) {
        TranslateMessage(&msg);  // traduce teclas virtuales a caracteres (ej: WM_KEYDOWN -> WM_CHAR)
        DispatchMessageA(&msg);   // pasa el MSG al WndProc (o a DefWindowProc si no hay WndProc)
    }

    // Cuando GetMessage devuelve 0 -> se recibió WM_QUIT. msg.wParam contiene el código de salida.
    return (int) msg.wParam;
}
