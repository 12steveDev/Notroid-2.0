// src/ui/windows.js
Notroid.createWindowObj = function(appObj, pid){
    // Ventana base
    const wdw = document.createElement("div");
    wdw.id = `win_${pid}`;
    wdw.style.left = appObj.window?.x || "30px";
    wdw.style.top = appObj.window?.y || "30px";
    wdw.style.width = appObj.window?.width || "150px";
    wdw.style.height = appObj.window?.height || "50px";
    wdw.classList.add("window", "minimized");
    if (appObj.window?.maximized) wdw.classList.add("maximized");
    // Encabezado
    if (!appObj.window?.fullscreen){
        const header = document.createElement("div");
        header.classList.add("header");
        // Ícono
        const icon = document.createElement("img");
        icon.src = appObj.manifest?.icon || "";
        // Titulo
        const pTitle = document.createElement("p");
        pTitle.textContent = appObj.main?.title || appObj.manifest.id;
        // Controles
        const btnMinimize = document.createElement("button");
        btnMinimize.textContent = "─";
        const btnMaximize = document.createElement("button");
        btnMaximize.textContent = "◻";
        btnMaximize.onclick = () => wdw.classList.toggle("maximized");
        const btnClose = document.createElement("button");
        btnClose.textContent = "✕";
        btnClose.onclick = ()=>{
            Notroid.executeNotShell(`CLOSEAPP ${pid}`);
        }
        header.appendChild(icon);
        header.appendChild(pTitle);
        header.appendChild(btnMinimize);
        header.appendChild(btnMaximize);
        header.appendChild(btnClose);
        wdw.appendChild(header);
        // Dragging
        if (appObj.window?.draggable){
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;
            function dragStart(e){
                isDragging = true;
                offsetX = e.clientX - wdw.offsetLeft;
                offsetY = e.clientY - wdw.offsetTop;
            }
            function dragMove(e){
                if (!isDragging) return;
                wdw.style.left = (e.clientX - offsetX) + "px";
                wdw.style.top = (e.clientY - offsetY) + "px";
            }
            function dragEnd(e){
                isDragging = false;
            }
            header.addEventListener("mousedown", (e)=>dragStart(e));
            header.addEventListener("touchstart", (e)=>dragStart(e.touches[0]));
            document.addEventListener("mousemove", (e)=>dragMove(e));
            document.addEventListener("touchmove", (e)=>dragMove(e.touches[0]));
            document.addEventListener("mouseup", (e)=>dragEnd(e));
            document.addEventListener("touchend", (e)=>dragEnd(e.touches[0]));
        }
    } else {
        wdw.classList.add("fullscreen");
    }
    // Contenido
    const content = document.createElement("div");
    content.classList.add("content");
    for (const screenId of Object.keys(appObj.screens)){
        const screen = document.createElement("div");
        screen.classList.add("screen", "hide");
        screen.setAttribute("data-screen", screenId);
        for (const elemObj of appObj.screens[screenId]){
            let elem;
            switch (elemObj.type){
                case "text":
                    elem = document.createElement("p");
                    break;
                case "button":
                    elem = document.createElement("button");
                    break;
                case "img":
                    elem = document.createElement("img");
                    break;
                default:
                    elem = document.createElement("p");
                    elem.textContent = `[elemento desconocido: ${elemObj.type}]`;
                    screen.appendChild(elem);
                    continue;
            }
            elem.textContent = Notroid.resolveValue(elemObj.text || "", appObj.main?.env || {});
            if (elemObj.id) elem.id = `nid-win_${pid}-${elemObj.id}`; // IDs separadas por PID papá
            if (elemObj.action) elem.onclick = () => Notroid.executeNotroid(pid, elemObj.action);
            if (elemObj.width) elem.style.width = elemObj.width;
            if (elemObj.height) elem.style.height = elemObj.height;
            if (elemObj.color) elem.style.color = elemObj.color;
            if (elemObj.background) elem.style.background = elemObj.background;
            if (elemObj.src) elem.src = elemObj.src;
            screen.appendChild(elem);
        }
        content.appendChild(screen);
    }
    wdw.appendChild(content);
    $("#vga").appendChild(wdw);
    wdw.classList.remove("minimized");
    Notroid.navigateTo(pid, appObj.main?.entry || "MAIN");
    return wdw;
}
Notroid.navigateTo = function(pid, screenId){
    console.log(`[navigateTo] PID: ${pid} | ScreenId: ${screenId}`);
    if (!Notroid._setResult(Notroid.getProcess(pid))) return;
    const wdw = Notroid.lastResult[1];
    $$(".screen", wdw).forEach((screen)=>{
        if (screen.getAttribute("data-screen") === screenId){
            screen.classList.remove("hide");
        } else {
            screen.classList.add("hide");
        }
    })
}
Notroid.getElemById = function(pid, id){
    if (!Notroid._setResult(Notroid.getProcess(pid))) return;
    const wdw = Notroid.lastResult[1];
    return $(`nid-win_${pid}-${id}`);
}