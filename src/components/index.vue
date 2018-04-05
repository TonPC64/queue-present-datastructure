<template lang="html">
  <div>
    <!--<span style="font-weight: bold;" v-if="userData && userData.fullTime" >เวลาที่จอง: <br>{{userData.fullTime}}</span>-->
    <h3 v-if="auth && !links">ยังไม่ได้เชื่อมต่อกับรหัสนักศึกษา จึงไม่สามารถจองได้ โปรดคลิ๊กที่ปุ่ม Link</h3>
    <div v-for="round in $root.rounds" v-if="round.show">
    <h3 class="flex center">{{round.presentName}}</h3>
      <el-tabs v-model="activeName" @tab-click="handleClick" >
        <el-tab-pane :label="'TA' + (index+1)" :name="'' + index" v-for="(time, index) in timeByKey(round.keyTime)">
          <booking v-if="+index === +activeName" :mobile-look-date="mobileLookDate" :set-look-date="setLookDate" :auth="auth" :links="links" :confirm="confirmBooking" :times="[time]" :admin="admin"></booking>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getKeyAdmin } from '../service/env'
import Login from './login'
import Booking from './booking'
export default {
  props: ['auth', 'links', 'userData'],
  data () {
    return {
      activeName: '0',
      mobileLookDate: 0
    }
  },
  methods: {
    setLookDate (indexDate) {
      this.$set(this, 'mobileLookDate', indexDate)
    },
    handleClick (tab, event) {},
    timeByKey (data) {
      let keyData = data
      return this.$root.times.filter(item => {
        return keyData.some(key => key === item['.key'])
      })
    }
  },
  computed: {
    confirmBooking () {
      if (this.userData && this.userData.confirmBooking) {
        return this.userData.confirmBooking
      }
      return false
    },
    admin () {
      if (getKeyAdmin().findIndex(item => item === this.userData.id) !== -1) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    Login,
    Booking
  }
}
</script>

<style lang="css" scoped>
  .month-and-year {
    background-color: #ffaa00;
    text-align: center;
    color: white;
    font-weight: bold;
    width: 73px;
    padding: 2px 5px 2px 5px;
    font-size: 15px;
    line-height: 19px;
    border-bottom: 3px solid #ff8800;
  }
  .date {
    background-color: #616161;
    padding-top: 5px;
    font-size: 28px;
    line-height: 35px;
    font-weight: bolder;
    text-align: center;
    color: white;
  }
  .date-of-week {
    background-color: #ff4949;
    text-align: center;
    color: white;
    font-size: 13px;
    padding-bottom: 3px;
    /*line-height: 18px;*/
    border-bottom: 3px solid #ff6060;
  }
  .frame-square {
    background: #fff;
    border: 1px solid #99a9bf;
    display: inline-block;
    vertical-align: top;
    padding: 1px;
    width: 50px;
    height: 50px;
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
  .container {
    display: flex;
  }
  .td {
    background-color: #d3dce6;
    text-align: center;
    border: 1px solid white;
    border-top: 2px  solid white;
    border-bottom: 3px  solid white;
    min-width: 90px;
    max-width: 90px;
    padding: 4px;
    min-height: 96px;
    box-sizing: border-box;
  }
  .disable {
    background: #99a9bf;
    border-top: 2px  solid white;
    border-bottom: 3px  solid white;
    min-width: 90px;
    padding: 0px;
  }
  .scroll-x {
    max-width: auto;
    overflow-x: scroll;
    scroll-behavior: smooth;
  }
  .day {
    padding: 0px;
    background: #99a9bf;
    border: 0;
    border-top: 2px  solid white;
    border-bottom: 3px  solid white;
    min-width: 80px;
    padding: 0px;
  }
  .booking {
    margin: 3px;
  }
  .setDate {
    padding-bottom: 10px;
    border-bottom: 1px solid #999;
  }
  .button-right {
    background-color: #63d863;
    min-width: 34px;
    box-sizing: border-box;
    margin: 2px 2px 18px 2px;
    color: white;
    font-weight: bold;
    font-size: 23px;
    text-align: center;
    height: auto;
    cursor: pointer;
    display: flex;
    justify-content: center;
  }
  .to-right {
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .button-right:hover {
    background-color: #a0e7a0;
  }

::-webkit-scrollbar-track {
    width: 7px;
}
::-webkit-scrollbar {
    width: 7px;
}
::-webkit-scrollbar-thumb {
    border-radius: 12px;
    border: 4px solid rgba(255,255,255,0);
    background-clip: content-box;
    background-color: rgba(177, 177, 177, 0);
}
:hover::-webkit-scrollbar-thumb {
    background-color: rgb(177, 177, 177);
}
</style>
