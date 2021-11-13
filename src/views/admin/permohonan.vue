<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="items"
          itemKey="_id"
          sortBy="createdAt"
          :loading="loading"
          :dialogDelete="dialogDelete"
        >
          <template v-slot:modal>
            <DialogForm
              :dialog="dialog"
              :loading="dialogLoading"
              :formTitle="formTitle"
              @closeDialog="closeDialog"
              @simpan="simpan"
            >
              <template v-slot:form>
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
                    <v-col cols="12">
                      <v-combobox
                        v-model="editedItem.jenis"
                        :items="[`Disiplin`, `Pidana`]"
                        label="Jenis Permohonan*"
                        :rules="[
                          (v) => !!v || 'Jenis permohonan belum dipilih',
                        ]"
                        required
                      ></v-combobox>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.tanggal"
                        type="date"
                        label="Tanggal*"
                        :rules="[(v) => !!v || 'Tanggal tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.keterangan"
                        label="Keterangan*"
                        :rules="[(v) => !!v || 'Keterangan tidak boleh kosong']"
                        required
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </DialogForm>

            <DialogCustom
              :dialog="dialogDelete"
              title="Anda yakin untuk menghapus data ini?"
              @event="hapus"
              @closeDialog="closeDialog"
            />
          </template>
        </Table>

        <SnackbarResponse :response="response" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Table from "@/components/Table.vue";
import DialogForm from "@/components/DialogForm.vue";
import DialogCustom from "@/components/DialogCustom.vue";
import SnackbarResponse from "@/components/SnackbarResponse.vue";
import { mapState, mapActions } from "vuex";

import PermohonanModel from "@/models/permohonan";

export default {
  components: {
    Table,
    DialogForm,
    DialogCustom,
    SnackbarResponse,
  },
  data() {
    return {
      loading: true,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Waktu Permohonan", value: "createdAt" },
        { text: "Jenis Permohonan", value: "jenis" },
        { text: "Nama", value: "pegawai.nama" },
        { text: "Status", value: "status" },
        { text: "Keterangan", value: "keterangan" },
      ],
      dialog: false,
      dialogLoading: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: new PermohonanModel({}),
      valid: true,
      response: { show: false, text: "" },
      alertImage: false,
    };
  },
  async created() {
    await this.getListPegawai();
    await this.getAll();

    this.loading = false;
  },
  computed: {
    ...mapState("permohonanModule", {
      items: "permohonans",
    }),
    ...mapState("pegawaiModule", {
      listPegawai: "pegawais",
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Permohonan"
        : "Edit Data Permohonan";
    },
    golRules() {
      return [
        (v) => !!v || "Permohonan tidak boleh kosong",
        (v) => {
          return (
            (this.editedIndex != -1 && this.items[this.editedIndex].nik == v) ||
            !this.items.find((item) => item.nik == v) ||
            "Permohonan telah ada"
          );
        },
      ];
    },
  },
  methods: {
    ...mapActions("permohonanModule", [
      "getAll",
      "addPermohonan",
      "editPermohonan",
      "deletePermohonan",
    ]),
    ...mapActions("pegawaiModule", ["getListPegawai"]),
    tambah() {
      this.editedItem = new PermohonanModel({});

      this.dialog = true;

      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    edit(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new PermohonanModel({
        ...item,
        pegawai: this.listPegawai.find((p) => p._id == item.pegawai._id),
      });

      this.dialog = true;
    },
    showDialogHapus(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new PermohonanModel(item);

      this.dialogDelete = true;
    },
    async hapus() {
      const res = await this.deletePermohonan({
        index: this.editedIndex,
        id: this.editedItem._id,
      });

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    async simpan() {
      await this.$refs.form.validate();

      if (!this.valid) return;

      this.dialogLoading = true;

      let res;
      if (this.editedIndex > -1) {
        res = await this.editPermohonan({
          index: this.editedIndex,
          permohonan: this.editedItem,
        });
      } else {
        res = await this.addPermohonan(this.editedItem);
      }

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.dialogLoading = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        this.editedItem = new PermohonanModel({});
        this.editedIndex = -1;
      });
    },
  },
};
</script>
