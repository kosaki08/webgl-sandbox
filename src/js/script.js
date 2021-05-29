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
const params = {
  count: 500,
  radius: 50,
  offset: 8,
  color1: 0xff7dc3,
  color2: 0x9eeeff,
}
const innerGeometry = new THREE.IcosahedronGeometry(7, 2)
const baseMaterial = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 0x3399ff,
})

// Inner geometry
const innerMesh = new THREE.Mesh(innerGeometry, baseMaterial)
scene.add(innerMesh)

// Wraper geometry
const wrapperGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 16, 16, 16)
const wrapperMesh = new THREE.Mesh(wrapperGeometry, baseMaterial)
wrapperMesh.scale.set(60, 60, 60)
scene.add(wrapperMesh)

const geometry = new THREE.BufferGeometry(1, 1, 1)
const particleMaterial = new THREE.PointsMaterial({
  size: 0.5,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
})

const positions = new Float32Array(params.count * 3)
const colors = new Float32Array(params.count * 3)
const color1 = new THREE.Color(params.color1)
const color2 = new THREE.Color(params.color2)

for (let i = 0; i < params.count; i++) {
  const i3 = i * 3

  const randomX = Math.random() * params.radius - params.radius / 2
  const randomY = Math.random() * params.radius - params.radius / 2
  const randomZ = Math.random() * params.radius - params.radius / 2

  positions[i3] = randomX
  positions[i3 + 1] = randomY
  positions[i3 + 2] = randomZ

  const mixedColor = color1.clone()
  mixedColor.lerp(color2, Math.random())

  colors[i3] = mixedColor.r
  colors[i3 + 1] = mixedColor.g
  colors[i3 + 2] = mixedColor.b
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const particleBoxMesh = new THREE.Points(geometry, particleMaterial)

// particleBoxMesh.position.set()

scene.add(particleBoxMesh)

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
camera.position.set(10, 10, -30)
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

  innerMesh.rotation.y += 0.01
  innerMesh.rotation.x += 0.01

  particleBoxMesh.rotation.x += 0.01
  particleBoxMesh.rotation.y += 0.01

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
