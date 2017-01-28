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
  import { mapState } from 'vuex'

  import { mapTryGet } from '../../plugins/try-get'

  import Logger from '../../services/logger.js'

  export default {
    name: 'select-device',

    data () {
      return {
        devices: null
      }
    },

    computed: {
      ...mapState('sampler', ['pads']),
      // HACK: This is grim - fixme plz! (only viable once we have per-pad output selection...)
      ...mapTryGet({
        selected: 'pads.items[0].sample.outputDevice'
      })
    },

    async mounted () {
      try {
        const deviceInfos = await window.navigator.mediaDevices.enumerateDevices()
        this.devices = deviceInfos.filter((deviceInfo) => deviceInfo.kind === 'audiooutput')
      } catch (ex) {
        Logger.error(ex)
      }
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
