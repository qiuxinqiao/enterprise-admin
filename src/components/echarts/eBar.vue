<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 柱状图
 * @Date: 2019-05-05 09:19:02
 * @LastEditTime: 2019-05-21 16:23:30
 -->
<template>
    <div :ref="refName" class="echarts-bar"></div>
</template>

<script>
import initEcharts from "src/utils/initEchart";
export default {
    data() {
        return {
            myChart: null,
            eWidth: "100px",
            eHeight: "100px"
        };
    },
    props: ["refName", "xName", "echartsData"],
    mounted() {
    },
    methods: {
        drawEcharts(x,a,b,c) {
            initEcharts().then(echarts => {
                let name = this.refName;
                // let text = '用户累计用气量：' + this.echartsData.useGasTotal + 'm³；采暖天数' + this.echartsData.heatingDays	+ '天'
                this.myChart = echarts.init(this.$refs[name]);
                this.myChart.setOption({
                    tooltip: {
                        trigger: "axis",
                        extraCssText:'height:80px;',
                        axisPointer: {
                            // 坐标轴指示器，坐标轴触发有效
                            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        right:50,
                        bottom: 0,
                        itemHeight:6,
                        itemWidth:10,
                        data: ["访客人数", "隔离满14天人数", "未离京人数"]
                    },
                    grid: {
                        left: "3%",
                        right: "4%",
                        bottom: "8%",
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: "category",
                            data: x,
                            axisTick: {
                                alignWithLabel: true
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: "value",
                            minInterval: 1,
                        }
                    ],
                    series: [
                        {
                            name: "访客人数",
                            type: "bar",
                            barWidth: "60%",
                            itemStyle: {
                                normal: {
                                    color: "#0e6ed9",
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                    }
                                }
                            },
                            data:a
                        },
                        {
                            name: "隔离满14天人数",
                            type: "line",
                            barWidth: "60%",
                            itemStyle: {
                                normal: {
                                    color: "#e6af08",
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{c}'
                                    }
                                }
                            },
                            data:b
                        }
                    ]
                });
            });
        },

        //清理画布
        clear() {
            this.myChart.clear();
        }
    }
};
</script>

<style lang="scss" scoped>
.bar,
canvas {
    width: 100%;
    top: 10px;
}
.echarts-bar {
    width: 100%;
    height: 260px;
}
</style>
