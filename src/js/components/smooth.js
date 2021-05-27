import imageLoaded from 'imagesloaded'
import { Events } from '../events'

export default class Smooth {
  constructor() {
    this.bindMethods()

    this.dom = {
      el: document.querySelector('[data-scroll]'),
      content: document.querySelector('[data-scroll-content]'),
    }

    this.init()
  }

  bindMethods() {
    ;['scroll', 'run', 'resize'].forEach(fn => {
      this[fn] = this[fn].bind(this)
    })
  }

  setStyles() {}

  setHeight() {}

  preload() {}

  scroll() {
    this.data.current = window.scrollY
  }

  run() {}

  on() {}

  off() {}

  destroy() {}

  resize() {}

  init() {}
}
