// src/ui/windows.js
Notroid.createWindowObj = function(appObj){
    // Ventana base
    const wdw = document.createElement("div");
    wdw.classList.add("window", "minimizedxd");
    // Encabezado
    if (!appObj.window?.fullscreen){
        const header = document.createElement("div");
        header.classList.add("header");
        // Titulo
        const pTitle = document.createElement("p");
        pTitle.textContent = appObj.main?.title || "";
        // Controles
        const btnMinimize = document.createElement("button");
        btnMinimize.textContent = "─";
        const btnMaximize = document.createElement("button");
        btnMaximize.textContent = "◻";
        btnMaximize.onclick = () => wdw.classList.contains("maximized") ? wdw.classList.remove("maximized") : wdw.classList.add("maximized")
        const btnClose = document.createElement("button");
        btnClose.textContent = "✕";
        btnClose.onclick = ()=>{
            wdw.classList.add("minimized");
            setTimeout(()=>wdw.remove(), 300);
        }
        header.appendChild(pTitle);
        header.appendChild(btnMinimize);
        header.appendChild(btnMaximize);
        header.appendChild(btnClose);
        wdw.appendChild(header);
    } else {
        wdw.classList.add("fullscreen")
    }
    // Unir todo
    $("#vga").appendChild(wdw);
    return wdw;
}