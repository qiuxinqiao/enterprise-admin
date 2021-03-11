/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:32:43 
 * @Description: 基础信息
 * @Last Modified by: guodi
 * @Last Modified time: 2021年3月9日10:15:22
 */
<template>
  <div class="app-container">
    <div class="title_box_gd">
      <div class="title">基础信息</div>
      <div class="right" v-if="modifyFlag">
        <el-button>取 消</el-button>
        <el-button type="primary">保 存</el-button>
      </div>
	  <div class="right" v-else>
        <el-button>修 改</el-button>
      </div>
    </div>
    <div class="container_box_gd">
      <el-form
        ref="form"
        :model="form"
        class="demo-ruleForm"
        label-position="top"
      >
        <div class="form_title_box_gd">基础信息</div>
        <div class="form_container">
          <el-form-item label="企业名称">
            <el-input
              v-model="form.name"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="单位地址">
            <el-input
              v-model="form.address"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业类型">
            <el-input
              v-model="form.enterpriseType"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业简介">
            <el-input
              type="textarea"
              v-model="form.introduction"
              class="form_input_w"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </div>
        <div class="form_title_box_gd">双预控信息</div>
        <div class="form_container">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="管控层级">
                <el-input
                  v-model="form.controlLevel"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="风险等级">
                <el-select
                  v-model="form.riskLevel"
                  placeholder="请选择风险等级"
                >
                  <el-option
                    v-for="item in form.riskLevelData"
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
        <div class="form_title_box_gd">联系信息</div>
        <div class="form_container">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="机构编码">
                <el-input
                  v-model="form.institutionalCode"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮政编码">
                <el-input
                  v-model="form.postCode"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱">
                <el-input
                  v-model="form.mail"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业法人">
                <el-input
                  v-model="form.legalPerson"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="联系电话">
                <el-input
                  v-model="form.phone"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
              <el-form-item label="传真">
                <el-input
                  v-model="form.fax"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form_title_box_gd">高级设置</div>
        <div class="form_container">
          <el-form-item label="定位">
            <el-input
              v-model="form.location"
              class="form_input_w"
              :disabled="disabled"
              prefix-icon="el-icon-location-outline"
            >
            </el-input>
			 <el-button type="primary" class="ml-8 ">定 位</el-button>
          </el-form-item>
        </div>
        
        <div class="form_container">
			<div class="label_title">厂区平面图</div>
         <el-upload
			action="https://jsonplaceholder.typicode.com/posts/"
			list-type="picture-card"
			:on-preview="handlePictureCardPreview"
			:on-remove="handleRemove">
			<i class="el-icon-plus"></i>
			</el-upload>
			<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="form.dialogImageUrl" alt="">
			</el-dialog>
          
        </div>

        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item> -->
      </el-form>
    </div>
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
      form: {
        name: "",
        address: "",
        enterpriseType: "",
        introduction: "",
        controlLevel: "",
        riskLevel: "",
        riskLevelData: [
          {
            value: "选项1",
            label: "A-重大风险企业",
          },
          {
            value: "选项2",
            label: "B-较大风险企业",
          },
          {
            value: "选项3",
            label: "C-一般风险企业",
          },
          {
            value: "选项4",
            label: "D-低风险企业",
          },
        ],
        institutionalCode: "",
        postCode: "",
        mail: "",
        legalPerson: "",
        phone: "",
        fax: "",
        location: "",
        dialogImageUrl:'',

        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
	  modifyFlag: true, // 修改的时间是false
      dialogVisible: false,
      // disabled: false
      disabled: false, //true不可以修改
      permBtn: {
        alarm_find: false,
      },
      height: 540,
      list: [], //表格list
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
    // vm.getPerm();
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
