import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    email: '',
    dataSign: null,
  },
  mutations: {
    SET_EMAIL: (state, val) => {
      state.email = val;
    },
    SET_DATA_SIGN: (state, val) => {
      state.dataSign = val;
    }
  },
  actions: {
  },
  getters: {
    userEmail: (state) => state.email,
    isConnect: (state) => state.dataSign && state.dataSign.isConnect,
  },
  plugins: [createPersistedState({
    paths: ['email', 'dataSign'],
    key: 'PaystackBeds24',
  })],
})
