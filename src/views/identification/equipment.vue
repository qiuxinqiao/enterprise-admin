/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 设备设施
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-16 16:29:58
 */
<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="title_box_gd">
			<div class="title">设备设施</div>
			<div class="right query">
				<el-form :inline="true" :model="listParam" class="demo-form-inline">
					<el-form-item>
						<el-input v-model="listParam.equipment_name" placeholder="设备名称或位号" clearable></el-input>
					</el-form-item>
					<el-dropdown split-button type="primary">
						查询
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item><span @click="isSeniorShow = true">高级查询</span></el-dropdown-item>
						</el-dropdown-menu>
						</el-dropdown>
					<el-button type="primary" @click="handleImportTem">导入模板</el-button>
					<el-button type="primary" @click="handleAdd">添加</el-button>
					<el-button type="danger">删除</el-button>
				</el-form>
			</div>
		</div>

		<!-- 高级搜索 -->
		<div v-show="isSeniorShow" class="senior-form">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-row>
					<el-col :span="24">
						<el-form-item label="设备名称">
							<el-input v-model="listQuery.companyName" placeholder="设备名称" clearable></el-input>
						</el-form-item>
						<el-form-item label="设备型号">
							<el-input v-model="listQuery.companyName" placeholder="设备型号" clearable></el-input>
						</el-form-item>
						<el-form-item label="设备类别">
							<el-select v-model="listQuery.status" clearable placeholder="请选择">
								<el-option label="泵" value="1"></el-option>
								<el-option label="车辆" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="使用部门">
							<el-select v-model="listQuery.status" clearable placeholder="请选择">
								<el-option label="甲醇分厂" value="1"></el-option>
								<el-option label="合成车间" value="2"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="设备状态">
							<el-select v-model="listQuery.status" clearable placeholder="请选择状态">
								<el-option label="正常" value="Y"></el-option>
								<el-option label="异常" value="N"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="检验周期(月)">
							<el-input v-model="listQuery.companyName" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="检维修周期(月)">
							<el-input v-model="listQuery.companyName" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-button type="primary" class="senior-btn">查询</el-button>
						<el-button>重置</el-button>
						<el-link type="primary" :underline="false" class="senior-up" @click="isSeniorShow = false">收起高级查询<i class="el-icon-arrow-up"></i></el-link>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column align="center" label="序号" prop="No" width="55"></el-table-column>
			<el-table-column align="center" label="名称" prop="equipment_name"></el-table-column>
			<el-table-column align="center" label="位号" prop="tag_number">
				<template slot-scope="scope">
					<span v-if="scope.row.equipment_type_info.equipment_type_name">{{scope.row.equipment_type_info.equipment_type_name}}</span>
					<span v-else>--</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="类别">
				<template slot-scope="scope">
					<span>{{scope.row.equipment_type_info.equipment_type_name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="部门">
				<template slot-scope="scope">
					<span v-if="scope.row.equipment_department_list.department_name">{{scope.row.equipment_department_list.department_name}}</span>
					<span v-else>--</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="状态">
				<template slot-scope="scope">
					<span v-if="scope.row.equipment_status_info.equipment_status_name">{{scope.row.equipment_status_info.equipment_status_name}}</span>
					<span v-else>--</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="120">
				<template slot-scope="scope">
					<el-button class="operation" type="text" size="small">编辑</el-button>
					<el-button class="operation" type="text" size="small" @click.native="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!-- 新增 -->
		<el-drawer title="新增设备" :visible.sync="addDrawerVisible" size="25%">
			<div class="form-box">
				<el-form ref="form" :model="sizeForm" label-width="120px" size="mini">
					<el-form-item label="设备名称">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="设备类别">
						<el-select v-model="sizeForm.region" placeholder="请选择设备类别">
							<el-option label="泵" value="1"></el-option>
							<el-option label="车辆" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="规格/型号">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="功率(Kw)">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="使用部门">
						<el-select v-model="sizeForm.region" placeholder="请选择使用部门">
							<el-option label="部门一" value="1"></el-option>
							<el-option label="部门二" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="位号">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="设备状态">
						<el-select v-model="sizeForm.name" clearable placeholder="请选择状态">
							<el-option label="正常" value="Y"></el-option>
							<el-option label="异常" value="N"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="危险有害因素">
						<el-button type="text" @click="handleAddFactor"><i class="el-icon-circle-plus-outline"></i>添加危险有害因素</el-button>
						<div class="factor-info">
							<div class="info-list">
								<el-checkbox>危险有害因素1</el-checkbox>
								<el-button type="text" class="fr">删除</el-button>
								<el-button type="text" class="fr">编辑</el-button>
							</div>
						</div>
					</el-form-item>
					<span class="form-title">采购信息</span>
					<el-form-item label="生产厂家">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="采购时间">
						<el-date-picker v-model="sizeForm.name" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-form-item label="检验时间">
						<el-date-picker v-model="sizeForm.name" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<span class="form-title">检验信息</span>
					<el-form-item label="检验周期(月)">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="提前提醒时间(月)">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="上次检验时间">
						<el-date-picker v-model="sizeForm.name" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-form-item label="检验负责人">
						<el-select v-model="sizeForm.name" clearable placeholder="请选择检验负责人">
							<el-option label="张三" value="Y"></el-option>
							<el-option label="王五" value="N"></el-option>
						</el-select>
					</el-form-item>
					<span class="form-title">检维修信息</span>
					<el-form-item label="检维修周期(月)">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="提前提醒时间(月)">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="上次检维修时间">
						<el-date-picker v-model="sizeForm.name" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
					</el-form-item>
					<el-form-item label="检验负责人">
						<el-select v-model="sizeForm.name" clearable placeholder="请选择检验负责人">
							<el-option label="张三" value="Y"></el-option>
							<el-option label="王五" value="N"></el-option>
						</el-select>
					</el-form-item>
					<el-drawer title="危险有害因素详情" :append-to-body="true" :visible.sync="innerDrawer">
						<div class="form-box">
							<p>操作不当</p>
							<el-form ref="dangerForm" :model="dangerForm" label-width="140px" size="mini">
								<el-form-item label="事故类型及后果">
									<el-select v-model="sizeForm.name" clearable placeholder="请选择">
										<el-option label="张三" value="Y"></el-option>
										<el-option label="王五" value="N"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="评估方法">
									<el-select v-model="sizeForm.name" clearable placeholder="请选择">
										<el-option label="张三" value="Y"></el-option>
										<el-option label="王五" value="N"></el-option>
									</el-select>
								</el-form-item>
								<span class="form-title">固有风险等级</span>
								<el-form-item label="事故发生的可能性L">
									<el-select v-model="sizeForm.name" clearable placeholder="请选择">
										<el-option label="张三" value="Y"></el-option>
										<el-option label="王五" value="N"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="事件后果严重性S">
									<el-select v-model="sizeForm.name" clearable placeholder="请选择">
										<el-option label="张三" value="Y"></el-option>
										<el-option label="王五" value="N"></el-option>
									</el-select>
								</el-form-item>
								<span class="tip">请根据事故类型及后果影响最大值，进行选择评估</span>
								<el-alert title="较大风险（R：15.00）" type="warning" :closable="false"></el-alert>
								<span class="form-title">现有风险等级</span>
								<el-form-item label="事故发生的可能性L">
									<el-select v-model="sizeForm.name" clearable placeholder="请选择">
										<el-option label="张三" value="Y"></el-option>
										<el-option label="王五" value="N"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="事件后果严重性S">
									<el-select v-model="sizeForm.name" clearable placeholder="请选择">
										<el-option label="张三" value="Y"></el-option>
										<el-option label="王五" value="N"></el-option>
									</el-select>
								</el-form-item>
								<span class="tip">请根据事故类型及后果影响最大值，进行选择评估</span>
								<el-alert title="较大风险（R：15.00）" type="error" :closable="false"></el-alert>
								<span class="form-title">管控措施</span>
								<el-form-item label="工程技术措施">
									<el-input type="textarea" v-model="sizeForm.name" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="管理措施">
									<el-input type="textarea" v-model="sizeForm.name" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="教育培训措施">
									<el-input type="textarea" v-model="sizeForm.name" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="个体防护措施">
									<el-input type="textarea" v-model="sizeForm.name" placeholder="请输入"></el-input>
								</el-form-item>
								<el-form-item label="应急措施">
									<el-input type="textarea" v-model="sizeForm.name" placeholder="请输入"></el-input>
								</el-form-item>
								<span class="form-title">责任岗位</span>
								<el-form-item label="应急措施">
									<el-select v-model="importTemParam.temIds" multiple placeholder="请选择">
										<el-option
											v-for="item in importTemList"
											:key="item.value"
											:label="item.label"
											:value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<div class="formButton">
									<el-button @click="innerDrawer = false">取 消</el-button>
									<el-button type="primary" @click.native.prevent="importTemSubmit()" class="btnColor">确 定</el-button>
								</div>
							</el-form>
						</div>
					</el-drawer>
					<div class="formButton">
						<el-button @click="importTemVisible = false">取 消</el-button>
						<el-button type="primary" @click.native.prevent="importTemSubmit()" class="btnColor">确 定</el-button>
					</div>
				</el-form>
			</div>
		</el-drawer>

		<!-- 导入模板 -->
		<el-dialog class="importTemDialog" title="导入设备设施模板" :visible.sync="importTemVisible" :close-on-click-modal="false" :close-on-press-escape="false" top="15%" width="600px" lock-scroll>
			<el-row>
				<label>设备设施：</label>
				<el-select v-model="importTemParam.temIds" multiple placeholder="请选择">
					<el-option
						v-for="item in importTemList"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
			</el-row>
			<div class="formButton">
				<el-button @click="importTemVisible = false">取 消</el-button>
				<el-button type="primary" @click.native.prevent="importTemSubmit()" class="btnColor">确 定</el-button>
			</div>
		</el-dialog>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { validate } from 'utils/validate';
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
				importTemVisible: false,
				addDrawerVisible: false,
				innerDrawer: false,
				userInfo: null,
				//列表查询参数
				listQuery: {},
				listParam: {
					pagination: {
						page : "1",
						count : "10"
					},
					equipment_type_id :"",
					equipment_name :""
				},
				importTemList: [{
					value: 1,
					label: '模板一'
				}, {
					value: 2,
					label: '模板二'
				}],
				importTemParam: {
					temIds: []
				},
				sizeForm: {
					name: ''
				},
				dangerForm: {

				},
				isSeniorShow: false
			}
		},
		beforeMount() {
			let vm = this;
			vm.userInfo = JSON.parse(vm.$store.getters.userInfo);
			vm.listQuery = {
				user_id: vm.userInfo.user_id,
				enterprise_id: vm.userInfo.enterprise_info.enterprise_id,
				token: vm.userInfo.token,
				device_type: 30
			}
		},
		mounted () {
			let vm = this;
			vm.getPerm();
			vm.getList();
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
                let vm = this;
                if (isBackHome) {
					if (this.listQuery.iDisplayStart != 0) {
						this.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listQuery.jsonText = JSON.stringify(vm.listParam);
				vm.listLoading = true;
		        vm.$instance.post("/proxy/Risk/Equipment/getEquipmentList", vm.listQuery).then(res =>{
					vm.listLoading = false;
		          	if(res.status == 200){
                        vm.list = res.data.data.equipment_list;
                        vm.total = parseInt(res.data.data.paginated.total);
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},

			//新增
			handleAdd() {
				this.addDrawerVisible = true;
			},

			//添加危险有害因素
			handleAddFactor() {
				this.innerDrawer = true;
			},

			//导入模板
			handleImportTem() {
				this.importTemVisible = true;
			},

			importTemSubmit() {

			},

			//删除
			handleDelete(index, row) {
				let vm = this;
				let param = {};
				param.accountId = row.accountId;
				this.$confirm('确定删除？', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					vm.$instance.post("/proxy/sysmgr/account/deleteAct", param).then(res =>{
						if(res.status == 200){
							if (res.data.success) {
								Message.success({message: '删除成功！'});
								vm.$refs.page.deleteItemReLoadList();
							} else {
								Message.error({message:res.data.errorMsg});
							}
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {});
				}).catch(() => {
					Message.info({message: '已取消删除'});          
				});
			},
            
            /**
			 * 分页改变，加载数据
			 */
			paginationChange(pageData) {
				this.listParam.pagination.count = pageData.iDisplayLength;
				this.listParam.pagination.page = pageData.iDisplayStart;
				this.getList();
			},
			
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	.senior-form {
		padding-left: 21px;
		.el-form--inline .el-form-item__label {
			width: 110px;
		}
		.el-input {
			width: 100%;
		}
		.senior-btn {
			margin-left:45px;
		}
		.senior-up {
			margin-left: 40px;
			color: #204FFE;
			&:hover {
				color: #204FFE;
			}
		}
	}
	
</style>

