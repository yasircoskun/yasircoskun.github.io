// ==UserScript==
// @name         YasirCoskun OAUTH
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yasircoskun.github.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @grant        GM.xmlHttpRequest
// @connect      github.com
// ==/UserScript==

(function() {
    'use strict';

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }

    function decrypt(message = '', key = '') {
        var code = CryptoJS.AES.decrypt(message, key);
        var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

        return decryptedMessage;
    }

    function getJsonFromUrl(url) {
        if(!url) url = location.search;
        var query = url.substr(1);
        var result = {};
        query.split("&").forEach(function(part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        });
        return result;
    }

    function getSecrets() {
        let secret = httpGet(location.origin +'/secret~env.enc')
        let password = prompt('secret');
        return JSON.parse(decrypt(secret, password))
    }

    const updateFile = function(path, content){
        var data = JSON.stringify({
            "message":"Update via Web Client",
            "sha": JSON.parse(httpGet("https://api.github.com/repos/yasircoskun/yasircoskun.github.io/contents"+path)).sha,
            "content": btoa(unescape(encodeURIComponent(content))),
            "committer":{
                "name":"Yasir Web Client",
                "email":"yasir@mail_yok.ki"
            }
        });

        console.log(data)

        GM.xmlHttpRequest({
            method: "PUT",
            url: "https://api.github.com/repos/yasircoskun/yasircoskun.github.io/contents"+path,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "token " + JSON.parse(localStorage.getItem('github_access_token')).access_token
            },
            onload: (response) => {
                console.log(response)
                //localStorage.setItem('github_access_token', response.responseText);
                //location.href = location.origin;
            }
        })
    }

   const createFolder = function(path){
        var data = JSON.stringify({
            "message":"Create Folder via Web Client",
            "content": btoa(unescape(encodeURIComponent(""))),
            "committer":{
                "name":"Yasir Web Client",
                "email":"yasir@mail_yok.ki"
            }
        });
        GM.xmlHttpRequest({
            method: "PUT",
            url: "https://api.github.com/repos/yasircoskun/yasircoskun.github.io/contents"+path+"/ls",
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "token " + JSON.parse(localStorage.getItem('github_access_token')).access_token
            },
            onload: (response) => {
                console.log(response)
                alert('response')
                //localStorage.setItem('github_access_token', response.responseText);
                //location.href = location.origin;
            }
        })

       var lsData;

        GM.xmlHttpRequest({
            method: "GET",
            url: "https://api.github.com/repos/yasircoskun/yasircoskun.github.io/contents"+path.substring(0, path.lastIndexOf('/'))+"/ls",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "token " + JSON.parse(localStorage.getItem('github_access_token')).access_token
            },
            onload: (response) => {
                console.log(response)
                alert('get old ls file')
                let res = JSON.parse(response.responseText)
                updateFile(path.substring(0, path.lastIndexOf('/'))+"/ls", atob(res.content) + "\ndir "+path.substring(path.lastIndexOf('/')+1))
                alert('update ls file')
                localStorage.setItem('createFolder', JSON.stringify({
                    selector: 'div.fileWin[data-file-name="'+path.substring(0, path.lastIndexOf('/'))+'"] .content',
                    name: path.substring(path.lastIndexOf('/')+1),
                    path: path.substring(0, path.lastIndexOf('/')),
                }))
                console.log(JSON.stringify({
                    selector: 'div.fileWin[data-file-name="'+path.substring(0, path.lastIndexOf('/'))+'"] .content',
                    name: path.substring(path.lastIndexOf('/')+1),
                    path: path.substring(0, path.lastIndexOf('/')),
                }));alert('folder local')



                //localStorage.setItem('github_access_token', response.responseText);
                //location.href = location.origin;
            }
        })
    }

   const createFile = function(path, content=""){
        var data = JSON.stringify({
            "message":"Create File via Web Client",
            "content": btoa(unescape(encodeURIComponent(content))),
            "committer":{
                "name":"Yasir Web Client",
                "email":"yasir@mail_yok.ki"
            }
        });
        GM.xmlHttpRequest({
            method: "PUT",
            url: "https://api.github.com/repos/yasircoskun/yasircoskun.github.io/contents"+path,
            data: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "token " + JSON.parse(localStorage.getItem('github_access_token')).access_token
            },
            onload: (response) => {
                console.log(response)
                alert('response')
                //localStorage.setItem('github_access_token', response.responseText);
                //location.href = location.origin;
            }
        })

        GM.xmlHttpRequest({
            method: "GET",
            url: "https://api.github.com/repos/yasircoskun/yasircoskun.github.io/contents"+path.substring(0, path.lastIndexOf('/'))+"/ls",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "token " + JSON.parse(localStorage.getItem('github_access_token')).access_token
            },
            onload: (response) => {
                console.log(response)
                alert('get old ls file')
                let res = JSON.parse(response.responseText)
                updateFile(path.substring(0, path.lastIndexOf('/'))+"/ls", atob(res.content) + "\nfile "+path.substring(path.lastIndexOf('/')+1))
                alert('update ls file')
                localStorage.setItem('createFile', JSON.stringify({
                    selector: 'div.fileWin[data-file-name="'+path.substring(0, path.lastIndexOf('/'))+'"] .content',
                    name: path.substring(path.lastIndexOf('/')+1),
                    path: path.substring(0, path.lastIndexOf('/')),
                }))



                //localStorage.setItem('github_access_token', response.responseText);
                //location.href = location.origin;
            }
        })
    }

    if(location.href.indexOf("https://yasircoskun.github.io/apps/OAUTH/oauth.html") != -1 ){
        var secret = getSecrets()

        var data = {
            client_id: secret.github_oauth.client_id,
            client_secret: secret.github_oauth.secret,
            code: getJsonFromUrl().code
        }

        data = JSON.stringify(data);

        GM.xmlHttpRequest({
            method: "POST",
            url: "https://github.com/login/oauth/access_token",
            data: data,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            onload: (response) => {
                console.log(response)
                localStorage.setItem('github_access_token', response.responseText);
                location.href = location.origin;
            }
        })
    }
    if(location.href.indexOf("https://yasircoskun.github.io/apps/CreateFolder/index.html") != -1){
        alert('create folder opened')
        document.body.createFolder = createFolder
    }
    if(location.href.indexOf("https://yasircoskun.github.io/apps/CreateFile/index.html") != -1){
        alert('create file opened')
        document.body.createFile = createFile;
    }
    if(location.href.indexOf("https://yasircoskun.github.io/apps/Editor/") != -1){
        document.body.updateFile = updateFile
        document.body.createFile = createFile
        alert('editor')
    }



})();


