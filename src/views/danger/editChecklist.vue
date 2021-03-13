/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:41:56 
 * @Description: 检查表
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月11日16:59:18
 */
<template>
  <div class="app-container">
    <div class="title_box_gd">
      <div class="title">2021年度日常检查表</div>
      <!-- 搜索条件 -->
      <div class="right">
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
        <el-select
          class="mr-8"
          v-model="department"
          placeholder="请选择落实部门"
        >
          <el-option
            v-for="item in departmentData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary">筛 选</el-button>
        <el-button type="primary">落 实</el-button>
        <el-button @click="addInvestigationItemDialog">添加排查项</el-button>
        <el-button>导 出</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
    </div>

    <div class="table_box_gd">
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="list"
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
          align="left"
          label="排查区域"
          prop="area"
        ></el-table-column>
        <el-table-column
          align="left"
          label="排查对象	"
          width="150"
          prop="investigationObjec"
        ></el-table-column>
        <el-table-column
          align="left"
          label="危险有害因素"
          width="150"
          prop="factor"
        ></el-table-column>
        <el-table-column
          align="left"
          label="排查标准"
          width="150"
          prop="standard"
        ></el-table-column>
        <el-table-column
          align="left"
          label="标准排查内容"
          prop="content"
          width="150"
        ></el-table-column>
        <el-table-column
          align="left"
          label="实际排查内容"
          prop="actualContent"
        ></el-table-column>
        <el-table-column
          align="left"
          label="部门"
          prop="department"
        ></el-table-column>
        <el-table-column
          align="left"
          label="岗位"
          prop="post"
        ></el-table-column>
        <el-table-column align="left" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editDialog(scope.row)"
              >编辑</el-button
            >
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
    </div>
    <!-- 添加排查项 开始 -->
    <el-drawer
      title="隐患排查库"
      :visible.sync="addInvestigationItemDialogFlag"
      direction="rtl"
      size="75%"
    >
      <div class="app-container">
      <div class="title_box_gd">
        <!-- 搜索条件 -->
        <div class="right">
          <div class="filter-container">
            <el-form
              :inline="true"
              :model="platoonSearch"
              class="demo-form-inline hiddenDanger_form_top_gd"
            >
              <el-select
                v-model="platoonSearch.conceive"
                placeholder="请选择检查表类型"
              >
                <el-option
                  v-for="item in platoonSearch.conceiveData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
              <el-select v-model="platoonSearch.floor" placeholder="请选择楼层">
                <el-option
                  v-for="item in platoonSearch.floorData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="platoonSearch.riskPoints"
                placeholder="请选择风险点"
              >
                <el-option
                  v-for="item in platoonSearch.riskPointsData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="platoonSearch.investigationObjec"
                placeholder="请选择排查对象"
              >
                <el-option
                  v-for="item in platoonSearch.investigationObjecData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="platoonSearch.standard"
                placeholder="请选择五大类标准"
              >
                <el-option
                  v-for="item in platoonSearch.standardData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled"
                >
                </el-option>
              </el-select>
              <div class="button_box">
                <el-button type="info">查 询</el-button>
                <el-button>重 置</el-button>
                <el-button
                  class="filter-item blue-btn"
                  type="primary"
                  @click="getList(true)"
                >
                  添加排查项
                </el-button>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table_box_gd">
        <el-table
          ref="multipleTable"
          :data="platoonSearchList"
          :height="height"
        >
          <el-table-column type="selection" align="center" width="55">
          </el-table-column>
          <el-table-column
            align="left"
            label="排查区域"
            prop="area"
          ></el-table-column>
          <el-table-column
            align="left"
            label="排查对象	"
            prop="investigationObjec"
          ></el-table-column>
          <el-table-column
            align="left"
            label="危险有害因素"
            prop="factor"
          ></el-table-column>
          <el-table-column
            align="left"
            label="排查标准"
            prop="standard"
          ></el-table-column>
          <el-table-column
            align="left"
            label="标准排查内容"
            prop="content"
          ></el-table-column>
          <el-table-column align="left" label="操作" width="200">
            <template slot-scope="scope">
              <el-button type="text" size="mini">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    </el-drawer>
    <!-- 添加排查项 结束 -->
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
        addInvestigationItemDialogFlag: false,
        platoonSearch: {
        conceive: "",
        conceiveData: [
          {
            value: "选项1",
            label: "A-建构筑物",
          },
          {
            value: "选项2",
            label: "B-建构筑物",
          },
          {
            value: "选项3",
            label: "C-建构筑物",
          },
          {
            value: "选项4",
            label: "D-建构筑物",
          },
        ],
        floor: "",
        floorData: [
          {
            value: "选项1",
            label: "A-楼层",
          },
          {
            value: "选项2",
            label: "B-楼层",
          },
          {
            value: "选项3",
            label: "C-楼层",
          },
          {
            value: "选项4",
            label: "D-楼层",
          },
        ],
        riskPoints: "",
        riskPointsData: [
          {
            value: "选项1",
            label: "A-风险点",
          },
          {
            value: "选项2",
            label: "B-风险点",
          },
          {
            value: "选项3",
            label: "C-风险点",
          },
          {
            value: "选项4",
            label: "D-风险点",
          },
        ],
        investigationObjec: "",
        investigationObjecData: [
          {
            value: "选项1",
            label: "A-排查对象",
          },
          {
            value: "选项2",
            label: "B-排查对象",
          },
          {
            value: "选项3",
            label: "C-排查对象",
          },
          {
            value: "选项4",
            label: "D-排查对象",
          },
        ],
        standard: "",
        standardData: [
          {
            value: "选项1",
            label: "A-五大类标准",
          },
          {
            value: "选项2",
            label: "B-五大类标准",
          },
          {
            value: "选项3",
            label: "C-五大类标准",
          },
          {
            value: "选项4",
            label: "D-五大类标准",
          },
        ],
        iDisplayLength: 10,
        iDisplayStart: 0,
        companyName: "",
        name: "",
      },
      platoonSearchList: [
        {
          area: "风险点1.1.2",
          investigationObjec: "路由器",
          factor: "因素1",
          standard: "工程技术措施",
          content: "工程技术措施细则1",
        },
      ],
      department: "",
      departmentData: [
        {
          value: "选项1",
          label: "A-部门",
        },
        {
          value: "选项2",
          label: "B-部门",
        },
        {
          value: "选项3",
          label: "C-部门",
        },
        {
          value: "选项4",
          label: "D-部门",
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
          area: "风险点1.1.2",
          investigationObjec: "路由器",
          factor: "因素1",
          standard: "工程技术措施",
          content: "工程技术措施细则1",
          actualContent: "口语化的工程技术措施细则",
          department: "安全技术部",
          post: "安全员",
        },
      ], //表格list
      total: 0,
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
      addInvestigationItemDialog(){
          this.addInvestigationItemDialogFlag = true;
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

