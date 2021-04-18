<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 柱状图
 * @Date: 2019-03-20 11:07:17
 * @LastEditTime: 2019-05-05 08:52:27
 -->
 <template>
    <div :ref=refName :style="{width: '100%', height: eHeight}" class="bar"></div>
</template>

<script>
    import initEcharts  from 'src/utils/initEchart';
    export default {
        data() {
            return {
                myChart: null,
                eWidth: '100px'
            };
        },
        props: ['refName', 'xName', 'yAxis', 'echartsData', 'colors', 'eHeight'],
        watch: {
            echartsData: {
                handler:function(val, oldval){
                    this.drawEcharts();
                },
                deep:true//对象内部的属性监听，也叫深度监听
            }
        },
        mounted () {
            this.setStyle();
            this.drawEcharts();
        },
        methods: {
            setStyle() {
                let vm = this;
            },
            drawEcharts() {
                initEcharts().then(echarts => {
                    let vm = this;
                    let name = vm.refName;
                    vm.myChart = echarts.init(vm.$refs[name]);
                    vm.myChart.setOption({
                        color: vm.colors,
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // Use axis to trigger tooltip
                                type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
                            }
                        },
                        grid: {
                            top: '40px',
                            left: '40px',
                            right: '20px',
                            containLabel: true
                        },
                        legend: {
                            data: vm.xName
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: vm.echartsData.xAxisData
                            }
                        ],
                        yAxis: {
                            type: 'value'
                        },
                        series: vm.echartsData.series
                    });
                })
            },

            //清理画布
            clear() {
                this.myChart.clear()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .bar, canvas {
		width: 100%;
    }
</style>
