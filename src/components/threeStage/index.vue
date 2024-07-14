<script setup>
import { onMounted } from "vue";
import { initThreeStage } from "@/utils/initThreeStage";

function loadSceneModel() {}

onMounted(() => {
  initThreeStage();
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
