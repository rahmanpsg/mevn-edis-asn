// import pegawaiModel from "@/models/pegawai";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    pegawais: [],
  }),
  mutations: {
    setPegawais(state, pegawais) {
      state.pegawais = pegawais;
    },
  },
  actions: {
    async getAll({ commit }) {
      try {
        const { data } = await axios.get(`pegawai`);
        commit("setPegawais", data);
      } catch (error) {
        return error.response;
      }
    },
    async getListPegawai({ commit }) {
      try {
        const { data } = await axios.get(`pegawai?select=list`);
        commit("setPegawais", data);
      } catch (error) {
        return error.response;
      }
    },
    async addPegawai({ commit, state }, pegawai) {
      try {
        const res = await axios.post("pegawai", pegawai);

        if (res.status == 200) {
          pegawai._id = res.data.id;
          commit("setPegawais", [...state.pegawais, pegawai]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editPegawai({ state }, { index, pegawai }) {
      try {
        const res = await axios.put("pegawai", pegawai);

        if (res.status == 200) Object.assign(state.pegawais[index], pegawai);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deletePegawai({ state }, { index, id }) {
      try {
        const res = await axios.delete(`pegawai/${id}`);

        if (res.status == 200) state.pegawais.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
