subreddit = "Animewallpaper"
query = "flair_name%3A%22Desktop%22"

// subreddit = "wallpaper"
// query = "blade"

function changeBackground(value) {
    localStorage.setItem('backgroundUrl', value)
}

function setDefaultWallpaper() {
     localStorage.setItem('backgroundUrl', '')
}

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
console.log("https://www.reddit.com/r/"+subreddit+"/search?q="+query+"")
var rss_content = JSON.parse(httpGet("https://api.allorigins.win/get?url=https://www.reddit.com/r/"+subreddit+"/search.rss?q="+query+"&restrict_sr=1")).contents
console.log(rss_content)
var parser = new DOMParser();
var xmlDoc = parser.parseFromString(rss_content, "application/xml");

var entries = xmlDoc.getElementsByTagName('entry')

var imageLinks = []
Array.from(entries).forEach(entry => {
    if(entry.getElementsByTagName('media:thumbnail').length){
        let entry_preview_link = entry.getElementsByTagName('media:thumbnail')[0].attributes.url.value
        if(entry_preview_link.indexOf('://preview.') != -1){
            imageLinks.push(entry_preview_link.split('?')[0].replace('://preview.','://i.'))
        }
    }
});

imageLinks.forEach(image_link => {
    var image_element = document.createElement('img')
    image_element.src = image_link
    image_element.onclick = (e) => {changeBackground( e.target.src);}
    document.getElementById('lastWallpapers').appendChild(image_element)
})