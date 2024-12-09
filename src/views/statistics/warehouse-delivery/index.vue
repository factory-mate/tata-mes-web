<script setup>
import request from '@/utils/request';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import { onActivated, ref } from 'vue';

const listData = ref([]);

const getCurrentYear = () => {
  const date = new Date();
  return `${date.getFullYear()}年`;
};

const getCurrentMonth = () => {
  const date = new Date();
  return `${date.getMonth() + 1}月`;
};

const getCurrentMonthAndDay = () => {
  const date = new Date();
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const getData = () => {
  request({
    method: 'post',
    url: import.meta.env.VITE_APP_DY_100_API + '/api/WLTJ/GetForPage_Year',
    data: {
      Conditions: 'dDate = 2024-12-08'
    }
  }).then(res => {
    if (res.success) {
      listData.value = res.data.data;
    }
  });
};

onActivated(() => {
  getData();
});
</script>

<template>
  <div style="padding: 20px">
    <el-table :data="listData">
      <el-table-column prop="cType" label="名称" />
      <el-table-column prop="CurrentDay" :label="getCurrentMonthAndDay()" />
      <el-table-column prop="CurrentMonth" :label="getCurrentMonth()" />
      <el-table-column prop="CurrentYear" :label="getCurrentYear()" />
    </el-table>
  </div>
</template>
