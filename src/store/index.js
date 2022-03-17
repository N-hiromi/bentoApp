import { createStore } from 'vuex'

export default createStore({
  state: {
    idToken: null,
    item: null,
    loadingFlag: false,
    bentoCreateModalFlag: false,
    bentoShowModalFlag: false,
  },
  mutations: {
    updateIdToken(state, idToken){
      state.idToken = idToken
      console.log("state", state);
    },
    getShowItem(state, item){
      state.item = item
      console.log("stateItem", item)
    },
    updateLoadingFlag(state, loadingFlag){
      state.loadingFlag= loadingFlag
      console.log("loadingFlag", state.loadingFlag)
    },
    updateBentoCreateModalFlag(state, loadingFlag){
      state.bentoCreateModalFlag= loadingFlag
      console.log("bentoCreateModalFlag", state.bentoCreateModalFlag)
    },
    updateBentoShowModalFlag(state, loadingFlag){
      state.bentoShowModalFlag= loadingFlag
      console.log("bentoShowModalFlag", state.bentoShowModalFlag)
    },
  },
  getters: {
    idToken: state => state.idToken,
    item: state => state.item,
    loadingFlag: state => state.loadingFlag,
    bentoCreateModalFlag: state => state.bentoCreateModalFlag,
    bentoShowModalFlag: state => state.bentoShowModalFlag
  }
})