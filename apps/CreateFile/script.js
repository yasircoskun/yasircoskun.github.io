var params = JSON.parse(decodeURIComponent(new URL(location.href).hash.substring(1)))
document.querySelector('#filename').placeholder = params.directoryContext + "/" + document.querySelector('#filename').placeholder


document.querySelector('#create_btn').onclick = (e) => {
    console.log(document.querySelector('#filename').value);
    document.body.createFile(params.directoryContext + "/" + document.querySelector('#filename').value)

}

