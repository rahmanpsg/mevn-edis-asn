<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          class="shrink mr-2"
          contain
          :src="require('../assets/logo.png')"
          transition="scale-transition"
          width="40"
        />

        <h1>BKPSDM</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn href="/login" text>
        <span class="mr-2">Masuk</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="pt-0">
      <Home />
      <v-divider />
      <Peraturan />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Home from "@/components/Home.vue";
import Peraturan from "@/components/Peraturan.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Dashboard",
  components: {
    Home,
    Peraturan,
    Footer,
  },

  data: () => ({
    //
  }),
};
</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #bdbdbd;
}
::-webkit-scrollbar-thumb {
  background: #616161;
}
</style>
