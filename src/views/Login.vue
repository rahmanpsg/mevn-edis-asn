<template>
  <v-container fluid fill-height class="bg">
    <v-row>
      <v-col>
        <v-card
          elevation="0"
          :loading="loading"
          class="mx-auto my-12"
          width="100%"
          max-width="500"
          v-bind:key="show"
        >
          <login-form
            v-if="show"
            v-on:setLoading="setLoading"
            v-on:setShow="setShow"
          >
          </login-form>
        </v-card>
        <h4 class="py-2 white--text text-center">
          &copy; {{ new Date().getFullYear() }} —
          <strong>Aplikasi Edukasi Disiplin ASN</strong>
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";

export default {
  components: {
    LoginForm,
  },
  data: () => ({
    show: true,
    valid: true,
    loading: false,
    username: "",
    password: "",
  }),
  methods: {
    setLoading(loading) {
      this.loading = loading;
    },
    setShow(show) {
      this.show = show;
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  background: #c6974e;
  background: -moz-linear-gradient(
    -45deg,
    #c6974e 0%,
    #c6974e 50%,
    #ffffff 100%
  );
  background: -webkit-linear-gradient(
    -45deg,
    #c6974e 0%,
    #c6974e 50%,
    #ffffff 100%
  );
  background: linear-gradient(135deg, #c6974e 0%, #c6974e 50%, #ffffff 100%);
}
</style>
