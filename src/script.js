import './style.css'
import * as THREE from 'three'
import FontFaceObserver from 'fontfaceobserver'
import imagesLoaded from 'imagesloaded'
import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'
import gsap from 'gsap'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Raycaster
const raycaster = new THREE.Raycaster()

// Mouse
const mouse = new THREE.Vector2()

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
 * Images
 */
let imageStore = []
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
 * Set Position
 */
function setPosition(imageStore) {
  if (imageStore.length <= 0) {
    return
  }
  imageStore.forEach(image => {
    image.mesh.position.y =
      scrollObj.currentScroll - image.top + sizes.height / 2 - image.height / 2
    image.mesh.position.x = image.left - sizes.width / 2 + image.width / 2
  })
}

/**
 * Init
 */
function init() {
  window.scrollTo(0, 0)

  // Images
  const images = [...document.querySelectorAll('img')]
  imageStore = images.map(image => {
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
        uTime: { value: 0 },
        uImage: { value: 0 },
        hoverPosition: { value: new THREE.Vector2(0.5, 0.5) },
        hoverState: { value: 0 },
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

  // Position
  setPosition(imageStore)
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
 * Mouse Move
 */
window.addEventListener('mousemove', event => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) {
    intersects[0].object.material.uniforms.hoverPosition.value =
      intersects[0].uv

    intersects.forEach(intersect => {
      gsap.to(intersect.object.material.uniforms.hoverState, {
        value: 1,
        duration: 2,
        ease: 'power3.out',
      })
    })
    return
  }

  imageStore.forEach(image => {
    gsap.to(image.mesh.material.uniforms.hoverState, {
      value: 0,
      duration: 2,
      ease: 'power3.out',
    })
  })
})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  imageStore.forEach(image => {
    image.mesh.material.uniforms.uTime.value = elapsedTime
  })

  // Render
  renderer.render(scene, camera)

  // Position
  scrollObj.currentScroll = window.scrollY
  setPosition(imageStore)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
