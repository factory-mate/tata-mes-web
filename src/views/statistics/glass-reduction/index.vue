<script setup>
import { ref, reactive, onActivated, onMounted } from 'vue';
import { getCurrentInstance } from '@vue/runtime-core';
import { useRoute, useRouter } from 'vue-router';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElLoading
} from 'element-plus';
import FilterArea from '@/components/Filter/index.vue';
import ButtonArea from '@/components/Button/index.vue';
import TableArea from '@/components/MyTable/index.vue';
import PopupArea from '@/components/Popup/index.vue';
import { configApi, DataApi, delApi, ExportApi } from '@/api/configApi/index';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import useStore from '@/store';
import dayjs from 'dayjs';

const { cache } = useStore();
const $bus = getCurrentInstance()?.appContext.config.globalProperties.mittBus;
const route = useRoute();
const router = useRouter();

const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const total = ref(0);
const orderBy = ref('');
const conditions = ref('');
const selectedIds = ref([]);

const filterRef = ref(null);
const filters = ref([]);
const toolButtons = ref([]);
const tableRef = ref(null);
const tableColumns = ref([]);
const tableButtons = ref([]);
const tableData = ref([]);
const tableQueryConfig = ref({});

const modalRef = ref(null);
const modalResource = ref(null);
const rowData = ref({});

// 获取数据
const getData = async () => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const { data, success } = await configApi(route.meta.ModelCode);
  if (success) {
    data.forEach(i => {
      const list = i.Parms.sort(compare('iIndex', true));
      let queryConfig;
      switch (i.cPropertyClassTypeCode) {
        case 'Filter':
          filters.value = list;
          break;
        case 'ToolBut':
          toolButtons.value = list;
          break;
        case 'Grid':
          tableColumns.value = list
            .filter(
              i => i.Resource.cAttributeTypeCode == 'property' && i.IsShow
            )
            .map(i => ({
              checkType: true,
              label: i.cShowName ?? i.Resource.cAttributeName,
              prop: i.Resource.cAttributeCode,
              headerSlot: true,
              slot: '',
              lock: false,
              filters: [],
              cControlTypeCode: i.cControlTypeCode,
              cIncludeModelCode: i.cIncludeModelCode,
              cHttpTypeCode: i.Resource.cHttpTypeCode,
              cServerIP: i.Resource.cServerIP,
              cUrl: i.Resource.cUrl,
              cAttributeCode: i.Resource.cAttributeCode,
              DefinedParm4: i.DefinedParm4
            }));
          tableButtons.value = list.filter(
            i => i.Resource.cAttributeTypeCode == 'method'
          );
          queryConfig = list.find(
            i => i.Resource.cAttributeTypeCode == 'binddata'
          );
          if (queryConfig) {
            tableQueryConfig.value = queryConfig;
          }
          break;
        default:
          break;
      }
    });
  }
  if (tableButtons.value.length > 0) {
    tableColumns.value.push({
      checkType: true,
      label: '操作',
      slotName: 'button'
    });
  }
  if (tableQueryConfig.value.Resource) {
    const today = dayjs(new Date()).format('YYYY-MM-DD');
    conditions.value = `dPlanDateStart = ${today}`;
    getTableData();
  }
};

// 表格数据
const getTableData = async () => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const params = {
    method: tableQueryConfig.value.Resource.cHttpTypeCode,
    url:
      tableQueryConfig.value.Resource.cServerIP +
      tableQueryConfig.value.Resource.cUrl +
      '?val=null',
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: orderBy.value,
      Conditions: conditions.value
    }
  };
  const { success, data: resData } = await DataApi(params);
  if (success) {
    const { data = [], dataCount } = resData;
    tableData.value = (data ?? []).map(i => ({
      ...i,
      IsValid: i.IsValid ? '是' : '否'
    }));
    total.value = dataCount;
    filterTable();
    tableRef.value.handleRemoveSelectionChange();
  }
  loading.close();
};

// 点击操作按钮
const handleClickTableButton = (scope, event) => {
  switch (event.cAttributeCode) {
    case 'View':
      handleView(scope, event);
      break;
    case 'Edit':
      handleEdit(scope, event);
      break;
    case 'Delete':
      handleDelete(scope, event);
      break;
    default:
      break;
  }
};

// 新增
const handleAdd = obj => {
  modalRef.value.showModal('add');
  modalResource.value = obj;
};

// 查看
const handleView = (scope, obj) => {
  modalRef.value.showModal('view');
  modalResource.value = obj;
  rowData.value = scope.row;
};

// 编辑
const handleEdit = (scope, obj) => {
  modalRef.value.showModal('edit');
  modalResource.value = obj;
  rowData.value = scope.row;
};

// 删除
const handleDelete = async (scope, obj) => {
  try {
    await ElMessageBox.confirm('是否删除该数据', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
  } catch {
    ElMessage.info('已取消删除');
    return;
  }
  const params = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [scope.row.UID]
  };

  try {
    const { success } = await delApi(params);
    if (success) {
      getTableData();
    }
  } catch (e) {
    //
  }
  ElMessage.success('删除成功');
};

// 多选
const handleSelectionChange = val => {
  selectedIds.value = val.map(i => i.UID);
};

// 分页
const handleChangePage = val => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  getTableData();
};

// 重置搜索
const resetSearchParams = () => {
  conditions.value = '';
  orderBy.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  getTableData();
  tableRef.value.clearFilter();
};

// 搜索
const handleSearch = val => {
  queryParams.PageIndex = 1;
  conditions.value = filterModel(val.value);
  getTableData();
};

// 过滤表格
const filterTable = () => {
  tableColumns.value.forEach(aItem => {
    const filData = [];
    tableData.value.forEach(bItem => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item, index, self) =>
          self.findIndex(t => t.text === item.text) === index
      );
    }
  });
};

// 排序
const sortTable = val => {
  orderBy.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  getTableData();
};

// 列表排序
const newList = val => {
  tableColumns.value = val.list;
  getTableData();
};

const exportAll = async obj => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  conditions.value = filterModel(filterRef.value.FilterData);
  const params = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 1,
      PageSize: 9999,
      OrderByFileds: orderBy.value,
      Conditions: conditions.value
    }
  };
  try {
    const { data, headers } = await ExportApi(params);
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const fileName =
      decodeURI(headers['content-disposition'] || '玻璃下料') + '.xlsx';
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    } else {
      navigator.msSaveBlob(blob, fileName);
    }
  } catch {
    ElMessage.error('请求失败');
  }
  loading.close();
};

const exportOne = async obj => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  conditions.value = filterModel(filterRef.value.FilterData);
  const params = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: orderBy.value,
      Conditions: conditions.value
    }
  };
  try {
    const { data, headers } = await ExportApi(params);
    const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
    const fileName =
      decodeURI(headers['content-disposition'] || '玻璃下料') + '.xlsx';
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a');
      elink.download = fileName;
      elink.style.display = 'none';
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href);
      document.body.removeChild(elink);
    } else {
      navigator.msSaveBlob(blob, fileName);
    }
  } catch {
    ElMessage.error('请求失败');
  }
  loading.close();
};

onMounted(() => getData());

onActivated(async () => {
  if (cache.isCurrentPageInvalid()) {
    if (route.name === 'GlassReduction') {
      await getData();
      cache.removeCurrentPageInvalid();
    }
  }
});

$bus.on('tableUpData', v => {
  if (v.name == 'YL-RecipeFiles') {
    getData();
  }
});
</script>

<template>
  <div class="container">
    <FilterArea
      ref="filterRef"
      :Filter="filters"
      @click-search="handleSearch"
      @reset-form="resetSearchParams"
    />
    <el-card>
      <ButtonArea
        :ToolBut="toolButtons"
        @click-add="handleAdd"
        @export-all="exportAll"
        @export-one="exportOne"
      />
      <TableArea
        ref="tableRef"
        :table-data="tableData"
        :table-columns="tableColumns"
        table-border
        selection
        @table-hear-data="sortTable"
        @handle-selection-change="handleSelectionChange"
      >
        <template #button>
          <el-table-column
            label="操作"
            fixed="right"
            width="200px"
            align="center"
          >
            <template #header>
              <span>操作</span>
              <PopupArea
                :list="tableColumns"
                @newList="newList"
                @renew="getData"
              />
            </template>
            <template #default="scope">
              <template
                v-for="(i, idx) in tableButtons"
                :key="i.Resource.cAttributeName"
              >
                <el-button
                  v-if="idx < (tableButtons.length > 3 ? 2 : 3)"
                  type="primary"
                  size="small"
                  @click="handleClickTableButton(scope, i)"
                >
                  {{ i.Resource.cAttributeName }}
                </el-button>
              </template>
              <el-dropdown
                style="margin-left: 10px"
                v-if="tableButtons.length > 3"
              >
                <el-button type="primary" size="small">
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                  <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in tableButtons.slice(2)"
                      :key="item.Resource.cAttributeName"
                    >
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleClickTableButton(scope, item)"
                      >
                        {{ item.Resource.cAttributeName }}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </TableArea>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="handleChangePage"
        :page-sizes="[20, 50, 100]"
      />
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
}
</style>
