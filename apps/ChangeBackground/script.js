var wallappers = {
    "Desktop": [
        "https://yasircoskun.github.io/assets/images/wallpapers/desktop/SteinsGate.gif",
        "https://orig00.deviantart.net/9f97/f/2017/100/5/8/vassar_assets_1_by_grenadekitten-db5d8ta.gif",
    ],
    "Mobile": [
        "https://66.media.tumblr.com/95b2ba03ec0a1a2753def103f98b978c/tumblr_pqbvczetDg1t8nuqh_1280.gif",
        "https://78.media.tumblr.com/80626c02ca522a84125574d137f5b412/tumblr_o9zxrhyPj21tgo74ho1_1280.gif",
    ]
}

function changeBackgroundCookie(value) {
    setCookie('backgroundUrl', value, 1);
    setCookie('command', 'reload', 1);
}

function setDefaultWallpaper() {
    setCookie('backgroundUrl', '', 1);
    setCookie('command', 'reload', 1);
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

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

var rss_content = JSON.parse(httpGet("https://api.allorigins.win/get?url=https://www.reddit.com/r/Animewallpaper/search.rss?q=flair_name%3A%22Desktop%22&restrict_sr=1")).contents

var parser = new DOMParser();
var xmlDoc = parser.parseFromString(rss_content, "application/xml");

var entries = xmlDoc.getElementsByTagName('entry')
console.log(entries)
var imageLinks = []
Array.from(entries).forEach(entry => {
    let entry_preview_link = entry.getElementsByTagName('media:thumbnail')[0].attributes.url.value
    if(entry_preview_link.indexOf('://preview.') != -1){
        imageLinks.push(entry_preview_link.split('?')[0].replace('://preview.','://i.'))
    }
    
});
console.log(imageLinks)

imageLinks.forEach(image_link => {
    var image_element = document.createElement('img')
    image_element.src = image_link
    image_element.onclick = (e) => {changeBackgroundCookie( e.target.src);}
    document.getElementById('lastWallpapers').appendChild(image_element)
})