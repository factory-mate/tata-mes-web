<template>
  <div>
    <el-tree
      :data="treeData"
      show-checkbox
      accordion
      ref="treeRef"
      node-key="cFactoryUnitCode"
      :props="definePropsData"
      @check-change="treeChange"
    />
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  defineProps,
  reactive,
  onMounted,
  computed,
  defineExpose,
  watch,
  defineEmits,
  inject
} from 'vue';
import { configApi, ParamsApi } from '@/api/configApi/index';
// const defaultProps = {
//   children: 'Child',
//   label: 'cFactoryUnitName',
// //   label: 'cFactoryUnitCode',
// }
const props = defineProps({
  treeData: {
    required: true,
    type: Array as any,
    default: () => []
  },
  definePropsData: {
    required: true,
    type: Object
  }
});
const treeRef = ref();
const treeData = ref([]);
const selectTreeVal = ref([]) as any;

const emits = defineEmits(['treeChangeVal']);
watch(
  () => props.treeData,
  newVal => {
    console.log(newVal, '---==newVal');
    let binddata = newVal.filter(
      (item: any) => item.Resource.cAttributeTypeCode == 'binddata'
    );
    treeAxios(binddata[0]);
  }
);

const treeAxios = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    params: {}
  };
  ParamsApi(data).then(res => {
    if (res.status == 200) {
      treeData.value = res.data;
    } else {
      console.log('请求出错');
    }
  });
};
const treeClick = (a: any, b: any, c: any, d: any) => {
  console.log(a, b, c, d);
};
const treeChange = (data: any, checked: boolean, indeterminate: boolean) => {
  //   console.log(data, checked, indeterminate)
  let fatherCode = treeRef.value.getHalfCheckedKeys(); //选中的父节点
  let childCode = treeRef.value.getCheckedKeys(); //选中的子节点
  console.log(fatherCode);
  // console.log(childCode);
  selectTreeVal.value = [...fatherCode, ...childCode];
  console.log(selectTreeVal.value, '----选中的tree');

  emits('treeChangeVal', { val: selectTreeVal.value });
};
// 重置
const clearFilter = () => {
  treeRef.value!.setCheckedKeys([], false);
};
// 暴露方法
defineExpose({ clearFilter });
</script>

<style scoped></style>
