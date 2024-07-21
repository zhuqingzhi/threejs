<template>
  <div class="">
    <simpleStage ref="simpleStageComp" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import simpleStage from "@/components/threeStage/simpleStage.vue";
import gsap from "gsap";
import * as THREE from "three";
const simpleStageComp = ref(null);
onMounted(() => {
  const { scene, camera, renderer } = simpleStageComp.value!;
  const ambitLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambitLight);
  scrollingBox(scene);
});

function scrollingBox(scene) {
  const box = createBox();
  scene.add(box);
  gsap.to(box.rotation, {
    duration: 3,
    repeat: -1,
    y: Math.PI * 2,
    ease: "linear",
    onUpdate(val) {
      // console.log(val);
    },
  });
}
function createBox() {
  return new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  );
}
</script>
<style lang="scss" scoped></style>
