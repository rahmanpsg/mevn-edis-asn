<template>
  <v-stepper v-model="stepper" vertical>
    <v-card>
      <v-card-title>
        Prosedur Verifikator Permohonan Hukuman Disiplin dan Pidana
      </v-card-title>
      <v-card-text>
        <v-row class="py-2 px-2">
          <v-btn color="secondary" class="mr-5" disabled>
            <v-icon left> mdi-content-save </v-icon> Simpan
          </v-btn>

          <v-btn color="error" disabled>
            <v-icon left> mdi-restore-alert </v-icon> Reset
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
    <template v-for="n in steps">
      <v-stepper-step :key="`${n}-step`" :step="n" editabel>
        Pilih Verifikator Tingkat 1
        <small>Kasubid Pembinaan Disiplin</small>
      </v-stepper-step>

      <v-stepper-content :key="`${n}-content`" :step="n">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="editedItem.pegawai"
                label="Pegawai*"
                :items="listPegawai"
                item-text="namaWithGelar"
                return-object
                :rules="[(v) => !!v || 'Pegawai belum dipilih']"
                required
              >
                <template v-slot:item="data">
                  <v-list>
                    <v-list-item two-line>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ data.item.namaWithGelar }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ data.item.nip }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>
        <v-btn color="primary" @click="e6 = 2">
          Lanjut <v-icon right>mdi-arrow-right-thick</v-icon>
        </v-btn>
      </v-stepper-content>
    </template>
  </v-stepper>
</template>

<script>
export default {
  props: {
    steps: Number,
    valid: Boolean,
    listPegawai: Array,
    editedItem: Object,
  },
  data: () => ({ stepper: 1 }),
};
</script>
