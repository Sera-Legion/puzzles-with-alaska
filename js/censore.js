document.onkeydown = function(e) {
if(event.keyCode == 123) {
return false;
}
if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
return false;
}
if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){
return false;
}
if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){
return false;
}
}// Отключение контекстного меню
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Запретить выделение текста
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});
