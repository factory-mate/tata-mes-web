<template>
    <!-- 新增弹窗  -->
    <div>
        <el-dialog v-model="RdialogFormVisible" :title="title" :close-on-click-modal="false" @opened="clickOpen" draggable :modal="false">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                status-icon>
                <template v-for="item in FormData" :key="item.UID">
                    <el-form-item v-if="item.Resource.cAttributeCode !== 'Data'" :label="item.Resource.cAttributeName + '：'"
                        :prop="item.Resource.cAttributeCode">
                        <!-- {{ item.Resource.cAttributeCode }} -->
                        <!-- <el-input v-model="ruleForm[item.cAttributeCode]" :disabled="disabled" /> -->
                        <el-date-picker v-if="item.cControlTypeCode == 'DatePicker'"
                        v-model="ruleForm[item.cAttributeCode]" type="date" placeholder="请选择"
                            format="YYYY-MM-DD" value-format="YYYY-MM-DD" :default-value="new Date()" />
                        <el-date-picker v-if="item.cControlTypeCode == 'DatePicker2'"
                        v-model="ruleForm[item.cAttributeCode]" type="daterange" placeholder="请选择"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                            :default-value="new Date()" :disabled="disabled" />
                        <el-date-picker v-if="item.cControlTypeCode == 'DateTimePicker'"
                        v-model="ruleForm[item.cAttributeCode]" type="datetime" placeholder="请选择"
                            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DDTHH:mm:ss" :disabled="disabled"/>
                        <el-date-picker v-if="item.cControlTypeCode == 'DateTimePicker4'"
                        v-model="ruleForm[item.cAttributeCode]" type="datetimerange" placeholder="请选择"
                            start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
                            value-format="YYYY-MM-DDTHH:mm:ss" :disabled="disabled"/>
                        <el-input
                        v-if="item.cControlTypeCode == 'TextBox'"  v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'"  clearable/>
                        <el-input
                            v-if="item.cControlTypeCode == 'RichText'  " v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'" type="textarea" style="width: 100%;" clearable/>
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
import { ref,  defineProps, computed, watch, inject,defineExpose } from "vue";
import { ElForm, ElFormItem, ElMessage, ElInput,FormInstance, ElLoading } from 'element-plus'
import {  ParamsApi, DataApi } from '@/api/configApi/index'
import { sessionStorage } from '@/utils/storage';
const ruleFormRef = ref<FormInstance>()
const ruleForm: any = ref({})
const RdialogFormVisible = ref(false)
const FormData = ref([]) as any
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
    title: {
        type: String,
        default: () => {
            return ''
        }
    },
    Btn: {
        type: Array as any,
    },
    disabled: {
        type: Boolean
    },
    sendIdArr: {
        type: Array as any,
    }
});
//form
watch(props, (newValue, oldValue) => {
    if (newValue.FormData) {
        // setTimeout(()=>{
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore
        //     ruleFormRef.value.resetFields()
        // },10)
        FormData.value = newValue.FormData
        headVal()
    } 
    title.value = newValue.title
    Btn.value = newValue.Btn
},{deep: true})
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
const KeyVal=ref([]) as any
const utfs = ref([]) as any
const Open=()=>{
    RdialogFormVisible.value=true
}
const close=()=>{
    RdialogFormVisible.value=false
}
defineExpose({Open})
//提交
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
    console.log(item,"--==item");
    
    if (!formEl) return
    if(!ruleForm.value.partNo){  
        ElMessage({
            type: 'info',
            message: '请输入订单号',
        })
        return false
    }
   
   
    await formEl.validate((valid, fields) => {
            if (valid) {
                if(item.cAttributeCode=='SaveEdit'){
                    SaveEdit(item)
                }
                if(item.cAttributeCode=='SaveEditPick'){
                    SaveEditPick(item)
                }
                if(item.cAttributeCode=='GetOrderOK'){
                    GetOrderOK(item)
                }
            } else {
                console.log('error submit!', fields)
        }
    })
}
const SaveEdit=(item:any)=>{
    if(props.sendIdArr){
        KeyVal.value=[]
        utfs.value=[]
    }
    props.sendIdArr.forEach((item:any)=>{
        KeyVal.value.push(item.UID)
        utfs.value.push(item.utfs)
    })
    let data = {
        method: item.Resource.cHttpTypeCode,
        url: item.Resource.cServerIP+item.Resource.cUrl,
        data: {
            "KeyVal": KeyVal.value,
            "utfs":utfs.value,
            "dDate":ruleForm.value.dPlanDateStart,
        }
    }
    DataApi(data).then(res => {
        if (res.status === 200) {
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            close()
            tableAxios()
        } else {
            ElMessage.error('修改失败')
        }
    }) 
}
const SaveEditPick=(item:any)=>{
    if(props.sendIdArr){
        KeyVal.value=[]
        utfs.value=[]
    }
    props.sendIdArr.forEach((item:any)=>{
        KeyVal.value.push(item.UID)
        utfs.value.push(item.utfs)
    })
    let data = {
        method: item.Resource.cHttpTypeCode,
        url: item.Resource.cServerIP+item.Resource.cUrl,
        data: {
            cProjectCode:'',
            PlanDate:ruleForm.value.dPlanDateStart,
            Ids:KeyVal.value
        }
    }
    
    DataApi(data).then(res => {
        if (res.status === 200) {
            ElMessage({
                type: 'success',
                message: '修改成功',
            })
            close()
            tableAxios()
        } else {
            ElMessage.error('修改失败')
        }
    }) 
}
const GetOrderOK=(item:any)=>{
    let data = {
        method: item.Resource.cHttpTypeCode,
        url: item.Resource.cServerIP+item.Resource.cUrl,
        data: {
            "OrderByFileds": "partNo",
            "Conditions": "partNo in ("+ruleForm.value.partNo+")"
        }
    }
    console.log(data,"0-0-");
    
    ElLoading.service({lock: true,text: '加载中.....'})
    DataApi(data).then(res => {
        if (res.status === 200) {
            ElMessage({
                type: 'success',
                message:res.msg|| '获取成功',
            })
            
            close()
            tableAxios()
        } else {
            ElMessage.error(res.msg|| '获取失败')
        }
        ElLoading.service().close()
    }) 
}
const clickOpen=()=>{
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ruleFormRef.value.resetFields()
}
//取消
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    RdialogFormVisible.value = false
}


</script>

<style scoped lang="scss"></style>