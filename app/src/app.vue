<style lang="stylus">
  @import url(https://fonts.googleapis.com/css?family=Lato:300)

  *
    margin 0
    padding 0

  html,body
    height 100%
    font-size 10px

  body
    background radial-gradient(
        ellipse at center,
        rgba(255, 255, 255, 1) 0%,
        rgba(229, 229, 229, .85) 100%
      )
    background-position center
    font-family Lato, Helvetica, sans-serif
    font-size 1.6rem

    .app-content
      height 100%
      display flex
      align-items center
      justify-content center
      text-align center
</style>

<template lang="pug">
  .app-content
    router-view
</template>

<script>
  import store from 'src/vuex/store'

  export default {
    store
  }
</script>
