<template >
    <div class="text4Main">
        <el-card class="left">
            <!-- <div class="left"> -->
            <el-input v-model="inp1" placeholder="请输入" :prefix-icon="Search" />
            <el-tree :data="tree" :props="defaultProps" @node-click="handleNodeClick" />
            <!-- </div> -->
        </el-card>
        <el-card class="right">
            <div class="headTitle">标题</div>
            <div class="headHint">
                <div class="item">类型：xxxx</div>
                <div class="item">日期：2022-07-12</div>
                <div class="item">操作人：xx</div>
                <div class="item">状态：xx</div>
                <div class="item">结果：xx</div>
                <div class="item">进度：xx</div>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="date" label="日期">
                    <template v-slot:header>
                        <span>服务费率</span>
                        <el-popover placement="bottom" :width="160" trigger="hover">
                            <template #reference>
                                <el-icon @click="clickIcon">
                                    <Aim />
                                </el-icon>
                            </template>
                            <el-input v-model="input3" class="w-50 m-2" size="small" placeholder="Please Input"
                                :suffix-icon="Search" />

                            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                                        city
                                }}</el-checkbox>
                            </el-checkbox-group>
                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                                @change="handleCheckAllChange">全选</el-checkbox><br>
                                <el-button type="info" round size="small" style="margin-left:13px ;">取消</el-button>
                                <el-button type="danger" round size="small">确定</el-button>
                        </el-popover>
                        <el-icon>
                            <Switch />
                        </el-icon>
                        <el-icon>
                            <Connection />
                        </el-icon>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="名称" />
                <el-table-column prop="address" label="信息" />
                <el-table-column fixed="right" width="200" label="操作" align="center">
                    <template #default>
                        <el-button plain round type="primary" size="small" :icon="Edit">编辑</el-button>
                        <el-button plain round type="primary" size="small" :icon="Delete">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" background
                :page-sizes="[100, 200, 300, 400]" layout="total, sizes, prev, pager, next, jumper" :total="400" >
        
        </el-pagination>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import { ref, toRefs, reactive } from 'vue'
import { Delete, Edit, Search, Plus, Aim, Connection, Switch, Share, Upload } from '@element-plus/icons-vue'
interface Tree {
    label: string
    children?: Tree[]
}
const data = reactive({
    inp1: ''
})
const checkAll = ref(false)
const isIndeterminate = ref(true)
const checkedCities = ref(['Shanghai', 'Beijing'])
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen']

const input3 = ref('')
const currentPage4 = ref(1)
const pageSize4 = ref(100)
const { inp1 } = toRefs(data)
const defaultProps = {
    children: 'children',
    label: 'label',
}
const tree: Tree[] = [
    {
        label: '数据1',
        children: [
            {
                label: '数据 1-1',
                children: [
                    {
                        label: '数据 1-1-1',
                    },
                ],
            },
        ],
    },
    {
        label: '效果 2',
        children: [
            {
                label: '效果 2-1',
                children: [
                    {
                        label: '效果 2-1-1',
                    },
                ],
            },
            {
                label: '模板 2-2',
                children: [
                    {
                        label: '模板 2-2-1',
                    },
                ],
            },
        ],
    },
    {
        label: '动态 3',
        children: [
            {
                label: '动态 3-1',
                children: [
                    {
                        label: '动态 3-1-1',
                    },
                ],
            }
        ],
    },
]
const tableData = [
    {
        date: '2016-05-03',
        name: '小张',
        address: '一号车床完毕',
    },
    {
        date: '2016-05-02',
        name: '小张',
        address: '二号车床完毕',
    },
    {
        date: '2016-05-04',
        name: '小张',
        address: '三号车床完毕',
    },
    {
        date: '2016-05-01',
        name: '小张',
        address: '四号车床完毕',
    },
]
const clickIcon = () => {
    console.log('click icon');

}

const handleNodeClick = (data: Tree) => {
    console.log(data)
}

// 多选框api
const handleCheckAllChange = (val: boolean) => {
    checkedCities.value = val ? cities : []
    isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value:  string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === cities.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length
}
</script>
<style lang="scss" scoped>
.el-table .cell .el-icon {
    margin-left: 6px;
    vertical-align: -2px;
}

.text4Main {
    width: 100%;
    box-sizing: border-box;
    padding: 24px;
    display: flex;
    height: 100%;
    min-height: 900px;

    .left {
        min-width: 200px;
        margin-right: 24px;
    }

    .right {
        flex: 1;

        .headTitle {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }

        .headHint {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 0 20px;
            border: 1px solid #ddd;

            .item {
                width: 33.3%;
                line-height: 40px;
            }
        }
    }
}
</style>