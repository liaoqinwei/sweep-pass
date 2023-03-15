import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import SweepPass from './sweepPass/SweepPass';

function main() {
  const canvas = document.querySelector('#render')!;
  const renderer = new THREE.WebGLRenderer({ canvas, logarithmicDepthBuffer: true });
  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  const controls = new OrbitControls(camera, canvas as HTMLElement)

  const scene = new THREE.Scene();

  {
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry: THREE.BufferGeometry, color: THREE.ColorRepresentation, position: THREE.Vector3) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.fromArray(position.toArray());

    return cube;
  }

  const cubes:any = [
  ];
  // plane
  {
    const geo = new THREE.PlaneGeometry(40, 40)
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 })
    const mesh = new THREE.Mesh(geo, material)
    scene.add(mesh)
  }
  for (let i = 0; i < 100; i++) {
    cubes.push(makeInstance(geometry, new THREE.Color().setHSL(Math.random() * .5 + .5, Math.random(), .5),
      new THREE.Vector3(THREE.MathUtils.randInt(-20, 20), THREE.MathUtils.randInt(-20, 20), THREE.MathUtils.randInt(0, 5))))
  }

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera))
  const pass = new SweepPass(camera, scene,{})
  composer.addPass(pass)


  function resizeRendererToDisplaySize(renderer: THREE.Renderer) {
    const canvas = renderer.domElement;
    const needResize = canvas.width !== window.innerWidth || canvas.height !== window.innerHeight;
    if (needResize) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    }
    return needResize;
  }

  let then = 0;
  function render(now: number) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      composer.setSize(canvas.width, canvas.height);
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = now * speed * .01;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    composer.render(deltaTime);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
