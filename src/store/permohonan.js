// import PermohonanModel from "@/models/permohonan";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    permohonans: [],
  }),
  mutations: {
    setPermohonans(state, permohonans) {
      state.permohonans = permohonans;
    },
  },
  actions: {
    async getAll({ commit }) {
      try {
        const { data } = await axios.get(`permohonan`);
        commit("setPermohonans", data);
      } catch (error) {
        return error.response;
      }
    },
    async getPermohonanByPegawai({ commit }, idPegawai) {
      try {
        const { data } = await axios.get(`permohonan/pegawai/${idPegawai}`);
        commit("setPermohonans", data);
      } catch (error) {
        return error.response;
      }
    },
    async getPermohonanByVerifikator({ commit }, idVerifikator) {
      try {
        const { data } = await axios.get(
          `permohonan/verifikator/${idVerifikator}`
        );
        commit("setPermohonans", data);
      } catch (error) {
        return error.response;
      }
    },
    // eslint-disable-next-line no-unused-vars
    async verifikasiPermohonan({ state }, verifikasi) {
      try {
        const res = await axios.post("permohonan/verifikasi", verifikasi);

        if (res.status == 200) {
          verifikasi._id = res.data.id;

          const index = state.permohonans.findIndex(
            (per) => per._id == verifikasi.permohonan
          );

          const permohonan = state.permohonans[index];
          permohonan.status.push(verifikasi.status);
          permohonan.waktuVerif.push(res.data.waktuVerif);

          Object.assign(state.permohonans[index], permohonan);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async addPermohonan({ commit, state }, permohonan) {
      try {
        const res = await axios.post("permohonan", permohonan);

        if (res.status == 200) {
          permohonan._id = res.data.id;
          commit("setPermohonans", [...state.permohonans, permohonan]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editPermohonan({ state }, { index, permohonan }) {
      try {
        const res = await axios.put("permohonan", permohonan);

        if (res.status == 200)
          Object.assign(state.permohonans[index], permohonan);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deletePermohonan({ state }, { index, id }) {
      try {
        const res = await axios.delete(`permohonan/${id}`);

        if (res.status == 200) state.permohonans.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
