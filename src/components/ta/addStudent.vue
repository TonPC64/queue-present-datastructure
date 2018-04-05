<template lang="html">
  <div class="">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="Add once" name="1">
        <add-student :students="students" :on-submit="onSubmit" :find-student="findStudent"><add-student>
      </el-collapse-item>
      <el-collapse-item title="Imprt with text" name="2">
        <import-data :students="students" :on-submit="submitImport" :disabled="percentage !== 0" :percentage="percentage"></import-data>
        <el-progress v-show="percentage !== 0" :percentage="percentage"></el-progress>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="เย้" v-model="dialogVisible" size="tiny">
      <span>{{dialogText}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import insertNewStudent from './insertNewStudent'
import importData from './import'
export default {
  components: {
    addStudent: insertNewStudent,
    importData
  },
  data () {
    return {
      students: this.$root.students,
      activeNames: ['1'],
      array: [],
      progress: 0,
      dialogVisible: false,
      dialogText: ''
    }
  },
  computed: {
    percentage () {
      return this.array.length !== 0 ? Math.round(this.progress * 100 / this.array.length) : 0
    }
  },
  methods: {
    findStudent (sid) {
      var vm = this
      var find = vm.students.find(item => item.sid === sid)
      console.log(find)
      if (find !== undefined) {
        vm.dialogText = 'Already Exist.'
        sid = ''
        vm.dialogVisible = true
      }
    },
    onSubmit (data) {
      let vm = this
      var find = vm.students.find(item => item.sid === data.sid)
      if (find === undefined) {
        this.$root.$firebaseRefs.students.push(data).then(res => {
          data.sid = ''
          data.name = ''
          data.surname = ''
          vm.dialogText = 'Complete.'
          vm.dialogVisible = true
        })
      } else {
        vm.dialogText = 'Already Exist.'
        data.sid = ''
        data.name = ''
        data.surname = ''
        vm.dialogVisible = true
      }
    },
    submitImport (data) {
      this.array = data.textarea.split('\n')
      this.array = this.array.map(item => item.split(','))
      this.array.forEach(item => {
        var data = {
          sid: item[0],
          name: item[1],
          surname: item[2]
        }
        var vm = this
        this.$root.$firebaseRefs.students.push(data).then(res => {
          vm.progress++
          if (vm.progress === vm.array.length) {
            setTimeout(() => {
              vm.progress = 0
            }, 1000)
          }
        })
      })
    }
  }
}
</script>

<style lang="css">
</style>
