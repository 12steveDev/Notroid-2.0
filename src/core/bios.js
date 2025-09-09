// src/core/bios.js
class BIOS {
    static async boot(){
        // == Simula el booteo de la PC, osea, la BIOS == //
        if (!sessionStorage.getItem("isFirstBoot")){ // ¿Es la primera vez que el usuario bootea en esta sesión?
            await sleep(200);
            Terminal.writeln("Notroid BIOS Version 9.11 (C) 2001", "fuchsia");
            await sleep(200);
            Terminal.writeln("CPU: Intel(R) Pentium(R) 4 CPU 2.40GHz");
            await sleep(200);
            Terminal.write("Memory Testing: 0");
            await sleep(400);
            // Memory Testing como promesa
            await new Promise((resolve)=>{
                let mem = 0;
                let interval = setInterval(()=>{
                    mem += 1024; // 1MB
                    if (mem < 524288){
                        Terminal.overwrite(`Memory Testing: ${mem}K`);
                    } else {
                        Terminal.overwriteln(`Memory Testing: ${mem}K OK`, "lime");
                        clearInterval(interval);
                        resolve();
                    }
                }, 5);
            });
            await sleep(400);
            Terminal.writeln("IDE Channel 0 Master:  ST38001A 80.0GB");
            await sleep(200);
            Terminal.writeln("IDE Channel 0 Slave:   None");
            await sleep(200);
            Terminal.writeln("IDE Channel 1 Master:  HL-DT-ST DVDRAM GSA-4167B");
            await sleep(200);
            Terminal.writeln("IDE Channel 1 Slave:   None");
            await sleep(200);
            Terminal.writeln("USB Controllers Initialized. 2 Devices Found");
            await sleep(200);
            Terminal.write("Detecting Primary Master...");
            await sleep(100);
            Terminal.writeln("    ST380011A", "gray");
            await sleep(100);
            Terminal.write("Detecting Primary Slave...");
            await sleep(100);
            Terminal.writeln("     None", "gray");
            await sleep(100);
            Terminal.write("Detecting Secondary Master...");
            await sleep(100);
            Terminal.writeln("  HL-DT-ST DVDRAM GSA-4167B", "gray");
            await sleep(100);
            Terminal.write("Detecting Secondary Slave...");
            await sleep(100);
            Terminal.writeln("   None", "gray");
            await sleep(400);

            // Setup Menu y Boot Menu
            Terminal.writeln("")
            Terminal.writeln("Press DEL to enter SETUP, F12 for Boot Menu...");
            await sleep(1500);
            Terminal.clear();
            await sleep(500);

            // Buscar dispositio booteable
            Terminal.writeln("Verifying DMI Pool Data...");
            await sleep(500);
            Terminal.clear();
            await sleep(250);
            Terminal.write("Booting from CD... <cursor>");
            await sleep(1500);
            Terminal.overwriteln("Booting from CD:", "red");
            await sleep(500);
            Terminal.write("Booting from Hard Disk... <cursor>");
            await sleep(1500);
            Terminal.overwriteln("Booting from Hard Disk...");
            await sleep(500);
            Terminal.write("Reading Boot Sector from Drive 80h... <cursor>");
            await sleep(1500);
            Terminal.overwriteln("Reading Boot Sector from Drive 80h...");
            await sleep(500);
            Terminal.write("Jumping to Bootloader @ 0x7C00... <cursor>", "aqua");
            await sleep(1500);
            sessionStorage.setItem("isFirstBoot", "true");
        }
        Terminal.clear();
        await sleep(200);
        cpu.run();
    }
}

`idea
[00.2s] [nombre] BIOS Version 1.23 (C) [año] [nombre]
[00.3s] CPU: Intel(R) Pentium(R) 4 CPU 2.40GHz
[00.5s] Memory Testing:  524288K OK
[00.7s] IDE Channel 0 Master: ST380011A 80.0GB
[00.9s] IDE Channel 0 Slave:   None
[01.1s] IDE Channel 1 Master: HL-DT-ST DVDRAM GSA-4167B
[01.3s] IDE Channel 1 Slave:   None
[01.5s] USB Controllers Initialized. 2 Devices Found
[01.6s] Detecting Primary Master...
[01.8s]   ST380011A
[02.0s] Detecting Primary Slave...
[02.2s]   None
[02.4s] Detecting Secondary Master...
[02.6s]   HL-DT-ST DVDRAM GSA-4167B
[02.8s] Detecting Secondary Slave...
[03.0s]   None

[03.2s] Press DEL to enter SETUP, F12 for Boot Menu

[03.6s] Verifying DMI Pool Data...
[03.9s] Boot from CD: _
[04.2s] Boot from Hard Disk...

[04.6s] Reading Boot Sector from Drive 80h...
[05.0s] Jumping to Bootloader @ 0x7C00
`