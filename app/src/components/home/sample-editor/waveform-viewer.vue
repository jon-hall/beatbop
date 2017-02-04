<style lang="stylus" scoped>
  .waveform-viewer
    height calc(100% - 20px)
    width 100%
</style>

<template lang="pug">
  svg.waveform-viewer(
    :style='{ width: zoom + "%" }',
    :viewBox='"0 " + viewBoxTop + " 100 " + viewBoxHeight',
    preserveAspectRatio='none',
    @wheel='onMousewheel'
  )
    g
      line(
        v-for='slice in waveform',
        stroke=('rgba(100, 170, 250, 1)'),
        :stroke-width='slice.width',
        :x1='slice.x',
        :x2='slice.x',
        y1='50',
        :y2='slice.y'
      )
</template>

<script>
  import _ from 'lodash'

  import { mapTryGet } from '../../../plugins/try-get'

  export default {
    name: 'waveform-viewer',

    data () {
      return {
        waveform: [],
        audioData: null,
        viewBoxTop: 0,
        viewBoxHeight: 100,
        zoom: 100
      }
    },

    props: {
      sample: {
        default: null
      },
      normalize: {
        default: false
      }
    },

    computed: {
      ...mapTryGet({
        source: 'sample.source',
        repeat: 'sample.repeat'
      })
    },

    methods: {
      // Handles asynchronously extracting amplitude data from an audio source URI
      async reloadAudioData (source) {
        const audioCtx = new AudioContext()
        const response = await fetch(source)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

        return audioBuffer.getChannelData(0)
      },

      // PERF: Since this method is pretty perf-critical for rendering, it is all done inline,
      // rather than being refactored to smaller methods as would normally be the case
      redrawWaveform: _.debounce(function () {
        const audioData = this.audioData && this.audioData
        // Set number of lines based on element width (4x seems to give a decent-looking waveform)
        // We also negatively adjust for zoom so the # of elements doesn't get crazy
        const pointsToShow = Math.floor(this.$el.getClientRects()[0].width * 4 / (0.5 * (this.zoom / 200)))

        if (!audioData || !audioData.length) {
          this.waveform = []
          return
        }

        // Return the audioData as a set of waveform 'slices'
        const length = audioData.length
        const nth = Math.floor(length / pointsToShow)
        const width = 100 / pointsToShow
        const normalize = this.normalize
        let minY = 0
        let maxY = 0

        // PERF: Push our data to a temp (**untracked by vue**) array
        const waveform = []
        // PERF: Using a for loop rather than Array#extras
        for (let i = 0; i < pointsToShow; i++) {
          // We filter the data by multiplying where we index 'audioData' by 'nth'
          const amplitude = audioData[i * nth]
          // Calculate how far along the x-axis this slice is
          const x = (i * 100) / pointsToShow
          // And how high it should be (and in which direction)
          const yExtent = (amplitude * 50)
          // Set an x position based around the mid-line (50)
          const y = 50 + yExtent

          if (normalize) {
            // Track min/max y - so we can scale viewbox if needed
            minY = minY < yExtent ? minY : yExtent
            maxY = maxY > yExtent ? maxY : yExtent
          }

          waveform[i] = { x, y, width }
        }
        // Update our (tracked) property
        this.waveform = waveform

        if (!normalize) {
          return
        }

        // Scale our viewBox as needed (so our max amplitude is at ~90% height)
        const limit = Math.max(Math.abs(minY), Math.abs(maxY)) * 1.1
        this.viewBoxHeight = limit * 2
        this.viewBoxTop = 50 - limit
        // NOTE: This has to be a LEADING debounce to get the desired effect of preventing repeated
        // calls when multiple watchers fire together
      }, 100, { leading: true, trailing: false }),

      onMousewheel (event) {
        const delta = event.wheelDelta

        // Ignore legitimate sideways scrolling
        if (event.shiftKey) {
          return
        }

        if (delta < 0) {
          // Zoom out
          this.zoom *= 0.9
        } else {
          this.zoom *= 1.1
        }

        // TODO: We should adjust the current scrollLeft to keep the viewport centred on the current
        // mouse position - only implement if reasonably easy, since this isn't a permanent zooming
        // solution anyway...

        // Prevent scrolling while zooming
        event.preventDefault()
        return false
      }
    },

    watch: {
      // Recalculate our audioData whenever the source gets changed
      // Using watches in-place of having real async computeds (https://jsfiddle.net/6j7xq7v3/3/) -
      // if proper async-computeds ever become a reality, this can be refactored
      source: {
        immediate: true,
        async handler (source) {
          // NOTE: Even though we set a (potentially very large) typed array as a data value, it
          // seems vue skips any attempt to observe it, so shouldn't cause perf/memory usage issues
          this.audioData = await this.reloadAudioData(source)
        }
      },

      // TODO: Since redraw is all-sync, "waveform" could be made a computed - what are the perf
      // outcomes with that though...?
      audioData (audioData) {
        this.redrawWaveform()
      },

      zoom () {
        this.redrawWaveform()
      }
    }
  }
</script>
