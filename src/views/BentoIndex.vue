<template>
<div>
  <Loading v-show="loadingFlag"></Loading>
  <BentoCreateModal v-show="showModalFlag.BentoCreateModal"/>

  <div class="form-item" >
    <select class="selectYear" name="year" v-model="selectYearMonth.year">
      <option v-bind:value="today.year" selected>{{ today.year }}</option>
      <option v-bind:value="today.year -n" v-for="n of 3" :key="n">{{ today.year -n}}</option>
    </select>
  </div>
  <div class="form-item">
    <select class="selectMonth" name="month" v-model="selectYearMonth.month">
      <option hidden>月を選択</option>
      <option v-bind:value="n" v-for="n of 12" :key="n">{{ n +"月" }}</option>
    </select>
  </div>
  
  <BentoList v-bind:theads="theads" v-bind:items="items" />
  <BentoShowModal v-show="showModalFlag.bentoShowModal" v-bind:showModalFlag="showModalFlag.bentoShowModal"/>
</div>
</template>
<script>
import { defineComponent, ref, reactive, computed, watch, onMounted } from 'vue' 
import BentoCreateModal from '@/components/BentoCreateModal.vue'
import BentoList from '@/components/BentoList.vue'
import BentoShowModal from '@/components/BentoShowModal.vue'
import { getDatabase, onValue } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"
import { firebaseApp } from '@/main.js'
import { useStore } from 'vuex'
import moment from 'moment'
import 'moment/locale/ja'
moment.locale('ja')
import Loading from '@/components/Loading.vue'


export default defineComponent({
  components: {
    BentoCreateModal,
    BentoList,
    BentoShowModal,
    Loading,
  },
  setup() {
    const store = useStore()

    //modalの開け閉め
    const showModalFlag= reactive({
      BentoCreateModal: false,
      bentoShowModal: false
    })
    const getBentoCreateModalFlag= computed(() => {
      return store.getters['bentoCreateModalFlag']
    })
    const getBentoShowModalFlag= computed(() => {
      return store.getters['bentoShowModalFlag']
    })
    watch(getBentoCreateModalFlag, (newValue, oldValue) => {
      console.log("ohato", newValue, oldValue)
      showModalFlag.BentoCreateModal= newValue
    })
    watch(getBentoShowModalFlag, (newValue, oldValue) => {
      console.log("ohato", newValue, oldValue)
      showModalFlag.bentoShowModal= newValue
    })

    //画面表示したらloadingの終了
    const loadingFlag= ref(true)
    onMounted(() => {
      store.commit('updateLoadingFlag', false)
    })
    const getLoadingFlag= computed(() => {
      return store.getters['loadingFlag']
    })
    watch(getLoadingFlag, (newValue, oldValue) => {
      console.log("ohato", newValue, oldValue)
      loadingFlag.value= newValue
    })

    //listへ送る情報
    const theads= reactive({
      date: "date",
      image: "image",
      menus: "menus"
    })
    const today= {
      year: moment().format('YYYY'),
      month: Number(moment().format('MM'))
    }

    const selectYearMonth= reactive({
      year: today.year,
      month: '',
    })
    
    const items= reactive([])
    
    //データ取得
      const db= getDatabase(firebaseApp)
      const selectYearMonthComputed = computed(() => {
        return [selectYearMonth.year, selectYearMonth.month];
      })
      watch(selectYearMonthComputed, (newValue, oldValue) => {
        store.commit('updateLoadingFlag', true)
        console.log("ohatodane", newValue, oldValue)
        const userId= store.state.idToken.uid
        onValue(fireDataRef(db, 'bentos/' +userId + '/'+ selectYearMonth.year+ '/'+ selectYearMonth.month), (snapshot) => {
        if (snapshot.val()){
          const datas = Object.values(snapshot.val())
          const dataArrays= datas.map(data => Object.values(data))
          const values= dataArrays.map(dataArray => dataArray[0])
          //dbに編集や削除などで変更があった場合、表示するitemsを初期化して、再度変更されたdb全てを取得する
          items.length= 0
          console.log("values", values)
          for (const value of values.slice().sort((a, b) => {return (a.date < b.date ? 1 : -1)})){
            items.push(value)
          }
        }else{
          //データが無いselectdeYearMonthが選ばれたら、itemsを初期化して何も表示しない
          items.length=0
        }
        store.commit('updateLoadingFlag', false)
    });
      })
    return {
      theads,
      items,
      showModalFlag,
      selectYearMonth,
      today,
      loadingFlag
    }
  }
})
</script>
<style scoped>
[v-cloak] {
  display: none;
}
</style>