uniform sampler2D depthTextureSampler;
uniform sampler2D originTextureSampler;

uniform mat4 projectionInverse;
uniform mat4 worldPositionMat4;

varying vec2 vUv;
void main() {
  vec2 uv = vUv * 2. - 1.;
  float depth = 1. - texture2D(depthTextureSampler, vUv).r;
  vec4 origin = texture2D(originTextureSampler, vUv);
  vec4 world_position = worldPositionMat4 * projectionInverse * vec4(uv.x, uv.y, depth * 2. - 1., 1.);
  world_position /= world_position.w;

  float v = step(2., length(world_position.xyz));
  vec3 col = vec3(1., 0, 0) * (1. - v);
  gl_FragColor = vec4(mix(col, origin.rgb, v), origin.a);
  // gl_FragColor = texture2D(originTextureSampler, vUv);
  // gl_FragColor = vec4(vec3(depth), 1.);
}