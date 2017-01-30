function download (filename, dataURL) {
  var element = document.createElement('a')
  element.setAttribute('href', dataURL)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export default class AudioRecorder {
  static record ({
    audioContext,
    audioNode
  }) {
    const dest = audioContext.createMediaStreamDestination()
    const mediaRecorder = new MediaRecorder(dest.stream)
    audioNode.connect(dest)

    const chunks = []
    mediaRecorder.ondataavailable = function (evt) {
     chunks.push(evt.data)
    }

    mediaRecorder.start()

    return function ({
      filename
    }) {
      mediaRecorder.onstop = function () {
       var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' })
       download(filename + '.ogg', URL.createObjectURL(blob))
      }

      mediaRecorder.stop()
    }
  }
}
