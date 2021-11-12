<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambahUnorInduk"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="unorInduks"
          itemKey="_id"
          :loading="loading"
          :dialogDelete="dialogDelete"
          showSelect
          :selectedFilter.sync="selectedUnor"
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
                      <v-text-field
                        v-model="editedItem.unor_induk"
                        label="Unit Organisasi Induk*"
                        :rules="[
                          (v) =>
                            !!v || 'Unit Organisasi Induk tidak boleh kosong',
                        ]"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </DialogForm>

            <DialogCustom
              :dialog="dialogDelete"
              title="Anda yakin untuk menghapus unit organisasi induk ini? Semua data unit organisasi akan ikut terhapus!"
              @event="hapus"
              @closeDialog="closeDialog"
            />
          </template>
        </Table>
      </v-col>
      <v-col>
        <Table
          @tambah="tambahUnor"
          @edit="edit2"
          @hapus="showDialogHapus2"
          :headers="headers2"
          :items="filteredUnors"
          itemKey="nik"
          sortBy="nik"
          :loading="loading"
          :dialogDelete="dialogDelete2"
        >
          <template v-slot:modal>
            <DialogForm
              :dialog="dialog2"
              :loading="dialogLoading2"
              :formTitle="formTitle"
              @closeDialog="closeDialog2"
              @simpan="simpan2"
            >
              <template v-slot:form>
                <v-form ref="form2" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="editedItem.unor_induk"
                        label="Unit Organisasi Induk*"
                        :items="unorInduks"
                        item-text="unor_induk"
                        item-value="_id"
                        :rules="[
                          (v) => !!v || 'Unor Organisasi Induk belum dipilih',
                        ]"
                        required
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.nama"
                        label="Nama*"
                        :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </DialogForm>

            <DialogCustom
              :dialog="dialogDelete2"
              title="Anda yakin untuk menghapus data ini?"
              @event="hapus2"
              @closeDialog="closeDialog2"
            />
          </template>
        </Table>
      </v-col>
      <SnackbarResponse :response="response" />
    </v-row>
  </v-container>
</template>

<script>
import Table from "@/components/Table.vue";
import DialogForm from "@/components/DialogForm.vue";
import DialogCustom from "@/components/DialogCustom.vue";
import SnackbarResponse from "@/components/SnackbarResponse.vue";
import { mapState, mapActions } from "vuex";

import UnorIndukModel from "@/models/unorInduk";
import UnorModel from "@/models/unor";

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
        { text: "Unit Organisasi Induk", value: "unor_induk" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      headers2: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Unit Organisasi", value: "nama" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      selectedUnor: null,
      dialog: false,
      dialog2: false,
      dialogLoading: false,
      dialogLoading2: false,
      dialogDelete: false,
      dialogDelete2: false,
      editedIndex: -1,
      editedItem: new UnorIndukModel({}),
      valid: true,
      response: { show: false, text: "" },
      alertImage: false,
    };
  },
  async created() {
    await this.getAll();
    this.loading = false;
  },
  computed: {
    ...mapState("unorModule", { unorInduks: "unorInduks", unors: "unors" }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Unit Organisasi"
        : "Edit Data Unit Organisasi";
    },
    filteredUnors() {
      if (this.selectedUnor == null) return this.unors;
      return this.unors.filter((unor) => unor.unor_induk == this.selectedUnor);
    },
    golRules() {
      return [
        (v) => !!v || "Unit Organisasi tidak boleh kosong",
        (v) => {
          return (
            (this.editedIndex != -1 &&
              this.unorInduks[this.editedIndex].nik == v) ||
            !this.unorInduks.find((item) => item.nik == v) ||
            "Unit Organisasi telah ada"
          );
        },
      ];
    },
  },
  methods: {
    ...mapActions("unorModule", [
      "getAll",
      "addUnorInduk",
      "addUnor",
      "editUnorInduk",
      "editUnor",
      "deleteUnorInduk",
      "deleteUnor",
    ]),
    tambahUnorInduk() {
      this.editedItem = new UnorIndukModel({});

      this.dialog = true;

      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    tambahUnor() {
      this.editedItem = new UnorModel({});

      this.dialog2 = true;

      this.$nextTick(() => {
        this.$refs.form2.reset();
      });
    },
    edit(item) {
      this.editedIndex = this.unorInduks.indexOf(item);
      this.editedItem = new UnorIndukModel(item);

      this.dialog = true;
    },
    edit2(item) {
      this.editedIndex = this.unors.indexOf(item);
      this.editedItem = new UnorModel(item);

      this.dialog2 = true;
    },
    showDialogHapus(item) {
      this.editedIndex = this.unorInduks.indexOf(item);
      this.editedItem = new UnorIndukModel(item);

      this.dialogDelete = true;
    },
    showDialogHapus2(item) {
      this.editedIndex = this.unors.indexOf(item);
      this.editedItem = new UnorModel(item);

      this.dialogDelete2 = true;
    },
    async hapus() {
      const res = await this.deleteUnorInduk({
        index: this.editedIndex,
        id: this.editedItem._id,
      });

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    async hapus2() {
      const res = await this.deleteUnor({
        index: this.editedIndex,
        id: this.editedItem._id,
      });

      this.response = { show: true, text: res.data.message };

      this.closeDialog2();
    },
    async simpan() {
      await this.$refs.form.validate();

      if (!this.valid) return;

      this.dialogLoading = true;

      let res;
      if (this.editedIndex > -1) {
        res = await this.editUnorInduk({
          index: this.editedIndex,
          unorInduk: this.editedItem,
        });
      } else {
        res = await this.addUnorInduk(this.editedItem);
      }

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    async simpan2() {
      await this.$refs.form2.validate();

      if (!this.valid) return;

      this.dialogLoading2 = true;

      let res;
      if (this.editedIndex > -1) {
        res = await this.editUnor({
          index: this.editedIndex,
          unor: this.editedItem,
          idUnorInduk: this.editedItem.unor_induk,
        });
      } else {
        res = await this.addUnor(this.editedItem, this.editedItem.unor_induk);
      }

      this.response = { show: true, text: res.data.message };

      this.closeDialog2();
    },
    closeDialog() {
      this.dialog = false;
      this.dialogLoading = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        this.editedItem = new UnorIndukModel({});
        this.editedIndex = -1;
      });
    },
    closeDialog2() {
      this.dialog2 = false;
      this.dialogLoading2 = false;
      this.dialogDelete2 = false;

      this.$nextTick(() => {
        this.editedItem = new UnorModel({});
        this.editedIndex = -1;
      });
    },
  },
};
</script>
