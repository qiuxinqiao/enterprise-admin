/*
 * @Author: qiaozp 
 * @Date: 2021-03-17 10:58:26 
 * @Description: 统计图
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-26 11:13:14
 */
<template>
    <div v-bind:style="{height: height}" class="box">
        <div v-bind:style="{height: chartHeight}">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">所有各类别作业统计</div>
                        <e-bar ref="bar1" :refName="'bar1'" :echartsData='echartsData' :xName="''" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
                <el-col :span="12" class="col-right">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">各部门作业活动分布图</div>
                        <e-bar ref="bar2" :refName="'bar2'" :echartsData='echartsData1' :xName="xName1" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-bind:style="{height: chartHeight}" class="workFactor">
            <div class="chart-title">各部门作业频次统计</div>
            <e-bar ref="bar3" :refName="'bar3'" :echartsData='echartsData2' :xName="xName2" :eHeight='chartHeight' :colors="colors"></e-bar>
        </div>
    </div>
</template>
<script>
    import { utils } from 'src/utils';
    import initEcharts from "src/utils/initEchart";
    import eBar from '../../../components/echarts/eBar';
    export default {
        components: {
            eBar
        },
        data() {
            return {
                height: 500,
                chartHeight: 500,
                echartsData: {
                    xAxisData: ['日常检查', '检维修作业', '特种作业', '生产作业', '许可作业'],
					series: [{
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: [1, 2, 1, 1, 1]
                    }]
                },
                echartsData1: {
                    xAxisData: ['部门1', '部门2', '部门3'],
					series: [
                        {
                            name: '日常检查',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '检维修作业',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '特种作业',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '生产作业',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '许可作业',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [820, 832, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                echartsData2: {
                    xAxisData: ['部门1', '部门2', '部门3'],
					series: [
                        {
                            name: '连续暴露',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '每天工作时间内暴露',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '每周一次或偶然暴露',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '每月一次暴露',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 154, 190, 330, 410]
                        },
                        {
                            name: '每年几次暴露',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [820, 832, 901, 934, 1290, 1330, 1320]
                        },
                        {
                            name: '非常罕见地暴露',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [820, 832, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                xName1: ['日常检查', '检维修作业', '特种作业', '生产作业', '许可作业'],
                xName2: ['连续暴露', '每天工作时间内暴露', '每周一次或偶然暴露', '每月一次暴露', '每年几次暴露', '非常罕见地暴露'],
                colors: ['#5470C6', '#FAC858', '#FAA058', '#EE6666', '#D066EE', '#8C44DD'],
            }
        },
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
				this.chartHeight = (height + 60)  / 2 + 'px';
			});
            this.$refs.bar1.drawEcharts();
            this.$refs.bar2.drawEcharts();
            this.$refs.bar3.drawEcharts();
		},
        methods: {
            
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>
