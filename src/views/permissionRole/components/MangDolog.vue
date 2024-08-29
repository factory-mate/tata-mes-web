<template>
    <!-- 新增弹窗  -->
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                status-icon>
                <template v-for="item in FormData" :key="item.UID">
                    <el-form-item v-if="item.Resource.cAttributeCode !== 'Data'" :label="item.Resource.cAttributeName + '：'"
                        :prop="item.Resource.cAttributeCode">
                        <el-input v-model="ruleForm[item.cAttributeCode]" :disabled="disabled" />
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
import { ref, toRefs, defineProps, computed, defineExpose, watch, inject, onActivated } from "vue";
import { ElCard, ElDatePicker, ElForm, ElFormItem, ElMessage, ElIcon, ElInput, ElOption, ElSelect, FormInstance, FormRules } from 'element-plus'
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index'
import router from "@/router";
import { sessionStorage } from '@/utils/storage';
const ruleFormRef = ref<FormInstance>()
const ruleForm: any = ref({})
const dialogFormVisible = ref()
const FormData = ref([]) as any
const title = ref()
const disabled = ref()
const rowId = ref()
const bindData = ref()
const Btn = ref()
const EditData = ref()
const EditBtn = ref()
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
    disabled: {
        type: Boolean
    },
    row: {
        type: Object
    }
});
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
    //单行数据获取的UID
    rowId.value = newValue.row
    //输入框禁用
    if (newValue.title == '策略管理详情') {
        disabled.value = newValue.disabled
    } else {
        disabled.value = false
    }
    //获取单行数据
    if (newValue.title !== '策略管理新增') {
        FormData.value.forEach((item: { Resource: { cAttributeTypeCode: string; }; }) => {
            if (item.Resource.cAttributeTypeCode == 'binddata') {
                bindData.value = item
                sendRow()
            }
        })
    }
})
//获取单行数据
const sendRow = () => {
    let data = {
        method: bindData.value.Resource.cHttpTypeCode,
        url: bindData.value.Resource.cServerIP+bindData.value.Resource.cUrl,
        params: {
            "val": rowId.value.UID
        }
    }
    ParamsApi(data).then(res => {
        if (res.status == 200) {
            ruleForm.value = res.data
        } else {
            console.log('失败');

        }
    })
}
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
    FormData.value.filter((item: { IsRequest: boolean; }) => item.IsRequest === true).map((item: { Resource: { cAttributeCode: string | number; cAttributeName: any; }; }) => {
        obj[item.Resource.cAttributeCode] = [
            { required: true, trigger: 'blur', message: `请输入${item.Resource.cAttributeName}` }
        ]
    })
    return obj
})

//提交
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
    console.log(item,'0000-------------');
    
    if (!formEl) return
    if (item.cAttributeCode == 'SaveAdd') {
        //新增
        let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP+item.Resource.cUrl,
            data: {
                "cOrganizationCode": ruleForm.value.cOrganizationCode,
                "cOrganizationName": ruleForm.value.cOrganizationName,
            }
        }
        await formEl.validate((valid, fields) => {
            if (valid) {
                DataApi(data).then(res => {
                    if (res.status === 200) {
                        ElMessage({
                            type: 'success',
                            message: '新增成功',
                        })
                        tableAxios()
                    } else {
                        ElMessage.error('新增失败')
                    }
                })
                dialogFormVisible.value = false
            } else {
                console.log('error submit!', fields)
            }
        })
    } else if (item.cAttributeCode == 'SaveEdit') {
        //编辑
        let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP+item.Resource.cUrl,
            data: {
                "UID": rowId.value.UID,
                "utfs": rowId.value.utfs,
                "cOrganizationName": ruleForm.value.cOrganizationName
            }
        }
        await formEl.validate((valid, fields) => {
            if (valid) {
                DataApi(data).then(res => {
                    if (res.status === 200) {
                        ElMessage({
                            type: 'success',
                            message: '修改成功',
                        })
                        tableAxios()
                        sessionStorage.remove('EditData')
                        sessionStorage.remove('EditBtn')
                    } else {
                        ElMessage.error('修改失败')
                    }
                })
                dialogFormVisible.value = false
            } else {
                ElMessage.info('验证不通过')
            }
        })
    } else {
        dialogFormVisible.value = false
        ElMessage.info('请打开编辑弹窗')
    }

}

//取消
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    dialogFormVisible.value = false
}


</script>

<style scoped lang="scss"></style>