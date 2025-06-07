<script setup>
import { reactive, ref, watch } from 'vue';
import { getMaterialForPage } from '@/api/material';

const searchParams = ref({
  cDictonaryCode: '',
  cDictonaryName: ''
});
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
  let Conditions = [];
  if (searchParams.value.cDictonaryCode) {
    Conditions.push({
      Field: 'cDictonaryCode',
      Operator: 'like',
      Value: searchParams.value.cDictonaryCode
    });
  }
  if (searchParams.value.cDictonaryName) {
    Conditions.push({
      Field: 'cDictonaryName',
      Operator: 'like',
      Value: searchParams.value.cDictonaryName
    });
  }
  getMaterialForPage({
    PageIndex: queryParams.PageIndex,
    PageSize: queryParams.PageSize,
    Conditions: Conditions.map(i => `${i.Field} ${i.Operator} ${i.Value}`).join(
      ' && '
    )
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

function handleReset() {
  searchParams.value.cDictonaryName = '';
  searchParams.value.cDictonaryCode = '';
  handleSearch();
}

function handleSearch() {
  fetchList();
}

defineExpose({
  showDialog
});
</script>

<template>
  <el-dialog v-model="showDialog" title="材质" width="80%">
    <el-row :gutter="24" style="margin-top: 12px">
      <el-col :span="8">
        <el-form-item label="编号" label-width="150">
          <el-input v-model="searchParams.cDictonaryCode" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="名称" label-width="150">
          <el-input v-model="searchParams.cDictonaryName" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-button @click="handleReset">重置</el-button>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="listData"
      highlight-current-row
      border
      @current-change="handleCurrentChange"
      height="600"
    >
      <el-table-column property="cDictonaryCode" label="编号" />
      <el-table-column property="cDictonaryName" label="名称" />
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
