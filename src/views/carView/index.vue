<template>
  <simpleStage
    ref="simpleStageComp"
    :showGrid="true"
    :showAxes="false"
  ></simpleStage>
  <panel style="font-size: 12px; height: 100vh; width: 300px">
    <h2>控制面板</h2>
    <el-button @click="loadCarModel" size="mini" type="primary"
      >加载汽车模型</el-button
    >
    <el-button @click="loadDirectionalLights" size="mini" type="primary"
      >加载平行灯光</el-button
    >
    <el-divider />
    <el-row>
      <el-col :span="8">前脸颜色选择</el-col>
      <el-col :span="16">
        <el-select
          v-model="modelComponents.frontFace.color"
          placeholder="Select"
          size="small"
          @change="modelComponents.frontFace.changeColor"
        >
          <el-option
            v-for="item in modelComponents.frontFace.colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">轮毂颜色选择</el-col>
      <el-col :span="16">
        <el-select
          v-model="modelComponents.wheels.color"
          placeholder="Select"
          size="small"
          @change="modelComponents.wheels.changeColor"
        >
          <el-option
            v-for="item in modelComponents.wheels.colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">引擎盖颜色选择</el-col>
      <el-col :span="16">
        <el-select
          v-model="modelComponents.hoods.color"
          placeholder="Select"
          size="small"
          @change="modelComponents.hoods.changeColor"
        >
          <el-option
            v-for="item in modelComponents.hoods.colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col> </el-row
    ><el-row>
      <el-col :span="8">玻璃材质</el-col>
      <el-button type="primary" size="mini" @click="setGlassMaterial"
        >设置材质</el-button
      >
    </el-row>
  </panel>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import simpleStage from "@/components/threeStage/simpleStage.vue";
import * as THREE from "three";
import modelApi from "@/utils/model";
import panel from "@/components/panel/index.vue";
import lightApi from "@/utils/light";
const simpleStageComp = ref(null);
const _scene = ref(null);
const _camera = ref(null);
const _renderer = ref(null);
const _controls = ref(null);
const frontFace = [];
const wheels = [];
const hoods = [];
const glass = [];
const modelComponents = reactive({
  frontFace: {
    actors: [],
    name: "前脸",
    color: "",
    colorOptions: [
      {
        label: "红色",
        value: 0xff0000,
      },
      {
        label: "绿色",
        value: 0x00ff00,
      },
      {
        label: "蓝色",
        value: 0x0000ff,
      },
    ],
    changeColor: (val) => {
      console.log("changeCOlor", val, modelComponents.frontFace.actors);
      modelComponents.frontFace.actors.forEach((item) => {
        item.material.color.set(val);
      });
    },
  },
  wheels: {
    actors: [],
    name: "轮毂",
    color: "",
    colorOptions: [
      {
        label: "红色",
        value: 0xff0000,
      },
      {
        label: "绿色",
        value: 0x00ff00,
      },
      {
        label: "蓝色",
        value: 0x0000ff,
      },
    ],
    changeColor: (val) => {
      console.log("changeCOlor", val, modelComponents.wheels.actors);
      modelComponents.wheels.actors.forEach((item) => {
        item.material.color.set(val);
      });
    },
  },
  hoods: {
    actors: [],
    name: "引擎盖",
    color: "",
    colorOptions: [
      {
        label: "红色",
        value: 0xff0000,
      },
      {
        label: "绿色",
        value: 0x00ff00,
      },
      {
        label: "蓝色",
        value: 0x0000ff,
      },
    ],
    changeColor: (val) => {
      console.log("changeCOlor", val, modelComponents.wheels.actors);
      modelComponents.hoods.actors.forEach((item) => {
        item.material.color.set(val);
      });
    },
  },
  glass: {
    actors: [],
    name: "玻璃",
    color: "",
    colorOptions: [
      {
        label: "红色",
        value: 0xff0000,
      },
      {
        label: "绿色",
        value: 0x00ff00,
      },
      {
        label: "蓝色",
        value: 0x0000ff,
      },
    ],
    changeColor: (val) => {
      console.log("changeCOlor", val, modelComponents.wheels.actors);
      modelComponents.wheels.actors.forEach((item) => {
        item.material.color.set(val);
      });
    },
  },
});
const loadCarModel = () => {
  modelApi.loadGLTF("./model/bmw01.glb").then((scene) => {
    _scene.value.add(scene);
    scene.traverse((child) => {
      if (child.isMesh) {
        // console.log(child.name);
        Object.keys(modelComponents).forEach((key) => {
          const componentItem = modelComponents[key];
          if (child.name.includes(componentItem.name)) {
            componentItem.actors.push(child);
          }
        });
      }
    });
  });
};
const loadDirectionalLights = () => {
  const list = [
    {
      x: 0,
      y: 0,
      z: 10,
      color: 0xffffff,
      intensity: 5,
    },
    {
      x: 10,
      y: 0,
      z: 10,
      color: 0xffffff,
      intensity: 5,
    },
    {
      x: -10,
      y: 0,
      z: 10,
      color: 0xffffff,
      intensity: 5,
    },
    {
      x: 0,
      y: 0,
      z: -10,
      color: 0xffffff,
      intensity: 5,
    },
    {
      x: 0,
      y: 5,
      z: -5,
      color: 0xffffff,
      intensity: 1,
    },
    {
      x: 0,
      y: 5,
      z: 5,
      color: 0xffffff,
      intensity: 1,
    },
  ];
  const lights = lightApi.directionalLights.createDirectionalLights(list);
  lights.forEach((light) => {
    _scene.value.add(light);
  });
};

const setGlassMaterial = () => {
  console.log("setGlassMaterial", modelComponents.glass.actors);
  modelComponents.glass.actors.forEach((item) => {
    item.material.color.set(0xffffff);
  });
};

onMounted(() => {
  const { scene, camera, renderer, gridHelper } = simpleStageComp.value;
  _scene.value = scene;
  _camera.value = camera;
  _renderer.value = renderer;
  scene.background = new THREE.Color("#ccc");
  scene.environment = new THREE.Color("#ccc");
  if (gridHelper) {
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
  }
});
</script>
<style lang="scss" scoped></style>
