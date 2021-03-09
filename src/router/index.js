/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description:  路由配置
 * @Date: 2019-03-05 16:21:46
 * @LastEditTime: 2019-05-05 16:51:15
 */

import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/index.js'; //状态store
//webpack热加载在开发环境下会很慢，因此只在生产环境下进行懒加载
const _import = require('./_import_' + process.env.NODE_ENV);
/* 布局以及菜单*/
import Layout from '../views/layout/Layout';

/* login 登录找回密码 以及重置密码*/
const Login = _import('login/Index');

/* 个人信息 */
const Personal = _import('login/Personal');

/* 错误页面 */
const Err404 = _import('error/404');
const Err401 = _import('error/401');

/*企业信息 */
const CasicInfo = _import('enterpriseInfo/basicInfo');//基础信息
const QualificationFile = _import('enterpriseInfo/qualificationFile');//资质档案
const Organization = _import('enterpriseInfo/organization');//组织机构

/*风险辨识*/
const Building = _import('identification/building');//建筑购物
const Euipment = _import('identification/equipment');//设备设施
const Operational = _import('identification/operational');//作业活动
const Accessories = _import('identification/accessories');//原辅料

/*风险管控 */
const RiskPoint = _import('risk/riskPoint');//风险点列表
const ResponsibilityList = _import('risk/responsibilityList');//风险管控责任清单
const MeasuresList = _import('risk/measuresList');//风险管控措施清单
const RiskMap = _import('risk/riskMap');//风险分布图
const RiskChart = _import('risk/riskChart');//风险统计图
const RiskBook = _import('risk/riskBook');//风险防控手册

/*隐患管理 */
const DangerChecklist = _import('danger/dangerChecklist');//隐患排查清单
const Checklist = _import('danger/checklist');//检查表

/*法律法规 */
const Law = _import('laws/law');//法律法规
const PolicyFiles = _import('laws/policyFiles');//政策文件

/*系统管理 */
const AccountManage = _import('sysmgr/AccountManage');//用户管理
const RoleManage = _import('sysmgr/RoleManage');//角色管理

Vue.use(Router); //全局方法 Vue.use() 使用插件
/**
 * hidden : true不显示在菜单栏
 * redirect : 设置重定向，noredirect是不重定向
 * noDropdown : true 不显示子菜单
 * meta : { role: ['admin'] }  will control the page role
 * children:嵌套路由,component必不可少，先进入父路由
 **/
const constantRouterMap = [
    //登录、找回密码、重新设置密码、以及401、404
    { path: '/login', component: Login, hidden: true },
    { path: '/error/404', component: Err404, hidden: true }, //假地址时重定向
    { path: '/error/401', component: Err401, hidden: true },

    //路由 /  重定向到首页
    {
        path: '/',
        //redirect: '/lbs/CarGps',  //路由为 / 就重定向到默认首页
        redirect: to => {
            // 方法接收 目标路由 作为参数  return 重定向的 字符串路径/路径对
            let paths = "";
            if (store.getters.routerPath && store.getters.routerPath) {
                paths = store.getters.routerPath;
            } else {
                paths = '/user/Personal';
            }
            return paths;
        },
        hidden: true,
    }, {
        path: '/user',
        component: Layout,
        redirect: 'noredirect',
        name: '个人信息',
        children: [
            { path: 'Personal', component: Personal, name: '个人中心' }
        ]
    }, {
        path: '/enterpriseInfo',
        component: Layout,
        redirect: 'noredirect',
        name: '企业信息',
        children: [
            { path: 'basicInfo', component: CasicInfo, name: '基础信息' },
            { path: 'qualificationFile', component: QualificationFile, name: '资质档案' },
            { path: 'organization', component: Organization, name: '组织机构' },
        ]
    }, {
        path: '/identification',
        component: Layout,
        redirect: 'noredirect',
        name: '风险辨识',
        children: [
            { path: 'building', component: Building, name: '建筑购物' },
            { path: 'euipment', component: Euipment, name: '设备设施' },
            { path: 'operational', component: Operational, name: '作业活动' },
            { path: 'accessories', component: Accessories, name: '原辅料' }
        ]
    }, {
        path: '/risk',
        component: Layout,
        redirect: 'noredirect',
        name: '风险管控',
        children: [
            { path: 'riskPoint', component: RiskPoint, name: '风险点列表' },
            { path: 'responsibilityList', component: ResponsibilityList, name: '风险管控责任清单' },
            { path: 'measuresList', component: MeasuresList, name: '风险管控措施清单' },
            { path: 'riskMap', component: RiskMap, name: '风险分布图' },
            { path: 'riskChart', component: RiskChart, name: '风险统计图' },
            { path: 'riskBook', component: RiskBook, name: '风险防控手册' },
        ]
    }, {
        path: '/danger',
        component: Layout,
        redirect: 'noredirect',
        name: '隐患管理',
        children: [
            { path: 'dangerChecklist', component: DangerChecklist, name: '隐患排查清单' },
            { path: 'checklist', component: Checklist, name: '检查表' }
        ]
    }, {
        path: '/laws',
        component: Layout,
        redirect: 'noredirect',
        name: '法律法规',
        children: [
            { path: 'law', component: Law, name: '法律法规' },
            { path: 'policyFiles', component: PolicyFiles, name: '政策文件' },
        ]
    }, {
        path: '/sysmgr',
        component: Layout,
        redirect: 'noredirect',
        name: '系统管理',
        children: [
            { path: 'accountManage', component: AccountManage, name: '用户管理' },
            { path: 'roleManage', component: RoleManage, name: '角色管理' },
        ]
    },
    { path: '*', redirect: '/error/404', hidden: true }
];



//创建router 对路由constantRouterMap进行管理
export default new Router({
    mode: 'hash', //开启history模式保证spa可以和以前的网页一样可以前进和后退  hash
    scrollBehavior: () => ({ y: 0 }), //路由跳转保持原先的滚动位置，支持 history.pushState 的浏览器中可用。
    routes: constantRouterMap //嵌套路由组
});