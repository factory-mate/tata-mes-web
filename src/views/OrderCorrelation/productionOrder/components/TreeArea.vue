<template>
  <el-tree
    style="max-width: 600px"
    :data="props.data"
    :props="{
      children: 'Childs',
      label: 'ShowName'
    }"
  />
</template>

<script setup lang="js">
import { ElTree } from 'element-plus';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped lang="scss"></style>
