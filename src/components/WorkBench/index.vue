<template>
  <div class="work-box" v-if="false">
    <RouterLink to="/work">
      <el-icon color="orange"><BellFilled /></el-icon>
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { BellFilled } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.work-box {
  line-height: 50px;
  font-size: 24px;
}
.el-icon {
  color: #5a5e66;
}
</style>
<!-- color: var(--el-color-primary); -->
