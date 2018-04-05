<template>
  <div id="app" class="page-container" v-loading.fullscreen.lock="fullscreenLoading">
    <login :auth="auth" :links="links" :set-auth="setAuth" :chengeLink="chengeLink" :set-user-data="setUserData"></login>
    <transition name="slide-fade" mode="out-in">
      <router-view :auth="auth" :links="links" :user-data="userData"></router-view>
    </transition>
  </div>
</template>

<script>
/* global localStorage */
import { getKeyAdmin } from './service/env.js'
import login from './components/login'
export default {
  name: 'app',
  data () {
    return {
      online: this.$root.online,
      fullscreenLoading: true,
      auth: false,
      links: true,
      userData: ''
    }
  },
  methods: {
    chengeLink (boolData) {
      this.$set(this, 'links', boolData)
    },
    setAuth (bool) {
      this.$set(this, 'auth', bool)
    },
    setUserData (data) {
      this.$set(this, 'userData', data)
      localStorage.setItem('userData', JSON.stringify(data))
    }
  },
  watch: {
    online (val) {
      this.$set(this, 'fullscreenLoading', false)
    }
  },
  created () {
    if (localStorage.userData === undefined) {
      this.$router.push({path: '/'})
    } else {
      if (getKeyAdmin().findIndex(item => item === JSON.parse(localStorage.userData).id) === -1) {
        this.$router.push({path: '/'})
      }
    }
  },
  components: {
    login
  }
}
</script>

<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #e9ebee;
  padding: 20px;
  user-select: none;
}
@media screen and (max-width: 480px) {
    body {
      padding: 0px;
    }
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  padding-left: 10px;
  opacity: 0;
}
.page-container {
  left: 0;
  right: 0;
  margin: auto;
  max-width: 1024px;
  box-sizing: border-box;
}
</style>
