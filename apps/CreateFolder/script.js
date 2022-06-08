var params = JSON.parse(decodeURIComponent(new URL(location.href).hash.substring(1)))
document.querySelector('#filename').placeholder = params.directoryContext + "/" + document.querySelector('#filename').placeholder

var command = JSON.parse(localStorage.getItem('createFolder'))
document.querySelector('#create_btn').onclick = (e) => {
    console.log(command)
    alert(document.querySelector('#filename').value);
    document.body.createFolder(params.directoryContext + "/" + document.querySelector('#filename').value)
    command['filename'] = document.querySelector('#filename').value;
    localStorage.setItem('createFolder', JSON.stringify(command));
}

