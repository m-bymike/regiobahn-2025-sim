import Companion from '@/views/Companion.vue'
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    redirect: "/block"
  },
  {
    path: "/block",
    name: "Block",
    component: Home
  },
  {
    path: "/companion",
    name: "Companion",
    component: Companion
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
