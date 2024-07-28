<template>
  <div class="">
    <simpleStage
      ref="simpleStageComp"
      :showGrid="true"
      :showAxes="false"
    ></simpleStage>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import simpleStage from "@/components/threeStage/simpleStage.vue";
import * as THREE from "three";
const simpleStageComp = ref(null);
onMounted(() => {
  const { scene, camera, renderer, gridHelper } = simpleStageComp.value;
  const bufferGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0]);
  bufferGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(vertices, 3)
  );
  const index = new Uint16Array([0, 1, 2, 2, 3, 0]);
  bufferGeometry.setIndex(new THREE.BufferAttribute(index, 1));
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(bufferGeometry, material);
  scene.add(mesh);
});
</script>
<style lang="scss" scoped></style>
