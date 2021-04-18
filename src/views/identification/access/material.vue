/*
 * @Author: qiaozp 
 * @Date: 2021-03-17 10:58:26 
 * @Description: 材料列表
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-26 11:14:27
 */
<template>
    <div class="app-container">
        <!-- 搜索条件 -->
        <div class="sel">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline">
                <el-form-item>
                    <el-input v-model="listQuery.companyName" placeholder="请输入名称" clearable></el-input>
                </el-form-item>
                <el-button type="primary" @click="handleImportTem">查询</el-button>
                <el-button type="primary" @click="handleImportTem">导入模板</el-button>
                <el-button type="primary" @click="handleAdd">添加</el-button>
                <el-button type="danger">删除</el-button>
            </el-form>
        </div>

        <!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column type="selection" align="center" width="55"></el-table-column>
			<el-table-column align="center" label="序号" prop="index" width="80"></el-table-column>
			<el-table-column align="center" label="材料名称	" prop="workName" width="180"></el-table-column>
			<el-table-column align="center" label="类别" prop="type"></el-table-column>
			<el-table-column align="center" label="存量" prop="stock" width="80"></el-table-column>
			<el-table-column align="center" label="状态" prop="state" width="80"></el-table-column>
			<el-table-column align="center" label="管理部门" prop="dept" width="140"></el-table-column>
			<el-table-column align="center" label="所在建筑名称" prop="buildingName" width="140"></el-table-column>
			<el-table-column align="center" label="MSD附件" prop="enclosure" width="180"></el-table-column>
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
		<el-drawer title="新增原辅料" :visible.sync="addDrawerVisible" :direction="direction" size="25%" :before-close="handleClose">
			<div class="form-box">
				<el-form ref="form" :model="sizeForm" label-width="120px" size="mini">
					<el-form-item label="原辅料名称">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="所在建筑">
						<el-select v-model="sizeForm.region" placeholder="请选择所在建筑">
							<el-option label="总平面图" value="1"></el-option>
							<el-option label="泵房平面图" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="原辅料类别">
						<el-select v-model="sizeForm.region" placeholder="请选择原辅料类别">
							<el-option label="有整体爆炸危险的物质和物品原辅料" value="1"></el-option>
							<el-option label="有迸射危险，但无整体爆炸危险的物质和物品" value="2"></el-option>
							<el-option label="易燃气体原辅料" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="存储状态">
						<el-select v-model="sizeForm.region" placeholder="请选择存储状态">
							<el-option label="液体" value="1"></el-option>
							<el-option label="固体" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="存储方式">
						<el-select v-model="sizeForm.region" placeholder="请选择存储方式">
							<el-option label="灌装" value="1"></el-option>
							<el-option label="堆放" value="2"></el-option>
						</el-select>
					</el-form-item>
                    <el-form-item label="存量">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="最大存量">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="存量单位">
						<el-input v-model="sizeForm.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="管理部门">
						<el-select v-model="sizeForm.region" placeholder="请选择管理部门">
							<el-option label="部门一" value="1"></el-option>
							<el-option label="部门二" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="MSD上传">
						<el-upload
							class="upload-demo"
							action="https://jsonplaceholder.typicode.com/posts/"
							:on-change="handleChange"
							:file-list="fileList">
							<el-button size="small" type="primary">点击上传</el-button>
							<div slot="tip" class="el-upload__tip">文件扩展名doc、docx、pdf，文件大小不得超过20M</div>
						</el-upload>
					</el-form-item>
					<el-form-item label="危险有害因素">
						<el-button type="text" @click="handleAddFactor"><i class="el-icon-circle-plus-outline"></i>添加危险有害因素</el-button>
						<div class="factor-info">
							<div class="info-list">
								<el-checkbox v-model="checked">危险有害因素1</el-checkbox>
								<el-button type="text" class="fr">删除</el-button>
								<el-button type="text" class="fr">编辑</el-button>
							</div>
						</div>
					</el-form-item>
					<el-drawer title="危险有害因素详情" :append-to-body="true" :before-close="handleClose" :visible.sync="innerDrawer">
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
		<el-dialog class="importTemDialog" title="导入原辅料模板" :visible.sync="importTemVisible" :close-on-click-modal="false" :close-on-press-escape="false" top="15%" width="600px" lock-scroll>
			<el-row>
				<label>原辅料：</label>
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
	import Pagination from '../../../components/Pagination';
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
					index: '1',
					workName: '辅料X',
					type: '第1.2项：有迸射危险，但无整体爆炸危险的物质和物品',
					stock: '100',
					state: '液体',
					dept: '校长办公室',
					buildingName: '总平面图',
					enclosure: '辅料X.doc'
				}], //表格list
                total: 10,
				listLoading: false,
				importTemVisible: false,
				addDrawerVisible: false,
				innerDrawer: false,
				//列表查询参数
				listQuery: {
                    iDisplayLength: 10,
					iDisplayStart: 0,
					companyName: '',
					name: '',
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

				}
			}
		},
		mounted () {
			var vm = this;
			vm.getPerm();
			// vm.getList();
			vm.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height - 49;
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
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss">
	
</style>
