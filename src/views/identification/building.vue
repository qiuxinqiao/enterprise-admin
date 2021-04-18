/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 建构筑建
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-16 16:04:51
 */
<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="企业名称">
					<el-input v-model="listQuery.companyName" placeholder="请输入" clearable></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="listQuery.name" placeholder="请输入" clearable></el-input>
				</el-form-item>
                <el-button class="filter-item blue-btn" type="primary" icon="iconfont icon-sousuo" @click="(getList(true))">
					搜索
				</el-button>
			</el-form>
		</div>

	<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label="姓名" prop="name"></el-table-column>
			<el-table-column align="center" label="企业名称	" prop="companyName"></el-table-column>
			<el-table-column align="center" label="体温" prop="temperature"></el-table-column>
			<el-table-column align="center" label='上报源'>
				<template slot-scope="scope">
					<span v-if="scope.row.reportSource == '1'">门口</span>
					<span v-else>小程序</span>
				</template>
			</el-table-column>
            <el-table-column align="center" label='人员类型'>
				<template slot-scope="scope">
					<span v-if="scope.row.cameraStatus == '1'">访客</span>
					<span v-else>企业员工</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="告警时间" prop="alarmTime"></el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<el-dialog class="importTemDialog" title="导入设备设施模板" :visible.sync="importTemVisible" :close-on-click-modal="false" :close-on-press-escape="false" top="5%" width="1200px" lock-scroll>
			<!-- <method-draw></method-draw> -->
		</el-dialog>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { validate } from 'utils/validate';
	import { Message } from 'element-ui';
	import DatePicker from '../../components/DatePicker';//日期组件
	import Pagination from '../../components/Pagination';
	import methodDraw from '../../components/methodDraw'
	export default {
		components: {
			DatePicker, Pagination, methodDraw
		},
		data () {
			return {
				permBtn:{
	                alarm_find: false
				},
				height: 540,
                list:[], //表格list
                total: 0,
				listLoading: false,
				//列表查询参数
				listQuery: {
                    iDisplayLength: 10,
					iDisplayStart: 0,
					companyName: '',
					name: '',
				},
				importTemVisible: true
			}
		},
		mounted () {
			var vm = this;
			vm.getPerm();
			// vm.getList();
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

			//获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
                var vm = this;
                if (isBackHome) {
					if (this.listQuery.iDisplayStart != 0) {
						this.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listLoading = true;
				vm.listQuery.fromTime = "";
				vm.listQuery.toTime = "";
				const dateTime = vm.$refs.datePicker.datePicker;//父组件获取子组件数据this.$refs.第一个datePicker是父组件ref值，第二个是子组件model值
				if(dateTime){
					vm.listQuery.fromTime = dateTime[0] + " 00:00:00";
					vm.listQuery.toTime = dateTime[1] + " 23:59:59";
				}
		        vm.$instance.post("/proxy/alarm/temperature/findList", vm.listQuery).then(res =>{
					vm.listLoading = false;
		          	if(res.status == 200){
                        vm.list = res.data.data;
                        vm.total = res.data.contTotal;
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},
            
            /**
			 * 分页改变，加载数据
			 */
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
			
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>

