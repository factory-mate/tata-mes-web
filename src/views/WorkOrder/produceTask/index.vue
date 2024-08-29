<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <div class="maintain">
        <!-- search -->
        <el-card class="maintain_card">
            <div class="search_main">
                <el-form 
                ref="formlabelref" :model="form" :inline="true" label-width="120px">
                    <!-- <el-form-item label="成品编码：" prop="name">
                        <el-input
                            v-model="form.project"
                            placeholder="请输入"
                        >
                            <template #append>
                                <el-icon @click="clickModel"><MoreFilled /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item> -->
                    
                    <el-form-item label="WES工单号：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产品代码：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="生产任务单号：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产品名称：" prop="project">
                        <el-input v-model="form.project"  placeholder="请输入">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="审核状态：" prop="project">
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
                <el-button  :icon="Plus" @click="clickNew" >新增</el-button>
                <el-button  :icon="Edit" @click="clickEdit" >编辑</el-button>
                <el-button  >关联产品</el-button>
                <el-button  @click="clickCaidan">拆单</el-button>
                <el-button  @click="clickRoudan">揉单</el-button>
                <el-button  >分包</el-button>
                <el-button  >审核</el-button>
                <el-button  >反审核</el-button>
                <el-button  >粗能力运算</el-button>
                <el-button  @click="clickGongxu">生成工序流转卡</el-button>
                <el-button  @click="clickBiangeng">变更</el-button>
               
                <el-dropdown  style="margin-left: 10px;">
                    <el-button >
                        导入
                        <el-icon class="el-icon--right"><arrow-down /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>Excel</el-dropdown-item>
                        <!-- <el-dropdown-item>导出所有</el-dropdown-item> -->
                      </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="date" label="序号" />
                <el-table-column prop="name" label="WES工单号" min-width="120"  />
                <el-table-column prop="name" label="所属组织" min-width="100"  />
                <el-table-column prop="name" label="生产任务单号" min-width="120" />
                <el-table-column prop="name" label="ERP生产单号" min-width="120" />
                <el-table-column prop="name" label="产品代码" min-width="90" />
                <el-table-column prop="name" label="产品名称" min-width="90" />
                <el-table-column prop="name" label="工艺流程代码" min-width="120" />
                <el-table-column prop="name" label="工艺流程名称" min-width="120" />
                <el-table-column prop="name" label="拆单状态" min-width="120" />
                <el-table-column prop="name" label="揉单状态" min-width="120" />
                <el-table-column prop="name" label="预排产状态"  min-width="120" />
                <el-table-column prop="name" label="排产状态"  min-width="120" />
                <el-table-column prop="name" label="生产状态" min-width="90" />
                <el-table-column prop="name" label="生产批号"  min-width="90" />
                <el-table-column prop="name" label="计划数量" min-width="90" />
                <el-table-column prop="name" label="完工数量"  min-width="90" />
                <el-table-column prop="name" label="流转卡号"  min-width="90" />
                <el-table-column prop="name" label="已流转数量"  min-width="120" />
                <el-table-column prop="name" label="未流转数量"  min-width="120" />
                <el-table-column prop="name" label="分包状态"  min-width="90" />
                <el-table-column prop="name" label="包号"  min-width="90" />
                <el-table-column prop="name" label="计划开工日期"  min-width="130" />
                <el-table-column prop="name" label="计划完工日期"  min-width="130" />
                <el-table-column prop="name" label="实际开工日期"  min-width="130" />
                <el-table-column prop="name" label="实际完工日期"  min-width="130" />
                <el-table-column prop="name" label="交货日期"  min-width="90" />
                <el-table-column prop="name" label="审核状态"  min-width="90" />
                <el-table-column prop="name" label="生产状态"  min-width="90" />
                <el-table-column prop="name" label="制单人"  min-width="90" />
                <el-table-column prop="name" label="制单日期"  min-width="90" />
                <el-table-column prop="name" label="审核人"  min-width="90" />
            </el-table>
           <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" />
        </el-card>
        <!-- 搜索弹框 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData" @ModelClose="ModelClose"></searchModel>
        <!-- 拆单 -->
        <caidan :dialogV="caidanV" :dialogTitle="'拆单'"></caidan>
        <!-- 揉单 -->
        <roudan :dialogV="roudanV" :dialogTitle="'揉单'"></roudan>
        <!-- 工序 -->
        <gongxu :dialogV="gongxuV" :dialogTitle="'生产工序流转卡'"></gongxu>
        <!-- 变更 -->
        <biangeng :dialogV="biangengV" :dialogTitle="'变更'"></biangeng>
    </div>
</template>

<script setup lang="ts">
import {ref, toRefs,reactive,getCurrentInstance ,nextTick } from "vue";
import searchModel from "@/components/MultiSelect/searchModel.vue"
import { Delete,Plus,Refresh, Edit,MoreFilled, Search,ArrowDown, Download, Upload } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElDatePicker, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElIcon, ElInput, ElOption, ElSelect, ElTableColumn, FormInstance, FormRules } from 'element-plus'
import caidan from './pages/caidan.vue'
import roudan from './pages/roudan.vue'
import gongxu from './pages/gongxu.vue'
import biangeng from './pages/biangeng.vue'
import { useRouter } from 'vue-router'
const router = useRouter()


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
    caidanV:false,
    roudanV:false,
    gongxuV:false,
    biangengV:false,
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
const {form,dialogType,titleName,tableSet,tableData,gridData,caidanV,roudanV,gongxuV,biangengV} = toRefs(data)
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


// 新增
const clickNew=()=>{
    router.push({name:'produceTaskEdit'})
}
// 编辑
const clickEdit=()=>{
    router.push({name:'produceTaskEdit'})
   
}
// 拆单
const clickCaidan = ()=>{
    caidanV.value=true
}
// 揉单
const clickRoudan = ()=>{
    roudanV.value=true
}
// 工序
const clickGongxu = ()=>{
    gongxuV.value=true
}
// 变更
const clickBiangeng = ()=>{
    biangengV.value=true
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