<template>
    <!-- 巡保项目页面 -->
    <div class="classify">
        <div class="classify-header">
            <el-card>
                <el-form :inline="true" :model="formInline" ref="formRef" class="demo-form-inline">
                    <el-form-item label="编码：">
                        <el-input v-model="formInline.user" placeholder="请输入设备分类编码" />
                    </el-form-item>
                    <el-form-item label="名称：">
                        <el-input v-model="formInline.user" placeholder="请输入设备分类名称" />
                    </el-form-item>
                    <el-form-item style="float: right;">
                        <el-button type="primary" @click="submitForm(formRef)" :icon="Search">搜索</el-button>
                        <el-button type="primary" @click="resetForm(formRef)" :icon="Refresh">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-card>  
            <template #header>
                <div class="classify-middle">
                    <el-button  :icon="Plus" @click="dialogFormVisible = true">新增</el-button>
                    <el-button  :icon="DeleteFilled">删除</el-button>
                    <el-button  :icon="RefreshRight"  @click="RefreshThing">刷新</el-button>
                    <el-dropdown>
                        <el-button >
                            导出<el-icon class="el-icon--right"><arrow-down /></el-icon>
                        </el-button>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleExport">导出当前页</el-dropdown-item>
                                <el-dropdown-item @click="handleExportAll">导出所有</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </template>
            <!-- 表格 -->
            <div class="classify-bottom">
                <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true" :selection="true"
                    @dblclick="doubleThing()">
                    <template #handler>
                        <el-table-column label="操作" fixed="right" width="200px" align="center">
                            <template #header>
                                <span>操作</span>
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
                <!-- <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                    :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background"
                    layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" /> -->
                    <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" />
            </div>
        </el-card>
        <!-- 弹出层 -->
        <div class="classify-dialog">
            <el-dialog v-model="dialogFormVisible" :title="`${changeTitle}`" width="70%">
                <el-form :model="form" :rules="rules">
                    <el-row :gutter="20" justify="space-around">
                        <el-col :span="6">
                            <el-form-item label="编码项目"  prop="id">
                                <el-input v-model="form.id" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="项目名称"   prop="name">
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="巡保项目类型"  prop="name">
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" justify="space-around">
                        <el-col :span="6">
                            <el-form-item label="周期" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="周期单位" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="优先级"  prop="name">
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" justify="space-around">
                        <el-col :span="6">
                            <el-form-item label="提醒提前期" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="提醒提前期单位" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="设备部位类型" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" justify="space-around">
                        <el-col :span="6">
                            <el-form-item label="要求" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="备注" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="部位名称" >
                                <el-input v-model="form.name" autocomplete="off" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true" :selection="true">
                    <template #handler>
                        <el-table-column label="操作" fixed="right" width="200px" align="center">
                            <template #header>
                                <span>操作</span>
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
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="dialogFormVisible = false">
                            保存
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref,nextTick } from 'vue'
import { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, ArrowDown, Refresh, DeleteFilled, RefreshRight, Edit, Delete } from '@element-plus/icons-vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import myPopup from '@/components/Popup/index.vue'
import { computed } from '@vue/reactivity';

//分页器
const formRef = ref<FormInstance>()
const currentPage4 = ref(4)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const total=ref(10)
const queryParams=ref({
    pageNum:1,
    pageSize:2
})

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
//弹出框
const dialogFormVisible = ref(false)
const form = reactive({
    id:'',
    name: '',
})
//表单绑定数据
const formInline = reactive({
    user: '',
    region: '',
})
const rules = reactive<FormRules>({
    id:[
        {
            required: true, message: '请输入编码', trigger: 'blur'
        }
    ],
    name: [
        { required: true, message: '请输入，不能为空', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
})

const list = [
    { id: 1, name: '姓名' },
    { id: 2, name: '身份' },
    { id: 3, name: '情况' },

]
//表格数据
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
    {checkType:true, label: '巡保项目类型', prop: 'id', headerSlot:true,slot:0,minwidth:'180px'},
    {checkType:true, label: '项目编码', prop: 'name', headerSlot:true,slot:0,minwidth:'140px' },
    {checkType:true, label: '项目名称', prop: 'name',headerSlot:true,slot:0,minwidth:'140px' },
    {checkType:true, label: '周期', prop: 'name',headerSlot:true,slot:0,minwidth:'140px' },
    {checkType:true, label: '周期单位', prop: 'name',headerSlot:true,slot:0,minwidth:'140px' },
    {checkType:true, label: '提醒提前期', prop: 'name',headerSlot:true,slot:0,minwidth:'160px' },
    {checkType:true, label: '提醒提前期单位', prop: 'name',headerSlot:true,slot:0,minwidth:'180px' },
    {checkType:true, label: '优先级', prop: 'name',headerSlot:true,slot:0,minwidth:'140px' },
    {checkType:true, label: '部位名称', prop: 'name',headerSlot:true,slot:0,minwidth:'140px' },
    {checkType:true, label: '设备部位类别', prop: 'name',headerSlot:true,slot:0,minwidth:'180px' },
    {checkType:true, label: '操作', prop: 'name4', width: '180', fixed: 'right', slotName: 'handler',headerSlot:true,sortable:true,minwidth:'140px' }
]
const tableColumns=ref(dataVal)
const tabType=ref(true)
// 编辑事件
const handleEdit = (index: any, row: any) => {
    console.log( index,row)
    dialogFormVisible.value = true
}
// 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}
//弹框新增
const handleAdd = (index:any,row:any)=>{
    console.log( index,row)
}
//双击事件，弹窗弹出
const doubleThing = () => {
    dialogFormVisible.value = true
}

//搜索
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    console.log('submit!')
}
//重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
//刷新
const RefreshThing =()=>{
    console.log('刷新');
}
//导出当前页
const handleExport=()=>{
    console.log('导出当前页')   
}
//导出所有页
const handleExportAll=()=>{
    console.log('导出所有页');   
}
//弹框标题
const changeTitle = computed(()=>{
    return  form.id ? '编辑' :'新增'

})
// 排列表头
const newList=(val:any)=>{
    tabType.value=false
    nextTick(()=>{
        tableColumns.value=val.list
        tabType.value=true

    })
}
</script>

<style lang="scss" scoped>
.classify {
    padding: 20px;

    .classify-header {
        margin: 10px 0;
    }

    .classify-middle {
        float: right;
        margin: 10px 0;
        margin: 0 auto;

        .el-dropdown {
            margin-left: 10px;
        }
    }

    .pagin-card {
        margin-top: 10px;
    }
}
</style>