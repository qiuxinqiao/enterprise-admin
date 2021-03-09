/*
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 异步按需加载 echart
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-05-20 09:41:34
 */

const initEcharts = equireAsync([
    'graphic',
    'line',
    'grid',
    'title',
    'geo',
    'legend',
    'scatter',
    'effectScatter',
    'toolbox',
    'dataZoom',
    'pie',
    'bar',
    'tooltip',
    'map',
])

export default initEcharts