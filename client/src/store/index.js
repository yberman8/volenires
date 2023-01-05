import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    
    // הID של הלקוח
    client: 1,
       // המוצרים מהFETCH
    pruduct: [],
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
});
