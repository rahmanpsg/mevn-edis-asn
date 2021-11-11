import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        primary: "#C6974E",
        secondary: "#ca5310",
        accent: "#bb4d00",
        error: "#8f250c",
        info: "#691e06",
        // success: "#fbba72",
        success: "#00923F",
        warning: "#FFC107",
      },
    },
  },
});
