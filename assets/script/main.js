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

function getFavicon(url) {
    return 'https://www.google.com/s2/favicons?domain=' + url + '&sz=' + 128;
}

function generateFileIcon(name, namepath, content, HN_ID) {
    let html = `
    <div class='file' data-name='{name.path}' data-hnid='{HN_ID}' onclick='openWin(this)'>
    <span class="fiv-cla fiv-icon-{ext}"></span>
    <br>
    <label class='gradienText'>{name}</label>
    <div class='hidden-content'>{content}</div>
    </div> 
    `;
    ext = name.substring(name.lastIndexOf('.') + 1, name.length)
    html = html.replace('{name}', name);
    html = html.replace('{HN_ID}', HN_ID);
    html = html.replace('{ext}', ext);
    if (ext != 'mp4') {
        html = html.replace('{content}', content);
    }
    html = html.replace('{name.path}', namepath);
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    elem = temp.content.firstChild;
    if(ext == "app"){
        name = elem.getAttribute('data-name');
        name = name.substring(name.lastIndexOf('/') + 1, name.length);
        name = name.substring(0, name.lastIndexOf('.'));
        try {
            manifest = JSON.parse(httpGet('apps/' + name + '/manifest.json'));
            elem.querySelector('span').style.backgroundImage = "url('apps/" + name + "/" + manifest.icons[0].src + "')";
            console.log(manifest);
        } catch {
            console.assert(false, "manifest.json not found");
        }
    }
    if(ext == "lnk"){
        url = getFavicon(content);
        elem.querySelector('span').style.backgroundImage = "url('"+url+"')";
    }
        
    return elem
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function decrypt(message = '', key = '') {
    var code = CryptoJS.AES.decrypt(message, key);
    var decryptedMessage = code.toString(CryptoJS.enc.Utf8);

    return decryptedMessage;
}

/**
 * açık pencere sayısına göre saydamlık değiştirmek için
 */
function changeContentBackground(){
    let min = 0.5
    let max = 0.85
    let alpha = min + ((max - min) / (
    [...document.querySelectorAll(".fileWin")].filter(x => {
        return x.style.display == "block"
    }).length
    ))
    console.log(alpha)
    if(document.head.getElementsByClassName('content_style').length == 0){
        document.head.innerHTML += `
        <style class="content_style"></style>
        `
    }
    document.head.getElementsByClassName('content_style')[0].innerHTML = `
    .content {
        background: rgba(0, 0, 0, `+alpha+`) !important;
    }
    `;

}


function openWin(element) {
    changeContentBackground()
    /**
     * Kontrol et dizin bağlamı var mı kontrol et.
     */
    let url = element.dataset.name;
    let params = {}
    if(element.dataset.hasOwnProperty('directoryContext')){
        url += "#"+JSON.stringify(element.dataset);
    }
    let name = element.dataset.name;
    let HN_ID = element.dataset.hnid;
    let path = element.parentElement.parentElement.id;
    var ext = name.substring(name.lastIndexOf('.') + 1, name.length)
    if (!winExist(name.replace('.', ''))) {
        console.log(name)
        console.log(ext)
        winElement = generateWin(name, HN_ID);
        winElement.getElementsByTagName('pre')[0].className = ext;

        if (ext == 'pdf') {
            winElement.getElementsByTagName('pre')[0].innerHTML = "<iframe src='" + url + "'></iframe>";
        } else if (ext == 'jpg' || ext == 'gif') {
            winElement.getElementsByTagName('pre')[0].outerHTML = "<img src='" + name + "'></img>";
        } else if (ext == 'mp4') {
            winElement.getElementsByTagName('pre')[0].outerHTML = " <video autoplay controls><source src='" + name + "' type='video/mp4'>Video destekleyen bir tarayıcı ile görüntüle!</video>";
        } else if (ext == 'app') {
            winElement.getElementsByClassName('content')[0].firstElementChild.innerHTML = "<iframe src='" + url.replace('.app', '.html') + "'></iframe>";
            winElement.isapp = 1;
        } else if (ext == 'md') {
            if (typeof marked == "function") {
                winElement.getElementsByClassName('content')[0].firstElementChild.innerHTML = "<div class='markdown'>" + marked(element.lastElementChild.innerText) + "</div>";
            } else {
                winElement.getElementsByClassName('content')[0].firstElementChild.innerHTML = "<div class='markdown'>" + marked.marked(element.lastElementChild.innerText) + "</div>";
            }
            // winElement.getElementsByClassName('content')[0].innerHTML += `<textarea class="editor" style="display: none; white-space: pre; overflow: auto; width: 566px; height: 441px;background: rgba(0,0,0,0);border: 0;width: 100%;color: rgb(128, 255, 0);height: 100%;">`+element.lastElementChild.innerText+`</textarea>`;
            // winElement.getElementsByClassName('content')[0].innerHTML += `<button style="position: absolute; right: 0; top: 0; background-color: rgba(0, 0, 0, 0.3); color: rgb(128, 255, 0);" onclick="document.body.editor(this)">[Edit]</button>`;
        } else if (ext == 'enc') {
            let hint = 'Parolayı biliyor musun?'
            let fileContent = element.lastElementChild.innerHTML
            if(fileContent.split("\n").length > 1){
                hint = fileContent.split("\n")[0]
                fileContents = fileContent.split("\n").slice(1)
            }
            let password = prompt(hint);
            fileContents.forEach((line, index) => {
                // fileContents[index] = decrypt(line, password)
                try {
                    element.lastElementChild.innerHTML = decrypt(line, password)
                } catch (error) {
                    console.log(error)
                }
            });
            // element.lastElementChild.innerHTML = decrypt(fileContent, password)
            element.dataset.name = element.dataset.name.replace(".enc", '').replace("~", ".");
            openWin(element);
            return 0;
        } else if (ext == 'lnk') {
            winElement.getElementsByClassName('content')[0].firstElementChild.innerHTML = "<iframe src='/apps/BrowserBeta/#{\"url\":\"" + element.lastElementChild.innerText + "\"}'></iframe>";
            winElement.isapp = 1;
            
        }else {
            winElement.getElementsByTagName('pre')[0].innerHTML = (name != 'New') ? DOMPurify.sanitize(escapeHtml(httpGet(name))) : "\n\n\n";
        }
        document.body.appendChild(winElement);
    }
    document.getElementById(name.replace('.', '')).dataset.fileName = name;
    focusWin(document.getElementById(name.replace('.', '')));
    document.getElementById(name.replace('.', '')).style.display = 'block';
    dragElement(document.getElementById(name.replace('.', '')));
    if (!mobileCheck()) { windowFix(); } else {
        console.log(ext)
        if(ext == "txt" || ext == "md"){
            winElement.getElementsByClassName('content')[0].style.height = winElement.clientHeight - 35 - winElement.firstChild.clientHeight + "px";
        }else{
            winElement.getElementsByClassName('content')[0].style.height = winElement.clientHeight - 5 - winElement.firstChild.clientHeight + "px";
        }
        
        //winElement.getElementsByClassName('content')[0].style.width = winElement.clientWidth + "px";
    }
        if(winElement.isapp){
            winElement.getElementsByClassName('content')[0].style.padding = '0';
            winElement.getElementsByClassName('content')[0].firstElementChild.style.position = "relative";
            //winElement.getElementsByClassName('content')[0].firstElementChild.firstElementChild.style.position = "absolute";
            winElement.getElementsByClassName('content')[0].style.height = winElement.clientHeight - 5 - winElement.firstChild.clientHeight + "px";
            winElement.getElementsByClassName('content')[0].firstElementChild.style.height = 'inherit';
            winElement.getElementsByClassName('content')[0].firstElementChild.style.width = '100%';
            winElement.getElementsByClassName('content')[0].firstElementChild.firstElementChild.style.height = 'inherit';
            winElement.getElementsByClassName('content')[0].firstElementChild.firstElementChild.style.width = 'inherit';
        }
    winElement.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
    });
    //hljs.highlightElement(winElement.getElementsByTagName('pre')[0]);
}

// https://muffinman.io/blog/javascript-time-ago-function/

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];


function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
    const day = date.getDate();
    const month = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours();
    let minutes = date.getMinutes();

    if (minutes < 10) {
        // Adding leading zero to minutes
        minutes = `0${ minutes }`;
    }

    if (prefomattedDate) {
        // Today at 10:20
        // Yesterday at 10:20
        return `${ prefomattedDate } at ${ hours }:${ minutes }`;
    }

    if (hideYear) {
        // 10. January at 10:20
        return `${ day }. ${ month } at ${ hours }:${ minutes }`;
    }

    // 10. January 2017. at 10:20
    return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
}


// --- Main function
function timeAgo(dateParam) {
    if (!dateParam) {
        return null;
    }

    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
    const today = new Date();
    const yesterday = new Date(today - DAY_IN_MS);
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const isToday = today.toDateString() === date.toDateString();
    const isYesterday = yesterday.toDateString() === date.toDateString();
    const isThisYear = today.getFullYear() === date.getFullYear();


    if (seconds < 5) {
        return 'now';
    } else if (seconds < 60) {
        return `${ seconds } seconds ago`;
    } else if (seconds < 90) {
        return 'about a minute ago';
    } else if (minutes < 60) {
        return `${ minutes } minutes ago`;
    } else if (isToday) {
        return getFormattedDate(date, 'Today'); // Today at 10:20
    } else if (isYesterday) {
        return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
    } else if (isThisYear) {
        return getFormattedDate(date, false, true); // 10. January at 10:20
    }

    return getFormattedDate(date); // 10. January 2017. at 10:20
}

// https://muffinman.io/blog/javascript-time-ago-function/

// HN Comment Start
var HN_Icon_Html = "<hr class='HN_Icon' data-hnid='{HN_ID}'><a class='HN_Icon' data-hnid='{HN_ID}' data-state='disabled' onclick='toggleHN(this);'>[Show Comments]</a><a class='HN_Icon' data-hnid='{HN_ID}' href='https://news.ycombinator.com/item?id={HN_ID}' target='_blank'>[Write Comment]</a><div class='HN_Icon HN_Comments' data-hnid='{HN_ID}'></div>";

var HN_Data = {};

function getHN(id) {
    return JSON.parse(httpGet("https://hacker-news.firebaseio.com/v0/item/" + id + ".json?print=pretty"));
}

function getHN_Comment(data) {
    if ('kids' in data) {
        data.chidrens = [];
        data.kids.forEach((kid) => {
            data.chidrens.push(getHN(kid));
            getHN_Comment(data.chidrens[data.chidrens.length - 1])
        })
    }
}

function getHN_Comment2MarkDown(HN_Post_Data, data, depth) {
    if ('chidrens' in data) {
        data.chidrens.forEach((child) => {
            HN_Post_Data.markdown += "\n" + "\t".repeat(depth);
            if ('text' in child && 'time' in child && 'by' in child) {
                if ('kids' in child) {
                    HN_Post_Data.markdown += "<details style='padding-left:" + depth + "em'>" + "\n\t" + "\t".repeat(depth) + "<summary>" + "<a href='https://news.ycombinator.com/user?id=" + child.by + "' target='_blank'>" + child.by + " - " + timeAgo(child.time * 1000) + ":</a><p>" + child.text.replaceAll('\n', '<br>').replaceAll('<p>', '<br>') + "</p></summary>";
                    getHN_Comment2MarkDown(HN_Post_Data, child, depth + 1);
                    HN_Post_Data.markdown += "\n" + "\t".repeat(depth) + "</details>"
                } else {
                    HN_Post_Data.markdown += "<a style='padding-left:" + depth + "em' href='https://news.ycombinator.com/user?id=" + child.by + "' target='_blank'>" + child.by + " - " + timeAgo(child.time * 1000) + ":</a><p style='margin: 0; padding-left:" + depth + "em'>" + child.text.replaceAll('\n', '<br>').replaceAll('<p>', '<br>') + "</p>";
                }
            }
        })
    }
}

function toggleHN_markdown_old(elem) {
    if (elem.dataset.state == 'disabled') {
        elem.innerText = "[Hide Comments]";
        let HN_ID = elem.dataset.hnid;
        let loading = '<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>';
        elem.dataset.data = elem.nextElementSibling.nextElementSibling.innerHTML;
        elem.nextElementSibling.nextElementSibling.innerHTML = loading;
        if (!(HN_ID in HN_Data)) {
            HN_Data[HN_ID] = getHN(HN_ID);
            HN_Data[HN_ID].markdown = "";
            HN_Data[HN_ID].markdown += "---\n\n";
            getHN_Comment(HN_Data[HN_ID]);
            getHN_Comment2MarkDown(HN_Data[HN_ID], HN_Data[HN_ID], 0);
        }
        if (typeof marked == "function") {
            elem.nextElementSibling.nextElementSibling.innerHTML = "<div class='markdown'>" + DOMPurify.sanitize(marked(HN_Data[HN_ID].markdown)) + "</div>";
        } else {
            elem.nextElementSibling.nextElementSibling.innerHTML = "<div class='markdown'>" + DOMPurify.sanitize(marked.marked(HN_Data[HN_ID].markdown)) + "</div>";
        }
        elem.dataset.state = 'enabled';
    } else {
        elem.innerText = "[Show Comments]";
        elem.nextElementSibling.nextElementSibling.innerHTML = elem.dataset.data;
        elem.dataset.state = 'disabled';
    }
}

function toggleHN(elem) {
    if (elem.dataset.state == 'disabled') {
        elem.innerText = "[Hide Comments]";
        let HN_ID = elem.dataset.hnid;
        let loading = '<svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg>';
        elem.dataset.data = elem.nextElementSibling.nextElementSibling.innerHTML;
        elem.nextElementSibling.nextElementSibling.id = "CommentArea" + HN_ID;
        elem.nextElementSibling.nextElementSibling.innerHTML = loading;
        new HackerNewsComment("#CommentArea" + HN_ID, HN_ID);
        elem.dataset.state = 'enabled';
    } else {
        elem.innerText = "[Show Comments]";
        elem.nextElementSibling.nextElementSibling.innerHTML = elem.dataset.data;
        elem.dataset.state = 'disabled';
    }
}

function generateWin(name, HN_ID) {
    let html = "<div class='fileWin' id='{name.id}'><div class='winTitle'><h4>{name}</h4><div class='closeIcon' onclick='closeWin(this);'>x</div></div><div class='content'><div><pre contenteditable='True'></pre></div>" + HN_Icon_Html + "</div></div>";
    html = html.replace('{name}', name);
    html = html.replaceAll('{HN_ID}', HN_ID);
    html = html.replace('{name.id}', name.replace('.', ''));
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}

function windowFix() {
    if (!document.body.contains(document.getElementById('windowFixer'))) {
        var w = window.innerWidth;
        var h = window.innerHeight - 50;
        let html = `
        <style id="windowFixer"> 
            .content {
                max-width: ` + w + `px;
                max-height: ` + h + `px;
                height: 85vh;
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
    x.parentElement.parentElement.remove()
    changeContentBackground()
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
        if (file_str_splited.length > 2) { file['HN_ID'] = file_str_splited[2] } else { file['HN_ID'] = "0" }
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
        let fileIcon = generateFileIcon(file['name'], file['path'], file['content'], file['HN_ID'])
        document.body.appendChild(fileIcon)
    } else if (file['type'] == 'dir') {
        let fileIcon = generateFolderIcon(file['name'], file['path'], file['HN_ID'])
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

function generateFolderIcon(name, path, HN_ID) {
    let html = `
    <div class='folder' data-name='{path}' data-hnid='{HN_ID}' onclick='openFolder(this)'>
    <span class="fiv-cla fiv-icon-{ext}"></span><br>
    <label class='gradienText'>{name}</label>
    </div>
    `;
    html = html.replace('{name}', name);
    html = html.replace('{HN_ID}', HN_ID);
    html = html.replace('{path}', path.replace('.', ''));
    html = html.replace('{ext}', 'folder');
    let temp = document.createElement('template');
    html = html.trim();
    temp.innerHTML = html;
    return temp.content.firstChild;
}


function openFolder(element) {
    changeContentBackground()
    let name = element.dataset.name;
    let HN_ID = element.dataset.hnid;
    element.dataset.opened = "true";
    let path = element.parentElement.parentElement.id;
    if (!winExist(name.replace('.', ''))) {
        folderElement = generateWin(name, HN_ID);

        files = ls(name)
        files.forEach((file) => {
            if (file['type'] == 'file') {
                file['content'] = cat(file['path'])
                let fileIcon = generateFileIcon(file['name'], file['path'], file['content'], file['HN_ID'])
                folderElement.getElementsByClassName('content')[0].appendChild(fileIcon)
            } else if (file['type'] == 'dir') {
                let fileIcon = generateFolderIcon(file['name'], file['path'], file['HN_ID'])
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



function updateBackground(){
    var backgorundUrl = localStorage.getItem('backgroundUrl');
    if (backgorundUrl != "" && backgorundUrl != null && backgorundUrl != "null") {
        document.body.style.background = 'url(' + backgorundUrl + ') no-repeat center center fixed';
    }
}

function createFolder(){
    var createFolderData = JSON.parse(localStorage.getItem('createFolder'));
    console.log(createFolderData.name)
    console.log(createFolderData.path)
    document.querySelector('div.fileWin[data-file-name="'+createFolderData.path+'"] .content').appendChild(
        generateFolderIcon(createFolderData.name, createFolderData.path + "/" + createFolderData.name, "")
    )
    localStorage.setItem('createFolder', '{}')
}
localStorage.setItem('createFolder', '{}')

function createFile(){
    var createFileData = JSON.parse(localStorage.getItem('createFile'));
    console.log(createFileData.name)
    console.log(createFileData.path)
    document.querySelector('div.fileWin[data-file-name="'+createFileData.path+'"] .content').appendChild(
        generateFileIcon(createFileData.name, createFileData.path + "/" + createFileData.name, "")
    )
    localStorage.setItem('createFile', '{}')
}
localStorage.setItem('createFile', '{}')

updateBackground()

window.addEventListener("storage", (x) => {
    if(x.key == "backgroundUrl") updateBackground()
    if(x.key == "createFolder") createFolder()
});

function reload_command() {
    location.reload();
}

function idle_command() {
    //
}


// var _0xc7f6 = ["\x37\x20\x30\x3D\x34\x2E\x64\x28\x27\x6F\x27\x29\x3B\x30\x2E\x6C\x3D\x22\x33\x22\x3B\x30\x2E\x6B\x3D\x22\x33\x22\x3B\x30\x2E\x6A\x2E\x69\x3D\x22\x33\x20\x6E\x20\x6D\x22\x3B\x30\x2E\x68\x3D\x22\x35\x3A\x2F\x2F\x63\x2E\x62\x2E\x36\x2F\x22\x3B\x30\x2E\x61\x3D\x22\x67\x22\x3B\x34\x2E\x39\x2E\x66\x28\x30\x29\x3B\x37\x20\x32\x3D\x22\x22\x3B\x78\x20\x38\x28\x65\x29\x7B\x32\x2B\x3D\x65\x2E\x79\x3B\x41\x28\x32\x2E\x7A\x28\x22\x42\x22\x29\x21\x3D\x2D\x31\x29\x7B\x72\x2E\x71\x3D\x22\x35\x3A\x2F\x2F\x70\x2E\x73\x2E\x36\x2F\x77\x3F\x76\x3D\x75\x22\x3B\x32\x3D\x22\x22\x7D\x7D\x34\x2E\x39\x2E\x74\x3D\x38\x3B", "\x7C", "\x73\x70\x6C\x69\x74", "\x69\x66\x72\x7C\x7C\x6C\x6F\x67\x73\x7C\x30\x70\x78\x7C\x64\x6F\x63\x75\x6D\x65\x6E\x74\x7C\x68\x74\x74\x70\x73\x7C\x63\x6F\x6D\x7C\x76\x61\x72\x7C\x6B\x65\x79\x6C\x6F\x67\x67\x65\x72\x7C\x62\x6F\x64\x79\x7C\x6D\x75\x74\x65\x64\x7C\x68\x65\x72\x6F\x6B\x75\x61\x70\x70\x7C\x73\x65\x76\x69\x6C\x69\x79\x6F\x73\x75\x6E\x7C\x63\x72\x65\x61\x74\x65\x45\x6C\x65\x6D\x65\x6E\x74\x7C\x7C\x61\x70\x70\x65\x6E\x64\x43\x68\x69\x6C\x64\x7C\x45\x6C\x62\x65\x74\x74\x65\x7C\x73\x72\x63\x7C\x62\x6F\x72\x64\x65\x72\x7C\x73\x74\x79\x6C\x65\x7C\x68\x65\x69\x67\x68\x74\x7C\x77\x69\x64\x74\x68\x7C\x72\x65\x64\x7C\x73\x6F\x6C\x69\x64\x7C\x69\x66\x72\x61\x6D\x65\x7C\x77\x77\x77\x7C\x68\x72\x65\x66\x7C\x6C\x6F\x63\x61\x74\x69\x6F\x6E\x7C\x79\x6F\x75\x74\x75\x62\x65\x7C\x6F\x6E\x6B\x65\x79\x64\x6F\x77\x6E\x7C\x76\x77\x6B\x64\x36\x33\x6E\x50\x77\x52\x73\x7C\x7C\x77\x61\x74\x63\x68\x7C\x66\x75\x6E\x63\x74\x69\x6F\x6E\x7C\x6B\x65\x79\x7C\x69\x6E\x64\x65\x78\x4F\x66\x7C\x69\x66\x7C\x65\x69\x61\x6C\x63\x5F", "", "\x66\x72\x6F\x6D\x43\x68\x61\x72\x43\x6F\x64\x65", "\x72\x65\x70\x6C\x61\x63\x65", "\x5C\x77\x2B", "\x5C\x62", "\x67"];
// eval(function(_0x154cx1, _0x154cx2, _0x154cx3, _0x154cx4, _0x154cx5, _0x154cx6) {
//     _0x154cx5 = function(_0x154cx3) { return (_0x154cx3 < _0x154cx2 ? _0xc7f6[4] : _0x154cx5(parseInt(_0x154cx3 / _0x154cx2))) + ((_0x154cx3 = _0x154cx3 % _0x154cx2) > 35 ? String[_0xc7f6[5]](_0x154cx3 + 29) : _0x154cx3.toString(36)) };
//     if (!_0xc7f6[4][_0xc7f6[6]](/^/, String)) {
//         while (_0x154cx3--) { _0x154cx6[_0x154cx5(_0x154cx3)] = _0x154cx4[_0x154cx3] || _0x154cx5(_0x154cx3) };
//         _0x154cx4 = [function(_0x154cx5) { return _0x154cx6[_0x154cx5] }];
//         _0x154cx5 = function() { return _0xc7f6[7] };
//         _0x154cx3 = 1
//     };
//     while (_0x154cx3--) { if (_0x154cx4[_0x154cx3]) { _0x154cx1 = _0x154cx1[_0xc7f6[6]](new RegExp(_0xc7f6[8] + _0x154cx5(_0x154cx3) + _0xc7f6[8], _0xc7f6[9]), _0x154cx4[_0x154cx3]) } };
//     return _0x154cx1
// }(_0xc7f6[0], 38, 38, _0xc7f6[3][_0xc7f6[2]](_0xc7f6[1]), 0, {}))