<style lang="stylus" scoped>

</style>

<script>
export default {
  data () {
    return {
      editing: false
    }
  },

  props: {
    element: {
      default: 'div'
    },

    content: {
      default: null
    },

    eventFilter: {
      default: null
    }
  },

  render (createElement) {
    return createElement(
      this.element, {
        ref: 'contentElement',

        domProps: {
          textContent: this.content
        },

        attrs: {
          contenteditable: this.editing
        },

        on: {
          click: this.onClick,
          contextmenu: this.onClick,
          blur: this.onBlur
        }
      }
    )
  },

  methods: {
    onClick (event) {
      const filters = this.eventFilter || {}
      const startEditing = Object.keys(filters)
          .every(filterProperty => event[filterProperty] === filters[filterProperty])

      if (startEditing) {
        this.editing = true

        // TODO: Focus the editable content on next tick...?
      }
    },

    onBlur () {
      if (!this.editing) {
        // Nothing to do if we weren't editing
        return
      }

      this.editing = false

      // Fir ean event to let consumers know the data has updated
      this.$emit('onEditComplete', this.$refs.contentElement.textContent)
    }
  }
}
</script>
