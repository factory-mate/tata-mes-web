<template>
    <div class="box">
        <div class="content">
            <!-- tab标签页 -->
            <div>
                <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="身份视图" name="first">
                        <div class="app-container">
                            <div :class="[showSearch ? 'showSearch top' : 'top']">
                                <div class="tabbar" @click="() => { showSearch = !showSearch }">
                                    <el-icon v-show="showSearch">
                                        <ArrowDown />
                                    </el-icon>
                                    <el-icon v-show="!showSearch">
                                        <ArrowUp />
                                    </el-icon>
                                </div>
                                <div class="search">
                                    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" :icon="Search" @click="handleQuery"
                                                style="">搜索</el-button>
                                            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字" style="margin-top: 20px;">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字" style="margin-top: 20px;">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>


                            <el-card>
                                <template #header>
                                    <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
                                    <el-button type="danger" :icon="Delete" :disabled="ids.length === 0"
                                        @click="handleDelete">删除</el-button>
                                </template>

                                <el-table ref="dataTableRef" v-loading="loading" :data="roleList"
                                    @selection-change="handleSelectionChange" @row-click="handleRowClick"
                                    highlight-current-row border>
                                    <el-table-column type="selection" width="55" align="center" />
                                    <el-table-column label="角色名称" prop="name" min-width="150" />
                                    <el-table-column label="角色编码" prop="code" width="150" />

                                    <el-table-column label="状态" align="center" width="150">
                                        <template #default="scope">
                                            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                                            <el-tag v-else type="info">禁用</el-tag>
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="排序" align="center" width="100" prop="sort" />
                                    <el-table-column prop="createTime" label="创建时间" width="160" />
                                    <el-table-column prop="updateTime" label="修改时间" width="160" />

                                    <el-table-column label="操作" w align="left">
                                        <template #default="scope">

                                            <el-button type="primary" plain round size="small" :icon="Edit"
                                                @click.stop="handleUpdate(scope.row)">
                                                编辑
                                            </el-button>
                                            <el-button type="danger" plain round size="small" :icon="Delete"
                                                @click.stop="handleDelete(scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <!-- pagination -->
                                <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
                                    v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
                            </el-card>

                            <!-- dialog -->
                            <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" destroy-on-close>
                                <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                                    <el-form-item label="角色名称" prop="name">
                                        <el-input v-model="formData.name" placeholder="请输入角色名称" />
                                    </el-form-item>

                                    <el-form-item label="角色编码" prop="code">
                                        <el-input v-model="formData.code" placeholder="请输入角色编码" />
                                    </el-form-item>

                                    <el-form-item label="数据权限" prop="dataScope">
                                        <el-select v-model="formData.dataScope">
                                            <el-option :key="0" label="全部数据" :value="0" />
                                            <el-option :key="1" label="部门及子部门数据" :value="1" />
                                            <el-option :key="2" label="本部门数据" :value="2" />
                                            <el-option :key="3" label="本人数据" :value="3" />
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="状态" prop="status">
                                        <el-radio-group v-model="formData.status">
                                            <el-radio :label="1">正常</el-radio>
                                            <el-radio :label="0">停用</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="排序" prop="sort">
                                        <el-input-number v-model="formData.sort" controls-position="right" :min="0"
                                            style="width: 100px" />
                                    </el-form-item>
                                </el-form>

                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button type="primary" @click="submitFormData">确 定</el-button>
                                        <el-button @click="closeDialog">取 消</el-button>
                                    </div>
                                </template>
                            </el-dialog>

                            <!-- assign permission dialog -->
                            <el-dialog :title="'【' + checkedRole.name + '】资源分配'" v-model="menuDialogVisible"
                                width="800px">
                                <el-scrollbar max-height="600px" v-loading="loading">
                                    <el-tree ref="resourceRef" node-key="value" show-checkbox :data="resourceOptions"
                                        :default-expand-all="true">
                                        <template #default="{ data }">
                                            {{ data.label }}
                                        </template>
                                    </el-tree>
                                </el-scrollbar>

                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button type="primary" @click="handleRoleResourceSubmit">确 定</el-button>
                                        <el-button @click="closeMenuDialogVisible">取 消</el-button>
                                    </div>
                                </template>
                            </el-dialog>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="用户视图" name="second">
                        <div class="app-container">
                            <div :class="[showSearch ? 'showSearch top' : 'top']">
                                <div class="tabbar" @click="() => { showSearch = !showSearch }">
                                    <el-icon v-show="showSearch">
                                        <ArrowDown />
                                    </el-icon>
                                    <el-icon v-show="!showSearch">
                                        <ArrowUp />
                                    </el-icon>
                                </div>
                                <div class="search">
                                    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" :icon="Search" @click="handleQuery"
                                                style="">搜索</el-button>
                                            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字" style="margin-top: 20px;">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字" style="margin-top: 20px;">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>


                            <el-card>
                                <template #header>
                                    <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
                                    <el-button type="danger" :icon="Delete" :disabled="ids.length === 0"
                                        @click="handleDelete">删除</el-button>
                                </template>

                                <el-table ref="dataTableRef" v-loading="loading" :data="roleList"
                                    @selection-change="handleSelectionChange" @row-click="handleRowClick"
                                    highlight-current-row border>
                                    <el-table-column type="selection" width="55" align="center" />
                                    <el-table-column label="角色名称" prop="name" min-width="150" />
                                    <el-table-column label="角色编码" prop="code" width="150" />

                                    <el-table-column label="状态" align="center" width="150">
                                        <template #default="scope">
                                            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                                            <el-tag v-else type="info">禁用</el-tag>
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="排序" align="center" width="100" prop="sort" />
                                    <el-table-column prop="createTime" label="创建时间" width="160" />
                                    <el-table-column prop="updateTime" label="修改时间" width="160" />

                                    <el-table-column label="操作" w align="left">
                                        <template #default="scope">

                                            <el-button type="primary" plain round size="small" :icon="Edit"
                                                @click.stop="handleUpdate(scope.row)">
                                                编辑
                                            </el-button>
                                            <el-button type="danger" plain round size="small" :icon="Delete"
                                                @click.stop="handleDelete(scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <!-- pagination -->
                                <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
                                    v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
                            </el-card>

                            <!-- dialog -->
                            <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" destroy-on-close>
                                <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                                    <el-form-item label="角色名称" prop="name">
                                        <el-input v-model="formData.name" placeholder="请输入角色名称" />
                                    </el-form-item>

                                    <el-form-item label="角色编码" prop="code">
                                        <el-input v-model="formData.code" placeholder="请输入角色编码" />
                                    </el-form-item>

                                    <el-form-item label="数据权限" prop="dataScope">
                                        <el-select v-model="formData.dataScope">
                                            <el-option :key="0" label="全部数据" :value="0" />
                                            <el-option :key="1" label="部门及子部门数据" :value="1" />
                                            <el-option :key="2" label="本部门数据" :value="2" />
                                            <el-option :key="3" label="本人数据" :value="3" />
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="状态" prop="status">
                                        <el-radio-group v-model="formData.status">
                                            <el-radio :label="1">正常</el-radio>
                                            <el-radio :label="0">停用</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="排序" prop="sort">
                                        <el-input-number v-model="formData.sort" controls-position="right" :min="0"
                                            style="width: 100px" />
                                    </el-form-item>
                                </el-form>

                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button type="primary" @click="submitFormData">确 定</el-button>
                                        <el-button @click="closeDialog">取 消</el-button>
                                    </div>
                                </template>
                            </el-dialog>

                            <!-- assign permission dialog -->
                            <el-dialog :title="'【' + checkedRole.name + '】资源分配'" v-model="menuDialogVisible"
                                width="800px">
                                <el-scrollbar max-height="600px" v-loading="loading">
                                    <el-tree ref="resourceRef" node-key="value" show-checkbox :data="resourceOptions"
                                        :default-expand-all="true">
                                        <template #default="{ data }">
                                            {{ data.label }}
                                        </template>
                                    </el-tree>
                                </el-scrollbar>

                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button type="primary" @click="handleRoleResourceSubmit">确 定</el-button>
                                        <el-button @click="closeMenuDialogVisible">取 消</el-button>
                                    </div>
                                </template>
                            </el-dialog>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="已移除用户" name="third">
                        <div class="app-container">
                            <div :class="[showSearch ? 'showSearch top' : 'top']">
                                <div class="tabbar" @click="() => { showSearch = !showSearch }">
                                    <el-icon v-show="showSearch">
                                        <ArrowDown />
                                    </el-icon>
                                    <el-icon v-show="!showSearch">
                                        <ArrowUp />
                                    </el-icon>
                                </div>
                                <div class="search">
                                    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" :icon="Search" @click="handleQuery"
                                                style="">搜索</el-button>
                                            <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字" style="margin-top: 20px;">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                        <el-form-item prop="name" label="关键字" style="margin-top: 20px;">
                                            <el-input v-model="queryParams.keywords" placeholder="角色名称" clearable
                                                @keyup.enter="handleQuery" style="width: 300px;" />
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div>


                            <el-card>
                                <template #header>
                                    <el-button type="success" :icon="Plus" @click="handleAdd">新增</el-button>
                                    <el-button type="danger" :icon="Delete" :disabled="ids.length === 0"
                                        @click="handleDelete">删除</el-button>
                                </template>

                                <el-table ref="dataTableRef" v-loading="loading" :data="roleList"
                                    @selection-change="handleSelectionChange" @row-click="handleRowClick"
                                    highlight-current-row border>
                                    <el-table-column type="selection" width="55" align="center" />
                                    <el-table-column label="角色名称" prop="name" min-width="150" />
                                    <el-table-column label="角色编码" prop="code" width="150" />

                                    <el-table-column label="状态" align="center" width="150">
                                        <template #default="scope">
                                            <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                                            <el-tag v-else type="info">禁用</el-tag>
                                        </template>
                                    </el-table-column>

                                    <el-table-column label="排序" align="center" width="100" prop="sort" />
                                    <el-table-column prop="createTime" label="创建时间" width="160" />
                                    <el-table-column prop="updateTime" label="修改时间" width="160" />

                                    <el-table-column label="操作" w align="left">
                                        <template #default="scope">

                                            <el-button type="primary" plain round size="small" :icon="Edit"
                                                @click.stop="handleUpdate(scope.row)">
                                                编辑
                                            </el-button>
                                            <el-button type="danger" plain round size="small" :icon="Delete"
                                                @click.stop="handleDelete(scope.row)">
                                                删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>

                                <!-- pagination -->
                                <pagination v-if="total > 0" :total="total" v-model:page="queryParams.pageNum"
                                    v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
                            </el-card>

                            <!-- dialog -->
                            <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" destroy-on-close>
                                <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
                                    <el-form-item label="角色名称" prop="name">
                                        <el-input v-model="formData.name" placeholder="请输入角色名称" />
                                    </el-form-item>

                                    <el-form-item label="角色编码" prop="code">
                                        <el-input v-model="formData.code" placeholder="请输入角色编码" />
                                    </el-form-item>

                                    <el-form-item label="数据权限" prop="dataScope">
                                        <el-select v-model="formData.dataScope">
                                            <el-option :key="0" label="全部数据" :value="0" />
                                            <el-option :key="1" label="部门及子部门数据" :value="1" />
                                            <el-option :key="2" label="本部门数据" :value="2" />
                                            <el-option :key="3" label="本人数据" :value="3" />
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="状态" prop="status">
                                        <el-radio-group v-model="formData.status">
                                            <el-radio :label="1">正常</el-radio>
                                            <el-radio :label="0">停用</el-radio>
                                        </el-radio-group>
                                    </el-form-item>

                                    <el-form-item label="排序" prop="sort">
                                        <el-input-number v-model="formData.sort" controls-position="right" :min="0"
                                            style="width: 100px" />
                                    </el-form-item>
                                </el-form>

                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button type="primary" @click="submitFormData">确 定</el-button>
                                        <el-button @click="closeDialog">取 消</el-button>
                                    </div>
                                </template>
                            </el-dialog>

                            <!-- assign permission dialog -->
                            <el-dialog :title="'【' + checkedRole.name + '】资源分配'" v-model="menuDialogVisible"
                                width="800px">
                                <el-scrollbar max-height="600px" v-loading="loading">
                                    <el-tree ref="resourceRef" node-key="value" show-checkbox :data="resourceOptions"
                                        :default-expand-all="true">
                                        <template #default="{ data }">
                                            {{ data.label }}
                                        </template>
                                    </el-tree>
                                </el-scrollbar>

                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button type="primary" @click="handleRoleResourceSubmit">确 定</el-button>
                                        <el-button @click="closeMenuDialogVisible">取 消</el-button>
                                    </div>
                                </template>
                            </el-dialog>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <!-- 表格 -->

        </div>


    </div>
</template>

<script lang="ts" setup>

// 标签页
import { onMounted, reactive, computed, ref, toRefs } from 'vue'
import type { TabsPaneContext, ElTable } from 'element-plus'
import { listResources } from '@/api/menu';
import { ElForm, ElMessage, ElMessageBox, ElTree } from 'element-plus';
import { Search, Plus, Refresh, Delete, ArrowDown, ArrowUp, Edit } from '@element-plus/icons-vue';
import { Role, RoleForm, RoleQuery } from '@/api/role/types';
import {
    listRolePages,
    updateRole,
    getRoleFormDetail,
    addRole,
    deleteRoles,
    getRoleMenuIds,
    updateRoleMenus
} from '@/api/role';


const emit = defineEmits(['roleClick']);
const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const resourceRef = ref(ElTree);
const showSearch = ref(false)


const dialogFormVisible = ref('')

const state = reactive({
    loading: true,
    // 选中ID
    ids: [] as number[],
    queryParams: {
        pageNum: 1,
        pageSize: 10
    } as RoleQuery,
    roleList: [{
        id: '1',
        name: '系统管理员',
        code: 'ASDJ',
        sort: 1,
        status: 1,
        deleted: 1,
    },
    {
        id: '2',
        name: '测试',
        code: 'ADMIN',
        sort: 2,
        status: 1,
        deleted: 1,
    },
    {
        id: '1',
        name: '访问游客',
        code: 'KDJRKL',
        sort: 3,
        status: 1,
        deleted: 1,
    },
    {
        id: '1',
        name: '开发',
        code: 'NWEHBC',
        sort: 4,
        status: 1,
        deleted: 1,
    }
    ] as Role[],
    total: 0,
    dialog: {
        title: '',
        visible: false
    } as DialogType,
    formData: {} as RoleForm,
    rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        dataScope: [{ required: true, message: '请选择数据权限', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
    },
    menuDialogVisible: false,
    resourceOptions: [] as OptionType[],
    btnPerms: {} as any,
    // 勾选的菜单ID
    checkedMenuIds: new Set([]),
    allPermIds: [] as string[],
    // 选中的角色
    checkedRole: {
        id: '',
        name: ''
    }
});

const {
    ids,
    loading,
    queryParams,
    roleList,
    total,
    dialog,
    formData,
    rules,
    menuDialogVisible,
    checkedRole,
    resourceOptions
} = toRefs(state);

/**
 * 查询
 */
function handleQuery() {
    // emit('roleClick', {});
    state.loading = false;
    // listRolePages(state.queryParams).then(({ data }) => {
    //     state.roleList = data.list;
    //     state.total = data.total;
    //     state.loading = false;
    //     console.log(data.list);

    // });
}


/**
 * 重置查询
 */
function resetQuery() {
    queryFormRef.value.resetFields();
    // handleQuery();
}

function handleSelectionChange(selection: any) {
    state.ids = selection.map((item: any) => item.id);
}

function handleRowClick(row: any) {
    emit('roleClick', row);
}

function handleAdd() {
    dialog.value = {
        title: '添加角色',
        visible: true
    };
}

function handleUpdate(row: any) {

    console.log(111111111);

    dialog.value = {
        title: '修改角色',
        visible: true
    };
    const roleId = row.id || state.ids;
    getRoleFormDetail(roleId).then(({ data }) => {
        state.formData = data;
    });
}

function submitFormData() {
    loading.value = false;
    state.roleList.push(state.formData)
    dialog.value.visible = false;
    // closeDialog();
    // dataFormRef.value.validate((valid: any) => {
    //     if (valid) {
    //         if (state.formData.id) {
    //             updateRole(state.formData.id as any, state.formData).then(() => {
    //                 // ElMessage.success('修改角色成功');

    //                 // handleQuery();
    //                 loading.value = false;
    //             });
    //         } else {
    //             addRole(state.formData).then(() => {
    //                 closeDialog();
    //                 // ElMessage.success('新增角色成功');
    //                 // handleQuery();
    //                 loading.value = false;
    //             });
    //         }
    //     }
    // });
}

/**
 * 取消
 */
function closeDialog() {
    dialog.value.visible = false;
    dataFormRef.value.resetFields();
    dataFormRef.value.clearValidate();
}

/**
 *  删除
 */
function handleDelete(row: any) {
    console.log(row);

    const ids = [row.id || state.ids].join(',');
    ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            // deleteRoles(ids).then(() => {
            //     ElMessage.success('删除成功');
            //     // handleQuery();
            // });
            // state.roleList.splice()
        })
        .catch(() => ElMessage.info('已取消删除'));
}

/**
 * 资源分配
 */
function showRoleMenuDialog(row: Role) {
    menuDialogVisible.value = true;
    loading.value = false;

    const roleId: any = row.id;
    checkedRole.value = {
        id: roleId,
        name: row.name
    };

    // 获取所有的资源
    listResources().then(response => {
        resourceOptions.value = response.data;
        // 角色拥有的资源
        getRoleMenuIds(roleId).then(({ data }) => {
            // 勾选回显
            const checkedMenuIds = data;
            checkedMenuIds.forEach(menuId =>
                resourceRef.value.setChecked(menuId, true)
            );

            loading.value = false;
        });
    });
}
/**
 * 分配资源提交
 */
function handleRoleResourceSubmit() {
    const checkedMenuIds: number[] = resourceRef.value
        .getCheckedNodes(false, true)
        .map((node: any) => node.value);

    updateRoleMenus(checkedRole.value.id, checkedMenuIds).then(res => {
        ElMessage.success('分配权限成功');
        menuDialogVisible.value = false;
        // handleQuery();
    });
}

/**
 * 关闭资源弹窗
 */
function closeMenuDialogVisible() {
    menuDialogVisible.value = false;
}

onMounted(() => {
    // handleQuery();



    state.loading = false

});



// tabs标签页
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}


</script>

<style lang="scss" scoped>
.box {
    background-color: #dee5ee;

    .content {
        width: 100%;
        background-color: white;
    }
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}
.top {
    width: 100%;
    height: 80px;
    position: relative;
    box-sizing: border-box;
    transition: all 0.5s;
    overflow: hidden;
    border: 1px solid #e4e7ed;
    // padding: 10px 0;
    margin-bottom: 10px;
}

.tabbar {
    width: 20px;
    height: 16px;
    position: absolute;
    text-align: center;
    left: 50%;
    bottom: 0px;
    cursor: pointer;
    transform: translateX(-10px);
    border: 1px solid #e4e7ed;
    background-color: #FFFFFF;
    z-index: 999;
}

.showSearch {
    height: auto;
}
</style>
<style scoped>
.box >>> .el-card__header{
    text-align:right;
}

</style>