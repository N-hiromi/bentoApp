<template>
  <div class="modal fade" v-bind:id="firstId" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalToggleLabel">{{ title }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="closeBentoCreateModal"></button>
          </div>
          <div class="modal-body">
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
          </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" v-on:click="closeBentoCreateModal">やめる</button>
          <button class="btn btn-primary" v-bind:data-bs-target="'#' +secondId" data-bs-toggle="modal" data-bs-dismiss="modal">次へ</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" v-bind:id="secondId" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalToggleLabel2">メニュー登録</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" v-on:click="closeBentoCreateModal"></button>
        </div>
        <div class="modal-body">
          <div class="menu-form">
            <div class="form-item col-8">
              <label for="name">メニュー</label>
              <input class="form-control" type="text" id="name" v-model="menuForm">
            </div>
            <label for="name">調味料</label>
            <div class="taste-form row">
              <div class="col-6" v-for="(tasteForm, tasteIndex) in tasteForms" :key="tasteIndex">
                <div class="form-trash row">
                  <div class="form-item col-10 pb-2">
                    <input class="form-control" type="text" id="name" v-model="tasteForms[tasteIndex]">
                  </div>
                  <a class="deleteTasteForm ps-1 mt-3 col-2" v-on:click="deleteTasteForm(tasteIndex)"><font-awesome-icon icon="trash-can" /></a>
                </div>
              </div>
            </div>
            <button class="btn btn-primary"  v-on:click="addTasteForm">調味料追加</button>
            <button class="btn btn-primary" v-on:click="showMenu">メニューを登録</button>
          </div>
          <div v-if="inputItem.menus !== []" class="update-menu-table manu-table">
            <dl v-for="(menu, menuIndex) in inputItem.menus[0]" :key="menuIndex">
              <dt>{{ menu }}<a class="deleteMenu d-inline ps-3 mt-3 col-2" v-on:click="deleteUpdateMenu(menuIndex)"><font-awesome-icon icon="trash-can" /></a></dt>
              <dd>
                <p class="d-inline ps-2" v-for="(taste, tasteIndex) in inputItem.tastes[0][menuIndex]" :key="tasteIndex">{{ taste }}</p>
              </dd>
            </dl>
          </div>
          <div class="create-menu-table menu-table">
            <dl v-for="(menuList, menuListIndex) in menuLists" :key="menuListIndex">
              <dt>{{ menuList.menu }}<a class="deleteMenuForm d-inline ps-3 mt-3 col-2" v-on:click="deleteMenu(menuListIndex)"><font-awesome-icon icon="trash-can" /></a></dt>
              <dd>
                <p class="d-inline ps-2" v-for="(taste, tasteIndex) in menuList.tastes" :key="tasteIndex">{{ taste }}</p>
              </dd>
            </dl>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" v-bind:data-bs-target='"#"+ firstId' data-bs-toggle="modal" data-bs-dismiss="modal">戻る</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" v-on:click="bentoSave">登録</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, reactive, ref, watch, defineExpose} from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  props: ["initItem", "title", "firstId", "secondId"],
  emits: ["bentoSave"],
  setup(props, context) {
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
    watch(props.initItem, (newValue, oldValue) => {
      console.log("propsInputModal", newValue, oldValue)
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
      //formの初期化
      inputItem.weekEndFlag= false
      inputItem.date= ""
      inputItem.image= ""
      inputItem.daily= ""
      inputItem.point= ""
      inputItem.star= 0
      console.log("closeBentoCreateModal", inputItem.menus)
      //create-menu部分が空になる
      menuLists.value.length= 0
      if (inputItem.menus !== "") {
        console.log("menusとtastes", inputItem.menus, inputItem.tastes)
        inputItem.menus= []
        inputItem.tastes= []
        console.log("menusとtastes2", inputItem.menus, inputItem.tastes)
      }
      
      //登録画像の削除
      const obj = document.getElementById('file');
      obj.value = '';
      //調味料登録フォームを1個にする
      tasteForms.length= 0
      tasteForms[0]= ""
      console.log("初期化完了")
      //store.itemを消去。Listクリックでstore.stateが再代入されたときにまたwatchするように
      store.commit('getShowItem', "")
      //modalを閉じる
      store.commit('updateBentoCreateModalFlag', false)
      store.commit('updateBentoUpdateModalFlag', false)
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
      console.log("menuLists", menuLists.value)
      
      //登録後、フォームは初期化
      menuForm.value=""
      tasteForms.length= 0
      tasteForms[0]= ""
      // menuLists.value.splice(1)
      
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
      inputItem.menus[0].splice(index, 1)
      inputItem.tastes[0].splice(index, 1)
    }

    //モーダル内の情報をcreateかupdateModalへ渡す。
    const bentoSave= async ()=> {
      //updateの場合のみcreate済みのmenuとtasteを格納
      if (inputItem.menus[0]) {
        console.log("inputItem.menus", inputItem.menus)
        console.log("inputItem.menus[0]", inputItem.menus[0])
        console.log("menuは空？", menus)
        inputItem.menus[0].forEach(element => menus.push(element))
        inputItem.tastes[0].forEach(element=> tastes.push(element))
      }

      //updateで新しく作成したmenuとtasteの格納
      for (const menuList of menuLists.value){
        menus.push(menuList.menu)
        tastes.push(menuList.tastes)
      }
      menuLists.value.length= 0
      console.log("menusとtastes2", menus, tastes)
      console.log("bentoSave-inputItem", inputItem.menus, inputItem.tastes)
      context.emit('bentoSave', inputItem, menus, tastes)
      // menus.length= 0
      // tastes.length= 0
      
    }
    defineExpose({
      closeBentoCreateModal,
    })
    return {
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