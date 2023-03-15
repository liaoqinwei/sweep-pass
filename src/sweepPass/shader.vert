varying vec2 vUv;

uniform mat4 projectionInverse;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}