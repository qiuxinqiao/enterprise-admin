/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 原辅料
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-19 11:21:57
 */
<template>
	<div class="app-container parent-tem">
		<el-tabs v-model="activeName">
			<el-tab-pane label="统计图" name="first">
				<chart></chart>
			</el-tab-pane>
			<el-tab-pane label="材料列表" name="second">
				<material></material>
			</el-tab-pane>
		</el-tabs>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { Message } from 'element-ui';
	import Chart from './access/chart';//统计图
	import Material from './access/material';//材料列表
	export default {
		components: {
			Chart, Material
		},
		data () {
			return {
				permBtn:{

				},
				activeName: 'first'
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
	.sel {
		padding: 10px 0 10px 20px;
		.el-form-item {
			margin-bottom: 0;
		}
	}
	.parent-tem {
		background: none;
	}
	.box {
        width: 100%;
        .el-row {
            margin: 0 !important;
        }
        .el-col {
            padding-left: 0 !important;
        }
        .col-right {
            padding-right: 0 !important;
        }
        .bg-purple, .workFactor {
            background: #fff;
            padding: 10px;
        }
        .workFactor {
            margin-top: 10px;
        }
        .chart-title {
            padding-left: 10px;
            border-left: 5px solid #204FFE;
        }
		.bottom-chart {
			margin-top: 10px;
		}
	}
    .echarts-bar {
        width: 100%;
        height: 260px;
    }
</style>

