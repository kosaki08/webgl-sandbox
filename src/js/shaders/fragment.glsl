#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

uniform sampler2D uTexture;
uniform float uTime;
uniform float uProgress;
uniform float uAspect;
uniform float uRatio;

varying vec2 vUv;

void main() {
  float offsetX = vUv.x * 0.3 - uTime * 0.1;
  float offsetY = vUv.y + sin(vUv.x * 3.0) * 0.5 - sin(uTime * 0.01) + snoise3(vec3(vUv.x, vUv.y, uTime * 0.1) * 0.3);
  offsetX += snoise3(vec3(offsetX, offsetY, uTime) * 0.01) * 0.3;
  offsetY += snoise3(vec3(offsetX, offsetX, uTime * 0.05)) * 0.5;

  float nc = snoise3(vec3(offsetX, offsetY, uTime * 0.05) * 3.0) * uProgress;
  float nh = snoise3(vec3(offsetX, offsetY, uTime * 0.05) * 2.0) * 0.3;
  nc *= smoothstep(nc, 0.5, 0.6) * uProgress;
  nh *= smoothstep(nh, 0.3, 0.8);

  vec4 image = texture2D(uTexture, vUv + vec2(nc + nh) * uProgress);

  gl_FragColor = vec4(image);
}