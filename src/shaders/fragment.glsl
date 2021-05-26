uniform sampler2D uImage;
uniform float hoverState;

varying vec2 vUv;

void main()	{
  vec4 color = vec4(texture2D(uImage, vUv)) * (1.0 - hoverState);

  gl_FragColor = color;
}