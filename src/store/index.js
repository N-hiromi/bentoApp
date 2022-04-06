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
    },
    getShowItem(state, item){
      state.item = item
    },
    updateLoadingFlag(state, loadingFlag){
      state.loadingFlag= loadingFlag
    },
    updateBentoCreateModalFlag(state, createFlag){
      state.bentoCreateModalFlag= createFlag
    },
    updateBentoShowModalFlag(state, showModalFlag){
      state.bentoShowModalFlag= showModalFlag
    },
    updateBentoUpdateModalFlag(state, updateFlag){
      state.bentoUpdateModalFlag= updateFlag
    },
    updateWeekEndFlag(state, weekEndFlag){
      state.weekEndFlag= weekEndFlag
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