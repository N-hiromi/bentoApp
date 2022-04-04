<template>
<div class="bento-create-modal">
  <InputModal ref="childRef" v-bind:initItem="initItem" v-on:bentoSave= "bentoSave" v-bind:title="title"/>
</div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import moment from 'moment'
import 'moment/locale/ja'
moment.locale('ja')
import InputModal from '@/components/InputModal.vue'
import { getDatabase, push } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"
import { getStorage, uploadBytes, getDownloadURL} from "firebase/storage"
import { ref as fireStorageRef} from "firebase/storage"
import { firebaseApp } from '@/main.js'
import { useStore } from 'vuex'

export default defineComponent({
  components: {
    InputModal,
  },
  setup() {
    //親コンポーネントから子コンポーネントを利用するために定義
    const childRef= ref()
    const title= "新規登録"
    const store = useStore()
    const now= moment().format('YYYY-MM-DD')

    const initItem= reactive({
      weekEndFlag: false,
      date: now,
      image: "",
      daily: "",
      point: "",
      star: 0,
      menus: "",
      tastes: ""
    })

    //showMenuはmenuFormとtasteFormsの値取得、menuListsへの登録と表示
    //モーダル内の情報をdatabaseへ登録。登録内容を親に渡す。
    const bentoSave= async (item, menus, tastes)=> {
      //登録欄の年と日付を取得
      const year = item.date.slice(0, 4)
      const month = Number(moment(item.date).format("MM"))
      //保存する人のtokenを取得
      const userId= store.state.idToken.uid
      //登録モーダルを閉じてローディング開始
      store.commit('updateBentoCreateModalFlag', false)
      store.commit('updateLoadingFlag', true)
      const db= getDatabase(firebaseApp)
      const storage = getStorage();

      //画像をstorageへ保存。
      //①フルパスの取得
      const storageRef = fireStorageRef(storage,'bentos/' + userId + '/' + year + '/'+ month + '/'+ `${item.date}.jpg`)
      //②storageへアップロード
      const uploadImage= async () => {
        uploadBytes(storageRef, item.image).then(() => {
          console.log('Uploaded a blob or file!');
        });
      }
      //③画像のダウンロードとitem.imageへurlを格納
      const downloadUrl= async () => {
        getDownloadURL(fireStorageRef(storage, 'bentos/' + userId + '/' + year + '/'+ month + '/'+ `${item.date}.jpg`))
        .then((url) => {
          item.image= url
          console.log("item.image1", url)
        })
        .catch((error) => {
          console.log("画像が表示できませんでした", error)
        });
      }
      //④画像のurlも含めてdbへ登録
      const saveItem= async () => {
        console.log("userId", userId)
        push(fireDataRef(db, 'bentos/' + userId + '/' + year + `/`+ month + `/`+item.date),{
          weekEndFlag: Boolean(item.week),
          date: String(item.date),
          image: String(item.image),
          daily: String(item.daily),
          point: String(item.point),
          star: Number(item.star),
          menus: Array(menus),
          tastes: Array(tastes)
        }).then(() => {
          console.log("dbに保存したitem", item)
        }).catch((error) => {
          console.log("dbへ保存できませんでした", error)
        })
      }
      //モーダル内の表示を削除
      const startSave= async ()=> {
        await uploadImage()
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await downloadUrl()
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await saveItem()
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await childRef.value.closeBentoCreateModal()
      }
      startSave()
    }
    return {
      initItem,
      bentoSave,
      childRef,
      title,
    }
  }
})

</script>
