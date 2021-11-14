import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

Vue.use(VueRouter);

const isLogin = (to, from, next) => {
  const { login, role } = store.state.userModule;

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
        path: "verifikator",
        component: () => import("../views/admin/verifikator.vue"),
      },
      {
        path: "permohonan",
        component: () => import("../views/admin/permohonan.vue"),
      },
      {
        path: "pelanggaran",
        component: () => import("../views/admin/pelanggaran.vue"),
      },
      {
        path: "golongan",
        component: () => import("../views/admin/golongan.vue"),
      },
      {
        path: "unor",
        component: () => import("../views/admin/unor.vue"),
      },
    ],
  },
  {
    path: "/pegawai",
    component: () => import("../views/pegawai/index.vue"),
    beforeEnter: isLogin,
    children: [
      {
        path: "",
        name: "pegawai",
        component: () => import("../views/pegawai/home.vue"),
      },
      {
        path: "permohonan",
        component: () => import("../views/pegawai/permohonan.vue"),
      },
      {
        path: "pengaturan",
        component: () => import("../views/pegawai/pengaturan.vue"),
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
