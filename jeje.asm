; mini_bios.asm
; Ensamblador x86, modo real, 16-bit
[org 0x7C00]   ; dirección típica de boot

start:
    mov si, mensaje
    call print_string
    jmp $

print_string:
    mov ah, 0x0E       ; función BIOS: teletipo
.next_char:
    lodsb               ; carga byte desde SI en AL
    cmp al, 0
    je .done
    int 0x10            ; llamar BIOS video
    jmp .next_char
.done:
    ret

mensaje db "Mini BIOS QEMU", 0

times 510-($-$$) db 0  ; rellenar hasta 512 bytes
dw 0xAA55              ; signature de boot
