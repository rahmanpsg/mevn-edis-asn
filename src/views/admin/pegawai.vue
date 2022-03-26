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
          itemKey="nip"
          sortBy="nip"
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
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nip"
                        type="number"
                        label="NIP*"
                        :rules="nipRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.nama"
                        label="Nama*"
                        :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.gelar_depan"
                        label="Gelar Depan"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.gelar_belakang"
                        label="Gelar Belakang"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.username"
                        label="Username*"
                        :rules="usernameRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.password"
                        type="password"
                        label="Password*"
                        :rules="[(v) => !!v || 'Password tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-autocomplete
                        v-model="editedItem.golongan"
                        label="Pangkat / Golongan*"
                        :items="golongans"
                        item-text="golongan"
                        return-object
                        :rules="[(v) => !!v || 'Golongan belum dipilih']"
                        required
                      >
                        <template v-slot:item="data">
                          {{ data.item.golongan }} - {{ data.item.pangkat }}
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-autocomplete
                        v-model="editedItem.unor"
                        label="Unit Organisasi*"
                        :items="unors"
                        item-text="nama"
                        return-object
                        :rules="[(v) => !!v || 'Unit Organisasi belum dipilih']"
                        required
                      >
                        <template v-slot:item="data">
                          <template v-if="typeof data.item !== 'object'">
                            <v-list-tile-content
                              v-text="data.item"
                            ></v-list-tile-content>
                          </template>
                          <template v-else>
                            {{ data.item.nama }}
                          </template>
                        </template>
                      </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.jabatan"
                        label="Jabatan*"
                        :rules="[(v) => !!v || 'Jabatan tidak boleh kosong']"
                        required
                      ></v-text-field>
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

import PegawaiModel from "@/models/pegawai";

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
        { text: "NIP", value: "nip" },
        { text: "Nama", value: "nama" },
        { text: "Golongan", value: "golongan.golongan" },
        { text: "Unit Organisasi", value: "unor.nama" },
        { text: "Jabatan", value: "jabatan" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      dialog: false,
      dialogLoading: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: new PegawaiModel({}),
      valid: true,
      response: { show: false, text: "" },
      alertImage: false,
    };
  },
  async created() {
    await this.getAll();
    await this.getAllGolongan();
    await this.getUnorList();

    this.loading = false;
  },
  computed: {
    ...mapState("pegawaiModule", {
      items: "pegawais",
    }),
    ...mapState("golonganModule", { golongans: "golongans" }),
    ...mapState("unorModule", { unors: "unors" }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Pegawai"
        : "Edit Data Pegawai";
    },
    nipRules() {
      return [
        (v) => !!v || "NIP tidak boleh kosong",
        (v) => (v && v.length == 18) || "NIP harus 18 karakter",
        (v) => {
          return (
            (this.editedIndex != -1 && this.items[this.editedIndex].nip == v) ||
            !this.items.find((item) => item.nip == v) ||
            "NIP telah digunakan"
          );
        },
      ];
    },
    usernameRules() {
      return [
        (v) => !!v || "Username tidak boleh kosong",
        (v) => (v && v.length >= 6) || "Username minimal 6 karakter",
        (v) => {
          return (
            (this.editedIndex != -1 &&
              this.items[this.editedIndex].username == v) ||
            !this.items.find((item) => item.username == v) ||
            "Username telah digunakan"
          );
        },
      ];
    },
  },
  methods: {
    ...mapActions("pegawaiModule", [
      "getAll",
      "addPegawai",
      "editPegawai",
      "deletePegawai",
    ]),
    ...mapActions("golonganModule", { getAllGolongan: "getAll" }),
    ...mapActions("unorModule", { getUnorList: "getUnorList" }),
    tambah() {
      this.editedItem = new PegawaiModel({});

      this.dialog = true;

      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    edit(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new PegawaiModel(item);

      this.dialog = true;
    },
    showDialogHapus(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new PegawaiModel(item);

      this.dialogDelete = true;
    },
    async hapus() {
      const res = await this.deletePegawai({
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
        res = await this.editPegawai({
          index: this.editedIndex,
          pegawai: this.editedItem,
        });
      } else {
        res = await this.addPegawai(this.editedItem);
      }

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.dialogLoading = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        this.editedItem = new PegawaiModel({});
        this.editedIndex = -1;
      });
    },
  },
};
</script>
