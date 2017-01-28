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
    @mousedown='activatePad({ pad })',
    @mouseup='deactivatePad({ pad })',
    @dragenter.prevent='onDragEnter',
    @dragover.prevent='onDragOver',
    @dragend.prevent='onDragEnd',
    @dragleave.prevent='onDragEnd',
    @drop.prevent='onDrop'
  )
    audio(v-if='hasAudio', ref='audio')
      source(:src='sampleFile')
</template>

<script>
  import { mapActions } from 'vuex'

  import { mapTryGet } from '../../plugins/try-get'

  export default {
    name: 'pad',

    data () {
      return {
        hasAudio: true
      }
    },

    props: ['pad'],

    computed: {
      ...mapTryGet({
        padActivated: 'pad.activated',
        sampleFile: 'pad.sample.file',
        sampleDevice: 'pad.sample.outputDevice'
      })
    },

    methods: {
      ...mapActions('sampler', [
        'activatePad',
        'deactivatePad'
      ]),

      onDragEnter () {

      },

      onDragOver (event) {
        event.dataTransfer.dropEffect = 'copy'
      },

      onDragEnd () {

      },

      onDrop (event) {
        // TODO: Dispatch the store and load file action - this persists it via electron AND loads it
        // back in for use on this pad...
        console.log(event.dataTransfer.files && event.dataTransfer.files[0])
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

              this.$store.dispatch('sampler/setOutputDeviceFailed', { pad: this.pad, deviceId })
            })
        }
      }
    }
  }
</script>
