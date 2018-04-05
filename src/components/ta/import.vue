<template lang="html">
  <el-form ref="form" :model="form" label-width="120px" label-position="top">
    <el-form-item label="Import Area">
      <el-input type="textarea" autosize v-model="form.textarea"></el-input>
    </el-form-item>
  </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit(form)" :disabled="disabled || form.textarea === ''">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: ['students', 'onSubmit', 'disabled'],
  data () {
    return {
      form: {
        textarea: ''
      }
    }
  }
}
</script>

<style lang="css">
</style>
