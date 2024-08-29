<template>
    <div class="xunjian_box" style="padding: 20px;">
      <el-card class="form_card1" style="padding-top: 50px;">
        <div class="btns" >
          <el-button  @click="goback(ruleFormRef)" type="primary">返回</el-button>
          <el-button @click="change(ruleFormRef)" type="primary">{{ btnName }}</el-button>
          <el-button  @click="abondon(ruleFormRef)" type="primary">放弃</el-button>
          <el-button @click="save(ruleFormRef)" type="primary" :disabled="changeForm ? true : false">保存</el-button>
          <el-dropdown split-button style="margin-right: 20px;">
            导出
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleExport">导出当前页</el-dropdown-item>
                <el-dropdown-item @click="handleExportall">导出所有页</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="heade_form" v-show="showForm">
          <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm"
            :inline="true">
            <el-form-item label="设备名称" prop="name">
              <el-input v-model="ruleForm.name" class="inpt" style="width: 250px;" :disabled="changeForm ? true : false" />
            </el-form-item>
            <el-form-item label="设备编号" prop="code">
              <el-input v-model="ruleForm.code" placeholder="请输入编号" class="input-with-select" :disabled="changeForm ? true : false"  >
                <template #append>
                  <el-button :icon="MoreFilled" @click="clickModel" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="time" label="申报时间" class="elitem" style="font-weight: 600;">
                    <div>
                    <el-time-picker v-model="ruleForm.time" is-range range-separator="至" start-placeholder="开始时间"
                            end-placeholder="结束时间" :disabled="changeForm ? true : false"  />
                    </div>
            </el-form-item>
            <el-form-item label="单号" prop="odd">
              <el-input v-model="ruleForm.odd" class="inpt" :disabled="changeForm ? true : false"  />
            </el-form-item>
            <el-form-item label="来源单号" prop="sourceodd">
              <el-input v-model="ruleForm.sourceodd" class="inpt" :disabled="changeForm ? true : false"  />
            </el-form-item>
            <el-form-item label="是否转维修单" prop="repair">
              <el-select v-model="ruleForm.repair" placeholder="" :disabled="changeForm ? true : false" >
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
            <el-form-item label="设备位置" prop="place">
              <el-input v-model="ruleForm.place" placeholder="请输入编号" class="input-with-select" :disabled="changeForm ? true : false"  >
                <template #append>
                  <el-button :icon="MoreFilled" @click="clickModel" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="申报人" prop="person">
              <el-input v-model="ruleForm.person" placeholder="请输入编号" class="input-with-select" :disabled="changeForm ? true : false"  >
                <template #append>
                  <el-button :icon="MoreFilled" @click="clickModel" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="申报工位" prop="station">
              <el-input v-model="ruleForm.station" placeholder="请输入编号" class="input-with-select" :disabled="changeForm ? true : false"  >
                <template #append>
                  <el-button :icon="MoreFilled" @click="clickModel" />
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="申报类型" prop="type">
              <el-select v-model="ruleForm.type" placeholder="" style="width: 250px;" :disabled="changeForm ? true : false" >
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="ruleForm.remark" class="inpt" :disabled="changeForm ? true : false"  />
            </el-form-item>
          </el-form>
        </div>
        <!-- 弹出层 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet"  @ModelClose="ModelClose"></searchModel>
      </el-card>
      <el-card>
        <template #header>
            <el-form-item style="float: right;margin: 0 20px;" @click="showform">
               <img src="/src/assets/展开.png" alt="" >
            </el-form-item>
            <el-form-item style="float: right;">
                <el-button :icon="Delete" @click="updata" >删除</el-button>
            </el-form-item>
        </template>
        <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true" @dblclick="doubleThing()">
          <template #handler>
             <el-table-column label="操作" fixed="right" width="200px" align="center">
                <template #header><span>操作</span>
                            <myPopup :list="tableColumns" @newList="newList"></myPopup>
                        </template>
               <template #default="scope">
                <el-button size="small" type="primary" :icon="Edit"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" :icon="Delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                 </template>
               </el-table-column>
        </template>
        </MyTable>
        <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" />
      </el-card>
    </div>
  </template>
  <script lang="ts" setup>
  import { reactive, ref,toRefs,nextTick } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import {  Edit, Delete,MoreFilled } from '@element-plus/icons-vue';
  import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
  import searchModel from "@/components/MultiSelect/searchModel.vue"
  import { useRouter } from 'vue-router'
  import myPopup from '@/components/Popup/index.vue'
  const showForm=ref(true)
  const router=useRouter()
  // 申报时间
  const value1=ref('')
  // 弹出层开关
  const dialogFormVisible = ref(false)
  const ruleFormRef = ref<FormInstance>()
    const changeForm = ref(true)
    const btnName = ref('修改')
  // const dialogType=ref(false)
  // 弹出框数据
  const form1 = reactive({
  })
  interface dataType {
    id?: string
    date?: string
    name?: string
    name3?: string
    address?: string
  }
  interface columnType {
    label: string,
    prop: string,
    width?: string,
    headerSlot?: boolean
    slotName?: string
    fixed?: string
    minwidth?:string
    sortable?:boolean
    checkType?:boolean
    slot?:number
  }
  const tableData: dataType[] = [
    {
      id: '001',
      name: '传感设备',
      date: '备注备注'
    },
    {
      id: '002',
      name: '传感设备',
      date: '备注备注'
    },
    {
      id: '003',
      name: '传感设备',
      date: '备注备注'
    }
  ]
  const dataVal: columnType[] = [
    // 表格配置数据
    {checkType:true, label: '上次巡检时间', prop: 'id',headerSlot:true,slot:0,minwidth:'170'},
    {checkType:true, label: '项目编码', prop: 'name',headerSlot:true,slot:0,minwidth:'150' },
    {checkType:true, label: '项目名称', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '优先级', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '实际巡检人', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '开始时间', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '结束时间', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '是否巡检完成', prop: 'name',headerSlot:true ,slot:0,minwidth:'170'},
    {checkType:true, label: '巡检结果', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '原因名称', prop: 'name', headerSlot:true,slot:0,minwidth:'150'},
    {checkType:true, label: '避免方案', prop: 'name',headerSlot:true ,slot:0,minwidth:'150'},
    {checkType:true, label: '操作', prop: 'name4', width: '180', fixed: 'right', slotName: 'handler',headerSlot:true }
  ]
const tableColumns=ref(dataVal)
const tabType=ref(true)
  const dialogdata =reactive({
    dialogType:false,
      titleName:'标题',
      queryParams: {
    pageNum: 1,
    pageSize: 10
    },
     total:1,
      form:{
          name:'',
          date:null,
          optVal:'',
          project:''
      },
      tableSet:[
          {
              name:'名称一',
              key:'name'
          },
          {
              name:'名称二',
              key:'value'
          },
      ],
      options:[
          {
              value: '1',
              label: '是',
          },
          {
              value: '2',
              label: '否',
          }
      ],
  })
  const {dialogType,titleName,form,tableSet,options,queryParams,total}=toRefs(dialogdata)
  // form数据
  const ruleForm = reactive({
  // 设备名称
  name:'',
  // 申报时间
  time:'',
  // 设备编码
  code:'',
  // 单号
  odd:'',
  // 来源单号
  sourceodd:'',
  // 是否转维修单
  repair:'',
  // 设备位置
  place:'',
  // 申报人
  person:'',
  // 申报工位
  station:'',
  // 申报类型
  type:'',
  // 备注
  remark:'',
})
  // 必选提示规则
  const rules = reactive<FormRules>({
    odd: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  code: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  time: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  })
  // 返回
  const goback = (val: any) => {
    router.push('failure')
  }
  // 保存
  const save = (val: any) => {
  
  }
  // 导出
  const exportlist = (val: any) => {
  
  }
  
  // 编辑事件
  const handleEdit = (index: any, row: any) => {
    console.log(index, row)
    // EditFormVisible.value = true
  }
  // table顶部删除
  const updata=()=>{

  }
  // table内部 删除事件
  const handleDelete = (index: any, row: any) => {
    console.log(index, row)
  }

  //双击事件，弹窗弹出
  const doubleThing = () => {
    dialogType.value = true
  }
  const handleExport =()=>{
    console.log('导出当前页');
    
  }
  const handleExportall=()=>{
    console.log('导出所有页');
  }
  // 弹出框函数
  const clickModel=()=>{
    dialogType.value= true
  }
  const ModelClose=(val:any)=>{
    dialogType.value=val.type
  }
  const showform=()=>{
    showForm.value=!showForm.value
  }
//   修改
  const change=(val:any)=>{
    changeForm.value = !changeForm.value
    if (btnName.value == '修改') {
        btnName.value = '取消'
    } else {
        btnName.value = '修改'
    }

  }
//  放弃
  const abondon=(val:any)=>{

  }
  const newList=(val:any)=>{
    tabType.value=false
    nextTick(()=>{
        tableColumns.value=val.list
        tabType.value=true

    })
}
  </script>
  <style lang="scss" scoped>
  .inpt {
    width: 251px;
  }
  :deep(.el-dropdown){
    margin-left: 10px;
  }
  .form_card1 {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    .heade_form {
      width: 100%;
      height: 100%;
      display: inline-block;
    }
  .input-with-select{
    width: 251px;
  }
  .header_btn{
    float: right;


  }
    .btns {
    margin-top: 20px;
    position: absolute;
    top: 0px;
    right: 0px;
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    text-align: right;
    }
  }
  </style>