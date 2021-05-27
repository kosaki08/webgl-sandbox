import * as THREE from 'three'
import GL from './index'
import gsap from 'gsap'
import glsl from 'glslify'

import GlObject from './gl-object'
import vertex from './glsl/vertex-01.glsl'
import fragment from './glsl/fragment-01.glsl'

const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: glsl(vertex),
  fragmentShader: glsl(fragment),
})
const loader = new THREE.TextureLoader()

export default class extends GlObject {
  init(el, index) {
    console.log(el, index)
  }

  updateTime() {}

  addEvents() {}

  mouseEnter() {}

  mouseLeave() {}
}
