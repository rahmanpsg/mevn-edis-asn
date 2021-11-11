import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const isLogin = (to, from, next) => {
  const { login, role } = store.state.userModule;

  console.log(to.name);

  if (to.name == "Login") {
    if (login) next(role);
  } else {
    if (!login) next("/");

    if (to.name != role) {
      next(role);
    }
  }

  next();
};

const routes = [
  {
    path: "/",
    name: "Home",
    // beforeEnter: isLogin,
    component: () => import("../views/Dashboard.vue"),
  },
  {
    path: "/login",
    name: "Login",
    // beforeEnter: isLogin,
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/admin",
    component: () => import("../views/admin/index.vue"),
    beforeEnter: isLogin,
    children: [
      {
        path: "",
        name: "admin",
        component: () => import("../views/admin/dashboard.vue"),
      },
      {
        path: "pegawai",
        component: () => import("../views/admin/pegawai.vue"),
      },
      {
        path: "golongan",
        component: () => import("../views/admin/golongan.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
