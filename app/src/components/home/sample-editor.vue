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

    },

    watch: {
      source: {
        immediate: true,
        handler (source) {
          this.$nextTick(() => {
            // TODO: Visualize source...
            const audio = new Audio(source)
            audio.crossOrigin = 'anonymous'

            const audioCtx = new AudioContext()
            const analyser = audioCtx.createAnalyser()
            const audioSource = audioCtx.createMediaElementSource(audio)
            audioSource.connect(analyser)

            const canvas = this.$refs.visualizer
            const height = canvas.height
            const width = canvas.width
            const canvasCtx = canvas.getContext('2d')

            analyser.fftSize = 2048
            const bufferLength = analyser.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            canvasCtx.clearRect(0, 0, width, height)

            canvasCtx.fillStyle = 'rgb(200, 200, 200)'
            canvasCtx.fillRect(0, 0, width, height)

            canvasCtx.lineWidth = 2
            canvasCtx.strokeStyle = 'rgb(0, 0, 0)'

            canvasCtx.beginPath()
            const sliceWidth = width * 1.0 / bufferLength
            let x = 0

            audio.play()
            setTimeout(() => {
              analyser.getByteTimeDomainData(dataArray)
              for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0
                const y = v * height / 2

                if (i === 0) {
                  canvasCtx.moveTo(x, y)
                } else {
                  canvasCtx.lineTo(x, y)
                }

                x += sliceWidth
              }

              canvasCtx.lineTo(width, height / 2)
              canvasCtx.stroke()
            }, 500)
          })
        }
      }
    }
  }
</script>
