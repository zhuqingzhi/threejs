import * as THREE from "three";

export function createDirectionalLights(data, callback) {
  const lights = [];
  if (!Array.isArray(data)) data = [data];
  data.forEach((item) => {
    const light = new THREE.DirectionalLight(
      item.color || 0xffffff,
      item.intensity || 1
    );
    light.position.set(item.x, item.y, item.z);
    lights.push(light);
  });
  callback && callback(lights);
  return lights;
}
