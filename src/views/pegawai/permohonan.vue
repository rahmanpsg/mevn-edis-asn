<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="3" md="3" class="py-2" align-self="end">
        <v-hover v-slot="{ hover }">
          <v-card class="cardBtn" tile @click="sheet = true">
            <v-row class="no-gutters">
              <v-col cols="4" sm="12" lg="4">
                <div
                  class="secondary fill-height d-flex pa-5"
                  :class="hover ? `lighten-1` : ``"
                >
                  <v-icon size="35" color="white"> mdi-email-plus</v-icon>
                </div>
              </v-col>
              <v-col
                class="pa-3 py-7 secondary--text"
                :class="hover ? `secondary lighten-5` : ``"
              >
                <h5 class="text-truncate text-uppercase">Buat Permohonan</h5>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-col>

      <v-col cols="12">
        <v-card tile>
          <v-card-title class="white--text primary">
            <h4 v-if="!permohonans.length">Informasi</h4>
            <h4 v-else>Daftar Permohonan</h4>
            <v-spacer></v-spacer>
            <v-icon large color="white">mdi-information</v-icon>
          </v-card-title>
          <v-card-text>
            <v-row
              class="no-gutters overline"
              style="min-height: 100px"
              align="center"
              justify="center"
              v-if="!permohonans.length"
            >
              <v-icon class="d-none d-sm-flex mr-2" color="primary" large
                >mdi-information</v-icon
              >
              <h3>Anda belum memiliki permohonan</h3>
            </v-row>
            <v-row
              v-else
              class="no-gutters"
              v-for="(permohonan, i) in permohonans.slice().reverse()"
              :key="i"
            >
              <v-col cols="12" class="overline">
                Jenis Permohonan : {{ permohonan.jenis }}</v-col
              >
              <v-col cols="12" class="overline">
                Waktu Permohonan :
                {{ tanggalFormat(permohonan.createdAt) }}</v-col
              >
              <v-col cols="12" class="overline">
                Keterangan :
                {{ permohonan.keterangan }}</v-col
              >
              <v-col cols="12">
                <v-stepper v-model="stepper">
                  <v-stepper-header>
                    <template v-for="(step, x) in 4">
                      <v-stepper-step
                        :key="`step-${x}`"
                        :step="step"
                        edit-icon="mdi-timer-sand"
                        complete-icon="mdi-check-all"
                        :color="colorStatus(permohonan, step)"
                        :rules="[() => stepStatus(permohonan, step).rules]"
                        :editable="
                          stepStatus(permohonan, step).complete &&
                          stepStatus(permohonan, step).editable
                        "
                        :complete="stepStatus(permohonan, step).complete"
                      >
                        Verifikasi Tahap {{ step }}
                      </v-stepper-step>
                      <v-divider
                        v-if="step != 4"
                        :key="`divider-${x}`"
                      ></v-divider>
                    </template>
                  </v-stepper-header>
                </v-stepper>
              </v-col>
              <v-col cols="12" class="text-right my-4">
                <v-btn
                  color="success"
                  @click="cetakClick(permohonan._id)"
                  :disabled="!btnCetakAktif[i]"
                  ><v-icon left>mdi-printer</v-icon> Cetak</v-btn
                >
              </v-col>
              <v-divider class="ma-1"></v-divider>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-bottom-sheet v-model="sheet" persistent>
      <v-list>
        <v-subheader>
          Silahkan Pilih Jenis Permohonan
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="sheet = false"> Batal </v-btn>
        </v-subheader>
        <v-list-item @click="disiplinClick">
          <v-list-item-title>Disiplin</v-list-item-title>
        </v-list-item>
        <v-list-item @click="pidanaClick">
          <v-list-item-title>Pidana</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>

    <DialogCustom
      icon="mdi-email-send"
      :dialog="dialog"
      :dialogLoading="dialogLoading"
      :title="dialogTitle"
      @event="dialogAksi"
      @closeDialog="dialog = false"
    />

    <template v-if="dialogCetak">
      <DialogCetak
        :dialog="dialogCetak"
        @closeDialog="dialogCetak = false"
        :idPermohonan.sync="idPermohonan"
      />
    </template>

    <SnackbarResponse :response="response" />
  </v-container>
</template>

<script>
import moment from "moment";
import DialogCustom from "@/components/DialogCustom.vue";
import DialogCetak from "@/components/DialogCetak.vue";
import SnackbarResponse from "@/components/SnackbarResponse.vue";
import { mapState, mapActions } from "vuex";

import PermohonanModel from "@/models/permohonan";

export default {
  components: { DialogCustom, DialogCetak, SnackbarResponse },
  data: () => ({
    idPermohonanSelected: null,
    stepper: 0,
    sheet: false,
    dialog: false,
    dialogCetak: false,
    dialogLoading: false,
    loading: false,
    jenis: null,
    response: { show: false, text: "" },
  }),
  async created() {
    this.loading = true;

    await this.getPermohonanByPegawai(this.$store.state.userModule.pegawai._id);

    this.loading = false;
  },
  computed: {
    ...mapState("permohonanModule", ["permohonans"]),
    dialogTitle() {
      return `Permohonan untuk pembuatan surat pernyataan ${
        this.jenis == "disiplin"
          ? "tidak pernah dijatuhi hukuman disiplin"
          : "tidak sedang menjalani proses pidana atau pernah dipenjara"
      }  akan dikirim?`;
    },
    idPermohonan() {
      return this.idPermohonanSelected;
    },
    btnCetakAktif() {
      return this.permohonans
        .slice()
        .reverse()
        .map((per) => per.status.every(Boolean) && per.status.length == 4);
    },
  },
  methods: {
    ...mapActions("permohonanModule", [
      "getPermohonanByPegawai",
      "addPermohonan",
    ]),
    cetakClick(idPermohonanSelected) {
      this.idPermohonanSelected = idPermohonanSelected;
      this.dialogCetak = true;
    },
    disiplinClick() {
      this.sheet = false;
      this.dialog = true;
      this.jenis = "disiplin";
    },
    pidanaClick() {
      this.sheet = false;
      this.dialog = true;
      this.jenis = "pidana";
    },
    async dialogAksi() {
      this.dialogLoading = true;

      const permohonan = new PermohonanModel({
        pegawai: this.$store.state.userModule.pegawai._id,
        jenis: this.jenis,
      });

      const res = await this.addPermohonan(permohonan);

      this.dialogLoading = false;
      this.dialog = false;
      this.response = { show: true, text: res.data.message };
    },
    tanggalFormat(date) {
      return moment(date).format("LLLL");
    },
    colorStatus(permohonan, step) {
      return this.stepStatus(permohonan, step).editable ? "orange" : "success";
    },
    stepStatus(permohonan, step) {
      const status = permohonan.status;

      return {
        rules: !(!status.length <= step && status[step - 1] === false),
        editable: status[step - 1] != (undefined || true),
        complete:
          status.length >=
            (status[status.length - 1] == true ? step - 1 : step) || step == 1,
      };
    },
  },
};
</script>

<style scoped>
.cardBtn {
  cursor: pointer;
}
</style>
