<template>
    <div class="prodMes">
        <el-card>
            <div class="butSty">
                <el-button>保存</el-button>
                <el-button>重置</el-button>
                <el-button>审核</el-button>
                <el-button>反审核</el-button>
                <el-button>禁用</el-button>
                <el-button>反禁用</el-button>
                <el-button>复制</el-button>
                <el-button>修改产能</el-button>
            </div>
            <el-divider content-position="left">基本信息</el-divider>
            <el-form :inline="true" :model="form"  ref="ruleFormRef" :rules="rules" label-width="130px" class="formMain">
                   
                    <el-form-item label="生产线代码：" prop="name">
                        <el-input v-model="form.user" placeholder="请输入"  :suffix-icon="Search" style="width:198px"/>
                    </el-form-item>
                    <el-form-item label="生产线名称：" prop="name">
                        <el-input v-model="form.user" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="车间：" prop="name">
                        <el-input v-model="form.user" placeholder="请输入" :suffix-icon="Search" style="width:198px"/>
                    </el-form-item>
                    <el-form-item label="创建人：">
                        <el-input v-model="form.user" placeholder="请输入"  />
                    </el-form-item>
                    <el-form-item label="创建日期：" >
                        <el-date-picker
                            v-model="form.user"
                            type="date"
                            placeholder="请输入"
                            style="width:198px"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                  
                    <el-form-item label="产线产能：" >
                        <el-input v-model="form.user" placeholder="请输入" :disabled="disabled " />
                    </el-form-item>
                    <el-form-item label="制单日期：" >
                        <el-date-picker
                            v-model="form.user"
                            :disabled="disabled "
                            type="date"
                            placeholder="请输入"
                            style="width:198px"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                    <el-form-item label="制单人：" >
                        <el-input v-model="form.user" placeholder="请输入" :disabled="disabled " />
                    </el-form-item>
                    <el-form-item label="禁用状态：" >
                        <el-input v-model="form.user" placeholder="请输入" :disabled="disabled " />
                    </el-form-item>
                    <el-form-item label="审核状态：" >
                        <el-input v-model="form.user" placeholder="请输入" :disabled="disabled " />
                    </el-form-item>
                    <el-form-item label="审核日期：" >
                        <el-date-picker
                            v-model="form.user"
                            :disabled="disabled "
                            type="date"
                            placeholder="请输入"
                            style="width:198px"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                        />
                    </el-form-item>
                    <el-form-item label="审核人：" >
                        <el-input v-model="form.user" placeholder="请输入" :disabled="disabled " />
                    </el-form-item>
                    
                    
            </el-form>
            <el-divider content-position="left">产品信息</el-divider>
            <div class="butSty" style="margin-bottom: 20px;">
                <el-button @click="clickNew">新增</el-button>
                <el-button>删除</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="date" label="序号" />
                <el-table-column prop="name" label="产品代码"  />
                <el-table-column prop="name" label="产线名称"  />
                <el-table-column prop="name" label="生产节拍"  />
                <el-table-column prop="name" label="添加日期"  />
            </el-table>
        </el-card>
        <model :dialogV="dialogV" :dialogTitle="'新增'"></model>
    </div>
</template>

<script setup lang="ts">
import { reactive,toRefs,ref } from 'vue'
import model from './listNew.vue'
import { useRouter } from 'vue-router'
import { Search,Refresh,Plus,PieChart} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
const router = useRouter()



const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ]
})
const formData = reactive({
    form:{
        user: '',
        region: '',
    },
    disabled:true,
    dialogV:false,
    tableData:[{}]
   
})
const {form,disabled,tableData,dialogV}=toRefs(formData)
const resetForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
const clickNew =()=>{
    dialogV.value=true
}


</script>

<style scoped lang="scss">
.prodMes{
    margin: 20px;
    .butSty{
        widows: 100%;
        display: flex;
        justify-content: flex-end;
    }
}
</style>