<template>
  <div :class="{ 'has-logo': showLogo }" style="box-shadow: 0 5px 5px #000">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar>
      <!-- :background-color="variables.menuBg"
      :text-color="variables.menuTextBg"
      :active-text-color="variables.menuActiveText" -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        text-color="#333"
        active-text-color="var(--el-color-primary)"
        :background-color="variables.menuBg"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :item="route"
          :key="route.path"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import SidebarItem from './SidebarItem.vue';
import Logo from './Logo.vue';
import variables from '@/styles/variables.module.scss';
import useStore from '@/store';

const { permission, setting, app } = useStore();

const route = useRoute();
const routes = computed(() => permission.routes);
const showLogo = computed(() => setting.sidebarLogo);

const isCollapse = computed(() => !app.sidebar.opened);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});
</script>
