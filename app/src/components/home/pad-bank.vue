<style lang="stylus" scoped>
  .pad-bank
    padding 6vh

    .pad-bank-inner
      display inline-flex
      flex-direction column
      size = 75vh
      height size
      width size

      .row
        flex 1
        display flex
</style>

<template lang="pug">
  .pad-bank
    .pad-bank-inner
      .row(v-for="row in rows")
        pad(v-for="pad in row.pads", :pad='pad', :edit-mode='editMode')
</template>

<script>
  import { mapState } from 'vuex'

  import Pad from './pad.vue'

  export default {
    name: 'pad-bank',

    props: {
      editMode: {
        default: false
      }
    },

    computed: {
      rows () {
        const rows = []
        const pads = this.pads.slice()

        // Naive pad layout creates rows of 4 pads, sequentially
        while (pads.length) {
          rows.push(pads.splice(0, 4))
        }

        // Map to an array of objects, rather than just an array of arrays
        return rows.map(row => ({ pads: row }))
      },

      ...mapState('sampler', ['pads'])
    },

    components: {
      Pad
    }
  }
</script>
