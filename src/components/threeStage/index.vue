<script setup>
import { onMounted } from "vue";
import { initThreeStage } from "@/utils/initThreeStage";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
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
    scene.add(gltf.scene);
  });
}

onMounted(() => {
  const { scene, camera, renderer } = initThreeStage();
  loadSceneModel(scene);
  camera.position.set(30, 30, 30);
  // 创建平行光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
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
