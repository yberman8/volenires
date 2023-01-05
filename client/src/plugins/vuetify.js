import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import he from 'vuetify/lib/locale/he'

Vue.use(Vuetify);

export default new Vuetify({
    rtl: true,
    lang: {
      locales: { he },
      current: 'he',
    },
});
