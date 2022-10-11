function search(query){
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.open("GET", "https://www.googleapis.com/youtube/v3/search?key=AIzaSyAv82-QVpxlp7pSY5YUEaI6gEQd8QGnNNc&type=video&part=snippet&maxResults=1&q="+ query, false);

    xhr.send();
    var res = JSON.parse(xhr.responseText);
    console.log(res)
    
    document.querySelector('iframe').src = "https://www.youtube.com/embed/" + res.items[0].id.videoId
    return res;
}

document.querySelector('#search_btn').onclick = e => {search(e.target.previousElementSibling.value)}