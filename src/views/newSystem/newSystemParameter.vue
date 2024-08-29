<template>
    <div class="editSysPar">
        <el-form  ref="ruleFormRef" status-icon :model="form" label-width="120px" :inline="true" :rules="rules" >
            <el-divider content-position="left">基本信息</el-divider>
            <el-form-item label="参数代码：">
              <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="参数名称：" prop="name">
              <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="参数类别：">
                <el-select v-model="form.name" placeholder="请输入" >
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form-item>
            <el-form-item label="禁用：">
                <el-switch v-model="form.switch" />
            </el-form-item>
            <el-form-item label="参数功能描述：" style="width: 100%;">
                <el-input
                style="width: 90%;"
                v-model="form.name"
                autosize
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-divider content-position="left">参数值</el-divider>

            <div class="butMain"> 
                <el-button  type="primary" plain>参数新增</el-button>
                <el-button  type="primary" plain>参数修改</el-button>
            </div>
            <div class="itemMain">
                <div class="itemSty" v-for="(item,i) in canItem" :key="i">
                    <el-form-item :label="item.name+'：'" >
                        <el-input v-model="item.value"  placeholder="请输入" />
                    </el-form-item>
                    <el-icon class="iconSty" @click="delItem(i)"><CircleClose /></el-icon>
                </div>
            </div>
            <el-form-item label="参数值说明：" style="width: 100%;">
                <el-input
                style="width: 90%;"
                v-model="form.name"
                autosize
                type="textarea"
                placeholder="请输入"
              />
            </el-form-item>
            <el-divider content-position="left">制单信息</el-divider>

            <el-form-item label="制单人：">
                <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="制单日期：">
                <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="审核状态：">
                <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="审核人：">
                <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
            <el-form-item label="审核日期：">
                <el-input v-model="form.name"  placeholder="请输入" />
            </el-form-item>
        </el-form>、
        <div class="submitSty">
            <el-button @click="submitForm(ruleFormRef)" type="primary">保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive,toRefs ,ref} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { CircleClose} from '@element-plus/icons-vue'
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
})
const data=reactive({
    form:{
        name:'',
        switch:true
    },
    canItem:[
        {
            name:'参数1',
            value:''
        },
        {
            name:'参数2',
            value:''
        },
        {
            name:'参数3',
            value:''
        },
    ]
})
const {form,canItem} = toRefs(data)

const delItem=(i:any)=>{
    console.log(i);
    
    canItem.value.splice(i,1)
}
const submitForm = async (formEl: FormInstance | undefined) => {
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
.editSysPar{
    margin: 20px ;
    .butMain{
        width: 100%;
        display: flex;
        padding-bottom: 20px;
        justify-content:flex-end;
    }
    .itemMain{
        width: 100%;
        display: flex;
        .itemSty{
            .iconSty{
                margin-left: -20px;
                vertical-align: 4px;
                color: #d1d1d1;
                cursor: pointer;
            }
        }
    }
    .submitSty{
        text-align: center;
    }
}
</style>