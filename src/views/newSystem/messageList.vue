<template>
    <div class="messageList">
        <el-card style="margin-bottom:20px">
            <el-form :inline="true" :model="form" label-width="100px" class="formMain">
                <div class="formL">
                    <el-form-item label="标题：">
                        <el-input v-model="form.user" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="日期：">
                        <el-date-picker
                            v-model="form.date"
                            type="date"
                            format="YYYY/MM/DD"
                            value-format="YYYY-MM-DD"
                            placeholder="请选择"
                        />
                    </el-form-item>
                    <el-form-item label="发布人：">
                        <el-input v-model="form.region" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="发布日期">
                        <el-input v-model="form.region" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="发布状态：">
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
                <el-button>审核</el-button>
                <el-button>反审核</el-button>
                <el-button>发布</el-button>
                <el-button>撤销发布</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="date" label="序号" />
                <el-table-column prop="name" label="发布标题" min-width="90"  />
                <el-table-column prop="address" label="内容" />
                <el-table-column prop="address" label="消息类型" min-width="90" />
                <el-table-column prop="address" label="重要级别" min-width="90"/>
                <el-table-column prop="address" label="查阅状态" min-width="90"/>
                <el-table-column prop="address" label="发布人" />
                <el-table-column prop="address" label="发布人所属组织" min-width="130" />
                <el-table-column prop="address" label="发布所属部门" min-width="120"/>
                <el-table-column prop="address" label="发布时间" min-width="90"/>
                <el-table-column prop="address" label="状态" />
                <el-table-column prop="address" label="发布方式" min-width="90"/>
                <el-table-column prop="address" label="工作日提醒时间" min-width="130"/>
                <el-table-column prop="address" label="强制查看" min-width="90"/>
                <el-table-column prop="address" label="发送人数" min-width="90"/>
                <el-table-column prop="address" label="已读情况" min-width="90"/>
                <el-table-column prop="address" label="未读情况" min-width="90"/>
                <el-table-column prop="address" label="审核人" />
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
        date:'',
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
.messageList{
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