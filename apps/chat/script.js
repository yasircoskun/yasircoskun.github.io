var your_peer_id = prompt('Your Peer ID?') 

var peer = new Peer(your_peer_id, {
  config: {
    'iceServers': [
      { url: 'stun:stun.l.google.com:19302' },
    ]
  }
});

var my_stream
var connections = []
var calls = []

function connected() {
  document.querySelector('#connect_btn').innerText = "Call";
  document.querySelector('#connect_btn').onclick = (e) => { call() }
  document.querySelector('#connect_btn').id = "call_btn";
  document.querySelector('#connection_status').innerText = "Connected with: "
  document.querySelector('#my_peer_id').innerText = con.peer
  document.querySelector('#my_peer_id').id = "connected_with"
}



function listen(con) {
  connected_msg(con.peer)
  connections.push(con)
  con.on('data', function (data) {
    if (document.querySelector('#messages').innerHTML != "") {
      document.querySelector('#messages').innerHTML += "<hr><b>" + con.peer + "</b>: " + data;
    } else {
      document.querySelector('#messages').innerHTML += "<b>" + con.peer + "</b>: " + data;
    }
  });
  con.on('close', function () {
    disconnected_msg(con.peer)
  })
  // connected()
  document.querySelector('#connect_btn').innerText = "Call";
  document.querySelector('#connect_btn').onclick = (e) => { call() }
  document.querySelector('#connect_btn').id = "call_btn";
  document.querySelector('#connection_status').innerText = "Connected with: "
  document.querySelector('#my_peer_id').innerText = con.peer
  document.querySelector('#my_peer_id').id = "connected_with"
}

function connected_msg(peer) {
  if (document.querySelector('#messages').innerHTML != "") {
    document.querySelector('#messages').innerHTML += "<hr><b>System</b>: " + peer + " Connected";
  } else {
    document.querySelector('#messages').innerHTML += "<b>System</b>: " + peer + " Connected";
  }
}

function disconnected_msg(peer) {
  if (document.querySelector('#messages').innerHTML != "") {
    document.querySelector('#messages').innerHTML += "<hr><b>System</b>: " + peer + " disConnected";
  } else {
    document.querySelector('#messages').innerHTML += "<b>System</b>: " + peer + " disConnected";
  }
}

peer.on('open', function (id) {
  document.getElementById('my_peer_id').innerText = id
});

peer.on('connection', function (con) {
  listen(con)

});

peer.on('close', function () {
  document.querySelector('#messages').innerHTML += "<hr><b>System</b>: " + peer.id + " disConnected";
})

peer.on('call', function (call) {
  calls.push(call)
  alert('call')
  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (stream) {
    my_stream = stream
    my_stream.getAudioTracks()[0].enabled = 0
    my_stream.getVideoTracks()[0].enabled = 0
    video_setStream('local_video', my_stream)
    call.answer(my_stream);
    call.on('stream', function (remoteStream) {
      video_setStream('remote_video', remoteStream)
    });
  }).catch(function (err) {
    console.log(err.name + ": " + err.message);
  });
})

document.querySelector('#msg_send_form').onsubmit = (e) => {
  e.preventDefault();
  console.log(peer.connections[Object.keys(peer.connections)[0]][0])
  peer.connections[Object.keys(peer.connections)[0]][0].send(document.querySelector('#message').value)
  if (document.querySelector('#messages').innerHTML != "") {
    document.querySelector('#messages').innerHTML += "<hr><b>" + peer._id + "</b>: " + document.querySelector('#message').value;
  } else {
    document.querySelector('#messages').innerHTML += "<b>" + peer._id + "</b>: " + document.querySelector('#message').value;
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

var constraints = {
  video: false,
  audio: false,
}

function getCameraDevices() {alert(123)
  navigator.mediaDevices.enumerateDevices().then(devices => {
    let cams = devices.filter(device => device.kind === 'videoinput');
    let html = cams.map(cam => {
      console.log(cam)
      return `<button class="dropdown-item" data-href="#${cam.deviceId}">${cam.label}</button>`
    });
    document.getElementById('camera_list').innerHTML = html.join('');
    document.querySelectorAll('#camera_list .dropdown-item').forEach(item => {
      console.log(item)
      item.onclick = (e) => {
        var new_constraints = constraints;
        new_constraints.video = { deviceId: { exact: e.target.dataset.href.replace('#', '') } }
        constraints = new_constraints

        navigator.mediaDevices.getUserMedia(new_constraints).then(function (stream) {
          my_stream.getVideoTracks()[0].stop()
          my_stream.removeTrack(my_stream.getVideoTracks()[0])
          my_stream.addTrack(stream.getVideoTracks()[0])
          calls.forEach(call => {
            sender = call.peerConnection.getSenders().filter(sender => {
              return sender.track.kind == 'video'
            })
            sender[0].replaceTrack(stream.getVideoTracks()[0])
          })
        }).catch(function (err) {
          console.log(err.name + ": " + err.message);
        });

        video_setStream('local_video', my_stream)
      }
    })
  });
  
};

function getMicrophoneDevices() {
  navigator.mediaDevices.enumerateDevices().then(devices => {
    let mics = devices.filter(device => device.kind === 'audioinput');
    let html = mics.map(mic => {
      return `<button class="dropdown-item" data-href="#${mic.deviceId}">${mic.label}</button>`
    });
    document.getElementById('microphone_list').innerHTML = html.join('');
    document.querySelectorAll('#microphone_list .dropdown-item').forEach(item => {
      item.onclick = (e) => {
        var new_constraints = constraints;
        new_constraints.audio = { deviceId: { exact: e.target.dataset.href.replace('#', '') } }
        constraints = new_constraints

        navigator.mediaDevices.getUserMedia(new_constraints).then(function (stream) {
          my_stream.getAudioTracks()[0].stop()
          my_stream.removeTrack(my_stream.getAudioTracks()[0])
          my_stream.addTrack(stream.getAudioTracks()[0])
          calls.forEach(call => {
            sender = call.peerConnection.getSenders().filter(sender => {
              return sender.track.kind == 'audio'
            })
            sender[0].replaceTrack(stream.getAudioTracks()[0])
          })
        }).catch(function (err) {
          console.log(err.name + ": " + err.message);
        });

        video_setStream('local_video', my_stream)
      }
    })
  })
};

document.querySelector('#mic_on_off').onclick = (e) => {
  if (e.currentTarget.dataset.status == "off") {
    my_stream.getAudioTracks()[0].enabled = 1
    getMicrophoneDevices()
    constraints.audio = true
    e.currentTarget.dataset.status = "on";
  } else {
    my_stream.getAudioTracks()[0].enabled = 0
    constraints.audio = false
    e.currentTarget.dataset.status = "off";
  }
}

document.querySelector('#cam_on_off').onclick = (e) => {
  if (e.currentTarget.dataset.status == "off") {
    my_stream.getVideoTracks()[0].enabled = 1
    getCameraDevices()
    constraints.video = true
    e.currentTarget.dataset.status = "on";
  } else {
    my_stream.getVideoTracks()[0].enabled = 0
    constraints.video = false
    e.currentTarget.dataset.status = "off";
  }
}


function video_setStream(video_id, stream) {
  let video = document.querySelector('video#' + video_id)
  video.parentElement.style.display = "flex";
  if ("srcObject" in video) {
    video.srcObject = stream;
  } else {
    video.src = window.URL.createObjectURL(stream);
  }
  video.onloadedmetadata = function (e) {
    video.play();
  };
}

function call() {
  navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function (stream) {
    my_stream = stream
    my_stream.getAudioTracks()[0].enabled = 0
    my_stream.getVideoTracks()[0].enabled = 0
    video_setStream('local_video', my_stream)
    var call = peer.call(peer.connections[Object.keys(peer.connections)[0]][0].peer, my_stream);
    calls.push(call)
    call.on('stream', function (remoteStream) {
      video_setStream('remote_video', remoteStream)
    });
  }).catch(function (err) {
    console.log(err.name + ": " + err.message);
  });
}
