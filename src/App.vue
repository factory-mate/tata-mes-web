<template>
  <el-config-provider :locale="locale" :size="size">
    <!-- 这种会产生警告 -->
    <!-- <keep-alive>
      <router-view :key="$route.fullPath"/>
    </keep-alive> -->
    <!-- vue3 的正确写法 -->
    <router-view v-slot="{ Component }">
      <!-- <transition name="fade" mode="out-in" appear> -->
      <keep-alive v-if="route.name !== 'newProductionOrder'">
        <component :is="Component"></component>
      </keep-alive>
      <component :is="Component" v-else></component>
      <!-- </transition> -->
    </router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { ElConfigProvider } from 'element-plus';

import useStore from '@/store';

// 导入 Element Plus 语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';
import { ENV } from '@/utils/env';
import { useRoute } from 'vue-router';
const { app } = useStore();

const language = computed(() => app.language);
const size: any = computed(() => app.size);
const route = useRoute();
const locale = ref();

watch(
  language,
  value => {
    locale.value = value == 'en' ? en : zhCn;
  },
  {
    // 初始化立即执行
    immediate: true
  }
);

document.title = ENV.getDocumentTitle();
ENV.changeFavicon();
</script>
<style scoped>
/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.3s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
.fade-enter-from {
  opacity: 0;
  /* transform: translateY(-30px); */
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0px);
}

.fade-leave-to {
  opacity: 0;
  /* transform: translateY(30px); */
}
</style>
