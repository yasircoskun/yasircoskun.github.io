edit_mode = true
if(new URL(location.href).hash != ""){
    var params = JSON.parse(decodeURIComponent(new URL(location.href).hash.substring(1)))
}else{
    edit_mode = false;
}


var editor = monaco.editor.create(document.getElementById('container'), {
    language: 'markdown',
    theme: 'vs-dark',
    wordWrap: "on",
});

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
if(edit_mode) editor.getModel().setValue(httpGet(params.filePath));


document.onkeydown = function (e) {
    e = e || window.event;//Get event

    if (!e.ctrlKey) return;

    var code = e.which || e.keyCode;//Get key code

    switch (code) {
        case 83:
            e.preventDefault();//Block Ctrl+S
            e.stopPropagation();//Block Ctrl+S
            if(edit_mode){
                document.body.updateFile(params.filePath, editor.getModel().getValue())
            }else{
                let path = prompt("File path/filename.ext", "/contents/new_file.txt");
                document.body.createFile(path, editor.getModel().getValue())
            }

            break;
            
    }
};

window.onresize = e => {
    editor.layout();
}