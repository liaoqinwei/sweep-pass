import { WebGLRenderer, WebGLRenderTarget } from "three";
import { Pass } from "three/examples/jsm/postprocessing/Pass";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import * as THREE from "three";
declare const defaultOptions: {
    resolution: THREE.Vector2;
    duration: number;
    thickness: number;
    radius: number;
};
export default class SweepPass extends Pass {
    needsSwap: boolean;
    renderTargetDepthBuffer: THREE.WebGLRenderTarget;
    depthMaterial: THREE.MeshDepthMaterial;
    depthTexture: THREE.DepthTexture;
    fsQuad: FullScreenQuad;
    sweepMaterial: THREE.ShaderMaterial;
    uTime: number;
    camera: THREE.Camera;
    scene: THREE.Scene;
    resolution: THREE.Vector2;
    duration: number;
    thickness: number;
    radius: number;
    constructor(camera: THREE.Camera, scene: THREE.Scene, options?: Partial<typeof defaultOptions>);
    uniforKeyProxy(): void;
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void;
    setSize(width: number, height: number): void;
    dispose(): void;
}
export {};
