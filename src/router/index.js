import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/three",
    component: () => import("../components/threeStage/index.vue"),
  },
  {
    path: "/three-test",
    component: () => import("@/views/three/test.vue"),
  },
  {
    path: "/three-car",
    component: () => import("@/views/carView/index.vue"),
  },
  {
    path: "/three-review",
    component: () => import("@/views/review/index.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});
export default router;
