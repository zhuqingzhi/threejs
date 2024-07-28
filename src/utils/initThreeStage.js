import * as THREE from "three";
import { onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

export function initThreeStage(options) {
  const { showAxes = true, showGrid = false } = options;
  const gui = new GUI();
  // 创建场景
  const scene = new THREE.Scene();
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);
  camera.lookAt(0, 0, 0);
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector(".container").appendChild(renderer.domElement);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // 创建坐标轴
  if (showAxes) {
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
  }
  // 创建网格
  let gridHelper;
  if (showGrid) {
    gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);
  }

  // 渲染
  function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
  return {
    scene,
    camera,
    renderer,
    controls,
    gridHelper,
    gui,
  };
}
