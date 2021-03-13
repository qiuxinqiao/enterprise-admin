/*
 * @Author: qiaozp 
 * @Date: 2021-03-07 19:38:13 
 * @Description: 组织机构
 * @Last Modified by: qiaozp
 * @Last Modified time: 2021-03-13 09:39:47
 */
<template>
  <div class="app-container">
    <div>
      <div class="tabs_right_box_gd" v-if="organizationFlag">
        <el-button type="primary">添 加</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
      <div class="tabs_right_box_gd" v-if="departmentListFlag">
        <el-button type="primary" @click="departmentListAdd">添 加</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
      <div class="tabs_right_box_gd" v-if="postListFlag">
        <el-button type="primary" @click="postListAdd">添 加</el-button>
        <el-button @click="postListImport">导 入</el-button>
        <el-button>导 出</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
      <div class="tabs_right_box_gd" v-if="personnelListFlag">
        <div class="search_box">
          <el-select v-model="value" clearable placeholder="请选择">
            <el-option
              v-for="item in search"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button type="primary">搜索</el-button>
        </div>
        <el-button type="primary" @click="personnelListAdd">添 加</el-button>
        <el-button @click="personnelListImport">导 入</el-button>
        <el-button>导 出</el-button>
        <el-button type="danger">删 除</el-button>
      </div>
      <div class="tabs_right_box_gd" v-if="roleListFlag">
        <el-button type="primary" @click="roleListAdd">添 加</el-button>
      </div>
      <el-tabs v-model="activeName" :before-leave="Tabever">
        <el-tab-pane label="组织机构" name="organization">
          <div class="tabs_container_box">
            <div style="height:50px;padding-top:6px;padding-left: 30px;padding-right:30px;border-bottom: #efefef solid 1px;">
      
    </div>
    <div style="height:calc(100vh - 100px);">
      <SeeksRelationGraph
        ref="seeksRelationGraph"
        :options="graphOptions"
        :on-node-click="onNodeClick"
        :on-line-click="onLineClick"
      />
    </div>
          </div>
        </el-tab-pane>
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
        <el-tab-pane label="岗位列表" name="postList">
          <div class="tabs_container_box">
            <el-table
              ref="multipleTable"
              :data="postListData"
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
                label="岗位名称"
                width="190"
                prop="jobName"
              ></el-table-column>
              <el-table-column
                align="center"
                label="所属部门"
                prop="department"
              ></el-table-column>

              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="人员列表" name="personnelList">
          <div class="tabs_container_box">
            <el-table
              ref="multipleTable"
              :data="personnelListData"
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
                label="姓名"
                width="190"
                prop="name"
              ></el-table-column>
              <el-table-column
                align="center"
                width="190"
                label="职位/岗位"
                prop="position"
              ></el-table-column>
              <el-table-column
                align="center"
                label="所属部门"
                prop="department"
              ></el-table-column>
              <el-table-column
                align="center"
                label="联系手机"
                prop="phone"
              ></el-table-column>
              <el-table-column
                align="center"
                label="该部门主要负责人"
                prop="person"
              ></el-table-column>
              <el-table-column
                align="center"
                label="安全生产委员会成员"
                prop="committee"
              ></el-table-column>
              <el-table-column
                align="center"
                label="安全管理员"
                prop="security"
              ></el-table-column>
              <el-table-column
                align="center"
                label="特殊许可作业员"
                prop="operator"
              ></el-table-column>
              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="角色列表" name="roleList">
          <div class="tabs_container_box">
            <el-table
              ref="multipleTable"
              :data="roleListData"
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
                label="角色名称"
                width="190"
                prop="roleName"
              ></el-table-column>
              <el-table-column
                align="left"
                label="拥有的职权"
                prop="authority"
              ></el-table-column>

              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button type="text" size="small">编辑</el-button>
                  <el-button type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
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
    <!-- 岗位列表 开始 -->
    <el-dialog title="添加岗位" :visible.sync="postListDialogAdd" width="25%">
      <el-form :model="form" label-position="top">
        <el-form-item label="岗位名称">
          <el-input
            v-model="form.name"
            autocomplete="off"
            class="form_input_w"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select
            v-model="form.superiorDepartment"
            placeholder="请选择所属部门"
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="postListDialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="postListDialogAdd = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 岗位列表 结束 -->
    <!-- 岗位列表导入 开始 -->
    <el-dialog
      title="岗位列表导入"
      :visible.sync="postListDialogImport"
      width="40%"
    >
      <div class="import_container_box_gd">
        <div class="row_box">1.下载导入模板</div>
        <div class="row_box">根据提示信息完善表格内容</div>
        <div class="button_box">
          <el-button icon="el-icon-download">下载空的模板表格</el-button>
        </div>
        <div class="row_box">2. 上传完善后的表格</div>
        <div class="xls_box">
          <div class="xls_flex" v-if="postListDialogImportSuccess">
            <img src="../../assets/img/icon/xlsx.png" alt="" srcset="" />
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
              :limit="3"
              :file-list="fileList"
            >
              <el-button>选择文件</el-button>
              <div slot="tip" class="el-upload__tip">
                可直接将文件拖拽到此处进行上传，支持格式：XLS、XLSX
              </div>
            </el-upload>
          </div>
          <div class="xls_flex" v-if="!postListDialogImportSuccess">
            <img src="../../assets/img/icon/xls.png" alt="" srcset="" />
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
              :limit="3"
              :file-list="fileList"
            >
              <el-button>重新选择</el-button>
            </el-upload>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="postListDialogImport = false">取 消</el-button>
        <el-button type="primary" @click="postListDialogImportSuccess = false"
          >导 入</el-button
        >
      </span>
    </el-dialog>
    <!-- 岗位列表导入 结束 -->
    <!-- 人员列表 添加 开始 -->
    <el-dialog
      title="添加人员"
      :visible.sync="personnelListDialogAdd"
      width="55%"
      :before-close="handleClose"
      custom-class="personnelListDialog_box"
      top="8vh"
    >
      <el-form
        ref="form"
        :model="personnelListForm"
        class="demo-ruleForm"
        label-position="top"
      >
        <div class="form_container">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="归属部门">
                <el-select
                  v-model="personnelListForm.department"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.departmentData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="工号">
                <el-input
                  v-model="personnelListForm.jobNumber"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入工号（工号位数为8位数字）"
                ></el-input>
              </el-form-item>
              <el-form-item label="角色">
                <el-select
                  v-model="personnelListForm.role"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.roleData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否为安全生产委员会成员">
                <el-select
                  v-model="personnelListForm.committee"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.committeeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="密码">
                <el-input
                  v-model="personnelListForm.password"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="personnelListForm.mailbox"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入邮箱"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否为该部门主要负责人">
                <el-select
                  v-model="personnelListForm.person"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.personData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名">
                <el-input
                  v-model="personnelListForm.name"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
              <el-form-item label="职位/岗位">
                <el-select
                  v-model="personnelListForm.position"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.positionData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="手机号">
                <el-input
                  v-model="personnelListForm.phone"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入11位手机号"
                ></el-input>
              </el-form-item>
              <el-form-item label="确认密码">
                <el-input
                  v-model="personnelListForm.confirmPassword"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入确认密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="座机电话">
                <el-input
                  v-model="personnelListForm.tel"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入11位座机号，例：02988888888"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="form_title_box_gd">用户角色</div>
        <div class="form_container">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="是否为安全管理员">
                <el-select
                  v-model="personnelListForm.security"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.securityData"
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
              <el-form-item label="是否为特殊许可作业员">
                <el-select
                  v-model="personnelListForm.operator"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.operatorData"
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
        <div class="form_title_box_gd">人员证书管理</div>
        <div class="form_container">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="证件类型">
                <el-select
                  v-model="personnelListForm.documentType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in personnelListForm.documentTypeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="取证时间">
                <el-time-select
                  v-model="personnelListForm.time"
                  class="form_input_w"
                  :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '18:30',
                  }"
                  placeholder="请选择取证时间"
                >
                </el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="证件号码">
                <el-input
                  v-model="personnelListForm.identificationNumber"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入证件号码"
                ></el-input>
              </el-form-item>
              <el-form-item label="证件有效期（年）">
                <el-input
                  v-model="personnelListForm.termOfValidity"
                  class="form_input_w"
                  :disabled="disabled"
                  placeholder="请输入证件有效期（年）"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="personnelListDialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="personnelListDialogAdd = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 人员列表 添加 结束 -->
    <!-- 人员列表导入 开始 -->
    <el-dialog
      title="部门导入"
      :visible.sync="personnelListDialogImport"
      width="40%"
    >
      <div class="import_container_box_gd">
        <div class="row_box">1.下载导入模板</div>
        <div class="row_box">根据提示信息完善表格内容</div>
        <div class="button_box">
          <el-button icon="el-icon-download">下载空的模板表格</el-button>
        </div>
        <div class="row_box">2. 上传完善后的表格</div>
        <div class="xls_box">
          <div class="xls_flex" v-if="personnelListDialogImportSuccess">
            <img src="../../assets/img/icon/xlsx.png" alt="" srcset="" />
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
              :limit="3"
              :file-list="fileList"
            >
              <el-button>选择文件</el-button>
              <div slot="tip" class="el-upload__tip">
                可直接将文件拖拽到此处进行上传，支持格式：XLS、XLSX
              </div>
            </el-upload>
          </div>
          <div class="xls_flex" v-if="!personnelListDialogImportSuccess">
            <img src="../../assets/img/icon/xls.png" alt="" srcset="" />
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
              :limit="3"
              :file-list="fileList"
            >
              <el-button>重新选择</el-button>
            </el-upload>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="personnelListDialogImport = false">取 消</el-button>
        <el-button
          type="primary"
          @click="personnelListDialogImportSuccess = false"
          >导 入</el-button
        >
      </span>
    </el-dialog>
    <!-- 人员列表导入 结束 -->
    <!-- 角色列表 添加 -->
    <el-dialog
      title="添加角色"
      :visible.sync="roleListDialogAdd"
      width="45%"
      :before-close="handleClose"
    >
      <el-form
        ref="form"
        :model="roleListDialogForm"
        class="demo-ruleForm"
        label-position="top"
      >
        <div class="form_container">
          <el-row :gutter="32">
            <el-col :span="12">
              <el-form-item label="角色名称">
                <el-input
                  v-model="roleListDialogForm.roleName"
                  class="form_input_w"
                  :disabled="disabled"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"> </el-col>
          </el-row>
        </div>
        <div class="form_title_box_gd">角色权限</div>
        <div class="form_container">
          <el-form-item label="角色管理">
            <el-select
              v-model="roleListDialogForm.roleManager"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleListDialogForm.roleManagerData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业信息">
            <el-select
              v-model="roleListDialogForm.enterprise"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleListDialogForm.enterpriseData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="现场管理">
            <el-select v-model="roleListDialogForm.scene" placeholder="请选择">
              <el-option
                v-for="item in roleListDialogForm.sceneData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险管控">
            <el-select
              v-model="roleListDialogForm.riskControl"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleListDialogForm.riskControlData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="隐患管理">
            <el-select
              v-model="roleListDialogForm.hiddenDanger"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleListDialogForm.hiddenDangerData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安全检查">
            <el-select
              v-model="roleListDialogForm.securityCheck"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleListDialogForm.securityCheckData"
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
        <el-button @click="roleListDialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="roleListDialogAdd = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 角色列表 结束 -->
  </div>
</template>
<script>
import SeeksRelationGraph from 'relation-graph'
import { utils } from "src/utils";
import { validate } from "utils/validate";
import { Message } from "element-ui";
// import DatePicker from '../../components/DatePicker';//日期组件
import Pagination from "../../components/Pagination";
export default {
  components: {
    SeeksRelationGraph,
    // 'date-picker':DatePicker,//日期组件
    pagination: Pagination,
  },
  data() {
    return {
      currentCase: '横向树状图谱',
      isShowCodePanel: false,
      graphOptions: {
        'backgrounImage': 'http://ai-mark.cn/images/ai-mark-desc.png',
        'backgrounImageNoRepeat': true,
        'layouts': [
          {
            'label': '中心',
            'layoutName': 'tree',
            'layoutClassName': 'seeks-layout-center',
            'defaultJunctionPoint': 'border',
            'defaultNodeShape': 0,
            'defaultLineShape': 1,
            'min_per_width': 40,
            'max_per_width': 70,
            'min_per_height': 200
          }
        ],
        'defaultLineMarker': {
          'markerWidth': 12,
          'markerHeight': 12,
          'refX': 6,
          'refY': 6,
          'data': 'M2,2 L10,6 L2,10 L6,6 L2,2'
        },
        'defaultNodeShape': 1,
        'defaultNodeWidth': '30',
        'defaultLineShape': 2,
        'defaultJunctionPoint': 'tb',
        'defaultNodeBorderWidth': 0,
        'defaultLineColor': 'rgba(0, 186, 189, 1)',
        'defaultNodeColor': 'rgba(0, 206, 209, 1)',
        'defaultNodeHeight': '100'
      },





      activeName: "organization",
      disabled:false,
      organizationFlag: true,
      departmentListFlag: false,
      postListFlag: false,
      personnelListFlag: false,
      roleListFlag: false,
      
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
      postListData: [
        {
          jobName: "安全员",
          department: "安全部",
        },
      ], //岗位列表表格list
      departmentListDialogAdd: false,
      departmentListAddFlag: false,
      postListDialogImport: false,
      postListImportFlag: false,
      postListDialogImportSuccess: true,
      personnelListDialogAdd: false,
      personnelListDialogImport: false,
      personnelListDialogImportSuccess: true,
      roleListDialogAdd: false,
      roleListAddFlag: false,
      postListDialogAdd:false,
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

      total: 20,
      listLoading: false,
      //列表查询参数
      listQuery: {
        iDisplayLength: 10,
        iDisplayStart: 0,
        companyName: "",
        name: "",
      },
      fileList: [{ name: "公司岗位.xls", url: "", size: "（20KB）" }],
      search: [
        {
          value: "选项1",
          label: "部门级",
        },
      ],
      personnelListData: [
        {
          name: "张德高",
          position: "安全员",
          department: "安全部",
          phone: "17788888888",
          person: "否",
          committee: "是",
          security: "是",
          operator: "否",
        },
      ],
      personnelListForm: {
        department: "",
        departmentData: [
          {
            value: "选项1",
            label: "部门级",
          },
        ],
        person: "",
        personData: [
          {
            value: "选项1",
            label: "是",
          },
          {
            value: "选项2",
            label: "否",
          },
        ],
        jobNumber: "",
        role: "",
        roleData: [
          {
            value: "选项1",
            label: "角色",
          },
        ],
        committee: "",
        committeeData: [
          {
            value: "选项1",
            label: "是",
          },
          {
            value: "选项2",
            label: "否",
          },
        ],
        password: "",
        mailbox: "",
        name: "",
        position: "",
        positionData: [
          {
            value: "选项1",
            label: "部门级",
          },
        ],
        phone: "",
        confirmPassword: "",
        tel: "",
        security: "",
        securityData: [
          {
            value: "选项1",
            label: "是",
          },
          {
            value: "选项2",
            label: "否",
          },
        ],
        operator: "",
        operatorData: [
          {
            value: "选项1",
            label: "是",
          },
          {
            value: "选项2",
            label: "否",
          },
        ],
        documentType: "",
        documentTypeData: [
          {
            value: "选项1",
            label: "身份证",
          },
        ],
        time: "",
        identificationNumber: "",
        termOfValidity: "",
      },
      roleListData: [
        {
          roleName: "安全检查",
          authority: "添加安全检查,下载安全检查报告",
        },
      ],
      roleListDialogForm: {
        roleName: "",
        roleManager: "",
        roleManagerData: [
          {
            value: "选项1",
            label: "角色1",
          },
          {
            value: "选项2",
            label: "角色2",
          },
        ],
        enterprise: "",
        enterpriseData: [
          {
            value: "选项1",
            label: "企业信息1",
          },
          {
            value: "选项2",
            label: "企业信息2",
          },
        ],
        scene: "",
        sceneData: [
          {
            value: "选项1",
            label: "现场管理1",
          },
          {
            value: "选项2",
            label: "现场管理2",
          },
        ],
        riskControl: "",
        riskControlData: [
          {
            value: "选项1",
            label: "风险管控1",
          },
          {
            value: "选项2",
            label: "风险管控2",
          },
        ],
        hiddenDanger: "",
        hiddenDangerData: [
          {
            value: "选项1",
            label: "隐患管理1",
          },
          {
            value: "选项2",
            label: "隐患管理2",
          },
        ],
        securityCheck: "",
        securityCheckData: [
          {
            value: "选项1",
            label: "安全检查1",
          },
          {
            value: "选项2",
            label: "安全检查2",
          },
        ],
      },
      isToday: false, //是否回显当前日期
    };
  },
  mounted() {
    this.showSeeksGraph()
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
    showSeeksGraph(query) {
      var __graph_json_data = { 
        'rootId': 'a', 'nodes': [
          { 'id': 'a', 'text': '张德高' },
           { 'id': 'b', 'text': 'b' }, 
           
                 { 'id': 'c', 'text': 'c' }, 
                 { 'id': 'c1', 'text': 'c1' }, 
                 
                  { 'id': 'c2', 'text': 'c2' }, 
                  
                 
                 { 'id': 'd', 'text': 'd' },
                  
                  { 'id': 'e', 'text': 'e' }, 

                  
                  ], 'links': [{ 'from': 'a', 'to': 'b' }, 
                  
                     
                    { 'from': 'a', 'to': 'c' }, 
                    { 'from': 'c', 'to': 'c1' }, 
                    
                     { 'from': 'c', 'to': 'c2' }, 
                     
                     
                     { 'from': 'a', 'to': 'd' }, 
                    
                     { 'from': 'a', 'to': 'e' }, 
                     ] }
      this.$refs.seeksRelationGraph.setJsonData(__graph_json_data, (seeksRGGraph) => {
        // 这些写上当图谱初始化完成后需要执行的代码
      })
    },
    onNodeClick(nodeObject, $event) {
      console.log('onNodeClick:', nodeObject)
    },
    onLineClick(lineObject, $event) {
      console.log('onLineClick:', lineObject)
    },


    Tabever(activeName, oldActiveName) {
      console.log(activeName, "activeName");
      console.log(oldActiveName, "oldActiveName");
      if (activeName == "organization") {
        this.organizationFlag = true;
        this.departmentListFlag = false;
        this.postListFlag = false;
        this.personnelListFlag = false;
        this.roleListFlag = false;
        return;
      }
      if (activeName == "departmentList") {
        this.departmentListFlag = true;
        this.departmentListAddFlag = true;
        this.organizationFlag = false;
        this.postListFlag = false;
        this.personnelListFlag = false;
        this.roleListFlag = false;
        return;
      }
      if (activeName == "postList") {
        this.postListFlag = true;
        this.organizationFlag = false;
        this.departmentListFlag = false;
        this.personnelListFlag = false;
        this.roleListFlag = false;
        return;
      }
      if (activeName == "personnelList") {
        this.personnelListFlag = true;
        this.departmentListFlag = false;
        this.organizationFlag = false;
        this.roleListFlag = false;
        this.postListFlag = false;
        return;
      }
      if (activeName == "roleList") {
        this.roleListFlag = true;
        this.departmentListFlag = false;
        this.organizationFlag = false;
        this.postListFlag = false;
        this.personnelListFlag = false;
        return;
      }
    },

     handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    indexMethod(index) {
      return index + 1;
    },

    departmentListAdd() {
      if (this.departmentListAddFlag) {
        this.departmentListDialogAdd = true;
      }
    },
    postListAdd() {
      if (this.postListFlag) {
        this.postListDialogAdd = true;
      }
    },
    postListImport() {
      if (this.postListFlag) {
        this.postListDialogImport = true;
      }
    },
    personnelListAdd() {
      if (this.personnelListFlag) {
        this.personnelListDialogAdd = true;
      }
    },
    personnelListImport() {
      if (this.personnelListFlag) {
        this.personnelListDialogImport = true;
      }
    },
    departmentListImport() {
      if (this.departmentListImportFlag) {
        this.departmentListDialogImport = true;
      }
    },
    roleListAdd() {
      if (this.roleListFlag) {
        this.roleListDialogAdd = true;
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
.test{
    padding: 10px;
}
.operation{
    padding: 10px 24px;
}
.chart {
    margin: 0 24px 18px 24px;
    border: 1px solid rgba(241, 242, 242, 1);
    height: 800px;
    margin-top: 20px;
}
</style>

