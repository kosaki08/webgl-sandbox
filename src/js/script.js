import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import '../scss/style.scss'

/**
 * @see https://codepen.io/_tom_tom_tom/pen/gOmGZpE?editors=0010
 */

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
  count: 100,
  lineWidth: 5,
  lineColor: 0x83333,
  mainMaterialColor: 0x770000,
  mainMaterialSpecular: 0xffffff,
  areaThreshold: 7,
}
const speed = {
  x: [],
  y: [],
  z: [],
}
const direction = {
  x: [],
  y: [],
  z: [],
}
const boxes = []
const lines = []

// Box Main
const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
  color: params.mainMaterialColor,
})
const boxMain = new THREE.Mesh(geometry, material)
scene.add(boxMain)

// Boxesを追加
for (let i = 0; i < params.count; i++) {
  const box = new THREE.Mesh(geometry, material)
  box.position.x = Math.random() * 10 - 5
  box.position.y = Math.random() * 10 - 5
  box.position.z = Math.random() * 10 - 5

  const scale = Math.random() * 0.1 + 0.2
  box.scale.set(scale, scale, scale)
  boxes.push(box)
  scene.add(box)
}

// Linesを追加
const lineMaterial = new THREE.LineBasicMaterial({
  linewidth: params.lineWidth,
  color: params.lineColor,
  blending: THREE.AdditiveBlending,
})
for (let i = 0; i < params.count; i++) {
  const lineGeometory = new THREE.BufferGeometry().setFromPoints([
    boxMain.position,
    boxes[i].position,
  ])
  const line = new THREE.Line(lineGeometory, lineMaterial)
  lines.push(line)
  scene.add(line)

  // Speed を指定
  const speedX = Math.random() * 0.1 - 0.05
  const speedY = Math.random() * 0.1 - 0.05
  const speedZ = Math.random() * 0.1 - 0.05
  speed.x.push(speedX)
  speed.y.push(speedY)
  speed.z.push(speedZ)

  // 方向を指定
  direction.x.push(1)
  direction.y.push(1)
  direction.z.push(1)
}

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
camera.position.set(5, 0, -10)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x111111)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  boxMain.rotation.y += 0.03
  boxMain.rotation.z += 0.03

  // Boxを更新
  for (let i = 0; i < params.count; i++) {
    if (
      boxes[i].position.x > params.areaThreshold ||
      boxes[i].position.x < params.areaThreshold * -1
    ) {
      direction.x[i] *= -1
    }
    if (
      boxes[i].position.y > params.areaThreshold ||
      boxes[i].position.y < params.areaThreshold * -1
    ) {
      direction.y[i] *= -1
    }
    if (
      boxes[i].position.z > params.areaThreshold ||
      boxes[i].position.z < params.areaThreshold * -1
    ) {
      direction.z[i] *= -1
    }
    boxes[i].position.x += speed.x[i] * direction.x[i]
    boxes[i].position.y += speed.y[i] * direction.y[i]
    boxes[i].position.z += speed.z[i] * direction.z[i]

    // Lineの更新
    const line = lines[i]
    const positions = line.geometry.attributes.position.array

    // positions[0-2] には始点の座標が入る
    positions[3] = boxes[i].position.x
    positions[4] = boxes[i].position.y
    positions[5] = boxes[i].position.z

    line.geometry.attributes.position.needsUpdate = true
  }

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
