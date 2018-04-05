<template lang="html">
  <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <div class="page-container">
    <el-menu-item class="only-mobile ham" index="sideBar">
      <div class="burger"></div>
      <div class="burger"></div>
      <div class="burger"></div>
    </el-menu-item>
    <el-menu-item class="only-desktop" index="LINK" v-if="auth && !links">
      <el-button type="warning">LINK</el-button>
    </el-menu-item>
    <el-menu-item class="only-desktop" index="LOGOUT" v-if="auth">
      <el-button  type="danger">LOGOUT</el-button>
    </el-menu-item>
    <el-menu-item class="only-desktop" index="LOGIN" v-if="!auth">
      <el-button type="primary">LOGIN</el-button>
    </el-menu-item>
    <el-menu-item class="only-desktop" index="queue" >Queue</el-menu-item>
    <el-menu-item class="only-desktop" index="dashboard" v-if="checkAdmins">Dashboard</el-menu-item>
    <el-menu-item class="only-desktop" index="Student" v-if="checkAdmins">Add Student</el-menu-item>
    <el-menu-item class="only-desktop" index="Time" v-if="checkAdmins">Add Time</el-menu-item>
    <el-menu-item class="only-desktop" index="userData" v-if="checkAdmins">User Data</el-menu-item>
    <el-menu-item index="logo" class="logo">
      <img style="margin: 7px;"  src="/static/favicon-96x96.png" height="45px">
    </el-menu-item>
    </div>
  </el-menu>
</template>

<script>
export default {
  props: ['openNav', 'closeNav', 'login', 'logout', 'showDialog', 'checkAdmins', 'auth', 'links'],
  data () {
    return {
      path: this.$route.path
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      let text = keyPath[0]
      if (text === 'sideBar') {
        this.openNav()
      } else if (text === 'LOGIN') {
        this.login()
      } else if (text === 'LOGOUT') {
        this.logout()
      } else if (text === 'LINK') {
        this.showDialog()
      } else if (text === 'ta') {
        this.$router.push({path: '/ta'})
      } else if (text === 'logo') {
        this.$router.push({path: '/'})
      } else if (text === 'Student') {
        this.$router.push({path: '/ta/addStudent'})
      } else if (text === 'Time') {
        this.$router.push({path: '/ta'})
      } else if (text === 'userData') {
        this.$router.push({path: '/ta/userData'})
      } else if (text === 'dashboard') {
        this.$router.push({path: '/ta/dashboard'})
      } else if (text === 'queue') {
        this.$router.push({path: '/queue'})
      }
    }
  }
}
</script>

<style scoped>
.el-menu {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.el-menu-item {
  float: right !important;
  padding: 0 15px 0 0;
}

.logo {
  float: left !important;
}

@media screen and (min-width: 480px) {
  .only-mobile {
    display: none;
  }
}
@media screen and (max-width: 480px) {
  .only-desktop {
    display: none;
  }
  .el-menu-item {
    float: left !important;
    padding: 0 15px;
  }
  .logo {
    float: right !important;
  }
}

.burger {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 4px 0;
}
.ham {
  margin-top: 17px;
  margin-bottom: 0;
  height: fit-content;
}
.el-menu {
  border-radius: 0;
  position: fixed;
  z-index: 30;
}
</style>
