<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-icon x-large color="primary" v-html="icon"></v-icon>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text class="body-1">
        {{ title }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="success darken-1"
          outlined
          text
          @click="$emit('closeDialog')"
          :disabled="dialogLoading"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary darken-1"
          outlined
          text
          @click="$emit('event')"
          :disabled="dialogLoading"
        >
          <v-progress-circular
            :size="25"
            indeterminate
            color="primary"
            v-if="dialogLoading"
          ></v-progress-circular>
          <div v-else>OK</div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    dialogLoading: Boolean,
    title: String,
    icon: {
      type: String,
      default: "mdi-alert",
    },
  },
};
</script>
