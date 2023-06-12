const compositeShader = {
  uniforms: {
    gColor: { value: null },
    gPosition: { value: null },
    gNormal: { value: null }
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

    void main() {
      vec3 vColor = texture(gColor, vUv).rgb;
      vec3 vPosition = texture(gPosition, vUv).rgb;
      vec3 vNormal = texture(gNormal, vUv).rgb;

      vec3 lighting = vec3(1.0) * 0.3;
      vec3 lightPosition = vec3(10);
      float diffuse = dot(vNormal, normalize(lightPosition - vPosition));

      gl_FragColor.rgb = (lighting + diffuse) * vColor;
      gl_FragColor.a = 1.0;
    }
  `
}

export default compositeShader
