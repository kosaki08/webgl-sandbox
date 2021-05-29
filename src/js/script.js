import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import '../scss/style.scss'

window.addEventListener(
  'DOMContentLoaded',
  () => {
    // 初期化処理
    init()

    // スペースキーが押されている場合はフラグを立てる @@@
    window.addEventListener(
      'keydown',
      event => {
        switch (event.key) {
          case 'Escape':
            run = event.key !== 'Escape'
            break
          case ' ':
            isDown = true
            break
          default:
        }
      },
      false,
    )
    // キーが離された場合無条件でフラグを下ろす @@@
    window.addEventListener(
      'keyup',
      event => {
        isDown = false
      },
      false,
    )

    // 描画処理
    run = true
    render()
  },
  false,
)

// 汎用変数
let run = true // レンダリングループフラグ
let isDown = false // スペースキーが押されているかどうかのフラグ @@@

// three.js に関連するオブジェクト用の変数
let scene // シーン
let camera // カメラ
let renderer // レンダラ
let geometry // ジオメトリ
let material // マテリアル
let box // ボックスメッシュ
let controls // カメラコントロール
let axesHelper // 軸ヘルパーメッシュ

// カメラに関するパラメータ
const CAMERA_PARAM = {
  fovy: 60,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 10.0,
  x: 0.0,
  y: 2.0,
  z: 5.0,
  lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
}
// レンダラに関するパラメータ
const RENDERER_PARAM = {
  clearColor: 0x666666,
  width: window.innerWidth,
  height: window.innerHeight,
}
// マテリアルに関するパラメータ
const MATERIAL_PARAM = {
  color: 0x3399ff,
  wireframe: true,
}

function init() {
  // シーン
  scene = new THREE.Scene()

  // レンダラ
  renderer = new THREE.WebGLRenderer()
  renderer.setClearColor(new THREE.Color(RENDERER_PARAM.clearColor))
  renderer.setSize(RENDERER_PARAM.width, RENDERER_PARAM.height)
  const wrapper = document.querySelector('#webgl')
  wrapper.appendChild(renderer.domElement)

  // カメラ
  camera = new THREE.PerspectiveCamera(
    CAMERA_PARAM.fovy,
    CAMERA_PARAM.aspect,
    CAMERA_PARAM.near,
    CAMERA_PARAM.far,
  )
  camera.position.set(CAMERA_PARAM.x, CAMERA_PARAM.y, CAMERA_PARAM.z)
  camera.lookAt(CAMERA_PARAM.lookAt)

  // ジオメトリ、マテリアル、メッシュ生成
  geometry = new THREE.BoxGeometry(1.0, 1.0, 1.0)
  var geometry = new THREE.BoxBufferGeometry()

  geometry.vertices = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0.5, 0.5, 1),
  ]

  geometry.faces = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(1, 0, 4),
    new THREE.Face3(2, 1, 4),
    new THREE.Face3(3, 2, 4),
    new THREE.Face3(0, 3, 4),
  ]

  var transformation = new THREE.Matrix4().makeScale(2, 2, 2)
  geometry.applyMatrix4(transformation)

  material = new THREE.MeshBasicMaterial(MATERIAL_PARAM)
  box = new THREE.Mesh(geometry, material)
  scene.add(box)

  // 軸ヘルパー
  axesHelper = new THREE.AxesHelper(5.0)
  scene.add(axesHelper)

  // コントロール
  controls = new OrbitControls(camera, renderer.domElement)
}

function render() {
  // 再帰呼び出し
  if (run === true) {
    requestAnimationFrame(render)
  }

  // コントロールの更新
  controls.update()

  // スペースキーが押されたフラグが立っている場合、メッシュを操作する @@@
  if (isDown === true) {
    // rotation プロパティは Euler クラスのインスタンス
    // XYZ の各軸に対する回転をラジアンで指定する
    box.rotation.y += 0.05
  }

  // 描画
  renderer.render(scene, camera)
}
