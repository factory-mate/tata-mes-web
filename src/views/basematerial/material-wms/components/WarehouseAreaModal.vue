<script setup>
import { reactive, ref, watch } from 'vue';
import { warehouseAreaGetForPage } from '@/api/material';

const searchParams = ref({
  cWareHouseName: '',
  cWareHouseAreaCode: '',
  cWareHouseAreaName: ''
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
  if (searchParams.value.cWareHouseName) {
    Conditions.push({
      Field: 'cWareHouseName',
      Operator: 'like',
      Value: searchParams.value.cWareHouseName
    });
  }
  if (searchParams.value.cWareHouseAreaCode) {
    Conditions.push({
      Field: 'cWareHouseAreaCode',
      Operator: 'like',
      Value: searchParams.value.cWareHouseAreaCode
    });
  }
  if (searchParams.value.cWareHouseAreaName) {
    Conditions.push({
      Field: 'cWareHouseAreaName',
      Operator: 'like',
      Value: searchParams.value.cWareHouseAreaName
    });
  }
  warehouseAreaGetForPage({
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
  searchParams.value.cWareHouseName = '';
  searchParams.value.cWareHouseAreaCode = '';
  searchParams.value.cWareHouseAreaName = '';
}

function handleSearch() {
  fetchList();
}

defineExpose({
  showDialog
});
</script>

<template>
  <el-dialog v-model="showDialog" title="库区" width="80%">
    <el-row :gutter="24" style="margin-top: 12px">
      <el-col :span="8">
        <el-form-item label="仓库名称" label-width="150">
          <el-input v-model="searchParams.cWareHouseName" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="库区编号" label-width="150">
          <el-input
            v-model="searchParams.cWareHouseAreaCode"
            autocomplete="off"
          />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="库区名称" label-width="150">
          <el-input
            v-model="searchParams.cWareHouseAreaName"
            autocomplete="off"
          />
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
    >
      <el-table-column property="cWareHouseAreaName" label="库区名称" />
      <el-table-column property="cWareHouseAreaCode" label="库区编号" />
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
