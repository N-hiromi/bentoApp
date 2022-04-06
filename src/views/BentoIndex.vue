<template>
<div>
  <Loading v-show="loadingFlag"></Loading>
  <BentoCreate v-show="showModalFlag.bentoCreateModal"/>
  <BentoUpdate v-show="showModalFlag.bentoUpdateModal" />
  <div class="select my-3">
    <div class="form-item d-inline-block" >
      <select class="selectYear form-select" name="year" v-model="selectYearMonth.year">
        <option v-bind:value="today.year" selected>{{ today.year }}</option>
        <option v-bind:value="today.year -n" v-for="n of 3" :key="n">{{ today.year -n}}</option>
      </select>
    </div>
    <div class="form-item ms-3 d-inline-block">
      <select class="selectMonth form-select" name="month" v-model="selectYearMonth.month">
        <option hidden>月を選択</option>
        <option v-bind:value="n" v-for="n of 12" :key="n">{{ n +"月" }}</option>
      </select>
    </div>
    <div class="form-check form-switch ms-3 d-inline-block">
      <input class="form-check-input" v-model="weekEndFlag" type="checkbox" id="flexSwitchCheckDefault">
      <label class="form-check-label" for="flexSwitchCheckDefault">休日モード</label>
    </div>
    
  </div>
  <BentoList v-bind:theads="theads" v-bind:items="filteredItems" />
  <BentoShowModal v-if="showModalFlag.bentoShowModal" v-bind:showModalFlag="showModalFlag.bentoShowModal"/>
</div>
</template>
<script>
import { defineComponent, ref, reactive, computed, watch, onMounted } from 'vue' 
import BentoCreate from '@/components/BentoCreate.vue'
import BentoUpdate from '@/components/BentoUpdate.vue'
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
    BentoCreate,
    BentoUpdate,
    BentoList,
    BentoShowModal,
    Loading,
  },
  setup() {
    const store = useStore()
    const weekEndFlag= ref(false)
    const items= []
    const filteredItems = reactive([])
    const computedWeekEnd= computed( () => {
      return weekEndFlag.value
    })
    watch(computedWeekEnd, (newValue) => {
      store.commit('updateWeekEndFlag', newValue)
    })

    //modalの開け閉め
    const showModalFlag= reactive({
      bentoCreateModal: false,
      bentoShowModal: false,
      bentoUpdateModal: false
    })
    const getBentoCreateModalFlag= computed(() => {
      return store.getters['bentoCreateModalFlag']
    })
    const getBentoShowModalFlag= computed(() => {
      return store.getters['bentoShowModalFlag']
    })
    const getBentoUpdateModalFlag= computed(() => {
      return store.getters['bentoUpdateModalFlag']
    })
    watch(getBentoCreateModalFlag, (newValue) => {
      showModalFlag.bentoCreateModal= newValue
    })
    watch(getBentoShowModalFlag, (newValue) => {
      showModalFlag.bentoShowModal= newValue
    })
    watch(getBentoUpdateModalFlag, (newValue) => {
      showModalFlag.bentoUpdateModal= newValue
    })

    //画面表示したらloadingの終了
    const loadingFlag= ref(true)
    onMounted(() => {
      store.commit('updateLoadingFlag', false)
    })
    const getLoadingFlag= computed(() => {
      return store.getters['loadingFlag']
    })
    watch(getLoadingFlag, (newValue) => {
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
    
    //データ取得
      const db= getDatabase(firebaseApp)
      const selectYearMonthComputed = computed(() => {
        return [selectYearMonth.year, selectYearMonth.month];
      })
      watch(selectYearMonthComputed, () => {
        store.commit('updateLoadingFlag', true)
        const userId= store.state.idToken.uid
        onValue(fireDataRef(db, 'bentos/' +userId + '/'+ selectYearMonth.year+ '/'+ selectYearMonth.month), (snapshot) => {
        if (snapshot.val()){
          const datas = Object.values(snapshot.val())
          const dataArrays= datas.map(data => Object.values(data))
          const values= dataArrays.map(dataArray => dataArray[0])
          //dbに編集や削除などで変更があった場合、表示するitemsを初期化して、再度変更されたdb全てを取得する
          items.length= 0
          //itemsを降順に並び替え
          for (const value of values.slice().sort((a, b) => {return (a.date < b.date ? 1 : -1)})){
            items.push(value)
          }
          //weekEndFlagがdefaultでfalseなので、表示するデータをweekEndFlagがfalseのものにする
          //filteredItemsはyearMonthを選び直すたびに初期化
          filteredItems.length= 0
          const weekEndItems= items.filter(item => item.weekEndFlag == computedWeekEnd.value)
          for (const weekEndItem of weekEndItems) {
            filteredItems.push(weekEndItem)
          }
        }else{
          //データが無いselectdeYearMonthが選ばれたら、itemsを初期化して何も表示しない
          items.length=0
          filteredItems.length= 0
        }
        store.commit('updateLoadingFlag', false)
        });
      })
      //weekEndFlagの監視
      watch(computedWeekEnd, (newValue) => {
        filteredItems.length= 0
          const weekEndItems= items.filter(item => item.weekEndFlag == newValue)
          for (const weekEndItem of weekEndItems) {
            filteredItems.push(weekEndItem)
          }
      })
    return {
      filteredItems,
      weekEndFlag,
      theads,
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