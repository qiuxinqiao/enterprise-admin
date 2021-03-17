/*
 * @Author: qiaozp 
 * @Date: 2021-03-17 10:58:26 
 * @Description: 统计图
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-17 11:08:35
 */
<template>
    <div v-bind:style="{height: height}" class="box">
        
    </div>
</template>
<script>
    import { utils } from 'src/utils';
    export default {
        data() {
            return {
                height: 500
            }
        },
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
			});
		},
    }
</script>
<style rel="stylesheet/scss" lang="scss">
	.box {
        width: 100%;
		background: #fff;
	}
</style>
