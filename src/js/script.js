import * as THREE from 'three'
import gsap from 'gsap'

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
 * Box
 */
let boxItems = []
const step = 1
const num = 5

const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2)
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
})
const baseMesh = new THREE.Mesh(geometry, material)

for (let x = 0; x <= num; x++) {
  for (let y = 0; y <= num; y++) {
    for (let z = 0; z <= num; z++) {
      const box = baseMesh.clone()
      box.position.set(
        (x - num / 2) * step,
        (y - num / 2) * step,
        (z - num / 2) * step,
      )
      boxItems.push(box)
      scene.add(box)
    }
  }
}

const boxPositions = boxItems.map(box => ({
  x: box.position.x,
  y: box.position.y,
  z: box.position.z,
}))

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
  60,
  sizes.width / sizes.height,
  0.1,
  100,
)
camera.position.set(2.5, 2.5, 10)
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x666666)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Cameraの位置を制御
  camera.position.x = Math.sin(elapsedTime / 10) * 2.5
  camera.position.y = Math.cos(elapsedTime / 10) * 10
  camera.position.z = Math.cos(elapsedTime / 10) * 2.5

  // カメラを中心に向ける
  camera.lookAt(new THREE.Vector3(0))

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

// spaceキーが押された場合の処理
window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    boxItems.forEach((box, i) => {
      gsap.to(box.position, {
        x: boxPositions[i].x * 2,
        y: boxPositions[i].y * 2,
        z: boxPositions[i].z * 2,
        duration: 0.3,
        ease: 'power4.easeInOut',
      })
    })
  }
})

// spaceキーが離された場合の処理
window.addEventListener('keyup', () => {
  boxItems.forEach((box, i) => {
    gsap.to(box.position, {
      x: boxPositions[i].x,
      y: boxPositions[i].y,
      z: boxPositions[i].z,
      duration: 0.3,
      ease: 'power4.easeInOut',
    })
  })
})

// リサイズ時の処理
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
