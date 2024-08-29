<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <div class="maintain">
        <!-- search -->
        <el-card class="maintain_card">
            <div class="search_main">
                <el-form 
                ref="formlabelref" :model="form" :inline="true" label-width="120px">
                    <el-form-item label="产品代码：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产线代码：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产品名称：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产线名称：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="审核状态：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="禁用状态：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="search_but">
                <el-button type="primary" :icon="Search" @click="ClickSearch">搜索</el-button>
                <el-button @click="resetForm(formlabelref)">重置</el-button>
                <el-dropdown split-button  style="margin-left: 10px;">
                    高级
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>Action 1</el-dropdown-item>
                        <el-dropdown-item>Action 2</el-dropdown-item>
                        <el-dropdown-item>Action 3</el-dropdown-item>
                        <el-dropdown-item>Action 4</el-dropdown-item>
                        <el-dropdown-item>Action 5</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </el-card>
        <el-card>
            <div style="float: right;margin-bottom:10px">
                <el-button  :icon="Plus" >新增</el-button>
                <el-button  :icon="Edit" >编辑</el-button>
                <el-button  :icon="Delete" >删除</el-button>
                <el-button  >审核</el-button>
                <el-button  >反审核</el-button>
                <el-button  >禁用</el-button>
                <el-button  >反禁用</el-button>
                <el-button  >导入</el-button>
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
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="date" label="序号" />
                <el-table-column prop="name" label="产线代码" min-width="100"  />
                <el-table-column prop="name" label="产线名称" min-width="100"  />
                <el-table-column prop="name" label="产线产能" min-width="100" />
                <el-table-column prop="name" label="产品代码" min-width="100" />
                <el-table-column prop="name" label="产品名称" min-width="100" />
                <el-table-column prop="name" label="产品节拍" min-width="100" />
                <el-table-column prop="name" label="制单日期" min-width="100" />
                <el-table-column prop="name" label="审核日期" min-width="100" />
                <el-table-column prop="name" label="制单人" min-width="100" />
                <el-table-column prop="name" label="审核状态" min-width="100" />
                <el-table-column prop="name" label="禁用状态"  min-width="100" />
                <el-table-column prop="name" label="所属地区"  min-width="100" />
            </el-table>
           <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" />
        </el-card>
        <!-- 搜索弹框 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData" @ModelClose="ModelClose"></searchModel>
        <!-- 编辑 -->
        <!-- <model :dialogV="dialogV" :dialogTitle="dialogTitle"></model> -->
    </div>
</template>

<script setup lang="ts">
import {ref, toRefs,reactive,getCurrentInstance ,nextTick } from "vue";
import searchModel from "@/components/MultiSelect/searchModel.vue"
import { Delete,Plus,Refresh, Edit,MoreFilled, Search,ArrowDown, Download, Upload } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElDatePicker, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElIcon, ElInput, ElOption, ElSelect, ElTableColumn, FormInstance, FormRules } from 'element-plus'
// import model from './components/productCompModel.vue'


const tabType=ref(true)
const total=ref(10)
const queryParams=ref({
    pageNum:1,
    pageSize:10
})


const data= reactive({
    dialogType:false,
    isCollapse:false,
    titleName:'标题',
    dialogV:false,
    dialogTitle:'编辑',
    form:{
        name:'',
        date:null,
        optVal:'',
        project:''
    },
    tableData: [
        {
            date: '2016-05-03',
            name: 'Tom',
            address: 'No. 189, Grove St, Los Angeles',
        }
    ],
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
const {form,dialogType,titleName,tableSet,tableData,gridData,dialogV,dialogTitle} = toRefs(data)
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
const clickModel=()=>{
    dialogType.value= true
}
const ModelClose=(val:any)=>{
    
    dialogType.value=val.type
}


// 编辑
const clickNew=()=>{
    dialogTitle.value="新增"
    dialogV.value=true
}
// 编辑
const clickEdit=()=>{
    dialogTitle.value="编辑"
    dialogV.value=true
}
</script>

<style scoped lang="scss">
.maintain{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    .maintain_card{
        width: 100%;
        margin-bottom: 20px;
        :deep(.el-card__body){
            display: flex;
            justify-content: space-between;
            .search_main{
                flex: 1;
                :deep(.el-form){
                    width: 100%;
                }
            }
            .search_but{
                width: 260px;
            }
        }
    }
}
.maintain  .selectSty{
    width: 233px;
}
            
:deep(.el-form-item__label){
    font-weight: bold;
}

</style>