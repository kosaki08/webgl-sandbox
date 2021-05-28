uniform sampler2D uTexture;

varying vec2 vUv;
varying float wave;

void main() {
  vec3 color;
  color.r = texture2D(uTexture, vUv + wave * 0.05).r;
  color.g = texture2D(uTexture, vUv + wave * 0.).g;
  color.b = texture2D(uTexture, vUv + wave * -0.02).b;

  gl_FragColor = vec4(color, 1.0);
}