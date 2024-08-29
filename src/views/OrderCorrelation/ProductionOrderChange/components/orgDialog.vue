<template>
    <!-- 新增弹窗  -->
    <div>
        <el-dialog v-model="dialogFormVisible" :title="title">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                status-icon>
                <template v-for="item in FormData" :key="item.UID">
                    <!-- v-if="item.Resource.cAttributeCode !== 'Data'" -->
                    <el-form-item  :label="item.Resource.cAttributeName + '：'"
                        :prop="item.Resource.cAttributeCode">
                        <!-- <el-input v-model="ruleForm[item.cAttributeCode]" :disabled="disabled" /> -->
                        <el-input
                            v-if="item.cControlTypeCode == 'TextBox' && item.cDataTypeCode == 'Nvarchar' "
                            v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'" />
                        <el-input
                            v-if="item.cControlTypeCode == 'RichText' && item.cDataTypeCode == 'Nvarchar' "
                            :rows="2" type="textarea" v-model="ruleForm[item.Resource.cAttributeCode]"
                            :placeholder="disabled ? '' : '请输入'" style="min-width: 220px;" />
                        <el-input-number v-if="item.cControlTypeCode == 'TextBox' && item.cDataTypeCode == 'Int'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'"
                            style="width:220px" />
                        <el-input-number v-if="item.cControlTypeCode == 'TextBox' && item.cDataTypeCode == 'Decimal'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'"
                            style="width:220px" />
                        <el-input v-if="item.cControlTypeCode == 'PassWord'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'" />
                        <el-select v-if="item.cControlTypeCode == 'ComboBox'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'">
                            <template v-for="(val, index) in ruleForm[item.Resource.cAttributeCode + '_Data']" :key="index">
                                <!-- v-if="item.Resource.cAttributeCode == val.cDictonaryTypeCode" -->
                                <el-option 
                                    :label="val.cDictonaryName" :value="val.cDictonaryCode" />
                            </template>
                        </el-select>
                        <!-- 日期 -->
                        <el-date-picker v-if="item.cControlTypeCode == 'DatePicker'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" type="date" placeholder="请选择"
                            format="YYYY-MM-DD" value-format="YYYY-MM-DD" :default-value="new Date()" />
                        <el-date-picker v-if="item.cControlTypeCode == 'DatePicker2'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" type="daterange" placeholder="请选择"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                            :default-value="new Date()" />
                        <el-date-picker v-if="item.cControlTypeCode == 'DateTimePicker'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" type="datetime" placeholder="请选择"
                            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss" />
                        <el-date-picker v-if="item.cControlTypeCode == 'DateTimePicker4'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" type="datetimerange" placeholder="请选择"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DDTHH:mm:ss" />
                        <el-radio-group v-if="item.cControlTypeCode == 'CheckBox'"
                            v-model="ruleForm[item.Resource.cAttributeCode]" style="width: 220px;">
                            <el-radio :label='true'>是</el-radio>
                            <el-radio :label='false'>否</el-radio>
                        </el-radio-group>
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
const ruleFormRef = ref<FormInstance>()
const ruleForm: any = ref({})
const dialogFormVisible = ref()
const FormData = ref([]) as any
const KeyVal = ref([]) as any
const utfs = ref([]) as any
const title = ref()
const disabled = ref()
const rowId = ref()
const bindData = ref()
const Btn = ref()
const { tableAxios } = inject('tableAxios') as {
    tableAxios: () => void
}
const props = defineProps({
    FormData: {
        required: true,
        type: Array as any,
        default: () => []
    },
    sendIdArr: {
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
    if (newValue.title == '组织管理详情') {
        disabled.value = newValue.disabled
    } else {
        disabled.value = false
    }
    //获取单行数据
    if (newValue.title !== '组织管理新增') {
        FormData.value.forEach((item: { Resource: { cAttributeTypeCode: string; }; }) => {
            if (item.Resource.cAttributeTypeCode == 'binddata') {
                bindData.value = item
                // sendRow()
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
    if (!formEl) return
    if (item.cAttributeCode == 'SaveEdit') {
        if(!ruleForm.value.dPlanDateStart){
            ElMessage({
                type: 'error',
                message: '请选择日期',
            })
            return false
        }
        console.log(props.sendIdArr,"---props.sendIdArr");
        
        if(props.sendIdArr){
            KeyVal.value=[]
            utfs.value=[]
            props.sendIdArr.forEach((item:any)=>{
                KeyVal.value.push(item.UID)
                utfs.value.push(item.utfs)
            })
        }
        //编辑
        let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP+item.Resource.cUrl,
            data: {
                "KeyVal": KeyVal.value,
                "utfs": utfs.value,
                "dPlanDateStart": ruleForm.value.dPlanDateStart
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
                    } else {
                        ElMessage.error('修改失败')
                    }
                })
                dialogFormVisible.value = false
            } else {
                ElMessage.info('验证不通过')
            }
        })
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