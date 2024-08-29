<template>
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        center
        width="80%"
    >   
        <el-form ref="formlabelref" :model="form" :inline="true" size="small" label-width="120px">
            <el-form-item label="揉单维度：" >
                <el-select v-model="form.name" placeholder="请输入">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" plain @click="clickView">揉单预览</el-button>
            </el-form-item>
        </el-form>
        <i>需求不定</i>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="date" label="序号" />
            <el-table-column prop="name" label="MES工单号" min-width="120"  />
            <el-table-column prop="name" label="生产任务单号" min-width="100"  />
            <el-table-column prop="name" label="产品代码" min-width="100"  />
            <el-table-column prop="name" label="产品名称" min-width="100"  />
            <el-table-column prop="name" label="规格"  />
            <el-table-column prop="name" label="型号"  />
        </el-table>
           
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary"  >
                    保存
                </el-button>
            </span>
            </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref ,reactive,toRefs,watch} from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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
    tableData:[{}]
})
const {form,tableData}=toRefs(dataV)
const dialogVisible = ref(props.dialogV)
watch(props, (newValue, oldValue) => {
    dialogVisible.value =newValue.dialogV
})

const clickView=()=>{
  ElMessageBox.alert('提示：你的变更比原来计划数量减少/增加多少', '提示', {
    // if you want to disable its autofocus
    autofocus: false,
    // confirmButtonText: '',
    callback: ( ) => {
      // ElMessage({
      //   type: 'info',
      //   message: `1`,
      // })
    },
  })
    
}
</script>

<style scoped lang="scss">

</style>