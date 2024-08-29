<template>
    <div class="colorMain">
        <el-card>
            <el-form 
            ref="ruleFormRef" :model="form" :rules="rules"   :inline="true" label-width="120px">
                <el-form-item label="产品分类编码：">
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="产品分类名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="结构编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="产品分类编码2：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="产品分类名称2：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="结构名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="订单材质编码："  prop="project">
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="订单材质名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="产品编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="加工材质编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="加工材质名称：" prop="project">
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="产品名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="封边材质编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="封边材质名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="配色编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="线框材质编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="线框材质名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="配色名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="芯板材质编码：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="芯板材质名称：" >
                    <el-input v-model="form.project" placeholder="请输入" >
                        <template #append>
                            <el-icon @click="clickModel"><MoreFilled /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
            </el-form>
            <i>需求不定</i>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="标签编码" />
                <el-table-column prop="name" label="标签名称" />
                <el-table-column prop="name" label="产品编码" />
                <el-table-column prop="name" label="产品名称" />
                <el-table-column prop="name" label="材质编码" />
                <el-table-column prop="name" label="材质名称" />
            </el-table>
            <div class="footerMain">
                <el-button >取消</el-button>
                <el-button type="primary"  @click="submitForm(ruleFormRef)">
                    保存
                </el-button>
            </div>
        </el-card>
        <!-- 搜索弹框 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData" @ModelClose="ModelClose"></searchModel>
    </div>
</template>

<script setup lang="ts">
import {ref, toRefs,reactive,getCurrentInstance ,nextTick } from "vue";
import searchModel from "@/components/MultiSelect/searchModel.vue"
import { useRouter } from 'vue-router'
import { MoreFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()
const router = useRouter()


const rules = reactive<FormRules>({
    project: [
        { required: true, message: '请输入', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
   
})
const data= reactive({
    dialogType:false,
    titleName:'标题',
    form:{
        project:''
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
    tableData:[]
})
const {form,dialogType,titleName,tableSet,gridData,tableData} =toRefs(data)


const clickModel=()=>{
    dialogType.value= true
}
const ModelClose=(val:any)=>{
    
    dialogType.value=val.type
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      // 对象
        router.push({ name: 'ColourProcessList' })
    } else {
      console.log('error submit!', fields)
    }
  })
}

</script>

<style lang="scss" scoped>
.colorMain{
    margin:  20px ;
}
.footerMain{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>