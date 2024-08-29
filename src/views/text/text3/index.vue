<template>
    <div>
    <div class="text3">
        <!-- 操作行 -->
        <el-alert title="测试所用组件，并无实际功能" type="warning" />
        <el-card class="box-card" style="margin-bottom: 5px;">
            <div>
                <el-row :gutter="20" style="text-align: right;">
                    <el-col :span="6">
                        <el-input v-model="input2" placeholder="模糊搜索" :suffix-icon="Search" />
                    </el-col>
                    <el-col :span="18">
                        <el-button type="primary" :icon="Plus" @click="open">添加</el-button>
                        <el-button type="warning" disabled>编辑</el-button>
                        <el-button type="danger" disabled>删除</el-button>
                        <el-button type="success" @click="checkedAll">展开所有</el-button>
                    </el-col>

                   
                </el-row>
            </div>
        </el-card>
        <!-- 表格数据 -->
        <el-card class="box-card">
            <el-table @selection-change="handleSelectionChange" :data="tableData"
                style="width: 100%; margin-bottom: 20px" row-key="id" border :default-expand-all='isAll'>
                <el-table-column type="selection" width="60" />
                <el-table-column prop="date" label="日期" sortable  />
                <el-table-column label="图标" >
                    <el-icon>
                        <Star color="red" />
                    </el-icon>
                </el-table-column>
                <el-table-column prop="name" label="名称"  />
                <el-table-column label="类型" >
                    <el-tag type="success">Tag标签</el-tag>
                </el-table-column>
                <el-table-column prop="date" label="状态" >
                    <el-switch v-model="value" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                        active-value="100" inactive-value="0" />
                </el-table-column>
                <el-table-column prop="name" label="操作时间" sortable >
                    <el-date-picker v-model="value1" type="datetime" placeholder="Select date and time" />
                </el-table-column>
                <el-table-column prop="name" fixed="right" label="操作" >
                    <template #default="scope">
                        <el-button circle :icon="Edit" type="warning" @click="handleEdit(scope.$index, scope.row)">
                        </el-button>
                        <el-button circle :icon="Delete" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
    
    <!-- 弹出框 -->
    <el-dialog v-model="dialogVisible" title="添加" width="30%" :before-close="handleClose">
        <span>添加信息</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                    确认
                </el-button>
            </span>
        </template>
    </el-dialog>
</div>
</template>
  
<script lang="ts" setup>
import { Delete, Edit, Plus, Search, Star } from '@element-plus/icons-vue'
import { ElTable, ElDialog, ElMessageBox, ElMessage } from 'element-plus'
import { ref, nextTick } from 'vue';
const value = ref('100')
const value1 = ref('')
const input2 = ref('')
const isAll = ref(true)
const dialogVisible = ref(false)
const multipleSelection = ref<User[]>([])
interface User {
    id: number
    date: string
    name: string
    hasChildren?: boolean
    children?: User[]
}

const open = () => {
    dialogVisible.value = true
}
//关闭弹出框
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure to close this dialog?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
// 编辑
const handleEdit = (index: number, row: User) => {
    dialogVisible.value = true
}
// 删除
const handleDelete = (index: number, row: User) => {
    ElMessageBox.confirm(
        '确定删除该条信息?',
        '操作',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
//展开所有，遍历节点
const checkedAll = () => {   
    isAll.value = false
}

const load = (
    row: User,
    treeNode: unknown,
    resolve: (date: User[]) => void
) => {
    setTimeout(() => {
        resolve([
            {
                id: 31,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
        ])
    }, 1000)
}


const handleSelectionChange = (val: User[]) => {
    multipleSelection.value = val
}
const tableData: User[] = [
    {
        id: 1,
        date: '2016-05-02',
        name: 'wangxiaohu',
    },
    {
        id: 2,
        date: '2016-05-04',
        name: 'wangxiaohu',
    },
    {
        id: 3,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [
            {
                id: 31,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
        ],
    },
    {
        id: 4,
        date: '2016-05-03',
        name: 'wangxiaohu',
    },
    {
        id: 5,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [
            {
                id: 31,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
        ],
    },
    {
        id: 6,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [
            {
                id: 31,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
        ],
    },
    {
        id: 7,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [
            {
                id: 31,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
        ],
    },
    {
        id: 8,
        date: '2016-05-01',
        name: 'wangxiaohu',
        children: [
            {
                id: 31,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'wangxiaohu',
            },
        ],
    },
]
</script>

<style scoped lang="scss">
.text3 {
    padding: 24px;
    background-color: rgb(240, 242, 245);
    position: relative;
}
</style>
  