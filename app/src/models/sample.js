export default class Sample {
  constructor ({
    // lul, replace this...
    filename = 'sine-wave.mp3',
    title = 'Sine Wave',
    source = 'https://www.freesound.org/data/previews/8/8803_2518-lq.mp3',
    outputDevice,
    repeat = true
  } = {}) {
    this.filename =
    this.title = title
    this.source = source
    this.outputDevice = outputDevice
    this.repeat = true
  }

  setSourceFromBlob ({
    filename,
    title,
    blob
  }) {
    this.source = URL.createObjectURL(blob)
    this.title = title
    this.filename = filename
  }
}
