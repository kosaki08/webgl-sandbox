import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import FontFaceObserver from 'fontfaceobserver'
import imagesLoaded from 'imagesloaded'
import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

/**
 * Scroll
 */
const scrollObj = {
  currentScroll: 0,
  previousScroll: 0,
}

/**
 * Fonts
 */
function fontPlayfair() {
  return new Promise(resolve => {
    new FontFaceObserver('Playfair Display').load().then(() => {
      resolve()
    })
  })
}

function fontOpen() {
  return new Promise(resolve => {
    new FontFaceObserver('Open Sans').load().then(() => {
      resolve()
    })
  })
}

/**
 * Preload images
 */
const preloadImages = new Promise((resolve, reject) => {
  imagesLoaded(document.querySelectorAll('img'), { background: true }, resolve)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  70,
  sizes.width / sizes.height,
  100,
  2000,
)
camera.position.z = 600
camera.fov = 2 * Math.atan(sizes.height / 2 / 600) * (180 / Math.PI)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Init
 */
function init() {
  // Images
  const images = [...document.querySelectorAll('img')]
  const imageStore = images.map(image => {
    const bounds = image.getBoundingClientRect()
    const geometry = new THREE.PlaneBufferGeometry(
      bounds.width,
      bounds.height,
      10,
      10,
    )
    const texture = new THREE.Texture(image)
    texture.needsUpdate = true

    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uImage: { value: 0 },
      },
      fragmentShader,
      vertexShader,
    })
    material.uniforms.uImage.value = texture

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    return {
      image,
      mesh: mesh,
      top: bounds.top,
      left: bounds.left,
      width: bounds.width,
      height: bounds.height,
    }
  })

  // Set Position
  imageStore.forEach(image => {
    image.mesh.position.y =
      scrollObj.currentScroll - image.top + sizes.height / 2 - image.height / 2
    image.mesh.position.x = image.left - sizes.width / 2 + image.width / 2
  })
}

/**
 * Promise All
 */
Promise.all([fontOpen, fontPlayfair, preloadImages]).then(() => {
  init()
})

/**
 * Resize Event
 */
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

tick()
