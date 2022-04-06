import { createStore } from 'vuex'

export default createStore({
  state: {
    idToken: null,
    item: null,
    loadingFlag: false,
    bentoCreateModalFlag: false,
    bentoShowModalFlag: false,
    bentoUpdateModalFlag: false,
    weekEndFlag: false,
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
    updateBentoCreateModalFlag(state, createFlag){
      state.bentoCreateModalFlag= createFlag
      console.log("bentoCreateModalFlag", state.bentoCreateModalFlag)
    },
    updateBentoShowModalFlag(state, showModalFlag){
      state.bentoShowModalFlag= showModalFlag
      console.log("bentoShowModalFlag", state.bentoShowModalFlag)
    },
    updateBentoUpdateModalFlag(state, updateFlag){
      state.bentoUpdateModalFlag= updateFlag
      console.log("bentoUpdateModalFlag", state.bentoUpdateModalFlag)
    },
    updateWeekEndFlag(state, weekEndFlag){
      state.weekEndFlag= weekEndFlag
      console.log("weekEndFlag", state.weekEndFlag)
    },
  },
  getters: {
    idToken: state => state.idToken,
    item: state => state.item,
    loadingFlag: state => state.loadingFlag,
    bentoCreateModalFlag: state => state.bentoCreateModalFlag,
    bentoShowModalFlag: state => state.bentoShowModalFlag,
    bentoUpdateModalFlag: state => state.bentoUpdateModalFlag,
    weekEndFlag: state => state.weekEndFlag
  }
})