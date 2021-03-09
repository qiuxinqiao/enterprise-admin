<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 图片查看组件
 * @Date: 2019-08-29 17:24:36
 * @LastEditTime: 2019-08-29 16:59:31
 -->
<template>
    <div class="image-box" @click="hideBox">
        <div class="img-box">
            <img :src="url" v-for="(url, index) in context" :key="index" :class="imgType ? 'graph' : 'perGraph'">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['context', 'imgType'],
        data() {
            return {
                
            }
        },
        watch: {
            context: {
                handler(val, oldVal) {
                    this.context = val
                },
                immediate: true
            }
        },
        mounted() {
            
        },
        methods: {
            hideBox() {
                this.$emit('imageHide');
            }
        },
    }
</script>


<style lang="scss">
    .image-box{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100vh;
        line-height: 100vh;
        background: #000;
        z-index: 9999999999999999;
        text-align: center;
        transition: 2s;
        cursor: pointer;
        .graph{
            padding-top: 35vh
        }
        .perGraph{
            height: 92vh;
            width: auto;
            margin-top: 4vh
        }
    }
</style>