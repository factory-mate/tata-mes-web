<script setup>
import { ref, reactive, onActivated, onMounted, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElLoading
} from 'element-plus';
import HeadArea from '@/components/ViewFormHeard/index.vue';
import ButtonArea from '@/components/Button/index.vue';
import TableArea from '@/components/myTable/index.vue';
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { compare } from '@/utils';
import useStore from '@/store';
import TableModal from './components/TableModal.vue';

const $bus = getCurrentInstance()?.appContext.config.globalProperties.mittBus;

const { cache, tagsView } = useStore();
const route = useRoute();
const router = useRouter();

const queryParams = reactive({
  PageIndex: 1,
  PageSize: 10
});
const total = ref(0);

const headRef = ref(null);
const heads = ref([]);
const toolButtons = ref([]);
const tableRef = ref(null);
const tableColumns = ref([]);
const tableData = ref([]);

const modalRef = ref(null);
const modalModelCode = ref('');
const modalResource = ref({});
const tableRowData = ref(null);
const currentDataIndex = ref(-1);

// 获取数据
const getData = async () => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const { data, success } = await configApi(route.meta.ModelCode);
  if (success) {
    data.forEach(i => {
      const list = i.Parms.sort(compare('iIndex', true));
      switch (i.cPropertyClassTypeCode) {
        case 'Head':
          heads.value = list;
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
          break;
        default:
          break;
      }
    });
  }
  tableColumns.value.push({
    checkType: true,
    label: '操作',
    slotName: 'button'
  });

  loading.close();
};

// 保存
const handleSave = async obj => {
  if (!tableData.value.length) {
    ElMessage.info('请添加数据');
    return;
  }

  try {
    await headRef.value.ruleFormRef.validate();
  } catch (e) {
    console.error(e);
    return;
  }

  const loading = ElLoading.service({ lock: true, text: '加载中.....' });

  const data = {
    method: obj.cHttpTypeCode,
    url: obj.cServerIP + obj.cUrl,
    data: {
      head: headRef.value.ruleForm,
      bodys: tableData.value
    }
  };

  try {
    await DataApi(data);
  } catch (e) {
    loading.close();
    console.error(e);
    return;
  }

  ElMessage.success('保存成功');
  loading.close();
  tagsView.delVisitedView(route);
  router.push({ name: 'YL-ProductionOrder' });
  $bus.emit('tableUpData', { name: 'YL-ProductionOrder' });
  cache.addInvalidPage(route.name);
};

const handleClickAddBtn = obj => {
  modalModelCode.value = obj.cIncludeModelCode;
  modalRef.value.showModal('add');
  tableRowData.value = null;
  currentDataIndex.value = -1;
};

// 查看
const handleView = scope => {
  modalRef.value.showModal('view');
  tableRowData.value = scope.row;
  currentDataIndex.value = scope.$index;
};

// 编辑
const handleEdit = scope => {
  modalRef.value.showModal('edit');
  tableRowData.value = scope.row;
  currentDataIndex.value = scope.$index;
};

// 删除
const handleDelete = async scope => {
  tableData.value = tableData.value.filter((_, idx) => idx !== scope.$index);
};

// 表格数据变化
const handleTableDataChange = event => {
  const { data, type } = event;
  const newData = { ...data };
  switch (type) {
    case 'add':
      tableData.value.unshift(newData);
      break;
    case 'edit':
      tableData.value[currentDataIndex.value] = newData;
      break;
  }
  modalRef.value.closeModal();
};

onMounted(() => getData());

onActivated(async () => {
  if (cache.isCurrentPageInvalid()) {
    await getData();
    tableData.value = [];
    headRef.value.ruleFormRef.resetFields();
    cache.removeCurrentPageInvalid();
  }
});
</script>

<template>
  <div class="container">
    <el-card>
      <ButtonArea
        :ToolBut="toolButtons"
        @save-edit="handleSave"
        @add-row="handleClickAddBtn"
      />
      <HeadArea ref="headRef" :Head="heads" />
      <TableArea
        ref="tableRef"
        :table-data="tableData"
        :table-columns="tableColumns"
        table-border
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
            </template>
            <template #default="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope)">
                编辑
              </el-button>
              <el-button
                type="primary"
                size="small"
                @click="handleDelete(scope)"
              >
                删除
              </el-button>
              <el-button type="primary" size="small" @click="handleView(scope)">
                详情
              </el-button>
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
      />
    </el-card>
    <TableModal
      ref="modalRef"
      :model-code="modalModelCode"
      :modal-resource="modalResource"
      @submit="handleTableDataChange"
    />
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
