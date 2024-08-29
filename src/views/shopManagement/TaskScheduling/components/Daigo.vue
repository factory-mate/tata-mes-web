<template>
    <!-- 新增弹窗  -->
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                status-icon>
                <template v-for="item in FormData" :key="item.UID">
                    <el-form-item  v-if="item.IsShow==true" :label="item.Resource.cAttributeName + '：'"
                        :prop="item.Resource.cAttributeCode">
                        <el-radio-group v-if="item.cControlTypeCode == 'CheckBox'"
                        v-model="ruleForm[item.cAttributeCode]" style="width: 220px;" >
                            <el-radio :label='true'>是</el-radio>
                            <el-radio :label='false'>否</el-radio>
                        </el-radio-group>
                         <!-- 树形结构 -->
                         <el-cascader ref='cascadedPanelRef' v-if="item.cControlTypeCode == 'Tree'"  v-model="ruleForm[item.cAttributeCode]"
                            :options="options" :props="prop" @change="handleChangess"/>
                    </el-form-item>
                </template>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef, item)" v-for="item in Btn"
                        :key="item.UID">
                        {{ item.Resource.cAttributeName }}
                    </el-button>
                    <el-button @click="resetForm(ruleFormRef)">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref,  defineProps, computed, watch, inject } from "vue";
import { ElForm, ElFormItem, ElMessage, ElInput,FormInstance } from 'element-plus'
import {  ParamsApi, DataApi } from '@/api/configApi/index'
import { sessionStorage } from '@/utils/storage';
import { ElTree } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const ruleForm: any = ref({})
const dialogFormVisible = ref()
const FormData = ref([]) as any
const title = ref()
const disabled = ref()
const RowId = ref()
const bindData = ref()
const Btn = ref()
const cascadedPanelRef=ref(null)
const cFactoryUnitCode=ref('')
const { tableAxios } = inject('tableAxios') as {
    tableAxios: () => void
}
const props = defineProps({
    FormData: {
        required: true,
        type: Array as any,
        default: () => []
    },
    title: {
        type: String,
        default: () => {
            return ''
        }
    },
    Btn: {
        type: Array as any,
    },
    dialogFormVisible: {
        type: Boolean,
        default: () => {
            return false
        }
    },
    rowObj: {
        type: Object
    }
});
//级联树结构与绑定值
const prop = {
    label: 'cFactoryUnitName',
    value: 'cFactoryUnitName',
    children: 'Child',
    checkStrictly: true,
}
//form
watch(props, (newValue, oldValue) => {
    if (newValue.FormData) {
        setTimeout(()=>{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ruleFormRef.value.resetFields()
        },10)
        FormData.value = newValue.FormData
        headVal()
    }
    dialogFormVisible.value = newValue.dialogFormVisible
    title.value = newValue.title
    Btn.value = newValue.Btn 
    // 调取树结构数据
    getTreeData()
})

//处理form
const headVal = () => {
    let obj = {}
    FormData.value.map((item: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        obj[item.cAttributeCode] = ''
    })
    ruleForm.value = obj   
}

//规则
const rules = computed(() => {
    let obj: any = {}
    FormData.value.filter((item: { IsRequest: boolean; }) => item.IsRequest === false).map((item: { Resource: { cAttributeCode: string | number; cAttributeName: any; }; }) => {
        obj[item.Resource.cAttributeCode] = [
            { required: true, trigger: 'blur', message: `请输入${item.Resource.cAttributeName}` }
        ]
    })
    return obj
})

const options = ref([]) as any
//获取级联树结构数据
const getTreeData = () => {
    FormData.value.forEach((item: any) => {
        if (item.cControlTypeCode == 'Tree' && item.IsShow==true) {
            let data = {
                method: item.Resource.cHttpTypeCode,
                url: item.Resource.cServerIP + item.Resource.cUrl,
                params: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    cDictonaryTypeCode: item.Resource.cAttributeCode
                }
            }
            ParamsApi(data).then((res: any) => {
                options.value = res.data
            })
        }
    })
}
//级联树结构选项变化
const handleChangess = (value: any) => { 
    console.log(value)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cFactoryUnitCode.value=cascadedPanelRef.value?cascadedPanelRef.value[0].getCheckedNodes()[0].data.cFactoryUnitCode :""
    
}
//确定
const submitForm = async (formEl: FormInstance | undefined, item: any) => { 
    if (!formEl) return
        //新增
        let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP+item.Resource.cUrl,
            data: {
                // "list_uid":[RowId.value.UID],
                "list_uid":[],
                "model":{
                    "bLine":ruleForm.value.bLine,
                    "cFactoryUnitCode":cFactoryUnitCode.value,
                    "cFactoryUnitName":ruleForm.value.cFactoryUnitName,
                }
               
            }
        }
        await formEl.validate((valid, fields) => {
            if (valid) {
                DataApi(data).then(res => {
                    if (res.status === 200) {
                        ElMessage({
                            type: 'success',
                            message: '成功',
                        })
                    } else {
                        ElMessage.error('失败')
                    }
                })
                dialogFormVisible.value = false
            } else {
                console.log('error submit!', fields)
            }
        })
}

//取消
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    dialogFormVisible.value = false
}


</script>

<style scoped lang="scss"></style>