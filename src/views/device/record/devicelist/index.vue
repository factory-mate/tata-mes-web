<template>
    <!-- 设备列表页面 -->
    <div class="devlist">
        <!-- 头部搜索区域 -->
        <div class="devlist-header">
            <el-card>
                <div>
                    <el-form :inline="true" label-width="120px" :model="formInline">
                        <el-form-item label="设备编号：" style="width: 360px;">
                            <el-input v-model="formInline.user" placeholder="请输入设备编号" />
                        </el-form-item>
                        <el-form-item label="设备名称：" style="width: 360px;">
                            <el-input v-model="formInline.user" placeholder="请输入设备名称" />
                        </el-form-item>
                        <el-form-item label="部门名称：" style="width: 360px;">
                            <el-input v-model="formInline.user" placeholder="请输入部门名称">
                                <template #append>
                                    <el-icon @click="clickModel">
                                        <MoreFilled />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="是否维保：" style="width: 345px;">
                            <el-select v-model="formInline.region" placeholder="请选择">
                                <el-option label="Zone one" value="shanghai" />
                                <el-option label="Zone two" value="beijing" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="安装地点：" style="width: 360px;">
                            <el-input v-model="formInline.user" placeholder="请输入安装地点">
                                <template #append>
                                    <el-icon @click="clickModel">
                                        <MoreFilled />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="float:right;margin-top: -100px;">
                    <el-button type="primary" @click="onSubmit" :icon="Search">查询</el-button>
                    <el-button type="primary" @click="onResect" :icon="Refresh">重置</el-button>
                </div>
            </el-card>
        </div>
        <el-card>
            <template #header>
                <div class="devlist-button">
                    <router-link to="add">
                        <el-button  :icon="Plus">新增</el-button>
                    </router-link>
                    <router-link to="add">
                        <el-button class="add-link" :icon="DocumentCopy" >复制新增</el-button>
                    </router-link>
                    <el-button :icon="DeleteFilled">删除</el-button>
                    <el-button :icon="RefreshRight">刷新</el-button>
                    <el-button  @click="centerDialogVisible = true" :icon="Open">维保开启</el-button>
                    <el-button  @click="closebox" :icon="TurnOff">维保关闭</el-button>
                    <el-button  @click="dialogVisible = true">维保顺延</el-button>
                    <el-dropdown>
                        <el-button>
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
            <div class="devlist-table">
                <MyTable v-if="tabType" :tableData="tableData" :tableBorder="true" :tableColumns="tableColumns"
                    :selection="true" @handledbClick="dbThing">
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
                <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize" />
            </div>
        </el-card>
        <!-- 弹出框 -->
        <div class="devicetype-dialog">
            <!-- 维保弹出框 -->
            <el-dialog v-model="centerDialogVisible" title="维保开启" width="30%" center>
                <div>
                    <el-date-picker v-model="value1" type="date" placeholder="Pick a Date" format="YYYY/MM/DD" />
                </div>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="centerDialogVisible = false">
                            确定
                        </el-button>
                    </span>
                </template>
            </el-dialog>
            <!-- 维保顺延 -->
            <el-dialog v-model="dialogVisible" title="维保顺延" width="30%" :before-close="handleClose">
                <el-form :model="form">
                    <el-form-item label="顺延天数：">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
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
import { reactive, ref, toRefs, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus, Refresh, Search, Edit, Delete, MoreFilled,DeleteFilled ,RefreshRight,DocumentCopy,Open,TurnOff} from '@element-plus/icons-vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import myPopup from '@/components/Popup/index.vue'
import searchModel from "@/components/MultiSelect/searchModel.vue"
import router from '@/router'
//分页器
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
// const handleChange = (val: any) => {
//     console.log(val)
// }

//查询事件
const onSubmit = () => {
    console.log('submit!')
}
//重置事件
const onResect = () => {
    console.log('重置')
}

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
    sortable?: boolean
    minwidth?: string
    checkType?: boolean
    slot?: number
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
    { checkType: true, label: '设备分类名称', prop: 'id', headerSlot: true, slot: 0, minwidth: '180px' },
    { checkType: true, label: '设备编码', prop: 'name', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '设备名称', prop: 'date', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '规格型号', prop: 'date', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '生产厂商', prop: 'date', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '所在部门', prop: 'date', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '安装试点', prop: 'date', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '操作人员', prop: 'date', headerSlot: true, slot: 0, minwidth: '140px' },
    { checkType: true, label: '操作', prop: 'name4', width: '180', slotName: 'handler', headerSlot: true, sortable: true, minwidth: '180px' }
]
const tableColumns = ref(dataVal)
const tabType = ref(true)

//弹出框
//维保顺延
const dialogVisible = ref(false)
const form = reactive({
    name: '',
})
//维保开启
const value1 = ref('')
const centerDialogVisible = ref(false)
//表单绑定数据
const formInline = reactive({
    user: '',
    region: '',
})

// 编辑事件
const handleEdit = (index: any, row: any) => {
    // console.log(index, row)
    router.push('add')
}
// 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}
//导出当前页
const handleExport = () => {
    console.log('导出当前页')
}
//导出所有页
const handleExportAll = () => {
    console.log('导出所有页');
}

//双击事件，跳转详情页
const dbThing = () => {
    router.push('add')
}
//关闭维保
const closebox = () => {
    ElMessageBox.confirm(
        '关闭维保将自动完工所有维保计划，是否继续?',
        '维保关闭',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            ElMessage({
                type: 'success',
                message: '维保关闭成功',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '维保取消',
            })
        })
}

//维保顺延
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('确认关闭?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
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
// 排列表头
const newList = (val: any) => {
    tabType.value = false
    nextTick(() => {
        tableColumns.value = val.list
        tabType.value = true

    })
}
</script>

<style lang="scss" scoped>
.devlist {
    padding: 20px;

    .devlist-header {
        .el-card {
            margin: 10px 0;
        }
    }

    .devlist-button {
        float: right;

        .el-dropdown {
            margin-left: 20px;
        }

        .add-link {
            margin: 0 15px;
        }
    }

    .pagin-card {
        margin-top: 10px;
    }
}
</style>