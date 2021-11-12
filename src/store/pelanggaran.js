// import PelanggaranModel from "@/models/pelanggaran";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    pelanggarans: [],
  }),
  mutations: {
    setPelanggarans(state, pelanggarans) {
      state.pelanggarans = pelanggarans;
    },
  },
  actions: {
    async getAll({ commit }) {
      try {
        const { data } = await axios.get(`pelanggaran`);
        commit("setPelanggarans", data);
      } catch (error) {
        return error.response;
      }
    },
    async addPelanggaran({ commit, state }, pelanggaran) {
      try {
        const res = await axios.post("pelanggaran", pelanggaran);

        if (res.status == 200) {
          pelanggaran._id = res.data.id;
          commit("setPelanggarans", [...state.pelanggarans, pelanggaran]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editPelanggaran({ state }, { index, pelanggaran }) {
      try {
        const res = await axios.put("pelanggaran", pelanggaran);

        if (res.status == 200)
          Object.assign(state.pelanggarans[index], pelanggaran);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deletePelanggaran({ state }, { index, id }) {
      try {
        const res = await axios.delete(`pelanggaran/${id}`);

        if (res.status == 200) state.pelanggarans.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
