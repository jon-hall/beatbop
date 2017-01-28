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
    pad-bank
</template>

<script>
  import SelectDevice from './home/select-device.vue'
  import PadBank from './home/pad-bank.vue'

  export default {
    name: 'home',

    components: {
      PadBank,
      SelectDevice
    },

    methods: {
      deviceSelected (deviceId) {
        this.$store.dispatch('sampler/setOutputDevice', { deviceId })
      }
    }
  }
</script>
