/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 角色列表
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-04-16 17:31:06
 */
<template>
    <div v-bind:style="{height: height}" class="box">
		<div class="top-sel">
			<el-button type="primary" @click="handleAdd">添加</el-button>
		</div>
        <!-- 表格 -->
		<el-table ref="multipleTable" :data="list" :height="tableHeight" border fit highlight-current-row v-loading="listLoading" element-loading-text="拼命加载中">
			<el-table-column align="center" label="角色名称" prop="role_name"></el-table-column>
			<el-table-column align="center" label="权限列表" prop="permission_list"></el-table-column>
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
                list:[], //表格list
                total: 10,
				listLoading: false,
				userInfo: null,
				listQuery: {},
				listParam: {
					pagination: {
						page : "1",
						count : "10"
					}
				},
            }
        },
		beforeMount() {
			let vm = this;
			vm.userInfo = JSON.parse(vm.$store.getters.userInfo);
			vm.listQuery = {
				user_id: vm.userInfo.user_id,
				enterprise_id: vm.userInfo.enterprise_info.enterprise_id,
				token: vm.userInfo.token,
				device_type: 30
			}
		},
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
				this.tableHeight = height - 45 + 'px';
			});
			vm.getList();
		},
        methods: {
            //获取列表数据
			//isBackHome 是否返回首页
			getList(isBackHome = false) {
                let vm = this;
                if (isBackHome) {
					if (this.listQuery.iDisplayStart != 0) {
						this.$refs.page.backFirstPage();
						return;
					}
				}
				vm.listQuery.jsonText = JSON.stringify(vm.listParam);
				vm.listLoading = true;
		        vm.$instance.post("/proxy/users/users/getRoleList", vm.listQuery).then(res =>{
					vm.listLoading = false;
		          	if(res.status == 200){
                        vm.list = res.data.data.role_list;
                        vm.total = parseInt(res.data.data.paginated.total);
		            }else{
		                Message.error({message:"调用接口失败"});
		            }
		        }).catch(error => {
		        	vm.listLoading = false;
		        });
			},

			handleAdd() {

			},

            //分页改变，加载数据
			paginationChange(pageData) {
				this.listParam.pagination.count = pageData.iDisplayLength;
				this.listParam.pagination.page = pageData.iDisplayStart;
				this.getList();
			},
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	
</style>