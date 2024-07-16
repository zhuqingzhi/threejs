<script setup>
import { onMounted, watchEffect, ref, watch } from "vue";
import { initThreeStage } from "@/utils/initThreeStage";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
import { Water } from "three/examples/jsm/objects/Water2";
import gsap from "gsap";
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
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true; // 让所有元素都能对阴影产生影响
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
  water.position.y = -0.8;
  scene.add(water);
}
const sceneIndex = ref(0);

onMounted(() => {
  const { scene, camera, renderer, controls } = initThreeStage();
  // 设置色调映射
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
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
  // 创建光源
  createLights(scene);
  // 监听鼠标滚动
  addMouseWheelEvent(scene, camera, controls);
});

function createLights(scene) {
  // 在房子内创建点光源
  const pointLightInHouse = new THREE.PointLight(0xffffff, 50);
  pointLightInHouse.position.set(0.1, 2, 0);
  pointLightInHouse.castShadow = true;
  scene.add(pointLightInHouse);

  // 创建运动光源
  const radius = 3;
  const spotLights = [];
  const spotLightsGroup = new THREE.Group();
  spotLightsGroup.position.set(-8, 2.5, -1.5);
  for (var i = 0; i < 3; i++) {
    const pointLight = new THREE.PointLight(0xffffff, 20);
    pointLight.shadow.mapSize.set(1024, 1024);
    pointLight.shadow.radius = 10;
    pointLight.position.set(0, 0, 0);
    // pointLight.castShadow = true;//会导致阴影混乱的感觉，为什么开启阴影会这样
    const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const shpereMesh = new THREE.Mesh(
      sphereGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 1,
      })
    );
    spotLights.push(shpereMesh); //圆球里放置灯光，保存圆球，通过圆球进行控制
    shpereMesh.position.set(
      radius * Math.cos((i * 2 * Math.PI) / 3),
      Math.cos((i * 2 * Math.PI) / 3),
      radius * Math.sin((i * 2 * Math.PI) / 3)
    );
    shpereMesh.add(pointLight);
    spotLightsGroup.add(shpereMesh);
  }
  scene.add(spotLightsGroup);

  // 创建运动
  const options = {
    angle: 0,
  };
  gsap.to(options, {
    duration: 10,
    angle: Math.PI * 2,
    ease: "linear",
    repeat: -1,
    onUpdate: () => {
      // angle和options里的angle要同字段名
      // 仅更新z轴旋转，x,y由组去控制
      spotLightsGroup.rotation.y = options.angle;
      spotLights.forEach((light, index) => {
        light.position.set(
          radius * Math.cos((index * 2 * Math.PI) / 3),
          Math.cos((index * 2 * Math.PI) / 3 + options.angle * 5),
          radius * Math.sin((index * 2 * Math.PI) / 3)
        );
      });
    },
  });
}

const timeline1 = new gsap.timeline();
const timeline2 = new gsap.timeline();
function setCamera(camera, control, position, target) {
  console.log("设置镜头", position, target);
  timeline1.to(camera.position, {
    duration: 1,
    ease: "linear",
    x: position[0],
    y: position[1],
    z: position[2],
  });
  /* timeline2.to(control.target, {
    duration: 1,
    ease: "linear",
    x: target[0],
    y: target[1],
    z: target[2],
  }); */
  //   camera.position.set(...position);
  camera.lookAt(target);
}
const stages = [
  {
    text: "场景1",
    calback: (camera, control) => {
      setCamera(camera, control, [-3.23, 3, 4.06], [-8, 2, 0]);
    },
  },
  {
    text: "场景2",
    calback: (camera, control) => {
      setCamera(camera, control, [7, 0, 23], [0, 0, 0]);
    },
  },
  {
    text: "场景3",
    calback: (camera, control) => {
      setCamera(camera, control, [10, 3, 0], [5, 2, 0]);
    },
  },
  {
    text: "场景4",
    calback: (camera, control) => {
      setCamera(camera, control, [7, 0, 23], [5, 2, 0]);
    },
  },
  {
    text: "场景5",
    calback: (camera, control) => {
      setCamera(camera, control, [-20, 1.3, 6.6], [5, 2, 0]);
    },
  },
];

function addMouseWheelEvent(scene, camera, control) {
  let lock = false;
  window.addEventListener("wheel", (e) => {
    console.log("dddd", sceneIndex.value);
    if (lock) return;
    lock = true;
    stages[sceneIndex.value].calback(camera, control);
    sceneIndex.value++;
    if (sceneIndex.value >= stages.length) {
      sceneIndex.value = 0;
    }
    setTimeout(() => {
      lock = false;
    }, 1000);
  });
}

function getStyle(item, index) {
  return {
    display: sceneIndex.value === index ? "block" : "none",
  };
}
</script>

<template>
  <div class="container">
    <div class="stageList">
      <div
        class="stage-item"
        v-for="(item, index) in stages"
        :key="index"
        :style="getStyle(item, index)"
      >
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
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
