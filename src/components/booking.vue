<template lang="html">
  <div>
    <div id="desktop" class="mobile-container setDate" v-for="(time, indexSet) in times">
      <div id="date">
        <div class="container" v-for="(date, indexDate) in time['.value']">
          <div class="td day">
            <div class="month-and-year">
              {{monthAndYear(date.date)}}
            </div>
            <div class="date">
              {{viewDate(date.date)}}
            </div>
            <div class="date-of-week">
              {{dateOfWeek(date.date)}}
            </div>
          </div>
        </div>
      </div>
      <div id="time" class="scroll-x">
        <div class="container" v-for="(date, indexDate) in time['.value']">
          <div class="container">
            <div v-for="nameTime in label" class="td" :class="{'disable': showTimeMatch(nameTime, date.time) === 'disable'}" v-if="hideCol(nameTime, indexSet, indexDate) || (nameTime === '12:00' && date.startTime < '13:00') || (nameTime === '16:00' && date.endTime > '17:00')">
              <!--<div class="relative"><i class="el-icon-circle-close cancle"></i></div>-->
              <div v-if="showTimeMatch(nameTime, date.time) !== 'disable'" class="middle">
                {{showTimeMatch(nameTime, date.time).time}}
                <div class="frame-square" :class="{'failed': showTimeMatch(nameTime, date.time).status === 'failed'}"  v-if="showTimeMatch(nameTime, date.time).std !== ''">
                  <div class="crop">
                        <img @click="setFailed(showTimeMatch(nameTime, date.time))" :src="imageSrc(showTimeMatch(nameTime, date.time).std)"/>
                    </div>
                </div>
                <div v-else class="booking">
                  <div v-if="authPass">
                    <div v-if="confirm">
                      <el-button disabled>หมดสิทธิ์</el-button>
                    </div>
                    <div v-else>
                      <el-button type="success" :loading="bookIndex === idDateTimeBook(time['.key'], indexDate, showTimeMatch(nameTime, date.time))" :class="{'dis-button': waitBooking}"  @click="booking(time['.key'], indexDate, showTimeMatch(nameTime, date.time))"><span v-if="bookIndex !== idDateTimeBook(time['.key'], indexDate, showTimeMatch(nameTime, date.time))">จองเวลา</span></el-button>
                    </div>
                  </div>
                  <div v-else>
                    <el-button disabled>ว่าง</el-button>
                  </div>
                </div>
              </div>
              <div v-else-if="nameTime === '12:00'" class="lunch">
                12:00
                <img src="http://icons.iconarchive.com/icons/webalys/kameleon.pics/512/Food-Dome-icon.png" width="45px">
              </div>
              <div v-else-if="nameTime === '16:00'" class="lunch">
                16:00
                <img src="http://icons.iconarchive.com/icons/webalys/kameleon.pics/512/Food-Dome-icon.png" width="45px">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="scroll" class="button-right" @click="scrollLeft(indexSet, $event)">
        <i class="to-right el-icon-arrow-right"></i>
      </div>
    </div>
    <div id="mobile" class="setDate" v-for="(time, indexSet) in times">
      <div class="mobile-container scroll-x" :class="{'more4': time['.value'].length === 4}">
        <div class="container mobile-space" v-for="(date, indexDate) in time['.value']" @click="lookDate(indexDate)">
          <div class="td day date-button" :class="{'date-button-selected': indexDate === mobileLookDate}" @click="lookDate(indexDate)">
            <div class="month-and-year">
              {{monthAndYear(date.date)}}
            </div>
            <div class="date">
              {{viewDate(date.date)}}
            </div>
            <div class="date-of-week">
              {{dateOfWeek(date.date)}}
            </div>
          </div>
        </div>
      </div>
      <div id="time" class="scroll-y">
        <el-row v-for="(date, indexDate) in time['.value']" v-if="mobileLookDate === indexDate">
          <el-col :span="6" v-for="(hour, indexHour) in date.time">
            <div class="td ">
              <div class="middle">
                {{hour.time}}
                <div class="frame-square" :class="{'failed': hour.status === 'failed'}" v-if="hour.std !== ''">
                  <div class="crop">
                        <img @click="setFailed(hour)" :src="imageSrc(hour.std)"/>
                    </div>
                </div>
                <div v-else class="booking">
                  <div v-if="authPass">
                    <div v-if="confirm">
                      <el-button disabled size="small">หมดสิทธิ์</el-button>
                    </div>
                    <div v-else>
                      <el-button type="success" :loading="bookIndex === idDateTimeBook(time['.key'], indexDate, {index: indexHour})" :class="{'dis-button': waitBooking}" size="small"  @click="booking(time['.key'], indexDate, {index: indexHour})">
                        <span v-if="bookIndex !== idDateTimeBook(time['.key'], indexDate, {index: indexHour})">จองเวลา</span>
                      </el-button>
                    </div>
                  </div>
                  <div v-else>
                    <el-button disabled size="small">ว่าง</el-button>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
/* global localStorage */
import moment from 'moment'
export default {
  props: ['times', 'auth', 'links', 'confirm', 'admin', 'setLookDate', 'mobileLookDate'],
  data () {
    return {
      lastFullTime: '',
      bookIndex: '',
      label: '09:00,09:20,09:40,10:00,10:20,10:40,11:00,11:20,11:40,12:00,12:20,12:40,13:00,13:20,13:40,14:00,14:20,14:40,15:00,15:20,15:40,16:00,16:20,16:40,17:00,17:20,17:40,18:00,18:20,18:40,19:00,19:20,19:40'.split(',')
    }
  },
  methods: {
    setFailed (data) {
      let vm = this
      if (data && data.status) {
        vm.$message.error('กดไม่ผ่านแล้ว')
      } else if (!vm.confirm) {
        vm.$confirm('เวลาที่เลือกคือ ' + data.fullTime, 'ยืนยันการจองเวลา', {
          customClass: 'mobile-size',
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'success'
        }).then(() => {
          vm.$root.$firebaseRefs.users.orderByChild('id').equalTo('' + data.std).once('value', snap => {
            let key = Object.keys(snap.val())[0]
            vm.$root.$firebaseRefs.users.child(key).update({confirmBooking: true, fullTime: data.fullTime})
          })
        })
      } else if (vm.admin && vm.confirm) {
        vm.$root.$firebaseRefs.users.orderByChild('id').equalTo('' + data.std).once('value', snap => {
          let key = Object.keys(snap.val())[0]
          let snapval = snap.val()[key]
          vm.$confirm('ไม่ผ่าน ', 'ไม่ผ่าน', {
            customClass: 'mobile-size',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'error'
          }).then(() => {
            vm.$root.$firebaseRefs.times.child(snapval.bookingId).update({status: 'failed'})
            vm.$root.$firebaseRefs.users.child(key).update({confirmBooking: false, bookingId: null})
          })
        })
      }
      // this.$root.$firebaseRef
    },
    idDateTimeBook (keyTime, indexDate, data) {
      return `${keyTime}/${indexDate}/time/${data.index}`
    },
    lookDate (indexDate) {
      this.setLookDate(indexDate)
    },
    scrollLeft (indexSet, event) {
      if (event.target.className === 'to-right el-icon-arrow-right') {
        let scroll = event.target.parentElement.parentElement.children[1].scrollLeft
        event.target.parentElement.parentElement.children[1].scrollLeft = scroll + 90
      } else {
        let scroll = event.target.parentElement.children[1].scrollLeft
        event.target.parentElement.children[1].scrollLeft = scroll + 90
      }
    },
    hideCol (time, indexSet, indexDate) {
      let flagShowArray = this.showTime[indexSet]
      let data = []
      flagShowArray.forEach(item => {
        data.push(item.find(date => date.time === time))
      })
      let colShow = !data.map(temp => temp.show).every(showData => showData === false)
      return colShow
    },
    imageSrc (fid) {
      return `https://graph.facebook.com/${fid}/picture?width=50`
    },
    booking (keyTime, indexDate, data) {
      if (this.authPass) {
        this.bookingPass(keyTime, indexDate, data)
      } else {
        this.$message.error('Oops! ยังไม่ได้ Login เลยนะ ')
      }
    },
    setDataBooking (keyTime, indexDate, data, userData) {
      let vm = this
      vm.$root.$firebaseRefs.users.child(userData['.key']).update({'bookingId': `${keyTime}/${indexDate}/time/${data.index}`}).then(() => {
        vm.bookIndex = ''
        vm.$root.$firebaseRefs.times.child(`${keyTime}/${indexDate}/time/${data.index}`).once('value', snap => {
          vm.lastFullTime = snap.val().fullTime
          vm.$confirm('เวลาที่เลือกคือ ' + snap.val().fullTime, 'ยืนยันการจองเวลา', {
            customClass: 'mobile-size',
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'success'
          }).then(() => {
            vm.$root.$firebaseRefs.users.child(userData['.key']).update({confirmBooking: true, fullTime: snap.val().fullTime})
          })
        })
      })
    },
    bookingPass (keyTime, indexDate, data) {
      this.bookIndex = `${keyTime}/${indexDate}/time/${data.index}`
      let userData = JSON.parse(localStorage.userData)
      this.$root.$firebaseRefs.users.child(userData['.key']).once('value', snap => {
        let olderBookingId = snap.val().bookingId
        if (olderBookingId !== undefined && olderBookingId !== '') {
          this.$root.$firebaseRefs.times.child(olderBookingId).once('value', snap => {
            if (snap.val()) {
              this.$root.$firebaseRefs.times.child(olderBookingId).update({std: ''}).then(() => {
                this.$root.$firebaseRefs.times.child(`${keyTime}/${indexDate}/time/${data.index}`).update({std: userData.id}).then(() => {
                  this.setDataBooking(keyTime, indexDate, data, userData)
                })
              })
            } else {
              this.$root.$firebaseRefs.times.child(`${keyTime}/${indexDate}/time/${data.index}`).update({std: userData.id}).then(() => {
                this.setDataBooking(keyTime, indexDate, data, userData)
              })
            }
          })
        } else {
          this.$root.$firebaseRefs.times.child(`${keyTime}/${indexDate}/time/${data.index}`).update({std: userData.id}).then(() => {
            this.setDataBooking(keyTime, indexDate, data, userData)
          })
        }
      })
    },
    monthAndYear (date) {
      return moment(date).format('MMM YYYY')
    },
    viewDate (date) {
      return moment(date).format('D')
    },
    dateOfWeek (date) {
      return moment(date).format('dddd')
    },
    showTimeMatch (time, date) {
      let timeMatch = date.findIndex(item => time === item.time)
      if (timeMatch !== -1) {
        let data = {
          index: timeMatch
        }
        data = Object.assign(data, date[timeMatch])
        return data
      } else {
        return 'disable'
      }
    }
  },
  computed: {
    authPass () {
      return (this.auth && this.links)
    },
    waitBooking () {
      if (this.bookIndex !== '') {
        return true
      }
      return false
    },
    showTime () {
      let showTime = []
      this.times.map(item => item['.value']).forEach(item => {
        let date = item.map(dateData => dateData.time)
        let timeDate = []
        date.forEach(dateData => {
          let day = []
          this.label.forEach(label => {
            if (this.showTimeMatch(label, dateData) === 'disable') {
              day.push({
                time: label,
                show: false
              })
            } else {
              day.push({
                time: label,
                show: true
              })
            }
          })
          timeDate.push(day)
        })
        showTime.push(timeDate)
      })
      return showTime
    }
  }
}
</script>

<style lang="css" scoped>
  .month-and-year {
    background-color: #ffaa00;
    text-align: center;
    color: white;
    font-weight: bold;
    padding: 2px 5px 2px 5px;
    font-size: 15px;
    line-height: 19px;
    border-bottom: 3px solid #ff8800;
    box-sizing: border-box;
  }
  .date {
    background-color: #616161;
    padding: 5px 0;
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
  .mobile-container {
    display: flex;
  }
  .date-button {
    cursor: pointer;
    user-select: none;
    filter: brightness(0.5);
  }
  .date-button-selected, .date-button:hover {
    filter: brightness(1);
  }

  .td {
    background-color: #d3dce6;
    text-align: center;
    /*border: 1px solid rgba(255, 255, 255, 0);
    border-top: 2px  solid rgba(255, 255, 255, 0);
    border-bottom: 3px  solid rgba(255, 255, 255, 0);*/
    min-width: 90px;
    max-width: 90px;
    padding: 6px 0;
    margin: auto;
    margin-left: 1px;
    margin-right: 1px;
    margin-top: 2px;
    margin-bottom: 3px;
    min-height: 96px;
    box-sizing: border-box;
    display: flex;
  }
  .disable {
    background: #99a9bf;
    /*border-top: 2px  solid rgba(255, 255, 255, 0);
    border-bottom: 3px  solid rgba(255, 255, 255, 0);*/
    margin-top: 2px;
    margin-bottom: 3px;
    min-width: 90px;
    padding: 0px;
    display: flex;
    justify-content: center;
  }
  .scroll-x {
    max-width: auto;
    overflow-x: scroll;
    scroll-behavior: smooth;
  }
  .portrait {
    display: flex;
    flex-direction: row;
  }
  .day {
    padding: 0px;
    background: #99a9bf;
    border: 0;
    /*border-top: 2px  solid rgba(255, 255, 255, 0);
    border-bottom: 3px  solid rgba(255, 255, 255, 0);*/
    margin-top: 2px;
    margin-bottom: 3px;
    min-width: 90px;
    padding: 0px;
    box-sizing: border-box;
    display: block;
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
    margin: 2px 2px 2px 2px;
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
    user-select: none;
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
    background-color: rgba(177, 177, 177, 0.5);
}
:hover::-webkit-scrollbar-thumb {
    background-color: rgb(177, 177, 177);
}
.dis-button {
  pointer-events: none;
}
@media screen and (min-width: 480px) {
  #mobile {
    display: none;
  }
}
@media screen and (max-width: 480px) {
    #desktop {
      display: none;
    }
    .td, .day {
      min-width: 82px;
    }
    .month-and-year {
      font-size: 13px;
    }
    .mobile-space {
      margin: 1px 2px;
      padding: 0px;
    }
    .mobile-container {
      justify-content: left;
    }
    .more4 {
      justify-content: space-around;
    }

}
@media screen and (max-width: 320px) {
    #desktop {
      display: none;
    }
    .mobile-space {
      margin: 1px 1px;
      padding: 0px;
    }
    .td, .day {
      min-width: 74px;
      min-height: 84px;
    }
    .frame-square {
      width: 40px;
      height: 40px;
    }

}
.lunch {
  margin: auto;
  color: white;
  font-weight: bold;
}
.middle {
  margin: auto;
}
.failed {
  filter: brightness(0.3);
}
.cancle {
  position: absolute;
  top: 0;
  right: 0;
}
.relative {
  position: relative;
}
</style>
