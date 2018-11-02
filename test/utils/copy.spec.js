import { copy } from '../../src/utils/copy'

describe('copy test', () => {
  beforeEach(() => {
    global.button = document.createElement('button')
    global.button.setAttribute('class', 'btn')
    global.button.setAttribute('data-clipboard-text', 'foo')
    document.body.appendChild(global.button)

    global.span = document.createElement('span')
    global.span.innerHTML = 'bar'

    global.button.appendChild(global.span)

    global.event = {
      target: global.button,
      currentTarget: global.button
    }
  })

  describe('errorsCSV function', () => {
    it('should copy a content', () => {
      // Given
      const content = '.btn'

      // When
      const clipboard = copy(content)
      try {
        clipboard.onClick(global.event)
      } catch (e) {
        expect(e.message).toBe('Invalid "target" value, use a valid Element')
      }

      // Then
      expect(document.body).toBe(clipboard.container)
    })
  })
})
