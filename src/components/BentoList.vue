<template>
  <div>
    <div v-for="(item, itemKey) in items" :key="itemKey">
      <p>{{ item.date }}</p>
      <button v-on:click="deleteItem(item)">削除</button>
      <img class="image" :src='item.image'  alt="image"  v-on:click="showBentoPage(item)">
      <ul v-for="(menu, menuKey) in item.menus" :key="menuKey">
        <li>{{ menu }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { getDatabase, update, onValue } from "firebase/database"
import { ref as fireDataRef } from "firebase/database"
import { getStorage, deleteObject } from "firebase/storage";
import { ref as fireStorageRef} from "firebase/storage"

export default defineComponent({
  props: ["theads", "items"],
  setup(props) {
    const store = useStore()
    // const bentoShowModalFlag= ref(false)
    console.log("props.theads", props.theads)
    const showBentoPage= (item) => {
      store.commit('updateBentoShowModalFlag', true)
      // context.emit("openBentoShowModal")
      store.commit('getShowItem', item)
      console.log("showItem", item)
      console.log("ohato")
    }
    //削除
    const deleteItem= async (item) => {
      console.log(item)
      //storageの削除
      const deleteStorage= async ()=> {
        const storage = getStorage();
        const deleteRef = fireStorageRef(storage, 'images/' + `${item.date}.jpg`);
        deleteObject(deleteRef).then(() => {
          console.log("画像ファイル削除")
        }).catch((error) => {
          console.log("画像削除失敗", error)
        });
      }
      
      // dbの削除
      const deleteDb= async ()=> {
        const db = getDatabase();
        const itemRef = fireDataRef(db, 'bentos/' + item.date);
        onValue(itemRef, (snapshot) => {
          const data = snapshot.val();
          console.log("itemRef", data)
          const updateKey= Object.keys(data)[0]
          console.log("updateKey", updateKey)
          const updates = {};
          updates['/bentos/' + item.date + '/' + updateKey] = null;
          return update(fireDataRef(db), updates);
        }).then(() => {
          console.log("db消去")
        }).catch((error) => {
          console.log(error)
        })
      }
      const deleteAction= async ()=> {
        await deleteStorage()
        await new Promise((resolve) => setTimeout(resolve, 6000));
        await deleteDb()
      }
      deleteAction()
    }
    // console.log("props.items", props.items[0])
    // console.log("props.items[0].image", props.items[0].image)
    // Or inserted into an <img> element
        // const img = document.getElementById('bento');
        // img.setAttribute('src', );
  //   // const data= reactive({
  //   //   email: '',
  //   //   password: ''
  //   // })
  //   // const emitData= () => {
  //   //   context.emit('login', data.email, data.password)
  //   //   data.email= ""
  //   //   data.password= ""
  //   // }
    return {
      showBentoPage,
      deleteItem
    }
  },
})
</script>
<style scoped lang="scss">
$white: green;
.emailLabel {
  color: $white
}
</style>
