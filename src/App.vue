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
</style>
