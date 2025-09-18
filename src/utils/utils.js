// src/utils/utils.js
function $(query, parent=document){
    return parent.querySelector(query);
}
function $$(query, parent=document){
    return parent.querySelectorAll(query);
}
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function isDigit(str) {
    str = String(str);
    return [...str].every(c => c >= '0' && c <= '9');
}
function hex(int, digits=2){
    return "0x" + int.toString(16).padStart(digits, "0").toUpperCase();
}
function ord(char){
    return char.charCodeAt(0);
}
function toSigned8(byte){
    return (byte << 24) >> 24;
}
function toSigned16(word){
    return (word << 16) >> 16;
}
function isMap(value){
    return Object.prototype.toString.call(value) === "[object Map]";
}
function objToMap(obj){
    return new Map(Object.entries(obj));
}