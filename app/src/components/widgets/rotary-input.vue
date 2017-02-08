<style lang="stylus" scoped>

</style>

<template lang="pug">
  .rotary-input(@mousedown='onMousedown') TODO - UI HERE
</template>

<script>
export default {
  name: 'rotary-input',

  data () {
    return {
      internalValue: this.value
    }
  },

  props: {
    minValue: {
      default: 0
    },

    maxValue: {
      default: 1
    },

    minRotation: {
      default: -120
    },

    maxRotation: {
      default: 120
    },

    value: {
      default: 0.5
    },

    sensitivity: {
      // 400px of vertical movement equates to a full range change (e.g. from center, dragging
      // 200px up or down gets you the max or min value, respectively)
      default: 400
    }
  },

  computed: {
    valueRange () {
      return this.maxValue - this.minValue
    }
  },

  methods: {
    onMousedown () {
      // Add a handler which calls our onMousemove event, in the correct context, but against window,
      // so we can track movements outside of this element (or even the window, while the user drags)
      const onMousemove = (event) => this.onMousemove(event)
      window.addEventListener('mousemove', onMousemove)

      // Also add a listener for mouse up, so we stop tracking movement events when user releases
      const onMouseup = () => {
        // Remove both the mousemove listener, and this listener
        window.removeEventListener('mousemove', onMousemove)
        window.removeEventListener('mouseup', onMouseup)
      }
      window.addEventListener('mouseup', onMouseup)
    },

    onMousemove (event) {
      // PERF: Don't update (vue-observed) property, or fire a change event when we're trying to go
      // beyond a limit, or when we didn't move (since neither will produce a value change)
      if (
        !event.movementY ||
        (this.internalValue === this.minValue && event.movementY > 0) &&
        (this.internalValue === this.maxValue && event.movementY < 0)
      ) {
        return
      }

      const newValue = this.internalValue + (this.valueRange * (-event.movementY / this.sensitivity))

      // Make sure we only update within our bounds
      this.internalValue = Math.min(Math.max(newValue, this.minValue), this.maxValue)

      this.$emit('change', { value: this.internalValue })
    }
  },

  watch: {
    value (newValue) {
      // TODO: Sync prop updates to our internal value to allow external value updates (TEST!)
    }
  }
}
</script>
