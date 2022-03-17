<template>
<div class="container">
  <LoginForm v-bind:title="title" v-on:login="login"/>
  <div class="container mt-3">
    <router-link to="/login" >既存のアカウントへログイン</router-link>
  </div>
</div>
</template>
<script>
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export default defineComponent({
  components: {
    LoginForm,
  },
  setup() {
    const title="新規登録"
    const store = useStore()
    const router = useRouter()
    const login= (email, password) => {
      const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("userCredential", user)
        store.commit('updateIdToken', user);
        router.push('/');
        // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
            // ..
      });
    }
    return {
      login,
      title
    }
  },
})
</script>
