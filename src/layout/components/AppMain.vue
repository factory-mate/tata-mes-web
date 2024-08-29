<template>
  <section class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive v-if="route.meta.keepAlive">
        <component :is="Component" :name="route.name" />
      </keep-alive>
      <component :is="Component" :key="route.fullPath" v-else />
    </router-view>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useStore from '@/store';
import { useRoute } from 'vue-router';

const route = useRoute();
const { tagsView } = useStore();

const cachedViews = computed(() => tagsView.cachedViews);
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
</style>
