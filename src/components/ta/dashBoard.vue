<template lang="html">
  <el-card>
    {{`TA1 วันที่ 14 ${TA11}`}}
    {{`TA1 วันที่ 15 ${TA12}`}}
    <commitChart :TA11="TA11" :TA12="TA12"></commitChart>
  </el-card>
</template>

<script>
import CommitChart from './newChart.js'
export default {
  components: {
    CommitChart
  },
  computed: {
    TA11 () {
      return this.$root.times[0]['.value'][0].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA1 path 1
    },
    TA12 () {
      return this.$root.times[0]['.value'][1].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA1 path 2
    },
    TA21 () {
      return this.$root.times[1]['.value'][0].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA2 path 1
    },
    TA22 () {
      return this.$root.times[1]['.value'][1].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA2 path 2
    },
    TA31 () {
      return this.$root.times[2]['.value'][0].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA3 path 1
    },
    TA32 () {
      return this.$root.times[2]['.value'][1].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA3 path 2
    },
    TA41 () {
      return this.$root.times[3]['.value'][0].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA4 path 1
    },
    TA42 () {
      return this.$root.times[3]['.value'][1].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA4 path 2
    },
    TA51 () {
      return this.$root.times[4]['.value'][0].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA5 path 1
    },
    TA52 () {
      return this.$root.times[4]['.value'][1].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA5 path 2
    },
    TA61 () {
      return this.$root.times[5]['.value'][0].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA6 path 1
    },
    TA62 () {
      return this.$root.times[5]['.value'][1].time.filter(item => item.std !== '' && item.status !== 'failed').length // TA6 path 2
    }
  },
  mounted () {
  }
}
</script>

<style lang="css">
</style>
