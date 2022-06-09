var params = JSON.parse(decodeURIComponent(new URL(location.href).hash.substring(1)))

var editor = monaco.editor.create(document.getElementById('container'), {
    language: 'markdown',
    theme: 'vs-dark',
});

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

editor.getModel().setValue(httpGet(params.filePath));

editor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.KEY_S, (e) => {e.preventDefault();e.stopPropagation();console.log("hello world")})
//Prevent Ctrl+S (and Ctrl+W for old browsers and Edge)
document.onkeydown = function (e) {
    e = e || window.event;//Get event

    if (!e.ctrlKey) return;

    var code = e.which || e.keyCode;//Get key code

    switch (code) {
        case 83:
            e.preventDefault();//Block Ctrl+S
            e.stopPropagation();//Block Ctrl+S
            document.body.updateFile(params.filePath, editor.getModel().getValue())
            break;
            
    }
};
window.onresize = e => {
    editor.layout();
}