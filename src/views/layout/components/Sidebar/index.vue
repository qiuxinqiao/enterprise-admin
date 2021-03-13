<!--
 * @Author: your name
 * @Date: 2020-02-26 15:01:09
 * @LastEditTime: 2020-03-17 14:03:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \epidemic-html\src\views\layout\components\Sidebar\index.vue
 -->
<template>
    <scroll-bar>
        <div :class="sidebar.opened ? 'open-logos' : 'close-logos'">
            <div>
                <img v-if="sidebar.opened" src="../../../../assets/img/logo.png">
                <img v-if="!sidebar.opened" src="../../../../assets/img/logo_02.png">
            </div>
        </div>
        <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" :unique-opened=true background-color="rgb(0,45,87)" text-color="#adb8c1" active-text-color="#f4b02d">
           <sidebar-item :routes="permission_routers"></sidebar-item>
        </el-menu>
    </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .open-logos{
    width: 100%;
    height: 80px;
    line-height: 80px;
    color: #fff;
    text-align: center;
    border-bottom: 1px solid #1e2b3b;
    div{
		width: 70%;
		margin: 0 auto;
		img{
        transition: 0.28s;
        height: 60px;
        margin-top: 10px;
			}
    }
    p{
      width: 150px;
      margin: 0 auto;
      font-weight: bolder;
      line-height: 30px 
    }
  }
  .close-logos{
    text-align: center;
    padding: 15px 0 15px 0;
    img{
      width: 30px;
      transition: 0.28s;
    }
  }
</style>