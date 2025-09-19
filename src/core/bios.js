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
        // let bootmbr = FileSystem.read("/boot.mbr");
        // if (bootmbr){
        //     ram.load(bootmbr, 0x7C00);
        // }
        cpu.regs.PC = 0x7C00;
        cpu.run();
    }
}
