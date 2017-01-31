<style lang="stylus">
  .pad
    margin 0.6rem
    flex 1
    display flex
    flex-direction column
    background rgba(195, 195, 195, 1)
    cursor pointer
    border-radius 0.2rem

    &:hover
      background rgba(205, 205, 205, 1)

    &.activated
      background rgba(149, 203, 236, 1)

    &.editMode:hover
      background rgba(197, 217, 230, 1)

      .pad-label
        -webkit-user-select default

        &:hover
          background rgba(255, 255, 245, 0.8)

    .pad-label
      margin-top auto
      margin-bottom 0
      text-align center
      width 100%
      margin-bottom 0.5rem
      padding 0.5rem 0.2rem
      background rgba(255, 255, 245, 0.5)
      font-size 1.2rem
      font-weight 600
      -webkit-user-select none

    .edit-buttons
      opacity 1
      transition all 0.3s ease-out
      display flex
      justify-content space-around
      padding 0.5rem

      i.fa
        font-size 2vh

      &.hidden
        opacity 0

      /*.edit-button*/


        /*&.loop-button*/

</style>

<template lang="pug">
  .pad(
    :title='file',
    :class='{ activated: padActivated, editMode }',
    @mousedown='tryActivatePad({ pad })',
    @mouseup='tryDeactivatePad({ pad })',
    @dragenter.prevent='onDragEnter',
    @dragover.prevent='onDragOver',
    @dragend.prevent='onDragEnd',
    @dragleave.prevent='onDragEnd',
    @drop.prevent='onDrop'
  )
    .edit-buttons(:class='{ hidden: !editMode }')
      icon-button.edit-button.loop-button(
        icon='repeat',
        title='Enable looping for sample',
        toggle-title='Disable looping for sample',
        :toggle='true',
        :toggled='sampleRepeat',
        @click='toggleSampleRepeat({ sample })'
      )
    editable-content.pad-label(
      v-if='sampleTitle',
      content='sampleTitle',
      :enabled='editMode',
      :eventFilter='{ button: 2 }',
      @onEditComplete='onSampleTitleChanged'
    )
    audio(v-if='hasAudio', ref='audio', :loop='sampleRepeat')
      source(:src='sampleSource')
</template>

<script>
  import { mapActions } from 'vuex'

  import { mapTryGet } from '../../plugins/try-get'

  import EditableContent from '../widgets/editable-content.vue'
  import IconButton from '../widgets/icon-button.vue'

  export default {
    name: 'pad',

    data () {
      return {
        hasAudio: true
      }
    },

    props: ['pad', 'editMode'],

    computed: {
      ...mapTryGet({
        padActivated: 'pad.activated',
        sampleSource: 'pad.sample.source',
        sampleDevice: 'pad.sample.outputDevice',
        sampleTitle: 'pad.sample.title',
        sample: 'pad.sample',
        sampleRepeat: 'pad.sample.repeat'
      })
    },

    components: {
      EditableContent,
      IconButton
    },

    methods: {
      ...mapActions('sampler', [
        'activatePad',
        'deactivatePad',
        'setSampleFromBlob',
        'setSampleTitle',
        'toggleSampleRepeat'
      ]),

      tryActivatePad ({ pad }) {
        if (this.editMode) {
          // Do nothing in edit mode
          return
        }

        return this.activatePad({ pad })
      },

      tryDeactivatePad ({ pad }) {
        if (this.editMode) {
          // Do nothing in edit mode
          return
        }

        return this.deactivatePad({ pad })
      },

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
        const file = event.dataTransfer.files && event.dataTransfer.files[0]

        if (!file) {
          return
        }

        const title = file.name // TODO: Get an actual title from user...
        if (this.sample) {
          this.setSampleFromBlob({
            sample: this.sample,
            title,
            filename: file.name,
            blob: file
          })
        }
      },

      recreateAudioNode () {
        this.hasAudio = false
        this.$nextTick(() => (this.hasAudio = true))
      },

      onSampleTitleChanged (title) {
        this.setSampleTitle({
          sample: this.sample,
          title
        })
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

      sampleSource () {
        // When the source changes, we have to regenerate the audio element...
        this.recreateAudioNode()
      },

      sampleDevice (deviceId) {
        const audio = this.$refs.audio

        if (audio) {
          // HACK: To get back to default, our easiest (safest?) option is to simply re-render the
          // audio element - this allows robust recovery when setSinkId fails
          if (!deviceId || deviceId === 'default') {
            this.recreateAudioNode()
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
