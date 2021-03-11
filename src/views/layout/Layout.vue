<template>
	<div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
		<breadcard ></breadcard>
		<navbar :class="{hideSidebar:!sidebar.opened}"></navbar>
    <breadcrumb class="breadcrumb-container"></breadcrumb>

		<div class="main-container">
			<sidebar class="sidebar-container"></sidebar>
			<app-main></app-main>
		</div>
	</div>
</template>

<script>
  import {Navbar, Sidebar, AppMain, Breadcard} from './components'
  import Breadcrumb from '../../components/Breadcrumb'
  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Breadcard,
      Breadcrumb
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  
  .hideSidebar .tags-navbar{
    padding-left: 30px
  }
    .hideSidebar .navbar{
    padding-left: 45px
  }
</style>
