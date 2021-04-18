/*
 * @Author: qiaozp 
 * @Date: 2021-03-26 10:06:27 
 * @Last Modified by: qiaozp
 * @Description: 环形（中心有内容） 
 * @Last Modified time: 2021-03-26 10:54:16
 */
<template>
	<div class="scroll-container" ref="scrollContainer">
		<div :ref="refName" class="echars-ring" :style="{width: '100%', height: eHeight - 200 + 'px'}"></div>
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
		watch: {
            echartsData: {
                handler: function(val, oldval){
                    this.drawEcharts();
                },
                deep: true//对象内部的属性监听，也叫深度监听
            }
        },
		props: ['refName', 'echartsData', 'colors', 'eHeight'],
		mounted() {
			this.drawEcharts();
		},
		methods: {
			drawEcharts() {
				initEcharts().then(echarts => {
					let vm = this;
					let name = this.refName;
					this.myChart = echarts.init(this.$refs[name]);
					this.myChart.setOption({
						color: vm.colors,
						tooltip: {
							trigger: 'item'
						},
						legend: {
							orient: 'vertical',
							bottom: '10px',
							left: 'right',
							data: ['原辅料', '有整体爆炸危险的物质和物品原辅料', '有迸射危险，但无整体爆炸危险的物质和物品', '易燃气体原辅料']
						},
						series: [
							{
								name: '原辅料',
								type: 'pie',
								radius: ['60%', '80%'],
								avoidLabelOverlap: false,
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
								data: vm.echartsData
							}
						]
					});
				});
			}
		}
	};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.echars-ring {
		width: 100%;
		height: 260px;
	}
</style>
