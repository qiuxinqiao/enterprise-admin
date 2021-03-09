/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:38:13 
 * @Description: 组织机构
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-07 19:38:37
 */
<template>
  <div class="app-container">
    <div>
      <div class="tabs_right_box_gd">
        <el-button type="primary" @click="departmentListAdd">添 加</el-button>
        <el-button @click="departmentListImport">导 入</el-button>
        <el-button>导 出</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="组织机构" name="organization">组织机构</el-tab-pane>
        <el-tab-pane label="部门列表" name="departmentList">
          <div class="tabs_container_box">
            <el-table
              ref="multipleTable"
              :data="departmentListData"
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
                :index="indexMethod"
                width="80"
              >
              </el-table-column>
              <el-table-column
                align="center"
                label="部门名称"
                width="190"
                prop="departmentName"
              ></el-table-column>
              <el-table-column
                align="center"
                width="190"
                label="上级部门"
                prop="superiorDepartment"
              ></el-table-column>
              <el-table-column
                align="center"
                label="管控层级"
                prop="controlLevel"
              ></el-table-column>
              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="岗位列表" name="postList">岗位列表</el-tab-pane>
        <el-tab-pane label="人员列表" name="personnelList"
          >人员列表</el-tab-pane
        >
        <el-tab-pane label="角色列表" name="roleList">角色列表</el-tab-pane>
      </el-tabs>
    </div>
    <!-- 添加部门 开始 -->
    <el-dialog
      title="添加部门"
      :visible.sync="departmentListDialogAdd"
      width="25%"
      center
    >
      <el-form :model="form" label-position="top">
        <el-form-item label="部门名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="上级部门">
          <el-select
            v-model="form.superiorDepartment"
            placeholder="请选择上级部门"
          >
            <el-option
              v-for="item in form.superiorDepartmentData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管控层级">
          <el-select v-model="form.controlLevel" placeholder="请选择管控层级">
            <el-option
              v-for="item in form.controlLevelData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentListDialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="departmentListDialogAdd = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 添加部门 结束 -->
    <!-- 部门导入 开始 -->
    <el-dialog
      title="部门导入"
      :visible.sync="departmentListDialogImport"
      width="40%"
      center
    >
      <div class="import_container_box_gd">
		  <div class="row_box">1.下载导入模板</div>
			<div class="row_box">根据提示信息完善表格内容</div>
			<div> <el-button icon="el-icon-download">下载空的模板表格</el-button></div>
	  </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 部门导入 结束 -->
  </div>
</template>
<script>
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
// import DatePicker from '../../components/DatePicker';//日期组件
import Pagination from "../../components/Pagination";
export default {
  components: {
    // 'date-picker':DatePicker,//日期组件
    pagination: Pagination,
  },
  data() {
    return {
      activeName: "organization",
      permBtn: {
        alarm_find: false,
      },
      height: 540,
      departmentListData: [
        {
          departmentName: "一车间",
          superiorDepartment: "总经理办公室",
          controlLevel: "车间级",
        },
        {
          departmentName: "一车间",
          superiorDepartment: "总经理办公室",
          controlLevel: "车间级",
        },
        {
          departmentName: "一车间",
          superiorDepartment: "总经理办公室",
          controlLevel: "车间级",
        },
      ], //部门列表表格list
      departmentListDialogAdd: false,
      departmentListAddFlag: false,
	  departmentListDialogImport: false,
	  departmentListImportFlag: false,
      form: {
        name: "",
        superiorDepartment: "",
        superiorDepartmentData: [
          {
            value: "选项1",
            label: "一分厂",
          },
          {
            value: "选项2",
            label: "生产部",
          },
          {
            value: "选项3",
            label: "总经理办公室",
          },
        ],
        controlLevel: "",
        controlLevelData: [
          {
            value: "选项1",
            label: "车间级",
          },
          {
            value: "选项2",
            label: "分厂级",
          },
          {
            value: "选项3",
            label: "部门级",
          },
        ],
      },

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
    vm.getList();
    vm.$nextTick(function () {
      utils.getTableHeight((height) => {
        this.height = height;
      });
    });
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },
    handleClick(tab, event) {
      console.log(tab, "tab");
      if (tab.name == "departmentList") {
        this.departmentListAddFlag = true;
		this.departmentListImportFlag = true;
      }
      console.log(event, "event");
    },
    departmentListAdd() {
      if (this.departmentListAddFlag) {
        this.departmentListDialogAdd = true;
      }
    },
	departmentListImport(){
		if (this.departmentListImportFlag) {
        this.departmentListDialogImport = true;
      }
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
      // const dateTime = vm.$refs.datePicker.datePicker;//父组件获取子组件数据this.$refs.第一个datePicker是父组件ref值，第二个是子组件model值
      // if(dateTime){
      // 	vm.listQuery.fromTime = dateTime[0] + " 00:00:00";
      // 	vm.listQuery.toTime = dateTime[1] + " 23:59:59";
      // }
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

