<!--
 * @Author: qiaozp
 * @Date: 2019-05-10 16:41:50
 * @LastEditors: qiaozp
 * @LastEditTime: 2019-05-21 14:58:45
 * @Description: 圆形
 -->

<template>
    <div class="scroll-container" ref="scrollContainer">
        <div :ref="refName" class="echars-line"></div>
    </div>
</template>

<script>
import initEcharts from "src/utils/initEchart";
export default {
    name: "scrollPane",
    data() {
        return {
            myChart: null
        };
    },
    props: ["refName"],
    mounted() {},
    methods: {
        drawEcharts(a,b) {
            initEcharts().then(echarts => {
                let name = this.refName;
                this.myChart = echarts.init(this.$refs[name]);
                this.myChart.setOption({
                    title: {},
                    tooltip: {
                        trigger: "item",
                        extraCssText: "height:60px;",
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        right: 0,
                        bottom: 0,
                        itemHeight: 6,
                        itemWidth: 10,
                        data: ["已复工", "未复工"]
                    },

                    calculable: true,
                    color: ["#00af6d", "#0e6de9"],
                    series: [
                        {
                            name: "园区企业",
                            type: "pie",
                            radius: [0, 85],
                            center: ["50%", "45%"],
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            },
                            lableLine: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data: [
                                { value: a, name: "已复工" },
                                { value: b, name: "未复工" }
                            ]
                        }
                    ]
                });
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.echars-line {
    width: 100%;
    height: 260px;
}
</style>
