<template lang="html">
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <el-form-item label="รหัสนักศึกษา">
      <el-input v-model="form.sid" @blur="findStudent(form.sid)"></el-input>
    </el-form-item>
    <el-form-item label="ชื่อ">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="นามสกุล">
      <el-input v-model="form.surname"></el-input>
    </el-form-item>
  </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(form)">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ['students', 'onSubmit', 'findStudent'],
  data () {
    return {
      form: {
        sid: '',
        name: '',
        surname: ''
      }
    }
  }
}
</script>

<style lang="css">
</style>
