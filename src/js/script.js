import * as THREE from 'three'

import { preloadImages } from './utils'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import '../css/style.css'

preloadImages().then(() => {
  document.body.classList.remove('loading')
  init()
})

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Loader
const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0xf2f2f2, 0)
})

/**
 * Camera
 */
// Base camera
const perspective = 800
const fov = (180 * (2 * Math.atan(sizes.height / 2 / perspective))) / Math.PI
const camera = new THREE.PerspectiveCamera(
  fov,
  sizes.width / sizes.height,
  0.1,
  10000,
)
camera.position.z = perspective
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Init
 */
function init() {
  /**
   * Images
   */
  const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
  const planeMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: 0 },
      uIndex: { value: 0 },
    },
    transparent: true,
  })

  const elements = document.querySelectorAll('.js-plane')

  elements.forEach((el, index) => {
    // Texture
    const image = el.querySelector('img')
    const imgSrc = image.src
    const texture = textureLoader.load(imgSrc)
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true

    // Material
    const imageMaterial = planeMaterial.clone()
    imageMaterial.uniforms.uTexture.value = texture

    // Bounds
    const bounds = image.getBoundingClientRect()

    // Offset
    const offset = new THREE.Vector2(0)
    offset.set(
      bounds.left - window.innerWidth / 2 + bounds.width / 2,
      -bounds.top + window.innerHeight / 2 - bounds.height / 2,
    )

    // Sizes
    const sizes = new THREE.Vector2(0)
    sizes.set(bounds.width, bounds.height)

    // Mesh
    const planeMesh = new THREE.Mesh(planeGeometry, imageMaterial)
    planeMesh.position.set(offset.x, offset.y, 0)
    planeMesh.scale.set(sizes.x, sizes.y)
    scene.add(planeMesh)
  })
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const planes = scene.children.filter(child => child.type === 'Mesh')

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
