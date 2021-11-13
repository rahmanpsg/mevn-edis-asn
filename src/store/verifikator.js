import verifikatorModel from "@/models/verifikator";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    verifikators: [],
  }),
  mutations: {
    setVerifikators(state, verifikators) {
      state.verifikators = verifikators;
    },
  },
  actions: {
    async getAll({ commit }, listPegawai) {
      try {
        const { data } = await axios.get(`verifikator`);

        commit(
          "setVerifikators",
          data.map(
            (d) =>
              new verifikatorModel({
                ...d,
                pegawai: listPegawai.find((p) => p._id == d.pegawai._id),
              })
          )
        );
      } catch (error) {
        return error.response;
      }
    },
    async addVerifikators({ commit }, verifikators) {
      try {
        const res = await axios.post("verifikator", { verifikators });

        if (res.status == 200) {
          commit("setVerifikators", verifikators);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async resetVerifikator({ commit }) {
      try {
        const res = await axios.delete(`verifikator/`);

        if (res.status == 200)
          commit(
            "setVerifikators",
            [1, 2, 3, 4.1, 4.2].map((n) => new verifikatorModel({ level: n }))
          );

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
