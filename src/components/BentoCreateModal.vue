<template>
<div class="bento-create-modal">
    <div class="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalToggleLabel">新規登録</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="closeBentoCreateModal"></button>
          </div>
          <div class="modal-body">
            <div class="menu-form">
              <div class="date-star row">
                <div class="form-item col-5">
                  <label for="date">日付</label>
                  <input type="date" class="form-control" v-model="items.date">
                </div>
                <div class="form-item col-4">
                  <label for="star">評価</label>
                  <select class="form-select" name="star" v-model="items.star">
                    <option value="1">★</option>
                    <option value="2">★★</option>
                    <option value="3">★★★</option>
                    <option value="4">★★★★</option>
                    <option value="5">★★★★★</option>
                  </select>
                </div>
                <div class="weekend-select col mt-4">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="weekEndFlag" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault">休日</label>
                  </div>
                </div>
              </div>
              <div class="form-item">
                <label for="image">画像</label>
                <input class="form-control" type="file" id="file" accept="image/*" capture="environment" v-on:change="setImage">
              </div>
              <div class="form-item">
                <label for="point">ワンポイント</label>
                <textarea class="form-control" name="point" rows="3" v-model="items.point"></textarea>
              </div>
              <div class="form-item">
                <label for="daily">日記</label>
                <textarea class="form-control" name="daily" id="" rows="3" v-model="items.daily"></textarea>
              </div>
            </div>
          </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="closeBentoCreateModal">やめる</button>
          <button class="btn btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal" data-bs-dismiss="modal">次へ</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalToggleLabel2">メニュー登録</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="closeBentoCreateModal"></button>
        </div>
        <div class="modal-body">
          <div class="menu-form">
        <div class="form-item">
          <label for="name">メニュー</label>
          <input class="form-control" type="text" id="name" v-model="menuForm">
        </div>
        <div class="taste-form">
          <div v-for="(tasteForm, tasteIndex) in tasteForms" :key="tasteIndex">
            <div class="form-item">
              <label for="name">調味料{{ tasteIndex + 1}}</label>
              <input class="form-control" type="text" id="name" v-model="tasteForms[tasteIndex]">
            </div>
          </div>
        </div>
        <button v-on:click="addTasteForm">調味料追加</button>
      </div>
          <div class="menu-table">
        <div v-for="(menuList, menuListIndex) in menuLists" :key="menuListIndex">
          <p>{{ menuList.menu }}</p>
          <p>{{ menuList }}</p>
          <button v-on:click="deleteMenu(menuListIndex)">メニューを削除</button>
          <p>材料</p>
          <ul v-for="(taste, tasteIndex) in menuList.tastes" :key="tasteIndex">
            <li>{{ taste }}</li>
            <button v-on:click="deleteTaste(menuListIndex, tasteIndex)">調味料を削除</button>
          </ul>
        </div>
      </div>
          <button v-on:click="showMenu">メニューを登録</button>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" data-bs-target="#exampleModalToggle" data-bs-toggle="modal" data-bs-dismiss="modal">戻る</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="bentoSave">登録</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue'
import moment from 'moment'
import 'moment/locale/ja'
moment.locale('ja')

import { getDatabase, push } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"
import { getStorage, uploadBytes, getDownloadURL} from "firebase/storage"
import { ref as fireStorageRef} from "firebase/storage"
import { firebaseApp } from '@/main.js'
import { useStore } from 'vuex'

export default defineComponent({
  setup() {
    const store = useStore()
    const now= moment().format('YYYY-MM-DD')
    const items= reactive({
      weekEndFlag: false,
      date: now,
      image: "",
      daily: "",
      point: "",
      star: 0,
    })
    const menuForm= ref("")
    const tasteForms= reactive([])
    const menuLists= ref([])

    const setImage= (event) => {
      const file = event.target.files[0]
      if (file) {
        items.image= file
      }
    }

    const closeBentoCreateModal= () => {
      //formの初期化
      items.weekEndFlag= false
      items.date= ""
      items.image= ""
      items.daily= ""
      items.point= ""
      items.star= 0
      menuLists.value.length= 0
      //登録画像の削除
      const obj = document.getElementById('file');
      obj.value = '';
      //調味料登録フォームを1個にする
      tasteForms.length= 1
      console.log("初期化完了")
      //modalを閉じる
      store.commit('updateBentoCreateModalFlag', false)
    }
    //showMenuはmenuFormとtasteFormsの値取得、menuListsへの登録と表示
    const showMenu= ()=> {
      const menuObject = {
        menu: "",
        tastes: []
      }
      menuObject.menu= menuForm.value
      for (const tasteForm of tasteForms){
        menuObject.tastes.push(tasteForm)
      }
      menuLists.value.push(menuObject)
      console.log("menuLists", menuLists.value)
      
      //登録後、フォームは初期化
      menuForm.value=""
      tasteForms.length= 0
      return menuLists
    }
    //tasteフォームを増やす
    const addTasteForm= ()=> {
      tasteForms.push("")
    }
    //menuとtasteの削除
    const deleteMenu= (index)=> {
      menuLists.value.splice(index, 1)
    }
    const deleteTaste= (menuListIndex, tasteIndex)=> {
      menuLists.value[menuListIndex].tastes.splice(tasteIndex, 1)
    }
    
    //モーダル内の情報をdatabaseへ登録。登録内容を親に渡す。
    const bentoSave= async ()=> {
      //登録欄の年と日付を取得
      const year = items.date.slice(0, 4)
      const month = Number(moment(items.date).format("MM"))
      //保存する人のtokenを取得
      const userId= store.state.idToken.uid
      //登録モーダルを閉じてローディング開始
      store.commit('updateBentoCreateModalFlag', false)
      store.commit('updateLoadingFlag', true)
      const db= getDatabase(firebaseApp)
      const storage = getStorage();
      const menus= []
      const tastes= []

      //menuとtasteの格納
      for (const menuList of menuLists.value){
        menus.push(menuList.menu)
        tastes.push(menuList.tastes)
      }

      //画像をstorageへ保存。
      //①フルパスの取得
      const storageRef = fireStorageRef(storage,'bentos/' + userId + '/' + year + '/'+ month + '/'+ `${items.date}.jpg`)

      //②storageへアップロード
      const uploadImage= async () => {
        uploadBytes(storageRef, items.image).then(() => {
          console.log('Uploaded a blob or file!');
        });
      }
      //③画像のダウンロードとitems.imageへurlを格納
      const downloadUrl= async () => {
        getDownloadURL(fireStorageRef(storage, 'bentos/' + userId + '/' + year + '/'+ month + '/'+ `${items.date}.jpg`))
        .then((url) => {
          items.image= url
          console.log("items.image1", url)
        })
        .catch((error) => {
          console.log("画像が表示できませんでした", error)
        });
      }
      //④画像のurlも含めてdbへ登録
      const saveItems= async () => {
        
        console.log("userId", userId)
        push(fireDataRef(db, 'bentos/' + userId + '/' + year + `/`+ month + `/`+items.date),{
          weekEndFlag: Boolean(items.week),
          date: String(items.date),
          image: String(items.image),
          daily: String(items.daily),
          point: String(items.point),
          star: Number(items.star),
          menus: Array(menus),
          tastes: Array(tastes)
        }).then(() => {
          console.log("dbに保存したitems", items)
        }).catch((error) => {
          console.log("dbへ保存できませんでした", error)
        })
        
      }
      const initItems= async ()=> {
        items.weekEndFlag= false
        items.date= ""
        items.image= ""
        items.daily= ""
        items.point= ""
        items.star= 0
        menuLists.value.length= 0
        //調味料登録フォームを1個にする
        tasteForms.length= 1
        const obj = document.getElementById('file');
        obj.value = '';
        console.log("初期化完了")
        store.commit('updateLoadingFlag', false)
      }
      const startSave= async ()=> {
        await uploadImage()
        await new Promise((resolve) => setTimeout(resolve, 6000));
        await downloadUrl()
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await saveItems()
        await new Promise((resolve) => setTimeout(resolve, 6000));
        await initItems()
      }
      startSave()
    }
    return {
      items,
      menuForm,
      tasteForms,
      addTasteForm,
      showMenu,
      menuLists,
      deleteMenu,
      deleteTaste,
      bentoSave,
      setImage,
      closeBentoCreateModal
    }
  }
})

</script>
<style scoped lang="scss">
.menu-form {
  text-align: left;
  input {
    display: block;
  }
  textarea {
    display: block;
    overflow:auto;
  }
  label {
    margin-top: 2%;
  }
}
</style>