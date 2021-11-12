// import pegawaiModel from "@/models/pegawai";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    unorInduks: [],
    unors: [],
  }),
  mutations: {
    setUnorInduks(state, unorInduks) {
      state.unorInduks = unorInduks;
    },
    setUnors(state, unors) {
      state.unors = unors;
    },
  },
  actions: {
    async getAll({ commit }) {
      try {
        const { data } = await axios.get(`unor`);
        commit("setUnorInduks", data["unor_induk"]);
        commit("setUnors", data["unor"]);
      } catch (error) {
        return error.response;
      }
    },
    async getUnorList({ commit }) {
      try {
        const { data } = await axios.get("unor?select=list");
        commit("setUnors", data);
      } catch (error) {
        return error.response;
      }
    },
    async addUnorInduk({ commit, state }, unorInduk) {
      try {
        const res = await axios.post("unor", unorInduk);

        if (res.status == 200) {
          unorInduk._id = res.data.id;
          commit("setUnorInduks", [...state.unorInduks, unorInduk]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async addUnor({ commit, state }, unor, idUnorInduk) {
      try {
        const res = await axios.post(`unor/${idUnorInduk}`, unor);

        if (res.status == 200) {
          unor._id = res.data.id;
          commit("setUnors", [...state.unors, unor]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editUnorInduk({ state }, { index, unorInduk }) {
      try {
        const res = await axios.put("unor", unorInduk);

        if (res.status == 200)
          Object.assign(state.unorInduks[index], unorInduk);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editUnor({ state }, { index, unor, idUnorInduk }) {
      try {
        const res = await axios.put(`unor/${idUnorInduk}`, unor);

        if (res.status == 200) Object.assign(state.unors[index], unor);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deleteUnorInduk({ state }, { index, id }) {
      try {
        const res = await axios.delete(`unor/${id}`);

        if (res.status == 200) {
          state.unorInduks.splice(index, 1);
          state.unors = state.unors.filter((item) => item.unor_induk != id);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deleteUnor({ state }, { index, id }) {
      try {
        const res = await axios.delete(`unor/${id}/unor`);

        if (res.status == 200) state.unors.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
