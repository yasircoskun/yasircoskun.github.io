var peer = new Peer({
    config: {'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
    ]} 
});

function listen(con){
    connected_msg(con.peer)
    con.on('data', function(data){
        if(document.querySelector('#messages').innerHTML != ""){
            document.querySelector('#messages').innerHTML += "<hr><b>"+con.peer + "</b>: " + data;
        }else{
            document.querySelector('#messages').innerHTML += "<b>"+con.peer + "</b>: " + data ;
        }
    });
    con.on('close', function(){
        disconnected_msg(con.peer)
    })
}

function connected_msg(peer){
    if(document.querySelector('#messages').innerHTML != ""){
        document.querySelector('#messages').innerHTML += "<hr><b>System</b>: " + peer + " Connected";
    }else{
        document.querySelector('#messages').innerHTML += "<b>System</b>: " + peer + " Connected";
    }
}

function disconnected_msg(peer){
    if(document.querySelector('#messages').innerHTML != ""){
        document.querySelector('#messages').innerHTML += "<hr><b>System</b>: " + peer + " disConnected";
    }else{
        document.querySelector('#messages').innerHTML += "<b>System</b>: " + peer + " disConnected";
    }
}

peer.on('open', function(id) {
    document.getElementById('my_peer_id').innerText = id
});

peer.on('connection', function(con){
    listen(con)
});

peer.on('close', function(){
    document.querySelector('#messages').innerHTML += "<hr><b>System</b>: " + peer.id + " disConnected";
})

document.querySelector('#msg_send_form').onsubmit = (e) => {
    e.preventDefault();  
    console.log(peer.connections[Object.keys(peer.connections)[0]][0])
    peer.connections[Object.keys(peer.connections)[0]][0].send(document.querySelector('#message').value)
    if(document.querySelector('#messages').innerHTML != ""){
        document.querySelector('#messages').innerHTML += "<hr><b>"+peer._id + "</b>: " + document.querySelector('#message').value;
    }else{
        document.querySelector('#messages').innerHTML += "<b>"+peer._id + "</b>: " + document.querySelector('#message').value ;
    }
    document.querySelector('#message').value = ""
    return false
}

document.querySelector('#connect_btn').onclick = (e) => {
    var con = peer.connect(prompt('Connect To?'))
    listen(con)
}