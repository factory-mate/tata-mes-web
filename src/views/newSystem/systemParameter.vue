<template>
    <div class="sysPar">
        <el-card style="margin-bottom:20px">
            <el-form :inline="true" :model="form" class="formMain">
                <div class="formL">
                    <el-form-item label="参数代码：">
                        <el-input v-model="form.user" placeholder="请输入" :suffix-icon="Search"/>
                    </el-form-item>
                    <el-form-item label="参数名称：">
                        <el-input v-model="form.region" placeholder="请输入" :suffix-icon="Search"/>
                    </el-form-item>
                    <el-form-item label="所属组织：">
                        <el-input v-model="form.region" placeholder="请输入" :suffix-icon="Search"/>
                    </el-form-item>
                    <el-form-item label="启用状态：">
                        <el-select v-model="form.region" placeholder="请输入">
                          <el-option label="Zone one" value="shanghai" />
                          <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态：">
                        <el-select v-model="form.region" placeholder="请输入">
                          <el-option label="Zone one" value="shanghai" />
                          <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="formR">
                    <el-button type="primary" :icon="Search" @click="onSubmit">搜索</el-button>
                    <el-button type="primary" :icon="Refresh" @click="onSubmit">重置</el-button>
                    <el-dropdown split-button type="primary" @click="onSubmit" style="margin-left: 10px;">
                        高级
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-dropdown-item>Action 1</el-dropdown-item>
                            <el-dropdown-item>Action 2</el-dropdown-item>
                            <el-dropdown-item>Action 3</el-dropdown-item>
                            <el-dropdown-item>Action 4</el-dropdown-item>
                            <el-dropdown-item>Action 5</el-dropdown-item>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                </div>
            </el-form>
        </el-card>
        <el-card>
            <div class="butMain">
                <el-button  :icon="Plus" @click="clickRouter">新增</el-button>
                <el-button @click="clickRouter">编辑</el-button>
                <el-button>删除</el-button>
                <el-button>复制</el-button>
                <el-button>审核</el-button>
                <el-button>反审核</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="date" label="序号" />
                <el-table-column prop="name" label="参数代码"  />
                <el-table-column prop="address" label="参数名称" />
                <el-table-column prop="address" label="参数功能描述" min-width="160" />
                <el-table-column prop="address" label="类别" />
                <el-table-column prop="address" label="参数值" min-width="160"/>
                <el-table-column prop="address" label="状态" />
                <el-table-column prop="address" label="参数值说明" min-width="160"/>
                <el-table-column prop="address" label="制单人" />
                <el-table-column prop="address" label="制单日期" />
                <el-table-column prop="address" label="审核人" />
                <el-table-column prop="address" label="审核日期" />
                <el-table-column prop="address" label="备注" />
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { reactive,toRefs } from 'vue'
import { useRouter } from 'vue-router'

import { Search,Refresh,Plus} from '@element-plus/icons-vue'
const router = useRouter()
const formData = reactive({
    form:{
        user: '',
        region: '',
    },
    tableData:[
        {}
    ]
})
const {form,tableData}=toRefs(formData)
const onSubmit = () => {
  console.log('submit!')
}
const clickRouter=()=>{
    router.push({ name: 'newSystemParameter' })
}
</script>

<style scoped lang="scss">
.sysPar{
    margin: 20px;
    .formMain{
        display: flex;
        justify-content: space-between;
        .formR{
            min-width: 280px;
        }
    }
    .butMain{
        display: flex;
        justify-content: flex-end;
        padding-bottom: 20px;
    }
}
</style>