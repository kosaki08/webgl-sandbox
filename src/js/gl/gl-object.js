import * as THREE from 'three'
import gl from './index'
import gsap from 'gsap'

export default class extends THREE.Object3D {
  init(el) {
    this.el = el

    this.resize()
  }

  setBounds() {}

  resize() {}

  calculateUnitSize() {}

  updateSize() {}

  updateY() {}

  updateX() {}

  updatePosition() {}
}
