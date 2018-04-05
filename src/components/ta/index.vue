<template lang="html">
  <div class="">
    <transition name="slide-fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>

</template>

<script>
export default {
  data () {
    return {
      path: this.$route.path
    }
  },
  methods: {}
}
</script>

<style lang="css">
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  padding-left: 10px;
  opacity: 0;
}
</style>
