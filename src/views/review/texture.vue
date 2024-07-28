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

const simpleStageComp = ref(null);
onMounted(() => {
  const { scene, camera, renderer, gridHelper, gui } = simpleStageComp.value;

  // 加载环境贴图
  const rgbLoader = new RGBELoader();
  const hrdMap = rgbLoader.load(
    "./textures/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr",
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      scene.needsUpdate = true;
      planeMaterial.needsUpdate = true;
    }
  );
  // 加载纹理贴图
  const texureLoader = new THREE.TextureLoader();
  const texture = texureLoader.load(
    "./textures/texture/watercover/CityNewYork002_COL_VAR1_1K.png",
    (envMap) => {}
  );
  // 加载ao贴图
  const aoMap = texureLoader.load(
    "./textures/texture/watercover/CityNewYork002_AO_1K.jpg"
  );
  // 加载透明度贴图
  const alphaMap = texureLoader.load("./textures/texture/door/alpha.jpg");
  // 高光贴图
  const specularMap = texureLoader.load(
    "./textures/texture/watercover/CityNewYork002_GLOSS_1K.jpg"
  );
  // 创建一个平面几何体
  const planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    side: THREE.DoubleSide,
    aoMapIntensity: 1,
    transparent: true,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);
  const lightMap = texureLoader.load("./textures/texture/colors.png");
  const params = {
    aoMap: false,
    envMap: false,
    alphaMap: false,
    specularMap: false,
    reflectivity: 0,
    lightMap: false,
  };
  const texureFolder = gui.addFolder("纹理贴图");
  texureFolder
    .add(params, "aoMap")
    .name("显示aoMap")
    .onChange((val) => {
      planeMaterial.aoMap = val ? aoMap : null;
      planeMaterial.needsUpdate = true;
    });
  texureFolder
    .add(params, "alphaMap")
    .name("显示透明度贴图")
    .onChange((val) => {
      planeMaterial.alphaMap = val ? alphaMap : null;
      planeMaterial.needsUpdate = true;
    });
  texureFolder
    .add(params, "envMap")
    .name("环境光贴图")
    .onChange((val) => {
      planeMaterial.envMap = val ? hrdMap : null;
      planeMaterial.needsUpdate = true;
    });
  texureFolder
    .add(params, "reflectivity")
    .name("反射率")
    .min(0)
    .max(1)
    .onChange((val) => {
      planeMaterial.reflectivity = val;
      planeMaterial.needsUpdate = true;
    });
  texureFolder
    .add(params, "specularMap")
    .name("高光贴图")
    .onChange((val) => {
      planeMaterial.specularMap = val ? specularMap : null;
      planeMaterial.needsUpdate = true;
    });
  texureFolder
    .add(params, "lightMap")
    .name("光照贴图")
    .onChange((val) => {
      planeMaterial.lightMap = val ? lightMap : null;
      planeMaterial.needsUpdate = true;
    });
  texture.colorSpace = THREE.SRGBColorSpace;
  gui
    .add(texture, "colorSpace", {
      linear: THREE.LinearSRGBColorSpace,
      SRGB: THREE.SRGBColorSpace,
    })
    .onChange(() => {
      texture.needsUpdate = true;
    });
});
</script>
<style lang="scss" scoped></style>
