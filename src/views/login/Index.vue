<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 登录页面组件 
 * @Date: 2019-03-05 16:05:34
 * @LastEditTime: 2019-05-21 15:45:34
 -->
<template>
	<div class="login-container">
		<div class="login-main">
			<el-row class="login-con" :gutter="120"> 
				<el-col :span="12">
					<div class="left-box">
						<img src="../../assets/img/login-box.png">
					</div>
				</el-col>
				<el-col :span="12">
					<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">			
						<div class="login-box"> 
							<p>精诚后台管理系统</p>
							<el-form-item prop="account">
								<el-input prefix-icon="iconfont icon-ef-zhanghao" name="account" v-model="loginForm.username" type="text" autoComplete="off" placeholder="请输入账号" style="width: 100%;" clearable></el-input>
							</el-form-item>
							<el-form-item prop="password">
								<el-input prefix-icon="iconfont icon-mima" name="password" v-model="loginForm.password" type="password" autoComplete="off" placeholder="请输入密码" style="width: 100%;" clearable></el-input>
							</el-form-item>
							<el-checkbox v-model="loginForm.checked">记住密码</el-checkbox>
							<el-form-item class="sub-btn">
								<el-button type="primary" @click.native.prevent="handleLogin" :loading="logining">{{logining ? "登录中..." : "立即登录"}}</el-button>
							</el-form-item>
						</div>
					</el-form>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script>
	import { validate } from 'utils/validate';
	import Cookies from 'js-cookie';
    import { Message } from 'element-ui';
    import Base64 from '../../../static/base64';
    import md5 from 'blueimp-md5';
	import { utils } from 'src/utils';
	import '../../assets/icon/iconfont.css'

	export default {
		name: 'login',
        data() {
			return {
				loginForm: {
					username: 'sxhmjhgfyxgs',
					password: '123',
					checked: true,
				},
				logining: false,
				loginRules: {
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur'},
	                ],
	                password: [
	                    { required: true, message: '请输入密码', trigger: 'blur'}
	                ]
				},
			}
		},
		//计算属性
		computed: {
		    
		},
        //3.在beforeMount和mounted之间，程序将上一步修改好的html内容替换el属性指向的dom对象或者选择权对应的html标签里面的内容
        beforeMount: function() {
        	if(Cookies.get('username')){
				this.loginForm.username = Cookies.get('username');
				if (Cookies.get('password')) {
					let base = new Base64(); 
					this.loginForm.password = base.decode(Cookies.get('password'));
				}
        	}
        },
        mounted() {
			
		},
		//方法
		methods: {
			//登录
			handleLogin() {
				let vm = this;
				//调用方法isValidate  form表单校验  第一个参数this  第二个参数是from表单ref的值  第三个参数是form表单提交参数
				validate.isValidate(vm, "loginForm",(formData)=>{
					if(formData.validates){
						vm.logining = true;
			            vm.$store.dispatch('Login', formData).then((res) => {
							vm.$store.dispatch('GetMenu').then(res => { // 拉取user_info
								vm.$router.push({ path: '/' });  
								vm.logining = false;   
					        }).catch(err => {
								console.log(err);
								vm.logining = false;
							});
		              	}).catch(err => {
							Message.error(err);
							vm.logining = false;
						});
					}
				}, this.loginForm);				
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
	@import "src/assets/css/mixin.scss";
	.login-container {
		@include relative;
		height: 100vh;
		background-color: #fff; 
		background-size: cover;
		.login-header{
			@include height(150px);
			padding-left: 20%;
			img{
				float: left;
				margin-top: 35px
			}
			h1{
				float: left;
				margin-top: 54px;
				margin-left: 30px;
				color: #1880c9;
				letter-spacing: 5px
			}
		}
		.login-main{
			height: 100vh;
			background: url('../../assets/img/login.png') no-repeat;
			padding: 20vh 10% 0 16%;
			.login-con{
				.left-box{
					
				}
				.login-form {
					.login-title {
						margin-bottom: 15px;
						text-align: center;
					}
					.login-box {
						background: #fff;
						padding: 60px 80px 60px 80px;
						border-radius: 10px;
						width: 520px;
						min-width: 300px;
						.el-input__prefix{
							top: 3px;
							left: 8px;
						}
						.iconfont{
							font-size: 24px
						}
						.el-input__inner{
							height: 40px !important;
						}
						.el-form-item{
							margin-bottom: 20px
						}
						input{
							padding-left: 45px;
							border: none;
							border-radius: 0;
							border: 1px solid #dcdcdc;
						}
						p {
							width: 100%;
							height: 60px;
							font-size: 26px;
							text-align: center;
							margin-bottom: 20px;
							letter-spacing: 10px;
							padding-left: -10px;
						}
						.yz-img{
							@include height(40px);
							width: 120px;
							margin-left: 2px;
							@include cursor;
							float: right
						}
						.code-btn{
							@include cursor;
							font-size: 12px;
							margin-left: 2px;
							color: #ef9b1e;
							display:inline-block;
						}
						.el-checkbox__label{
							color: #999;
						}
						.el-checkbox__input.is-checked .el-checkbox__inner{
							border-color: #ef9b1e;
							background-color: #ef9b1e;
						}
						.sub-btn{
							text-align: center;
						}
						.sub-btn button{
							@include cursor;
							@include size(100%, 40px);
							background: #1880c9;
							color: #fff;
							font-size: 20px;
							margin-top: 40px;

							-webkit-transition: all .1s;  //css3 有些浏览器不支持 Chrome || Safari
							-moz-transition: all .1s;  //css3 有些浏览器不支持 Firefox 
							-ms-transition: all .1s;//css3 有些浏览器不支持 IE
							-o-transition: all .1s;//css3 有些浏览器不支持 Opera
							border: none; 
							&:hover{
								background-color: #2069cf;
							}
							&:active{
								background-color: #2069cf;
							}
						}
						.forget-pass{
							float: right;
							background: none;
							color: #999;
							border: none;
						}
					}
				}
			}
		}
	}
</style>