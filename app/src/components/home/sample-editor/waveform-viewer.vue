<style lang="stylus" scoped>
  /*.waveform-viewer
    */
</style>

<template lang="pug">
  svg.waveform-viewer(
    :viewBox='"0 " + viewBoxTop + " 100 " + viewBoxHeight',
    preserveAspectRatio='none'
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
        pointsToShow: null,
        viewBoxTop: 0,
        viewBoxHeight: 100
      }
    },

    props: {
      sample: {
        default: null
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

        return {
          // PERF: Put (potentially large) typed array on '_'-prefixed child property -
          // supposedly vue doesn't add observers to it then (TODO: Is this actually true, and
          // does it skip typed arrays anyway?)
          _data: audioBuffer.getChannelData(0)
        }
      },

      // PERF: Since this method is pretty perf-critical for rendering, it is all done inline,
      // rather than being refactored to smaller methods as would normally be the case
      redrawWaveform: _.debounce(function () {
        const audioData = this.audioData && this.audioData._data
        // TODO: Is it even worth making this (pointsToShow) configurable? If not then remove this!
        const pointsToShow = this.pointsToShow ||
          // Default number of lines based on initial element width (4x seems to give a decent-
          // looking waveform)
          (this.pointsToShow = this.$el.getClientRects()[0].width * 4)

        if (!audioData || !audioData.length) {
          this.waveform = []
          return
        }

        // Return the audioData as a set of waveform 'slices'
        const length = audioData.length
        const nth = Math.floor(length / pointsToShow)
        const width = 100 / pointsToShow
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

          // Track min/max y - so we can scale viewbox if needed
          minY = minY < yExtent ? minY : yExtent
          maxY = maxY > yExtent ? maxY : yExtent

          waveform[i] = { x, y, width }
        }
        // Update our (tracked) property
        this.waveform = waveform

        // Scale our viewBox as needed (so our max amplitude is at ~90% height)
        const limit = Math.max(Math.abs(minY), Math.abs(maxY)) * 1.1
        this.viewBoxHeight = limit * 2
        this.viewBoxTop = 50 - limit
        // NOTE: This has to be a LEADING debounce to get the desired effect of preventing repeated
        // calls when multiple watchers fire together
      }, 100, { leading: true, trailing: false })
    },

    watch: {
      // Recalculate our audioData whenever the source gets changed
      // Using watches in-place of having real async computeds (https://jsfiddle.net/6j7xq7v3/3/) -
      // if proper async-computeds ever become a reality, this can be refactored
      source: {
        immediate: true,
        async handler (source) {
          this.audioData = await this.reloadAudioData(source)
        }
      },

      // TODO: Since redraw is all-sync, "waveform" could be made a computed - what are the perf
      // outcomes with that though...?
      audioData (audioData) {
        this.redrawWaveform()
      },

      pointsToShow () {
        this.redrawWaveform()
      }
    }
  }
</script>
