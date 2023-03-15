uniform sampler2D depthTextureSampler;
uniform sampler2D originTextureSampler;

uniform float uTime;
uniform float radius;
uniform float duration;
uniform float thickness;
uniform float cameraFar;
uniform float cameraNear;

uniform mat4 projectionInverse;
uniform mat4 worldPositionMat4;

varying vec2 vUv;

float linearize_depth(in float depth) {
  float a = cameraFar / (cameraFar - cameraNear);
  float b = cameraFar * cameraNear / (cameraNear - cameraFar);
  return a + b / depth;
}

float reconstruct_depth(const in vec2 uv) {
  float depth = texture2D(depthTextureSampler, uv).x;
  return pow(2.0, depth * log2(cameraFar + 1.0)) - 1.0;
}

float getDepth(vec2 uv) {
    #if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
  return linearize_depth(reconstruct_depth(uv));
    #else
  return texture2D(depthTextureSampler, uv).x;
    #endif
}

void main() {
  float v = fract(uTime / duration) * radius * 2.;
  float outerRadius = v;
  float innerRadius = -thickness + v;

  vec2 ndcUv = vUv * 2. - 1.;
  float depth = getDepth(vUv);
  vec4 origin = texture2D(originTextureSampler, vUv);
  vec4 world_position = worldPositionMat4 * projectionInverse * vec4(ndcUv.x, ndcUv.y, depth * 2. - 1., 1.);
  world_position /= world_position.w;

  float d = length(world_position.xyz);
  vec3 col = vec3(1, 0, 0) * ceil(1. - depth);

  if(d > innerRadius && d < outerRadius) {
    gl_FragColor = vec4(mix(col, origin.rgb, (d - innerRadius) / (outerRadius - innerRadius)), origin.a);
  } else {
    gl_FragColor = origin;
  }
}