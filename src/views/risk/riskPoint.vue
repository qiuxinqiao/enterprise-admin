/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 风险点列表
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-30 17:05:53
 */
<template>
	<div class="app-container">
		<div class="title_box_gd point-title">
			<div class="title">风险点列表</div>
		</div>
		<div class="point-box" v-bind:style="{height: height}">
			<el-row>
				<el-col :span="4">
					<div class="left-list" v-bind:style="{height: height}">
						<el-input placeholder="搜索风险点/位置" prefix-icon="el-icon-search" v-model="selectInp"></el-input>
						<el-button type="primary" icon="el-icon-search"></el-button>
						<ul v-bind:style="{height: listHeight}">
							<li v-for="(item, index) in pointList" :key="index" :class="{active:index == current}" @click="getTableList(index, item)">
								{{item.pointName}}
								<el-dropdown>
									<span class="el-dropdown-link">
										<i class="el-icon-more"></i>
									</span>
									<el-dropdown-menu slot="dropdown">
										<el-dropdown-item>编辑</el-dropdown-item>
										<el-dropdown-item>删除</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
							</li>
						</ul>
						<el-button type="primary" @click="handleAdd"><i class="el-icon-circle-plus-outline"></i>添加风险点</el-button>
					</div>
				</el-col>
				<el-col :span="20">
					<div class="right-list">
						<div class="title_box_gd">
							<div class="title">{{checkedPoint.pointName}}</div>
							<div class="right query">
								<el-button type="primary" @click="handleAdd">添加</el-button>
								<el-button type="primary" @click="handleImportTem">导入</el-button>
								<el-button type="primary" @click="handleImportTem">导出</el-button>
								<el-button type="danger">删除</el-button>
							</div>
						</div>
						<!-- 表格 -->
						<el-table ref="multipleTable" :data="list" :height="tableHeight" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
							<el-table-column type="selection" align="center" label="序号" width="55"></el-table-column>
							<el-table-column align="center" label="排查对象名称" prop="name"></el-table-column>
							<el-table-column align="center" label="类别" prop="weihao"></el-table-column>
							<el-table-column align="center" label="危险有害因素" prop="type"></el-table-column>
							<el-table-column align="center" label="操作" width="120">
								<template slot-scope="scope">
									<el-button class="operation" type="text" size="small">编辑</el-button>
									<el-button class="operation" type="text" size="small" @click.native="handleDelete(scope.$index, scope.row)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-col>
			</el-row>
		</div>

		<!--新增弹框-->
		<el-dialog title="添加风险点" :visible.sync="addFormVisible" @close="$refs.addDialogForm.resetFields()" top="13%" width="700px" ock-scroll class="boxres dialog_input account-form" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="form-box" ref="addDialogForm" :model="addParam" label-position="left" label-width="105px" element-loading-text="拼命加载中">
				<el-row>
					<el-col :span="24">
						<el-form-item label="风险点名称：">
							<el-input v-model="addParam.status" :maxlength="20" placeholder="风险点名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="风险点位置：">
							<el-select v-model="addParam.status" filterable placeholder="请选择">
								<el-option label="总平面图" value="1"></el-option>
								<el-option label="综合罐区泵房" value="2"></el-option>
								<el-option label="综合罐区泵房配电室" value="3"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="平面图定位：">
							<el-button type="primary" @click="location">定位</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="楼层：">
							<el-select v-model="addParam.status" filterable placeholder="请选择">
								<el-option label="1" value="1"></el-option>
								<el-option label="2" value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="平面图截图：">
							<el-button type="primary" @click="handleCropper">截图</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-form-item class="formButton">
					<el-button @click="addFormVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handleCreateSubmit('addDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<!--定位风险点-->
		<el-dialog title="定位风险点" :visible.sync="locationVisible" @close="$refs.positionDialogForm.resetFields()" top="13%" width="700px" ock-scroll class="boxres dialog_input account-form" :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form class="form-box" ref="positionDialogForm" :model="positionParam" label-position="left" label-width="105px" element-loading-text="拼命加载中">
				<cropper class="cropper" @finishCropper="finishCropper" :url = localImgUrl></cropper>
				<el-form-item class="formButton">
					<el-button @click="locationVisible = false">取 消</el-button>
					<el-button type="primary" @click.native.prevent="handlePosition('positionDialogForm')" class="btnColor">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>	
</template>
<script>
	import { utils } from 'src/utils';
	import { validate } from 'utils/validate';
	import { Message } from 'element-ui';
	import Pagination from '../../components/Pagination';
	import Cropper from '../../components/Cropper';
	export default {
		components: {
			Pagination, Cropper
		},
		data () {
			return {
				permBtn:{
	                alarm_find: false
				},
				height: 540,
				tableHeight: 540,
				listHeight: 540,
                list:[], //表格list
                total: 0,
				listLoading: false,
				addFormVisible: false,
				locationVisible: false,
				current: null,
				selectInp: '',
				pointList: [{
					id: '1',
					pointName: '汽油罐区-总平面图'
				}, {
					id: '2',
					pointName: '甲醇罐区-总平面图'
				}],
				checkedPoint: { //当前选中风险点
					id: '',
					pointName: ''
				},
				addParam: {
					status: 1
				},
				positionParam: null,
				imgData: null,
				localImgUrl: require('../../assets/img/cropper.jpg')
			}
		},
		mounted () {
			var vm = this;
			vm.getList();
			vm.$nextTick(function(){
				utils.getTableHeight((height)=>{
					this.height = height + 85 + 'px';
					this.tableHeight = height + 10 + 'px';
					this.listHeight = height - 30 + 'px';
				});
			})
		},
		methods: {
			//获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
               
			},

			getTableList(index, obj) {
				let vm = this;
				vm.current = index;
				vm.checkedPoint = obj;
			},

			// 添加风险点
			handleAdd() {
				this.addFormVisible = true;
			},

			handleCreateSubmit() {

			},

			// 定位
			location() {
				this.locationVisible = true;
			},

			// 图片裁剪上传成功回调
			finishCropper(data){
				if(data){
					this.imgData = data;
				}
			},

			handleImportTem() {

			},

			handleCropper() {

			},
            
            //分页改变，加载数据
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
			
		}
	}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.point-title {
		margin-bottom: 0;
	}
	.el-dropdown-menu__item {
		width: 80px;
	}
	.left-list {
		padding: 10px 20px;
		border-right: 1px solid #E9E9E9;
		text-align: center;
		.el-input {
			width: 76%;
		}
		ul {
			display: block;
			margin-top: 10px;
			overflow-y: auto;
			text-align: left;
			li {
				height: 26px;
				line-height: 26px;
				font-size: 14px;
				cursor: pointer;
				padding: 0 5px;
				&:hover, &.active {
					background: #E8EDFF;
				}
				.el-dropdown {
					float: right;
				}
				i {
					transform: rotate(90deg);
					margin-top: 5px;
				}
			}
		}
	}
	.right-list {
		padding: 0 15px;
		.title_box_gd {
			margin-bottom: 0;
			padding: 0;
		}
		.el-table {
			border-left: 1px solid #E9E9E9;
		}
	}
	.point-box {
		width: 100%;
		background: #fff;
	}
</style>

