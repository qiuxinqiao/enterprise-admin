/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 风险管控措施清单
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-27 16:42:44
 */
<template>
	<div class="app-container">
		<div class="title_box_gd">
			<div class="title">风险管控措施清单</div>
		</div>

	<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label="序号" prop="name" width="80"></el-table-column>
			<el-table-column align="center" label="风险点" prop="companyName"></el-table-column>
			<el-table-column align="center" label="评估对象" prop="temperature"></el-table-column>
			<el-table-column align="center" label='危险有害因素' prop="temperature"></el-table-column>
            <el-table-column align="center" label='现有风险等级'>
				<template slot-scope="scope">
					<span v-if="scope.row.cameraStatus == '1'">访客</span>
					<span v-else>企业员工</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="管控措施" prop="alarmTime"></el-table-column>
			<el-table-column align="center" label="操作" width="120">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="handleModify(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 详情 -->
		<el-drawer title="风险管控措施详情" :visible.sync="drawerVisible" size="25%">
			<div class="drawer-box">
				<el-form ref="form" :model="sizeForm" label-width="120px" size="mini" label-position="top">
					<div class="risk-name">风险点1.1.2</div>
					<el-form-item label="评估对象">
						<div class="disabled-con">路由器</div>
					</el-form-item>
					<el-form-item label="危险有害因素">
						<div class="disabled-con">因素1</div>
					</el-form-item>
					<el-form-item label="现有风险等级">
						<div class="disabled-con level">低风险（D：1.00）</div>
					</el-form-item>
					<span class="form-title">管控措施</span>
					<el-form-item>
						<ul class="rules">
							<li class="fl">工程技术措施</li>
							<li class="fr"><i class="el-icon-circle-plus-outline"></i>添加细则</li>
							<span class="clear"></span>
						</ul>
						<div class="con-box">
							<ul>
								<li><span>1.</span>请输入措施细则1</li>
								<li><span>2.</span>请输入措施细则2</li>
								<li><span>3.</span>请输入措施细则3</li>
							</ul>
						</div>
					</el-form-item>
					<el-form-item>
						<ul class="rules">
							<li class="fl">管理措施</li>
							<li class="fr"><i class="el-icon-circle-plus-outline"></i>添加细则</li>
							<span class="clear"></span>
						</ul>
						<div class="con-box">
							<ul>
								<li><span>1.</span>请输入措施细则1</li>
								<li><span>2.</span>请输入措施细则2</li>
								<li><span>3.</span>请输入措施细则3</li>
							</ul>
						</div>
					</el-form-item>
					<el-form-item>
						<ul class="rules">
							<li class="fl">教育培训措施</li>
							<li class="fr"><i class="el-icon-circle-plus-outline"></i>添加细则</li>
							<span class="clear"></span>
						</ul>
						<div class="con-box">
							<ul>
								<li><span>1.</span>请输入措施细则1</li>
								<li><span>2.</span>请输入措施细则2</li>
								<li><span>3.</span>请输入措施细则3</li>
							</ul>
						</div>
					</el-form-item>
					<el-form-item>
						<ul class="rules">
							<li class="fl">个体防护措施</li>
							<li class="fr"><i class="el-icon-circle-plus-outline"></i>添加细则</li>
							<span class="clear"></span>
						</ul>
						<div class="con-box">
							<ul>
								<li><span>1.</span>请输入措施细则1</li>
								<li><span>2.</span>请输入措施细则2</li>
								<li><span>3.</span>请输入措施细则3</li>
							</ul>
						</div>
					</el-form-item>
					<el-form-item>
						<ul class="rules">
							<li class="fl">应急措施</li>
							<li class="fr"><i class="el-icon-circle-plus-outline"></i>添加细则</li>
							<span class="clear"></span>
						</ul>
						<div class="con-box">
							<ul>
								<li><span>1.</span>请输入措施细则1</li>
								<li><span>2.</span>请输入措施细则2</li>
								<li><span>3.</span>请输入措施细则3</li>
							</ul>
						</div>
					</el-form-item>
					<div class="formButton">
						<el-button @click="drawerVisible = false">取 消</el-button>
						<el-button type="primary" @click.native.prevent="importTemSubmit()" class="btnColor">确 定</el-button>
					</div>
				</el-form>
			</div>
		</el-drawer>

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
                list:[], //表格list
                total: 10,
				listLoading: false,
				drawerVisible: false,
				sizeForm: {
					region: ''
				}
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

			// 编辑
			handleModify(row) {

			},

			importTemSubmit() {

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
	.drawer-box {
		padding: 0 20px 20px 20px;
		.risk-name {
			margin-bottom: 10px;
		}
		.disabled-con {
			width: 100%;
			height: 32px;
			line-height: 32px;
			padding: 0 10px;
			color: #78787A;
			background: #F4F5F9;
			border-radius: 4px;
		}
		.el-form-item--mini.el-form-item {
			margin-bottom: 10px;
		}
		.level {
			color: #3A8EFF;
			background: #EBF3FF;
		}
		.form-title {
			display: inline-block;
			font-size: 16px;
			border-left: 5px solid #204FFE;
			padding-left: 10px;
			margin-bottom: 10px;
		}
		.rules {
			display: block;
			margin-bottom: 5px;
			color: rgba(0, 0, 0, 0.65);
			.fr {
				color: #204FFE;
				cursor: pointer;
			}
		}
		.con-box {
			min-height: 113px;
			padding: 10px;
			background: #FFFFFF;
			border: 1px solid #D9D9D9;
			border-radius: 4px;
			color: #BCBCBC;
		}
	}
</style>

