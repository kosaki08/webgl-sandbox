uniform float uTime;
uniform float hoverState;
uniform vec2 hoverPosition;

varying vec2 vUv;

void main() {
  float dist = distance(uv, hoverPosition);
  vec3 newPosition = position;
  
  // Position
  newPosition.z += hoverState * 10.0 * sin(dist * 10.0 + uTime * 2.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

  // Varying
  vUv = uv;
}