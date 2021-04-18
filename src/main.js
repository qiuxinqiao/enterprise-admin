/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 入口文件：加载UI组件、过滤器、store状态、路由跳转等
 * @Date: 2019-04-01 08:58:41
 * @LastEditTime: 2019-04-25 13:55:57
 */

import Vue from 'vue';
import ElementUI from 'element-ui'; //element 组件

import "./assets/css/element-variables.scss"
import "src/assets/icon/iconfont.css";
import router from './router'; //路由
import store from './store'; //状态store
import * as filters from './filters'; // 全局vue 过滤器
import Cookies from 'js-cookie';
import instance from 'src/global/http';
import { Loading } from 'element-ui';
import { utils } from 'src/utils';
import 'assets/css/index.scss'; // 引入的scss样式

//引入图片查看器
import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css'

import App from './App'; //引用app组件
Vue.use(ElementUI); //全局方法 Vue.use() 使用插件  饿了么UI
Vue.prototype.$instance = instance; //将封装的axios挂载到vue的原型上

Vue.config.productionTip = false; //Vue去掉警告 
var loadingInstance; //loading组件

Vue.use(preview); //引入图片查看器
//vue中引用公共过滤器filter
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

//加载用户主题 当主题切换过后会保存到localStorage  记录上一次的记录
/*if( localStorage.getItem('themeValue') ){
    global.changeTheme( localStorage.getItem("themeValue"));
}*/

//遍历vuex的权限列表，假如去到的路径未在true列表中，则直接重定向到401。
const whiteList = ['/login', '/authredirect', '/reset', '/error/401', '/error/404']; // 不重定向白名单
//router.beforeEach注册一个全局的before钩子，在导航触发之前判断是否有权限进入改导航页面。 
router.beforeEach((to, from, next) => {
    if (loadingInstance) {
        loadingInstance.close();
    }
    //NProgress.start(); // 开启Progress
    //在浏览器控制台记录路由跳转
    //console.log(from, '路由---->', to);
    // 判断是否有token。接口会有延迟
    if (Cookies.get('refresh')) {
        if (to.path == '/login') { //当其再访问登录页面（to.path === '/login'）时，可直接重定向到首页
            next({
                path: '/'
            });
        } else if (to.path == '/error/401') {
            next();
        } else if (to.path == '/error/404') {
            next();
        } else {
            //添加loading
            //避免F5刷新时，vex数据全无，所以需要重新获取一次数据
            if (!store.getters.userInfo) { //判断是否有用户信息 把token换成userInfo
                let userInfo = JSON.parse(Cookies.get('userInfo'));
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
                        store.commit('SET_DEPTLIST', data.data.data.department_list); // 设置deptList
                    }
                })
                store.dispatch('GetMenu').then(res => { // 拉取user_info
                    let menusArr = store.getters.permission_routers; //获取用户菜单
                    let flag = false;
                    //浏览器刷新 判断路由是否在菜单里面（有可能菜单权限进行更改）
                    for (let i = 0; i < menusArr.length; i++) {
                        if (flag) {
                            break;
                        } else {
                            if (menusArr[i].children && menusArr[i].children.length > 0) {
                                for (let j = 0; j < menusArr[i].children.length; j++) {
                                    if (menusArr[i].children[j].frontRouting == to.path) {
                                        flag = true;
                                    }
                                }
                            } else {
                                if (menusArr[i].frontRouting == to.path) {
                                    flag = true;
                                }
                            }
                        }
                    }
                    if (flag) {
                        next();
                    } else {
                        if (to.path == "/user/Personal" && from.path == "/") {
                            next();
                        } else {
                            next({ path: '/' });
                        }
                    }
                }).catch(err => {
                    console.log(err);
                });
            } else {
                next();
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next();
        } else {
            next('/login'); // 否则全部重定向到登录页
            //NProgress.done(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        }
    }
    /*store.dispatch('GetMenu').then(res => { // 拉取user_info
      console.log('已获取到用户信息',store.getters.userInfo);          
      console.log('已获取到用户权限信息',store.getters.permission_perms);          
      next(); 
    }).catch(err => {
      console.log(err);
    });*/

    //NProgress.done();
});

//路由注册一个全局的after钩子
router.afterEach(() => {
    //NProgress.done(); // 结束Progress
    if (loadingInstance) {
        loadingInstance.close();
    }
});

//创建vue组件
new Vue({
    el: '#app',
    router, //把router机制注入到 vue 根实例中
    store, //store状态 注入到 vue 根实例中 所有的子组件都可以访问store
    template: '<App/>',
    components: {
        App
    } //components局部注册组件  仅在其作用域中可用的组件
})