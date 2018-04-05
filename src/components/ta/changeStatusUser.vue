<template>
  <el-card>
    <el-row>
      <el-col :span="24" class="flex">
        <el-button type="warning" icon="warning" size="large" @click="renewAllUser()">Renew All User</el-button>
      </el-col>
    </el-row>
    <div class="once-user flex between">
       <el-input v-model="std" placeholder="รหัสนักศึกษา"></el-input> <i class="el-icon-search icon"></i>
    </div>
     <el-row>
       <el-col class="once-user card-box" :lg="8" :md="12" :sm="12" :xs="24" v-for="user in usersFilter">
         <el-card>
           <div class="flex between once-user head ">
            <a class="fb" :href="`//facebook.com/${user.id}`">{{user.fbname}}</a>
           <div>
              <el-switch v-if="user.confirmBooking !== undefined"
                @change="changeConfirm(user, user.confirmBooking)"
                v-model="user.confirmBooking"
                on-color="#13ce66"
                off-color="#ff4949">
              </el-switch>
            </div>
           </div>
           <el-row>
              <el-col :span="12" class="flex">
                <div class="frame-square" >
                  <div class="crop">
                    <a :href="`//facebook.com/${user.id}`">
                      <img :src="`https://graph.facebook.com/${user.id}/picture?width=100`" :href="`//facebook.com/${user.id}`">
                    </a>
                  </div>
                </div>
              </el-col>
              <el-col :span="12" class="">
               <div>{{user.sid}}</div>
               <div>{{user.name}} {{user.surname}}</div>
               <div>{{user.fullTime}}</div>
              </el-col>
           </el-row>
         </el-card>
       </el-col>
     </el-row>
    <!--{{users}}-->
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      users: this.$root.users,
      std: '',
      test: false
    }
  },
  methods: {
    changeConfirm (user, flag) {
      this.$root.$firebaseRefs.users.child(user['.key']).update({confirmBooking: flag})
    },
    renewAllUser () {
      let vm = this
      vm.$confirm('แน่ใจที่เรื่มใหม่ใช่ไหม ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$root.$firebaseRefs.users.once('value', snap => {
          var updates = {}
          console.log(snap.val())
          Object.keys(snap.val()).forEach((key) => {
            updates[key] = snap.val()[key]
            if (updates[key]['confirmBooking']) {
              updates[key]['confirmBooking'] = false
            }
            if (updates[key]['bookingId']) {
              delete updates[key]['bookingId']
            }
            if (updates[key]['fullTime']) {
              delete updates[key]['fullTime']
            }
          })
          this.$root.$firebaseRefs.users.update(updates).then(() => {
            vm.$message({
              type: 'success',
              message: 'Renew completed'
            })
          })
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: 'Renew canceled'
        })
      })
    }
  },
  computed: {
    usersFilter () {
      let vm = this
      if (vm.std === '') {
        return vm.users
      } else {
        let re = new RegExp(vm.std, 'g')
        return this.users.filter(item => (re.test(item.sid) || re.test(item.name) || re.test(item.surname) || re.test(item.fbname)))
      }
    }
  }
}
</script>

<style scoped>
  .once-user {
    padding: 5px;
    box-sizing: border-box;
  }
  .frame-square {
    background: #fff;
    border: 1px solid #99a9bf;
    display: inline-block;
    vertical-align: top;
    padding: 1px;
    width: 100px;
    height: 100px;
  }
  .crop {
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .crop img {
    display: block;
    min-width: 100%;
    min-height: 100%;
    margin: auto;
    position: absolute;
    top: -100%;
    right: -100%;
    bottom: -100%;
    left: -100%;
  }
  .between {
    justify-content: space-between;
  }
  .icon {
    margin: 10px;
  }
  .fb {
    font-weight: bold;
    color: #fff;
    text-decoration: none;
    width: 80%;
    white-space: nowrap;
  }
  .head {
    padding: 8px;
    background-color: #3b5998;
    margin-top: -20px;
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: 10px;
  }
  .frame-square:hover {
    filter: brightness(1.2)
  }
  .fb:hover {
    color: #efefef;
  }
  @media screen and (max-width: 480px) {
    .once-user {
      padding: 2px;
    }
    .head {
      padding: 3px;
    }
  }
  .card-box {
    max-height: 184px;
  }
</style>
