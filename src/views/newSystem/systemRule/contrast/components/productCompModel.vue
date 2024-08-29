<template>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        center
        width="50%"
    >
        <el-form :model="form" :rules="rules"  ref="ruleFormRef">
          
            <el-form-item label="成品编码：" prop="name1" :label-width="formLabelWidth">
                <el-input
                    v-model="form.name1"
                    placeholder="请输入"
                >
                    <template #append>
                        <el-icon @click="clickModel"><MoreFilled /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="成品名称：" :label-width="formLabelWidth">
                <el-input
                    v-model="form.name2"
                    placeholder="请输入"
                >
                    <template #append>
                        <el-icon @click="clickModel"><MoreFilled /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
        </el-form>
        <i>需求不定</i>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="date" label="结构编码"  />
            <el-table-column prop="name" label="结构名称"  />
            <el-table-column prop="name" label="存货编码" />
            <el-table-column prop="name" label="存货名称" />
        </el-table>

        <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary"  @click="submitForm(ruleFormRef)">
                保存
            </el-button>
        </span>
        </template>
         <!-- 搜索弹框 -->
         <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData" @ModelClose="ModelClose"></searchModel>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref ,reactive,toRefs,watch} from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import searchModel from "@/components/MultiSelect/searchModel.vue"
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules>({
    name1: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
   
})

const props = defineProps({
    dialogV: {
        // 表头数据
        type: Boolean,
        default: () => {
            return false
        }
    },
    dialogTitle: {
        // 表头数据
        type: String,
        default: () => {
            return ''
        }
    },
})
const formLabelWidth = '140px'
const data = reactive({
    titleName:'标题1',
    dialogType:false,
    form:{
        name:'',
        name1:'',
        name2:'',
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
    tableData:[

    ]
 
})
const {form,dialogType,titleName,tableSet,gridData,tableData} =toRefs(data)

const dialogVisible = ref(props.dialogV)
watch(props, (newValue, oldValue) => {
    dialogVisible.value =newValue.dialogV
})
const clickModel=()=>{
    dialogType.value= true
}
const ModelClose=(val:any)=>{
    
    dialogType.value=val.type
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}


</script>

<style scoped lang="scss">

</style>