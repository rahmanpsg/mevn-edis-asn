<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-stepper v-model="stepper" vertical>
          <v-card>
            <v-card-title>
              Prosedur Verifikator Permohonan Hukuman Disiplin dan Pidana
            </v-card-title>
            <v-card-text>
              <v-row class="py-2 px-2">
                <v-btn
                  color="secondary"
                  class="mr-5"
                  :disabled="allStepValid || !canSave"
                  @click="simpan"
                >
                  <v-icon left> mdi-content-save </v-icon> Simpan
                </v-btn>

                <v-btn
                  color="error"
                  class="mr-5"
                  :disabled="allStepValid"
                  @click="dialogReset = true"
                >
                  <v-icon left> mdi-restore-alert </v-icon> Reset
                </v-btn>

                <v-progress-circular
                  indeterminate
                  color="primary"
                  v-if="loading"
                ></v-progress-circular>
              </v-row>
            </v-card-text>
          </v-card>

          <template v-for="n in steps">
            <v-stepper-step
              :key="`${n}-step`"
              :step="n"
              :rules="[() => stepRules[n - 1]]"
              :editable="stepItem[n - 1].pegawai == null"
              :complete="stepItem[n - 1].pegawai != null"
            >
              Verifikator Tahap {{ n }}
              <small class="font-weight-bold" v-text="headers[n - 1]"></small>
              <template v-if="stepItem[n - 1].pegawai != null">
                <small
                  v-text="`Nama : ${stepItem[n - 1].pegawai.namaWithGelar}`"
                  class="ml-2"
                ></small>
                <small
                  v-text="`NIP : ${stepItem[n - 1].pegawai.nip}`"
                  class="ml-2"
                ></small>
              </template>
            </v-stepper-step>

            <v-stepper-content :key="`${n}-content`" :step="n">
              <v-form :ref="`form-${n}`" v-model="valid[n - 1]" lazy-validation>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="stepItem[n - 1].pegawai"
                      :label="headers[n - 1]"
                      :items="listPegawai"
                      item-text="namaWithGelar"
                      return-object
                      :rules="[(v) => !!v || 'Verifikator belum dipilih']"
                      required
                      @change="canSave = true"
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
              <v-btn color="primary" @click="validateStep(n)">
                Lanjut <v-icon right>mdi-arrow-right-thick</v-icon>
              </v-btn>
            </v-stepper-content>
          </template>

          <v-stepper-step
            step="4"
            :rules="[() => stepRules[3] || stepRules[4]]"
            :editable="
              stepItem[3].pegawai == null || stepItem[4].pegawai == null
            "
            :complete="
              stepItem[3].pegawai != null || stepItem[4].pegawai != null
            "
          >
            Verifikator Tahap 4
            <small class="font-weight-bold" v-text="`${headers[3][0]}`"></small>
            <template v-if="stepItem[3].pegawai != null">
              <small
                v-text="`Nama : ${stepItem[3].pegawai.namaWithGelar}`"
                class="ml-2"
              ></small>
              <small
                v-text="`NIP : ${stepItem[3].pegawai.nip}`"
                class="ml-2"
              ></small>
            </template>
            <small class="font-weight-bold" v-text="`${headers[3][1]}`"></small>
            <template v-if="stepItem[3 + 1].pegawai != null">
              <small
                v-text="`Nama : ${stepItem[3 + 1].pegawai.namaWithGelar}`"
                class="ml-2"
              ></small>
              <small
                v-text="`NIP : ${stepItem[3 + 1].pegawai.nip}`"
                class="ml-2"
              ></small>
            </template>
          </v-stepper-step>

          <v-stepper-content step="4">
            <v-form ref="form-4" v-model="valid[3]" lazy-validation>
              <v-row>
                <v-col cols="12" v-for="n in [0, 1]" :key="n">
                  <v-autocomplete
                    v-model="stepItem[3 + n].pegawai"
                    :label="headers[3][n]"
                    :items="listPegawai"
                    item-text="namaWithGelar"
                    return-object
                    :rules="[(v) => !!v || 'Verifikator belum dipilih']"
                    required
                    @change="canSave = true"
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
          </v-stepper-content>
        </v-stepper>
      </v-col>
      <DialogCustom
        :dialog="dialogReset"
        title="Anda yakin untuk mereset data verifikator?"
        @event="reset"
        @closeDialog="dialogReset = false"
      />
      <SnackbarResponse :response="response" />
    </v-row>
  </v-container>
</template>

<script>
import DialogCustom from "@/components/DialogCustom.vue";
import SnackbarResponse from "@/components/SnackbarResponse.vue";
import { mapState, mapActions } from "vuex";

import VerifikatorModel from "@/models/verifikator";

export default {
  components: { DialogCustom, SnackbarResponse },
  data() {
    return {
      loading: true,
      stepper: 0,
      steps: 3,
      headers: [
        "Kasubid Pembinaan Disiplin",
        "Kabid Penilaian Kinerja Aparatur dan Penghargaan",
        "Kepala BKPSDM",
        [
          "Sekretaris Daerah Kabupaten (Disiplin)",
          "Asisten Pemerintahan dan Kesra (Pidana)",
        ],
      ],
      defaultItem: [1, 2, 3, 4.1, 4.2].map(
        (n) => new VerifikatorModel({ tahap: n })
      ),
      valid: [0, 1, 2, 3].map(() => true),
      dialogReset: false,
      response: { show: false, text: "" },
      canSave: false,
    };
  },
  async created() {
    await this.getListPegawai();
    await this.getAll(this.listPegawai);

    this.loading = false;
  },
  computed: {
    ...mapState("verifikatorModule", ["verifikators"]),
    ...mapState("pegawaiModule", {
      listPegawai: "pegawais",
    }),
    stepRules() {
      return this.valid.map((v) => v);
    },
    allStepValid() {
      return !this.loading && !this.stepItem.every((v) => v.pegawai != null);
    },
    stepItem() {
      return this.verifikators.length > 0
        ? this.verifikators
        : this.defaultItem;
    },
  },
  methods: {
    ...mapActions("verifikatorModule", [
      "getAll",
      "addVerifikators",
      "resetVerifikator",
    ]),
    ...mapActions("pegawaiModule", ["getListPegawai"]),
    async validateStep(step) {
      await this.$refs[`form-${step}`][0].validate();
      if (this.valid[step - 1]) this.stepper++;
    },
    async simpan() {
      this.loading = true;
      const res = await this.addVerifikators(this.stepItem);

      this.response = { show: true, text: res.data.message };

      this.stepper = 0;
      this.loading = false;
      this.canSave = false;
    },
    async reset() {
      this.loading = true;
      const res = await this.resetVerifikator();

      this.dialogReset = false;
      this.response = { show: true, text: res.data.message };
      this.loading = false;
    },
  },
};
</script>
