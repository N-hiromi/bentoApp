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

export default defineComponent({
  props: ["theads", "items"],
  setup() {
    const store = useStore()
    const showBentoPage= (item) => {
      store.commit('updateBentoShowModalFlag', true)
      store.commit('getShowItem', item)
    }
    return {
      showBentoPage,
    }
  },
})
</script>
<style scoped lang="scss">
.bento-list-card {
  height: 25vh;
  position:relative;
  .bento-list-item {
    height: 22vh;
  .delete-item {
    position :absolute;
    z-index: 1;
    top: 0;
    left: 90%;
  }
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
  }
}

</style>
