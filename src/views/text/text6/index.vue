<template>
    <div class="text6Mian">
        <MyTable :tableData="tableData" :tableLoading="loading" :tableColumns="tableColumns" :selection="true">
            <!-- 表头 -->
            <template #headerid="scope">
                {{ scope.column.label }}
                <!-- 动态图标插槽 -->
                <popup :list1="list2"></popup>
            </template>

            <template #status="scope">
                <el-button>{{ scope.row.status === 0 ? '禁用' : '启用' }}</el-button>
            </template>
            <template #handler="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
            </template>
        </MyTable>
    </div>
</template>

<script lang="ts" setup>
import {ref,reactive} from 'vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import popup from '@/components/Popup/index.vue'
interface dataType  {
    id?: string
    date?: string
    name?: string
    name3?: string
    address?: string
}

interface columnType {
    label:string,
    prop:string,
    width?:string,
    headerSlot?:boolean
    slotName?:string
}
const loading= ref(false) 
const tableData:dataType[] = [
    {
        id: '1',
        date: '2016-05-02',
        name: '王小虎',
        name3: '车床完毕',
        address: '上海市普陀区金沙江路 1518 弄'
    },
    {
        id: '2',
        date: '2016-05-04',
        name: '王小虎',
        name3: '车床完毕',
        address: '上海市普陀区金沙江路 1517 弄'
    },
    {
        id: '3',
        date: '2016-05-04',
        name: '王小虎',
        name3: '车床完毕',
        address: '上海市普陀区金沙江路 1517 弄'
    }
]

const list2 = reactive(
      [
        {id: 1, name: '标签1'}, 
        {id: 2, name: '标签2'}, 
        {id: 3, name: '标签3'}, 
        {id: 4, name: '标签4'}, 
        {id: 5, name: '标签5'}, 
      ]
    )

const tableColumns:columnType[] = [
    // 表格配置数据
    { label: '用户', prop: 'id', width: '120', headerSlot: true },
    { label: '日期', prop: 'date', width: '120' },
    { label: '姓名', prop: 'address', width: '120' },
    { label: '角色', prop: 'name' },
    { label: '信息', prop: 'name3' },
    { label: '状态', prop: 'name4', slotName: 'status' },
    { label: '操作', prop: 'name4', slotName: 'handler' }
]

const handleEdit = (index: any, row: any) => {
    console.log(index, row)
}
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}

</script>

<style lang="scss" scoped>
.text6Mian {
    width: 100%;
    box-sizing: border-box;
    padding: 24px;
    height: 100%;
    min-height: 900px;
}
</style>