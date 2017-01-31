<style lang="stylus" scoped>
  @require '../../styles/palette'

  .icon-button
    background transparent
    border none
    outline none
    color $highlight
    cursor pointer
    padding 0.4rem
    border-radius 0.2rem

    &:hover
      background rgba(255, 255, 255, 0.3)

    &:active
      color darken($highlight, 10%)
      background rgba(210, 235, 255, 0.5)

    &.toggle
      color rgba(140, 140, 140, 1)

      &.toggled
        color $highlight

</style>

<template lang="pug">
  button.icon-button(@click='onClick',:class='{ toggled, toggle }',:title='currentTitle')
    i.fa(:class='"fa-" + icon', v-if='icon')
</template>

<script>
export default {
  props: {
    icon: {
      default: null
    },

    toggle: {
      default: false
    },

    toggled: {
      default: false
    },

    title: {
      default: null
    },

    toggleTitle: {
      default: null
    }
  },

  computed: {
    currentTitle () {
      return this.toggle && this.toggled ? this.toggleTitle : this.title
    }
  },

  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>
