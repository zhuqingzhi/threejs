<script setup>
import { onMounted, watchEffect, ref, watch, toRefs, reactive } from "vue";
import { initThreeStage } from "@/utils/initThreeStage";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water2";
import gsap from "gsap";
const scene = ref(null);
const camera = ref(null);
const renderer = ref(null);
const controls = ref(null);
const gridHelper = ref(null);
const gui = ref(null);
const props = defineProps({
  showGrid: {
    type: Boolean,
    default: false,
  },
  showAxes: {
    type: Boolean,
    default: true,
  },
});
onMounted(() => {
  const stageInfo = initThreeStage({
    showAxes: props.showAxes,
    showGrid: props.showGrid,
  });
  scene.value = stageInfo.scene;
  camera.value = stageInfo.camera;
  renderer.value = stageInfo.renderer;
  controls.value = stageInfo.controls;
  gridHelper.value = stageInfo.gridHelper;
  gui.value = stageInfo.gui;
});
defineExpose({
  scene,
  camera,
  renderer,
  controls,
  gridHelper,
  gui,
});
</script>

<template>
  <div class="container"></div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 100vh;
  position: relative;
}
.stageList {
  position: absolute;
  top: 10px;
  left: 10px;
  color: #fff;
  font-size: 50px;
  text-align: left;
}
</style>
