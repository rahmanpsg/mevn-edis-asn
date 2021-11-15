<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-toolbar-title>{{ items[selectedItem].text }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="px-4 py-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <v-bottom-navigation
      :value="value"
      background-color="primary"
      dark
      app
      grow
    >
      <v-btn
        v-for="(item, i) in items"
        style="background-color: transparent; height: inherit"
        :key="`route-${i}`"
        :to="item.href"
        ref="link"
        active-class=""
        exact
      >
        <span v-text="item.text"></span>
        <v-icon v-html="item.icon"></v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      value: "Home",
      drawer: false,
      items: [
        { text: "Home", href: "/verifikator", icon: "mdi-home" },
        {
          text: "Permohonan",
          href: "/verifikator/permohonan",
          icon: "mdi-email-send",
        },
      ],
    };
  },
  computed: {
    selectedItem() {
      return this.items.findIndex((item) => item.href == this.$route.path);
    },
  },
  methods: {
    logout() {
      this.$store.commit("userModule/isLogin", false);
      this.$router.push("/");
      localStorage.clear();
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
