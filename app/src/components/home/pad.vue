<style lang="stylus" scoped>
  .pad
    margin 0.6rem
    flex 1
    background rgba(195, 195, 195, 1)
    cursor pointer
    border-radius 0.2rem

    &:hover
      background rgba(205, 205, 205, 1)

    &.activated
      background rgba(149, 203, 236, 1)
</style>

<template lang="pug">
  .pad(
    :title='file',
    :class='{ activated: padActivated }',
    @mousedown='onPadDown',
    @mouseup='onPadUp'
  )
    audio(v-if='hasAudio', ref='audio')
      source(:src='sampleFile')
</template>

<script>
  export default {
    name: 'pad',

    data () {
      return {
        hasAudio: true
      }
    },

    props: ['pad'],

    computed: {
      padActivated () {
        return this.pad && this.pad.activated
      },

      sampleFile () {
        return this.pad && this.pad.sample && this.pad.sample.file
      },

      sampleDevice () {
        return this.pad && this.pad.sample && this.pad.sample.outputDevice
      }
    },

    methods: {
      onPadDown () {
        this.$store.dispatch('pads/activatePad', { pad: this.pad })
      },

      onPadUp () {
        this.$store.dispatch('pads/deactivatePad', { pad: this.pad })
      }
    },

    watch: {
      padActivated (activated) {
        const audio = this.$refs.audio

        if (activated) {
          audio.play()
        } else {
          audio.pause()
          audio.currentTime = 0
        }
      },

      sampleDevice (deviceId) {
        const audio = this.$refs.audio

        if (audio) {
          // HACK: To get back to default, our easiest (safest?) option is to simply re-render the
          // audio element - this allows robust recovery when setSinkId fails
          if (!deviceId || deviceId === 'default') {
            this.hasAudio = false
            this.$nextTick(() => (this.hasAudio = true))
            return
          }

          audio.setSinkId(deviceId)
            .catch(() => {
              // TODO: Inject logger service...
              console.log(`Set sink id failed (id: ${deviceId})`)

              this.$store.dispatch('pads/setOutputDeviceFailed', { pad: this.pad, deviceId })
            })
        }
      }
    }
  }
</script>
