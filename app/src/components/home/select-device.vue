<style scoped>

</style>

<template>
  <div>
    select device<br />
    <select v-model="selected">
      <option v-for="device of devices" value="device.deviceId">{{getDeviceDisplayName(device)}}</option>
    </select>
  </div>
</template>

<script>
  import Logger from '../../services/logger.js'
  import WebRTCService from '../../services/web-rtc.js'

  export default {
    data () {
      return {
        devices: null,
        selected: null
      }
    },

    components: {

    },

    name: 'select-device',

    mounted () {
      window.navigator.mediaDevices.enumerateDevices()
        .then((deviceInfos) => {
          this.devices = deviceInfos.filter((deviceInfo) => deviceInfo.kind === 'audiooutput')
        })
        .catch(err => Logger.error(err))

      this.webrtc = new WebRTCService()
      this.webrtc.loopback()
        .then((stream) => (this.localStream = stream))
    },

    methods: {
      getDeviceDisplayName (deviceInfo) {
        return deviceInfo.label
      }
    },

    watch: {
      selected (newValue) {
        /* eslint-disable new-cap */
        const context = new window.webkitAudioContext()
        /* eslint-enable new-cap */
        const oscillator = context.createOscillator()
        const gain = context.createGain()

        gain.gain.value = 0.01

        oscillator.connect(gain)
        gain.connect(context.destination)
        oscillator.start(0)
      }
    }
  }
</script>
