<style lang="stylus" scoped>

</style>

<script>
const KEYCODE_NEWLINE = ('\n').charCodeAt(0)

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

    enabled: {
      default: false
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
          // Use mousedown so we can enable contenteditable and focus the editor in a single click
          mousedown: this.onMousedown,
          // Use keypress, since keydown fires repeatedly for holding modifiers etc.
          keypress: this.onKeypress,
          blur: this.endEditing
        }
      }
    )
  },

  methods: {
    onMousedown (event) {
      if (this.editing || !this.enabled) {
        return
      }

      this.editing = true
    },

    onKeypress (event) {
      if (!this.editing || event.which !== KEYCODE_NEWLINE || !event.ctrlKey) {
        // Bail when not editing/key wasn't enter/ctrl isn't being held
        return
      }

      // End editing when enter is hit
      this.endEditing()
    },

    endEditing () {
      if (!this.editing) {
        // Nothing to do if we weren't editing
        return
      }

      this.editing = false

      // Fir ean event to let consumers know the data has updated
      this.$emit('onEditComplete', this.$refs.contentElement.textContent)
    }
  },

  watch: {
    enabled (isEnabled) {
      // If we get disabled, make sure we stop editing
      if (this.editing && !isEnabled) {
        this.endEditing()
      }
    }
  }
}
</script>
