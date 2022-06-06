// ==UserScript==
// @name         YasirCoskun OAUTH
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://yasircoskun.github.io/apps/OAUTH/oauth.html?code=*
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
})();