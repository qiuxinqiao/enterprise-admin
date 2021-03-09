<!--
 * @Author: qiaozp
 * @LastEditors: qiaozp
 * @Description: 没有权限组件
 * @Date: 2019-02-26 16:21:55
 * @LastEditTime: 2019-04-08 09:22:44
 -->
<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <img :src="errGif" alt="401 image">
      </el-col>
      <el-col :span="12" class="right-con">
        <!-- <h1 class="text-jumbo text-ginormous">401!</h1> -->
        <h2>你没有权限去该页面</h2>
        <h6>你可以联系你领导，或者你可以去:</h6>
        <el-button @click="back" icon="arrow-left" >返回</el-button>
          <a href="/">
            <el-button class="blue-btn" style="color: #fff">返回首页</el-button>
          </a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from "assets/img/401.png";
export default {
  data() {
    return {
      errGif: errGif + "?" + +new Date()
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: "/" });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.errPage-container {
  width: 1200px;
  margin: 0 auto;
  padding-top: 100px;
  img{
    width: 100%
  }
  .pan-back-btn {
    background: #008489;
    color: #fff;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
  }
  .right-con{
    padding-top: 220px;
    padding-left: 120px
  }
 
}
</style>
