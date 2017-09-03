const jsdom = require('jsdom').jsdom

global.document = jsdom('')
global.window = document.defaultView
global.HTMLElement = global.window.HTMLElement
global.navigator = {
  userAgent: 'node.js'
}

function copyProps (src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop))
  Object.defineProperties(target, props)
}
copyProps(document.defaultView, global)

global.requestAnimationFrame = function (callback) {
  setTimeout(callback, 0)
}