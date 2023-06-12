const debugShader = {
  uniforms: {
    gColor: { value: null },
    gPosition: { value: null },
    gNormal: { value: null },
    gComposite: { value: null }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;

    uniform sampler2D gColor;
    uniform sampler2D gPosition;
    uniform sampler2D gNormal;
    uniform sampler2D gDebug;

    void main() {
      vec3 vColor = texture(gColor, vUv).rgb;
      vec3 vPosition = texture(gPosition, vUv).rgb;
      vec3 vNormal = texture(gNormal, vUv).rgb;
      vec3 vDebug = texture(gDebug, vUv).rgb;

      vec3 top = mix(vColor, vPosition, step(0.5, vUv.x));
      vec3 bottom = mix(vNormal, vDebug, step(0.5, vUv.x));

      gl_FragColor.rgb = mix(bottom, top, step(0.5, vUv.y));
      gl_FragColor.a = 1.0;
    }
  `
}

export default debugShader
