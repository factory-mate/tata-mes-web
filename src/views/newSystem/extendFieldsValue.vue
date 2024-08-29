<template>
    <div class="extendF">
       <el-card>
            <el-divider content-position="left">基础信息</el-divider>
            <div class="butSty">
                <el-button  :icon="Plus" >新增</el-button>
                <el-button  :icon="Edit">编辑</el-button>
                <el-button  :icon="Delete">删除</el-button>
            </div>
            <el-form :inline="true" :model="form"  ref="ruleFormRef"  :rules="rules" label-width="120px" class="formMain">
                <el-form-item label="扩展类型：" prop="name">
                    <el-select v-model="form.region" placeholder="请输入" style="max-width:198px">
                      <el-option label="Zone one" value="shanghai" />
                      <el-option label="Zone two" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="扩展字段名称：" prop="name">
                    <el-select v-model="form.region" placeholder="请输入" style="max-width:198px">
                      <el-option label="Zone one" value="shanghai" />
                      <el-option label="Zone two" value="beijing" />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-divider content-position="left">列表信息</el-divider>
            <el-tabs type="border-card">
                <el-tab-pane label="字段取值">
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="date" label="序号" />
                        <el-table-column prop="date" label="扩展字段取值" />
                        <el-table-column prop="date" label="制单人" />
                        <el-table-column prop="date" label="制单日期" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="应用单据">
                    <el-table :data="tableData" border style="width: 100%">
                        <el-table-column type="selection" width="55" />
                        <el-table-column prop="date" label="序号" />
                        <el-table-column prop="date" label="单据ID" />
                        <el-table-column prop="date" label="单据名称" />
                        <el-table-column prop="date" label="制单人" />
                        <el-table-column prop="date" label="制单日期" />
                    </el-table>
                </el-tab-pane>
              </el-tabs>
           

       </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive,toRefs,ref } from 'vue'
import { useRouter } from 'vue-router'
import { Delete,Plus,Refresh, Edit,Check, Search,SuccessFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()

const router = useRouter()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
})
const data = reactive({
    form:{
        date:'',
        user: '',
        region: '',
    },
    tableData:[
        {}
    ]
})

const {form,tableData} =toRefs(data)
</script>

<style scoped lang="scss">
.extendF{
    margin: 20px;
    .butSty{
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>