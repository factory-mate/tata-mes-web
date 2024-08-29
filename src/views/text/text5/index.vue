<template>
    <div class="box">
        <div class="common-layout">
            <el-container>
                <el-aside width="300px" style="border-right: 1px solid #ececec ; padding: 10px; height: 83vh;">
                    <el-input placeholder="群名称">
                        <template #append><el-icon>
                            <el-button :icon="Search" />
                            </el-icon></template>
                    </el-input>
                    <p style="background-color: #fff5e2;padding: 5px; font-size: 13px; border-radius: 5px;">慧友科技股份有限公司
                    </p>
                </el-aside>
                <el-main style="padding: 10px;">
                    <el-tabs type="border-card">
                        <el-tab-pane label="已入群企业">
                            <el-input placeholder="企业账号/联系人/联系电话/联系邮箱" style="width: 500px;">
                                <template #append><el-icon>
                                    <el-button :icon="Search" />
                                    </el-icon></template>
                            </el-input>
                            <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }"
                                style="width: 100%; margin-top: 20px;" border="">
                                <el-table-column prop="" label="供应商名称" width="180">
                                    <template v-slot:header>
                                        <span>服务费率</span>
                                        <el-icon @click="clickIcon">
                                            <Aim />
                                        </el-icon>
                                        <el-tooltip class="box-item" effect="dark" content="筛选"
                                            placement="top-start">
                                            <el-icon>
                                                <Filter />
                                            </el-icon>
                                        </el-tooltip>

                                        <el-icon>
                                            <Unlock />
                                        </el-icon>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="date" label="企业账号" width="180" />
                                <el-table-column prop="name" label="联系人" />
                                <el-table-column prop="address" label="手机号" :formatter="formatter" />
                                <el-table-column prop="email" label="邮箱" />
                                <el-table-column prop="s1" label="群身份" />
                                <el-table-column prop="s2" label="状态" />
                                <el-table-column prop="s3" label="入群时间" >
                                    <template v-slot:header>
                                        <span>入群时间</span>
                                        <popup :list1="list2"></popup>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="demo-pagination-block" style="float: right; ">
                                <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                                    background :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled"
                                    layout="total, sizes, prev, pager, next, jumper" :total="400"
                                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="邀请企业">
                            <el-input placeholder="企业账号/联系人/联系电话/联系邮箱" style="width: 500px;">
                                <template #append><el-icon>
                                    <el-button :icon="Search" />
                                    </el-icon></template>
                            </el-input>
                            <el-button type="danger" style="float: right;" :icon="Position">发送邀请</el-button>

                            <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }"
                                style="width: 100%; margin-top: 20px; " height="500px" border="">
                                <el-table-column prop="" label="供应商编码" sortable width="180" />
                                <el-table-column prop="date" label="供应商名称" width="180" />
                                <el-table-column prop="name" label="供应商简称" />
                                <el-table-column prop="address" label="联系人" :formatter="formatter" />
                                <el-table-column prop="email" label="手机号" />
                                <el-table-column prop="s1" label="邮箱" />
                                <el-table-column prop="s2" label="备注" />
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="邀请历史">
                            <el-input placeholder="企业账号/联系人/联系电话/联系邮箱" style="width: 500px;">
                                <template #append><el-icon>
                                    <el-button :icon="Search" />
                                    </el-icon></template>
                            </el-input>
                            <span style="padding: 0 10px; font-size: 13px;">状态</span><el-select v-model="value"
                                placeholder="全部">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                            <el-button type="danger" style="float: right;" :icon="Position" >再次邀请</el-button>
                            <el-table :data="tableData" :default-sort="{ prop: 'date', order: 'descending' }"
                                style="width: 100%; margin-top: 20px; " height="500px" border="">
                                <el-table-column prop="" label="供应商编码" sortable width="180" />
                                <el-table-column prop="date" label="供应商名称" width="180" />
                                <el-table-column prop="name" label="供应商简称" />
                                <el-table-column prop="address" label="联系人" :formatter="formatter" />
                                <el-table-column prop="email" label="手机号" />
                                <el-table-column prop="s1" label="邮箱" />
                                <el-table-column prop="s2" label="备注" />
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="群资料" style="padding: 50px;">
                            <p style="font-size: 13px;">群基本信息</p>
                            <span class="sp1">群logo</span>
                            <el-upload class="avatar-uploader"
                                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                :show-file-list="false" :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                <img src="/src/assets/LOG(1).png" alt="">
                            </el-upload>
                            <span class="sp1" style="display: inline-block;">群名称</span> <el-input placeholder=""
                                v-model="input" style="width: 500px;">
                            </el-input>
                            <span class="sp1">群编码
                                mlc6y43qtfid5xdq</span>
                            <span class="sp1">群类型
                                产业链型-采购服务</span>
                            <span class="sp1">核心企业
                                上海奔码软件有限公司</span>
                            <span class="sp1">创建时间
                                2022-10-27 13:38:20</span>
                            <el-button type="danger" style="margin-left: 50px;
                                margin-top: 30px;">保存</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </el-container>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref,reactive } from 'vue'
import { Search, Filter, Unlock, Aim,Position } from '@element-plus/icons-vue'
// import type { TableColumnCtx } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import popup from '/src/components/Popup/index.vue'

import { h } from "vue";
const currentPage1 = ref(5)
const currentPage2 = ref(5)
const currentPage3 = ref(5)
const currentPage4 = ref(4)
const pageSize2 = ref(100)
const pageSize3 = ref(100)
const pageSize4 = ref(100)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const list2 = reactive(
    [
        { id: 1, name: '标签1' },
        { id: 2, name: '标签2' },
        { id: 3, name: '标签3' },
       
    ]
)

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}

const clickIcon = () => {
    console.log(1111);

}

const input = ref('慧友科技股份有限公司')
const imageUrl = ref('')
const value = ref('')
interface User {
    date: string
    name: string
    address: string
    email: string
    s1: string
    s2: string
    s3: string
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}

const formatter = (row: User,) => {
    return row.address
}

const tableData: User[] = [
    {
        date: '慧友科技股份有限公司',
        name: '张三',
        address: '18867862622',
        email: 'ghq@benma.cloud',
        s1: '采购商',
        s2: '启用',
        s3: '2021-10-27'
    },

]

const options = [
    {
        value: '全部',
        label: '全部',
    },
    {
        value: '邀请中',
        label: '邀请中',
    },
    {
        value: '已同意',
        label: '已同意',
    },
    {
        value: '已过期',
        label: '已过期',
    },

]


</script>   

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    padding: 24px;

    .sp1 {
        display: block;
        font-size: 13px;
        padding-top: 10px;
    }
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}
</style>