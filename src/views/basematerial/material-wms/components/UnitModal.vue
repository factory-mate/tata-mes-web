<script setup>
import { reactive, ref, watch } from 'vue';
import { unitGetForPage } from '@/api/material';

const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const showDialog = ref(false);
const listData = ref([]);
const total = ref(0);
const currentSelected = ref(null);

const emit = defineEmits(['confirm']);

watch(
  () => showDialog.value,
  () => {
    if (showDialog.value) {
      fetchList();
    }
  }
);

function fetchList() {
  unitGetForPage({
    PageIndex: queryParams.PageIndex,
    PageSize: queryParams.PageSize,
    Conditions: ''
  }).then(res => {
    const { data, dataCount } = res.data;
    listData.value = data;
    total.value = dataCount;
  });
}

function handleCurrentChange(val) {
  currentSelected.value = val;
}

function handlePagination(val) {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  fetchList();
}

function handleConfirm() {
  showDialog.value = false;
  emit('confirm', currentSelected.value);
}

defineExpose({
  showDialog
});
</script>

<template>
  <el-dialog v-model="showDialog" title="单位名称" width="80%">
    <el-table
      :data="listData"
      highlight-current-row
      border
      @current-change="handleCurrentChange"
    >
      <el-table-column property="cUnitCode" label="单位编号" />
      <el-table-column property="cUnitName" label="单位名称" />
    </el-table>
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.PageIndex"
      v-model:limit="queryParams.PageSize"
      @pagination="handlePagination"
      :page-sizes="[10, 20, 50]"
    />
    <template #footer>
      <div>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
