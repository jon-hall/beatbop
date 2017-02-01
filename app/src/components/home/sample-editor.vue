<style lang="stylus" scoped>
  .sample-editor
    background rgba(250, 250, 250, 1)
    padding 1rem
    display flex
    flex-direction column
    box-shadow 0 0 0.3rem rgba(0, 0, 0, 0.7)

    .sample-editor-title
      font-size 2rem
      padding 0.5rem

    .sample-editor-subtitle
      color rgba(150, 150, 150, 1)
      padding-bottom 1rem

    .sample-visualizer
      width 100vh
      height 40vh
</style>

<template lang="pug">
  .sample-editor
    .sample-editor-title SAMPLE EDITOR
    .sample-editor-subtitle {{sample.title}}
    canvas.sample-visualizer(ref='visualizer')
</template>

<script>
  import { mapTryGet } from '../../plugins/try-get'

  export default {
    name: 'sample-editor',

    props: {
      sample: {
        default: null
      }
    },

    computed: {
      ...mapTryGet({
        source: 'sample.source'
      })
    },

    methods: {
      drawWaveform (source) {
        const audioCtx = new AudioContext()

        // Use fetch to allow us to load in an array buffer of the audio data, then use the context
        // to extract a Float32Array array of amplitude samples (our waveform) for rendering
        fetch(source)
          .then(res => res.arrayBuffer())
          .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
          .then(audioData => this.renderAudioData(audioData.getChannelData(0)))
      },

      // TODO: Abstract this to a service or a separate 'waveform viewer' component...?
      renderAudioData (audioData) {
        const canvas = this.$refs.visualizer
        const height = canvas.height
        const width = canvas.width
        const canvasCtx = canvas.getContext('2d')
        canvasCtx.clearRect(0, 0, width, height)

        canvasCtx.fillStyle = 'rgb(200, 200, 200)'
        canvasCtx.fillRect(0, 0, width, height)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = 'rgb(0, 120, 200)'

        canvasCtx.beginPath()

        const dataLength = audioData.length
        // For now we'll treat the canvas width as the maximum number of samples we'll bother rendering
        const MAX_RENDERABLE_SAMPLES = width
        const increment = Math.ceil(dataLength / MAX_RENDERABLE_SAMPLES)
        const sliceWidth = width * increment / dataLength
        for (let index = 0, x = 0; index < dataLength; index += increment) {
          // TODO: Do we get a better waveform if we do some kind of computation/averaging over
          // skipped samples? (it may turn out to just 'mute' the result by bringing it closer to 0)
          const positiveAmplitude = audioData[index] + 1
          const y = positiveAmplitude * height / 2

          if (index === 0) {
            canvasCtx.moveTo(x, y)
          } else {
            canvasCtx.lineTo(x, y)
          }

          x += sliceWidth
        }

        canvasCtx.lineTo(width, height / 2)
        canvasCtx.stroke()
      }
    },

    watch: {
      source: {
        immediate: true,
        handler (source) {
          this.drawWaveform(source)
        }
      }
    }
  }
</script>
