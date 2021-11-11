<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Questrial");

$font-family: "Ubuntu";

.v-application {
  [class*="text-"] {
    color: #36405a;
    font-family: "Questrial", $font-family, sans-serif !important;
  }
  font-family: "Questrial", $font-family, sans-serif !important;
}
</style>
