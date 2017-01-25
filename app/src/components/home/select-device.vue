<style lang="stylus" scoped>
  .label-text
    margin-right 1rem
    color rgba(0, 0, 0, 0.5)
    font-size 1.2rem
    font-weight bold

  select
    max-width 14rem
</style>

<template lang="pug">
  div
    label
      span.label-text OUTPUT DEVICE
      select(@change='onSelect')
        option(
          v-for='device of devices',
          :value='device.deviceId',
          :selected='selected === device.deviceId'
        ) {{getDeviceDisplayName(device)}}
</template>

<script>
  import Logger from '../../services/logger.js'

  export default {
    name: 'select-device',

    data () {
      return {
        devices: null
      }
    },

    computed: {
      selected () {
        // HACK: This is grim - fixme plz!
        return this.$store.state.pads &&
          this.$store.state.pads.items &&
          this.$store.state.pads.items[0] &&
          this.$store.state.pads.items[0].sample &&
          this.$store.state.pads.items[0].sample.outputDevice
      }
    },

    mounted () {
      window.navigator.mediaDevices.enumerateDevices()
        .then((deviceInfos) => {
          this.devices = deviceInfos.filter((deviceInfo) => deviceInfo.kind === 'audiooutput')
        })
        .catch(err => Logger.error(err))
    },

    methods: {
      getDeviceDisplayName (deviceInfo) {
        return deviceInfo.label
      },

      onSelect (event) {
        this.$emit('selection', event.target.value)
      }
    }
  }
</script>
