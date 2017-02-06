<style lang="stylus" scoped>

</style>

<template lang="pug">
  .rotary-input(@mousemove='onMousemove') TODO - UI HERE
</template>

<script>
export default {
  props: {
    min: {
      default: 0
    },

    max: {
      default: 1
    }
  },

  methods: {
    onMousemove () {
      this.$emit('change')
    }
  }
}
</script>
