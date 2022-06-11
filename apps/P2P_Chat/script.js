var peer = new Peer({
    config: {'iceServers': [
        { url: 'stun:stun.l.google.com:19302' },
    ]} 
});

function connected(){
    document.querySelector('#connect_btn').innerText = "Call";
    document.querySelector('#connect_btn').onclick = (e) => {call()}
    document.querySelector('#connect_btn').id = "call_btn";
    document.querySelector('#connection_status').innerText = "Connected with: "
    document.querySelector('#my_peer_id').innerText = con.peer
    document.querySelector('#my_peer_id').id = "connected_with"
}

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
    connected()
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

peer.on('call', function(call){
  alert('call')
  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(stream) {
    video_setStream('local_video', stream)
    call.answer(stream);
    call.on('stream', function(remoteStream) {
      video_setStream('remote_video', remoteStream)
    });
  }).catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
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

document.querySelector('#my_peer_id').onclick = (e) => {
  navigator.clipboard.writeText(e.target.innerText);
  alert('peer id copied')
}

function video_setStream(video_id, stream){
  let video = document.querySelector('video#'+video_id)
  video.parentElement.style.display = "block";
  if ("srcObject" in video) {
      video.srcObject = stream;
  } else {
      video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function(e) {
      video.play();
  };
}

function call(){
  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(stream) {
    video_setStream('local_video', stream)
    var call = peer.call(peer.connections[Object.keys(peer.connections)[0]][0].peer, stream);
    call.on('stream', function(remoteStream) {
      video_setStream('remote_video', remoteStream)
    });
  }).catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}
