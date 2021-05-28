uniform float uTime;
uniform float uProgress;

varying vec2 vUv;
varying float wave;

#pragma glslify: snoise = require(glsl-noise/simplex/3d) 

void main() {
  vec3 pos = position;
  wave = snoise(vec3(pos.x * 4. + uTime, pos.y, 0.0)) * uProgress;
  pos.z += wave * 50.0;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

  vUv = uv;
}