/* global localStorage */
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import locale from 'element-ui/lib/locale/lang/en'
import VueFire from 'vuefire'
import VueRouter from 'vue-router'
import Firebase from 'firebase'
import moment from 'moment'

Vue.use(VueRouter)
Vue.use(VueFire)
Vue.use(ElementUI, { locale })
// Vue.use(firebase)

import App from './App'
import Index from './components'
import Queue from './components/queue'
import Ta from './components/ta'
import AddTime from './components/ta/addTime'
import AddStudent from './components/ta/addStudent'
import ChangeStatus from './components/ta/changeStatusUser'
import DashBoard from './components/ta/dashBoard'

(function (d, s, id) {
  var js
  var fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s); js.id = id
  js.src = '//connect.facebook.net/en_US/all.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))

moment.locale('th')

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Index
    },
    {
      path: '/queue/',
      component: Queue
    },
    {
      path: '/ta/',
      component: Ta,
      children: [
        {
          path: '/',
          component: AddTime
        },
        {
          path: 'addStudent',
          component: AddStudent
        },
        {
          path: 'userData',
          component: ChangeStatus
        },
        {
          path: 'dashboard',
          component: DashBoard
        }
      ]
    },
    { path: '*', redirect: '/' }
  ]
})

var config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: ''
}
let firebase = Firebase.initializeApp(config)
let db = firebase.database()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  firebase: {
    rounds: db.ref('rounds'),
    online: db.ref('online'),
    students: db.ref('students'),
    users: db.ref('users'),
    times: db.ref('times')
  },
  render: h => h(App)
})

import { getKeyAdmin } from './service/env.js'
router.beforeEach((to, from, next) => {
  let keyAdmin = getKeyAdmin()
  if (to.path === '/queue') {
    next()
  } else if (localStorage.getItem('userData') === '') {
    next({ path: '/' })
  } else {
    if (localStorage.getItem('userData') !== null) {
      let idLocal = JSON.parse(localStorage.getItem('userData')).id
      if (keyAdmin.findIndex(item => item === idLocal) !== -1) {
        next()
      } else {
        next({ path: '/' })
      }
    }
  }
})
