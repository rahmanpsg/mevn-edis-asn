<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" lg="4" sm="4" class="pb-2">
        <v-card tile>
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="primary fill-height d-flex pa-5">
                <v-icon size="35" color="white">
                  mdi-email-send-outline
                </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 primary--text">
              <h5 class="text-truncate text-uppercase">Total Permohonan</h5>
              <h1>{{ totalPermohonan }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4" sm="4" class="pb-2">
        <v-card tile>
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="secondary fill-height d-flex pa-5">
                <v-icon size="35" color="white"> mdi-timer-sand </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 secondary--text">
              <h5 class="text-truncate text-uppercase">Belum Di Verifikasi</h5>
              <h1>{{ listPermohonan[0].length }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4" sm="4" class="pb-2">
        <v-card tile>
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="success fill-height d-flex pa-5">
                <v-icon size="35" color="white"> mdi-check-all </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 success--text">
              <h5 class="text-truncate text-uppercase">Telah Di Verifikasi</h5>
              <h1>{{ listPermohonan[1].length }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card tile>
          <v-app-bar elevation="0" absolute color="primary" elevate-on-scroll>
            <v-toolbar flat color="primary" dark>
              <v-toolbar-title>
                <h4 v-if="!permohonans.length">Informasi</h4>
                <h4 v-else>Daftar Permohonan</h4>
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-icon large color="white">mdi-information</v-icon>
            </v-toolbar>
            <template v-slot:extension>
              <v-tabs color="primary" background-color="white" v-model="tab">
                <v-tab v-for="(item, i) in tabs" :key="i" :href="`#${item}`">
                  {{ item }}
                </v-tab>
              </v-tabs>
            </template>
          </v-app-bar>

          <v-sheet class="overflow-y-auto" max-height="600">
            <v-tabs-items style="margin-top: 100px" v-model="tab">
              <v-tab-item
                v-for="(tab, y) in tabs"
                :key="`item-${y}`"
                :value="tab"
              >
                <v-card v-if="!permohonans.length">
                  <v-card-text>
                    <v-row
                      class="no-gutters overline"
                      style="min-height: 100px"
                      align="center"
                      justify="center"
                    >
                      <v-icon
                        class="d-none d-sm-flex mr-2"
                        color="primary"
                        large
                        >mdi-information</v-icon
                      >
                      <h3>Belum ada permohonan di terima</h3>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-card v-else>
                  <v-card-text>
                    <v-row
                      v-if="!listPermohonan[y].length"
                      align="center"
                      justify="center"
                      class="my-3"
                    >
                      <v-icon
                        class="d-none d-sm-flex mr-2"
                        color="primary"
                        large
                        >mdi-information</v-icon
                      >
                      <h3>Belum ada data permohonan</h3>
                    </v-row>
                    <v-row
                      v-else
                      class="no-gutters"
                      v-for="(permohonan, i) in listPermohonan[y]
                        .slice()
                        .reverse()"
                      :key="i"
                    >
                      <v-col
                        cols="12"
                        class="my-4"
                        v-for="(tabel, x) in tabelFormat(permohonan)"
                        :key="x"
                      >
                        <v-row class="no-gutters">
                          <v-col cols="5" sm="3" v-text="tabel.text"> </v-col>
                          <v-col cols="1" class="mx-sm-n5">:</v-col>
                          <v-col v-text="tabel.item"> </v-col>
                        </v-row>
                      </v-col>
                      <template v-if="y == 1">
                        <v-col cols="12" class="my-4">
                          <v-row class="no-gutters">
                            <v-col cols="5" sm="3">Waktu Verifikasi </v-col>
                            <v-col cols="1" class="mx-sm-n5">:</v-col>
                            <v-col
                              v-text="
                                tanggalFormat(permohonan.waktuVerif[tahap - 1])
                              "
                            ></v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="my-4">
                          <v-row class="no-gutters">
                            <v-col cols="5" sm="3">Status </v-col>
                            <v-col cols="1" class="mx-sm-n5">:</v-col>
                            <v-col>
                              <v-chip
                                class="overline font-weight-bold"
                                :color="
                                  permohonan.status[tahap - 1]
                                    ? 'success'
                                    : 'error'
                                "
                                dark
                                label
                                v-text="
                                  permohonan.status[tahap - 1]
                                    ? 'Diterima'
                                    : 'Ditolak'
                                "
                              >
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-col>
                      </template>

                      <v-col v-if="y == 0" cols="12" class="my-4">
                        <v-btn
                          color="success"
                          class="mr-4"
                          @click="aksiClick('terima', permohonan._id)"
                        >
                          <v-icon left>mdi-check</v-icon>
                          Terima</v-btn
                        >
                        <v-btn
                          color="error"
                          @click="aksiClick('tolak', permohonan._id)"
                        >
                          <v-icon left>mdi-close</v-icon>
                          Tolak</v-btn
                        >
                      </v-col>
                      <v-divider class="ma-1"></v-divider>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-sheet>
        </v-card>
      </v-col>
    </v-row>

    <DialogCustom
      icon="mdi-alert-circle"
      :dialog="dialog"
      :dialogLoading="dialogLoading"
      :title="dialogTitle"
      @event="dialogAksi"
      @closeDialog="dialog = false"
    />

    <SnackbarResponse :response="response" />
  </v-container>
</template>

<script>
import moment from "moment";
import DialogCustom from "@/components/DialogCustom.vue";
import SnackbarResponse from "@/components/SnackbarResponse.vue";
import { mapState, mapActions } from "vuex";

import VerifikasiModel from "@/models/verifikasi";

export default {
  components: { DialogCustom, SnackbarResponse },
  data: () => ({
    tab: null,
    tabs: ["Belum Di Verifikasi", "Telah Di Verifikasi"],
    aksi: null,
    idPermohonanSelected: null,
    dialog: false,
    dialogLoading: false,
    loading: false,
    response: { show: false, text: "" },
  }),
  async created() {
    this.loading = true;

    await this.getPermohonanByVerifikator(
      this.$store.state.userModule.verifikator._id
    );

    this.loading = false;
  },
  computed: {
    ...mapState("permohonanModule", ["permohonans"]),
    tahap() {
      return Math.floor(this.$store.state.userModule.verifikator.tahap);
    },
    listPermohonan() {
      const belumDiVerif = this.permohonans.filter(
        (per) => per.status.length == this.tahap - 1
      );

      const telahDiVerif = this.permohonans.filter(
        (per) => per.status.length >= this.tahap
      );

      return [belumDiVerif, telahDiVerif];
    },
    totalPermohonan() {
      return this.permohonans.length;
    },
    dialogTitle() {
      return `Anda yakin untuk ${
        this.aksi == "terima" ? "menerima" : "menolak"
      } permohonan ini?`;
    },
  },
  methods: {
    ...mapActions("permohonanModule", [
      "getPermohonanByVerifikator",
      "verifikasiPermohonan",
    ]),
    aksiClick(aksi, idPermohonan) {
      this.aksi = aksi;
      this.idPermohonanSelected = idPermohonan;
      this.dialog = true;
    },
    async dialogAksi() {
      this.dialogLoading = true;

      const verifikasi = new VerifikasiModel({
        permohonan: this.idPermohonanSelected,
        status: this.aksi == "terima",
        verifiedBy: this.$store.state.userModule.verifikator._id,
      });

      const res = await this.verifikasiPermohonan(verifikasi);

      this.dialogLoading = false;
      this.dialog = false;
      this.response = { show: true, text: res.data.message };
    },
    namaGelarFormat(item) {
      return (
        (item.gelar_depan ? `${item.gelar_depan} ` : "") +
        item.nama +
        (item.gelar_belakang ? `, ${item.gelar_belakang}` : "")
      );
    },
    tabelFormat(item) {
      return [
        { text: "Jenis Permohonan", item: item.jenis.toUpperCase() },
        { text: "NIP", item: item.pegawai.nip },
        { text: "Pemohon", item: this.namaGelarFormat(item.pegawai) },
        {
          text: "Golongan / Pangkat",
          item: `${item.pegawai.golongan.golongan} / ${item.pegawai.golongan.pangkat}`,
        },
        {
          text: "Unit Organisasi",
          item: `${item.pegawai.unor.nama} Pada ${item.pegawai.unor.unor_induk.unor_induk}`,
        },
        { text: "Jabatan", item: item.pegawai.jabatan },
        { text: "Waktu Permohonan", item: this.tanggalFormat(item.createdAt) },
      ];
    },
    tanggalFormat(date) {
      return moment(date).format("LLLL");
    },
  },
};
</script>

<style scoped>
.cardBtn {
  cursor: pointer;
}
</style>
