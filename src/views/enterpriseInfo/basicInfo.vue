/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:32:43 
 * @Description: 基础信息
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月9日10:15:22
 */
<template>
	<div class="app-container">
		<div class="title_box_gd">
			<div class="title">基础信息</div>
			<div class="right" v-if="modifyFlag">
				<el-button>取 消</el-button>
				<el-button type="primary">保 存</el-button>
			</div>
			<div class="right" v-else>
				<el-button>修 改</el-button>
			</div>
		</div>
		<div class="container_box_gd" v-bind:style="{height: height}">
			<el-form ref="form" :model="entInfo" class="demo-ruleForm small-space dialog" label-position="top">
				<!-- <div class="form_title_box_gd">基础信息</div> -->
				<div class="form_container">
					<el-row :gutter="30">
						<el-col :span="12">
							<el-form-item label="企业名称">
								<el-input v-model="entInfo.enterprise_name" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="单位地址">
								<el-input v-model="entInfo.enterprise_address" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-form-item label="企业类型">
						<el-input v-model="entInfo.enterprise_class_name" class="form_input_w" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="企业简介">
						<el-input type="textarea" :rows="5" v-model="entInfo.enterprise_intro" class="form_input_w" :disabled="disabled"></el-input>
					</el-form-item>
				</div>
				<div class="form_title_box_gd">双预控信息</div>
				<div class="form_container">
					<el-row :gutter="30">
						<el-col :span="12">
							<el-form-item label="管控层级">
								<el-input v-model="entInfo.enterprise_control_level_name" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="风险等级">
								<el-select v-model="entInfo.enterprise_risk_level_info.entrprise_risk_level_id" placeholder="请选择风险等级" :disabled="disabled">
									<el-option
										v-for="item in levelList"
										:key="item.entrprise_risk_level_id"
										:label="item.enterprise_risk_level_name"
										:value="item.entrprise_risk_level_id"
										:disabled="item.disabled"
									>
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div class="form_title_box_gd">联系信息</div>
				<div class="form_container">
					<el-row :gutter="32">
						<el-col :span="12">
							<el-form-item label="机构编码">
								<el-input v-model="entInfo.enterprise_orgcode" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
							<el-form-item label="邮政编码">
								<el-input v-model="entInfo.enterprise_postal_code" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
							<el-form-item label="电子邮箱">
								<el-input v-model="entInfo.enterprise_email" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="企业法人">
								<el-input v-model="entInfo.enterprise_legal_person" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
							<el-form-item label="联系电话">
								<el-input v-model="entInfo.enterprise_phone" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
							<el-form-item label="传真">
								<el-input v-model="entInfo.enterprise_faxes" class="form_input_w" :disabled="disabled"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</div>
				<div class="form_title_box_gd">高级设置</div>
				<div class="form_container">
					<!-- <el-form-item label="定位">
						<el-input
							v-model="form.location"
							class="form_input_w"
							:disabled="disabled"
							prefix-icon="el-icon-location-outline"
						>
						</el-input>
						<el-button type="primary" class="ml-8 ">定 位</el-button>
					</el-form-item> -->
				</div>
				<div class="form_container">
					<el-form-item label="厂区平面图">
						<img v-if="disabled" :src="entInfo.enterprise_img_info.source" style="width: 100%; height: 100px">
						<el-upload
							class="content-uploader"
							accept="image/png,image/bmp,image/gif,image/jpg,image/jpeg"
							action="/proxy/file/upload"
							:show-file-list="false"
							:on-success="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img v-if="entInfo.enterprise_img_info.source" :src="entInfo.enterprise_img_info.source" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
				</div>

				<!-- <el-form-item>
				<el-button type="primary" @click="onSubmit">立即创建</el-button>
				<el-button>取消</el-button>
				</el-form-item> -->
			</el-form>
		</div>
	</div>
</template>
<script>
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
export default {
	data() {
		return {
			entInfo: {},
			modifyFlag: false, // 修改的时间是false
			dialogVisible: false,
			disabled: true, //true不可以修改
			permBtn: {
				alarm_find: false
			},
			height: 540,
			listLoading: false,
			//列表查询参数
			listQuery: {},
			levelList: [],//风险等级列表
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
		vm.getLevelList();
		vm.getList();
		vm.$nextTick(function() {
			utils.getTableHeight(height => {
				this.height = height + 70 + 'px';
			});
		});
	},
 	 methods: {
		//获取当前页面的权限
		getPerm() {
			this.permBtn = utils.permsButton(this);
		},

		//获取列表数据
		//isBackHome 是否返回首页
		getList(isBackHome = false) {
			let vm = this;
			vm.listLoading = true;
			let param = JSON.parse(JSON.stringify(vm.listQuery));
			param.jsonText = '';
			vm.$instance.post("/proxy/enterprise/enterprise/getEnterpriseInfo", param).then(res => {
				vm.listLoading = false;
				if (res.data.status == '1') {
					vm.entInfo = res.data.data.enterprise_info;
				} else {
					Message.error({ message: "调用接口失败" });
				}
			}).catch(error => {
				vm.listLoading = false;
			});
		},

		//获取风险等级列表
		getLevelList() {
			let vm = this;
			let param = JSON.parse(JSON.stringify(vm.listQuery));
			param.jsonText = '';
			vm.$instance.post("/proxy/Enterprise/Enterprise/getEnterpriseRiskLevelList", param).then(res => {
				if (res.data.status == '1') {
					vm.levelList = res.data.data.enterprise_risk_level_list;
				} else {
					Message.error({ message: "调用接口失败" });
				}
			}).catch(error => {
				vm.listLoading = false;
			});
		},

		handleAvatarSuccess(response, file, fileList){
			this.entInfo.enterprise_img = response;
			
		},

		beforeAvatarUpload(file){
			let size = file.size / 1024  / 1024 < this.$imgMaxSize? 1: 0;       
				if(!size) {            
					this.$message({                
					message: '上传文件大小不能超过2M',                
					type: 'error'            
				});   
				return false     
			} 
		}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 160px;
        height: 160px;
        line-height: 160px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        height: 180px;
        display: block;
    }
</style>
