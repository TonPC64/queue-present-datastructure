<template>
  <el-card>
    <div class="time-queue">Queue Time : {{queue.time}}</div>
    <div class="clock">
      <h2>{{date}}</h2>
      <h1>{{time}}</h1>
    </div>
    <el-row class="row" v-for="round in $root.rounds" v-if="round.show">
      <h2 class="flex">{{round.presentName}}</h2>
      <el-col class="col" :xs="24" :md="12" :lg="8" v-for="(time, index) in timeInRound($root.times, round.keyTime)">
        <el-card class="queue-card" >
          <div class="flex head">TA{{index+1}}</div>
          <div v-if="findQueue(queue, time['.value']) && findQueue(queue, time['.value']).std">
            <div class="flex">
              <div class="frame-square" >
                <div class="crop">
                  <img :src="`https://graph.facebook.com/${findQueue(queue, time['.value']).std}/picture?width=100`">
                </div>
              </div>
            </div>
            <div class="flex name">
              {{findName(findQueue(queue, time['.value']).std)}}
            </div>
          </div>
          <div class="flex middle" v-else>
            
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--<el-button @click="testQueue()"></el-button>-->
  </el-card>
</template>

<script>
/* global responsiveVoice */
import moment from 'moment'
export default {
  data () {
    return {
      date: moment().format('D MMMM YYYY'),
      time: moment().format('H : mm : ss'),
      queue: {
        date: moment().format('YYYY/MM/DD'),
        time: ''
      }
    }
  },
  methods: {
    speak (text) {
      responsiveVoice.speak(text, 'Thai Female', {rate: 0.9})
    },
    timeInRound (time, keyTime) {
      return time.filter(item => keyTime.indexOf(item['.key']) !== -1)
    },
    findName (id) {
      let user = this.$root.users.find(item => '' + item.id === '' + id)
      return (user.name + ' ' + user.surname)
    },
    findQueue (queue, time) {
      let people = time.find(item => '' + item.date === '' + queue.date)
      if (people !== undefined) {
        let time = people.time.find(item => '' + item.time === '' + queue.time)
        if (time !== undefined) {
          return time
        }
      }
      return false
    },
    update () {
      this.date = moment().format('D MMMM YYYY')
      this.time = moment().format('HH : mm : ss')
      this.inRange(moment())
      let minute = +moment().format('mm')
      let sec = +moment().format('ss')
      if (!responsiveVoice.isPlaying()) {
        if ((minute === 10 || minute === 30 || minute === 50) && sec === 0) {
          this.speak('เหลือเวลาอีก 10 นาที')
        } else if ((minute === 15 || minute === 35 || minute === 55) && sec === 0) {
          this.speak('เหลือเวลาอีก 5 นาที')
        } else if ((minute === 19 || minute === 39 || minute === 59) && sec === 57) {
          this.speak('3 2 1')
        } else if ((minute === 20 || minute === 40 || minute === 0) && sec === 0) {
          this.speak('หมดเวลา')
        }
      }
    },
    inRange (time) {
      this.queue.date = time.format('YYYY/MM/DD')
      this.queue.time = time.minute((Math.floor(time.format('m') / 20) * 20)).format('HH:mm')
    },
    testQueue () {
      let vm = this
      let min = moment().hour(16).minute((Math.floor(moment().format('m') / 20) * 20))
      setInterval(() => {
        let m = min.add(20, 'm').format('HH:mm')
        vm.$set(vm.queue, 'time', m)
      }, 5000)
    }
  },
  mounted () {
    setInterval(this.update, 1000)
  }
}
</script>

<style lang="css" scoped>
.clock {
  color: #555;
  text-align: center;
  line-height: 15px;
  text-shadow: 0 0 2px #aaa;
}
  .row {
    margin-bottom: 20px;
  }
  .col {
    padding: 5px;
    border-radius: 4px;
  }
  .direction-row {
    flex-direction: row;
  }
  .head {
    margin: -20px -20px 10px -20px;
    background-color: #e1e1e1;
    padding: 5px;
    color: #555;
    font-weight: bolder;
    font-size: 1.2em;
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
  .name {
    margin-top: 10px;
    font-weight: bold;
    font-size: 24px;
  }
  .queue-card {
    min-height: 202px;
    max-height: 202px;
  }
  .middle {
    font-weight: bold;
    font-size: 40px;
    position: relative;
    margin: 45px;
  }
  .time-queue {
    position: absolute;
    font-size: 18px;
    font-weight: bold;
  }
@media screen and (max-width: 480px) {
  .time-queue {
    position: inherit;
  }
}
</style>
