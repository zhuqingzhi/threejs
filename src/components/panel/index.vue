<template>
  <div class="panel">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
</script>
<style lang="scss" scoped>
.panel {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 200px;
  height: 200px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}
</style>
