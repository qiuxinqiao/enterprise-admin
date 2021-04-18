/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 岗位列表
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-17 15:22:08
 */
<template>
    <div v-bind:style="{height: height}" class="box">
		<div class="top-sel">
			<el-form :inline="true" :model="listParam" class="demo-form-inline">
				<el-form-item label="所属部门：">
					<el-select v-model="listParam.department_id" clearable filterable placeholder="请选择部门">
						<el-option
							v-for="item in allDeptList"
							:key="item.department_id"
							:label="item.department_name"
							:value="item.department_id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click="getList(true)">
					搜索
				</el-button>
				<el-button type="primary" @click="handleAdd">添加</el-button>
				<el-button type="primary" @click="handleAdd">导入</el-button>
				<el-button type="primary" @click="handleExport">导出</el-button>
				<el-button type="danger" @click="handleDelete">删除</el-button>
			</el-form>
		</div>
		
        <!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="tableHeight" border fit highlight-current-row v-loading="listLoading" 
			element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column align="center" label="岗位名称" prop="position_name" width="400"></el-table-column>
			<el-table-column align="center" label="所属部门">
				<template slot-scope="scope">
					{{scope.row.department_list | filterDept}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="创建时间" prop="add_time" width="220"></el-table-column>
			<el-table-column align="center" label="操作" width="120">
				<template slot-scope="scope">
					<el-button class="operation" type="text" size="small" @click='handleEdit(scope.row)'>编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!-- 新增弹窗 -->
		<el-dialog title="新增岗位" :visible.sync="addDialogFormVisible" top="10%" width="500px" lock-scroll :close-on-click-modal="false" 
			:close-on-press-escape="false" v-loading="addLoad" element-loading-text="拼命加载中">
			<el-form class="small-space dialog" :model="addParams" ref="addDialogForm" :rules="rules" label-position="left" label-width="100px">
				<el-row>
					<el-form-item label="岗位名称：" prop="position_name">
						<el-input v-model="addParams.position_name" :maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="所属部门：" prop="department_id_list">
						<el-select v-model="addParams.department_id_list" multiple filterable placeholder="请选择所属部门">
							<el-option
								v-for="item in allDeptList"
								:key="item.department_id"
								:label="item.department_name"
								:value="item.department_id"
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
		<el-dialog title="修改岗位" :visible.sync="editDialogFormVisible" top="10%" width="500px" lock-scroll :close-on-click-modal="false" :close-on-press-escape="false" v-loading="addLoad" element-loading-text="拼命加载中">
			<el-form class="small-space dialog" :model="addParams" ref="editDialogForm" :rules="rules" label-position="left" label-width="100px">
				<el-row>
					<el-form-item label="部门名称：" prop="position_name">
						<el-input v-model="addParams.position_name" :maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="所属部门：" prop="department_id_list">
						<el-select v-model="addParams.department_id_list" multiple filterable placeholder="请选择所属部门">
							<el-option
								v-for="item in allDeptList"
								:key="item.department_id"
								:label="item.department_name"
								:value="item.department_id"
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
				userInfo: null,
				listQuery: {},
				listParam: {
					pagination: {
						page : "1",
						count : "10"
					},
					department_id: ''
				},
				addDialogFormVisible: false,
				editDialogFormVisible: false,
				addLoad: false,
				allDeptList: [],
				addParams: {
					position_id: 0,
					position_name: '',
					department_id_list: []
				},
				deleteParam: {
					position_id_list: []
				},
				rules: {
					position_name: [{
						required: true, message: '请输入岗位名称', trigger: 'blur'
					}],
					department_id_list: [{
						required: true, message: '请选择所属部门', trigger: 'change'
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
			};
			vm.allDeptList = vm.$store.getters.deptList;
		},
		filters: {
			filterDept(deptList) {
				let arr = [];
				deptList.forEach(item => {
					arr.push(item.department_name);
				});
				return arr.toString();
			}
		},
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
				this.tableHeight = height - 45 + 'px';
			});
		},
        methods: {
            //获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
                let vm = this;
                if (isBackHome) {
					vm.listParam.pagination.page = 1;
					if (vm.listParam.department_id == '') {
						Message({
							showClose: true,
							message: '请选择要查询的部门',
							type: 'warning',
							duration: 1500
						});
						return;
					}
				}
				let param = vm.listQuery;
				param.jsonText = JSON.stringify(vm.listParam);
				vm.listLoading = true;
		        vm.$instance.post("/proxy/enterprise/position/getPositionList", param).then(res =>{
					vm.listLoading = false;
		          	if(res.status == 200){
                        vm.list = res.data.data.position_list;
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
				this.resetForm("addDialogForm");
				this.addParams = {
					position_id: 0,
					position_name: '',
					department_id_list: []
				};
				this.addDialogFormVisible = true;
			},

			handleCreateSubmit(formName) {
				let vm = this;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						let param = JSON.parse(JSON.stringify(vm.listQuery));
						param.jsonText = JSON.stringify(vm.addParams);
						vm.updateSubmit(param, 'add');
					}
				});
			},

			//修改
			handleEdit(row) {
				let arr = [];
				row.department_list.forEach(item => {
					arr.push(item.department_id);
				});
				this.addParams = {
					position_id: row.position_id,
					position_name: row.position_name,
					department_id_list: arr
				}
				this.editDialogFormVisible = true;
			},

			handleEditSubmit(formName) {
				let vm = this;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						let param = JSON.parse(JSON.stringify(vm.listQuery));
						param.jsonText = JSON.stringify(vm.addParams);
						vm.updateSubmit(param, 'edit');
					}
				});
			},

			updateSubmit(param, type) {
				let vm = this;
				vm.addLoad = true;
				vm.$instance.post("/proxy/enterprise/position/savePositionInfo", param).then(res =>{
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

			//选择要删除的岗位
			handleSelectionChange(val) {
				let arr = [];
				val.forEach(item => {
					arr.push(item.position_id);
				});
				this.deleteParam.position_id_list = arr;
			},

			handleDelete() {
				let vm = this;
				if(vm.deleteParam.position_id_list.length == 0) {
					Message({
						showClose: true,
						message: '请选择要删除的岗位',
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
						vm.$instance.post("/proxy/enterprise/position/delPositionInfo", param).then(res =>{
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

			//导出
			handleExport() {
				let vm = this;
				let param = JSON.parse(JSON.stringify(vm.listQuery));
					param.jsonText = '';
				// utils.exportLists(param, '/proxy/enterprise/position/exportPositionExcel');
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