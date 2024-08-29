<template>
    <div class="part_box" style="padding: 20px;">
        <!-- 顶部伸缩框 -->
        <!-- <div :class="[showSearch ? 'header' : 'header top']"> -->
            <!-- 搜索框内容 -->
            <div class="search" >
                <el-form ref="queryFormRef" :model="queryParams" :inline="true" label-width="110px">
                    <el-form-item prop="name" label="设备名称：" class="elitem">
                        <div class="mt-4">
                            <el-input v-model="topForm.name" placeholder="设备名称" class="input-with-select">
                                <template #append>
                                    <el-button :icon="MoreFilled" @click="clickModel" />
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="time" label="申报时间：" class="elitem" style="font-weight: 600;">
                        <div>
                        <el-time-picker v-model="topForm.time" is-range range-separator="至" start-placeholder="开始时间"
                            end-placeholder="结束时间" />
                        </div>
                    </el-form-item>
                    <el-form-item prop="type" label="申报类型：" class="elitem" >
                        <el-select v-model="topForm.type" class="m-2" placeholder="">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item style="float: right; ">
                        <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button :icon="Refresh" @click="resetQuery" type="primary">重置</el-button>
                    </el-form-item><br>
                    <el-form-item prop="odd" label="单号：" class="elitem">
                        <el-input v-model="topForm.odd" placeholder="请输入" style="width: 220px;">   
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="person" label="申报人：" class="elitem">
                        <div class="mt-4">
                            <el-input v-model="topForm.person" placeholder="设备名称" class="input-with-select" style="width: 350px;">
                                <template #append>
                                    <el-button :icon="MoreFilled" @click="clickModel" />
                                </template>
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item prop="repair" label="是否转维修单：" class="elitem" >
                        <el-select v-model="topForm.repair" class="m-2" placeholder="">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value"/>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 控制伸缩按钮 -->
            <!-- <div class="tabbar" @click="() => { showSearch = !showSearch }">
                <el-icon v-show="showSearch" style="color: #909399;">
                    <ArrowDown />
                </el-icon>
                <el-icon v-show="!showSearch" style="color: #909399;">
                    <ArrowUp />
                </el-icon>
            </div> -->
        <!-- </div> -->
        <!-- <div :class="[showSearch ? 'showSearch top' : 'top']"></div> -->
        <!-- 弹出层 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet"  @ModelClose="ModelClose"></searchModel>
        <!-- table表格 -->
        <el-card>
            <template #header>
                <el-form-item class="form_btn" >
                    <el-dropdown split-button>
                        导出
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleExport">导出当前页</el-dropdown-item>
                                <el-dropdown-item @click="handleExportall">导出所有页</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>
                <el-form-item class="form_btn" >
                    <el-button type="default" :icon="Refresh" @click="updata">刷新</el-button>
                </el-form-item>
                <el-form-item class="form_btn" >
                    <el-button type="default" :icon="Delete" @click="del">删除</el-button>
                </el-form-item>
                <el-form-item class="form_btn" >
                    <el-button type="default" :icon="Plus" @click="add">新增</el-button>
                </el-form-item>
            </template>
            <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true" @dblclick="doubleThing()">

                <template #handler>
                    <el-table-column label="操作" fixed="right" width="260px" align="center">
                        <template #header><span>操作</span>
                            <myPopup :list="tableColumns" @newList="newList"></myPopup>
                        </template>
                        <template #default="scope">
                            <el-button size="small" type="primary" :icon="Edit"
                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" :icon="Delete"
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <el-button size="small" type="danger" :icon="CircleCheck"
                        @click="handlefinish(scope.$index, scope.row)">完工</el-button>
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
import { ref, reactive, toRefs,nextTick } from 'vue'
import {  Search, Refresh, Edit, Delete, CircleCheck, Plus,MoreFilled } from '@element-plus/icons-vue';
// import popup from '/src/components/Popup/index.vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import searchModel from "@/components/MultiSelect/searchModel.vue"
import { useRouter } from 'vue-router'
import myPopup from '@/components/Popup/index.vue'
const router = useRouter()


// 表单数据
const topForm = reactive({
//   设备名称 
  name: '',
//   申报时间
  time:'',
//   申报类型
  type:'',
//   单号
  odd:'',
//   申报人
  person:'',
//   是否转维修单
  repair:''
})
const dialogdata =reactive({
  dialogType:false,
    titleName:'标题',
    queryParams: {
    pageNum: 1,
    pageSize: 10
    },
     total:10,
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
    minwidth?: string
    sortable?: boolean
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
    {checkType:true, label: '上次巡检时间', prop: 'id', headerSlot: true, slot:0, minwidth: '170' },
    {checkType:true, label: '项目编码', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '项目名称', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '优先级', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '实际巡检人', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '开始时间', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '结束时间', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '是否巡检完成', prop: 'name', headerSlot: true, slot:0, minwidth: '170' },
    {checkType:true, label: '巡检结果', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '原因名称', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '避免方案', prop: 'name', headerSlot: true, slot:0, minwidth: '160' },
    {checkType:true, label: '操作', prop: 'name4', width: '245', fixed: 'right', slotName: 'handler' }
]
const tableColumns=ref(dataVal)
const tabType=ref(true)

// 搜索
const handleQuery = () => {
// 重置
}
const resetQuery = () => {

}
// 导出当前页
const handleExport = () => {
    console.log('导出当前页');
}
// 导出所有页
const handleExportall = () => {
    console.log('导出所有页');
}
// table全选按钮

// 删除
const handleDelete = (index: any, row: any) => {
    console.log(row);
}
// 编辑
const handleUpdate = (val: any) => {
    console.log(val);
}
// 刷新
const updata = () => {

}
// 完工
const handlefinish = (index: any, row: any) => {

}
// 编辑事件
const handleEdit = (index: any, row: any) => {
    console.log(index, row)
    // EditFormVisible.value = true
}
// 双击
const doubleThing = () => {
    router.push({ path: 'detailfail' })
    console.log(111);

}
// 新增
const add = () => {
    router.push('addfail')
}
// 删除
const del = () => {

}
//  弹出函数
const clickModel=()=>{
    dialogType.value= true
}
const ModelClose=(val:any)=>{
    
    dialogType.value=val.type
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
html {
    overflow-x:hidden; //隐藏水平滚动条
    overflow-y:hidden;//隐藏垂直滚动条
}
.search{
    height: 100%;
    overflow: hidden;  
    padding-right: 20px;
}
// .header {
//     width: 100%;
//     height: 100px;
//     border-bottom: 1px solid #e4e7ed;
//     position: relative;
//     transition: all .5s;

//     .elitem {
//         margin: 20px 20px;
//     }
// }

// .tabbar {
//     width: 20px;
//     height: 20px;
//     border: 1px solid #e4e7ed;
//     text-align: center;
//     border-radius: 5px;
//     position: absolute;
//     left: 50%;
//     bottom: -10px;
//     z-index: 1;
//     background-color: white;
// }

// .top {
//     height: auto;
// }
.form_btn{
    float: right;
    margin-left: 10px;
}
</style>