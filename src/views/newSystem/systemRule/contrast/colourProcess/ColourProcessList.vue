<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <div class="maintain">
        <!-- search -->
        <el-card class="maintain_card">
            <div class="search_main">
                <el-form 
                ref="formlabelref" :model="form" :inline="true" label-width="120px">
                    <el-form-item label="产品分类：" prop="name">
                        <el-input
                            v-model="form.project"
                            placeholder="请输入"
                        >
                            <template #append>
                                <el-icon @click="clickModel"><MoreFilled /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产品分类2：" prop="name">
                        <el-input
                            v-model="form.project"
                            placeholder="请输入"
                        >
                            <template #append>
                                <el-icon @click="clickModel"><MoreFilled /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="产品名称：" prop="name">
                        <el-input
                            v-model="form.project"
                            placeholder="请输入"
                        >
                            <template #append>
                                <el-icon @click="clickModel"><MoreFilled /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="订单材质名称：" prop="name">
                        <el-input
                            v-model="form.project"
                            placeholder="请输入"
                        >
                            <template #append>
                                <el-icon @click="clickModel"><MoreFilled /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    
                   
                   
                </el-form>
            </div>
            <div class="search_but">
                <el-button type="primary" :icon="Search" @click="ClickSearch">搜索</el-button>
                <el-button @click="resetForm(formlabelref)">重置</el-button>
            </div>
        </el-card>
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
           <myTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true"  :selection="true">
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
        <!-- 搜索弹框 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData" @ModelClose="ModelClose"></searchModel>
    </div>
</template>

<script setup lang="ts">
import {ref, toRefs,reactive,getCurrentInstance ,nextTick } from "vue";
import searchModel from "@/components/MultiSelect/searchModel.vue"
import { useRouter } from 'vue-router'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import myPopup from '@/components/Popup/index.vue'
import { Delete,Plus,Refresh, Edit,MoreFilled, Search,ArrowDown, Document, View } from '@element-plus/icons-vue'
import { ElButton, ElCard, ElDatePicker, ElDropdown, ElDropdownItem, ElDropdownMenu, ElForm, ElFormItem, ElIcon, ElInput, ElOption, ElSelect, ElTableColumn, FormInstance, FormRules } from 'element-plus'
const router = useRouter()

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
        {checkType:true, label: '属性编码', prop: 'id', headerSlot:true,slot:1,minwidth:'150px'},
        {checkType:true, label: '产品分类', prop: 'name1',headerSlot:true ,slot:0,minwidth:'150px'},
        {checkType:true, label: '产品分类2', prop: 'name1',headerSlot:true ,slot:0,minwidth:'150px'},
        {checkType:true, label: '结构名称', prop: 'name1',headerSlot:true ,slot:0,minwidth:'150px'},
        {checkType:true, label: '订单材质名称', prop: 'name1',headerSlot:true ,slot:0,minwidth:'150px'},
        {checkType:true, label: '加工材质名称', prop: 'name1',headerSlot:true ,slot:0,minwidth:'150px'},
       
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
    dialogType:false,
    isCollapse:false,
    titleName:'标题',
   
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
const {form,isCollapse,tableData,options,dialogType,titleName,tableSet,gridData} = toRefs(data)
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

// 列表排序
const newList=(val:any)=>{
    tabType.value=false
    nextTick(()=>{
        tableColumns.value=val.list
        tabType.value=true

    })
    
    
}
// 新增
const clickNew=()=>{
    // 对象
    router.push({ name: 'newColourProcess' })
}
// 编辑
const clickEdit=()=>{
    console.log(111);
    
    router.push({ name: 'newColourProcess' })
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
                width: 180px;
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