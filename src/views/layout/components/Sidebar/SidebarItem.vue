<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <el-submenu :index="item.menuName||item.frontRouting" v-if="item.children && item.children.length > 0" :key="item.frontRouting">
        <template  slot="title">
          <span :class="['icon iconfont', item.menuIcon]"></span>
          <span v-if="item.menuName" class="first-menu">{{item.menuName}}</span>
        </template>
        <template v-for="child in item.children">
            <!-- <router-link  :to="" > -->
              <el-menu-item  @click="toPage(child.frontRouting)" :key="child.menuName" :index="child.frontRouting">
                <span class="second-menu">{{child.menuName}}</span>
              </el-menu-item>
            <!-- </template> -->
        </template>
      </el-submenu>
      <!-- <router-link  :to="item.frontRouting" :key="item.menuName"> -->
        <el-menu-item v-else class="no-childItem"  @click="toPage(item.frontRouting)" :key="item.menuName" :index="item.frontRouting">
            <span :class="['icon iconfont', item.menuIcon]"></span>
            <span  slot="title" class="first-menu">{{item.menuName}}</span>
        </el-menu-item>
      <!-- </template>-->
    </template>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from "vuex";
  import { Message } from 'element-ui';
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    computed: {
        ...mapGetters(["permission_routers"])
      },
    mounted () {
      // console.info(this.routes)
     
    },
    methods: {
       toPage(path){
        let whirtePath = ["/homeSchool/Announcement","/homeSchool/Operation","/homeSchool/Performed","/homeSchool/Class","/homeSchool/Attendance","/Pay/Project","/Pay/Recording","/Pay/Report"]
        if(whirtePath.indexOf(path) > -1){
          Message.warning({message:"正在开发，敬请期待"})
        }else{
          this.$router.push({
            path:path,
        })
        }

      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" >
  .menu-wrapper span {
		display: inline-table;
		width: 23px;
		height: 23px;
		margin-right: 10px;
		background-repeat: no-repeat;
		background-position: center center;
	}
  
  .second-menu{
    padding-left: 30px
  }

  .el-submenu.is-active{
    .el-submenu__title {
      background: #204FFE !important;
    }
    .icon.iconfont{
      color: #fff;
    }
  }
  
  //无子菜单样式
  .no-childItem{
    // border-left: 5px solid #002d57;
    &:hover{
      background: #00274b !important;
      // border-left: 5px solid #ffea7a;
    }
    &.is-active{
      background: #204FFE !important;
      span{
        color: #fff !important;
      }
    }
  }
</style>