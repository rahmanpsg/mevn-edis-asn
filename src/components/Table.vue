<template>
  <v-card elevation="2" class="cardRadius">
    <v-card-title>
      <v-btn color="secondary" @click.stop="$emit('tambah')">
        <v-icon left> mdi-plus </v-icon>
        Tambah Data
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pencarian"
        single-line
        hide-details
        dense
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :item-key="itemKey"
      :items-per-page="10"
      :search="search"
      :loading="loading"
      :group-by="groupBy"
      :show-group-by="groupBy != null"
      loading-text="Loading data..."
      :show-expand="expanded"
      :single-expand="true"
      :sort-by="sortBy"
      :show-select="showSelect"
      single-select
      @click:row="selectRow"
    >
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:[`item.createdAt`]="{ item }">
        {{ tanggalFormat(item.createdAt) }}
      </template>

      <template v-slot:[`item.nama`]="{ item }">
        {{ namaGelarFormat(item) }}
      </template>

      <template v-slot:[`item.pegawai.nama`]="{ item }">
        {{ namaGelarFormat(item.pegawai) }}
      </template>

      <template v-slot:[`item.jenis`]="{ item }">
        <v-chip
          class="overline font-weight-bold"
          :color="item.jenis.toLowerCase() == 'pidana' ? 'error' : 'warning'"
          dark
          label
          v-text="item.jenis"
        >
        </v-chip>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-row v-if="checkStatus(item.status)">
          <v-col v-for="i in 4" :key="i" class="mx-n2">
            <v-progress-linear
              v-if="item.status[i - 1] != false"
              background-color="secondary lighten-4"
              color="secondary lighten-1"
              :value="item.status[i - 1] == true ? 100 : 0"
              :buffer-value="
                item.status.every(Boolean)
                  ? item.status.length == i - 1
                    ? 0
                    : 100
                  : 100
              "
              stream
              :class="item.status.every(Boolean) ? `` : `mt-2`"
            ></v-progress-linear>
            <v-icon v-else small color="error"> mdi-close-thick </v-icon>
          </v-col>
        </v-row>
        <v-icon v-else color="success">mdi-check-all</v-icon>
      </template>

      <template v-slot:[`item.aksi`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              color="warning"
              @click.stop="$emit('edit', item)"
            >
              mdi-archive-edit-outline
            </v-icon>
          </template>
          <span>Edit Data</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="error"
              @click.stop="$emit('hapus', item)"
            >
              mdi-delete-forever-outline
            </v-icon>
          </template>
          <span>Hapus Data</span>
        </v-tooltip>
      </template>

      <template v-slot:top>
        <slot name="modal"></slot>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import moment from "moment";

export default {
  props: {
    headers: Array,
    items: Array,
    itemKey: String,
    sortBy: String,
    groupBy: String,
    loading: Boolean,
    expanded: Boolean,
    showSelect: Boolean,
    selectedFilter: String,
  },
  data: () => ({
    search: "",
  }),
  methods: {
    selectRow(item, row) {
      row.select(!row.isSelected);
      this.$emit("update:selectedFilter", !row.isSelected ? item._id : null);
    },
    tanggalFormat(date) {
      return moment(date).format("llll");
    },
    namaGelarFormat(item) {
      return (
        (item.gelar_depan ? `${item.gelar_depan} ` : "") +
        item.nama +
        (item.gelar_belakang ? `, ${item.gelar_belakang}` : "")
      );
    },
    checkStatus(status) {
      if (status.every(Boolean) && status.length >= 4) {
        return;
      }
      return true;
    },
  },
};
</script>

<style scoped>
.cardRadius {
  border-radius: 0;
}
</style>
