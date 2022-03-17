<template>
  <div class="" v-if="showItem">
    <div class="left-side">
      <p>{{showItem.date}}</p>
      <img :src="showItem.image" alt="bentoImage">
    </div>
    <div class="light-side">
      <p>評価：★</p>
      <div class="menu-taste"></div>
      <p>メニュー</p>
      <ul v-for="(menu, key) in showItem.menus" :key="key">
        <li>{{ menu }}</li>
      </ul>
      <ul v-for="(taste, key) in showItem.tastes" :key="key">
        <li>{{ taste }}</li>
      </ul>
      <label for="point">ワンポイント</label>
      <textarea name="point" id="" cols="30" rows="10" v-model="showItem.point"></textarea>
      <label for="daily">日記</label>
      <textarea name="daily" id="" cols="30" rows="10" v-model="showItem.daily"></textarea>
    </div>
    <button v-on:click="updateItem(showItem)">変更</button>
    <button v-on:click="closeBentoShowModal">閉じる</button> 
  </div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import moment from 'moment'
import { getDatabase, update, onValue } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"

export default defineComponent({
  // props: ["showListshowItem", "showModalFlag"],
  setup() {
    const store = useStore()
    const db = getDatabase()
    store.commit('updateLoadingFlag', true)
    console.log("start-loading", store.state.loadingFlag)
    const showItem= computed(() => {
      return store.state.item
    })
    const updateItem = (item) => {
      console.log("updateItem", item)

      //データ取得
      const postData = {
        date: item.date,
        image: item.image,
        menus: item.menus,
        tastes: item.tastes,
        point: item.point,
        daily: item.daily,
      }
      
      //db更新
      const year = item.date.slice(0, 4)
      const month = Number(moment(item.date).format("MM"))
      const itemRef = fireDataRef(db, 'bentos/' + year + '/' + month + '/' + item.date);
      onValue(itemRef, (snapshot) => {
        const data = snapshot.val();
        console.log("itemRef", data)
        const updateKey= Object.keys(data)[0]
        console.log("updateKey", updateKey)
        const updates = {};
        updates['/bentos/' + year + '/' + month + '/' + item.date + '/' + updateKey] = postData;
        return update(fireDataRef(db), updates);
      })
      //モーダルを閉じる
      store.commit('updateLoadingFlag', false)
      store.commit('updateBentoShowModalFlag', false)
    }
    const closeBentoShowModal = () => {
      store.commit('updateBentoShowModalFlag', false)
    }
    // const item= reactive({
    //   date: "",
    //   image: "",
    //   point: "",
    //   daily: "",
    //   star:""
    // })
    // if (props.showListItem){
    //   console.log("item", props.showListItem)
    // }
    
    return {
      showItem,
      updateItem,
      closeBentoShowModal
    }
    // console.log("ShowModalでprops.items", props.item)
    // console.log("showModalFlag", props.showModalFlag)
  }   
})

</script>
<style scoped>

</style>