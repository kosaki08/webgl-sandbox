uniform sampler2D uImage;

varying vec2 vUv;

void main()	{
  gl_FragColor = vec4(texture2D(uImage, vUv));
}