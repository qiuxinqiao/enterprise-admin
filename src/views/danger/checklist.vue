/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 检查表
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月10日18:11:43
 */
<template>
  <div class="app-container">
    <div class="title_box_gd">
      <div class="title">检查表列表</div>
      <!-- 搜索条件 -->
      <div class="right">
        <el-select
          class="mr-8"
          v-model="inspectionType"
          placeholder="请选择检查类型"
        >
          <el-option
            v-for="item in inspectionTypeData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select
          class="mr-8"
          v-model="checkStatus"
          placeholder="请选择检查状态"
        >
          <el-option
            v-for="item in checkStatusData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary">筛 选</el-button>
        <el-button type="primary" @click="goToGenerate()">创建检查表</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="list"
      :height="height"
      highlight-current-row
      element-loading-text="拼命加载中"
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
        label="检查表名称"
        prop="name"
        class-name="text_blue"
      ></el-table-column>
      <el-table-column
        align="left"
        label="检查类型	"
        width="150"
        prop="inspectionType"
      ></el-table-column>
      <el-table-column
        align="left"
        label="起始日期"
        width="150"
        prop="startDate"
      ></el-table-column>
      <el-table-column
        align="left"
        label="截止日期"
        width="150"
        prop="closingDate"
      ></el-table-column>
      <el-table-column
        align="left"
        label="检查时段"
        width="150"
        prop="inspectionPeriod"
      ></el-table-column>
      <el-table-column
        align="left"
        label="检查状态"
        width="300"
        prop="checkStatus"
      >
        <template slot-scope="scope">
          <el-button type="primary" class="dotClass" round plain>执行中</el-button>
          <!-- <el-button type="primary" class="dotClass orangeDotClass" round plain>未开始</el-button>
          <el-button type="primary" class="dotClass greyDotClass" round plain>已过期</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        label="已落实"
        width="100"
        prop="implemented"
      ></el-table-column>
      <el-table-column align="left" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="goToEdit(scope.row)"
            >编辑</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="mini" @click="copyDialog(scope.row)"
            >复制</el-button
          >
          <el-divider direction="vertical"></el-divider>
          <el-button type="text" size="mini">导出</el-button>
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
    <!-- 复制 开始 -->
    <el-dialog
      title="复制检查表"
      :visible.sync="copyDialogFlag"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="copyDialogForm"
        class="demo-ruleForm"
        label-position="top"
      >
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="检查表类型">
                <el-select
                  v-model="copyDialogForm.checklistType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in copyDialogForm.checklistTypeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="起始日期">
                <el-date-picker
                  v-model="copyDialogForm.startDate"
                  type="date"
                  placeholder="选择起始日期"
				  class="form_input_w"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="排查时段">
				  <el-time-picker
              is-range
              class="form_input_w"
              format="HH:mm"
              v-model="copyDialogForm.inspectionPeriod"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
			</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检查表名称">
                <el-input
                  v-model="copyDialogForm.checklistName"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
			  <el-form-item label="截止日期">
            <el-date-picker
              v-model="copyDialogForm.closingDate"
              type="date"
              class="form_input_w"
              placeholder="请选择截止日期"
            >
            </el-date-picker>
          </el-form-item>
            </el-col>
          </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyDialogFlag = false">取 消</el-button>
        <el-button type="primary" @click="copyDialogFlag = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 复制 结束 -->
  </div>
</template>
<script>
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
import DatePicker from "../../components/DatePicker"; //日期组件
import Pagination from "../../components/Pagination";
export default {
  components: {
    "date-picker": DatePicker, //日期组件
    pagination: Pagination,
  },
  data() {
    return {
      copyDialogFlag: false,
      copyDialogForm: {
        checklistType: "",
        checklistTypeData: [
          {
            value: "选项1",
            label: "全部",
          },
          {
            value: "选项2",
            label: "日常检查",
          },
          {
            value: "选项3",
            label: "综合性检查",
          },
          {
            value: "选项4",
            label: "季节性检查",
          },
          {
            value: "选项5",
            label: "节假日检查",
          },
          {
            value: "选项6",
            label: "自定义检查",
          },
        ],
        startDate: "",
		inspectionPeriod:'',
		closingDate:''
      },
      inspectionType: "",
      inspectionTypeData: [
        {
          value: "选项1",
          label: "全部",
        },
        {
          value: "选项2",
          label: "日常检查",
        },
        {
          value: "选项3",
          label: "综合性检查",
        },
        {
          value: "选项4",
          label: "季节性检查",
        },
        {
          value: "选项5",
          label: "节假日检查",
        },
        {
          value: "选项6",
          label: "自定义检查",
        },
      ],
      checkStatus: "",
      checkStatusData: [
        {
          value: "选项1",
          label: "全部",
        },
        {
          value: "选项2",
          label: "日常检查",
        },
        {
          value: "选项3",
          label: "综合性检查",
        },
        {
          value: "选项4",
          label: "季节性检查",
        },
        {
          value: "选项5",
          label: "节假日检查",
        },
        {
          value: "选项6",
          label: "自定义检查",
        },
      ],
      permBtn: {
        alarm_find: false,
      },
      height: 540,
      list: [
        {
          name: "2021年度日常检查表-早班",
          inspectionType: "日常检查",
          startDate: "2021-01-01",
          closingDate: "2021-05-01",
          inspectionPeriod: "08:00-10:00",
          checkStatus: "",
          implemented: "320/2000",
        },
      ], //表格list
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
    goToGenerate() {
      this.$router.push({
        path: "generateCheck",
        query: { auditID: 1, type: "2" },
      });
    },
    goToEdit(row) {
      console.log(row, "row");
      this.$router.push({
        path: "editChecklist",
        query: { auditID: 1, type: "2" },
      });
    },
    copyDialog(row) {
      console.log(row, "row");
      this.copyDialogFlag = true;
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
      const dateTime = vm.$refs.datePicker.datePicker; //父组件获取子组件数据this.$refs.第一个datePicker是父组件ref值，第二个是子组件model值
      if (dateTime) {
        vm.listQuery.fromTime = dateTime[0] + " 00:00:00";
        vm.listQuery.toTime = dateTime[1] + " 23:59:59";
      }
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

