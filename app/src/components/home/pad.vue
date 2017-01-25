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
    audio(ref='audio')
      source(:src='sampleFile')
</template>

<script>
  export default {
    name: 'pad',

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
          audio.setSinkId(deviceId)
            .catch((err) => {
              console.log(`setSinkId failed (deviceId: ${deviceId}), restoring default sinkId...`, err)
              // TODO: Several issues here -
              //   * We should debounce, since this normally occurs as a batch of several failures,
              //     but we only need to dispatch the action ONCE
              //   * This can enter an infinite loop if default repeatedly fails - we should limit
              //     the number of retries somehow (seems this retyr should be a separate, special,
              //     action)
              //   * We should display an error message to the user - again this should be its onPadDown
              //     action specifically for trying to restore default after an error...
              this.$store.dispatch('pads/setOutputDevice', { deviceId: 'default' })
            })
        }
      }
    }
  }
</script>
