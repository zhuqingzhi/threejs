<template>
  <div class="">
    <simpleStage
      ref="simpleStageComp"
      :showGrid="false"
      :showAxes="true"
    ></simpleStage>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import simpleStage from "@/components/threeStage/simpleStage.vue";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const simpleStageComp = ref(null);
onMounted(() => {
  const { scene, camera, renderer, gridHelper, gui } = simpleStageComp.value;
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");
  // 雾
  const linearFog = new THREE.Fog(0x999999, 1, 100);
  const expFog = new THREE.FogExp2(0x999999, 0.1);
  scene.background = new THREE.Color(0x999999);

  const envLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(envLight);

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./model/city.glb", function (gltf) {
    scene.add(gltf.scene);
  });

  gui
    .add(scene, "fog", {
      linearFog,
      expFog,
    })
    .name("雾效果");
});
</script>
<style lang="scss" scoped></style>
