<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 用户管理
 * @Date: 2019-03-18 16:38:14
 * @LastEditTime: 2019-05-07 10:44:44
 -->

<template>
	<div class="app-container">
		<!-- 搜索条件 -->
		<div class="filter-container">
			<el-form :inline="true" :model="listQuery" class="demo-form-inline">
				<el-form-item label="账号">
					<el-input v-model="listQuery.account" placeholder="请输入账号" clearable></el-input>
				</el-form-item>
				<el-form-item label="昵称">
					<el-input v-model="listQuery.accountNick" placeholder="请输入昵称" clearable></el-input>
				</el-form-item>
				<el-form-item label="状态">
					<el-select v-model="listQuery.status" clearable placeholder="请选择状态">
						<el-option label="启用" value="Y"></el-option>
						<el-option label="停用" value="N"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系人">
					<el-input v-model="listQuery.contacts" placeholder="请输入联系人" clearable></el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input v-model="listQuery.phone" placeholder="请输入手机号" clearable></el-input>
				</el-form-item>
				<el-button class="filter-item blue-btn" type="primary" icon="iconfont icon-sousuo" @click="(getList(true))">
					搜索
				</el-button>
				<el-button class="filter-item green-btn" v-if="permBtn.account_add" type="primary" icon="iconfont icon-xinzeng"  @click="handleCreate">
					新增
				</el-button>
			</el-form>
		</div>

		<!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label='账号' prop="account" width="170"></el-table-column>
			<el-table-column align="center" label='账号类型' width="100">
				<template slot-scope="scope">
					{{scope.row.extension | filterAccountType}}
				</template>
			</el-table-column>
			<el-table-column align="center" label='所属企业'>
				<template slot-scope="scope">
					{{scope.row.extension | filterCompanyName}}
				</template>
			</el-table-column>
			<el-table-column align="center" label="昵称" prop="accountNick" width="150"></el-table-column>
			<el-table-column align="center" label="手机号" prop="phone" width="140"></el-table-column>
			<!-- <el-table-column align="center" label="账号属性">
				<template slot-scope="scope">
					<div v-if="scope.row.isSuper == 'Y'">超级用户</div>
					<div v-else>普通用户</div>
				</template>
			</el-table-column>	 -->
			<el-table-column align="center" label="状态" width="100">
				<template slot-scope="scope">
					<div v-if="scope.row.status == 'Y'">启用</div>
					<div v-else>停用</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="联系人" prop="contacts" width="180"></el-table-column>
			<el-table-column align="center" label="邮箱" prop="email" width="200"></el-table-column>
			<el-table-column align="center" label="操作" width="160">
				<template slot-scope="scope">
					<el-dropdown  class="own-btn blue-btn" trigger="click">
						<el-button type="primary">
							更多操作
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item v-if="permBtn.account_role" @click.native="roleManage(scope.$index, scope.row)">角色管理</el-dropdown-item>
							<el-dropdown-item v-if="permBtn.account_modify" @click.native="handleEdit(scope.$index, scope.row)">修改</el-dropdown-item>
							<el-dropdown-item v-if="permBtn.account_delete" @click.native="handleDelete(scope.$index, scope.row)">删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>

		<!--新增弹框-->
		<el-dialog title="新增" :visible.sync="addFormVisible" @close="$refs.addDialogForm.resetFields()" top="10%" width="700px" ock-scroll class="boxres dialog_input account-form" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="small-space" ref="addDialogForm" :rules="rules" :model="addDataTemp" label-position="left" label-width="105px" v-loading="addLoad" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="12">
						<div class="grid-content bg-purple">
							<el-form-item label="账号：" prop="account">
								<el-input v-model="addDataTemp.account" :maxlength="20" placeholder="用户名称"></el-input>
							</el-form-item>
							<el-form-item label="密码：" prop="password">
								<el-input type="password" :maxlength="20" v-model="addDataTemp.password" placeholder="密码"></el-input>
							</el-form-item>
							<el-form-item label="重复密码：" prop="addDbPassword">
								<el-input type="password" :maxlength="20" v-model="addDataTemp.addDbPassword" placeholder="重复密码"></el-input>
							</el-form-item>
							<el-form-item label="状态：">
								<el-select v-model="addDataTemp.status" placeholder="请选择">
									<el-option label="启用" value="Y"></el-option>
									<el-option label="停用" value="N"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="账号类型：" prop="accountType">
								<el-select v-model="addDataTemp.accountType" placeholder="账号类型" @change="changeAccountType">
									<el-option
										v-for="item in accountType"
										:key="item.dictCode"
										:label="item.dictName"
										:value="item.dictCode">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
						<el-form-item label="昵称：" prop="accountNick">
							<el-input v-model="addDataTemp.accountNick" :maxlength="50" placeholder="昵称"></el-input>
						</el-form-item>
						<el-form-item label="联系人：" prop="contacts">
							<el-input v-model="addDataTemp.contacts" :maxlength="30" placeholder="联系人"></el-input>
						</el-form-item>
						<el-form-item label="手机号：" prop="phone">
							<el-input v-model="addDataTemp.phone" placeholder="手机号"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" prop="email">
							<el-input v-model="addDataTemp.email" :maxlength="50" placeholder="邮箱"></el-input>
						</el-form-item>
						<el-form-item label="所属企业：" prop="companyId" v-if="addDataTemp.accountType == 'company_account'">
							<el-select v-model="addDataTemp.companyId" filterable placeholder="所属企业" clearable>
								<el-option
									v-for="item in companyList"
									:key="item.companyId"
									:label="item.companyName"
									:value="item.companyId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
			
		<!--修改-->
		<el-dialog title="修改" :visible.sync="updateFormVisible" @close="$refs.editDialogForm.resetFields()"  top="10%" width="700px" lock-scroll class="boxres dialog_input account-form" :close-on-click-modal="false"
			:close-on-press-escape="false" >
			<el-form class="small-space" ref="editDialogForm" :rules="rules" :model="editParamsTemp" label-position="left" label-width="105px" v-loading="updateLoad" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="12">
						<div class="grid-content bg-purple">
							<el-form-item label="账号：">
								{{editParamsTemp.account}}
							</el-form-item>
							<el-form-item label="联系人：" prop="contacts">
								<el-input v-model="editParamsTemp.contacts" :maxlength="30" placeholder="联系人"></el-input>
							</el-form-item>
							<el-form-item label="状态：">
								<el-select v-model="editParamsTemp.status" placeholder="请选择">
									<el-option label="启用" value="Y"></el-option>
									<el-option label="停用" value="N"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="账号类型：" prop="accountType">
								<el-select v-model="editParamsTemp.accountType" placeholder="账号类型" @change="changeAccountType">
									<el-option
										v-for="item in accountType"
										:key="item.dictCode"
										:label="item.dictName"
										:value="item.dictCode">
									</el-option>
								</el-select>
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
						<el-form-item label="昵称：" prop="accountNick">
							<el-input v-model="editParamsTemp.accountNick" :maxlength="50" placeholder="昵称"></el-input>
						</el-form-item>
						<el-form-item label="手机号：" prop="phone">
							<el-input v-model="editParamsTemp.phone" placeholder="手机号"></el-input>
						</el-form-item>
						<el-form-item label="邮箱：" prop="email">
							<el-input v-model="editParamsTemp.email" :maxlength="50" placeholder="邮箱"></el-input>
						</el-form-item>
						<el-form-item label="所属企业：" prop="companyId" v-if="editParamsTemp.accountType == 'company_account'">
							<el-select v-model="editParamsTemp.companyId" filterable placeholder="所属企业" clearable>
								<el-option
									v-for="item in companyList"
									:key="item.companyId"
									:label="item.companyName"
									:value="item.companyId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="updateFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleEditSubmit('editDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!-- 角色选择 -->
		<el-dialog  class="roleSelectDialog" title="角色选择" 
			:visible.sync="roleManFormVisible" :close-on-click-modal="false"
			:close-on-press-escape="false" top="10%" width="400px" lock-scroll>
			<div v-loading="roleLoad" element-loading-text="拼命加载中">
				<el-row>
					<label>角色选择：</label>
					<el-select v-model="accountSetRole.roleIds" @change="changeSelVal" multiple
					    collapse-tags  placeholder="请选择">
						<el-option
							v-for="item in roleList"
							:key="item.roleId"
							:label="item.roleName"
							:title="item.roleName"
							:value="item.roleId">
						</el-option>
					</el-select>
				</el-row>
				<div class="panel-body">
					<el-tag class="role_tag"
					v-for="tag in accountSetRole.roles"
					:key="tag.roleId"
					closable
					:disable-transitions="false"
					@close="handleClose(tag)" >{{tag.roleName}}</el-tag>
				</div>
				<div class="formButton">
					<el-button @click="roleManFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="roleSubmit()" class="btnColor">确 定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import "../../assets/css/index.scss";
	import { Message } from 'element-ui';
	import { validate } from 'utils/validate';
	import { utils } from 'src/utils';
	import md5 from 'blueimp-md5';
	import Pagination from '../../components/Pagination';
	let that;
	export default {
		components: {
			'pagination': Pagination,
		},
		beforeCreate() {
			that = this;
		},
		data() {
			const vm =this;
			//新增页面密码校验
			const validatePassAdd = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (vm.addDataTemp.addDbPassword !== '') {
						vm.$refs.addDialogForm.validateField('addDbPassword');
					}
					callback();
				}
    	    };
			const validatePass2Add = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== vm.addDataTemp.password) {
					callback(new Error('两次输入密码不一致'));
				} else {
					callback();
				}
			};

			//企业账户验证唯一性
			const validateAccountOnly = (rule, value, callback) => {
				if (vm.isValidate.isOk) {
					if (vm.isValidate.account) {
						callback();
						return;
				}
				} else {
					vm.isValidate.account = false;
				}

				if (value === '' || value === null) {
					callback(new Error('账户不能为空'));
					return;
				}
				
				const reg = /^[0-9a-zA-Z]+$/; 
				let falg = reg.test(value.trim());
				if (!falg) {
					callback(new Error('账户只能是数字或字母组成'));
					return;
				}

				let param = {};
				param.account = value;
				param.flags = true;
				vm.$instance.get("/proxy/sysmgr/account/uniqueAct", {params:param}).then(res =>{
					if(res.status == 200){
						//唯一
						if (res.data.success) {
							vm.isValidate.account = true;
							callback();
						} else { //不唯一
							callback("账户不唯一，请重新输入！");
						}
					}else{
						callback("调用接口失败");
					}
				}).catch(error => {callback("请求失败！");});
			};

			//手机号验证唯一性
			const validatePhoneOnly = (rule, value, callback) => {
				//先去判断是不是确定，如果是，直接获取上次验证的结果，如果不是在请求验证
				if (vm.isValidate.isOk) {
					if (vm.isValidate.phone) {
						callback();
						return;
					}
				} else {
					vm.isValidate.phone = false;
				}
				if (value === '' || value === null) {
					callback(new Error('手机号不能为空'));
				} else {
					let param = {};
					param.phone = value;
					param.flags = true;
					if (vm.updateFormVisible == true) {
						param.accountId = vm.editParamsTemp.accountId;
					}
					vm.$instance.get("/proxy/sysmgr/account/uniquePhone", {params:param}).then(res =>{
						if(res.status == 200){
							//唯一
							if (res.data.success) {
								vm.isValidate.phone = true;
								callback();
							} else { //不唯一
								callback("手机号不唯一，请重新输入！");
							}
						}else{
							callback("调用接口失败");
						}
					}).catch(error => {callback("请求失败！");});
				}
			};

			return {
				//按钮的权限 查询query 新增add   true 显示  false 隐藏
				permBtn:{
					account_add: false,
					account_delete: false, 
					account_modify: false, 
					account_role: false
				},

				//唯一性验证状态记录
				isValidate:{
					account: false,
					phone: false,
					isOk: false   //点击确定第一时间将此变量设置为true
				},

				list: null, //表格list
				total: 0,
				listLoading: true,
				height: 540,

				//列表查询参数
				listQuery: {
					iDisplayLength: 10,
					iDisplayStart: 0,
					account: '',
					accountNick: '',
					contacts: '',
					phone: '',
					status: '',
				},
				//树控件数据映射关系
        		defaultProps: {
          			children: 'children',
          			label: 'deptName'
				},
				//新增参数
				addDataTemp: {
					account: "",
					accountNick: "",
					contacts: "",
					email: "",
					password: "",//密码
					addDbPassword: "", //新增重复密码
					phone: "",
					status: "Y",
					companyId: '',
					accountType: 'company_account',
				},

				//修改参数
				editParamsTemp: {
					accountId: "",
					account: "",
					accountNick: "",
					contacts: "",
					email: "",
					phone: "",
					status: "",
					accountType: ''
				},
				roleNamesCheck: "", //查看需要的角色名称
				companyList: [],//企业列表
				//用户赋权数据
				addFormVisible: false,
				updateFormVisible: false,
				roleManFormVisible: false,
				addLoad: false,//新增加载状态
				updateLoad: false,//修改加载状态
				roleLoad: false,//角色赋权状态
				//角色列表数据
				roleList: [],
				accountType: [],
				//用户赋权数据
				accountSetRole:{
					roleIds: [],
					roles: [],
					accountId: ""
				},
				//新增修改数据校验
				rules: {
					account: [
						{ required: true, validator:validateAccountOnly, trigger: 'blur' }
					],
					accountNick: [
						{ required: true, message: '请输入昵称', trigger: 'blur' }
					],
					contacts: [
						{ required: true, message: '请输入联系人', trigger: 'blur'}
					],
					email: [
						{ required: true, validator: validate.isEmail, trigger: 'blur' }
					],
					phone: [
						{ required: true, validator: validate.validateTelphone, trigger: 'blur' },
						{ required: true, validator: validatePhoneOnly, trigger: 'blur' }
					],
					password: [
						{ required: true, validator: validatePassAdd, trigger: 'blur' },
						{ required: true, validator: validate.validatePass, trigger: 'blur' }
					],
					addDbPassword: [
						{ required: true, trigger: 'blur' , validator: validatePass2Add },
						{ required: true, trigger: 'blur' , validator: validate.validatePass},
					],
					companyId: [
						{ required: true, message: '请选择企业', trigger: 'blur'}
					],
					accountType: [
						{ required: true, message: '请选择账号类型', trigger: 'change'}
					]
				},
			}
		},
		filters: {
			filterCompanyName: function (dataStr) {
				let companyName = (JSON.parse(dataStr)).companyName;
				return companyName ? companyName : '--';
			},
			filterAccountType: function (dataStr) {
				let accountType = (JSON.parse(dataStr)).accountType;
				let accountTypeName = '';
				that.accountType.forEach(element => {
					if (element.dictCode == accountType) {
						accountTypeName = element.dictName;
					}
				});
				return accountTypeName;
			},
		},
		mounted() {
			var vm = this;
			utils.getTableHeight((height)=>{
				this.height = height;
			});
			vm.getAllCompany();
			vm.getAccountType();
			vm.getPerm();
			vm.getList();
		},
		//实例销毁之间调用。在这一步，实例仍然完全可用。   时间定时器
		beforeDestroy(){
			
		},
		methods: {
			//获取当前页面的权限
			getPerm(){
				this.permBtn = utils.permsButton(this);
			},

			//获取账号类型
			getAccountType() {
				let vm = this;
				utils.dictsByCode('account_type', data => {
					vm.accountType = data;
				})
			},

			getAllCompany() {
				let vm = this;
				vm.$instance.get("/proxy/company/findAllList", {}).then(res =>{
					if(res.status == 200){
						vm.companyList = res.data;
					}else{
						Message.error({message:"调用接口失败"});
					}
		      	}).catch(error => {

				});
			},
			
			//获取列表数据
			getList(isBackHome = false) {
				var vm = this;
				if (isBackHome) {
					if (this.listQuery.iDisplayStart != 0) {
						this.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listLoading = true;
				//调用接口
				vm.$instance.post("/proxy/sysmgr/account/findActList", JSON.parse(JSON.stringify(vm.listQuery))).then(res =>{
					if(res.status == 200){
						vm.list = res.data.data;
						vm.total = res.data.contTotal;
					}else{
						Message.error({message:"调用接口失败"});
					}
					vm.listLoading = false;
		      	}).catch(error => {
					 vm.listLoading = false;
				});
			},

			changeAccountType(val) {
				let vm = this;
				if (val == 'park_account') {
					if (vm.addFormVisible) {
						vm.addDataTemp.companyId = '';
					} else if(vm.updateFormVisible){
						vm.editParamsTemp.companyId = '';
					}
				}
			},

			//新增
			handleCreate() {
				this.resetForm("addDialogForm");
				this.addFormVisible = true;
			},
			
			//新增确定
			handleCreateSubmit(formName) {
				this.isValidate.isOk = true;
				var vm = this;
				validate.isValidate(this, formName, (formData)=>{
					if(formData.validates){
						vm.createSubmit();
					}
					vm.isValidate.isOk = false;
				});
			},

			//新增提交
			createSubmit() {
				let vm = this;
				let params = JSON.parse(JSON.stringify(vm.addDataTemp));
				delete params.addDbPassword;
				let companyName = '';
				vm.companyList.forEach(element => {
					if (element.companyId == params.companyId) {
						companyName = element.companyName
					}
				});
				let obj = {
					companyId: params.companyId,
					companyName: companyName,
					accountType: params.accountType
				}
				params.extension = JSON.stringify(obj);
				vm.addLoad = true;
				vm.$instance.post("/proxy/sysmgr/account/addAct", params).then(res =>{
					if(res.status == 200){
						vm.addLoad = false;
						if (res.data.success) {
							vm.addFormVisible = false;	
							vm.$refs.addDialogForm.resetFields();
							Message({
								showClose: true,
								message: '新增成功',
								type: 'success',
								duration: 1500 ,
								onClose: function(){
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}						
					}else{
						Message.error({message:"调用接口失败"});
						vm.addLoad = false;
					}
				}).catch(error => {
					vm.addLoad = false;
					Message.error({message:"新增失败！"});
				});	
			},

			//修改
			handleEdit(index, row) {
				this.isValidate.isOk = false;
				this.isValidate.account = false;
				this.isValidate.phone = false;
				let obj = JSON.parse(row.extension);
				this.editParamsTemp = {
					accountId: row.accountId,
					account: row.account,
					accountNick: row.accountNick,
					contacts: row.contacts,
					email: row.email,
					phone: row.phone,
					status: row.status,
					companyId: obj.companyId,
					accountType: obj.accountType,
				}
				this.updateFormVisible = true;
			},
		
			//修改确定
		  	handleEditSubmit(formName) {
				let vm = this;
				vm.isValidate.isOk = true;
				validate.isValidate(vm, formName, (formData)=>{
					if(formData.validates){
						vm.editSubmit();
					}
					vm.isValidate.isOk = false;
				});
			},

			//修改提交
		  	editSubmit() {
				let vm = this;
				let params = JSON.parse(JSON.stringify(vm.editParamsTemp));
				let companyName = '';
				vm.companyList.forEach(element => {
					if (element.companyId == params.companyId) {
						companyName = element.companyName
					}
				});
				let obj = {
					companyId: params.companyId,
					companyName: companyName,
					accountType: params.accountType
				}
				params.extension = JSON.stringify(obj);
				vm.updateLoad = true;
				vm.$instance.post("/proxy/sysmgr/account/modifyAct", params).then(res =>{
					vm.updateLoad = false;
					if(res.status == 200){
						if (res.data.success) {
							vm.updateFormVisible = false;
							vm.resetForm("editDialogForm");
							Message({
								showClose: true,
								message: '修改成功',
								type: 'success',
								duration: 1500 ,
								onClose: function(){	
									vm.getList();
								}
					        });
						} else {
							Message.error({message:res.data.errorMsg});
						}
					}else{
						vm.updateLoad = false;
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					vm.updateLoad = false;
					vm.updateFormVisible = false;
				});
			},

			//删除
			handleDelete(index, row) {
				var vm = this;
				let param = {};
				param.accountId = row.accountId;
				//确定删除
				this.$confirm('是否删除< '+ row.account +' >账户！', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//调用接口
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

			//角色管理
			roleManage(index, row) {
				this.accountSetRole.accountId = row.accountId;
				this.accountSetRole.roleIds = [];
				var vm = this;
				//有数据不再请求
				if (vm.roleList && vm.roleList.length == 0) {
					vm.$instance.get("/proxy/sysmgr/role/roleArr").then(res =>{
						if(res.status == 200){
							vm.roleList = res.data;
						}else{
							Message.error({message:"调用接口失败"});
						}
					}).catch(error => {});
				}
				//获取当前角色
				vm.$instance.get("/proxy/sysmgr/account/findRolesByActId", {params: {"accountId": row.accountId}}).then(res =>{
					if(res.status == 200){
						vm.accountSetRole.roles = res.data;
						for(let obj of res.data){
							vm.accountSetRole.roleIds.push(obj.roleId);
						}
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {});
				
				vm.roleManFormVisible = true;
			},

			//赋权
			roleSubmit() {
				var vm = this;
				vm.roleLoad = true;
				var param = JSON.parse(JSON.stringify(vm.accountSetRole));
				delete param.roles;
				vm.$instance.post("/proxy/sysmgr/account/roleManage", param).then(res =>{
					vm.roleLoad = false;
					if(res.status == 200){
						vm.roleLoad = false;
						if (res.data.success) {
							vm.roleManFormVisible = false;
							Message.success({message: '赋权成功！'});
						} else {
							Message.error({message:res.data.errorMsg});
						}
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {vm.roleLoad = false; vm.roleManFormVisible = false;});
			},

			//选中角色 事件
      		changeSelVal(data){
      			this.accountSetRole.roles = [];
      			//将选中的角色ID 循环 找到相对应的角色name
				for(let i = 0;i<data.length;i++){
					for(let j = 0; j<this.roleList.length;j++){
						if(data[i] == this.roleList[j].roleId){
							this.accountSetRole.roles.push(this.roleList[j]);
						}
					}
				}
      		},
      		//已选中角色 取消事件
      		handleClose(tag){
      			//es6 数组删除特定的元素
      			this.accountSetRole.roles.splice(
      				this.accountSetRole.roles.findIndex(
      					item => item.roleId === tag.roleId
      				), 
      			1);
      			this.accountSetRole.roleIds.splice(
      				this.accountSetRole.roleIds.findIndex(
      					item => item === tag.roleId
      				), 
      			1);
      		},

			/**
			 * 分页改变，加载数据
			 */
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
			
			resetForm(formName) {
        		if (this.$refs[formName] !== undefined) {
					this.$refs[formName].resetFields();
				}
			},
		}
	}
	
</script>
<style rel="stylesheet/scss" lang="scss">
	.roleSelectDialog .el-input {
		width: 260px;
	}
	.roleSelectDialog .el-select__tags {
		display: none;
	}
	.device-imei>div>div {
		cursor: pointer;
		width: 160px;
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		color: #c0c4cc;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
	}
	
	.box .el-dialog {
		width: 25%;
	}
	
	.el-tabs__nav-wrap::after{
		background: none;
	}
	
	.el-tabs__item{
		// height: 0;
		border: 1px solid #e9e9e9;
		text-align: center;
		border-radius: 4px;
		-webkit-border-radius: 4px;
    	-moz-border-radius: 4px;
    	padding: 0 30px !important;
	}
	.el-tabs__item.is-active{
		background: #1e4d78;
		border: 1px solid #1e4d78;
		color: #fff;
	}
	.el-tabs__active-bar{
		background: none;
	}
	.box form{
		padding-left: 50px;
	}
	.dialogDeptTree {
		border: 1px solid #ddd;
		max-height: 150px;
		min-height: 150px;
		overflow-y: auto; 
	}
	.panel-body{
		min-height: 100px;
		margin-top: 20px;
	    background-color: #f8f9fb;
	    overflow-x:hidden;
	    overflow-y:auto;
	}
	
	.el-tag.el-tag--info.el-tag--small{
		height: 24px;
	}
	
	.role_tag{
		display: inline-table;
		margin-bottom: 5px;
		background-color: #ebebeb;
		color: #797979;
		border: none;
		padding: 1px 10px;
		margin-right: 5px;
		min-height: 20px !important;
		line-height: 20px !important;
	}
	.el-tag.role_tag{
		white-space: inherit;
		height: 0;
	}
	
	.el-select-dropdown__item{
		width: 250px;
		padding: 0 10px;
	}
	.el-select-dropdown__item.selected::after{
		right: 0 !important;
	}
	.account-form .el-input {
		width: 200px
	}
</style>
