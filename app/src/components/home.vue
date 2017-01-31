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
        padding 0.5rem 12rem
        text-align center
        background rgba(0, 0, 0, 0.2)
        color $highlight
        font-size 2rem
        transition all 0.3s ease-out
        opacity 1

        &.hidden
          opacity 0

    .header
      display flex
      justify-content space-between
      align-items center

      .app-title
        font-size 7vmin

    .highlight
      color $highlight
</style>

<template lang="pug">
  .home
    .editing-overlay
      .editing-overlay-inner(:class='{ hidden: !editMode }') EDIT MODE
    .header
      h1.app-title beat
        span.highlight bop
      select-device(@selection='deviceSelected')
    pad-bank(:edit-mode="editMode")
</template>

<script>
  import SelectDevice from './home/select-device.vue'
  import PadBank from './home/pad-bank.vue'

  const KEYCODE_E_WITH_CTRL = 5

  export default {
    name: 'home',

    data () {
      return {
        // TODO: Move this into vuex?
        editMode: false
      }
    },

    components: {
      PadBank,
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

        this.editMode = !this.editMode
      },

      deviceSelected (deviceId) {
        this.$store.dispatch('sampler/setOutputDevice', { deviceId })
      }
    }
  }
</script>
