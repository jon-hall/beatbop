<style scoped>
  .highlight {
    color: rgb(78, 168, 219);
  }
</style>

<template>
  <div>
    <h1>beat<span class="highlight">bop</span></h1>
    <select-device></select-device>
  </div>
</template>

<script>
  import SelectDevice from './home/select-device.vue'

  export default {
    components: {
      SelectDevice
    },

    name: 'home'
  }
</script>
