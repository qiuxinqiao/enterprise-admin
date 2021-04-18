/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 人员列表
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-17 16:48:31
 */
<template>
    <div v-bind:style="{height: height}" class="box">
		<div class="top-sel">
			<el-button type="primary" @click="handleAdd">添加</el-button>
			<el-button type="primary" @click="handleAdd">导入</el-button>
			<el-button type="primary" @click="handleAdd">导出</el-button>
			<el-button type="danger" @click="handleDelete">删除</el-button>
		</div>

        <!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="tableHeight" border fit highlight-current-row v-loading="listLoading" 
		element-loading-text="拼命加载中" @selection-change="handleSelectionChange">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column align="center" label="序号" prop="No" width="80"></el-table-column>
			<el-table-column align="center" label="用户名称" prop="user_name" width="150"></el-table-column>
			<el-table-column align="center" label="用户电话" prop="user_phone" width="150"></el-table-column>
			<el-table-column align="center" label="岗位名称" prop="position_info.position_name" width="150"></el-table-column>
			<el-table-column align="center" label="部门名称" prop="department_info.department_name"></el-table-column>
			<el-table-column align="center" label="部门主要负责人" width="150">
				<template slot-scope="scope">
					<span v-if="scope.row.is_department_head == 1">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="安全生产委员会成员" width="150">
				<template slot-scope="scope">
					<span v-if="scope.row.is_safety_production == 1">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="安全管理员" width="150">
				<template slot-scope="scope">
					<span v-if="scope.row.is_safety_admin == 1">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="特殊作业员" width="150">
				<template slot-scope="scope">
					<span v-if="scope.row.is_special_operator == 1">是</span>
					<span v-else>否</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="120">
				<template slot-scope="scope">
					<el-button class="operation" type="text" size="small">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!-- 新增弹窗 -->
		<el-dialog title="新增岗位" :visible.sync="addDialogFormVisible" top="2%" width="800px" lock-scroll :close-on-click-modal="false" 
			:close-on-press-escape="false" v-loading="addLoad" element-loading-text="拼命加载中">
			<el-form class="small-space dialog personnel-form" :model="addParams" ref="addDialogForm" :rules="rules" label-position="top" label-width="100px">
				<el-row :gutter="30">
					<el-col :span="12">
						<el-form-item label="所属部门：" prop="department_id">
							<el-select v-model="addParams.department_id" filterable placeholder="请选择所属部门">
								<el-option
									v-for="item in allDeptList"
									:key="item.department_id"
									:label="item.department_name"
									:value="item.department_id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="工号：" prop="job_number">
							<el-input v-model="addParams.job_number" clearable :maxlength="50" placeholder="请输入工号"></el-input>
						</el-form-item>
						<el-form-item label="角色：" prop="role_id">
							<el-select v-model="addParams.role_id" filterable clearable placeholder="请选择角色">
								<el-option
									v-for="item in roleList"
									:key="item.role_id"
									:label="item.role_name"
									:value="item.role_id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否为安全生产委员会成员" prop="is_safety_production">
							<el-select v-model="addParams.is_safety_production" placeholder="请选择">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="密码：" prop="password">
							<el-input type="password" :maxlength="20" v-model="addParams.password" clearable placeholder="请输入密码"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" prop="email">
							<el-input v-model="addParams.email" :maxlength="50" clearable placeholder="请输入邮箱"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否为该部门主要负责人：" prop="is_department_head">
							<el-select v-model="addParams.is_department_head" placeholder="请选择">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="姓名：" prop="user_name">
							<el-input v-model="addParams.user_name" clearable :maxlength="50" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<el-form-item label="职位/岗位：" prop="position_id">
							<el-select v-model="addParams.position_id" filterable clearable placeholder="请选择职位/岗位">
								<el-option
									v-for="item in positionList"
									:key="item.position_id"
									:label="item.position_name"
									:value="item.position_id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="手机号：" prop="user_phone">
							<el-input v-model="addParams.user_phone" clearable placeholder="请输入手机号"></el-input>
						</el-form-item>
						<el-form-item label="确认密码：" prop="confirm_password">
							<el-input type="password" :maxlength="20" v-model="addParams.confirm_password" clearable placeholder="重复密码"></el-input>
						</el-form-item>
						<el-form-item label="座机电话：" prop="tel">
							<el-input v-model="addParams.tel" clearable placeholder="请输入座机电话"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<p class="form-title">用户角色</p>
				<el-row :gutter="30">
					<el-col :span="12">
						<el-form-item label="是否为安全管理员：" prop="is_safety_admin">
							<el-select v-model="addParams.is_safety_admin" placeholder="请选择">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否为特殊许可作业员：" prop="is_special_operator">
							<el-select v-model="addParams.is_special_operator" placeholder="请选择">
								<el-option label="是" value="1"></el-option>
								<el-option label="否" value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<p class="form-title">人员证书管理</p>
				<el-row :gutter="30">
					<el-col :span="12">
						<el-form-item label="证件类型：" prop="certificate_type_id">
							<el-select v-model="addParams.certificate_type_id" placeholder="请选择证件类型">
								<el-option
									v-for="item in certificateList"
									:key="item.certificate_type_id"
									:label="item.certificate_type_name"
									:value="item.certificate_type_id"
								>
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="取证时间：" prop="certificate_get_time">
							<el-date-picker v-model="addParams.certificate_get_time" type="date" value-format="yyyy-MM-dd" placeholder="请选择取证时间"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="证件号码：" prop="certificate_number">
							<el-input v-model="addParams.certificate_number" clearable :maxlength="50" placeholder="请输入证件号码"></el-input>
						</el-form-item>
						<el-form-item label="证件有效期（年）：" prop="certificate_period">
							<el-input v-model="addParams.certificate_period" clearable :maxlength="50" placeholder="请输入证件有效期"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="addDialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
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
			const vm = this;
			const validatePassAdd = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (vm.addParams.confirm_password !== '') {
						vm.$refs.addDialogForm.validateField('confirm_password');
					}
					callback();
				}
    	    };
			const validatePass2Add = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== vm.addParams.password) {
					callback(new Error('两次输入密码不一致'));
				} else {
					callback();
				}
			};
            return {
                height: 500,
                tableHeight: 500,
                list:[], //表格list
                total: 10,
				listLoading: false,
				addLoad: false,
				userInfo: null,
				listQuery: {},
				uesrListParam: {
					pagination: {
						page : "1",
						count : "10"
					}
				},
				allDeptList: [],
				positionList: [],
				roleList: [],
				certificateList: [],
				addDialogFormVisible: false,
				editDialogFormVisible: false,
				addParams: {
					user_id : "0",
					user_name : "",
					job_number : "",
					password : "",
					confirm_password : "",
					email: "",
					user_phone: "",
					tel: "",
					is_department_head : "1",
					is_safety_admin : "1",
					is_safety_production : "1",
					is_special_operator : "1",
					certificate_number : "",
					certificate_get_time : "",
					certificate_period : "",
					department_id : "",
					position_id : "",
					certificate_type_id : "",
					role_id : ""
				},
				deleteParam: {
					user_id_list: []
				},
				rules: {
					department_id: [{
						required: true, message: '请选择所属部门', trigger: 'change'
					}],
					job_number: [{
						required: true, message: '请输入工号', trigger: 'blur'
					}],
					user_name: [{
						required: true, message: '请输入用户名称', trigger: 'blur'
					}],
					password: [
						{ required: true, validator: validatePassAdd, trigger: 'blur' },
						{required: true, message: '请输入密码', trigger: 'blur'}
					],
					confirm_password: [
						{ required: true, trigger: 'blur' , validator: validatePass2Add },
						{required: true, message: '请确认密码', trigger: 'blur'}
					],
					email: [{
						required: true, validator: validate.isEmail, trigger: 'blur'
					}],
					user_phone: [{
						 required: true, validator: validate.validateTelphone, trigger: 'blur'
					}],
					is_department_head: [{
						required: true, message: '请选择', trigger: 'change'
					}],
					is_safety_admin: [{
						required: true, message: '请选择', trigger: 'change'
					}],
					is_safety_production: [{
						required: true, message: '请选择', trigger: 'change'
					}],
					is_special_operator: [{
						required: true, message: '请选择', trigger: 'change'
					}],
					certificate_number: [{
						required: true, message: '请输入证件号码', trigger: 'blur'
					}],
					certificate_get_time: [{
						required: true, message: '请选择取证时间', trigger: 'change'
					}],
					certificate_period: [{
						required: true, message: '请输入证件有效期', trigger: 'blur'
					}],
					certificate_type_id: [{
						required: true, message: '请选择资质证书类型', trigger: 'change'
					}],
					position_id: [{
						required: true, message: '请选择岗位', trigger: 'change'
					}],
					role_id: [{
						required: true, message: '请选择角色', trigger: 'change'
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
			vm.getAllSelList();
			vm.getList();
		},
        methods: {
			//获取所下拉数据
			getAllSelList() {
				let vm = this;
				const obj = {
					pagination: {
						page : "0",
						count : "10"
					}
				}
				let selParam = vm.listQuery;
				selParam.jsonText = JSON.stringify(obj);
				vm.$instance.post("/proxy/enterprise/position/getPositionList", selParam).then(res =>{
		          	if(res.data.status == 1){
                        vm.positionList = res.data.data.position_list;
		            }else{
		                Message.error({message: res.data.msg});
		            }
		        }).catch(error => {
		        	
		        });
				vm.$instance.post("/proxy/users/users/getRoleList", selParam).then(res =>{
		          	if(res.data.status == 1){
                        vm.roleList = res.data.data.role_list;
		            }else{
		                Message.error({message: res.data.msg});
		            }
		        }).catch(error => {
		        	
		        });
				vm.$instance.post("/proxy/base/CertificateType/getCertificateTypeList", selParam).then(res =>{
		          	if(res.data.status == 1){
                        vm.certificateList = res.data.data.certificate_type_list;
		            }else{
		                Message.error({message: res.data.msg});
		            }
		        }).catch(error => {
		        	
		        });
			},

            //获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
                let vm = this;
                if (isBackHome) {
					vm.uesrListParam.pagination.page = 1;
				}
				let param = vm.listQuery;
				param.jsonText = JSON.stringify(vm.uesrListParam);
				vm.listLoading = true;
		        vm.$instance.post("/proxy/users/users/getUsersList", param).then(res =>{
					vm.listLoading = false;
		          	if(res.data.status == 1){
                        vm.list = res.data.data.users_list;
                        vm.total = parseInt(res.data.data.paginated.total);
		            }else{
		                Message.error({message: res.data.msg});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},

			handleAdd() {
				this.resetForm("addDialogForm");
				this.addParams.user_id = 0;
				this.addDialogFormVisible = true;
			},

			handleCreateSubmit(formName) {
				let vm = this;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						let param = JSON.parse(JSON.stringify(vm.listQuery));
						param.jsonText = JSON.stringify(vm.addParams);
						debugger
						vm.updateSubmit(param, 'add');
					}
				});
			},

			updateSubmit(param, type) {
				let vm = this;
				vm.addLoad = true;
				vm.$instance.post("/proxy/users/users/saveUsersInfo", param).then(res =>{
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

			//选择要删除的人员
			handleSelectionChange(val) {
				let arr = [];
				val.forEach(item => {
					arr.push(item.user_id);
				});
				this.deleteParam.user_id_list = arr;
			},

			//删除
			handleDelete() {
				let vm = this;
				if(vm.deleteParam.user_id_list.length == 0) {
					Message({
						showClose: true,
						message: '请选择要删除的人员',
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
						vm.$instance.post("/proxy/users/users/delUsersInfo", param).then(res =>{
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
				this.uesrListParam.pagination.count = pageData.iDisplayLength;
				this.uesrListParam.pagination.page = pageData.iDisplayStart;
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
	.personnel-form {
		.el-form-item {
			margin-bottom: 15px;
		}
	}
	.form-title {
		margin: 10px 0;
		padding-left: 10px;
		border-left: 4px solid #204FFE;
	}
</style>