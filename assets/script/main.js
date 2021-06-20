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
    html = html.replace('{content}', content);
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
        } else if (name.substring(name.indexOf('.') + 1, name.length) == 'jpg') {
            console.log(name.substring(name.indexOf('.') + 1, name.length));
            winElement.getElementsByTagName('pre')[0].outerHTML = "<img src='" + name + "'></img>";
        } else if (name.substring(0, 7) == '1337://') {
            winElement.getElementsByTagName('pre')[0].innerHTML = "<iframe src='" + name.replace('1337://', '/') + "'></iframe>";
        } else if (name.substring(name.indexOf('.') + 1, name.length) == 'md') {
            winElement.getElementsByClassName('content')[0].innerHTML = "<div class='markdown'>" + marked(element.lastElementChild.innerText) + "</div>";
        } else {
            winElement.getElementsByTagName('pre')[0].innerHTML = (name != 'New') ? httpGet(name) : "\n\n\n";
        }
        document.body.appendChild(winElement);
    }
    focusWin(document.getElementById(name.replace('.', '')));
    document.getElementById(name.replace('.', '')).style.display = 'block';
    dragElement(document.getElementById(name.replace('.', '')));
    if (!mobileCheck()) { windowFix(); } else {
        winElement.getElementsByClassName('content')[0].style.height = winElement.clientHeight - 35 - winElement.firstChild.clientHeight + "px";
        //winElement.getElementsByClassName('content')[0].style.width = winElement.clientWidth + "px";
    }

    hljs.highlightBlock(winElement.getElementsByTagName('pre')[0]);
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

function ls(path = "contents") {
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
    focusWin(document.getElementById(name.replace('.', '')));
    document.getElementById(name.replace('.', '')).style.display = 'block';
    dragElement(document.getElementById(name.replace('.', '')));

    if (!mobileCheck()) { windowFix(); } else {
        folderElement.getElementsByClassName('content')[0].style.height = folderElement.clientHeight - 35 - folderElement.firstChild.clientHeight + "px";
        console.log(folderElement.clientHeight - 35 - folderElement.firstChild.clientHeight + "px")
    }
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

    if (elemnt.style.zIndex != '2') {
        console.log(elemnt)
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