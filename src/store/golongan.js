// import GolonganModel from "@/models/golongan";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    golongans: [],
  }),
  mutations: {
    setGolongans(state, golongans) {
      state.golongans = golongans;
    },
  },
  actions: {
    async getAll({ commit }) {
      try {
        const { data } = await axios.get(`golongan`);
        commit("setGolongans", data);
      } catch (error) {
        return error.response;
      }
    },
    async addGolongan({ commit, state }, golongan) {
      try {
        const res = await axios.post("golongan", golongan);

        if (res.status == 200) {
          golongan._id = res.data.id;
          commit("setGolongans", [...state.golongans, golongan]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editGolongan({ state }, { index, golongan }) {
      try {
        const res = await axios.put("golongan", golongan);

        if (res.status == 200) Object.assign(state.golongans[index], golongan);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deleteGolongan({ state }, { index, id }) {
      try {
        const res = await axios.delete(`golongan/${id}`);

        if (res.status == 200) state.golongans.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
