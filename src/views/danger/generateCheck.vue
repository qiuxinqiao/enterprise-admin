/*
 * @Author: guodi 
 * @Date: 2021年3月11日10:17:59 
 * @Description:  生成检查表
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月11日10:18:04
 */
<template>
  <div>
    <div class="app-container">
      <div class="title_box_gd">
        <div class="title">隐患排查检查表</div>
      </div>
      <!-- 搜索条件 -->
      <div class="filter-container">
        <el-form
          :inline="true"
          :model="investigationListQuery"
          class="demo-form-inline generateCheck_form_top_gd"
        >
          <el-form-item label="检查表类型">
            <el-select
              v-model="investigationListQuery.checklistType"
              placeholder="请选择检查表类型"
              class="form_input_w"
            >
              <el-option
                v-for="item in investigationListQuery.checklistTypeData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检查表名称">
            <el-input
              class="form_input_w"
              v-model="investigationListQuery.checklistName"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="起始日期">
            <el-date-picker
              v-model="investigationListQuery.startDate"
              type="date"
              class="form_input_w"
              placeholder="请选择起始日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="截止日期">
            <el-date-picker
              v-model="investigationListQuery.closingDate"
              type="date"
              class="form_input_w"
              placeholder="请选择截止日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="检查时段">
            <el-time-picker
              is-range
              class="form_input_w"
              format="HH:mm"
              v-model="investigationListQuery.inspectionPeriod"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            >
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="app-container">
      <div class="title_box_gd">
        <div class="title">隐患排查库</div>
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
    <div class="app-container mt-15">
      <div class="title_box_gd">
        <div class="title">检查表</div>
        <div class="right">
          <el-button type="primary" @click="workableDialog">落 实</el-button
          >
          <el-button type="danger">删 除</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <div class="table_box_gd">
        <el-table ref="multipleTable" :data="checklist" :height="height" @selection-change="handleSelectionChange">
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
      </div>
      <!-- 编辑 开始 -->
      <el-dialog
        title="编辑排查项"
        :visible.sync="editDialogFlag"
        width="50%"
        :before-close="handleClose"
        top="25vh"
         
      >
        <el-form
          ref="form"
          :model="editDialogListForm"
          class="demo-ruleForm"
          label-position="top"
        >
          <el-form-item label="实际排查内容">
            <el-input
              v-model="editDialogListForm.actualContent"
              type="textarea"
              autocomplete="off"
              class="form_input_w"
              placeholder="请输入实际排查内容"
            ></el-input>
          </el-form-item>
          <div class="form_title_box_gd">隐患排查落实</div>
          <div class="form_container">
            <el-row :gutter="32">
              <el-col :span="12">
                <el-form-item label="部门">
                  <el-select
                    v-model="editDialogListForm.department"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in editDialogListForm.departmentData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="岗位">
                  <el-select
                    v-model="editDialogListForm.post"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in editDialogListForm.postData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogFlag = false">取 消</el-button>
          <el-button type="primary" @click="editDialogFlag = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 编辑结束 -->
      <!-- 落实 开始 -->
      <el-dialog
  title="隐患排查落实"
  :visible.sync="workableDialogFlag"
  width="20%"
  top="40vh"
  :before-close="handleClose">
  <el-form
          ref="form"
          :model="workableDialogForm"
          class="demo-ruleForm"
          label-position="top"
        >
          <div class="form_container">
                <el-form-item label="部门">
                  <el-select
                    v-model="workableDialogForm.department"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in workableDialogForm.departmentData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="岗位">
                  <el-select
                    v-model="workableDialogForm.post"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in workableDialogForm.postData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
          </div>
        </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="workableDialogFlag = false">取 消</el-button>
    <el-button type="primary" @click="workableDialogFlag = false">确 定</el-button>
  </span>
</el-dialog>
      <!-- 落实 结束 -->
    </div>
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
      editDialogFlag: false,
      workableDialogFlag: false,
      workableDialogForm: {
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
        post: "",
        postData: [
          {
            value: "选项1",
            label: "A-岗位",
          },
          {
            value: "选项2",
            label: "B-岗位",
          },
          {
            value: "选项3",
            label: "C-岗位",
          },
          {
            value: "选项4",
            label: "D-岗位",
          },
        ],
      },
      editDialogListForm: {
        actualContent: "",
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
        post: "",
        postData: [
          {
            value: "选项1",
            label: "A-岗位",
          },
          {
            value: "选项2",
            label: "B-岗位",
          },
          {
            value: "选项3",
            label: "C-岗位",
          },
          {
            value: "选项4",
            label: "D-岗位",
          },
        ],
      },
      permBtn: {
        alarm_find: false,
      },
      height: 300,
      checklist: [
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
      platoonSearchList: [
        {
          area: "风险点1.1.2",
          investigationObjec: "路由器",
          factor: "因素1",
          standard: "工程技术措施",
          content: "工程技术措施细则1",
        },
      ], //表格lis
      total: 0,
      listLoading: false,
      //列表查询参数
      investigationListQuery: {
        checklistType: "",
        checklistTypeData: [
          {
            value: "选项1",
            label: "A-检查表类型",
          },
          {
            value: "选项2",
            label: "B-检查表类型",
          },
          {
            value: "选项3",
            label: "C-检查表类型",
          },
          {
            value: "选项4",
            label: "D-检查表类型",
          },
        ],
        startDate: "",
        closingDate: "",
        inspectionPeriod: "",
        iDisplayLength: 10,
        iDisplayStart: 0,
        checklistName: "",
        name: "",
      },
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
      isToday: false, //是否回显当前日期
       multipleSelection: []
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
    indexMethod(index) {
      return index + 1;
    },
    editDialog(row) {
      console.log(row, "row");
      this.editDialogFlag = true;
    },
    handleSelectionChange(val) {
        console.log(val,'val')
        this.multipleSelection = val;
      },
      workableDialog(){
          this.workableDialogFlag = true;
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
        if (this.investigationListQuery.iDisplayStart != 0) {
          this.$refs.page.backFirstPage();
          return;
        }
      }
      vm.listLoading = true;
      vm.investigationListQuery.fromTime = "";
      vm.investigationListQuery.toTime = "";
      const dateTime = vm.$refs.datePicker.datePicker; //父组件获取子组件数据this.$refs.第一个datePicker是父组件ref值，第二个是子组件model值
      if (dateTime) {
        vm.investigationListQuery.fromTime = dateTime[0] + " 00:00:00";
        vm.investigationListQuery.toTime = dateTime[1] + " 23:59:59";
      }
      vm.$instance
        .post("/proxy/alarm/temperature/findList", vm.investigationListQuery)
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
      this.investigationListQuery.iDisplayStart = pageData.iDisplayStart;
      this.investigationListQuery.iDisplayLength = pageData.iDisplayLength;
      this.getList();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

