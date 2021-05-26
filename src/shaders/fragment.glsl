uniform float uTime;
uniform sampler2D uImage;
uniform float hoverState;

varying vec2 vUv;
varying float vNoise;

void main()	{
  float x = smoothstep(0.0, 1.0, (hoverState * 2.0 + vUv.y - 1.0));
  vec4 color = mix(
    texture2D(uImage, (vUv - 0.5) * (1.0 - x) + 0.5),
    texture2D(uImage, (vUv - 0.5) * x + 0.5),
    x
  );
  
  gl_FragColor = color;
  gl_FragColor.rgb += 0.05 * vec3(vNoise);
}