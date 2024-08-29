<template>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        center
        width="50%"
    >
        <el-form :model="form">
            <el-form-item label="裁切方式：" :label-width="formLabelWidth">
                <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="裁切角度：" :label-width="formLabelWidth">
                <el-input v-model="form.name"  placeholder="请输入"/>
            </el-form-item>
            <el-form-item label="MES编码：" :label-width="formLabelWidth">
                <el-input
                    v-model="form.name"
                    placeholder="请输入"
                >
                    <template #append>
                        <el-icon @click="clickModel"><MoreFilled /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="MES名称：" :label-width="formLabelWidth">
                <el-input
                    v-model="form.name"
                    placeholder="请输入"
                >
                    <template #append>
                        <el-icon @click="clickModel"><MoreFilled /></el-icon>
                    </template>
                </el-input>
            </el-form-item>
       
          
        </el-form>
        <template #footer>
        <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
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
        name:''
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
 
})
const {form,dialogType,titleName,tableSet,gridData} =toRefs(data)

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

</script>

<style scoped lang="scss">

</style>