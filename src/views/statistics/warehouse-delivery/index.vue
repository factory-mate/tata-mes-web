<script setup>
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
  const data = {
    method: 'post',
    url: import.meta.env.VITE_APP_DY_100_API + '/api/WLTJ/GetForPage_Year',
    params: {}
  };
  ParamsApi(data).then(res => {
    if (res.success) {
      listData.value = res.data;
    }
  });
};

onActivated(() => {
  getData();
});
</script>

<template>
  <div>{{ getCurrentYear() }}</div>
  <div>{{ getCurrentMonth() }}</div>
  <div>{{ getCurrentMonthAndDay() }}</div>
  <el-descriptions direction="vertical" :column="4" border>
    <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
    <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
    <el-descriptions-item label="Place" :span="2">Suzhou</el-descriptions-item>
    <el-descriptions-item label="Remarks">
      <el-tag size="small">School</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="Address">
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </el-descriptions-item>

    <div v-for="(item, index) in listData" :key="index">
      <el-descriptions-item :label="item.cType">
        {{ item.a }}
      </el-descriptions-item>
    </div>
  </el-descriptions>
</template>
