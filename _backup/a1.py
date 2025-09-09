from scapy.all import sniff, conf

def mostrar(pkt):
    print(pkt.summary())

conf.L2socket = conf.L3socket
sniff(prn=mostrar, count=25)  # Captura 25 paquetes
