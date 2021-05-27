uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(texture2D(uTexture, vUv));
}