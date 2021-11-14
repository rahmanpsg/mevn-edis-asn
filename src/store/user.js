import axios from "axios";
import PegawaiModel from "../models/pegawai";

export default {
  namespaced: true,
  state: () => ({
    login: false,
    username: null,
    role: null,
    token: null,
    pegawai: new PegawaiModel({}),
  }),
  mutations: {
    isLogin: (state, login) => {
      state.login = login;
    },
    setData: (state, data) => {
      try {
        state.username = data.username;
        state.role = data.role;
        state.token = data.token;
        axios.defaults.headers["x-access-token"] = data.token;

        if (data.role == "pegawai") {
          state.pegawai = new PegawaiModel(data);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  actions: {
    async login(_, { username, password }) {
      try {
        const res = await axios.post("login", { username, password });
        return res;
      } catch (error) {
        return error.response;
      }
    },
    logout({ commit }) {
      commit("isLogin", false);
      this.$router.push("/");
      localStorage.clear();
    },
  },
};
