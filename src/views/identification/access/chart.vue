/*
 * @Author: qiaozp 
 * @Date: 2021-03-17 10:58:26 
 * @Description: 统计图
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-26 10:51:44
 */
<template>
    <div v-bind:style="{height: height}" class="box">
        <div v-bind:style="{height: chartHeight}">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">各类别原辅料分布图</div>
                        <e-ring ref="echart1" :refName="'echart1'" :echartsData='echartsData1' :eHeight='chartHeight' :colors="colors"></e-ring>
                    </div>
                </el-col>
                <el-col :span="12" class="col-right">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">部门1：各类别原辅料统计</div>
                        <e-bar ref="echart2" :refName="'echart2'" :echartsData='echartsData2' :xName="''" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-bind:style="{height: chartHeight}" class="bottom-chart">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">校长办公室：各类别原辅料统计</div>
                        <e-bar ref="echart3" :refName="'echart3'" :echartsData='echartsData3' :xName="''" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
                <el-col :span="12" class="col-right">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">原辅料现存量与最大存量统计</div>
                        <e-bar ref="echart4" :refName="'echart4'" :echartsData='echartsData4' :xName="xName4" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
    import { utils } from 'src/utils';
    import initEcharts from "src/utils/initEchart";
    import eBar from '../../../components/echarts/eBar';
    import eRing from '../../../components/echarts/eRing';
    export default {
        components: {
            eBar, eRing
        },
        data() {
            return {
                height: 500,
                chartHeight: 500,
                echartsData1: [
                    {value: 1048, name: '原辅料'},
                    {value: 735, name: '有整体爆炸危险的物质和物品原辅料'},
                    {value: 580, name: '有迸射危险，但无整体爆炸危险的物质和物品'},
                    {value: 484, name: '易燃气体原辅料'}
                ],
                echartsData2: {
                    xAxisData: ['有整体爆炸危险的物质和物品', '易燃气体'],
					series: [{
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: [5, 2]
                    }]
                },
                echartsData3: {
                    xAxisData: ['有迸射危险，但无整体爆炸危险的物质和物品'],
					series: [{
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: [1]
                    }]
                },
                echartsData4: {
                    xAxisData: ['有迸射危险，但无整体爆炸危险的物质和物品'],
					series: [{
                        name: '现存量',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: [52.1]
                    }, {
                        name: '最大存量',
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top'
                        },
                        data: [47.9]
                    }]
                },
                xName4: ['现存量', '最大存量'],
                colors: ['#5470C6', '#FAC858', '#FAA058', '#EE6666', '#D066EE', '#8C44DD'],
            }
        },
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
				this.chartHeight = (height + 60)  / 2 + 'px';
			});
		},
        methods: {
            
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>
