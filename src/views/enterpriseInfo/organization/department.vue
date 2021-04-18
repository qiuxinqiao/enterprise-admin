/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 部门列表
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-17 14:26:50
 */
<template>
    <div v-bind:style="{height: height}" class="box">
		<div class="top-sel">
			<el-button type="primary" @click="handleAddDept">添加</el-button>
			<el-button type="danger" @click="handleDelete">删除</el-button>
		</div>
		
        <!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="tableHeight" border fit highlight-current-row v-loading="listLoading"
			 element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column align="center" label="部门名称" prop="department_name"></el-table-column>
			<el-table-column align="center" label="上级部门" prop="department_parent_name"></el-table-column>
			<el-table-column align="center" label="管控层级" prop="control_level_info.control_level_name"></el-table-column>
			<el-table-column align="center" label="创建时间" prop="add_time"></el-table-column>
			<el-table-column align="center" label="操作" width="120">
				<template slot-scope="scope">
					<el-button class="operation" type="text" size="small" @click='handleEdit(scope.row)'>编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!-- 新增弹窗 -->
		<el-dialog title="新增部门" :visible.sync="addDialogFormVisible" top="10%" width="500px" lock-scroll :close-on-click-modal="false" :close-on-press-escape="false" v-loading="addLoad" element-loading-text="拼命加载中">
			<el-form class="small-space dialog" :model="addParams" ref="addDialogForm" :rules="rules" label-position="left" label-width="100px">
				<el-row>
					<el-form-item label="部门名称：" prop="department_name">
						<el-input v-model="addParams.department_name" :maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="上级部门：" prop="department_parent_id">
						<el-select v-model="addParams.department_parent_id" placeholder="请选择上级部门">
							<el-option
								v-for="item in allDeptList"
								:key="item.department_id"
								:label="item.department_name"
								:value="item.department_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="管控层级：" prop="control_level_id">
						<el-select v-model="addParams.control_level_id" placeholder="请选择管控层级">
							<el-option
								v-for="item in controlLevelList"
								:key="item.control_level_id"
								:label="item.control_level_name"
								:value="item.control_level_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="addDialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 修改弹窗 -->
		<el-dialog title="修改部门" :visible.sync="editDialogFormVisible" top="10%" width="500px" lock-scroll :close-on-click-modal="false" :close-on-press-escape="false" v-loading="addLoad" element-loading-text="拼命加载中">
			<el-form class="small-space dialog" :model="addParams" ref="editDialogForm" :rules="rules" label-position="left" label-width="100px">
				<el-row>
					<el-form-item label="部门名称：" prop="department_name">
						<el-input v-model="addParams.department_name" :maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="上级部门：" prop="department_parent_id">
						<el-select v-model="addParams.department_parent_id" placeholder="请选择上级部门">
							<el-option
								v-for="item in allDeptList"
								:key="item.department_id"
								:label="item.department_name"
								:value="item.department_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="管控层级：" prop="control_level_id">
						<el-select v-model="addParams.control_level_id" placeholder="请选择管控层级">
							<el-option
								v-for="item in controlLevelList"
								:key="item.control_level_id"
								:label="item.control_level_name"
								:value="item.control_level_id"
							>
							</el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="editDialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleEditSubmit('editDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
    </div>
</template>
<script>
    import { utils } from 'src/utils';
	import { Message } from 'element-ui';
	import { validate } from 'utils/validate';
    import Pagination from '../../../components/Pagination';
    export default {
        components: {
			Pagination
		},
        data() {
            return {
                height: 500,
                tableHeight: 500,
                list:[], //表格list
                total: 10,
				listLoading: false,
				addLoad: false,
				userInfo: null,
				addDialogFormVisible: false,
				editDialogFormVisible: false,
				listQuery: {},
				controlLevelList: [],
				listParam: {
					pagination: {
						page : "1",
						count : "10"
					}
				},
				allDeptList: [],
				addParams: {
					department_id: 0,
					department_name: '',
					department_parent_id: '',
					control_level_id: ''
				},
				deleteParam: {
					department_id_list: []
				},
				rules: {
					department_name: [{
						required: true, message: '请输入部门名称', trigger: 'blur'
					}],
					department_parent_id: [{
						required: true, message: '请选择上级部门', trigger: 'change'
					}],
					control_level_id: [{
						required: true, message: '请选择管控层级', trigger: 'change'
					}]
				}
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
			vm.allDeptList = vm.$store.getters.deptList;
		},
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
				this.tableHeight = height - 45 + 'px';
			});
			vm.getList();
			vm.getControlLevelList();
		},
        methods: {
			//获取公司所属管控层级
			getControlLevelList() {
				let vm = this;
				let param = JSON.parse(JSON.stringify(vm.listQuery));
				param.jsonText = '';
				vm.$instance.post("/proxy/Enterprise/Enterprise/getEnterpriseControlLevelList", param).then(res => {
					if (res.data.status == '1') {
						vm.controlLevelList = res.data.data.enterprise_control_level_list;
					} else {
						Message.error({ message: "调用接口失败" });
					}
				}).catch(error => {
					vm.listLoading = false;
				});
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
				let param = vm.listQuery;
				param.jsonText = JSON.stringify(vm.listParam);
				vm.listLoading = true;
		        vm.$instance.post("/proxy/enterprise/department/getDepartmentList", param).then(res =>{
					vm.listLoading = false;
		          	if(res.status == 200){
                        vm.list = res.data.data.department_list;
                        vm.total = parseInt(res.data.data.paginated.total);
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},

			//新增
			handleAddDept() {
				this.resetForm("addDialogForm");
				this.addParams = {
					department_id: 0,
					department_name: '',
					department_parent_id: '',
					control_level_id: ''
				};
				this.addDialogFormVisible = true;
			},

			handleCreateSubmit(formName) {
				let vm = this;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						let param = JSON.parse(JSON.stringify(vm.listQuery));
						param.jsonText = JSON.stringify(vm.addParams);
						vm.createSubmit(param, 'add');
					}
				});
			},

			//修改
			handleEdit(row) {
				this.addParams = {
					department_id: row.department_id,
					department_name: row.department_name,
					department_parent_id: row.department_parent_id,
					control_level_id: row.control_level_info.control_level_id
				}
				this.editDialogFormVisible = true;
			},

			handleEditSubmit(formName) {
				let vm = this;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						let param = JSON.parse(JSON.stringify(vm.listQuery));
						param.jsonText = JSON.stringify(vm.addParams);
						vm.createSubmit(param, 'edit');
					}
				});
			},

			createSubmit(param, type) {
				let vm = this;
				vm.addLoad = true;
				vm.$instance.post("/proxy/enterprise/department/saveDepartmentInfo", param).then(res =>{
					vm.addLoad = false;
					if(res.status == 200){
						let msg = '';
						if (type == 'add') {
							vm.addDialogFormVisible = false;
						} else {
							vm.editDialogFormVisible = false;
						}
						if (res.data.status == 1) {
							if (type == 'add') {
								vm.$refs.addDialogForm.resetFields();
								msg = '新增成功';
							} else {
								vm.$refs.editDialogForm.resetFields();
								msg = '修改成功';
							}
							Message({
								showClose: true,
								message: msg,
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message: res.data.msg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.addLoad = false;
				});	
			},

			//选择要删除的部门
			handleSelectionChange(val) {
				let arr = [];
				val.forEach(item => {
					arr.push(item.department_id);
				});
				this.deleteParam.department_id_list = arr;
			},

			handleDelete() {
				let vm = this;
				if(vm.deleteParam.department_id_list.length == 0) {
					Message({
						showClose: true,
						message: '请选择要删除的部门',
						type: 'warning',
						duration: 1500
					});
					return;
				} else {
					let param = JSON.parse(JSON.stringify(vm.listQuery));
					param.jsonText = JSON.stringify(vm.deleteParam);
					this.$confirm('是否确定删除！', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//调用接口
						vm.$instance.post("/proxy/enterprise/department/delDepartmentInfo", param).then(res =>{
							if(res.data.status == 1){
								Message.success({message: '删除成功！'});
								vm.$refs.page.deleteItemReLoadList();
							}else{
								Message.error({message: res.data.msg});
							}
						}).catch(error => {});
					}).catch(() => {
						Message.info({message: '已取消删除'});          
					});
				}
			},

            //分页改变，加载数据
			paginationChange(pageData) {
				this.listParam.pagination.count = pageData.iDisplayLength;
				this.listParam.pagination.page = pageData.iDisplayStart;
				this.getList();
			},

			resetForm(formName) {
        		if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			}
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>