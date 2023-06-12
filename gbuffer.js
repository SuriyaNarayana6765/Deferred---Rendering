import * as THREE from 'three'

const gbufferShader = {
  uniforms: {
    uColor: {
      value: new THREE.Color(0xffffff)
    }
  },
  vertexShader: `
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vec4 viewPosition = viewMatrix * modelMatrix * vec4(position, 1.0);
      vPosition = viewPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * viewPosition;
    }
  `,
  fragmentShader: `
    layout(location = 0) out vec4 gColor;
    layout(location = 1) out vec4 gPosition;
    layout(location = 2) out vec4 gNormal;

    uniform vec3 uColor;

    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      gColor = vec4(uColor, 1.0);
      gPosition = vec4(vPosition, 1.0);
      gNormal = vec4(vNormal, 1.0);
    }
  `,
  glslVersion: THREE.GLSL3
}

export default gbufferShader
