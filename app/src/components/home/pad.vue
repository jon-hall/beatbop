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
    @dragenter.prevent='suppressDragEvent',
    @dragover.prevent='onDragOver',
    @dragend.prevent='suppressDragEvent',
    @dragleave.prevent='suppressDragEvent',
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
      icon-button.edit-button.sample-edit-button(
        icon='cog',
        title='Edit this sample',
        @click='setEditingSample({ sample })'
      )
    editable-content.pad-label(
      v-if='sampleTitle',
      :content='sampleTitle',
      :enabled='editMode',
      :eventFilter='{ button: 2 }',
      @onEditComplete='onSampleTitleChanged'
    )
</template>

<script>
  import { mapActions } from 'vuex'

  import { mapTryGet } from '../../plugins/try-get'

  import EditableContent from '../widgets/editable-content.vue'
  import IconButton from '../widgets/icon-button.vue'

  export default {
    name: 'pad',

    props: ['pad', 'editMode'],

    computed: {
      ...mapTryGet({
        padActivated: 'pad.activated',
        sample: 'pad.sample',
        sampleDevice: 'pad.sample.outputDevice',
        sampleRepeat: 'pad.sample.repeat',
        sampleSource: 'pad.sample.source',
        sampleTitle: 'pad.sample.title'
      }),

      // Handle creation of the audio node with a computed - this way it'll automatically get
      // rebuilt when any of its dependent properties change
      audioNode () {
        const audio = new Audio(this.sampleSource)
        audio.loop = this.sampleRepeat

        const deviceId = this.sampleDevice
        if (deviceId && deviceId !== 'default') {
          // If we're on a non-default output, try setting the sinkId now - dispatch the failure
          // action if we fail to set it
          audio.setSinkId(deviceId)
            .catch(() => {
              // TODO: Inject logger service...
              console.log(`Set sink id failed (id: ${deviceId})`)

              this.$store.dispatch('sampler/setOutputDeviceFailed', { pad: this.pad, deviceId })
            })
        }

        return audio
      }
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

      ...mapActions('sample-editor', [
        'setEditingSample'
      ]),

      tryActivatePad ({ pad }) {
        if (this.editMode) {
          // Do nothing in edit mode
          return
        }

        // Attach a mouseup listener on window so we don't get stuck 'down' if the user moves their
        // cursor off the pad before releasing
        const mouseupHandler = () => {
          // Cleanup our window-level event listener (and local handler cache)
          window.removeEventListener('mouseup', mouseupHandler)

          // Deactivate this pad
          this.deactivatePad({ pad })
        }
        window.addEventListener('mouseup', mouseupHandler)

        return this.activatePad({ pad })
      },

      suppressDragEvent () {
        // Do nothing...
      },

      onDragOver (event) {
        event.dataTransfer.dropEffect = 'copy'
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

      onSampleTitleChanged (title) {
        this.setSampleTitle({
          sample: this.sample,
          title
        })
      }
    },

    watch: {
      padActivated (activated) {
        const audio = this.audioNode

        if (!audio) {
          return
        }

        if (activated) {
          audio.play()
        } else {
          audio.pause()
          audio.currentTime = 0
        }
      }
    }
  }
</script>
