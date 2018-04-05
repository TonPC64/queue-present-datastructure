<template lang="html">
  <div class="">
    <div style="margin-bottom: 65px;">
      <nav-side-bar
      :login="login"
      :logout="logout"
      :show-dialog="showDialog"
      :check-admins="checkAdmins"
      :auth="auth"
      :links="links"
      :user-data="userData"></nav-side-bar>
    </div>
  </div>
</template>

<script>
/* global FB, localStorage */
import navSideBar from './navSideBar'
import { getKeyAdmin } from '../service/env.js'
export default {
  props: ['auth', 'setAuth', 'chengeLink', 'links', 'setUserData'],
  data () {
    return {
      keyAdmin: getKeyAdmin(),
      profile: {},
      ready: false,
      dialogFormVisible: false,
      dialogVisible: false,
      showClose: false,
      resultFind: '',
      linked: true,
      userData: '',
      updateData: ''
    }
  },
  watch: {
    'userData': function () {
      this.setUserData(this.userData)
    }
  },
  computed: {
    checkAdmins () {
      if (this.keyAdmin.find(item => item === this.profile.id)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    searchFormDb (data) {
      let resultFind = this.$root.$firebaseRefs.students.orderByChild('sid').equalTo('' + data).once('value', (snap) => {})
      return resultFind
    },
    checkHaveSid (data) {
      if (data.sid === undefined) {
        this.showDialog()
        this.chengeLink(false)
      } else {
        this.chengeLink(true)
      }
    },
    showDialog () {
      var vm = this
      vm.$prompt('รหัสนักศึกษา', 'ลงทะเบียนระบบ', {
        customClass: 'mobile-size',
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputPlaceholder: 'รหัสนักศึกษา',
        inputPattern: /^[\d-]{10,13}$/,
        inputErrorMessage: 'กรอกรหัสนักศึกษาให้ครบ',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'Loading...'
            setTimeout(() => {
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 100)
            }, 1000)
          } else {
            done()
          }
        }
      }).then(value => {
        vm.searchFormDb(value.value).then(snap => {
          let data
          if (snap.val() !== null) {
            let key = Object.keys(snap.val())[0]
            data = snap.val()[key]
            data['.key'] = key
          }
          if (data && data.name) {
            vm.$confirm(`${data.name} ${data.surname} ${data.sid}`, 'ตรวจสอบข้อมูล', {
              customClass: 'mobile-size',
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              let idFB = JSON.parse(localStorage.getItem('userData')).id
              vm.$root.$firebaseRefs.users.orderByChild('id').equalTo('' + idFB).once('value', (snapshot) => {
                if (snapshot.val() !== null) {
                  let key = Object.keys(snapshot.val())[0]
                  vm.$root.$firebaseRefs.users.child(`${key}`).update({name: data.name, surname: data.surname, sid: data.sid}).then(() => {
                    vm.$message({
                      type: 'success',
                      message: 'ลงทะเบียนเสร็จสมบูรณ์'
                    })
                    vm.chengeLink(true)
                    vm.userData = Object.assign(vm.userData, {name: data.name, surname: data.surname, sid: data.sid})
                    localStorage.setItem('userData', JSON.stringify(vm.userData))
                  })
                }
              })
            }).catch(() => {
              vm.$message({
                type: 'info',
                message: 'ลงทะเบียนไม่สมบูรณ์'
              })
            })
          } else {
            vm.$alert('ไม่พบข้อมูลนักศึกษา', 'ลงทะเบียนระบบ', {
              customClass: 'mobile-size',
              confirmButtonText: 'OK',
              type: 'error'
            })
          }
        })
      })
    },
    register (data) {
      var vm = this
      data.fbname = data.name
      delete data.name
      this.$root.$firebaseRefs.users.orderByChild('id').equalTo('' + data.id).once('value', (snapshot) => {
        if (snapshot.val() === null) {
          this.$root.$firebaseRefs.users.push(data).then((res) => {
            res.once('value').then(function (snapshot) {
              vm.userData = snapshot.val()
              vm.userData['.key'] = res.key
              vm.checkHaveSid(vm.userData)
              localStorage.setItem('userData', JSON.stringify(vm.userData))
            })
          })
        }
      })
    },
    checkRegisterApp (response) {
      this.$root.$firebaseRefs.users.orderByChild('id').equalTo('' + response.id).on('value', (snapshot) => {
        let key = Object.keys(snapshot.val())[0]
        let searchResult = snapshot.val()[key]
        searchResult['.key'] = key
        this.userData = searchResult
      })
      this.$root.$firebaseRefs.users.orderByChild('id').equalTo('' + response.id).once('value', (snapshot) => {
        if (snapshot.val() === null) {
          this.register(response)
        } else {
          let key = Object.keys(snapshot.val())[0]
          let searchResult = snapshot.val()[key]
          searchResult['.key'] = key
          this.userData = searchResult
          localStorage.setItem('userData', JSON.stringify(this.userData))
          this.checkHaveSid(searchResult)
        }
      })
    },
    getProfile () {
      let vm = this
      FB.api('/me', function (response) {
        vm.$set(vm, 'profile', response)
        vm.checkRegisterApp(response)
      })
    },
    login () {
      let vm = this
      FB.login(function (response) {
        vm.statusChangeCallback(response)
      }, {scope: 'publish_actions'})
    },
    logout () {
      let vm = this
      FB.logout(function (response) {
        vm.statusChangeCallback(response)
        localStorage.clear()
      })
    },
    afterLogout () {
      let vm = this
      vm.setAuth(false)
      vm.chengeLink(true)
      vm.profile = {}
      vm.userData = ''
    },
    statusChangeCallback (response) {
      let vm = this
      vm.ready = true
      if (response.status === 'connected') {
        vm.setAuth(true)
        vm.getProfile()
      } else if (response.status === 'not_authorized') {
        vm.afterLogout()
      } else {
        vm.afterLogout()
      }
    }
  },
  mounted () {
    let vm = this
    window.fbAsyncInit = () => {
      FB.init({
        appId: '1834473726799592',
        cookie: true,
        xfbml: true,
        version: 'v2.8'
      })
      FB.getLoginStatus(function (response) {
        vm.statusChangeCallback(response)
      })
    }
  },
  components: {
    navSideBar
  }
}
</script>

<style>
@media screen and (max-width: 425px) {
   .el-message-box {
      width: 405px !important;
  }
} 
@media screen and (max-width: 375px) {
  .el-message-box {
      width: 355px !important;
  }
}
@media screen and (max-width: 320px) {
  .el-message-box {
      max-width: 300px !important;
  }
}
</style>
