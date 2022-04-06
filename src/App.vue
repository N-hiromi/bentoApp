<template>
<div v-bind:class="{'week-end-body': isWeekEndFlag}">
  <Header />
  <router-view></router-view>
</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import Header from '@/components/Header.vue'
import { useStore } from 'vuex'
export default defineComponent({
  components: {
    Header
  },
  setup() {
    const store = useStore()
    //storeのweekEndFlag(defaultでfalse)を認識。クラスを適用する
    const isWeekEndFlag = computed(() => {
      return store.getters.weekEndFlag == true
    })
    return {
      isWeekEndFlag
    }
  },
})
</script>

<style lang="scss">
html{
  background-color: #fffaf0;
}
.week-end-body{
  background: #e0ffff;
  //スクロールしても画面下部が切れないようにかつ、年月選択前に全画面で表示されるように
  min-height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  background-color: #fffaf0;
}
  .modal-background {
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  background-color: rgba(0,0,0,.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1;
  }
  
  .modal-contents {
    // background-color: white;
    background-color: #fffaf0;
    padding: 5px;
    z-index: 2;
    border-radius: 3%;
    border-color: #fffaf0;
    border-width: thin;
  }
</style>
