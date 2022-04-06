<template>
<div class="container">
  <LoginForm v-bind:title="title" v-on:login="login"/>
  <div class="container mt-3" >
    <router-link to="/register">新規登録はこちら</router-link>
  </div>
</div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default defineComponent({
  components: {
    LoginForm,
  },
  setup() {
    const title="ログイン"
    const store = useStore()
    const router = useRouter()
    const login= (email, password) => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      store.commit('updateIdToken', user)
      router.push('/')
    })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
  });
    }
    return {
      login,
      title
    }
  },
})
</script>

<style>
.input-group {
  margin: 5px;
}
</style>