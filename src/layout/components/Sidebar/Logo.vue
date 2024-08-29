<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <span class="logo">FactoryMate</span>
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <!-- <img v-if="logo" :src="logo" class="sidebar-logo" /> -->
        <span class="logo">FactoryMate</span>
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue';

const props = defineProps({
  collapse: {
    type: Boolean
    // required: true,
  }
});

const state = reactive({
  isCollapse: props.collapse,
  logo: new URL(`../../../assets/logo.jpg`, import.meta.url).href
});

const { logo } = toRefs(state);
</script>

<style lang="scss" scoped>
.logo {
  font-weight: bold;
  font-size: 24px;
  position: relative;
  span::after {
    content: '®';
    font-size: 20px;
    position: absolute;
    top: -18px;
    right: -15px;
    vertical-align: super;
  }
}

.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: var(--el-color-primary);
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: auto;
      height: 40px;
      object-fit: cover;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      margin-left: 12px;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
