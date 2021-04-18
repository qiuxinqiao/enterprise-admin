/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:37:20 
 * @Description: 资质档案
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月9日14:36:59
 */
<template>
  <div class="app-container">
    <div class="title_box_gd">
      <div class="title">资质档案</div>
      <div class="right">
        <el-button type="primary"   @click="dataFilesDialog = true">添 加</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
    </div>

    <!-- 表格 -->
	<el-table ref="multipleTable" :data="list" :height="height" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" type="selection" width="55"></el-table-column>
			<el-table-column align="center" label="资质证书名称" prop="qua_arc_name"></el-table-column>
			<el-table-column align="center" label="资质证书备注" prop="qua_arc_remark"></el-table-column>
			<el-table-column align="center" label="资质证书图片">
				<template slot-scope="scope">
					<template v-if="scope.row.qua_arc_image_list.length > 0">
						<span v-for="(item, index) in scope.row.qua_arc_image_list" :key="index">
							<img class="qua-img" :src="item.path" :preview='scope.row.qua_arc_id'>
						</span>
					</template>
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

    <!-- 添加资质档案 开始 -->
    <el-dialog
      title="添加资质档案"
      :visible.sync="dataFilesDialog"
      width="30%"
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            v-model="form.remarks"
            type="textarea"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
        <div class="form_container">
			<div class="label_title">厂区平面图</div>
         <el-upload
			action="https://jsonplaceholder.typicode.com/posts/"
			list-type="picture-card"
			:on-preview="handlePictureCardPreview"
			:on-remove="handleRemove">
			<i class="el-icon-circle-plus-outline"></i><span>点击上传</span>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="form.dialogImageUrl" alt="">
			</el-dialog>
          <p>文件扩展名.png ,jpg...图片大小不得超过2M</p>
          
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataFilesDialog = false">取 消</el-button>
        <el-button type="primary" @click="dataFilesDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加资质档案 结束 -->
  </div>
</template>
<script>
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
import Pagination from "../../components/Pagination";
export default {
	components: {
		Pagination
	},
	data() {
		return {
			dataFilesDialog: false,
			dialogVisible: false,
			permBtn: {
				alarm_find: false,
			},
			height: 640,
			list: [
			], //表格list
			form: {
				name: "",
				remarks:'',
				dialogImageUrl:'',
			},
			total: 20,
			listLoading: false,
			userInfo: null,
			//列表查询参数
			listQuery: {},
			listParam: {
				pagination: {
					page : "1",
					count : "10"
				}
			}
		};
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
  	mounted() {
		let vm = this;
		vm.getPerm();
		vm.getList();
		vm.$nextTick(function () {
			utils.getTableHeight((height) => {
				this.height = height;
			});
		});
  	},
  	methods: {
		//删除/上传成功方法
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// ==========
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		indexMethod(index) {
			return index + 1;
		},
		//获取当前页面的权限
		getPerm() {
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
			let param = JSON.parse(JSON.stringify(vm.listQuery));
			param.jsonText = JSON.stringify(vm.listParam);
			vm.listLoading = true;
			vm.$instance.post("/proxy/Enterprise/Archives/getArchivesList", param).then((res) => {
				vm.listLoading = false;
				if(res.status == 200){
					vm.list = res.data.data.archives_list;
					vm.total = parseInt(res.data.data.paginated.total);
				}else{
					Message.error({message:"调用接口失败"});
				}
			}).catch((error) => {
				vm.listLoading = false;
			});
		},

		//删除资质档案
		handleDelete(index, row) {
			let vm = this;
			let param = JSON.parse(JSON.stringify(vm.listQuery));
			let idArr = [row.qua_arc_id];
			let obj = {
				qua_arc_id_list: idArr
			}
			param.jsonText = JSON.stringify(obj);
			//确定删除
			this.$confirm('确定删除么？', '删除', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				//调用接口
				vm.$instance.post("/proxy/Enterprise/Archives/delArchivesInfo", param).then(res =>{
					if(res.status == 200){
						if (res.data.status == '1') {
							Message.success({message: '删除成功！'});
							vm.$refs.page.deleteItemReLoadList();
						} else {
							Message.error({message: res.data.msg});
						}
					}else{
						Message.error({message:"调用接口失败"});
					}
				}).catch(error => {
					
				});
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
	},
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.qua-img {
		width: 60px;
		height: 60px;
		margin: 0 3px;
		cursor: pointer;
	}
</style>
