import { Pass } from "three/examples/jsm/postprocessing/Pass";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import * as THREE from "three";
import vert from "./shader.vert?raw";
import frag from "./shader.frag?raw";
const defaultOptions = {
    resolution: new THREE.Vector2(256),
    duration: 10,
    thickness: 5,
    radius: 20
};
const uniformsKey = [
    'duration',
    'thickness',
    'radius',
];
export default class SweepPass extends Pass {
    needsSwap = false;
    renderTargetDepthBuffer;
    depthMaterial;
    depthTexture;
    fsQuad;
    sweepMaterial;
    uTime = 0;
    // params
    camera;
    scene;
    // options
    resolution;
    duration;
    thickness;
    radius;
    constructor(camera, scene, options = {}) {
        super();
        options = Object.assign(defaultOptions, options);
        this.resolution = options.resolution;
        this.duration = options.duration;
        this.thickness = options.thickness;
        this.radius = options.radius;
        this.camera = camera;
        this.scene = scene;
        const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };
        this.depthMaterial = new THREE.MeshDepthMaterial();
        this.depthMaterial.side = THREE.DoubleSide;
        // this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
        this.depthMaterial.blending = THREE.NoBlending;
        this.depthTexture = new THREE.DepthTexture(this.resolution.x, this.resolution.y);
        this.renderTargetDepthBuffer = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y, pars);
        this.renderTargetDepthBuffer.depthTexture = this.depthTexture;
        this.renderTargetDepthBuffer.texture.generateMipmaps = false;
        this.sweepMaterial = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            transparent: false,
            uniforms: {
                depthTextureSampler: { value: this.renderTargetDepthBuffer.texture },
                originTextureSampler: { value: null },
                projectionInverse: { value: this.camera.projectionMatrixInverse },
                worldPositionMat4: { value: this.camera.matrixWorld },
                cameraFar: { value: this.camera.far },
                cameraNear: { value: this.camera.near },
                uTime: { value: this.uTime },
                duration: { value: this.duration },
                thickness: { value: this.thickness },
                radius: { value: this.radius },
            }
        });
        this.fsQuad = new FullScreenQuad(this.sweepMaterial);
        this.uniforKeyProxy();
    }
    uniforKeyProxy() {
        uniformsKey.forEach(key => {
            Object.defineProperty(this, key, {
                set(val) {
                    this.sweepMaterial.uniforms[key].value = val;
                },
                get() {
                    return this.sweepMaterial.uniforms[key].value;
                },
                enumerable: false,
            });
        });
    }
    render(renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
        this.uTime += deltaTime;
        // depth
        renderer.setRenderTarget(this.renderTargetDepthBuffer);
        renderer.clearDepth();
        renderer.render(this.scene, this.camera);
        this.sweepMaterial.uniforms.depthTextureSampler.value = this.renderTargetDepthBuffer.depthTexture;
        this.sweepMaterial.uniforms.originTextureSampler.value = readBuffer.texture;
        this.sweepMaterial.uniforms.projectionInverse.value = this.camera.projectionMatrixInverse;
        this.sweepMaterial.uniforms.worldPositionMat4.value = this.camera.matrixWorld;
        this.sweepMaterial.uniforms.uTime.value = this.uTime;
        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        }
        else {
            renderer.setRenderTarget(writeBuffer);
            // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
            if (this.clear)
                renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
            this.fsQuad.render(renderer);
        }
    }
    setSize(width, height) {
        this.renderTargetDepthBuffer.setSize(width, height);
    }
    dispose() {
        this.renderTargetDepthBuffer.dispose();
    }
}
