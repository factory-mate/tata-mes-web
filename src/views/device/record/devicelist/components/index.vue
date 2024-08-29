<template>
    <!-- 设备列表新增子页面 -->
    <div class="add-page">
        <el-card>
            <el-tabs type="border-card">
                <el-tab-pane label="基本信息">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline" label-width="110px">
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="原值">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="产值">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="拆旧">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="规格">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设备分类">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="资产编号">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="设备编码">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设备名称">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设备品牌">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="使用年限">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="维修SOP">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="保养SOP">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="状态管理">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="正常" value="shanghai" />
                                        <el-option label="停用" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="特种设备">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="设备来源">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!---------------------------------- 分割线--------------------------------- -->
                        <el-divider content-position="left">状态信息</el-divider>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="运行状态">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="存储位置">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="使用位置">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="使用部门">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="制单人">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="使用责任人">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="维修负责人">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="保养责任人">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="巡检责任人">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!------------------------------------------ 分割线------------------------------------ -->
                        <el-divider content-position="left">备注信息</el-divider>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="购入日期">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="出厂日期">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="制造商">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="出厂编号">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="使用截至日期">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="供应商">
                                    <el-input v-model="formInline.user" placeholder="请输入">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="入账日期">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="销账日期">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="描述">
                                    <el-input v-model="formInline.user" placeholder="请输入" />
                                </el-form-item>
                            </el-col>
                        </el-row>

                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="库存管理">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline"  label-width="125px">
                        <el-row :gutter="20" justify="center">
                            <el-col :span="6">
                                <el-form-item label="是否保质期管理">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="保质期">
                                    <el-input v-model="formInline.user" placeholder="请选择" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="保质期单位">
                                    <el-input v-model="formInline.user" placeholder="请选择">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否保质期管理">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="center">
                            <el-col :span="6">
                                <el-form-item label="默认仓库">
                                    <el-input v-model="formInline.user" placeholder="请选择默认仓库">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="默认货位">
                                    <el-input v-model="formInline.user" placeholder="请输入选择货位">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="主计量单位">
                                    <el-input v-model="formInline.user" placeholder="请输入主计量单位">
                                        <template #append>
                                            <el-icon @click="clickModel">
                                                <MoreFilled />
                                            </el-icon>
                                        </template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="辅计量单位">
                                    <el-input v-model="formInline.user" placeholder="请输入辅计量单位" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" justify="center">
                            <el-col :span="6">
                                <el-form-item label="换算率">
                                    <el-input v-model="formInline.user" placeholder="请输入换算率" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否备件管理">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否生产设备">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="是否再生件(刀具)">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                <el-form-item label="是否消耗品">
                                    <el-select v-model="formInline.region" placeholder="请选择">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="文件信息">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="300px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                    <el-button size="small" type="danger" :icon="Download" 
                                        @click="handleDelete(scope.$index, scope.row)">下载</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
                <el-tab-pane label="备品备件">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
                <el-tab-pane label="参数绑定">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
                <el-tab-pane label="巡检内容">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
                <el-tab-pane label="保养内容">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>  
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane> 
                <el-tab-pane label="维修信息">
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-row :gutter="20" justify="space-around">
                            <el-col :span="6">
                                <el-form-item label="维修开始日期">
                                    <el-select v-model="formInline.region" placeholder="请选择维修开始日期">
                                        <el-option label="正常" value="shanghai" />
                                        <el-option label="停用" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="维修截至日期">
                                    <el-select v-model="formInline.region" placeholder="请选择维修截至日期">
                                        <el-option label="是" value="shanghai" />
                                        <el-option label="否" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="单据类型">
                                    <el-select v-model="formInline.region" placeholder="请选择单据类型">
                                        <el-option label="Zone one" value="shanghai" />
                                        <el-option label="Zone two" value="beijing" />
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item style="float:right;">
                                    <el-button size="small" type="primary" @click="wxSearch"
                                        :icon="Search">查询</el-button>
                                    <el-button size="small" type="warning" @click="wxResect"
                                        :icon="Refresh">重置</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
                <el-tab-pane label="位置变更记录">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
                <el-tab-pane label="操作记录">
                    <MyTable v-if="tabType" :tableData="tableData" :tableColumns="tableColumns" :selection="true">
                        <template #handler>
                            <el-table-column label="操作" fixed="right" width="200px" align="center">
                                <template #header>
                                <span>操作</span>
                                <myPopup :list="tableColumns" @newList="newList"></myPopup>
                                </template>
                                <template #default="scope">
                                    <el-button size="small" type="success" :icon="Plus" 
                                        @click="handleAdd(scope.$index, scope.row)">新增</el-button>
                                    <el-button size="small" type="danger" :icon="Delete" 
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </template>
                    </MyTable>
                </el-tab-pane>
            </el-tabs>
            <div class="buttom-button">
                <el-button type="success" :icon="Select">保存</el-button>
                <router-link to="devicelist">
                    <el-button type="danger" :icon="CloseBold">返回</el-button>
                </router-link>
            </div>
        </el-card>
        <!-- 搜索弹框 -->
        <searchModel :dialogType="dialogType" :titleName="titleName" :tableSet="tableSet" :gridData="gridData"
            @ModelClose="ModelClose"></searchModel>
    </div>
</template>

<script lang="ts" setup>
import { Plus, Delete, Search, Refresh, Select, CloseBold, MoreFilled ,Download} from '@element-plus/icons-vue'
import { reactive, toRefs,nextTick,ref } from 'vue'
import myTable from '@/components/MyTable/index.vue'
import { ElLoading } from 'element-plus'
import searchModel from "@/components/MultiSelect/searchModel.vue"
import myPopup from '@/components/Popup/index.vue'
const formInline = reactive({
    user: '',
    region: '',
})

//组件弹窗
const data = reactive({
    dialogType: false,
    titleName: '标题',
    form: {
        name: '',
        date: null,
        optVal: '',
        project: ''
    },
    //弹窗数据
    tableSet: [
        {
            name: '名称一',
            key: 'name'
        },
        {
            name: '名称二',
            key: 'value'
        },
    ],
    options: [
        {
            value: '1',
            label: '是',
        },
        {
            value: '2',
            label: '否',
        }
    ],
    gridData: [
        {
            name: '111',
            value: '数据',
        },
        {
            name: '111',
            value: '数据',
        }
    ]
})
const { dialogType, titleName, tableSet, gridData } = toRefs(data)
const onSubmit = () => {
    console.log('submit!')
}

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
    checkType?:boolean
    slot?:number
}
const tableData: dataType[] = [
    {
        id: '001',
        name: '传感设备',
        date: '备注备注'
    },
    {
        id: '002',
        name: '传感设备',
        date: '备注备注'
    },
    {
        id: '003',
        name: '传感设备',
        date: '备注备注'
    }
]
const dataVal: columnType[] = [
    // 表格配置数据
    {checkType:true, label: '编码',slot:0, prop: 'id', },
    {checkType:true, label: '名称',slot:0, prop: 'name', },
    {checkType:true, label: '备注',slot:0, prop: 'date', },
    {checkType:true, label: '操作',slot:0, prop: 'name4', slotName: 'handler' }
]
const tableColumns=ref(dataVal)
const tabType=ref(true)
// 新增事件
const handleAdd = (index: any, row: any) => {
    console.log(index, row)
}
// 删除事件
const handleDelete = (index: any, row: any) => {
    console.log(index, row)
}

//弹窗组件事件
const clickModel = () => {
    dialogType.value = true
}
const ModelClose = (val: any) => {
    dialogType.value = val.type
}
//维修查询事件
const wxSearch = () => {
    console.log('维修');

}
//维修重置事件
const wxResect = () => {
    console.log('重置');
} 
// 排列表头
const newList=(val:any)=>{
    tabType.value=false
    nextTick(()=>{
        tableColumns.value=val.list
        tabType.value=true

    })
}
</script>

<style lang="scss" scoped>
.add-page {
    padding: 20px;

    .el-card {
        margin: 10px 0;
    }

    .add-header {
        display: flex;
        justify-content: space-between;
        font-size: 20px;
        margin: 20px;
    }

    .buttom-button {
        margin: 20px;
        text-align: center;

        .el-button {
            margin-right: 10px;
        }
    }
}
</style>