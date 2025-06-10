<template>
  <div class="drawer-container">
    <!--
    <el-divider><b>系统布局</b></el-divider>
    <div class="drawer-item">
      <span>开启 Tags-View</span>
      <el-switch v-model="tagsView" class="drawer-switch" />
    </div>

    <div class="drawer-item">
      <span>固定 Header</span>
      <el-switch v-model="fixedHeader" class="drawer-switch" />
    </div> -->
    <div class="drawer-item" style="display: none">
      <span>主题颜色</span>
      <div style="float: right; height: 26px; margin: -3px 8px 0 0">
        <theme-picker @change="themeChange" />
      </div>
    </div>
    <!-- 默认展开几个颜色 -->
    <el-divider><b>主题颜色</b></el-divider>

    <ul class="themeSty">
      <ol
        v-for="(color, index) in themeColors"
        :key="index"
        class="themItem"
        :style="{ background: color }"
        @click="themeChange(color)"
      />
    </ul>
    <!-- <el-divider><b>暗黑模式</b></el-divider>
    <span @click.stop="toggleDark()">暗黑模式</span>
    <el-switch size="small" v-model="isDark"/> -->
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, watch, ref, onMounted } from 'vue';

import ThemePicker from '@/components/ThemePicker/index.vue';
import { localStorage } from '@/utils/storage';
import { ENV } from '@/utils/env';
import useStore from '@/store';
// import { useSettingsStore } from "@/store/modules/settings";
// const settingsStore = useSettingsStore();

const { setting } = useStore();

// 暗黑系列
// import { useDark, useToggle } from '@vueuse/core'
// const isDark = useDark()
// const toggleDark = useToggle(isDark)

const state = reactive({
  fixedHeader: setting.fixedHeader,
  tagsView: setting.tagsView,
  sidebarLogo: setting.sidebarLogo
});
// 主题颜色
const themeColors = ref<string[]>([
  '#0078d7',
  '#304156',
  '#11a983',
  '#13c2c2',
  '#6959CD',
  '#a7072b'
]);
const { fixedHeader, tagsView, sidebarLogo } = toRefs(state);
/**
 * 切换主题颜色
 */
//  function changeThemeColor(color: string) {
//   settingsStore.changeSetting({ key: "layout", value: color });
// }
onMounted(() => {
  if (window.localStorage.getItem('theme')) {
    themeChange(localStorage.get('theme'));
  } else {
    setting.changeSetting({
      key: 'theme',
      value: '#a7072b'
    });
  }
});
function themeChange(val: any) {
  document.documentElement.style.setProperty('--el-color-primary', val);
  setting.changeSetting({ key: 'theme', value: val });
}

// document.documentElement 是全局变量时
const el = document.documentElement;
const color = localStorage.get('theme');
// 获取 css 变量
getComputedStyle(el).getPropertyValue(`--el-color-primary-dark-2`);
// 设置 css 变量
el.style.setProperty('--el-color-primary-dark-2', color);

watch(
  () => state.fixedHeader,
  value => {
    setting.changeSetting({ key: 'fixedHeader', value: value });
  }
);

watch(
  () => state.tagsView,
  value => {
    setting.changeSetting({ key: 'tagsView', value: value });
  }
);

watch(
  () => state.sidebarLogo,
  value => {
    setting.changeSetting({ key: 'sidebarLogo', value: value });
  }
);
</script>

<style lang="scss" scoped>
.themeSty {
  padding-top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 0;
  .themItem {
    display: inline-block;
    width: 30px;
    height: 40px;
  }
}
.drawer-container {
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }

  .job-link {
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}

.navbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 50px;
  padding: 0;

  &__item {
    width: 18%;
    height: 45px;
    background: #f0f2f5;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 4px;
    box-shadow: 0 1px 2.5px 0 rgb(0 0 0 / 18%);

    &--left {
      div {
        &:nth-child(1) {
          width: 30%;
          height: 100%;
          background: #1b2a47;
        }

        &:nth-child(2) {
          width: 70%;
          height: 30%;
          top: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }

    &--top {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }
      }
    }

    &--mix {
      div {
        &:nth-child(1) {
          width: 100%;
          height: 30%;
          background: #1b2a47;
          box-shadow: 0 0 1px #888;
        }

        &:nth-child(2) {
          width: 30%;
          height: 70%;
          bottom: 0;
          left: 0;
          background: #fff;
          box-shadow: 0 0 1px #888;
          position: absolute;
        }
      }
    }
  }
}
</style>
