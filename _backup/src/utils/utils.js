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