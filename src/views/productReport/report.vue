<template>
    <!-- 生产汇报页面 -->
    <div class="report">
        <div class="report-header">
            <el-card>
                <el-tabs type="border-card" class="demo-tabs">
                    <!-------------------- 设置---------------->
                    <el-tab-pane>
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon>
                                    <Setting />
                                </el-icon>
                                <span>设置</span>
                            </span>
                        </template>
                        <div class="report-middle">
                            <el-button @click="handlerAdd">选择任务池</el-button>
                            <el-button @click="RefreshThing">上岗</el-button>
                            <el-button @click="handlerAdd">打印设置</el-button>
                            <el-button @click="handlerAdd">离职</el-button>
                        </div>
                        <div class="el-tabble">
                            <el-tabs type="border-card">
                                <el-tab-pane label="任务信息">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                                <el-tab-pane label="人员信息">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="report-middle">
                            <el-button @click="handlerAdd">辅助工具</el-button>
                            <el-button @click="RefreshThing">接受物料</el-button>
                            <el-button @click="handlerAdd">拒收物料</el-button>
                            <el-button @click="handlerAdd">首检</el-button>
                        </div>
                        <div class="el-tabble">
                            <el-tabs type="border-card">
                                <el-tab-pane label="接受物料信息">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                                <el-tab-pane label="辅助工具信息">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                            </el-tabs>
                        </div>

                        <!------------------------------------------写到这了------------------------------------------------>
                        <div>
                            <el-dropdown split-button type="primary" style="margin-left: 10px;">
                                产品工艺图纸
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
                            <el-dropdown split-button type="primary" style="margin-left: 10px;">
                                过程标准指导
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
                            <el-dropdown split-button type="primary" style="margin-left: 10px;">
                                控制计划指导
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
                            <el-dropdown split-button type="primary" style="margin-left: 10px;">
                                异常控制指导
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
                    </el-tab-pane>
                    <!-------------------- 汇报---------------->
                    <el-tab-pane>
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon>
                                    <Avatar />
                                </el-icon>
                                <span>汇报</span>
                            </span>
                        </template>
                        <!-- 按钮 -->
                        <div class="report-middle">
                            <el-button @click="handlerAdd">汇报方式</el-button>
                            <el-button @click="RefreshThing">显示列表</el-button>
                            <el-input v-model="input" style="width: 200px;margin: 0 10px;" placeholder="全局搜索所有列表字段值">
                                <template #prefix>
                                    <el-icon class="el-input__icon">
                                        <search />
                                    </el-icon>
                                </template>
                            </el-input>
                        </div>
                        <div class="el-tabble">
                            <el-tabs type="border-card">
                                <el-tab-pane label="待生产">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                                <el-tab-pane label="异常">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                                <el-tab-pane label="其他">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                                <el-tab-pane label="已完工">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-tab-pane>
                    <!-------------------- 物料---------------->
                    <el-tab-pane>
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon>
                                    <Files />
                                </el-icon>
                                <span>物料</span>
                            </span>
                        </template>
                        <el-divider content-position="left">投料</el-divider>
                        <el-form :inline="true" :model="form" label-width="160px" :rules="rules" class="formMain">
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="8">
                                    <el-form-item label="开工码：">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="扫描物料条码：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="物料代码：" prop="name">
                                        <el-input v-model="form.name" placeholder="请输入" :suffix-icon="Search" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="8">
                                    <el-form-item label="物料名称：" prop="name">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="批次号：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="数量：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-divider content-position="left">物料信息</el-divider>
                        <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true"
                            :selection="true" @handledbClick="dbThing">
                            <template #handler>
                                <el-table-column label="操作" fixed="right" width="200px" align="center">
                                    <template #header>
                                        <span>操作</span>
                                        <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                    </template>
                                    <template #default="scope">
                                        <el-button size="small" :icon="Edit"
                                            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                        <el-button size="small" :icon="Delete"
                                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </template>
                        </MyTable>
                        <el-divider content-position="left">物料基本信息</el-divider>
                        <el-form :inline="true" :model="form" label-width="160px" :rules="rules" class="formMain">
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="6">
                                    <el-form-item label="物料代码：">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="物料名称：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="任务单号：" prop="name">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="产品名称：" prop="name">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-divider content-position="left">加工参数信息</el-divider>
                        <el-form :inline="true" :model="form" label-width="160px" :rules="rules" class="formMain">
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="6">
                                    <el-form-item label="长度：">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="宽度：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="厚度：" prop="name">
                                        <el-select v-model="form.name" placeholder="请输入">
                                            <el-option label="Zone one" value="shanghai" />
                                            <el-option label="Zone two" value="beijing" />
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="面积：" prop="name">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="6">
                                    <el-form-item label="体积：" prop="name">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="开门方向：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="雕刻：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                    <el-form-item label="锁向：">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-divider content-position="left">库存调整信息</el-divider>
                        <el-form :inline="true" :model="form" label-width="160px" :rules="rules" class="formMain">
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="10">
                                    <el-form-item label="调整前数量：">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="调整后数量：" prop="name">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-divider content-position="left">消耗调整信息</el-divider>
                        <el-form :inline="true" :model="form" label-width="160px" :rules="rules" class="formMain">
                            <el-row :gutter="20" justify="space-around">
                                <el-col :span="10">
                                    <el-form-item label="调整前数量：">
                                        <el-input v-model="form.id" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                                <el-col :span="10">
                                    <el-form-item label="调整后数量：">
                                        <el-input v-model="form.name" placeholder="请输入" />
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <!-------------------- 质量---------------->
                    <el-tab-pane>
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon>
                                    <Finished />
                                </el-icon>
                                <span>质量</span>
                            </span>
                        </template>
                        <div class="report-middle">
                            <el-button @click="handlerAdd">首检</el-button>
                            <el-button @click="RefreshThing">终检</el-button>
                        </div>
                        <div class="el-tabble">
                            <el-tabs type="border-card">
                                <el-tab-pane label="首检记录">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                                <el-tab-pane label="终检记录">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                        <div class="report-middle">
                            <el-button @click="handlerAdd">过程不良采集</el-button>
                        </div>
                        <div class="el-tabble">
                            <el-tabs type="border-card">
                                <el-tab-pane label="不良记录">
                                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns"
                                        :tableBorder="true" :selection="true" @handledbClick="dbThing">
                                        <template #handler>
                                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                                <template #header>
                                                    <span>操作</span>
                                                    <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                                </template>
                                                <template #default="scope">
                                                    <el-button size="small" :icon="Edit"
                                                        @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                                    <el-button size="small" :icon="Delete"
                                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
                                            </el-table-column>
                                        </template>
                                    </MyTable>
                                </el-tab-pane>
                            </el-tabs>
                        </div>

                    </el-tab-pane>
                    <!-------------------- 安灯---------------->
                    <el-tab-pane>
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon>
                                    <MagicStick />
                                </el-icon>
                                <span>安灯</span>
                            </span>
                        </template>
                        安灯
                    </el-tab-pane>
                    <!-------------------- 交接---------------->
                    <el-tab-pane>
                        <template #label>
                            <span class="custom-tabs-label">
                                <el-icon>
                                    <Connection />
                                </el-icon>
                                <span>交接</span>
                            </span>
                        </template>
                        交接
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>


import { reactive, ref, nextTick } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Files, Finished, MagicStick, Connection, Setting, Avatar, Edit, Delete, Search } from '@element-plus/icons-vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import myPopup from '@/components/Popup/index.vue'
//汇报模块搜索值
const input = ref()
//分页器
const formRef = ref<FormInstance>()
const total = ref(10)
const queryParams = ref({
    pageNum: 1,
    pageSize: 2
})

const list = [
    { id: 1, name: '姓名' },
    { id: 2, name: '身份' },
    { id: 3, name: '情况' },

]

const handleSizeChange = (val: number) => {
    console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
    console.log(`current page: ${val}`)
}
//弹出框
const dialogFormVisible = ref(false)
// const EditFormVisible = ref(false)
const formLabelWidth = '140px'
const form = reactive({
    id: '',
    name: '',
})
//表单绑定数据
const formInline = reactive({
    user: '',
    region: '',
})
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
})
//表格数据
interface dataType {
    id?: string
    date?: string
    name?: string
    name3?: string
    address?: string
}
interface columnType {
    label: string,
    prop: string,
    width?: string,
    headerSlot?: boolean
    slotName?: string
    sortable?: boolean
    minwidth?: string
    checkType?: boolean
    slot?: number
}
const tableData: dataType[] = [
    {
        id: '001',
        name: '币种1号',
        date: '备注备注'
    },
    {
        id: '002',
        name: '币种1号',
        date: '备注备注'
    },
    {
        id: '003',
        name: '币种1号',
        date: '备注备注'
    }
]
const dataVal: columnType[] = [
    // 表格配置数据
    { checkType: true, label: '币种', prop: 'id', headerSlot: true, slot: 0, },
    { checkType: true, label: '币种简称', slot: 0, prop: 'name', },
    { checkType: true, label: '币种符号', slot: 0, prop: 'date', },
    { checkType: true, label: '单价精度', slot: 0, prop: 'name', },
    { checkType: true, label: '单价舍入规则', slot: 0, prop: 'date', },
    { checkType: true, label: '金额精度', slot: 0, prop: 'name', },
    { checkType: true, label: '金额舍入规则', slot: 0, prop: 'date', },
    { checkType: true, label: '状态', slot: 0, prop: 'date', },
    { checkType: true, label: '操作', slot: 0, prop: 'name4', slotName: 'handler' }
]
const tableColumns = ref(dataVal)
const tabType = ref(true)
//新增事件
const handlerAdd = () => {
    dialogFormVisible.value = true
}
// 编辑事件
const handleEdit = (index: any, row: any) => {
    console.log(index, row)
    dialogFormVisible.value = true
}
// 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}

//刷新事件
const RefreshThing = () => {
    console.log('刷新')
}
//导出当前页
const handleExport = () => {
    console.log('导出当前页')
}
//导出所有页
const handleExportAll = () => {
    console.log('导出所有页');
}

//表格双击事件，弹窗弹出
const dbThing = () => {
    dialogFormVisible.value = true
}

//搜索
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    console.log('submit!')
}
//重置
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
//弹框标题计算
// const changeTitle = computed(() => {
//     return form.id ? '编辑' : '新增'
// })
// 排列表头
const newList = (val: any) => {
    tabType.value = false
    nextTick(() => {
        tableColumns.value = val.list
        tabType.value = true

    })
}
</script>

<style lang="scss" scoped>
.report {
    padding: 20px;

    .report-header {
        margin: 10px 0;
    }

    .report-middle {
        // float: right;
        margin: 20px 0;
    }

    .pagin-card {
        margin-top: 10px;
    }
}
</style>