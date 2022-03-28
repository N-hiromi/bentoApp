<template>
<div v-if="showItem.date" class="modal fade bento-show-modal" id="showModalId" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">{{ showItem.date }}</h5>
        <div class="col-4 d-inline modal-title" >
          <p class="d-inline ps-1" v-for="n of showItem.star" :key="n">★</p>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="closeBentoShowModal"></button>
      </div>
      <div class="modal-body row">
        <div class="left-side col-sm-6 col-12">
          <img :src="showItem.image" alt="bentoImage">
        </div>
        <div class="light-side col-sm-6 col-12 text-start">
          <p>メニュー</p>
          <div v-if="showItem.menus !== []" class="menu-table">
            <dl v-for="(menu, menuKey) in showItem.menus[0]" :key="menuKey">
              <dt>{{ menu }}</dt>
              <dd>
                <p  class="d-inline ps-2" v-for="(taste, tasteKey) in showItem.tastes[0][menuKey]" :key="tasteKey">{{ taste }}</p>
              </dd>
            </dl>
          </div>
          <label for="point">ワンポイント</label>
          <p>{{ showItem.point }}</p>
          <label for="daily">日記</label>
          <p>{{ showItem.daily }}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="closeBentoShowModal">閉じる</button>
        <a class="btn btn-primary" data-bs-dismiss="modal" data-bs-toggle="modal" href="#firstUpdateId" role="button" v-on:click= "openUpdateModal">変更</a>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    //storeから選択したitemであるshowItemを取得
    store.commit('updateLoadingFlag', true)
    console.log("start-loading", store.state.loadingFlag)
    const showItem= computed(() => {
      console.log("showModal", store.state.item)
      return store.state.item
    })

    const closeBentoShowModal = () => {
      store.commit('updateBentoShowModalFlag', false)
      //showモーダルを閉じたら選択項目をリセットする
      store.commit('getShowItem', "")
    }
    
    //編集ボタンを押したらBentoUpdate.vueを開く。showModalは閉じる
    const openUpdateModal = () => {
      // closeBentoShowModal
      console.log("openUpdateModal", store.state.item)
      // store.commit('getShowItem', "")
      // console.log("openShowModal2", store.state.item)
      store.commit('updateBentoUpdateModalFlag', true)
      //storeのitem(選択項目)に再度同じitemを代入する。編集ページを2度開くとstoreのitemが変更されないため、再度変更をUpdateModal.vueのwatchに伝える。二回目開いたらupdateModalが初期化されるのバグ対応。
      // const item= store.state.item
      // store.commit('getShowItem', store.state.item)
    }
    return {
      showItem,
      openUpdateModal,
      closeBentoShowModal,
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