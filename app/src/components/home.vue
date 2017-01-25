<style lang="stylus" scoped>
  .home
    padding 2rem
    flex 1
    height 100%

    .header
      padding 2rem 0
      display flex
      justify-content space-between
      align-items center

    .highlight
      color rgb(78, 168, 219)
</style>

<template lang="pug">
  .home
    .header
      h1 beat
        span.highlight bop
      select-device(@selection='deviceSelected')
    audio(ref='audio', controls)
      source(src='https://archive.org/download/testmp3testfile/mpthreetest.mp3')
</template>

<script>
  import SelectDevice from './home/select-device.vue'

  export default {
    name: 'home',

    components: {
      SelectDevice
    },

    methods: {
      deviceSelected (deviceId) {
        this.$refs.audio.setSinkId(deviceId)
      }
    }
  }
</script>
