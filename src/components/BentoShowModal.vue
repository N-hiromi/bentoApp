<template>
<div class="modal-background" >
  <div class="modal-contents container p-4 col-xl-8">
      <div class="row">
        <h5 class="d-block col-3 col-md-2 text-start">{{ showItem.date }}</h5>
        <div class="col-5 col-md-4 text-start" >
          <p class="d-inline ps-1 text-start star" v-for="n of showItem.star" :key="n">★</p>
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
          <div class="text-end mb-3">
            <div class="delete-item ps-1 col-2 d-inline" v-on:click="deleteItem(showItem)"><font-awesome-icon icon="trash-can" /></div>
          </div>
        </div>
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-secondary ms-3" v-on:click="closeBentoShowModal">閉じる</button>
        <a class="btn btn-primary ms-3" v-on:click= "openUpdateModal">変更</a>
      </div>
  </div>
</div>
</template>
<script>
import { defineComponent, computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { getDatabase, update, get, child } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"
import { getStorage, deleteObject } from "firebase/storage";
import { ref as fireStorageRef} from "firebase/storage"
import moment from 'moment'

export default defineComponent({
  setup() {
    const showModalFlag= ref(false)
    const db = getDatabase()
    const storage = getStorage();
    const store = useStore()
    //storeから選択したitemであるshowItemを取得
    store.commit('updateLoadingFlag', true)
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
      store.commit('updateBentoShowModalFlag', false)
      store.commit('updateBentoUpdateModalFlag', true)
    }

    //削除
    const deleteItem= async (item) => {
      const userId= store.state.idToken.uid
      const year = item.date.slice(0, 4)
      const month = Number(moment(item.date).format("MM"))
      console.log(item)
      //①フルパスの取得
      const storageRef = fireStorageRef(storage,'bentos/' + userId + '/' + year + '/'+ month + '/'+ `${item.date}.jpg`)
      // //storageの削除
        deleteObject(storageRef).then(() => {
        console.log("既存画像を削除しました")
      }).catch((error) => {
        console.log(error)
      });
      // dbの削除
      //ただreturn Object.keys(data)[0]しただけだと、updateKeyにObject.keys(data)[0]を代入できない
      const updateKey= await new Promise(function(resolve){
        const dbRef = fireDataRef(db);
        get(child(dbRef, 'bentos/' + userId + '/'+ year + '/' + month + '/' + item.date)).then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            resolve(Object.keys(data)[0])
          } else {
            console.log("No data available");
          }
        })
      })
      const deleteStart= () => {
        const updates = {};
        updates['/bentos/' + userId + '/' + year + '/' + month + '/' + item.date + '/' + updateKey] = null;
        return update(fireDataRef(db), updates);
      }
      deleteStart()
      closeBentoShowModal()
    }
    return {
      showItem,
      openUpdateModal,
      closeBentoShowModal,
      showModalFlag,
      deleteItem
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