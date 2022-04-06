<template>
  <div class="bento-list col-md-8 mx-auto">
    <div class="list-group" v-for="(item, itemKey) in items" :key="itemKey">
      <a class="bento-list-card list-group-item list-group-item-action" v-on:click="showBentoPage(item)">
        <div class="bento-list-item row">
          <div class="bento-image col-4 col-sm-3">
            <img class="image" :src='item.image'  alt="image">
          </div>
          <div class="list-index col-8 col-sm-9 row ps-1 text-start">
            <p class="d-inline mb-0 pb-0">{{ item.date }}</p>
            <!-- <a class="deleteTasteForm ps-1 mt-3 col-2 d-inline" v-on:click="deleteItem(item)"><font-awesome-icon icon="trash-can" /></a> -->
            <div class="list-text col-12">
              <div v-if="item.menus" class="item-menus my-2 col-12">
                <p class="d-inline me-2" v-for="(menu, menuKey) in item.menus[0]" :key=menuKey>{{ menu }}</p>
              </div>
              <p class="item-point">{{ item.point }}</p>
            </div>
            <div class="d-inline text-end" >
                <p class="d-inline text-end star" v-for="n of item.star" :key="n">★</p>
              </div>
            
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
// import { getDatabase, update, onValue } from "firebase/database"
// import { ref as fireDataRef } from "firebase/database"
// import { getStorage, deleteObject } from "firebase/storage";
// import { ref as fireStorageRef} from "firebase/storage"

export default defineComponent({
  props: ["theads", "items"],
  setup(props) {
    const store = useStore()
    console.log("props.theads", props.theads)
    const showBentoPage= (item) => {
      store.commit('updateBentoShowModalFlag', true)
      store.commit('getShowItem', item)
      console.log("showItem", item)
    }
    //削除
    // const deleteItem= async (item) => {
    //   console.log(item)
    //   //storageの削除
    //   const deleteStorage= async ()=> {
    //     const storage = getStorage();
    //     const deleteRef = fireStorageRef(storage, 'images/' + `${item.date}.jpg`);
    //     deleteObject(deleteRef).then(() => {
    //       console.log("画像ファイル削除")
    //     }).catch((error) => {
    //       console.log("画像削除失敗", error)
    //     });
    //   }
      
    //   // dbの削除
    //   const deleteDb= async ()=> {
    //     const db = getDatabase();
    //     const itemRef = fireDataRef(db, 'bentos/' + item.date);
    //     onValue(itemRef, (snapshot) => {
    //       const data = snapshot.val();
    //       console.log("itemRef", data)
    //       const updateKey= Object.keys(data)[0]
    //       console.log("updateKey", updateKey)
    //       const updates = {};
    //       updates['/bentos/' + item.date + '/' + updateKey] = null;
    //       return update(fireDataRef(db), updates);
    //     }).then(() => {
    //       console.log("db消去")
    //     }).catch((error) => {
    //       console.log(error)
    //     })
    //   }
    //   const deleteAction= async ()=> {
    //     await deleteStorage()
    //     await new Promise((resolve) => setTimeout(resolve, 6000));
    //     await deleteDb()
    //   }
    //   deleteAction()
    // }
    return {
      showBentoPage,
      // deleteItem
    }
  },
})
</script>
<style scoped lang="scss">
.bento-list-card {
  height: 25vh;
  .bento-list-item {
    height: 22vh;
  img {
  object-fit: cover;
  height: 22vh;
  width: 100%;
  border-radius: 5%;
  border-color: #fffaf0;
  border-width: thin;
  }
  .list-index {
    height: 18vh;
  }
  .list-text {
    height: 15vh;
  }
  .star {
    color: #ff4500;
  }
  }
}

</style>
