<template>
  <div>
    <InputModal ref="childRef" v-bind:initItem="initItem" v-on:bentoSave= "bentoUpdate" v-bind:title="title"/>
  </div>
</template>
<script>
import { defineComponent, computed, ref, reactive, watch } from 'vue'
import InputModal from '@/components/InputModal.vue'
import { useStore } from 'vuex'
import moment from 'moment'
import { getDatabase, update, get, child } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"

export default defineComponent({
  components: {
    InputModal
  },
  setup() {
    //親コンポーネントから子コンポーネントを利用するために定義
    const childRef= ref()

    //inputModalをcreateとupdateで使うため
    const title= "編集"

    const store = useStore()
    const db = getDatabase()
    store.commit('updateLoadingFlag', true)
    console.log("start-loading", store.state.loadingFlag)

    const initItem= reactive({
      weekEndFlag: "",
      date: "",
      image: "",
      daily: "",
      point: "",
      star: 0,
      menus: [],
      tastes: [],
    })
    const getShowItem= computed(() => {
      return store.getters['item']
    })
    watch(getShowItem, (newValue) => {
      //menusとtastesが登録されていないitemを含めて全て対象。前に押したshowItemのmenus, tastesが次に押したUpdateModao内で残されないようにするため。
      initItem.menus.length= 0
      initItem.tastes.length= 0
      //defaultではstate.item= null。null出ない時(itemが選択された時のみ選択された値を代入する)
      if (newValue !== null ) {
        console.log("watchShowITem", newValue)
        initItem.weekEndFlag= newValue.weekEndFlag
        initItem.date= newValue.date
        initItem.image= newValue.image
        initItem.daily= newValue.daily
        initItem.point= newValue.point
        initItem.star= newValue.star
        //updateの時はmenusとtastesも渡す
        if (newValue.menus) {
          newValue.menus.forEach(element => initItem.menus.push(element))
        }
        if (newValue.tastes) {
          newValue.tastes.forEach(element => initItem.tastes.push(element))
        }
      }
    })
    
    
    const bentoUpdate = async (item, menus, tastes) => {
      console.log("bentoUpdate", item, menus, tastes)
      //inputModal.vueからデータ取得
      const postData = {
        weekEndFlag: Boolean(item.weekEndFlag),
        date: String(item.date),
        image: String(item.image),
        point: String(item.point),
        daily: String(item.daily),
        star: Number(item.star),
        menus: Array(menus),
        tastes: Array(tastes),
      }
      console.log("postData", postData)
      
      //db更新
      const userId= store.state.idToken.uid
      const year = item.date.slice(0, 4)
      const month = Number(moment(item.date).format("MM"))
      //ただreturn Object.keys(data)[0]しただけだと、updateKeyにObject.keys(data)[0]を代入できない
      const updateKey= await new Promise(function(resolve){
        const dbRef = fireDataRef(db);
        get(child(dbRef, 'bentos/' + userId + '/'+ year + '/' + month + '/' + item.date)).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data);
          console.log("関数内のkey", Object.keys(data)[0])
          resolve(Object.keys(data)[0])
        } else {
          console.log("No data available");
        }
      })
      })
      const updateItem= () => {
        const updates = {};
        updates['/bentos/' + userId + '/' + year + '/' + month + '/' + item.date + '/' + updateKey] = postData;
        childRef.value.closeBentoCreateModal()
        return update(fireDataRef(db), updates);
      }
      
      //モーダルを閉じる
      store.commit('updateLoadingFlag', false)
      store.commit('updateBentoShowModalFlag', false)
      const startUpdate= async ()=> {
        await updateItem()
        menus.length= 0
        tastes.length= 0
        console.log("startUpdate", menus, tastes)
      }
      startUpdate()
    }

    return {
      initItem,
      bentoUpdate,
      childRef,
      title,
    }
  }   
})

</script>