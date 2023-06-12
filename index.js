import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import gbufferShader from './shaders/gbuffer'
import compositeShader from './shaders/composite'
import debugShader from './shaders/debug'
import catModelPath from './assets/cat.glb'

const canvas = document.querySelector('canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight
)
camera.position.set(0, 0, 5)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const scene = new THREE.Scene()

new GLTFLoader().load(catModelPath, (gltf) => {
  const geometry = gltf.scene.children[0].geometry
  const material = new THREE.ShaderMaterial(gbufferShader)
  const cat = new THREE.Mesh(geometry, material)
  cat.scale.setScalar(0.01)
  cat.rotation.x = Math.PI / -2
  cat.rotation.z = Math.PI / 2
  cat.position.y = -2
  scene.add(cat)
})

const rtParams = {
  minFilter: THREE.NearestFilter,
  magFilter: THREE.NearestFilter,
  type: THREE.FloatType,
  format: THREE.RGBAFormat
}

// color, position, normal
const gBuffer = new THREE.WebGLMultipleRenderTargets(
  window.innerWidth,
  window.innerHeight,
  3
)
gBuffer.texture.forEach((texture) => Object.assign(texture, rtParams))

const compositeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    gColor: { value: gBuffer.texture[0] },
    gPosition: { value: gBuffer.texture[1] },
    gNormal: { value: gBuffer.texture[2] }
  },
  vertexShader: compositeShader.vertexShader,
  fragmentShader: compositeShader.fragmentShader
})
const composite = new FullScreenQuad(compositeMaterial)

const debugTarget = new THREE.WebGLMultisampleRenderTarget(
  window.innerWidth,
  window.innerHeight,
  rtParams
)
const debugMaterial = new THREE.ShaderMaterial({
  ...debugShader,
  uniforms: {
    ...compositeMaterial.uniforms,
    gDebug: { value: debugTarget.texture }
  }
})
const debug = new FullScreenQuad(debugMaterial)

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  gBuffer.setSize(window.innerWidth, window.innerHeight)
  debugTarget.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

renderer.setAnimationLoop(() => {
  controls.update()

  renderer.setRenderTarget(gBuffer)
  renderer.render(scene, camera)

  renderer.setRenderTarget(debugTarget)
  composite.render(renderer)

  renderer.setRenderTarget(null)
  debug.render(renderer)
})
