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

    function movementTest (moves, {
      minValue = 0,
      maxValue = 100,
      initialValue = 50,
      sensitivity = 200
    } = {}) {
      let values = []

      const vm = createRotaryInput({
        on: {
          change (event) {
            values.push(event.value)
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
      moves.forEach(move => mouseEvent(window, 'mousemove', { movementY: move }))

      return {
        values,
        minValue,
        maxValue,
        initialValue,
        sensitivity
      }
    }

    describe(`and does move the mouse`, () => {
      describe(`and the distance moved on the y-axis is immeasurable`, () => {
        it(`then it should not fire a "change" event`, () => {
          const movementY = 0
          const {
            values
          } = movementTest([movementY])
          expect(values.length).to.equal(0)
        })
      })

      describe(`and the mouse moved a measurable distance along the y-axis`, () => {
        it(`then it should fire a "change" event, with a "value"`, () => {
          const movementY = 10
          const {
            values,
            minValue,
            maxValue,
            initialValue,
            sensitivity
          } = movementTest([movementY])
          expect(values[0]).to.equal(initialValue - ((movementY / sensitivity) * (maxValue - minValue)))
        })

        describe(`and continues to move the mouse`, () => {
          it(`then the "value" in the "change" events should be capped to the configured min`, () => {
            // Moving in a positive y-direction should hit minValue
            const {
              values,
              minValue
            } = movementTest([50, 50, 50, 50, 50, 50])

            expect(values[values.length - 1]).to.equal(minValue)
          })

          it(`then the "value" in the "change" events should be capped to the configured max`, () => {
            // Moving in a negative y-direction should hit maxValue
            const {
              values,
              maxValue
            } = movementTest([-50, -50, -50, -50, -50, -50])

            expect(values[values.length - 1]).to.equal(maxValue)
          })
        })
      })
    })
  })
})
/* eslint-enable quotes */
