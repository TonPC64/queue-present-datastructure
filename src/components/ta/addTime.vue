<template lang="html">
  <div class="addTime">
    <el-card>
      <el-card v-for="round in rounds" >
        <el-row>
          <el-col :xs="24" :md="16" :lg="18">
            <el-tree v-if="round && !round.edit" :data="treeTime(round)" :props="defaultProps"></el-tree>
            <el-input v-else v-model="round.presentName"></el-input>
          </el-col>
          <el-col :xs="24" :md="8" :lg="6">
            <el-col :span="12">
              <div class="flex" v-if="round && !round.edit">
                <el-button type="primary" icon="edit" @click="editRound(round)"></el-button>
              </div>
              <div class="flex" v-else>
                <el-button type="success" icon="check" @click="confirmEdit(round)"></el-button>
                <el-button type="danger" icon="close" @click="cancelEdit(round)"></el-button>
              </div>
            </el-col>
            <el-col :span="12">
              <el-button type="danger" icon="delete" @click="deleteRound(round)"></el-button>
              <el-switch v-model="round.show"  on-text="Show" off-text="Hide" :width="65" @change="setShowRound(round)"></el-switch>
            </el-col>
          </el-col>
        </el-row>
      </el-card>
    </el-card>
    <el-card v-if="timeOutRound.length">
      <el-input v-model="presentName" size="large" placeholder="Present Name"></el-input>
      <el-checkbox style="margin: 10px 0;" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">Check all</el-checkbox>
      <el-checkbox-group v-model="checkedTimes" @change="handleCheckedTimesChange">
        <div class="flex left" v-for="time in timeOutRound" style="margin-left: 10px;">
          <el-checkbox :label="time['.key']">{{titleTime(time['.value'])}}</el-checkbox>
        </div>
      </el-checkbox-group>
      <div class="flex" style="margin-top: 10px;">
        <el-button icon="time" type="primary" :disabled="!checkedTimes.length || presentName.trim() === ''" @click="addToRound(checkedTimes, presentName)">Push</el-button>
        <el-button icon="time" type="danger" :disabled="!checkedTimes.length" @click="deleteTime(checkedTimes)">Delete</el-button>
      </div>
    </el-card>
    
    <el-card class="box-card">
      <div class="block">
        <div class="demonstration"><h3>เลือกช่วงวัน</h3></div>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          format="dd/MM/yyyy"
          placeholder="Pick a range"
          @change="arrayDate()">
        </el-date-picker>
      </div>
      <el-card class="block flex" v-for="(date, index) in dateTime">
        <div class="time-range">
          <div class="text-date">
            <i class="el-icon-date"></i> {{dateOfWeek(date.date)}}
          </div>
          <el-time-select 
          class="time-select"
            placeholder="Start time"
            v-model="date.startTime"
            :picker-options="{
              start: '09:00',
              step: '00:20',
              end: '20:00',
              maxTime: date.endTime
            }">
          </el-time-select>
          <el-time-select 
          class="time-select"
            placeholder="End time"
            v-model="date.endTime"
            :picker-options="{
              start: '09:00',
              step: '01:00',
              end: '20:00',
              minTime: date.startTime
            }">
          </el-time-select>
          <el-button type="danger" @click="deleteDate(index)" icon="delete"></el-button>
        </div>
      </el-card>
      <div></div>
      <el-checkbox v-model="checked">เวลาเดียวกันทั้ง 6 คน</el-checkbox>
      <el-button class="block" type="primary" :loading="uploading" :disabled="dateTime.length === 0" @click="uploadTime(dateTime)">Confirm</el-button>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      presentName: '',
      checkAll: false,
      checkedTimes: [],
      times: this.$root.times,
      isIndeterminate: false,
      dateTime: [],
      startTime: '',
      endTime: '',
      dateRange: [],
      uploading: false,
      checked: true,
      rounds: this.$root.rounds,
      preEdit: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    inRound () {
      let keyTime = this.rounds.map(item => item.keyTime)
      let data = keyTime.reduce((prev, curr) => prev.concat(curr), [])
      return data
    },
    timeOutRound () {
      let vm = this
      return this.times.filter(item => vm.checkRoundKey(item['.key']))
    }
  },
  methods: {
    deleteRound (round) {
      let vm = this
      let key = round['.key']
      let name = round.presentName
      vm.$confirm('แน่ใจที่ "' + name + '" จะลบใช่ไหม ?', `ลบ ${name} แน่นะ`, {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error'
      }).then(() => {
        vm.$root.$firebaseRefs.rounds.child(key).remove().then(() => {
          vm.$message({
            type: 'success',
            message: `delete "${name}" completed`
          })
        })
      })
    },
    editRound (round) {
      this.$set(this, 'preEdit', round.presentName)
      this.$set(round, 'edit', true)
    },
    cancelEdit (round) {
      this.$set(round, 'presentName', this.preEdit)
      this.$set(round, 'edit', false)
    },
    confirmEdit (round) {
      let vm = this
      let key = round['.key']
      vm.$root.$firebaseRefs.rounds.child(`${key}`).update({presentName: round.presentName}).then(() => {
        vm.$message({
          type: 'success',
          message: `edit "${round.presentName}" completed`
        })
        this.$set(round, 'edit', false)
      })
    },
    checkRoundKey (key) {
      return !this.inRound.some(item => item === key)
    },
    setShowRound (round) {
      let vm = this
      let key = round['.key']
      vm.$root.$firebaseRefs.rounds.child(`${key}`).update({show: round.show}).then(() => {
        if (round.show) {
          vm.$message({
            type: 'success',
            message: `Show "${round.presentName}" completed`
          })
        } else {
          vm.$message({
            type: 'success',
            message: `Hide "${round.presentName}" completed`
          })
        }
      })
    },
    addToRound (data, name) {
      let vm = this
      let preData = {
        presentName: name,
        keyTime: data,
        show: false
      }
      this.$root.$firebaseRefs.rounds.push(preData).then(() => {
        vm.$message({
          type: 'success',
          message: `Add ${preData.presentName} to Round completed`
        })
        this.$set(this, 'checkedTimes', [])
        this.$set(this, 'presentName', '')
        this.$set(this, 'isIndeterminate', false)
        this.$set(this, 'checkAll', false)
      })
    },
    deleteTime (data) {
      let vm = this
      vm.$confirm('แน่ใจที่จะลบใช่ไหม ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        var removeQueue = []
        data.forEach(item => {
          removeQueue.push(this.$root.$firebaseRefs.times.child(item).remove())
        })
        Promise.all(removeQueue).then(() => {
          this.$set(this, 'checkedTimes', [])
          this.$set(this, 'isIndeterminate', false)
          this.$set(this, 'checkAll', false)
          vm.$message({
            type: 'success',
            message: 'Delete completed'
          })
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    treeTime (data) {
      while (this.$root.times.length) {
        var vm = this
        var child = data.keyTime.map(key => {
          return {
            label: vm.titleTime(vm.valueTimeByKey(key))
          }
        })
        return [{
          label: data.presentName,
          children: child
        }]
      }
      // this.titleTime(this.valueTimeByKey(key))
    },
    valueTimeByKey (key) {
      while (this.$root.times.length) {
        return this.$root.times.filter(item => item['.key'] === key)[0]['.value']
      }
    },
    titleTime (value) {
      let data = value.map(item => {
        return {
          date: this.dateOfWeek(item.date),
          time: `${item.startTime} - ${item.endTime}`
        }
      })
      let title = data.map(item => `${item.date} เวลา ${item.time}`)
      return title
    },
    handleCheckAllChange (event) {
      this.checkedTimes = event.target.checked ? this.timeOutRound.map(item => item['.key']) : []
      this.isIndeterminate = false
    },
    handleCheckedTimesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.timeOutRound.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.timeOutRound.length
    },
    deleteDate (index) {
      let vm = this
      vm.$confirm('แน่ใจที่จะลบใช่ไหม ?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // if (vm.dateTime.length === 1) {
        //   vm.dateTime = []
        //   vm.dateRange = []
        //   console.log(vm.dateTime)
        // } else {
        //   vm.dateTime.splice(index, 1)
        // }
        vm.dateTime.splice(index, 1)
        vm.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        vm.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    uploadTime (data) {
      this.uploading = true
      data.forEach(item => {
        item.time = []
        let startTime = moment(item.date).set('h', item.startTime.split(':')[0]).set('m', item.startTime.split(':')[1])
        let endTime = moment(item.date).set('h', item.endTime.split(':')[0]).set('m', item.endTime.split(':')[1])
        while (startTime < endTime) {
          if (startTime.get('h') !== 12 && startTime.get('h') !== 16) {
            item.time.push({
              fullTime: 'วัน' + moment(startTime).format('dddd') + 'ที่ ' + moment(startTime).format('LLL'),
              time: moment(startTime).format('HH:mm'),
              std: ''
            })
          }
          startTime = startTime.add(20, 'm')
        }
      })
      if (this.checked) {
        Promise.all([
          this.$root.$firebaseRefs.times.push(data),
          this.$root.$firebaseRefs.times.push(data),
          this.$root.$firebaseRefs.times.push(data),
          this.$root.$firebaseRefs.times.push(data),
          this.$root.$firebaseRefs.times.push(data),
          this.$root.$firebaseRefs.times.push(data)
        ]).then(() => {
          let vm = this
          vm.$set(this, 'uploading', false)
          vm.$set(this, 'dateRange', [])
          vm.$confirm('เพิ่มเวลาเสร็จสิ้น', 'Success', {
            confirmButtonText: 'OK',
            showCancelButton: false,
            type: 'success'
          })
        })
      } else {
        this.$root.$firebaseRefs.times.push(data).then(() => {
          let vm = this
          vm.$set(this, 'uploading', false)
          vm.$set(this, 'dateRange', [])
          vm.$confirm('เพิ่มเวลาเสร็จสิ้น', 'Success', {
            confirmButtonText: 'OK',
            showCancelButton: false,
            type: 'success'
          })
        })
      }
    },
    addDate () {
      let lastDate = new Date(this.dateTime[this.dateTime.length - 1].date)
      // console.log(lastDate)
      let newDate = {
        date: moment(lastDate).add(1, 'day'),
        startTime: '',
        endTime: ''
      }
      this.dateTime.push(newDate)
      this.dateRange[1] = new Date(newDate.date)
    },
    dateOfWeek (date) {
      return moment(date).format('dddd - DD MMMM YYYY')
    },
    arrayDate () {
      let start = moment(this.dateRange[0])
      let end = moment(this.dateRange[1])
      // let diff = end.diff(start, 'day') + 1
      let array = []
      while (start <= end) {
        array.push({
          date: moment(start).format('L'),
          startTime: '09:00',
          endTime: '20:00'
        })
        start = start.add(1, 'day')
      }
      this.dateTime = array
    }
  }
}
</script scoped>

<style lang="css">
.box-card {
  text-align: center;
  margin: 0;
}
.text-date {
  text-align: left;
  font-weight: bold;
  margin-bottom: 5px;
}
.block {
  margin: 6px;
}
.time-range {
  width: fit-content;
}
.flex {
  display: flex;
  justify-content: center;
}
.left {
  justify-content: flex-start;
}
.time-select {
  margin: 5px;
}
.demonstration {
  margin-right: 5px;
  font-weight: 500;
}
</style>
