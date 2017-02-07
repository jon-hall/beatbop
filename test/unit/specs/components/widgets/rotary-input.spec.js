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

  describe(`when the user does not click down`, () => {
    describe(`and does move the mouse`, () => {
      it(`then it should not fire a "change" event`, () => {
        let calls = 0
        createRotaryInput({
          on: {
            change () {
              // This shouldn't be called
              calls++
            }
          }
        })

        const movementY = 10
        mouseEvent(window, 'mousemove', { movementY })
        expect(calls).to.equal(0)
      })
    })
  })

  describe(`when the user clicks down`, () => {
    describe(`and doesn't move the mouse`, () => {
      describe(`and releases the mouse button`, () => {
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

          mouseEvent(vm.$el, 'mousedown')
          mouseEvent(vm.$el, 'mouseup')
          expect(calls).to.equal(0)
        })

        describe(`and then moves the mouse`, () => {
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

            mouseEvent(vm.$el, 'mousedown')
            // TODO: Why does this not bubble in test (even when we wait a [Vue] tick?)
            mouseEvent(window, 'mouseup')

            const movementY = 10
            mouseEvent(window, 'mousemove', { movementY })
            expect(calls).to.equal(0)
          })
        })
      })
    })

    describe(`and does move the mouse`, () => {
      it(`then it should fire a "change" event, with a "value"`, () => {
        let value
        const minValue = 0
        const maxValue = 100
        const initialValue = 50
        const sensitivity = 200
        const vm = createRotaryInput({
          on: {
            change (event) {
              value = event.value
            }
          },
          props: {
            minValue,
            maxValue,
            value: initialValue,
            sensitivity
          }
        })

        mouseEvent(vm.$el, 'mousedown')
        const movementY = 10
        mouseEvent(window, 'mousemove', { movementY })
        expect(value).to.equal(initialValue - ((movementY / sensitivity) * (maxValue - minValue)))
      })
    })
  })
})
/* eslint-enable quotes */
