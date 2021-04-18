/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 组织机构
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-16 15:58:17
 */
<template>
    <div v-bind:style="{height: height}" class="box">
        <div class="tabs_container_box">
			<div style="height:50px;padding-top:6px;padding-left: 30px;padding-right:30px;border-bottom: #efefef solid 1px;"></div>
			<div style="height:calc(100vh - 260px);">
				<seeks-relation-graph
					ref="seeksRelationGraph"
					:options="graphOptions"
					:on-node-click="onNodeClick"
					:on-line-click="onLineClick"
				/>
			</div>
		</div>
    </div>
</template>
<script>
    import { utils } from 'src/utils';
    import SeeksRelationGraph from 'relation-graph'
    export default {
        components: {
			SeeksRelationGraph
		},
        data() {
            return {
                height: 500,
                graphOptions: {
					'backgrounImage': 'http://ai-mark.cn/images/ai-mark-desc.png',
					'backgrounImageNoRepeat': true,
					'layouts': [{
						'label': '中心',
						'layoutName': 'tree',
						'layoutClassName': 'seeks-layout-center',
						'defaultJunctionPoint': 'border',
						'defaultNodeShape': 0,
						'defaultLineShape': 1,
						'min_per_width': 40,
						'max_per_width': 70,
						'min_per_height': 200
					}],
					'defaultLineMarker': {
						'markerWidth': 12,
						'markerHeight': 12,
						'refX': 6,
						'refY': 6,
						'data': 'M2,2 L10,6 L2,10 L6,6 L2,2'
					},
					'defaultNodeShape': 1,
					'defaultNodeWidth': '30',
					'defaultLineShape': 2,
					'defaultJunctionPoint': 'tb',
					'defaultNodeBorderWidth': 0,
					'defaultLineColor': 'rgba(0, 186, 189, 1)',
					'defaultNodeColor': 'rgba(0, 206, 209, 1)',
					'defaultNodeHeight': '100'
				},
            }
        },
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
			});
		},
        methods: {
			showSeeksGraph(query) {
				var __graph_json_data = { 
					'rootId': 'a', 'nodes': [
						{ 'id': 'a', 'text': '张德高' },
						{ 'id': 'b', 'text': 'b' }, 
						{ 'id': 'c', 'text': 'c' }, 
						{ 'id': 'c1', 'text': 'c1' }, 
						{ 'id': 'c2', 'text': 'c2' }, 
						{ 'id': 'd', 'text': 'd' },
						{ 'id': 'e', 'text': 'e' }, 
					], 'links': [
						{ 'from': 'a', 'to': 'b' }, 
						{ 'from': 'a', 'to': 'c' }, 
						{ 'from': 'c', 'to': 'c1' }, 
						{ 'from': 'c', 'to': 'c2' }, 
						{ 'from': 'a', 'to': 'd' }, 
						{ 'from': 'a', 'to': 'e' }, 
					] 
				}
				this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
					// 这些写上当图谱初始化完成后需要执行的代码
				})
			},
            onNodeClick(nodeObject, $event) {
				console.log('onNodeClick:', nodeObject)
			},
			onLineClick(lineObject, $event) {
				console.log('onLineClick:', lineObject)
			},
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>