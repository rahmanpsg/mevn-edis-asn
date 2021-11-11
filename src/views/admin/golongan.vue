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
          itemKey="nik"
          sortBy="nik"
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
                      <v-text-field
                        v-model="editedItem.golongan"
                        label="Golongan*"
                        :rules="golRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="editedItem.pangkat"
                        label="Pangkat*"
                        :rules="[(v) => !!v || 'Pangkat tidak boleh kosong']"
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

import GolonganModel from "@/models/golongan";

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
        { text: "Golongan", value: "golongan" },
        { text: "Pangkat", value: "pangkat" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      dialog: false,
      dialogLoading: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: new GolonganModel({}),
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
    ...mapState("golonganModule", {
      items: "golongans",
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Golongan"
        : "Edit Data Golongan";
    },
    golRules() {
      return [
        (v) => !!v || "Golongan tidak boleh kosong",
        (v) => {
          return (
            (this.editedIndex != -1 && this.items[this.editedIndex].nik == v) ||
            !this.items.find((item) => item.nik == v) ||
            "Golongan telah ada"
          );
        },
      ];
    },
  },
  methods: {
    ...mapActions("golonganModule", [
      "getAll",
      "addGolongan",
      "editGolongan",
      "deleteGolongan",
    ]),
    tambah() {
      this.editedItem = new GolonganModel({});

      this.dialog = true;

      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    edit(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new GolonganModel(item);

      this.dialog = true;
    },
    showDialogHapus(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new GolonganModel(item);

      this.dialogDelete = true;
    },
    async hapus() {
      const res = await this.deleteGolongan({
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
        res = await this.editGolongan({
          index: this.editedIndex,
          golongan: this.editedItem,
        });
      } else {
        res = await this.addGolongan(this.editedItem);
      }

      this.response = { show: true, text: res.data.message };

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.dialogLoading = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        this.editedItem = new GolonganModel({});
        this.editedIndex = -1;
      });
    },
  },
};
</script>
