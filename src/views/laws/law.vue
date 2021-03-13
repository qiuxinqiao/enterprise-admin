/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 法律法规
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月12日10:19:11
 */
<template>
  <div class="app-container">
    <div class="title_box_gd">
      <div class="title">法律法规</div>
      <div class="right">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="dataFilesDialog = true"
          >添加法律法规</el-button
        >
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="list"
      :height="height - 30"
      highlight-current-row
      @selection-change="handleSelectionChange"
      @row-click="seeDetails"
    >
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="80"
        :index="indexMethod"
      >
      </el-table-column>

      <el-table-column
        align="left"
        label="类型"
        prop="type"
        width="120"
      ></el-table-column>
      <el-table-column align="left" label="标题" prop="title">
      </el-table-column>
      <el-table-column
        align="left"
        label="简介"
        prop="synopsis"
      ></el-table-column>
      <el-table-column align="left" label="附件" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini">附件下载</el-button>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="text" size="mini">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      ref="page"
      :total="total"
      @reLoadData="paginationChange"
    ></pagination>
    <!-- 添加法律法规 开始 -->
    <el-dialog
      title="添加法律法规"
      :visible.sync="dataFilesDialog"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="类型">
          <el-select
            v-model="form.type"
            placeholder="请选择类型"
            class="form_input_w"
          >
            <el-option
              v-for="item in form.typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题">
          <el-input
            v-model="form.title"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="form.synopsis"
            type="textarea"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="定位">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="form.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dataFilesDialog = false">取 消</el-button>
        <el-button type="primary" @click="dataFilesDialog = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加法律法规 结束 -->
    <!-- 查看详情 开始 -->
    <el-drawer
      title="法律法规详情"
      :visible.sync="seeDetailsDrawerFlag"
      :direction="direction"
      :before-close="handleClose"
    >
      <el-form label-position="top" :model="seeDetailsDrawerForm">
        <div class="form_container">
          <el-form-item label="类别">
            <el-input
              v-model="seeDetailsDrawerForm.type"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="标题">
            <el-input
              v-model="seeDetailsDrawerForm.title"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input
              v-model="seeDetailsDrawerForm.synopsis"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="附件下载">
            <div class="copy_disabled_input flex_space_between">
              <div class="fileList_box">
                <span>{{ seeDetailsDrawerForm.fileList[0].name }}</span>
                <span>{{ seeDetailsDrawerForm.fileList[0].size }}</span>
              </div>
              <div>
                <el-button type="text" size="mini">下载</el-button>
                <el-button type="text" size="mini">预览</el-button>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </el-drawer>
    <!-- 查看详情 结束 -->
  </div>
</template>
<script>
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
import Pagination from "../../components/Pagination";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dataFilesDialog: false,
      seeDetailsDrawerFlag: false,
      disabled: true,
      seeDetailsDrawerForm: {
        type: "法条",
        title: "国家安全监管总局关于印发 《化工和危险化学品生产...",
        synopsis: "各省、自治区、直辖市及新疆生产建设兵团安全生产监督管理局...",
        fileList: [
          {
            name: "陕西省工贸企业安全生产...pdf",
            url:
              "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
            size: "(56.2kb)"
          }
        ]
      },
      permBtn: {
        alarm_find: false
      },
      height: 640,
      list: [
        {
          type: "法条",
          title: "国家安全监管总局关于印发 《化工和危险化学品生产...",
          synopsis:
            "各省、自治区、直辖市及新疆生产建设兵团安全生产监督管理局..."
        }
      ], //表格list
      form: {
        type: "",
        typeData: [
          {
            value: "选项1",
            label: "A-类型"
          },
          {
            value: "选项2",
            label: "B-类型"
          },
          {
            value: "选项3",
            label: "C-类型"
          },
          {
            value: "选项4",
            label: "D-类型"
          }
        ],
        title: "",
        synopsis: "",
        content: "",
        fileList: []
      },
      total: 10,
      listLoading: false,
      //列表查询参数
      listQuery: {
        iDisplayLength: 10,
        iDisplayStart: 0,
        companyName: "",
        name: ""
      },
      isToday: false //是否回显当前日期
    };
  },
  mounted() {
    var vm = this;
    vm.getPerm();
    // vm.getList();
    vm.$nextTick(function() {
      utils.getTableHeight(height => {
        this.height = height;
      });
    });
  },
  methods: {
    seeDetails(val) {
      console.log(val, "val");
      this.seeDetailsDrawerFlag = true;
    },
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
        .then(res => {
          vm.listLoading = false;
          if (res.status == 200) {
            vm.list = res.data.data;
            vm.total = res.data.contTotal;
          } else {
            Message.error({ message: "调用接口失败" });
          }
        })
        .catch(error => {
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
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
