<script setup>
import { onMounted } from "vue";
import { initThreeStage } from "@/utils/initThreeStage";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water2";
function loadSceneModel(scene) {
  console.log("loadSceneModel");

  // 实例化dracoLoader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  const gltfLoader = new GLTFLoader();
  // 设置gltf加载器draco解密器
  // 报错SyntaxError: Unexpected token '<', "<!doctype "... is not valid JSON：忘记写/model
  // 报错Error: THREE.DRACOLoader: Unexpected geometry type.：需要引入正确版本的draco
  //在本项目下的node_modules目录下，找到draco解压器复制，路径为：node_modules\three\examples\js\libs\draco\
  //https://segmentfault.com/q/1010000043706931/a-1020000043808839
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./model/scene.glb", (gltf) => {
    console.log(gltf);
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.name === "Plane") {
        child.visible = false;
      }
    });
    scene.add(gltf.scene);
  });
}

// 加载全景图
function loadPanorama(scene) {
  const rgbLoader = new RGBELoader();
  rgbLoader.load("./textures/sky.hdr", (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    // 设置环境贴图
    scene.background = envMap;
    scene.environment = envMap;
  });
}

function loadWater(scene) {
  const waterGeometry = new THREE.PlaneGeometry(1000, 1000);
  const water = new Water(waterGeometry, {
    textureWidth: 1024,
    textureHeight: 1024,
    waterNormals: new THREE.TextureLoader().load(
      "./textures/water/Water_1_M_Normal.jpg",
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    alpha: 1,
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distorionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.4;
  scene.add(water);
}

onMounted(() => {
  const { scene, camera, renderer } = initThreeStage();
  // 设置色调映射
  renderer.outputEncoding = THREE.sRGBEncoding;
  scene.toneMapping = THREE.ACESFilmicToneMapping;
  scene.toneMappingExposure = 1;
  loadSceneModel(scene);
  camera.position.set(30, 30, 30);
  // 创建平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  loadPanorama(scene);
  // 加载水面
  loadWater(scene);
});
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
</style>
