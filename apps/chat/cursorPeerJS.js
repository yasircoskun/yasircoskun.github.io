var peer = new Peer({
  config: {
    'iceServers': [
      { url: 'stun:stun.l.google.com:19302' },
    ]
  }
});

var my_stream

connected_list = []
