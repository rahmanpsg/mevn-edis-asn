import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

import userModule from "./user";
import golonganModule from "./golongan";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    userModule,
    golonganModule,
  },
  plugins: [
    createPersistedState({
      paths: ["userModule"],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
