uniform sampler2D depthTextureSampler;
uniform sampler2D originTextureSampler;

uniform float uTime;

uniform mat4 projectionInverse;
uniform mat4 worldPositionMat4;

varying vec2 vUv;
void main() {
  float v = fract(uTime * .1) * 40.;
  float outerRadius = 3.+v;
  float innerRadius = .0+v;

  vec2 uv = vUv * 2. - 1.;
  float depth = texture2D(depthTextureSampler, vUv).r;
  vec4 origin = texture2D(originTextureSampler, vUv);
  vec4 world_position = worldPositionMat4 * projectionInverse * vec4(uv.x, uv.y, depth * 2. - 1., 1.);
  world_position /= world_position.w;

  float d = length(world_position.xy);
  float va = step(v, d);
  // vec3 col = vec3(1, 0, 0) * (1. - va) * ceil(1. - depth);
  vec3 col = vec3(1, 0, 0)* ceil(1. - depth);


  if(d > innerRadius && d < outerRadius) {
    gl_FragColor = vec4(mix(col, origin.rgb, (d - innerRadius) / (outerRadius - innerRadius)), origin.a);
    // gl_FragColor = vec4(mix(col, origin.rgb, va), origin.a);
  } else {
    gl_FragColor = origin;
  }
  // gl_FragColor = texture2D(originTextureSampler, vUv);
  // gl_FragColor = vec4(vec3(depth), 1.);
}