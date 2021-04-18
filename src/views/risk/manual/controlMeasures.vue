/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 风险管控措施清单
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-27 16:37:40
 */
  <template>
    <div v-bind:style="{height: height}" class="box">
        <!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="tableHeight" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label="序号" prop="index" width="80"></el-table-column>
			<el-table-column align="center" label="风险点" prop="workName"></el-table-column>
			<el-table-column align="center" label="评估对象" prop="type"></el-table-column>
			<el-table-column align="center" label="危险有害因素" prop="frequency"></el-table-column>
			<el-table-column align="center" label="事故后果" prop="dept"></el-table-column>
            <el-table-column align="center" label="管控措施">
                <el-table-column align="center" label="工程技术措施" prop="dept"></el-table-column>
                <el-table-column align="center" label="管理措施" prop="dept"></el-table-column>
                <el-table-column align="center" label="培训教育措施" prop="dept"></el-table-column>
                <el-table-column align="center" label="个体防护措施" prop="dept"></el-table-column>
                <el-table-column align="center" label="应急处置措施" prop="dept"></el-table-column>
            </el-table-column>
			<el-table-column align="center" label="风险等级" prop="dept"></el-table-column>
		</el-table>

        <!-- 分页 -->
		<pagination ref="page" :total="total" @reLoadData="paginationChange"></pagination>
    </div>
</template>
<script>
    import { utils } from 'src/utils';
    import Pagination from '../../../components/Pagination';
    export default {
        components: {
			Pagination
		},
        data() {
            return {
                height: 500,
                tableHeight: 500,
                list:[{
					index: '1',
					workName: '辅料X',
					type: '第1.2项：有迸射危险，但无整体爆炸危险的物质和物品',
					stock: '100',
					state: '液体',
					dept: '校长办公室',
					buildingName: '总平面图',
					enclosure: '辅料X.doc'
				}], //表格list
                total: 10,
				listLoading: false,
            }
        },
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
				this.tableHeight = height + 'px';
			});
		},
        methods: {
            getList() {

            },

            //分页改变，加载数据
			paginationChange(pageData) {
				this.listQuery.iDisplayStart = pageData.iDisplayStart;
				this.listQuery.iDisplayLength = pageData.iDisplayLength;
				this.getList();
			},
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>