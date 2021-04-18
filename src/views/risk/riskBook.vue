/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 风险防控手册
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-27 16:43:02
 */
<template>
	<div class="app-container">
		<el-tabs v-model="activeName">
			<el-tab-pane label="单位概况" name="unitProfile">
				<unit-profile></unit-profile>
			</el-tab-pane>
			<el-tab-pane label="风险统计信息" name="statistics">
				<statistics></statistics>
			</el-tab-pane>
			<el-tab-pane label="风险辨识清单" name="identificationList">
				<identification-list></identification-list>
			</el-tab-pane>
			<el-tab-pane label="风险管控责任清单" name="responsibilityList">
				<responsibility-list></responsibility-list>
			</el-tab-pane>
			<el-tab-pane label="风险管控措施清单" name="controlMeasures">
				<control-measures></control-measures>
			</el-tab-pane>
		</el-tabs>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { Message } from 'element-ui';
	import UnitProfile from './manual/unitProfile';//单位概况
	import Statistics from './manual/statistics';//风险统计信息
	import IdentificationList from './manual/identificationList';//风险辨识清单
	import ResponsibilityList from './manual/responsibilityList';//风险管控责任清单
	import ControlMeasures from './manual/controlMeasures';//风险管控措施清单
	export default {
		components: {
			UnitProfile, Statistics, IdentificationList, ResponsibilityList, ControlMeasures
		},
		data () {
			return {
				permBtn:{

				},
				activeName: 'unitProfile'
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
</style>

