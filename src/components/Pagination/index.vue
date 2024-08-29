<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      :pager-count="pagerCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    <!-- <span class="sp1">每页</span><input type="text" :value="limit" class="inp"><span class="sp1">条</span> -->
  </el-pagination>

  </div>
</template>

<script setup lang="ts">
import { computed, PropType ,toRefs } from 'vue';
import { scrollTo } from '@/utils/scroll-to';

const props = defineProps({
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  pagerCount: {
    type: Number,
    default: 7
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [5,10, 20, 30, 50,100];
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
});
const {limit } =toRefs(props)
const emit = defineEmits(['update:page', 'update:limit', 'pagination']);

const currentPage = computed<number | undefined>({
  get: () => props.page,
  set: value => {
    emit('update:page', value);
  }
});

const pageSize = computed<number | undefined>({
  get() {
    return props.limit;
  },
  set(val) {
    emit('update:limit', val);
  }
});
// 条
function handleSizeChange(val: number) {
  emit('pagination', { page: currentPage.value , limit: val });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
// 页码
function handleCurrentChange(val: number) {
  currentPage.value = val;
  emit('pagination', { page: val, limit: props.limit });
  if (props.autoScroll) {
    scrollTo(0, 800);
  }
}
</script>

<style  scoped>
.sp1{
  margin: 0 10px;
  color: #606266;
}
.inp{
  width: 40px;
  border: 1px solid #dcdfe6;
  height: 30px;
  border-radius: 5px;
  text-align: center;
}
.pagination-container {
  background: #fff;
  padding: 10px 15px;
}

.pagination-container.hidden {
  display: none;
}
</style>
