var template = '<li class="listitem" data-youtube="{youtube}" onclick="changeVideo(this);">{title}</li>';

function changeVideo(elem) {
    if (document.querySelector('.selected') != undefined) {
        document.querySelector('.selected').className = 'listitem';
    }
    elem.className = 'selected';
    document.querySelector('iframe').src = elem.dataset.youtube;
}

function getPlaylist(file) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", file, false);
    xmlHttp.send(null);
    var playlistData = JSON.parse(xmlHttp.responseText);
    playlistData.forEach(music => {
        let html = template;
        html = html.replace('{title}', music.title)
        html = html.replace('{youtube}', music.youtube)
        let temp = document.createElement('template');
        html = html.trim();
        temp.innerHTML = html;
        document.getElementById('list').appendChild(temp.content.firstChild);
    });
}

getPlaylist('playlists/90bpm.playlist');
changeVideo(document.querySelector('.listitem'));