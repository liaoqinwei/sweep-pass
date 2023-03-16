# postprocessing plugin for threejs

postprocessing plugin for threejs. The global sweeping plugin is currently implemented.

## Use

use SweepPass

```javascript
  import { SweepPass } from '@liaoqinwei/sweep-pass'

  const sweepPassOptions = {
    duration: 10, // sweep duration
    thickness: 5, // ring thickness
    radius: 20 // ring diffusion radius
  }
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera))
  const sweepPass = new SweepPass(camera, scene, sweepPassOptions)
  composer.addPass(sweepPass)
```

## License
**MIT**