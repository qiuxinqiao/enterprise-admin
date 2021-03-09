/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 一些业务的公共数据（报警类型、组织机构树等）
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-05-06 14:34:17
 */

import { Message } from 'element-ui';
import { utils } from 'src/utils';
import instance from 'src/global/http';

const carTable = {
    state: {
        alarmData: null
    },
    mutations: {
        //报警数据
        SET_ALARMData: (state, alarmData) => {
            state.alarmData = alarmData;
        }
    },
    actions: {

        GetAlarmData({ commit }) {
            return new Promise(resolve => {
                //获取报警key-vlue数组，保存等待后面使用
                utils.dictsByCode("alarm_type", (res) => {
                    var data = {};
                    // 将数据转成key-value键值对，方便后边使用
                    res.forEach(element => {
                        data[element.dictCode] = element.dictName;
                    });
                    commit('SET_ALARMData', data);
                    resolve();
                });
            });
        },
    }
};
export default carTable;