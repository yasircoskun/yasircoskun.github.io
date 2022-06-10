var url = ""
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl.indexOf('?') != -1 ? theUrl + '&nocache=' + new Date().getTime() : theUrl + '?nocache=' + new Date().getTime(), false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

var setInnerHTML = function(elm, html) {
  elm.innerHTML = html;
  Array.from(elm.querySelectorAll("script")).forEach( oldScript => {
    const newScript = document.createElement("script");
    Array.from(oldScript.attributes)
      .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
    newScript.appendChild(document.createTextNode(oldScript.innerHTML));
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

function getForm(form){
    let theUrl
    if(form.action.indexOf('yasir') != -1){
        theUrl = new URL(url).pathname;
    }else{
        theUrl = new URL(form.action).pathname;
    }
    
    if(theUrl[0] == "/"){
        theUrl = new URL(url).origin + theUrl
    }else if(theUrl.indexOf('//') == -1){
        theUrl = new URL(url).origin + "/" + theUrl
    }
    alert(theUrl)
    var counter = 0
    theUrl = theUrl + "?";
    [...document.querySelectorAll("form *[name]")].forEach(function(x, i)  {
    if(x.value != ""){
        if(counter == 0){
        theUrl += x.name+"="+x.value;
        }else{
        theUrl += "&"+x.name+"="+x.value
        }
        counter += 1
    } 
    })
    location.hash = JSON.stringify({url: theUrl})

    // var xmlHttp = new XMLHttpRequest();
    //     xmlHttp.open("GET", "https://api.allorigins.win/get?url=" + theUrl, false);

    //     xmlHttp.send( null );
    //     console.log(xmlHttp)
    return "";
}

function postForm(form){
    let theUrl
    if(form.action.indexOf('yasir') != -1){
        theUrl = new URL(url).pathname;
    }else{
        theUrl = new URL(form.action).pathname;
    }
    
    if(theUrl[0] == "/"){
        theUrl = new URL(url).origin +theUrl
    }else if(theUrl.indexOf('//') == -1){
        theUrl = new URL(url).origin + "/" + theUrl
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "https://api.allorigins.win/get?url=" + theUrl, false);
    var formData = new FormData( form );
    xmlHttp.send(formData);
    console.log(xmlHttp.responseText)
    return xmlHttp.responseText;
}

const init = (e) => {
    if(new URL(location.href).hash != ""){
        var params = JSON.parse(decodeURIComponent(new URL(location.href).hash.substring(1)))
        url = params.url
    }

    window.parent.postMessage({url: url}, '*');

    if(typeof document.head.getElementsByTagName('base')[0] != "undefined"){
        document.head.getElementsByTagName('base')[0].href = new URL(url).origin + '/'
    }else{
        document.head.innerHTML += '<base href="'+ new URL(url).origin +'/" target="_self">'
    }

    setInnerHTML(document.querySelector('body'), JSON.parse(httpGet("https://api.allorigins.win/get?url=" + encodeURIComponent(url))).contents)

    
    /**
    * Change all href to data-href
    */
    // document.querySelectorAll('link[type="text/css"]').forEach(link => {
    //     let new_href = link.href
    //     if(new_href.indexOf('.woff') != -1){
    //         new_href = new URL(new_href).origin +new_href
    //         link.href = "https://corsproxy.io/?"+encodeURIComponent(new_href)
    //     }
    // })
    setTimeout(() => {
        document.querySelectorAll('form').forEach(form => {
            if(form.method.toLowerCase() == "post"){
                form.onsubmit = (e) => {e.preventDefault(); document.querySelector('body').innerHTML = JSON.parse(postForm(e.currentTarget)).contents; return false;}
            }else{
                form.onsubmit = (e) => {e.preventDefault(); document.querySelector('body').innerHTML = JSON.parse(getForm(e.currentTarget)).contents; return false;}
            }
        })
        document.querySelectorAll('a').forEach(a => {
            a.outerHTML = a.outerHTML.replace('href', 'data-href');
        })
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            let new_url = link.href
            if(new_url[0] == "/"){
                new_url = new URL(url).origin +new_url
            }else if(new_url.indexOf('//') == -1){
                new_url = new URL(url).origin + "/" + new_url
            }
            link.href = new_url
        })
        document.querySelectorAll('script[src]').forEach(script => {
            let new_url = script.src
            if(new_url[0] == "/"){
                new_url = new URL(url).origin +new_url
            }else if(new_url.indexOf('//') == -1){
                new_url = new URL(url).origin + "/" + new_url
            }
            script.src = new_url
        })
        document.querySelectorAll('a').forEach(a => {
            a.classList.add('a-href');
        })
        document.querySelectorAll('a').forEach(a => {
            a.onclick = (e) => {
                let new_url = e.currentTarget.dataset.href
                if(new_url[0] == "/"){
                    new_url = new URL(url).origin +new_url
                }else if(new_url.indexOf('//') == -1){
                    new_url = new URL(url).origin + "/" + new_url
                }
                location.hash = JSON.stringify({url: new_url})
            }
        })
    if(typeof document.head.getElementsByClassName('.beta_style')[0] == "undefined"){
        document.head.innerHTML += `
<style class="beta_style">
body {
    //filter: invert(1) !important;
    background-color: transparent !important;
}
body * {
  color: purple !important;
  border-color: purple !important;
  background-color: transparent !important;
}
body {
  overflow: auto;
  padding: 0;
  margin: 0;
  background-color: transparent !important;
}
.a-href {
  cursor: pointer;
}
* {
  color: purple !important;
  border-color: purple !important;
  background-color: transparent !important;
}
img, video, picture, svg, iframe,
*[style~="background-image"], *[style~="background"], *[style~="image"], *[class~="image"],
*[style*="background-image"], *[style*="background"], *[style*="image"], *[class*="image"],
*[style^="background-image"], *[style^="background"], *[style^="image"], *[class^="image"] {
  filter: invert(1) !important;
}
<style>
`
    }
    },1337)


}



init()

window.onhashchange = init
