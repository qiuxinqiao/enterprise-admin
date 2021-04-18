/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 组织机构
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-17 10:32:26
 */
<template>
	<div class="app-container parent-tem">
		<el-tabs v-model="activeName">
			<el-tab-pane label="组织机构" name="organization">
				<organization></organization>
			</el-tab-pane>
			<el-tab-pane label="部门列表" name="department">
				<department></department>
			</el-tab-pane>
            <el-tab-pane label="岗位列表" name="post">
				<post></post>
			</el-tab-pane>
            <el-tab-pane label="人员列表" name="personnel">
				<personnel></personnel>
			</el-tab-pane>
            <el-tab-pane label="角色列表" name="role">
				<role></role>
			</el-tab-pane>
		</el-tabs>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { Message } from 'element-ui';
	import Organization from './organization/organization';//组织机构
	import Department from './organization/department';//部门列表
	import Post from './organization/post';//岗位列表
	import Personnel from './organization/personnel';//人员列表
	import Role from './organization/role';//角色列表
	export default {
		components: {
			Organization, Department, Post, Personnel, Role
		},
		data () {
			return {
				permBtn:{

				},
				activeName: 'organization'
			}
		},
		mounted () {
			let vm = this;
			vm.getPerm();
			vm.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height;
				});
			})
		},
		methods: {
			//获取当前页面的权限
			getPerm(){
				this.permBtn = utils.permsButton(this);
			},
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	
</style>

