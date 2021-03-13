<!--
 * @Author: qiaozp
 * @LastEditors: Please set LastEditors
 * @Description: 面包屑
 * @Date: 2019-04-19 09:41:15
 * @LastEditTime: 2020-03-17 14:05:37
 -->
<template>
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
				<span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
				<router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>

export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      this.levelList = matched
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 13px;
    line-height: 40px;
    margin-left: 215px;
    outline: none;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
