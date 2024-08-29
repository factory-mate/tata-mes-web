<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <div class="maintain">
        <el-card>
            <div style="float: right;margin-bottom:10px">
                <el-button  :icon="Plus" @click="clickNew">新增</el-button>
                <el-button  :icon="Delete" >删除</el-button>
                <el-button  :icon="Refresh">刷新</el-button>
                <el-button  :icon="Document">打印</el-button>
                <el-button  :icon="View">预览</el-button>
                <el-dropdown  style="margin-left: 10px;">
                    <el-button >
                        导出
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>当前页</el-dropdown-item>
                        <el-dropdown-item>导出所有</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
           <myTable ref="Tref" v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true" :selection="true">
               <template #button >
                    <el-table-column label="操作"  fixed="right" width="200px" align="center">
                        <template #header>
                            <span>操作</span>
                            <myPopup :list="tableColumns" @newList="newList"></myPopup>
                        </template>
                        <template #default>
                            <el-button type="primary"  size="small" @click="clickEdit">编辑</el-button>
                            <el-button type="primary"  size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </template>
           </myTable>
           <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" />
        </el-card>
        <!--弹框 -->
        <model :dialogV="dialogV" :dialogTitle="dialogTitle"></model>
    </div>
</template>

<script setup lang="ts">
import {ref, toRefs,reactive,getCurrentInstance ,nextTick } from "vue";
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import myPopup from '@/components/Popup/index.vue'
import { Delete,Plus, Edit,Refresh,Document,View, Search,ArrowDown, Tools, Upload } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElDatePicker, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElIcon, ElInput, ElOption, ElSelect, ElTableColumn, FormInstance, FormRules } from 'element-plus'

import model from './components/organizationModel.vue'

interface columnType {
    label: string,
    prop?: string,
    width?: string,
    headerSlot?: boolean,
    slotName?: string,
    fixed?:string,
    minwidth?:string,
    slot?:number,
    checkType?:boolean,
}
const dataVal: columnType[] =[
        // 表格配置数据
        {checkType:true, label: '公司编码', prop: 'id', headerSlot:true,slot:1,},
        {checkType:true, label: '公司名称', prop: 'name', headerSlot:true ,slot:0,},
        {checkType:true, label: '营业地址', prop: 'name1',headerSlot:true ,slot:0,},
        {checkType:true, label: '激活状态', prop: 'name2',headerSlot:true ,slot:0,},
        {checkType:true, label: '备注', prop: 'name2',headerSlot:true ,slot:0,},
        {checkType:true, label: '操作', prop: 'name8', slotName: 'button' },
    ]

const tableColumns= ref(dataVal)
const tabType=ref(true)
const total=ref(10)
const queryParams=ref({
    pageNum:1,
    pageSize:10
})


const data= reactive({
    dialogV:false,
    dialogTitle:'新增',

    tableData:[
        {
            id: '0000',
            name: '机床一号',
            position: '一号室',
            project: '螺丝保养',
            finished: '完成',
            starttime: '2022-12-3 16:30:32',
            finishedtime: '2022-12-5 16:30:32',
            alltime: '3',
        }
    ],
    gridData:[
        {
            name:'111',
            value:'数据',
        },
        {
            name:'111',
            value:'数据',
        }
    ],
   
})
const defaultTime1 : [Date, Date] = [
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 0, 0),
]
const {tableData,dialogV,dialogTitle,gridData} = toRefs(data)
const formlabelref = ref<FormInstance>()
// 搜索
const ClickSearch=()=>{
    console.log('search');
}

// 重置
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
// 新增
const clickNew=()=>{
    dialogV.value=true
    dialogTitle.value='新增'
}
const clickEdit=()=>{
    
    dialogV.value=true
    dialogTitle.value='编辑'
}



// 列表排序
const newList=(val:any)=>{
    tabType.value=false
    nextTick(()=>{
        tableColumns.value=val.list
        tabType.value=true

    })
    
    
}
</script>

<style scoped lang="scss">
.maintain{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
}
.maintain  .selectSty{
    width: 233px;
}
            
:deep(.el-form-item__label){
    font-weight: bold;
}
</style>