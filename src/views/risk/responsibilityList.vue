/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 风险管控责任清单
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-26 14:39:54
 */
<template>
	<div class="app-container">
		<div class="title_box_gd">
			<div class="title">风险管控责任清单</div>
		</div>

		<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label="序号" prop="name" width="80"></el-table-column>
			<el-table-column align="center" label="风险点" prop="companyName"></el-table-column>
			<el-table-column align="center" label="评估对象" prop="temperature"></el-table-column>
			<el-table-column align="center" label='危险有害因素' prop="temperature"></el-table-column>
			<el-table-column align="center" label='固有风险等级'>
				<template slot-scope="scope">
					<span v-if="scope.row.cameraStatus == '1'">访客</span>
					<span v-else>企业员工</span>
				</template>
			</el-table-column>
            <el-table-column align="center" label='现有风险等级'>
				<template slot-scope="scope">
					<span v-if="scope.row.cameraStatus == '1'">访客</span>
					<span v-else>企业员工</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="管控层级" prop="alarmTime"></el-table-column>
			<el-table-column align="center" label="责任部门" prop="alarmTime"></el-table-column>
			<el-table-column align="center" label="岗位" prop="alarmTime"></el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { Message } from 'element-ui';
	import Pagination from '../../components/Pagination';
	export default {
		components: {
			Pagination
		},
		data () {
			return {
				permBtn:{
	                alarm_find: false
				},
				height: 540,
                list:[{
					
				}], //表格list
                total: 10,
				listLoading: false,
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

