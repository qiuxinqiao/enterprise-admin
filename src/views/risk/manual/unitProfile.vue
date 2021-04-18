/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 单位概况
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-27 14:48:29
 */
 <template>
    <div v-bind:style="{height: height}" class="box">
        <div class="unit-box">
            <p class="title">企业风采</p>
            <img src="../../../assets/img/pic_01.jpg">
            <p class="title">企业简介</p>
            <div class="introduce">
                陕西黑猫焦化股份有限公司，创建于2003年11月，2009年12月改制为股份有限公司，2014年11月5日在上海证券交易所挂牌上市，
                股票简称“陕西黑猫”，股票代码601015，属渭南市首家上市企业，是陕西省确定的“循环经济重点示范企业”。2019年公司入选“陕
                西企业100强排行榜”第40名，荣获“陕西民营企业50强”第10名，继续保持了在同行业的领先地位。
            </div>
        </div>
    </div>
</template>
<script>
    import { utils } from 'src/utils';
    export default {
        data() {
            return {
                height: 500,
            }
        },
        mounted() {
			let vm = this;
			utils.getTableHeight((height)=>{
				this.height = height + 71 + 'px';
			});
		},
        methods: {
            
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.unit-box {
        width: 650px;
        margin: 0 auto;
        padding-top: 30px;
        .title {
            line-height: 17px;
            opacity: 0.85;
            color: #000000;
            border-left: 4px solid #204FFE;
            border-radius: 2px;
            padding-left: 10px;
            margin-bottom: 24px;
        }
        img {
            width: 100%;
            height: 350px;
            border-radius: 4px;
            margin-bottom: 24px;
        }
        .introduce {
            line-height: 22px;
            padding: 10px;
            background: #F4F5F9;
            border-radius: 4px;
            color: #000000;
            opacity: 0.85;
        }
    }
</style>