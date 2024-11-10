<script setup>
import { reactive, ref, watch } from 'vue';
import { inventoryClassGetForPage } from '@/api/material';

const queryParams = reactive({
  PageIndex: 1,
  PageSize: 10
});
const showDialog = ref(false);
const listData = ref([]);
const total = ref(0);

watch(
  () => showDialog.value,
  () => {
    if (showDialog.value) {
      fetchList();
    }
  }
);

function fetchList() {
  let Conditions = '';
  inventoryClassGetForPage({
    PageIndex: queryParams.PageIndex,
    PageSize: queryParams.PageSize,
    Conditions
  }).then(res => {
    const { data, dataCount } = res.data;
    listData.value = data;
    total.value = dataCount;
  });
}

function handleSelectionChange(val) {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  fetchList();
}

function handlePagination(val) {}

defineExpose({
  showDialog
});
</script>

<template>
  <el-dialog v-model="showDialog" title="存货分类" width="80%">
    <el-table :data="listData" @selection-change="handleSelectionChange">
      <el-table-column type="selection" selectable width="55" />
      <el-table-column property="cInvClassName" label="存货分类" />
      <el-table-column property="cInvClassCode" label="存货分类编号" />
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
        <el-button type="primary" @click="showDialog = false"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
