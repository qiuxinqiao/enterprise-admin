/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:37:20 
 * @Description: 资质档案
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月9日14:36:59
 */
<template>
  <div class="app-container">
    <div class="title_box_gd">
      <div class="title">资质档案</div>
      <div class="right">
        <el-button type="primary"   @click="dataFilesDialog = true">添 加</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="list"
      :height="height"
      highlight-current-row
      v-loading="listLoading"
      element-loading-text="拼命加载中"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80"
        :index="indexMethod"
      >
      </el-table-column>

      <el-table-column
        align="center"
        label="资料档案"
        prop="dataFiles"
      ></el-table-column>
      <el-table-column align="center" label="备注信息" prop="Remarks">
      </el-table-column>
      <el-table-column
        prop="wxinfo"
        label="资质图片"
        width="200"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <img :src="item.url" v-for="(item, index) in scope.row.commentUrl" :key="index" height="90%" class="touxiang" />
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="更新时间"
        prop="updateTime"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      ref="page"
      :total="total"
      @reLoadData="paginationChange"
    ></pagination>
    <!-- 添加资质档案 开始 -->
    <el-dialog
      title="添加资质档案"
      :visible.sync="dataFilesDialog"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input
            v-model="form.remarks"
            type="textarea"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
        <div class="form_container">
			<div class="label_title">厂区平面图</div>
         <el-upload
			action="https://jsonplaceholder.typicode.com/posts/"
			list-type="picture-card"
			:on-preview="handlePictureCardPreview"
			:on-remove="handleRemove">
			<i class="el-icon-circle-plus-outline"></i><span>点击上传</span>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="form.dialogImageUrl" alt="">
			</el-dialog>
          <p>文件扩展名.png ,jpg...图片大小不得超过2M</p>
          
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataFilesDialog = false">取 消</el-button>
        <el-button type="primary" @click="dataFilesDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加资质档案 结束 -->
  </div>
</template>
<script>
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
// import DatePicker from "../../components/DatePicker"; //日期组件
import Pagination from "../../components/Pagination";
export default {
  components: {
    // "date-picker": DatePicker, //日期组件
    pagination: Pagination,
  },
  data() {
    return {
      dataFilesDialog: false,
      permBtn: {
        alarm_find: false,
      },
      height: 640,
      list: [
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
        {
          dataFiles: "石油化工工程施工总承包一级资质",
          Remarks:
            "1.注册资本不低于2000万元; 2.从事房地产开发经营3年以上; 3.近3",
          picture: "上海市普陀区金沙江路 1518 弄",

          commentUrl: [
            {
              url: "../../assets/img/none.png",
            },
            {
              url: "../../assets/img/none.png",
            },
          ],
          updateTime: "2020-09-11 14:20:21",
        },
      ], //表格list
      form: {
        name: "",
        remarks:'',
        dialogImageUrl:'',
      },
      total: 20,
      listLoading: false,
      //列表查询参数
      listQuery: {
        iDisplayLength: 10,
        iDisplayStart: 0,
        companyName: "",
        name: "",
      },
      isToday: false, //是否回显当前日期
    };
  },
  mounted() {
    var vm = this;
    vm.getPerm();
    // vm.getList();
    vm.$nextTick(function () {
      utils.getTableHeight((height) => {
        this.height = height;
      });
    });
  },
  methods: {
     //   删除/上传成功方法
     handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // ==========
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    //获取当前页面的权限
    getPerm() {
      this.permBtn = utils.permsButton(this);
    },

    //获取列表数据
    //isBackHome 是否返回首页
    getList(isBackHome = false) {
      var vm = this;
      if (isBackHome) {
        if (this.listQuery.iDisplayStart != 0) {
          this.$refs.page.backFirstPage();
          return;
        }
      }
      vm.listLoading = true;
      vm.listQuery.fromTime = "";
      vm.listQuery.toTime = "";
      //   const dateTime = vm.$refs.datePicker.datePicker; //父组件获取子组件数据this.$refs.第一个datePicker是父组件ref值，第二个是子组件model值
      //   if (dateTime) {
      //     vm.listQuery.fromTime = dateTime[0] + " 00:00:00";
      //     vm.listQuery.toTime = dateTime[1] + " 23:59:59";
      //   }
      vm.$instance
        .post("/proxy/alarm/temperature/findList", vm.listQuery)
        .then((res) => {
          vm.listLoading = false;
          if (res.status == 200) {
            vm.list = res.data.data;
            vm.total = res.data.contTotal;
          } else {
            Message.error({ message: "调用接口失败" });
          }
        })
        .catch((error) => {
          vm.listLoading = false;
        });
    },

    /**
     * 分页改变，加载数据
     */
    paginationChange(pageData) {
      this.listQuery.iDisplayStart = pageData.iDisplayStart;
      this.listQuery.iDisplayLength = pageData.iDisplayLength;
      this.getList();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
