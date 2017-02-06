import Vue from 'vue'
import RotaryInput from 'src/components/widgets/rotary-input'

function createRotaryInput (options = {}) {
  return new Vue({
    el: document.createElement('div'),
    render: h => h(RotaryInput, options)
  }).$mount()
}

function mouseEvent (target, type, options) {
  const event = new MouseEvent(type, Object.assign({
    view: window,
    bubbles: true,
    cancellable: true
  }, options))

  return target.dispatchEvent(event)
}

// Writing spec context is easier with template strings
/* eslint-disable quotes */
describe(`RotaryInput.vue`, () => {
  it(`should render correct contents`, () => {
    const vm = createRotaryInput()

    expect(Array.from(vm.$el.classList)).to.contain('rotary-input')
  })

  describe(`when the user clicks down`, () => {
    describe(`and doesn't move the mouse`, () => {
      describe(`and releases without moving the mouse`, () => {
        it(`then it should not fire a "change" event`, () => {
          let calls = 0
          const vm = createRotaryInput({
            on: {
              change () {
                // This shouldn't be called
                calls++
              }
            }
          })

          // TODO: Add coords here..?
          mouseEvent(vm.$el, 'mousedown')
          mouseEvent(vm.$el, 'mouseup')
          expect(calls).to.equal(0)
        })
      })
    })

    describe(`and does move the mouse`, () => {
      it(`then it should fire a "change" event`, () => {
        let calls = 0
        const vm = createRotaryInput({
          on: {
            change () {
              calls++
            }
          }
        })

        // TODO: Add coords here...
        mouseEvent(vm.$el, 'mousedown')
        mouseEvent(vm.$el, 'mousemove')
        expect(calls).to.equal(1)
      })
    })
  })
})
/* eslint-enable quotes */
