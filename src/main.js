import Vue from "vue";
import vueaxios from "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  vueaxios,
  render: function (h) {
    return h(App);
  },
}).$mount("#app");
