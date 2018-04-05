<template>
  <div>
    <nav-menu
    v-if="!fullscreenLoading"
    :open-nav="openNav"
    :close-nav="closeNav"
    :login="login"
    :logout="logout"
    :show-dialog="showDialog"
    :check-admins="checkAdmins"
    :auth="auth"
    :links="links"></nav-menu>
    <div id="mySidenav" class="sidenav" @click="closeNav()">
      <a href="javascript:void(0)" class="closebtn" @click="closeNav()">&times;</a>
      <div class="display" v-if="userData">
        <img :src="`https://graph.facebook.com/${userData.id}/picture?width=100`">
      </div>
      <div class="user-data" v-if="userData">
       <div >{{userData.fbname}}</div>
       <div >{{userData.name}} {{userData.surname}}</div>
       <div >{{userData.sid}}</div>
      </div>
      <router-link to="/" v-if="checkAdmins">Main</router-link>
      <router-link to="/ta/userData" v-if="checkAdmins">User Data</router-link>
      <router-link to="/ta" v-if="checkAdmins">Add Time</router-link>
      <router-link to="/ta/addStudent" v-if="checkAdmins">Add Student</router-link>
      <router-link to="/ta/dashboard" v-if="checkAdmins">DashBoard</router-link>
      <router-link to="/queue" >Queue</router-link>
      <a @click="login()" v-if="!auth">Login</a>
      <a @click="logout()" v-else>Logout</a>
      <a @click="showDialog()" v-if="auth && !links">Link FITM</a>
    </div>
  </div>
</template>

<script>
import navMenu from './navMenu'
export default {
  props: ['login', 'logout', 'showDialog', 'checkAdmins', 'auth', 'links', 'userData'],
  data () {
    return {
      fullscreenLoading: true,
      online: this.$root.online
    }
  },
  watch: {
    online (val) {
      this.$set(this, 'fullscreenLoading', false)
    }
  },
  methods: {
    openNav () {
      document.getElementById('mySidenav').style.width = '280px'
    },
    closeNav () {
      document.getElementById('mySidenav').style.width = '0'
    }
  },
  components: {
    navMenu
  }
}
</script>

<style>
  /* The side navigation menu */
.sidenav {
    height: 100%; /* 100% Full-height */
    width: 0; /* 0 width - change this with JavaScript */
    position: fixed; /* Stay in place */
    z-index: 40; /* Stay on top */
    top: 0;
    left: 0;
    background-color: #111; /* Black*/
    overflow-x: hidden; /* Disable horizontal scroll */
    padding-top: 60px; /* Place content 60px from the top */
    transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
}

/* The navigation menu links */
.sidenav a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #818181;
    display: block;
    transition: 0.3s;
    cursor: pointer;
}

/* When you mouse over the navigation links, change their color */
.sidenav a:hover, .offcanvas a:focus{
    color: #f1f1f1;
}

/* Position and style the close button (top right corner) */
.sidenav .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */
#main {
    transition: margin-left .5s;
    padding: 20px;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
    .sidenav {padding-top: 15px;}
    .sidenav a {font-size: 18px;}
}
@media screen and (max-width: 480px) {
    .sidenav {padding-top: 15px;}
    .sidenav a {font-size: 18px;}
}
.display {
  display: flex;
  justify-content: center;
  margin: 10px;
}
.user-data {
  width: 100%;
  color: white;
  background-color: #333;
  text-align: center;
  transition: 0.3s;
  line-height: 23px;
  padding: 5px 0;
}
</style>
