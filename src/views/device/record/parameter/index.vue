<template>
    <!-- 设备参数页面 -->
    <div class="classify">
        <el-card>
            <template #header>
                <div class="classify-middle">
                    <el-button  :icon="Plus" @click="handleAdd">新增</el-button>
                    <el-button  :icon="DeleteFilled">删除</el-button>
                    <el-button  :icon="RefreshRight" @click="RefreshThing">刷新</el-button>
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
                <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true" :selection="true" @handledbClick="dbThing">
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
            <el-dialog v-model="dialogFormVisible" title="新增">
                <el-form :model="form" :rules="rules">
                    <el-form-item label="设备参数编码：" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="设备参数名称：" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="主计量单位名称：" :label-width="formLabelWidth">
                        <el-input v-model="form.name" placeholder="请输入名称">
                                <template #append>
                                    <el-icon @click="clickModel">
                                        <MoreFilled />
                                    </el-icon>
                                </template>
                            </el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                </el-form>
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

        <div class="classify-dialog">
            <el-dialog v-model="EditFormVisible" title="编辑">
                <el-form :model="form" :rules="rules">
                    <el-form-item label="设备参数编码" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="设备参数名称" :label-width="formLabelWidth" prop="name">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="主计量单位名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" placeholder="请输入名称">
                                <template #append>
                                    <el-icon @click="clickModel">
                                        <MoreFilled />
                                    </el-icon>
                                </template>
                            </el-input>
                    </el-form-item>
                    <el-form-item label="备注" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                </el-form> 
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="EditFormVisible = false">取消</el-button>
                        <el-button type="primary" @click="EditFormVisible = false">
                            保存
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
         <!-- 搜索弹框 -->
         <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData"
            @ModelClose="ModelClose"></searchModel>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref,nextTick ,toRefs} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, ArrowDown, DeleteFilled, RefreshRight, Edit, Delete ,MoreFilled} from '@element-plus/icons-vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import myPopup from '@/components/Popup/index.vue'
import searchModel from "@/components/MultiSelect/searchModel.vue"
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


const list = [
    { id: 1, name: '姓名' },
    { id: 2, name: '身份' },
    { id: 3, name: '情况' },

]
const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
//弹出框
const dialogFormVisible = ref(false)
const EditFormVisible = ref(false)
const formLabelWidth = '140px'
//弹出框数据
const form = reactive({
    name: '',
})
//验证规则
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
})
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
    {checkType:true, label: '设备参数编码', prop: 'id',slot:0, headerSlot:true,},
    {checkType:true, label: '设备参数名称',slot:0, prop: 'name',  },
    {checkType:true, label: '描述',slot:0, prop: 'date',  },
    {checkType:true, label: '操作',slot:0, prop: 'name4', slotName: 'handler' }
]
const tableColumns=ref(dataVal)
const tabType=ref(true)
// 编辑事件
const handleEdit = (index: any, row: any) => {
    console.log(index, row)
    EditFormVisible.value = true
}
// 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}

//刷新事件
const RefreshThing =()=>{
    console.log('刷新')
}
//新增事件
const handleAdd =()=>{
    dialogFormVisible.value = true  
}

//双击事件，弹窗弹出
const dbThing = () => {
    EditFormVisible.value = true
}
//导出当前页
const handleExport=()=>{
    console.log('导出当前页')   
}
//导出所有页
const handleExportAll=()=>{
    console.log('导出所有页');   
}
// 排列表头
const newList=(val:any)=>{
    tabType.value=false
    nextTick(()=>{
        tableColumns.value=val.list
        tabType.value=true

    })
}

//弹窗组件事件
const data = reactive({
    dialogType: false,
    titleName: '标题',
    form: {
        name: '',
        date: null,
        optVal: '',
        project: ''
    },
    //弹窗数据
    tableSet: [
        {
            name: '名称一',
            key: 'name'
        },
        {
            name: '名称二',
            key: 'value'
        },
    ],
    options: [
        {
            value: '1',
            label: '是',
        },
        {
            value: '2',
            label: '否',
        }
    ],
    gridData: [
        {
            name: '111',
            value: '数据',
        },
        {
            name: '111',
            value: '数据',
        }
    ]
})
const { dialogType, titleName, tableSet, gridData } = toRefs(data)
const clickModel = () => {
    dialogType.value = true
}
const ModelClose = (val: any) => {

dialogType.value = val.type
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