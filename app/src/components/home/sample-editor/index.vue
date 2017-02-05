<style lang="stylus" scoped>
  .sample-editor
    position relative
    padding 1rem
    display flex
    flex-direction column
    background rgba(250, 250, 250, 1)
    box-shadow 0 0 0.3rem rgba(0, 0, 0, 0.7)

    .sample-editor-title
      font-size 2rem
      padding 0.5rem

    .sample-editor-subtitle
      color rgba(150, 150, 150, 1)
      padding-bottom 1rem

    .close-button
      position absolute
      top 0.5rem
      right 1rem
      font-size 2.2rem

      &:not(:hover)
        color rgba(150, 150, 150, 1)

    .editor-controls
      margin 1rem
      margin-bottom 1.5rem
      display flex
      flex-direction column
      align-items flex-end

      .editor-control-group
        .editor-button
          font-size 2.2rem
          margin 0 0.5rem

          &.toggled
            background rgba(150, 180, 255, 0.3)

    .sample-visualizer
      width 100vh
      height 40vh
      overflow auto
</style>

<template lang="pug">
  .sample-editor
    .sample-editor-title SAMPLE EDITOR
    .sample-editor-subtitle {{sample.title}}
    icon-button.close-button(
      icon='times',
      title='Close sample editor',
      @click='setEditingSample({ sample: null })'
    )
    .editor-controls
      .editor-control-group
        icon-button.editor-button.toggle-button(
          icon='hand-o-down',
          title='Enable toggle (press to start, press to stop) for sample',
          toggle-title='Disable toggle (press to start, press to stop) for sample',
          :toggle='true',
          :toggled='toggle',
          @click='toggleSampleToggle({ sample })'
        )
        icon-button.editor-button.loop-button(
          icon='repeat',
          title='Enable looping for sample',
          toggle-title='Disable looping for sample',
          :toggle='true',
          :toggled='repeat',
          @click='toggleSampleRepeat({ sample })'
        )
    .sample-visualizer
      waveform-viewer(:sample='sample')
</template>

<script>
  import { mapActions } from 'vuex'

  import { mapTryGet } from '../../../plugins/try-get'

  import IconButton from '../../widgets/icon-button.vue'
  import WaveformViewer from './waveform-viewer.vue'

  export default {
    name: 'sample-editor',

    props: {
      sample: {
        default: null
      }
    },

    computed: {
      ...mapTryGet({
        source: 'sample.source',
        repeat: 'sample.repeat',
        toggle: 'sample.toggle'
      })
    },

    components: {
      IconButton,
      WaveformViewer
    },

    methods: {
      ...mapActions('sampler', [
        'toggleSampleRepeat',
        'toggleSampleToggle'
      ]),

      ...mapActions('sample-editor', [
        'setEditingSample'
      ])
    }
  }
</script>
