import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/three",
    component: () => import("../components/threeStage/index.vue"),
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});
export default router;
