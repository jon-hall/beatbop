<style lang="stylus" scoped>
  @require '../styles/palette'

  .home
    padding 2rem
    flex 1
    height 100%

    .editing-overlay
      position absolute
      top 1rem
      left 0
      right 0
      display flex
      justify-content center

      .editing-overlay-inner
        padding 1vmin 12vmin
        text-align center
        background rgba(0, 0, 0, 0.2)
        color $highlight
        font-size 3vmin
        transition all 0.3s ease-out
        opacity 0.3
        cursor pointer

        &.enabled
          opacity 1

    .header
      display flex
      justify-content space-between
      align-items center

      .app-title
        -webkit-user-select none
        font-size 7vmin

    .highlight
      color $highlight

    .sample-editor-wrapper
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      display flex
      align-items center
      justify-content center
</style>

<template lang="pug">
  .home
    .editing-overlay
      .editing-overlay-inner(:class='{ enabled: editMode }',@click="toggleEditMode") EDIT MODE
    .header
      h1.app-title beat
        span.highlight bop
      select-device(@selection='deviceSelected')
    pad-bank(:edit-mode="editMode")
    .sample-editor-wrapper(v-if='editingSample')
      sample-editor(:sample='editingSample')
</template>

<script>
  import { mapState } from 'vuex'

  import SelectDevice from './home/select-device.vue'
  import PadBank from './home/pad-bank.vue'
  import SampleEditor from './home/sample-editor/index.vue'

  const KEYCODE_E_WITH_CTRL = 5

  export default {
    name: 'home',

    data () {
      return {
        // TODO: Move this into vuex?
        editMode: false
      }
    },

    computed: {
      ...mapState('sample-editor', {
        editingSample: 'sample'
      })
    },

    components: {
      PadBank,
      SampleEditor,
      SelectDevice
    },

    mounted () {
      window.addEventListener('keypress', (event) => this.onKeyPress(event))
    },

    methods: {
      onKeyPress (event) {
        // Ctrl+E toggles edit mode
        if (!event.ctrlKey || event.which !== KEYCODE_E_WITH_CTRL) {
          return
        }

        this.toggleEditMode()
      },

      toggleEditMode () {
        this.editMode = !this.editMode
      },

      deviceSelected (deviceId) {
        this.$store.dispatch('sampler/setOutputDevice', { deviceId })
      }
    }
  }
</script>
