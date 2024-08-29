<template>
    <div class="xunjian_box" style="padding: 20px;">
        <el-card class="form_card1">

            <div class="btns">
                <el-button type="primary" @click="goback">返回</el-button>
                <el-button @click="save(ruleFormRef)" :disabled="changeForm ? true : false" type="primary">保存</el-button>
                <el-button @click="change(ruleFormRef)" type="primary">{{ btnName }}</el-button>
                <el-button @click="finish(ruleFormRef)" type="primary">完工</el-button>
                <el-button @click="apply(ruleFormRef)" type="primary">申报故障</el-button>
                <el-dropdown split-button style="margin-left: 10px;">
                    导出
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleExport">导出当前页</el-dropdown-item>
                            <el-dropdown-item @click="handleExportall">导出所有页</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>

            <div class="heade_form">
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm"
                    :inline="true">
                    <el-form-item label="巡检单号" prop="odd">
                        <el-input v-model="ruleForm.odd" class="inpt" :disabled="changeForm ? true : false" />
                    </el-form-item>
                    <el-form-item label="计划巡检日期" prop="time">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker v-model="ruleForm.time" type="date" placeholder="选择日期"
                                :disabled="changeForm ? true : false" />
                        </div>
                    </el-form-item>
                    <el-form-item label="是否完工" prop="complete">
                        <el-select v-model="ruleForm.complete" placeholder="" :disabled="changeForm ? true : false">
                            <el-option label="是" value="是" />
                            <el-option label="否" value="否" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设备编号" prop="code">
                        <el-input v-model="ruleForm.code" placeholder="请输入编号" class="input-with-select"
                            style="width: 251px;" :disabled="changeForm ? true : false">
                            <template #append>
                                <el-button :icon="MoreFilled" @click="clickModel" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="设备名称" prop="name">
                        <el-input v-model="ruleForm.name" class="inpt" style="width: 220px;"
                            :disabled="changeForm ? true : false" />
                    </el-form-item>
                    <el-form-item label="使用位置" prop="place">
                        <el-input v-model="ruleForm.place" placeholder="请输入编号" class="input-with-select"
                            :disabled="changeForm ? true : false">
                            <template #append>
                                <el-button :icon="MoreFilled" @click="clickModel" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="巡检负责人" prop="person">
                        <el-input v-model="ruleForm.person" placeholder="请输入编号" class="input-with-select"
                            :disabled="changeForm ? true : false">
                            <template #append>
                                <el-button :icon="MoreFilled" @click="clickModel" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="是否已申报" prop="declare">
                        <el-select v-model="ruleForm.declare" placeholder="" :disabled="changeForm ? true : false">
                            <el-option label="是" value="是" />
                            <el-option label="否" value="否" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="ruleForm.remark" class="inpt" :disabled="changeForm ? true : false" />
                    </el-form-item>
                </el-form>
            </div>
            <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" @ModelClose="ModelClose">
            </searchModel>
        </el-card>
        <el-card>
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
                                @click="handlefinish(scope.$index, scope.row)">{{finished}}</el-button>
                        </template>
                    </el-table-column>
                </template>
            </MyTable>
            <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize" />
        </el-card>
        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" align-center>
            <span>Open the dialog from the center from the screen</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="centerDialogVisible = false">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, toRefs,nextTick} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Edit, Delete, CircleCheck, MoreFilled } from '@element-plus/icons-vue';
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import searchModel from "@/components/MultiSelect/searchModel.vue"
import myPopup from '@/components/Popup/index.vue'
const router = useRouter()
// 弹出层开关
const centerDialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const changeForm = ref(true)
const finished=ref('完工')
const btnName = ref('修改')
const list = [
    { id: 1, label: '姓名' },
    { id: 2, label: '身份' },
    { id: 3, label: '情况' },
]
// 弹出框数据
const dialogdata = reactive({
    dialogType: false,
    titleName: '标题',
    queryParams: {
        pageNum: 1,
        pageSize: 10
    },
    total: 1,
    form: {
        name: '',
        date: null,
        optVal: '',
        project: ''
    },
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
})
const { dialogType, titleName, queryParams, tableSet, total } = toRefs(dialogdata)
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
    {checkType:true, label: '上次巡检时间', prop: 'id', headerSlot: true,slot:0, minwidth: '170' },
    {checkType:true, label: '项目编码', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '项目名称', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '优先级', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '实际巡检人', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '开始时间', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '结束时间', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '是否巡检完成', prop: 'name', headerSlot: true,slot:0, minwidth: '170' },
    {checkType:true, label: '巡检结果', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '原因名称', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '避免方案', prop: 'name', headerSlot: true,slot:0, minwidth: '160' },
    {checkType:true, label: '操作', prop: 'name4', width: '245', fixed: 'right', slotName: 'handler' }
]
const tableColumns=ref(dataVal)
const tabType=ref(true)
// form数据
const ruleForm = reactive({
    // 巡检单号
    odd: '',
    // 巡检单计划日期
    time: '',
    // 是否完工
    complete: '',
    // 设备编号
    code: '',
    // 设备名称
    name: '',
    // 使用位置
    place: '',
    // 巡检负责人
    person: '',
    // 申报
    declare: '',
    // 备注
    remark: ''
})
// 必选提示规则
const rules = reactive<FormRules>({
    xjodd: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    region: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],
    polldata: [
        {
            required: true,
            message: 'Please select Activity zone',
            trigger: 'change',
        },
    ],
    desc: [
        { required: true, message: '请输入编号', trigger: 'blur' },
    ],
})
// 返回
const goback = () => {
    router.push('polldoc')
}
// 保存
const save = (val: any) => {

}


// 编辑事件
const handleEdit = (index: any, row: any) => {
    console.log(index, row)
    // EditFormVisible.value = true
}
// 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}
// 完工
const handlefinish = (index: any, row: any) => {
    if(finished.value=='完工'){
        finished.value='撤销'
    }else{
        finished.value='完工'
        centerDialogVisible.value = true
    }
    // console.log(index,row);
    
}
//双击事件，弹窗弹出
const doubleThing = () => {
    // EditFormVisible.value = true
}
// 导出当前页
const handleExport = () => {

}
// 导出所有页
const handleExportall = () => {

}
//  弹出函数
const clickModel = () => {
    dialogType.value = true
}
const ModelClose = (val: any) => {

    dialogType.value = val.type
}
const change = (val: any) => {
    changeForm.value = !changeForm.value
    if (btnName.value == '修改') {
        btnName.value = '取消'
    } else {
        btnName.value = '修改'
    }

}
const finish = (val: any) => {

}
const apply = (val: any) => {

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
.inpt {
    width: 251px;
}

.input-with-select {
    width: 251px;
}

.form_card1 {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .heade_form {
        width: 100%;
        height: 100%;
        display: inline-block;
    }

    .btns {
        width: 100%;
        height: 100%;
        display: inline-block;
        margin-bottom: 20px;
        text-align: right;
    }
}
</style>