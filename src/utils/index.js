/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 公共方法工具类
 * @Date: 2019-03-14 13:50:23
 * @LastEditTime: 2019-05-11 09:33:58
 */

import config from '../../config';
import axios from 'axios';
import instance from 'src/global/http';

export const utils = {
    /**
     * @des  按钮权限的控制
     * @param <Object> vm this
     * @return <Boolean> 看xxx是否成功
     */
  permsButton(vm) {
    const perms = vm.$store.getters.permission_perms; // 按钮权限
    let purl = window.location.href;
        // purl = purl.substr(purl.indexOf(config.dev.port) + 4);//history
    if (purl.substr(purl.indexOf('#') + 1).indexOf('?') != -1) {
      purl = purl.substr(purl.indexOf('#') + 1).split('?')[0];
    } else {
      purl = purl.substr(purl.indexOf('#') + 1); // hash
    }
    let permArr = new Array();
    for (const val in perms) {
      if (perms[val].frontRouting == purl) {
            permArr = perms[val].perm; // 当前路由的按钮的权限
          }
    }
        // 将当前路由的按钮设置为true
    if (permArr) {
      for (const index in permArr) {
            if (vm.permBtn[permArr[index]] != 'undefined') {
                vm.permBtn[permArr[index]] = true;
              }
          }
    }
    return vm.permBtn;
  },
    /**
     * @des  查找字典项
     * @param <String> par 字典类目code编码
     * @param <Function> callback 回调函数
     * @return <Array> 字典类目code编码的所有子集
     */
  dictsByCode(par, callback) {
    if (par) {
      let param = {};
      param.categoryCode = par;
      param = JSON.parse(JSON.stringify(param));
      instance.get('/proxy/dict/findDictsByCode', { params: param }).then(res => {
            if (res.status == 200) {
                const result = res.data;
                typeof callback === 'function' && callback.call(window, result);
                return result;
                resolve(); // 异步操作成功
              } else {
                Message.error({ message: '调用接口失败' });
              }
          }).catch(error => {});
    }
  },
    /**
     * @des  批量查找字典项
     * @param <Array<String>> par 字典类目code编码数组
     * @param <Function> callback 回调函数
     * @return <Object> 字典类目code编码的所有子集
     */
  batchDictsByCode(par, callback) {
    if (par.length > 0) {
      const param = {};
      param.categoryCodes = JSON.parse(JSON.stringify(par));
      instance.get('/proxy/dict/findBatchDictsByCode', { params: param }).then(res => {
            if (res.status == 200) {
                const result = res.data;
                typeof callback === 'function' && callback.call(window, result);
                return result;
                resolve(); // 异步操作成功
              } else {
                Message.error({ message: '调用接口失败' });
              }
          }).catch(error => {});
    }
  },

    /*
     *格式化时间
     */
  setTime(time) {
    let newTime = '';
    const year = time.getFullYear();
    let month = time.getMonth() + 1;
    let day = time.getDate();
    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }
    return newTime = year + '-' + month + '-' + day;
  },
    /**
     * @des  获取url参数
     * @return <String> GET
     */
  getUrlFn() {
    let querystr = window.location.href.split('?'),
      GETs = '',
      GET = '';
    if (querystr[1]) {
      GETs = querystr[1].split('&');
      GET = [];
      for (i = 0; i < GETs.length; i++) {
            tmp_arr = GETs[i].split('=');
            const key = tmp_arr[0];
            GET[key] = tmp_arr[1];
          }
    }
    return GET;
  },
    /**
     * @des  获取url data参数。aa.html?data={}
     * @return <String> GET
     */
  getUrlData() {
    let purl = window.location.href;
    purl = purl.substr(purl.indexOf('?') + 1);
    const urlData = JSON.parse(decodeURI(purl.substr(purl.indexOf('=') + 1)));
    return urlData;
  },
    /**
     * @des  资源树控件遍历解析数据(选中，展开)
     * @return
     */
  paeserPermissionsData(data, checkeds, opens) {
    const vm = this;
    $.each(data, (idx, obj) => {
      if (obj.checked) {
            checkeds.push(obj.menuId);
          }
      if (obj.open) {
            opens.push(obj.menuId);
          }
      if (obj.children) {
            vm.paeserPermissionsData(obj.children, checkeds, opens);
          }
    });
  },
    /**
     * @des  获取table高度（返回值只适合于一种特定的页码高度，本函数主要是提供了延时设置功能，可以在回调函数中自己计算高度）
     * @return
     */
  getTableHeight(callback) {
        // 延时1MS，直接设置高度没有作用
    const t1 = window.setTimeout(() => {
      const h = $('.apps').height();
      const h3 = $('.navbar').height();
      const h1 = $('.filter-container').height(); // 搜索栏
      const h2 = 32; // 页码高度
      callback(h - (h1 || 0) - h2 - (h3 || 0) - 87); // 92主要是所以margin之和
      window.clearTimeout(t1); // 去掉定时器
    }, 1);
  },

    /**
     * @des  设置主内容的默认高度(最小)
     * @return
     */
  setContentHeight() {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; // 浏览器高度
    $('.apps').css({ height: windowHeight - 80 });
  },

    /**
     * @des  导出
     * isGet  是否为get请求
     * @return
     */
  exportLists(listQuery, url, isGet = false) {
    const param = JSON.parse(JSON.stringify(listQuery));
        // 删除分页
    if (param.iDisplayLength) {
      delete param.iDisplayLength;
    }
    if (param.iDisplayStart) {
      delete param.iDisplayStart;
    }

    let type = 'post';
    if (isGet) {
      type = 'get';
    }

    const $iframe = $('<iframe id="down-file-iframe" />');
    const $form = $('<form method="' + type + '" />');
    $form.attr('action', url);
    for (const key in param) {
      $form.append('<input type="hidden" name="' + key + '" value="' + param[key] + '" />');
    }
    $iframe.append($form);
    $(document.body).append($iframe);
    $form[0].submit();
    $iframe.remove();
  },

    /**
     * @des  获取当前时间  年-月-日 时:分:秒
     * @param <String> type: 1 (年月日) 2（时分秒）3（年月日时分秒）; date :中国标准时间
     * @return <String> 格式化后的日期   年-月-日 时:分:秒
     */
  getTodayTime(type, date) {
    let now = ''
    if (date) {
      now = new Date(date);
    } else {
      now = new Date();
    }
    const year = now.getFullYear(); // 年
    const month = now.getMonth() + 1; // 月
    const day = now.getDate(); // 日
    const hh = now.getHours(); // 时
    const mm = now.getMinutes(); // 分
    const ss = now.getSeconds(); // 秒
    let clock = '';
        // 包含年月日
    if (type == 1 || type == 3) {
      clock = year + '-';
      if (month < 10) {
            clock += '0';
          }
      clock += month + '-';
      if (day < 10) {
            clock += '0';
          }
      clock += day + ' ';
    }
        // 包含时分秒
    if (type == 2 || type == 3) {
      if (hh < 10) {
            clock += '0';
          }
      clock += hh + ':';
      if (mm < 10) {
            clock += '0';
          }
      clock += mm + ':';
      if (ss < 10) {
            clock += '0';
          }
      clock += ss;
    }
    return clock;
  },
    /**
     * @des  报警key转value
     * @param <String> keys: 多个告警逗号分隔
     * @param <String> vm: this
     * @return <String> 转换后的值，多个告警逗号分隔
     */
  convertAlarmType(keys, vm) {
    let vlaues = '';
    if (!keys || keys.length == 0 || keys == 0) {
      vlaues = '暂无数据';
    } else {
      const keyArray = keys.split(',');
      const keyValueObj = vm.$store.getters.alarmData;
      if (!keyValueObj) {
            this.loadAlarmType(vm);
            return keys;
          }
      keyArray.forEach(key => {
            if (key == '') {
                return;
              }
            if (vlaues != '') {
                vlaues += ',';
              }
            vlaues += keyValueObj[key];
          });
    }
    return vlaues;
  },

    /**
     * @des  加载报警数组
     * @param <String> vm: this
     */
  loadAlarmType(vm) {
    if (!vm.$store.getters.alarmData) {
      vm.$store.dispatch('GetAlarmData');
    }
  },


    /**
     * 删除是否返回上一页
     * currentPage:当前页   total：总条数  pageLength:每一页的条数
     * return true返回上一页   false刷新当前页
     */
  deleteIsBackBeforePage(currentPage, total, pageLength) {
    if (currentPage == 1 || currentPage < Math.ceil(total / pageLength)) {
      return false;
    } else if (total % pageLength == 1) {
        return true;
      } else {
        return false;
      }
  },

    // 转化时间(默认时间的获取)
  turnTime(time) {
    let newDataTime = '';
    if (typeof time == 'string') { // time = "2018-05-01"
      newDataTime = time;
    } else { // time = Thu May 10 2018 17:55:10 GMT+0800 (中国标准时间)
      newDataTime = time.getFullYear() + '-' + this.checkTimeAdd0(time.getMonth() + 1) + '-' + this.checkTimeAdd0(time.getDate());
    }
    return newDataTime;
  },

    // 时间<10,添0
  checkTimeAdd0(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  },
    /**
     * @des  获取菜单名称
     * @param <Array> menuArr 菜单数组
     * @param <Array> routerArr 当前宣中路有数组
     * @return <Array> 菜单名称数组
     **/
  getMenuName(menuArr, routerArr, menuNameArr = []) {
    const arr = menuNameArr || []
    menuArr.forEach(item => {
      if (item.frontRouting.search(routerArr[0]) > -1 || routerArr[0].search(item.frontRouting) > -1) {
                // arr.push(item.menuName)
            const name = item.menuName
            arr.push(name)
            if (item.children && item.children.length > 0) {
                this.getMenuName(item.children, [routerArr[1]], arr)
              }
          }
    })
    return menuNameArr
  },
    /**
     * @des  数组排序
     * @param <Array> array 数组
     * @return <Array> 新数组
     **/
  compare(array) {
    return function(a, b) {
      const value1 = a[array];
      const value2 = b[array];
      return value1 - value2;
    }
  },
    /**
     * 两个时间的比较大小
     */
  compareDate(date1, date2) {
    const oDate1 = new Date(date1);
    const oDate2 = new Date(date2);
    if (oDate1.getTime() > oDate2.getTime()) {
      return true; // 第一个大
    } else {
      return false; // 第二个大
    }
  }
};