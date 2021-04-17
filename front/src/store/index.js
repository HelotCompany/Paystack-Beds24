import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    email: '',
    user: null,
    config: {},
  },
  mutations: {
    SET_EMAIL: (state, val) => {
      state.email = val;
    },
    SET_USER: (state, val) => {
      state.user = val;
    },
    SET_CONFIG: (state, val) => {
      state.config = val;
    },
    RESET: (state) => {
      state.user = null;
      state.email = '';
    }
  },
  actions: {
  },
  getters: {
    userEmail: (state) => state.email,
    user: (state) => state.user,
    subscriptionId: (state) => state.user ? state.user.subscriptionId : '',
    subscriptionValid: (state) => state.user ? state.user.subscriptionValid : false,
    subscriptionLabel: (state) => state.user ? state.user.subscriptionLabel : 'Inactive',
    userId: (state) => state.user ? state.user.uid : '',
    config: (state) => state.config,
  },
  plugins: [createPersistedState({
    paths: ['email', 'user'],
    key: 'PaystackBeds24',
  })],
})
