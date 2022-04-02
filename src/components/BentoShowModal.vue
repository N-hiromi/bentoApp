<template>
<div class="modal-background" >
  <div class="modal-contents container p-4 col-xl-8">
      <div class="row">
        <h5 class="d-block col-5 col-md-2 text-start">{{ showItem.date }}</h5>
        <div class="col-5 col-md-4 text-start" >
          <p class="d-inline ps-1 text-start" v-for="n of showItem.star" :key="n">★</p>
        </div>
        <div class="col-2 col-md-6 text-end">
          <button type="button" class="btn-close" aria-label="Close" v-on:click="closeBentoShowModal"></button>
        </div>
      </div>
      <div class="row">
        <div class="left-side col-sm-6 col-12">
          <img :src="showItem.image" alt="bentoImage">
        </div>
        <div class="light-side col-sm-6 col-12 text-start">
          <p>メニュー</p>
          <div v-if="showItem.menus" class="menu-table">
            <dl v-for="(menu, menuKey) in showItem.menus[0]" :key="menuKey">
              <dt>{{ menu }}</dt>
              <dd v-if="showItem.tastes">
                <p class="d-inline me-2" v-for="(taste, tasteKey) in showItem.tastes[0][menuKey]" :key="tasteKey">{{ taste }}</p>
              </dd>
            </dl>
          </div>
          <label for="point">ワンポイント</label>
          <p>{{ showItem.point }}</p>
          <label for="daily">日記</label>
          <p>{{ showItem.daily }}</p>
        </div>
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-secondary" v-on:click="closeBentoShowModal">閉じる</button>
        <a class="btn btn-primary ms-3" v-on:click= "openUpdateModal">変更</a>
      </div>
  </div>
</div>
</template>
<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const showModalFlag= ref(false)
    const store = useStore()
    //storeから選択したitemであるshowItemを取得
    store.commit('updateLoadingFlag', true)
    console.log("start-loading", store.state.loadingFlag)
    const showItem= computed(() => {
      console.log("showModal", store.state.item)
      return store.state.item
    })
    //mountしたらローディング終了
    onMounted(() => {
      store.commit('updateLoadingFlag', false)
    })

    const closeBentoShowModal = () => {
      store.commit('updateBentoShowModalFlag', false)
      //showモーダルを閉じたら選択項目をリセットする
      store.commit('getShowItem', null)
    }
    
    //編集ボタンを押したらBentoUpdate.vueを開く。showModalは閉じる
    const openUpdateModal = () => {
      // closeBentoShowModal
      console.log("openUpdateModal", store.state.item)
      // store.commit('getShowItem', "")
      // console.log("openShowModal2", store.state.item)
      store.commit('updateBentoShowModalFlag', false)
      store.commit('updateBentoUpdateModalFlag', true)
      //storeのitem(選択項目)に再度同じitemを代入する。編集ページを2度開くとstoreのitemが変更されないため、再度変更をUpdateModal.vueのwatchに伝える。二回目開いたらupdateModalが初期化されるのバグ対応。
      // const item= store.state.item
      // store.commit('getShowItem', store.state.item)
    }
    return {
      showItem,
      openUpdateModal,
      closeBentoShowModal,
      showModalFlag
    }
  }   
})

</script>
<style scoped>
img {
  object-fit: cover;
  width: 100%;
  height: 35vh;
}
</style>