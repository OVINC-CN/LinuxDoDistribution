import {createStore} from 'vuex';
import {getUserInfoAPI} from '@/api/user';

const store = createStore({
  state() {
    return {
      mainLoading: false,
      isLogin: false,
      user: {
        username: '',
        nick_name: '',
        trust_level: -1,
      },
      userProperties: {
        avatar: null,
        phone_number: null,
        mail_address: null,
      },
      userPropertiesRaw: [],
    };
  },
  mutations: {
    setMainLoading(state, payload) {
      state.mainLoading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setIsLogin(state, payload) {
      state.isLogin = payload;
    },
    setUserProperty(state, payload) {
      payload.forEach((item) => state.userProperties[item.property_key] = item.property_val);
    },
    setUserPropertyRaw(state, payload) {
      state.userPropertiesRaw = payload;
    },
  },
  actions: {
    setMainLoading({commit}, payload) {
      if (payload) {
        commit('setMainLoading', true);
      } else {
        setTimeout(() => {
          commit('setMainLoading', false);
        }, 600);
      }
    },
    getUserInfo({commit}) {
      getUserInfoAPI().then((res) => {
        commit('setUser', res.data);
        commit('setIsLogin', true);
      });
    },
  },
});

export default store;
