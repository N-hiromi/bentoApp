<template>
<div class="inputModal">
  <div v-show="openModal" class="modal-background">
    <div class="modal-contents container p-4 col-sm-6">
      <div class="row">
        <h5 class="d-block col-6 text-start">{{ title }}</h5>
        <div class="col-6 text-end">
          <button type="button" class="btn-close" aria-label="Close" v-on:click="closeBentoCreateModal"></button>
        </div>
      </div>
      <div class="menu-form">
        <div class="date-star row">
          <div class="form-item col-5">
            <label for="date">日付</label>
            <input type="date" class="form-control" v-model="inputItem.date">
          </div>
          <div class="form-item col-4">
            <label for="star">評価</label>
            <select class="form-select" name="star" v-model="inputItem.star">
              <option value="1">★</option>
              <option value="2">★★</option>
              <option value="3">★★★</option>
              <option value="4">★★★★</option>
              <option value="5">★★★★★</option>
            </select>
          </div>
          <div class="weekend-select col mt-4">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" v-model="inputItem.weekEndFlag" id="flexCheckDefault">
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
          <textarea class="form-control" name="point" rows="3" v-model="inputItem.point"></textarea>
        </div>
        <div class="form-item">
          <label for="daily">日記</label>
          <textarea class="form-control" name="daily" id="" rows="3" v-model="inputItem.daily"></textarea>
        </div>
      </div>
      <div class="text-end mt-3">
        <button type="button" class="btn btn-secondary" v-on:click="closeBentoCreateModal">やめる</button>
        <button class="btn btn-primary ms-3" v-on:click="openMenuModal= true; openModal= false;">次へ</button>
      </div>
    </div>
  </div>
  
  <teleport to="body">
    <div v-if="openMenuModal" class="modal-background">
      <div class="modal-contents container p-4 col-sm-6">
        <div class="row">
          <h5 class="d-block col-6 text-start">メニュー登録</h5>
          <div class="col-6 text-end">
            <button type="button" class="btn-close" aria-label="Close" v-on:click="closeBentoCreateModal"></button>
          </div>
        </div>
        <div class="">
          <div class="menu-form">
            <div class="form-item col-8">
              <label for="name">メニュー</label>
              <input class="form-control" type="text" id="menu" v-model="menuForm">
            </div>
            <label for="name">調味料</label>
            <a class="addTasteForm ms-2" v-on:click="addTasteForm"><font-awesome-icon icon="plus" /></a>
            <div class="taste-form row">
              <div class="col-6" v-for="(tasteForm, tasteIndex) in tasteForms" :key="tasteIndex">
                <div class="row">
                  <div class="form-item col-10 pb-2">
                    <input class="form-control" type="text" id="taste" v-model="tasteForms[tasteIndex]">
                  </div>
                  <a class="deleteTasteForm ps-1 mt-3 col-2" v-on:click="deleteTasteForm(tasteIndex)"><font-awesome-icon icon="trash-can" /></a>
                </div>
              </div>
            </div>
            <button class="btn btn-primary mt-2" v-on:click="showMenu">メニューを登録</button>
          </div>
          <div v-if="inputItem.menus[0]" class="update-menu-table manu-table mt-3">
            <dl v-for="(menu, menuIndex) in inputItem.menus[0]" :key="menuIndex">
              <dt>{{ menu }}<a class="deleteMenu d-inline ps-3 mt-3 col-2" v-on:click="deleteUpdateMenu(menuIndex)"><font-awesome-icon icon="trash-can" /></a></dt>
              <dd v-if="inputItem.tastes[0]">
                <p class="d-inline me-2" v-for="(taste, tasteIndex) in inputItem.tastes[0][menuIndex]" :key="tasteIndex">{{ taste }}</p>
              </dd>
            </dl>
          </div>
          <div class="create-menu-table menu-table mt-3">
            <dl v-for="(menuList, menuListIndex) in menuLists" :key="menuListIndex">
              <dt>{{ menuList.menu }}<a class="deleteMenuForm d-inline ps-3 mt-3 col-2" v-on:click="deleteMenu(menuListIndex)"><font-awesome-icon icon="trash-can" /></a></dt>
              <dd>
                <p class="d-inline ps-2" v-for="(taste, tasteIndex) in menuList.tastes" :key="tasteIndex">{{ taste }}</p>
              </dd>
            </dl>
          </div>
        </div>
        <div class="text-end mt-3">
          <button class="btn btn-secondary"  v-on:click="openMenuModal= false; openModal= true;">戻る</button>
          <button type="button" class="btn btn-primary ms-3" v-on:click="bentoSave">登録</button>
        </div>
      </div>
      </div>
  </teleport>

</div>
  
</template>
<script>
import { defineComponent, reactive, ref, watch, defineExpose} from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: ["initItem", "title"],
  emits: ["bentoSave"],
  setup(props, context) {
    const openModal= ref(true)
    const openMenuModal= ref(false)
    const store = useStore()
    const menuForm= ref("")
    const tasteForms= reactive([""])
    const menuLists= ref([])
    const menus= []
    const tastes= []
    //初期値はcreateModalからなら空文字と今日の日付、updateModalからなら最初は空文字(createModalのNodata)。
    const inputItem= reactive({
      weekEndFlag: props.initItem.weekEndFlag,
      date: props.initItem.date,
      image: props.initItem.image,
      daily: props.initItem.daily,
      point: props.initItem.point,
      star: props.initItem.star,
      //upddateの場合だけ使う
      menus: props.initItem.menus,
      tastes: props.initItem.tastes,
    })
    //initItemが変わったら初期値に再代入。createなら空文字と今日の日付。updateModalならShowItem
    watch(props.initItem, (newValue) => {
      inputItem.weekEndFlag= newValue.weekEndFlag
      inputItem.date= newValue.date
      inputItem.image= newValue.image
      inputItem.daily= newValue.daily
      inputItem.point= newValue.point
      inputItem.star= newValue.star
      inputItem.menus= newValue.menus
      inputItem.tastes= newValue.tastes
    })
    const setImage= (event) => {
      const file = event.target.files[0]
      if (file) {
        inputItem.image= file
      }
    }

    const closeBentoCreateModal= () => {
      //modalはdefaultで開いたまんま(createやupdateModalが閉じたら一緒に閉じるから)。menuModalのみ閉じる。
      openModal.value= true
      openMenuModal.value= false
      //formの初期化
      inputItem.weekEndFlag= false
      inputItem.date= ""
      inputItem.image= ""
      inputItem.daily= ""
      inputItem.point= ""
      inputItem.star= 0
      //create-menu部分が空になる
      menuLists.value.length= 0
      if (inputItem.menus !== "") {
        inputItem.menus= []
        inputItem.tastes= []
      }
      
      //登録画像の削除
      const obj = document.getElementById('file');
      obj.value = '';
      //調味料登録フォームを1個にする
      tasteForms.length= 0
      tasteForms[0]= ""
      //store.itemを消去。Listクリックでstore.stateが再代入されたときにまたwatchするように
      store.commit('getShowItem', "")
      //modalを閉じる
      store.commit('updateBentoCreateModalFlag', false)
      store.commit('updateBentoUpdateModalFlag', false)
      store.commit('updateLoadingFlag', false)
    }

    //登録途中のtasteFormを削除するボタン
    const deleteTasteForm = (tasteIndex) => {
      tasteForms.splice(tasteIndex, 1)
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
      
      //登録後、フォームは初期化
      menuForm.value=""
      tasteForms.length= 0
      tasteForms[0]= ""
    }
    //tasteフォームを増やす
    const addTasteForm= ()=> {
      tasteForms.push("")
    }
    //menuとtasteの削除
    const deleteMenu= (index)=> {
      menuLists.value.splice(index, 1)
    }
    //元々登録されていたmenuとtasteを削除
    const deleteUpdateMenu= (index)=> {
      inputItem.tastes[0].splice(index, 1)
      inputItem.menus[0].splice(index, 1)
    }

    //モーダル内の情報をcreateかupdateModalへ渡す。
    const bentoSave= async ()=> {
      //updateの場合のみcreate済みのmenuとtasteを格納
      if (inputItem.menus[0]) {
        inputItem.menus[0].forEach(element => menus.push(element))
      }
      if (inputItem.tastes[0]) {
        inputItem.tastes[0].forEach(element=> tastes.push(element))
      }

      //updateで新しく作成したmenuとtasteの格納
      for (const menuList of menuLists.value){
        menus.push(menuList.menu)
        tastes.push(menuList.tastes)
      }
      menuLists.value.length= 0
      context.emit('bentoSave', inputItem, menus, tastes)
    }
    defineExpose({
      closeBentoCreateModal,
    })
    return {
      openModal,
      openMenuModal,
      inputItem,
      menuForm,
      tasteForms,
      addTasteForm,
      showMenu,
      menuLists,
      deleteMenu,
      deleteUpdateMenu, 
      deleteTasteForm,
      bentoSave,
      setImage,
      closeBentoCreateModal,
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