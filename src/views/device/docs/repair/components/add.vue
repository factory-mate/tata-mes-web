<template>
    <div class="xunjian_box" style="padding: 20px;">
        <el-card class="form_card1" style="padding-top: 50px;">
            <div class="btns">
                <el-button @click="abondon(ruleFormRef)" type="primary">返回</el-button>
                <el-button @click="save(ruleFormRef)" type="primary">保存</el-button>
                <el-dropdown split-button style="margin-right: 20px;">
                    导出
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="handleExport">导出当前页</el-dropdown-item>
                            <el-dropdown-item @click="handleExportall">导出所有页</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="heade_form" v-show="showForm">
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="110px" class="demo-ruleForm"
                    :inline="true">
                    <el-form-item label="设备名称" prop="name">
                        <el-input v-model="ruleForm.name" class="inpt" style="width: 250px;" />
                    </el-form-item>
                    <el-form-item label="设备编号" prop="code">
                        <el-input v-model="ruleForm.code" placeholder="请输入编号" class="input-with-select">
                            <template #append>
                                <el-button :icon="MoreFilled" @click="clickModel" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="故障类别" prop="type">
                        <el-select v-model="ruleForm.type" placeholder="" class="inpt">
                            <el-option label="是" value="是" />
                            <el-option label="否" value="否" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="维修单号" prop="odd">
                        <el-input v-model="ruleForm.odd" class="inpt" style="width: 250px;" />
                    </el-form-item>
                    <el-form-item label="制单日期" prop="time">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker v-model="ruleForm.time" type="date" placeholder="选择日期"
                                style="width:250px ;" />
                        </div>
                    </el-form-item>
                    <el-form-item label="设备位置" prop="place">
                        <el-input v-model="ruleForm.place" placeholder="请输入编号" class="input-with-select">
                            <template #append>
                                <el-button :icon="MoreFilled" @click="clickModel" />
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="维修操作类型" prop="service">
                        <el-select v-model="ruleForm.service" placeholder="" style="width: 250px;">
                            <el-option label="是" value="是" />
                            <el-option label="否" value="否" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始维修时间" prop="startime">
                        <el-time-select v-model="ruleForm.startime" start="00:00" step="00:30" end="23:59" placeholder="Select time"
                            format="hh:mm A" class="inpt" />
                    </el-form-item>
                    <el-form-item label="停机结束时间" prop="stoptime">
                        <el-time-select v-model="ruleForm.stoptime" start="00:00" step="00:30" end="23:59" placeholder="Select time"
                            format="hh:mm A" class="inpt" />
                    </el-form-item>
                    <el-form-item label="维修完工时间" prop="endtime">
                        <el-time-select v-model="ruleForm.endtime" start="00:00" step="00:30" end="23:59" placeholder="Select time"
                            format="hh:mm A" style="width: 250px;" />
                    </el-form-item>
                    <el-form-item label="实际工时" prop="reality">
                        <el-input v-model="ruleForm.reality" class="inpt" />
                    </el-form-item>
                    <el-form-item label="来源类型" prop="sourcetype">
                        <el-select v-model="ruleForm.sourcetype" placeholder="" class="inpt">
                            <el-option label="是" value="是" />
                            <el-option label="否" value="否" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="来源单号" prop="sourceodd">
                        <el-input v-model="ruleForm.name" class="inpt" />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="ruleForm.name" class="inpt" />
                    </el-form-item>
                </el-form>
            </div>
            <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" @ModelClose="ModelClose">
            </searchModel>
        </el-card>

        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick" style="padding: 20px;">
            <el-tab-pane label="维修明细" name="first">
                <el-card>
                    <template #header>
                        <el-form-item style="float: right;margin: 0 20px;" @click="showform">
                            <img src="/src/assets/展开.png" alt="">
                        </el-form-item>
                        <el-form-item style="float: right;">
                            <el-button  :icon="Delete" @click="updata">删除</el-button>
                        </el-form-item>
                    </template>
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true"
                        @dblclick="doubleThing()">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header><span>操作</span>
                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="primary" :icon="Edit" round
                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" round
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-card>
            </el-tab-pane>
            <el-tab-pane label="维修人员" name="second"> <el-card>
                    <template #header>
                        <el-form-item style="float: right;margin: 0 20px;" @click="showform">
                            <img src="/src/assets/展开.png" alt="">
                        </el-form-item>
                        <el-form-item style="float: right;">
                            <el-button :icon="Delete" @click="updata">删除</el-button>
                        </el-form-item>
                    </template>
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true"
                        @dblclick="doubleThing()">
                        <template #handler="scope">
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header><span>操作</span>
                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default>
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
                </el-card> </el-tab-pane>
        </el-tabs>

    </div>
</template>
<script lang="ts" setup>
import { reactive, ref, toRefs,nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Edit, Delete, MoreFilled } from '@element-plus/icons-vue';
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import searchModel from "@/components/MultiSelect/searchModel.vue"
import { useRouter } from 'vue-router'
import myPopup from '@/components/Popup/index.vue'
import type { TabsPaneContext } from 'element-plus'
const showForm = ref(true)
const router = useRouter()
const value = ref('')
const activeName = ref('first')

const ruleFormRef = ref<FormInstance>()

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
    {checkType:true, label: '项目编码', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '项目名称', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '优先级', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '实际巡检人', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '开始时间', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '结束时间', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '是否巡检完成', prop: 'name', headerSlot: true,slot:0, minwidth: '170' },
    {checkType:true, label: '巡检结果', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '原因名称', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '避免方案', prop: 'name', headerSlot: true,slot:0, minwidth: '150' },
    {checkType:true, label: '操作', prop: 'name4', width: '180', fixed: 'right', slotName: 'handler', headerSlot: true }
]
const tableColumns=ref(dataVal)
const tabType=ref(true)
const dialogdata = reactive({
    dialogType: false,
    titleName: '标题',
    queryParams: {
    pageNum: 1,
    pageSize: 10
  },
  total:1,
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
const { dialogType, titleName, form, tableSet, options,queryParams,total } = toRefs(dialogdata)
// form数据
const ruleForm = reactive({
    // 巡检单号
    odd: '',
    // 巡检单计划日期
    time: '',
    // 故障类别
    type:'',
    // 设备编号
    code: '',
    // 设备名称
    name: '',
    // 使用位置
    place: '',
    // 维修操作类型
    service:'',
    // 来源类型
    sourcetype:'',
    // 实际用时
    reality:'',
    // 备注
    remark: '',
    // 开始时间
    startime:'',
    // 停机时间
    stoptime:'',
    // 结束时间
    endtime:'',
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

// 保存
const save = (val: any) => {

}
// 编辑事件
const handleEdit = (index: any, row: any) => {
    console.log(index, row)
    // EditFormVisible.value = true
}
// table顶部删除
const updata = () => {

}
// table内部 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}

//双击事件，弹窗弹出
const doubleThing = () => {
    dialogType.value = true
}
const handleExport = () => {
    console.log('导出当前页');

}
const handleExportall = () => {
    console.log('导出所有页');
}
// 弹出框函数
const clickModel = () => {
    dialogType.value = true
}
const ModelClose = (val: any) => {
    dialogType.value = val.type
}
const showform = () => {
    showForm.value = !showForm.value
}
//  放弃
const abondon = (val: any) => {
    router.push('repair')
}
const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
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
    width: 250px;
}

:deep(.el-dropdown) {
    margin-left: 10px;
}

.form_card1 {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;

    .heade_form {
        width: 100%;
        height: 100%;
        display: inline-block;
    }

    .input-with-select {
        width: 251px;
    }

    .header_btn {
        float: right;
    }

    .btns {
        margin-top: 20px;
        position: absolute;
        top: 0px;
        right: 0px;
        width: 100%;
        height: 100%;
        margin-bottom: 20px;
        text-align: right;
    }

    .demo-tabs>.el-tabs__content {
        padding: 32px;
        color: #6b778c;
        font-size: 32px;
        font-weight: 600;
    }
}
</style>