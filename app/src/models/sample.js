export default class Sample {
  constructor ({
    // lul, replace this...
    file = 'https://www.freesound.org/data/previews/8/8803_2518-lq.mp3',
    outputDevice,
    loop = true
  } = {}) {
    this.file = file
    this.outputDevice = outputDevice
    this.loop = true
  }
}
