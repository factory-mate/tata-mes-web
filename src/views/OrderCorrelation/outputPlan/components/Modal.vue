<script setup>
import { ref, computed, watch, unref, h } from 'vue';
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElInput,
  ElLoading,
  ElCheckbox
} from 'element-plus';
import { DataApi, configApi } from '@/api/configApi/index';
import { compare } from '@/utils';

const props = defineProps({
  selectedData: {
    type: Array,
    default: () => []
  },
  selectedIds: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['refetchList']);

const show = ref(false);
const modelCode = ref('');

const btns = ref([]);
const heads = ref([]);

const submitLoading = ref(false);

const SelectionCell = ({ value, intermediate = false, onChange }) => {
  return h(ElCheckbox, { onChange, modelValue: value, intermediate });
};

const gdTableColumns = ref([
  // {
  //   key: 'selection',
  //   width: 50,
  //   cellRenderer: ({ rowData, rowIndex }) => {
  //     const onChange = value => {
  //       gdTableData.value.forEach(i => {
  //         i.checked = false;
  //       });
  //       rowData.checked = value;
  //       currentGd.value = { ...rowData, index: rowIndex };
  //       cxTableData.value =
  //         rowData.Child?.map(i => ({ ...i, checked: false })) ?? [];
  //     };
  //     return h(SelectionCell, {
  //       value: rowData.checked,
  //       onChange
  //     });
  //   },
  //   headerCellRenderer: () => {
  //     return h(SelectionCell, {
  //       value: false
  //     });
  //   }
  // },
  {
    key: 'cFactoryUnitCode',
    dataKey: 'cFactoryUnitCode',
    title: '工段编号',
    width: 300
  },
  {
    key: 'cFactoryUnitName',
    dataKey: 'cFactoryUnitName',
    title: '工段名称',
    width: 300
  }
]);
const cxTableColumns = ref([
  // {
  //   key: 'selection',
  //   width: 50,
  //   cellRenderer: ({ rowData, rowIndex }) => {
  //     const onChange = value => {
  //       cxTableData.value.forEach(i => {
  //         i.checked = false;
  //       });
  //       rowData.checked = value;
  //       currentCx.value = { ...rowData, index: rowIndex };
  //     };
  //     return h(SelectionCell, {
  //       value: rowData.checked,
  //       onChange
  //     });
  //   },
  //   headerCellRenderer: () => {
  //     return h(SelectionCell, {
  //       value: false
  //     });
  //   }
  // },
  {
    key: 'cFactoryUnitCode',
    dataKey: 'cFactoryUnitCode',
    title: '产线编码',
    width: 300
  },
  {
    key: 'cFactoryUnitName',
    dataKey: 'cFactoryUnitName',
    title: '产线名称',
    width: 300
  }
]);
const gdTableData = ref([]);
const cxTableData = ref([]);
const currentGd = ref({});
const currentCx = ref({});

watch(
  () => show.value,
  val => {
    if (!val) {
      return;
    }
    getConfig();
  }
);

const rowClass = ({ rowIndex }) => {
  if (rowIndex === currentGd.value.index) {
    return 'selected';
  }
  return '';
};

const rowClass1 = ({ rowIndex }) => {
  if (rowIndex === currentCx.value.index) {
    return 'selected';
  }
  return '';
};

const getConfig = async () => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const { data, success } = await configApi(modelCode.value);
  if (success) {
    let treeFetchResource = {};
    data.forEach(i => {
      const list = i.Parms.sort(compare('iIndex', true));
      switch (i.cPropertyClassTypeCode) {
        case 'Head':
          heads.value = list;
          break;
        case 'ToolBut':
          btns.value = list;
          break;
      }
    });
    treeFetchResource = heads.value[0].Resource;
    await getTreeData(treeFetchResource);
  }
  loading.close();
};

const getTreeData = async resource => {
  const data = {
    method: resource.cHttpTypeCode,
    url: resource.cServerIP + resource.cUrl
  };
  const { data: res, success } = await DataApi(data);
  if (success) {
    //cNodeTypeCode Line Section
    //树结构遍历出 cNodeTypeCode = Section 的节点 保存为数组，其 Child 为 Line 的，其他节点都不需要
    const sectionData = [];
    res.forEach(factoryItem => {
      factoryItem?.Child.forEach(workItem => {
        workItem?.Child.forEach(item => {
          if (item.cNodeTypeCode === 'Section') {
            sectionData.push({ ...item });
          }
        });
      });
    });
    gdTableData.value = sectionData;
    cxTableData.value = [];
    currentGd.value = {};
    currentCx.value = {};
    defaultSelectGd();
  }
};

const defaultSelectGd = () => {
  const gdIndex = gdTableData.value.findIndex(
    i => i.cFactoryUnitName === '门扇前工段'
  );
  if (gdIndex > -1) {
    currentGd.value = { ...gdTableData.value[gdIndex], index: gdIndex };
    cxTableData.value = currentGd.value.Child?.map(i => ({ ...i })) ?? [];
  }
};

const submitForm = async item => {
  switch (item.cAttributeCode) {
    case 'AdjustLineOK':
      handleSave(item);
      break;
  }
};

const handleSave = async item => {
  submitLoading.value = true;
  const data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      cFactoryUnitCode: currentCx.value.cFactoryUnitCode,
      cFactoryUnitName: currentCx.value.cFactoryUnitName,
      list_uid: props.selectedIds.map(i => i.S_S_S_uid)
    }
  };
  try {
    const { success } = await DataApi(data);
    if (success) {
      ElMessage.success('操作成功');
      emit('refetchList');
      closeModal();
    } else {
      ElMessage.error('操作失败');
    }
  } catch {
    //
  }
  submitLoading.value = false;
};

const resetForm = () => {
  closeModal();
};

const showModal = type => {
  show.value = true;
};

const closeModal = () => {
  show.value = false;
};

defineExpose({ showModal, closeModal, modelCode });
</script>

<template>
  <el-dialog
    v-model="show"
    title="调整产线"
    draggable
    width="90%"
    @closed="() => {}"
  >
    <el-row>
      <el-col :span="12">
        <div style="height: 500px">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2
                :columns="gdTableColumns"
                :data="gdTableData"
                :height="height"
                :width="width"
                :row-class="rowClass"
                :row-event-handlers="{
                  onClick: ({ rowData, rowIndex }) => {
                    currentGd = { ...rowData, index: rowIndex };
                    cxTableData = rowData.Child?.map(i => ({ ...i })) ?? [];
                  }
                }"
              />
            </template>
          </el-auto-resizer>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="height: 500px">
          <el-auto-resizer>
            <template #default="{ height, width }">
              <el-table-v2
                :columns="cxTableColumns"
                :data="cxTableData"
                :height="height"
                :width="width"
                :row-class="rowClass1"
                :row-event-handlers="{
                  onClick: ({ rowData, rowIndex }) => {
                    currentCx = { ...rowData, index: rowIndex };
                  }
                }"
              />
            </template>
          </el-auto-resizer>
        </div>
      </el-col>
      <el-col :span="24" style="text-align: center; margin-top: 20px">
        <el-button
          type="primary"
          @click="submitForm(btn)"
          v-for="btn in btns"
          :key="btn.UID"
          :disabled="submitLoading"
          :loading="submitLoading"
        >
          {{ btn.Resource.cAttributeName }}
        </el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<style scoped lang="scss">
:deep(.selected) {
  background-color: #b6ddf9;
}
</style>
