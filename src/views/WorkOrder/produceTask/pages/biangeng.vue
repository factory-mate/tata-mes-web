<template>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        center
        width="50%"
    >
        <el-form ref="formlabelref" :model="form" :inline="true" size="small" label-width="120px">
            
            <el-form-item label="生产任务单号：" >
                <el-input v-model="form.name" disabled  placeholder="请输入">
                </el-input>
            </el-form-item>
            <el-form-item label="计划数量：" >
                <el-input v-model="form.name"  placeholder="请输入">
                </el-input>
            </el-form-item>
          
            
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" >
                    保存
                </el-button>
            </span>
            </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref ,reactive,toRefs,watch} from 'vue'
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
const dataV=reactive({
    form:{
        name:''
    },
})
const {form}=toRefs(dataV)
const dialogVisible = ref(props.dialogV)
watch(props, (newValue, oldValue) => {
    dialogVisible.value =newValue.dialogV
})
</script>

<style scoped>

</style>