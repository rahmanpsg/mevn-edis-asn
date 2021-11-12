<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ items[selectedItem].text }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="primary" app bottom right dark>
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title> Edukasi Disiplin ASN </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item-group active-class="text--accent-4">
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.href"
            link
            exact
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-4 py-4">
        <transition name="fade">
          <router-view></router-view>
        </transition>
      </v-container>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Footer from "@/components/Footer.vue";
import { mapState } from "vuex";

export default {
  components: { Footer },
  data() {
    return {
      drawer: true,
      // selectedItem: 0,
      items: [
        { text: "Dashboard", href: "/admin", icon: "mdi-home" },
        {
          text: "Data Permohonan",
          href: "/admin/permohonan",
          icon: "mdi-email-send",
        },
        {
          text: "Data Pelanggaran",
          href: "/admin/pelanggaran",
          icon: "mdi-account-cancel",
        },
        {
          text: "Data Pegawai",
          href: "/admin/pegawai",
          icon: "mdi-account-multiple",
        },
        {
          text: "Data Verifikator",
          href: "/admin/verifikator",
          icon: "mdi-account-check",
        },
        {
          text: "Golongan",
          href: "/admin/golongan",
          icon: "mdi-card-account-mail",
        },
        {
          text: "Unit Organisasi",
          href: "/admin/unor",
          icon: "mdi-town-hall",
        },
      ],
    };
  },
  computed: {
    ...mapState("userModule", { nama: "nama" }),
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
