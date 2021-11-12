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

      <template v-slot:[`item.nama`]="{ item }">
        {{ item.gelar_depan }}
        {{ item.nama + (item.gelar_belakang ? "," : "") }}
        {{ item.gelar_belakang }}
      </template>

      <template v-slot:[`item.jenis`]="{ item }">
        <v-chip
          class="overline font-weight-bold"
          :color="item.jenis == 'Pidana' ? 'error' : 'warning'"
          dark
        >
          {{ item.jenis }}
        </v-chip>
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
  },
};
</script>

<style scoped>
.cardRadius {
  border-radius: 0;
}
</style>
