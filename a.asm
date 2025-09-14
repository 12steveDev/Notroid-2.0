[BITS 16]           ; modo real
[ORG 0x7C00]        ; inicio de carga en memoria

mov ah, 0x0E
mov al, 'H'
int 0x10
mov al, 'i'
int 0x10
jmp $               ; loop infinito para que no se caiga
times 510-($-$$) db 0
dw 0xAA55            ; firma de arranque
