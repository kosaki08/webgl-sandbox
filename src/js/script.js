import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import '../scss/style.scss'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Objects
 */
const baseGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 16, 16, 16)
const baseMaterial = new THREE.MeshBasicMaterial({
  color: 0x3399ff,
})
const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)
scene.add(baseMesh)

// Inner geometry
const innerMesh = baseMesh.clone()
innerMesh.scale.set(7, 7, 7)
scene.add(innerMesh)

// Wraper geometry
const wrapperMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x3399ff,
})
const wrapperMesh = new THREE.Mesh(baseGeometry, wrapperMaterial)
wrapperMesh.scale.set(14, 14, 14)
scene.add(wrapperMesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
)
camera.position.set(0.25, -0.25, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
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
})

tick()
