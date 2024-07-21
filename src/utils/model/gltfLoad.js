import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export async function loadGLTF(path) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(path, (gltf) => {
      const model = gltf.scene;
      resolve(model);
    });
  });
}
