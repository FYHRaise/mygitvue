import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    uname:""
  },
  getters: {
  },
  mutations: {
    setUname(state,uname) {
      if (uname != null) {
        state.uname = uname
      }else {
        state.uname = ""
      }
    }
  },
  actions: {
    setUname(context,uname){
      context.commit("setUname",uname)
    }
  },
  modules: {
  }
})
