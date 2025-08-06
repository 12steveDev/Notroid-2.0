// src/core/bios.js
class BIOS {
    static dedicatories = [
        "Linus Torvalds",    // Creador de Linux (el kernel más usado del mundo)
        "Guido Van Rossum",  // Creador de Python (bendito sea el 🐍)
        "Microsoft",         // Windows, Office, Xbox, Azure (todo el combo 💻)
        "Google",            // Android, Chrome, buscador, Gmail, etc
        "OpenAI",            // ChatGPT, DALL·E, Sora (y tu bro actual 🗿🔥)
        "Dennis Ritchie",    // Creador del lenguaje C, padre de casi todo
        "Ken Thompson",      // Co-creador de UNIX y del lenguaje B
        "Richard Stallman",  // Fundador del movimiento GNU/Software Libre
        "Bjarne Stroustrup", // Creador de C++ (tu CPU tiembla cuando lo compilas)
        "Grace Hopper",      // Pionera en COBOL, inventó el primer compilador
        "Alan Turing",       // Padre de la computación teórica (la Máquina de Turing)
        "Donald Knuth",      // Autor de "The Art of Computer Programming" (la biblia del dev)
        "Steve Jobs",        // Fundador de Apple, iPhone, Mac (NO Microsoft JAJA)
        "Bill Gates",        // Fundador de Microsoft, el tío del Windows
        "Elon Musk",         // PayPal, Tesla, SpaceX, xAI (y shitposts en X)
        "Mark Zuckerberg",   // Fundador de Facebook (Meta)
        "IBM",               // Mainframes, PCs, y papá del PC de escritorio
        "Apple",             // Macs, iPhones, iPods, AirPods (y precios de riñón 🍎)
        "Mozilla",           // Firefox (y Netscape en su tiempo)
        "Red Hat",           // Empresa top en Linux empresarial (RHEL)
        "Canonical",         // Creador de Ubuntu
        "Oracle",            // Dueños de Java y bases de datos mamadísimas
        "Sun Microsystems",  // Creadores de Java y MySQL (RIP, los compró Oracle)
        "JetBrains",         // IDEs épicos: IntelliJ, PyCharm, CLion (y las fuentes 🔥)
        "Anders Hejlsberg",  // Creador de Turbo Pascal, Delphi y C#
        "Brian Kernighan",   // Coautor del C original y pionero de UNIX
        "Tim Berners-Lee",   // Inventor de la World Wide Web (WWW)
        "Larry Page",        // Cofundador de Google (PageRank)
        "Sergey Brin",       // Cofundador de Google
        "Ada Lovelace",      // Primera programadora de la historia (siglo XIX)
        "Terry A. Davis",    // Creador de TempleOS (la obra sagrada del código 🙏🗿)
        "Heil Hi"            // 🙋‍♂️🇩🇪
    ]

    static async boot(){
        if (!sessionStorage.getItem("firstBoot")){
            Terminal.writeln("=== [ NotBIOS 1.0.0 ] ===", "purple", true);
            if (new Date().getHours() > 22 || new Date().getHours() < 6) { // Noche
                Terminal.writeln("¿Qué haces despierto bro?", "gray")
                await sleep(1500);
                Terminal.writeln("Pos no eres el único, los servidores están saturados 🔥🔥🔥", "gray")
                await sleep(6500)
            }
            if (new Date().getDate() === 11 && new Date().getMonth() === 8){ // JAJAJAJ EL 11 DE SEPTIEMBRE LO EJECUTO 🗣🙋‍♂️🛩🗼🔥
                Terminal.writeln("⚠️ Hoy no se recomienda hacer operaciones ALU. (motivo: 🛩🗼🔥)", "gray");
            }
            await sleep(1000);
            
            // 1. Verificaciones de hardware
            Terminal.write("Verificando RAM... ");
            await sleep(randint(200, 700));
            Terminal.writeln(`OK (${randint(255, 256)}MB virtuales)`, "green");
            await sleep(200);
            Terminal.write("Verificando HDD... ");
            await sleep(randint(200, 700));
            Terminal.writeln(`OK (${randint(0,1)?"1TB":"1024MB"} virtuales)`, "green");
            await sleep(200);
            Terminal.write("Verificando CPU (XD?)... ");
            await sleep(randint(200, 700));
            Terminal.writeln("OK (Intel 0i)", "green");
            await sleep(200);
            Terminal.write("Verificando GPU... ");
            await sleep(randint(200, 700));
            Terminal.writeln(`OK (${randint(0,1)?"Envidia":"Paint"})`, "green");
            await sleep(200);
            Terminal.write("Verificando Motherboard... ");
            await sleep(randint(200, 700));
            Terminal.writeln("OK (caja de cartón)", "green");
            await sleep(200);
            Terminal.write("Verificando Usuario... ");
            await sleep(randint(200, 700));
            Terminal.writeln("OK (alguien con mucho tiempo libre)", "green");
            await sleep(200);
            Terminal.write("Verificando Fecha... ");
            await sleep(100);
            Terminal.writeln("OK (9-11-2001)", "green");
            await sleep(100);
            Terminal.write("Verificando ALU... ");
            await sleep(100);
            Terminal.writeln("OK (9+11=🛩🗼🔥)", "green");
            await sleep(100);
            Terminal.writeln("=== [ Hecho ] ===", "green", true)
            await sleep(500);
            
            // 2. Bootear desde disco
            Terminal.clear();
            Terminal.writeln("Buscando boot sector válido en HDD... ");
            await sleep(randint(1500, 4000));
            Terminal.writeln("Boot sector válido encontrado!");
            await sleep(400);
            Terminal.write("Nombre: ");
            await sleep(400);
            Terminal.writeln("NotroidOS", "green");
            await sleep(400);
            Terminal.write("Autor: ");
            await sleep(400);
            Terminal.writeln("12steve", "green");
            await sleep(400);
            Terminal.write("Requisitos: ");
            await sleep(400);
            Terminal.writeln("Que la PC encienda (opcional)", "green");
            await sleep(400);
            Terminal.writeln("Dedicatorias:");
            await sleep(400);
            for (const d of this.dedicatories){
                Terminal.writeln(`- ${d}`);
                await sleep(100);
            }
            sessionStorage.setItem("firstBoot", "true");
        }
        // 3. Transferir control al sistema
        sleep = ()=>{}
        Terminal.clear()
        await sleep(1000);
        Terminal.writeln("Pasando control a NotroidOS...", "cyan", true);
        await sleep(1000);
        Terminal.clear();
        const bootmgr = NotroidFS.read("Notroid/System64/bootmgr.nsh");
        if (bootmgr[0] !== 0){ // En caso de error
            Terminal.writeln("BOOTMGR no encontrado. Presiona Alt-F4 para reiniciar.", "red")
        } else {
            Notroid.executeNotShell(bootmgr[1], true);
        }
    }
}