<template>
    <div class="extenFields">
        <el-card>
            <div class="butSty">
                <el-button  :icon="Plus" >新增</el-button>
                <el-button  :icon="SuccessFilled" >保存 </el-button>
                <el-button  :icon="Check">提交</el-button>
                <el-button  :icon="Edit">编辑</el-button>
            </div>
            <el-divider content-position="left">基础信息</el-divider>
            <el-form :inline="true" :model="form"  ref="ruleFormRef"  :rules="rules" label-width="120px" class="formMain">
                <el-form-item label="扩展类型：" prop="name">
                    <el-select v-model="form.region" placeholder="请输入" style="max-width:198px">
                      <el-option label="Zone one" value="shanghai" />
                      <el-option label="Zone two" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="应用单据：" prop="name">
                    <el-select v-model="form.region" placeholder="请输入" style="max-width:198px">
                      <el-option label="Zone one" value="shanghai" />
                      <el-option label="Zone two" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="数据类型：" prop="name">
                    <el-select v-model="form.region" placeholder="请输入" style="max-width:198px">
                      <el-option label="Zone one" value="shanghai" />
                      <el-option label="Zone two" value="beijing" />
                    </el-select>
                </el-form-item>
                <el-form-item label="扩展字段名称：" prop="name">
                    <el-input v-model="form.user" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="长度：" prop="name">
                    <el-input v-model="form.user" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="最大长度：" prop="name">
                    <el-input v-model="form.user" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="小数位数：">
                    <el-input v-model="form.user" placeholder="请输入" />
                </el-form-item>
                <el-form-item label=" ">
                    <el-checkbox v-model="form.user" label="定长" />
                    <el-checkbox v-model="form.user" label="必录项" />
                    <el-checkbox v-model="form.user" label="汇报显示" />
                </el-form-item>
               
            </el-form>
            <el-divider content-position="left">列表信息</el-divider>
            <div class="butSty" style="margin-bottom: 20px;">
                <el-button  :icon="Delete" >删除</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="date" label="序号" />
                <el-table-column prop="name" label="扩展类型" min-width="90"  />
                <el-table-column prop="address" label="应用单据" />
                <el-table-column prop="address" label="数据类型" />
                <el-table-column prop="address" label="扩展字段名称" min-width="100" />
                <el-table-column prop="address" label="长度" />
                <el-table-column prop="address" label="最大长度" />
                <el-table-column prop="address" label="小数位数" />
                <el-table-column prop="address" label="定长" />
                <el-table-column prop="address" label="必录项" />
                <el-table-column prop="address" label="制单人" />
                <el-table-column prop="address" label="制单日期" />
            </el-table>
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
.extenFields{
    margin: 20px;
    .butSty{
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>