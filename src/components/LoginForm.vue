<template>
<div id="login" class="col-12 col-md-4 mx-auto rounded">
  <h2 class="pt-5">{{ title }}</h2>
  <form class="login-form px-5 py-5">
    <div class="input-group mt-2 shadow-sm">
      <input type="email" id="email" class="form-control" v-model="data.email" placeholder="mailaddress">
    </div>
    <div class="input-group mt-2 shadow-sm">
      <input type="password" id="password" class="form-control" v-model="data.password" placeholder="password">
    </div>
    <div class="input-group d-grid gap-2 col-4 mx-auto mt-5 shadow-sm">
      <button type="button" class="btn btn-primary" v-on:click="emitData">ログイン</button>
    </div>
  </form>
</div>
</template>
<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  props: ["title"],
  emits: ["login"],
  setup(props, context) {
    const data= reactive({
      email: '',
      password: ''
    })
    const emitData= () => {
      context.emit('login', data.email, data.password)
      data.email= ""
      data.password= ""
    }
    return {
      data,
      emitData
    }
  },
})
</script>
<style scoped lang="scss">
#login {
  background-color: white;
  border-color: blue;
  border:solid;
  margin-top: 10%;
}
</style>
