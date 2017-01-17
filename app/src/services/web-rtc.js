/* global webkitRTCPeerConnection */
// Heavily based upon https://github.com/webrtc/samples/blob/522e81076cda0aca0b624b63d39ff2861f1672d2/src/content/peerconnection/webaudio-input/js/main.js
export default class WebRTCService {
  loopback () {
    const constraints = {
      audio: true,
      video: false
    }

    return navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => this._onGotMedia(stream))
  }

  _onGotMedia (stream) {
    const audioTracks = stream.getAudioTracks()
    if (audioTracks.length === 1) {
      // TODO: Inject logger in constructor...
      console.log('Got one audio track:', audioTracks)
      var filteredStream = stream // webAudio.applyFilter(stream)
      var servers = null
      this.peerConnection1 = new webkitRTCPeerConnection(servers) // eslint-disable-line new-cap
      console.log('Created local peer connection object pc1')
      this.peerConnection1.onicecandidate = (event) => this._onIceCandidate(this.peerConnection2, event)
      this.peerConnection2 = new webkitRTCPeerConnection(servers) // eslint-disable-line new-cap
      console.log('Created remote peer connection object pc2')
      this.peerConnection2.onicecandidate = (event) => this._onIceCandidate(this.peerConnection1, event)

      this.peerConnection1.addStream(filteredStream)
      this.peerConnection1.createOffer()
          .then((description) => this._gotPeerDesciption1(description))
          .catch(function (error) {
            console.log('createOffer failed: ' + error)
          })

      stream.oninactive = function () {
        console.log('Stream inactive:', stream)
        // startButton.disabled = false
        // stopButton.disabled = true
      }

      return new Promise((resolve) => {
        this.peerConnection2.onaddstream = (event) => resolve({
          local: filteredStream,
          remote: event.stream
        })
      })
    } else {
      alert('The media stream contains an invalid number of audio tracks.')
      stream.getTracks().forEach(function (track) {
        track.stop()
      })
    }
  }

  _onIceCandidate (peerConnection, iceEvent) {
    if (iceEvent.candidate) {
      peerConnection.addIceCandidate(iceEvent.candidate)
        .then(
          () => console.log('Successfully added ICE candidate'),
          () => console.error('Failed to add ICE candidate')
        )
      console.log('Local ICE candidate: \n' + iceEvent.candidate.candidate)
    }
  }

  _gotPeerDesciption1 (description) {
    console.log('Offer from pc1 \n' + description.sdp)
    const modifiedOffer = {
      type: 'offer',
      sdp: this._forceOpus(description.sdp)
    }

    this.peerConnection1.setLocalDescription(modifiedOffer)
    console.log('Offer from pc1 \n' + modifiedOffer.sdp)
    this.peerConnection2.setRemoteDescription(modifiedOffer)
    this.peerConnection2.createAnswer()
      .then((otherDescription) => this._gotPeerDescription2(otherDescription))
      .catch(function (error) {
        console.log('createAnswer failed: ' + error)
      })
  }

  _forceOpus (sdp) {
    // Remove all other codecs apart from OPUS (not the video codecs though).
    sdp = sdp.replace(/m=audio (\d+) RTP\/SAVPF.*\r\n/g, 'm=audio $1 RTP/SAVPF 111\r\n')
    sdp = sdp.replace(/a=rtpmap:(?!111)\d{1,3} (?!VP8|red|ulpfec).*\r\n/g, '')
    return sdp
  }

  _gotPeerDesciption2 (description) {
    this.peerConnection2.setLocalDescription(description)
    console.log('Answer from pc2 \n' + description.sdp)
    this.peerConnection1.setRemoteDescription(description)
  }
}
