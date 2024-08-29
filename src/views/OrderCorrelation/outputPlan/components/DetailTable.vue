<script setup>
import { defineComponent, h, ref } from 'vue';
import { NDataTable, zhCN, dateZhCN, NConfigProvider } from 'naive-ui';

const props = defineProps({
  tableColumns: {
    type: Array,
    default: () => []
  },
  tableData: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  selectedIds: Array
});

const emit = defineEmits(['handleSelectionChange']);

const tableColumns = ref([]);
const tableData = ref([]);
const selectedRowKeys = ref([]);

function handleCheck(rowKeys) {
  selectedRowKeys.value = rowKeys;
  emit(
    'handleSelectionChange',
    props.tableData.filter(row => rowKeys.includes(row.idx))
  );
}

function clearSelectedRowKeys() {
  selectedRowKeys.value = [];
}

defineExpose({ clearSelectedRowKeys });
</script>

<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="{
      common: {
        primaryColor: '#a7072b'
      },
      DataTable: {
        thPaddingSmall: '4px',
        tdPaddingSmall: '4px',
        fontSizeSmall: '12px',
        tdColorHover: '#fab6b6',
        thColor: '#a7072b',
        thTextColor: '#ffffff',
        loadingColor: '#a7072b'
      }
    }"
  >
    <n-data-table
      locale="zh-cn"
      :row-class-name="
        rowData => {
          return selectedRowKeys.includes(rowData.idx) ? 'selected' : '';
        }
      "
      :columns="
        [
          {
            type: 'selection',
            fixed: 'left',
            options: ['all', 'none']
          },
          {
            key: 'column-index',
            width: 50,
            title: '序号',
            align: 'center',
            fixed: 'left',
            render: (_, index) => `${index + 1}`
          }
        ].concat(props.tableColumns)
      "
      :data="props.tableData"
      :scroll-x="7000"
      max-height="calc(100vh - 470px)"
      size="small"
      virtual-scroll
      :bordered="false"
      :single-line="false"
      :scrollbar-props="{
        trigger: 'none',
        onScroll: e => {
          console.log(e);
        }
      }"
      :loading="props.loading"
      :row-key="rowData => rowData.idx"
      :row-props="
        rowData => {
          return {
            style: 'cursor: pointer;',
            onClick: e => {
              if (e.target.className === 'n-checkbox-box__border') {
                return;
              }
              if (selectedRowKeys.includes(rowData.idx)) {
                handleCheck(selectedRowKeys.filter(key => key !== rowData.idx));
              } else {
                handleCheck([...selectedRowKeys, rowData.idx]);
              }
            }
          };
        }
      "
      :checked-row-keys="selectedRowKeys"
      @update:checked-row-keys="handleCheck"
    />
  </n-config-provider>
</template>

<style lang="scss" scoped>
:deep(.selected) {
  td {
    background-color: #fab6b6 !important;
  }
}
</style>
