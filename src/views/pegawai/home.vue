<template>
  <v-row align="center" justify="center">
    <v-col cols="12">
      <v-row class="no-gutters">
        <v-icon color="grey"> mdi-calendar </v-icon>
        <h4 class="blue-grey--text text--lighten-1">
          {{ tanggal }}
        </h4>
      </v-row>
    </v-col>
    <v-col cols="12" class="text-center">
      <v-img
        class="mx-auto"
        :src="require('@/assets/logo.png')"
        transition="scale-transition"
        width="100"
      ></v-img>
      <h1 class="orange--text">
        Selamat Datang Di Aplikasi Edukasi Disiplin Aparatur Sipil Negara
      </h1>
      <h3 class="orange--text">
        Badan Kepegawaian dan Pengembangan Sumber Daya Manusia Kabupaten
        Sidenreng Rappang
      </h3>
    </v-col>
    <v-col sm="9">
      <v-card tile>
        <v-card-title class="white--text primary">
          <h3>Profil</h3>
          <v-spacer></v-spacer>
          <v-icon large color="white">mdi-badge-account</v-icon>
        </v-card-title>
        <v-card-text>
          <v-row class="no-gutters overline">
            <template v-for="(profil, i) in profils">
              <v-col cols="12" class="ml-2" :key="i">
                <v-row>
                  <v-col cols="4" sm="3" v-text="profil.text"></v-col>
                  <v-col cols="1" class="mx-sm-n10">:</v-col>
                  <v-col v-text="profil.item"> </v-col>
                </v-row>
              </v-col>
              <v-divider class="mx-1" :key="`${i}-div`"></v-divider>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";

import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("userModule", ["pegawai"]),
    profils() {
      return [
        { text: "Nip", item: this.pegawai.nip },
        { text: "Nama", item: this.namaGelarFormat(this.pegawai) },
        {
          text: "Golongan / Pangkat",
          item: `${this.pegawai.golongan.golongan} / ${this.pegawai.golongan.pangkat}`,
        },
        { text: "Jabatan", item: this.pegawai.jabatan },
        {
          text: "Unit Organisasi",
          item: `${this.pegawai.unor.nama} pada ${this.pegawai.unor.unor_induk.unor_induk}`,
        },
      ];
    },
    tanggal() {
      moment.locale("id");
      return moment().format("DD MMMM YYYY");
    },
  },
  methods: {
    namaGelarFormat(item) {
      return (
        (item.gelar_depan ? `${item.gelar_depan} ` : "") +
        item.nama +
        (item.gelar_belakang ? `, ${item.gelar_belakang}` : "")
      );
    },
  },
};
</script>
