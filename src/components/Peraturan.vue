<template>
  <section id="aturan">
    <v-container mb-5>
      <h2
        class="
          mt-5
          font-weight-light
          orange--text
          text-center text-md-h3 text-sm-h4
        "
      >
        PERATURAN PEMERINTAH REPUBLIK INDONESIA
      </h2>
      <h3
        class="
          mb-5
          text-sm-h4 text-md-h5
          font-weight-thin
          orange--text
          text-center
        "
      >
        NOMOR 53 TAHUN 2010 TENTANG DISIPLIN PEGAWAI NEGERI SIPIL
      </h3>
      <v-row>
        <v-col cols="12" sm="12" md="6">
          <h4 class="overline">Menimbang :</h4>

          <ol type="a">
            <li class="caption" v-for="(item, i) in menimbang" :key="i">
              {{ item }}
            </li>
          </ol>
        </v-col>
        <v-col cols="12" sm="12" md="6">
          <h4 class="overline">Mengingat :</h4>
          <ol>
            <li class="caption" v-for="(item, i) in mengingat" :key="i">
              {{ item }}
            </li>
          </ol>
        </v-col>

        <v-col>
          <v-btn small color="secondary"
            ><v-icon left dark>mdi-download-box</v-icon> Unduh PDF
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  data: () => ({
    menimbang: [
      `Bahwa Peraturan Pemerintah Nomor 30 Tahun 1980 tentang Peraturan Disiplin Pegawai Negeri Sipil sudah tidak sesuai dengan kebutuhan dan perkembangan keadaan;`,
      `Bahwa dalam rangka melaksanakan ketentuan Pasal 30 Undang-Undang Nomor 43 Tahun 1999 tentang Perubahan atas Undang-Undang Nomor 8 Tahun 1974 tentang Pokok-Pokok Kepegawaian, perlu mengganti Peraturan Pemerintah Nomor 30 Tahun 1980 tentang Peraturan Disiplin Pegawai Negeri Sipil;`,
      `Bahwa berdasarkan pertimbangan sebagaimana dimaksud dalam huruf a dan huruf b, perlu menetapkan Peraturan Pemerintah tentang Disiplin Pegawai Negeri Sipil;`,
    ],
    mengingat: [
      `Pasal 5 ayat (2) Undang-Undang Dasar Negara Republik Indonesia Tahun 1945;`,
      `Undang-Undang Nomor 8 Tahun 1974 tentang PokokPokok Kepegawaian (Lembaran Negara Republik Indonesia Tahun 1974 Nomor 55, Tambahan Lembaran Negara Republik Indonesia Nomor 3041) sebagaimana telah diubah dengan Undang-Undang Nomor 43 Tahun 1999 (Lembaran Negara Republik Indonesia Tahun 1999 Nomor 169, Tambahan Lembaran Negara Republik Indonesia Nomor 3890);`,
    ],
  }),
};
</script>
