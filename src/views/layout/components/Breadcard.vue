<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <!-- <breadcrumb class="breadcrumb-container"></breadcrumb> -->
    <img src="../../../assets/img/logo_title.png">
  </el-menu> 
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
  components: {
    Hamburger,
    Breadcrumb,
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 80px;
  line-height: 80px;
  border-radius: 0px !important;
  padding-left: 210px;
  display: inline-block;
  width: 100%;
  .breadcrumb-container{
    float: left;
  }
  .hamburger-container {
    line-height: 80px;
    height: 80px;
    float: left;
    padding: 0 10px;
    outline: none
  }
}
.el-menu--horizontal{
  border:none !important;
}
</style>
