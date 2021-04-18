/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 用户信息的store：用户信息state状态管理
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-05-05 16:28:02
 */

import Cookies from 'js-cookie';
import { api } from 'src/global/api';
import { Message } from 'element-ui';
import instance from 'src/global/http';
import router from 'src/router'; // 路由
import axios from 'axios';
import Base64 from '../../../static/base64';

const user = {
	// state状态 类似于vue中的data
	state: {
		mapState: false, // 地图加载状态
		uid: '', // 用户名
		password: '', // 密码
		routerPath: Cookies.get('routerPath'), // 路由重定向
		userInfo: null, // 用户信息
		deptList: [] //所有部门
	},
	// Vuex 中的 mutation 类似于事件  第一个参数是state 传入额外的参数，即 mutation 的 载荷（payload）
	// mutations,里面装着一些改变数据方法的集合，处理数据逻辑方法全部放在mutations里面，使得数据和视图分离。
	mutations: {
		// 设置地图加载状态
		SET_MAPSTATE: (state, mapState) => {
			state.mapState = mapState;
		},
		// 设置用户ID
		SET_UID: (state, uid) => {
			state.uid = uid;
		},
		// 设置密码
		SET_PWD: (state, password) => {
			state.password = password;
		},
		// 设置路由重定向的路由
		SET_PATH: (state, routerPath) => {
			state.routerPath = routerPath;
		},
		// 设置userInfo
		SET_USERINFO: (state, userInfo) => {
			state.userInfo = userInfo;
		},
		// 设置deptList
		SET_DEPTLIST: (state, deptList) => {
			state.deptList = deptList;
		},
		// 登录成功打印日志
		LOGIN_SUCCESS: () => {
			console.log('login success');
		}
	},
		// 通过action commit 找到相对应的mutations  来改变state
	actions: {
		// 登录
		Login({ commit }, loginParam) {
			// es6 Promise 是一个对象，从它可以获取异步操作的消息 resolve函数的作用是，
			// 将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），
			// 在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；reject函数的作用是，
			// 将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。
			return new Promise((resolve, reject) => {
				// console.log('登录入参：', userInfo);
				// 调用接口
				let obj = {
					username: loginParam.param.username,
					password: loginParam.param.password
				}
				let param = {
					device_type: 30,
					jsonText: JSON.stringify(obj),

				}
				instance.post('/proxy/users/users/quickLogin', param).then(res => {
					if (res.status == 200 && res.data.status == '1') {
						let userInfo = res.data.data.user_info;
						Cookies.set('username', obj.username, { expires: 14, path: '' }); // 设置token
						Cookies.set('userInfo', userInfo, { expires: 14, path: '' }); // 设置userInfo
						commit('SET_USERINFO', userInfo); // 设置用户信息userInfo
						Cookies.set('refresh', true); // 设置是否刷新参数refresh
						if (loginParam.param.checked) {
							const base = new Base64();
							const basePassWord = base.encode(obj.password); // base64加密设置密码
							Cookies.set('password', basePassWord, { expires: 14, path: '' });
							commit('SET_PWD', obj.password); // 修改密码
						} else {
							Cookies.set('password', ''); // 设置密码
							commit('SET_PWD', ''); // 修改密码
						}
						commit('SET_UID', obj.username); // 修改用户
						let deptObj = {
							pagination: {
								page : "0",
								count : "10"
							}
						}
						let deptParam = {
							user_id: userInfo.user_id,
							enterprise_id: userInfo.enterprise_info.enterprise_id,
							token: userInfo.token,
							device_type: 30,
							jsonText: JSON.stringify(deptObj)
						}
						instance.post('/proxy/enterprise/department/getDepartmentList', deptParam).then(data => {
							if(data.data.status == 1) {
								commit('SET_DEPTLIST', data.data.data.department_list); // 设置deptList
							}
						})
						resolve(); // 异步操作成功
					} else {
						reject(res.data.errorMsg);
					}
				}).catch(error => {});
			});
		},

		// 获取用户信息
		GetMenu({ dispatch, commit, state }) {
			return new Promise((resolve, reject) => {
				instance.get('./static/api/menu.json', {}).then(res => {
					if (res.status == 200) {
						// const menusArr = menus.data.menus; // 转为对象
						// const perms = menus.data.perms; // 转为对象
						const menusArr = res.data.data.menus; // 转为对象
						const perms = res.data.data.perms; // 转为对象
						commit('SET_USERINFO', Cookies.get('userInfo')); // 设置用户信息userInfo
						// 只适用于二级菜单
						for (let index = 0; index < menusArr.length; index++) {
							if (menusArr[index].children && menusArr[index].children.length > 0) {
								for (let ind = 0; ind < menusArr[index].children.length; ind++) {
									if (menusArr[index].children[ind].frontRouting.indexOf('/') != -1) {
										menusArr[index].frontRouting = menusArr[index].children[ind].frontRouting.split('/')[1]; // 一级菜单的路由为二级菜单的第1个/之后的
									} else {
										menusArr[index].frontRouting = 'frontRouting' + Math.random();
									}
								}
							}
						}
						let paths = '';
						if (menusArr.length > 0) {
							if (menusArr[0].children) {
								if (menusArr[0].children.length == 0) {
									paths = menusArr[0].frontRouting;
								} else {
									paths = menusArr[0].children[0].frontRouting;
								}
							} else {
								paths = menusArr[0].frontRouting;
							}
						}
						Cookies.set('routerPath', paths);
						commit('SET_PATH', paths); // 设置路由重定向的路由
					
						dispatch('GenerateRoutes', menusArr); // dispatch触发permission 的GenerateRoutes的action  设置菜单

						dispatch('GeneratePerms', perms); // dispatch触发permission 的GenerateRoutes的action  设置权限
						resolve();
					} else {
						Message.error({
							message: '调用接口失败'
						});
					}
				});
			});
		},
			// 第三方验证登录
		LoginByThirdparty({ commit, state }, code) {
			return new Promise((resolve, reject) => {
				commit('SET_CODE', code);
				loginByThirdparty(state.status, state.email, state.code, state.auth_type).then(response => {
					commit('SET_TOKEN', response.data.token); // 修改token
								// Cookies.set('userToken', response.data.token);//cookies设置token
					resolve();
				}).catch(error => {
					reject(error);
				});
			});
		},

		// 退出登录 （头部登出）
		LogOut({ commit, state }) {
			return new Promise((resolve, reject) => {
				let userInfo = JSON.parse(state.userInfo);
				let param = {
					user_id: userInfo.user_id,
					enterprise_id: userInfo.enterprise_info.enterprise_id,
					token: userInfo.token,
					device_type: 30,
					jsonText: ''
				}
				instance.post('/proxy/users/users/logout', param).then(res => {
					if (res.data.status == 1) {
						Cookies.remove('refresh'); // 移除cookies的refresh  是否刷新
						commit('SET_UID', ''); // 修改用户
						router.replace({
							path: '/login'
						});
						resolve(); // 异步操作成功
					} else {
						Message.error(res.data.msg);
					}
				}).catch(error => {});
			});
		},
		// 动态修改权限
		ChangeRole({ commit }, role) {
			return new Promise(resolve => {
				dispatch('GenerateRoutes', res.permissions); // dispatch触发permission 的GenerateRoutes的action
				resolve();
			});
		}
	}
};
export default user;