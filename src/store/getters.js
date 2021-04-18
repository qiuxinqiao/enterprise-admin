/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: getter可以是store 的计算属性，类似于vue中的computed计算属性
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-05-06 14:34:31
 */

const getters = {
    mapState: state => state.user.mapState,
    uid: state => state.user.uid, //用户id
    routerPath: state => state.user.routerPath, //路由重定向
    userInfo: state => state.user.userInfo, //用户所有信息
    deptList: state => state.user.deptList, //所有部门信息

    sidebar: state => state.app.sidebar, //navbar中的点击小图标 菜单可以伸缩的

    alarmData: state => state.carTable.alarmData, //报警 alarm_type  从字典数据中获取alarm_type 数据
    breadcrumbList: state => state.permission.breadcrumbList, // 面包屑数据
    visitedViews: state => state.tagsView.visitedViews,

    //菜单
    permission_routers: state => {
        // 对应permission.js中的state.routers
        return state.permission.routers;
    },
    //权限
    permission_perms: state => {
        // 对应permission.js中的state.perms
        return state.permission.perms;
    },
    addRouters: state => state.permission.addRouters
};
export default getters