import * as THREE from 'three'
import glsl from 'glslify'
import gsap from 'gsap'

import { preloadImages } from './utils'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'
import Smooth from './components/smooth'
import '../scss/styles.scss'

preloadImages().then(() => {
  document.body.classList.remove('loading')
  init()
  new Smooth()
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

// Image Store
const imageStore = []

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
 * Image
 */
function updateImageSize(bounds, mesh) {
  mesh.scale.set(bounds.width, bounds.height)
}

function updateImagePosition(bounds, mesh) {
  mesh.position.x = bounds.left - sizes.width / 2 + bounds.width / 2
  mesh.position.y = -bounds.top + sizes.height / 2 - bounds.height / 2
}

/**
 * Init
 */
function init() {
  // Images
  const planeGeometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
  const planeMaterial = new THREE.ShaderMaterial({
    vertexShader: glsl(vertexShader),
    fragmentShader: glsl(fragmentShader),
    uniforms: {
      uTexture: { value: 0 },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    },
    transparent: true,
  })

  const elements = document.querySelectorAll('.js-plane')

  elements.forEach(el => {
    const image = el.querySelector('img')

    // Texture
    const imgSrc = image.src
    const texture = textureLoader.load(imgSrc)
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false
    texture.needsUpdate = true

    // Material
    const imageMaterial = planeMaterial.clone()
    imageMaterial.uniforms.uTexture.value = texture

    // Mesh
    const planeMesh = new THREE.Mesh(planeGeometry, imageMaterial)

    // Set image position and size
    const bounds = image.getBoundingClientRect()
    updateImagePosition(bounds, planeMesh)
    updateImageSize(bounds, planeMesh)

    scene.add(planeMesh)

    // Mouse event
    el.addEventListener('mouseenter', () => {
      gsap.to(imageMaterial.uniforms.uProgress, {
        value: 1,
        ease: 'power.inOut',
        // duration: 1,`
      })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(imageMaterial.uniforms.uProgress, {
        value: 0,
        ease: 'power.inOut',
        // duration: 1,
      })
    })

    imageStore.push({
      image,
      mesh: planeMesh,
    })
  })
}

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  imageStore.forEach(item => {
    const bounds = item.image.getBoundingClientRect()
    updateImagePosition(bounds, item.mesh)
    item.mesh.material.uniforms.uTime.value = elapsedTime
  })

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
