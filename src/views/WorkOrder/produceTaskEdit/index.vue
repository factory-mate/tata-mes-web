<template>
    <div class="produceEdit">
        <el-card>
            <div class="butTSty">
                <el-button >重置</el-button>
                <el-button>审核</el-button>
                <el-button>反审核</el-button>
            </div>
            <el-divider content-position="left">基本信息</el-divider>
            <el-form :inline="true" :model="form" label-width="160px" :rules="rules" class="formMain">
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="生产任务单号：">
                                    <el-input v-model="form.id" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="生产批号：" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品代码：" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入" :suffix-icon="Search"  style="width: 190px;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品工艺流程：" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入" :suffix-icon="Search"  style="width: 190px;"/>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="单位：">
                                    <el-input v-model="form.name" placeholder="请输入" :suffix-icon="Search"  style="width: 190px;"/>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产品名称：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="ERP生产订单号：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="计划数量：">
                                    <el-input v-model="form.id" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="累计完工数量：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="超产比例：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="计划开工日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="计划完工日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="工单状态：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="实际开始日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="实际完工日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="计划完工日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="制单人：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="制单日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="结案人：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="审核人：">
                                    <el-input v-model="form.name" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="审核日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="结案日期：">
                                    <el-date-picker
                                       v-model="value1"
                                       type="date"
                                       placeholder="请选择"
                                       :default-value="new Date()"
                                       style="width: 195px;"
                                    />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="结案：">
                                    <el-checkbox v-model="form.checked"></el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">   
                            </el-col>
                        </el-row>
                    </el-form>
            <div class="butBSty">
                <el-button type="primary" @click="resetForm(ruleFormRef)">保存</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive,toRefs,ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search,Refresh,Plus,PieChart} from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
const router = useRouter()

//日期时间
const value1 = ref('')
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
        id:'',
        name:'',
        checked:''
    },
    disabled:true
   
})
const {form,disabled}=toRefs(formData)
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

</script>

<style scoped lang="scss">
.produceEdit{
    margin: 20px;
    .butTSty{
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .butBSty{
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>