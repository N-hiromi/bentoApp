<template>
<div>
  <Header />
  <router-view></router-view>
</div>
</template>

<script>
import { defineComponent } from 'vue'
import Header from '@/components/Header.vue'
export default defineComponent({
  components: {
    Header
  },
  setup() {
  },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
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
    background-color: white;
    padding: 5px;
    z-index: 2;
  }
</style>
