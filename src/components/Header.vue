<template>
<div>
  <nav v-if="isLoggedIn" v-bind:class="{['week-end-header']: isWeekEndFlag}" class="navbar navbar-expand-lg navbar-light bg-warning">
    <div class="container-fluid">
      <img src="/images/salad-575436_640.png"/>
      <a class="navbar-brand" href="#">ObentoApp</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav text-start">
          <li class="nav-item header-item">
            <a class="nav-link active" role="button" v-on:click= "openRegisterModal">お弁当登録</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" role="button" v-on:click="logout">ログアウト</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>

</div>
</template>
<script>
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getAuth, signOut } from "firebase/auth";

export default defineComponent({
  setup() {
    const store = useStore()
    const router = useRouter()

    //ログインしていなければヘッダーを表示しない
    const isLoggedIn = computed(() => {
      return store.getters.idToken !== null
    })

    //storeのweekEndFlag(defaultでfalse)を認識。クラスを適用する
    const isWeekEndFlag = computed(() => {
      return store.getters.weekEndFlag == true
    })

    //新規登録ボタンを押すとstoreへモーダル開くよと知らせる
    const openRegisterModal = () => {
      store.commit('updateBentoCreateModalFlag', true)
    }
    
    const logout = () => {
      //firebaseでのログアウト
      const auth = getAuth();
      signOut(auth).then(() => {
        console.log("signout successful")
      }).catch((error) => {
        console.log("signout error", error)
      });
      //アプリ内でのログアウト処理
      store.commit('updateIdToken', null)
      router.push('/login')
      //背景色weekEndFlagはdefaultをfalseにしておきたい
      store.commit('updateWeekEndFlag', false)
    }
    return {
      isLoggedIn,
      isWeekEndFlag,
      logout,
      openRegisterModal
    }
  },
})
</script>
<style scoped lang="scss">
//importantをつけないと、bootstrapのクラスが優先されてしまうため仕方なくつけた
.week-end-header {
  background-color: #00008b !important;
  a{
    color: #fff !important;
  }
}
img {
    width: 5%;
    height: 5%;
  }
a:hover {
  color: yellow !important;
}

</style>