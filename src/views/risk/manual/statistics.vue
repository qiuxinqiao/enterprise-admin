/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 风险统计信息
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-27 16:38:53
 */
  <template>
    <div v-bind:style="{height: height}" class="box">
        <div v-bind:style="{height: chartHeight}">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">各部门固有风险分布</div>
                        <e-bar ref="bar1" :refName="'bar1'" :echartsData='echartsData1' :xName="xName" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
                <el-col :span="12" class="col-right">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">各部门现有风险分布</div>
                        <e-bar ref="bar2" :refName="'bar2'" :echartsData='echartsData2' :xName="xName" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div v-bind:style="{height: chartHeight}" class="bottom-chart">
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">作业活动等级风险分布</div>
                        <e-bar ref="bar3" :refName="'bar3'" :echartsData='echartsData3' :xName="xName" :eHeight='chartHeight' :colors="colors"></e-bar>
                    </div>
                </el-col>
                <el-col :span="12" class="col-right">
                    <div class="grid-content bg-purple" v-bind:style="{height: chartHeight}">
                        <div class="chart-title">事故后果风险分布</div>
                        <e-bar ref="bar4" :refName="'bar4'" :echartsData='echartsData4' :xName="xName" :eHeight='chartHeight' :colors="colors"></e-bar>
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
    export default {
        components: {
            eBar
        },
        data() {
            return {
                height: 500,
                chartHeight: 500,
                echartsData1: {
                    xAxisData: ['生产运营部', '安全环保部', '保卫消防部', '甲醇分厂', '焦化分厂', '热动分厂', '制砖分厂'],
					series: [
                        {
                            name: '低风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '一般风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '较大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '重大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 154, 190, 330, 410]
                        }
                    ]
                },
                echartsData2: {
                    xAxisData: ['生产运营部', '安全环保部', '保卫消防部', '甲醇分厂', '焦化分厂', '热动分厂', '制砖分厂'],
					series: [
                        {
                            name: '低风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '一般风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name: '较大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name: '重大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 154, 190, 330, 410]
                        }
                    ]
                },
                echartsData3: {
                    xAxisData: ['甲醇罐区动火作业', '进入甲醇罐内受限空间作业', '甲醇储罐泄露紧急倒灌切换作业', '上下粗苯罐',
                                '进入粗苯罐内受限空间作业', '粗苯储罐泄露紧急倒灌切换作业', '液碱罐区动火作业'],
					series: [
                        {
                            name: '低风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 302, 301, 334, 0, 330, 320]
                        },
                        {
                            name: '一般风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 0, 134, 90, 230, 210]
                        },
                        {
                            name: '较大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 0, 290, 330, 310]
                        },
                        {
                            name: '重大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 154, 190, 0, 410]
                        }
                    ]
                },
                echartsData4: {
                    xAxisData: ['火灾', '中毒和窒息', '其他爆炸', '其他伤害', '高处坠落', '灼伤', '环境污染'],
					series: [
                        {
                            name: '低风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [320, 0, 301, 334, 390, 330, 320]
                        },
                        {
                            name: '一般风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [120, 132, 101, 0, 90, 230, 210]
                        },
                        {
                            name: '较大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [220, 182, 191, 0, 290, 330, 0]
                        },
                        {
                            name: '重大风险',
                            type: 'bar',
                            stack: 'total',
                            emphasis: {
                                focus: 'series'
                            },
                            data: [150, 212, 201, 0, 190, 330, 410]
                        }
                    ]
                },
                xName: ['低风险', '一般风险', '较大风险', '重大风险'],
                colors: ['#5470C6', '#FAC858', '#FAA058', '#EE6666'],
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
            this.$refs.bar4.drawEcharts();
		},
        methods: {
            
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.box{
        background: #E9ECF3
    }
</style>