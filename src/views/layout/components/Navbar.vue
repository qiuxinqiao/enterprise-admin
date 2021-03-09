<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 头部
 * @Date: 2019-04-23 17:24:36
 * @LastEditTime: 2019-05-21 16:59:31
 -->
<template>
  	<div class="tags-view-container">
		<!-- <scroll-pane class="tags-view-wrapper" ref="scrollPane"> -->
			<!-- <router-link
				ref="tag"
				class="tags-view-item"
				:class="isActive(tag)?'active':''"
				v-for="tag in Array.from(visitedViews)"
				:to="tag.path"
				:key="tag.path"
				@contextmenu.prevent.native="openMenu(tag,$event)"
			>
				{{tag.name}}
				<span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"></span>
			</router-link> -->

			<el-menu class="navbar">
				<div class="right-menu">
					<el-dropdown class="avatar-container right-menu-item" trigger="click">
						<div class="avatar-wrapper">
							<img src="../../../assets/img/login-peo.png">
						<span v-if="userInfo.nick">{{userInfo.nick}}</span>
						<span v-else>管理员</span>
						<i class="el-icon-caret-bottom"></i>
						</div>
						<el-dropdown-menu slot="dropdown">
						<router-link to="/user/Personal">
							<el-dropdown-item>个人资料</el-dropdown-item>
						</router-link>
						<el-dropdown-item>
							<span @click="dialogFormVisible = true">修改密码</span>
						</el-dropdown-item>
						<el-dropdown-item divided>
							<span @click="logout" style="display:block;">退出登录</span>
						</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-menu>
		<!-- </scroll-pane> -->

		<ul class="contextmenu" v-show="visible" :style="{left:left+'px',top:top+'px'}">
			<li @click="closeSelectedTag(selectedTag)">关闭当前</li>
			<li @click="closeOthersTags">关闭其它</li>
			<li @click="closeAllTags">关闭所有</li>
		</ul>

		<!-- 修改密码弹窗 -->
		<el-dialog title="密码修改" class="boxres dialog_input pass_form" :visible.sync="dialogFormVisible" top="10%" width="480px"  
			ock-scroll @close="$refs.passForm.resetFields()" :close-on-press-escape="false" :modal-append-to-body="false" >
			<el-form class="small-space" ref="passForm" :model="passForm" :rules="passFormRules" label-position="right" label-width="100px" style="width: 400px; " element-loading-text="拼命加载中">
				<el-form-item label="原密码" prop="oldPassword">
					<el-input type="password" v-model="passForm.oldPassword" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="新密码" prop="password">
					<el-input type="password" v-model="passForm.password" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="passForm.checkPass" auto-complete="off"></el-input>
				</el-form-item>

				<el-form-item class="formButton">
					<el-button @click="cancel" style="margin-bottom: 20px;">取 消</el-button>
					<el-button @click="resetForm('passForm')" style="margin-bottom: 20px;">重置</el-button>
					<el-button type="primary" @click.native.prevent="handlePwdModifySubmit('passForm')" style="margin-bottom: 20px;">确 定</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
  	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import ScrollPane from "@/components/ScrollPane";
	import Breadcrumb from "@/components/Breadcrumb";
	import Hamburger from "@/components/Hamburger";
	import TagsView from "./Navbar";
	import Cookies from "js-cookie";
	import { validate } from "src/utils/validate";
	import { Message } from "element-ui";
 
export default {
	components: {
		ScrollPane,
		Breadcrumb,
		Hamburger,
		TagsView
	},
  	data() {
		const vm = this;
		//验证新旧密码不一致
		const validateOldPassword = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入重置密码"));
			} else if (value === vm.passForm.oldPassword) {
				callback(new Error("新旧密码不能一致"));
			} else {
				if (vm.passForm.checkPass !== "") {
					vm.$refs.passForm.validateField("checkPass"); //对部分表单字段进行校验的方法
				}
				callback();
			}
		};
		//验证密码
		const validateCheckPass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== vm.passForm.password) {
				callback(new Error("两次输入密码不一致"));
			} else {
				callback();
			}
		};
		return {
			visible: false,
			top: 0,
			left: 0,
			selectedTag: {},
			dialogFormVisible: false,
			passForm: {
				oldPassword: "",
				password: "",
				checkPass: ""
			},
			passFormRules: {
				oldPassword: [
					{ required: true, trigger: "blur", message: "原密码不能为空" },
					{ required: true, trigger: "blur", validator: validate.validatePass }
				],
				password: [
					{ required: true, trigger: "blur", message: "新密码不能为空" },
					{ required: true, trigger: "blur", validator: validateOldPassword },
					{ required: true, trigger: "blur", validator: validate.validatePass }
				],
				checkPass: [
					{ required: true, trigger: "blur", message: "确认密码不能为空" },
					{ required: true, trigger: "blur", validator: validateCheckPass },
					{ required: true, trigger: "blur", validator: validate.validatePass }
				]
			},
		};
	},
	computed: {
		visitedViews() {
			return this.$store.state.tagsView.visitedViews;
		},
		...mapGetters(["sidebar", "name", "userInfo"])
	},
	watch: {
		$route() {
			this.addViewTags();
			this.moveToCurrentTag();
		},
		visible(value) {
			if (value) {
				document.body.addEventListener("click", this.closeMenu);
			} else {
				document.body.removeEventListener("click", this.closeMenu);
			}
		}
	},
	mounted() {
		let vm = this;
		vm.addViewTags();
		$(document).bind("click", function(e) {
			let target = $(e.target);
			if (target.closest("#alarmCard, #warnNum").length == 0) {
				vm.isShow = false;
			}
			e.stopPropagation();
		});
	},
	methods: {
		generateRoute() {
			if (this.$route.name) {
				return this.$route;
			}
			return false;
		},
		isActive(route) {
			return route.path === this.$route.path || route.name === this.$route.name;
		},
		addViewTags() {
			const route = this.generateRoute();
			if (!route) {
				return false;
			}
			this.$store.dispatch("addVisitedViews", route);
		},
		moveToCurrentTag() {
			const tags = this.$refs.tag;
			this.$nextTick(() => {
				for (const tag of tags) {
					if (tag.to === this.$route.path) {
						this.$refs.scrollPane.moveToTarget(tag.$el);
						break;
					}
				}
			});
		},
		closeSelectedTag(view) {
			this.$store.dispatch("delVisitedViews", view).then(views => {
				if (this.isActive(view)) {
					const latestView = views.slice(-1)[0];
					if (latestView) {
						this.$router.push(latestView.path);
					} else {
						this.$router.push("/");
					}
				}
			});
		},
		closeOthersTags() {
			this.$router.push(this.selectedTag.path);
			this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
				this.moveToCurrentTag();
			});
		},
		closeAllTags() {
			this.$store.dispatch("delAllViews");
			this.$router.push("/");
		},
		openMenu(tag, e) {
			this.visible = true;
			this.selectedTag = tag;
			this.left = e.clientX;
			this.top = e.clientY;
		},
		closeMenu() {
			this.visible = false;
		},
		toggleSideBar() {
			this.$store.dispatch("toggleSideBar");
		},
		logout() {
			this.$store.dispatch("LogOut").then(() => {
				location.reload();
			});
		},
		alarmListHide() {
			this.isShow = false;
			this.$router.push({
				name: "告警监控"
			});
		},

		cancel() {
			this.dialogFormVisible = false;
			this.resetForm("passForms");
		},

		//修改密码
		handlePwdModifySubmit(formName) {
			let vm = this;
			validate.isValidate(vm, formName, formData => {
				if (formData.validates) {
					let param = {};
					param.oldpassword = vm.passForm.oldPassword;
					param.password = vm.passForm.password;
					vm.$instance.post("/proxy/sysmgr/account/modifyPassword", param).then(res => {
						if (res.status == 200) {
							if (res.data.success) {
								Message.success({ message: res.data.errorMsg });
								Cookies.set("password", ""); //cookies保存修改密码
								vm.$store.commit("SET_PWD", ""); //state修改密码
								vm.dialogFormVisible = false;
								vm.resetForm(formName);
								//跳回登录
								window.setTimeout(function() {
									vm.logout();
								}, 500);
							} else {
								Message.error({ message: res.data.errorMsg });
								// vm.resetForm(formName);
							}
						} else {
							Message.error({ message: "调用接口失败" });
						}
					}).catch(error => {});
				}
			});
		},

		resetForm(formName) {
			if (this.$refs[formName] !== undefined) {
				this.$refs[formName].resetFields();
			}
		}
	}
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 	@import '../../../assets/css/mixin.scss';
	.box-card {
		position: absolute;
		top: 60px;
		right: 15px;
		z-index: 999;
		border-radius: 5px;
		.more-btn {
			float: right;
			padding: 3px 0;
			color: #3082f3;
			&:hover {
				color: #2069cf;
			}
		}
		.close-card {
			float: right;
			color: #aaa;
			margin-left: 15px;
			margin-top: -10px;
			margin-right: -10px;
			cursor: pointer;
			border-radius: 50%;
			&:hover {
				background: #f56c6c;
				color: #fff;
			}
		}
		.text {
			font-size: 14px;
			cursor: pointer;
			& > span:hover {
				color: #0e6de9;
			}
			i {
				font-size: 12px;
				color: #f4b02d;
				margin-right: 5px;
			}
			a {
				color: #3082f3;
				margin-left: 5px;
				&:hover {
					color: #2069cf;
				}
			}
		}

		.item {
			margin-bottom: 18px;
		}

		.clearfix:before,
		.clearfix:after {
			display: table;
			content: "";
		}
		.clearfix:after {
			clear: both;
		}
	}
	.tags-view-container {
		.navbar {
			height: 80px;
			line-height: 80px;
			border-radius: 0px !important;
			position: fixed;
			top: 0;
			right: 0;
			z-index: 1001;
			width: 0;
			color: #333;
			.errLog-container {
				display: inline-block;
				vertical-align: top;
				color: #888;
			}
			.right-menu {
				color: #888;
				float: right;
				height: 100%;
				&:focus {
					outline: none;
				}
				.warning-item {
					right: 20px;
					cursor: pointer;
				}
				.right-menu-item {
					display: inline-block;
					margin: 0 8px;
					color: #333;
				}
				.screenfull {
					height: 20px;
					color: #888;
				}
				.international {
					vertical-align: top;
					color: #888;
				}
				.theme-switch {
					vertical-align: 15px;
					color: #888;
				}
				.avatar-container {
					height: 80px;
					margin-right: 50px;
						.avatar-wrapper {
							width: 400px;
							text-align: right;
							cursor: pointer;
							margin-top: 30px;
							position: relative;
							font-size: 14px;
						img {
							margin: 0 10px;
						}
						.user-avatar {
							width: 40px;
							height: 40px;
							border-radius: 10px;
							color: #333333;
						}
						.el-icon-caret-bottom {
							position: absolute;
							right: -20px;
							top: 5px;
							font-size: 12px;
							color: #333333;
						}
					}
				}
			}
		}
		.tags-view-wrapper {
			height: 50px;
			border-bottom: 1px solid #d8dce5;
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
			// padding-left: 200px;
			.tags-view-item {
				display: inline-block;
				position: relative;
				height: 26px;
				line-height: 23px;
				border: 1px solid #777;
				color: #777;
				background: #fff;
				padding: 0 8px;
				font-size: 12px;
				margin-left: 5px;
				margin-top: 12px;
				vertical-align: super;
				border-radius: 3px;
				&:first-of-type {
					margin-left: 15px;
				}
				&.active {
					background-color: $NavbarTabColor;
					color: #fff;
					border-color: $NavbarTabColor;
					&::before {
						content: "";
						background: #fff;
						display: inline-block;
						width: 8px;
						height: 8px;
						border-radius: 50%;
						position: relative;
						margin-right: 2px;
					}
				}
			}
		}
		.contextmenu {
			margin: 0;
			background: #fff;
			z-index: 2;
			position: absolute;
			list-style-type: none;
			padding: 5px 0;
			border-radius: 4px;
			font-size: 12px;
			font-weight: 400;
			color: #333;
			box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
			li {
				margin: 0;
				padding: 7px 16px;
				cursor: pointer;
				&:hover {
					background: #eee;
				}
			}
		}
	}
	.el-notification__content {
		font-size: 12px;
	}
	.pass_form .el-input {
		width: 290px !important;
	}
	.warn-icon {
		-webkit-animation: Tada 1s 2s both infinite;
		-moz-animation: Tada 1s 2s both infinite;
		-ms-animation: Tada 1s 2s both infinite;
		animation: Tada 1s 2s both infinite;
	}
	@keyframes Tada {
		0% {
			transform: scale(1);
		}
		10%, 20% {
			transform: scale(0.9) rotate(-3deg);
		}
		30%, 50%, 70%, 90% {
			transform: scale(1.1) rotate(3deg);
		}
		40%, 60%, 80% {
			transform: scale(1.1) rotate(-3deg);
		}
		100% {
			transform: scale(1) rotate(0);
		}
	}
</style>
