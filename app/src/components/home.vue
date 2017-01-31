<style lang="stylus" scoped>
  .home
    padding 2rem
    flex 1
    height 100%

    .header
      display flex
      justify-content space-between
      align-items center

      .app-title
        font-size 7vmin

    .highlight
      color rgb(78, 168, 219)
</style>

<template lang="pug">
  .home
    .header
      h1.app-title beat
        span.highlight bop
      select-device(@selection='deviceSelected')
    pad-bank(:edit-mode="editMode")
</template>

<script>
  import SelectDevice from './home/select-device.vue'
  import PadBank from './home/pad-bank.vue'

  const KEYCODE_LEFT_CONTROL = 17

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
      window.addEventListener('keydown', (event) => this.onKeyDown(event))
      window.addEventListener('keyup', (event) => this.onKeyUp(event))
    },

    methods: {
      onKeyDown (event) {
        if (event.which !== KEYCODE_LEFT_CONTROL || this.editMode) {
          return
        }

        this.editMode = true
      },

      onKeyUp (event) {
        if (event.which !== KEYCODE_LEFT_CONTROL || !this.editMode) {
          return
        }

        this.editMode = false
      },

      deviceSelected (deviceId) {
        this.$store.dispatch('sampler/setOutputDevice', { deviceId })
      }
    }
  }
</script>
