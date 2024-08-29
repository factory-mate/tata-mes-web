<template>
  <div class="navbar">
    <!-- <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    /> -->

    <!-- 头部首页标记 -->
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- 头部左侧 -->
    <div class="breadcrumb-container">
      <div class="left-minbox">
        <LeftBar ref="childrencloseRef"></LeftBar>
        <WorkBench></WorkBench>
      </div>
    </div>
    <!-- 头部中间 -->
    <div class="middle-header" @click="drawerClose()">
      <Logo class="logo"></Logo>
    </div>
    <!-- 头部右侧 -->
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!--        <search id="header-search" class="right-menu-item" />
                <error-log class="errLog-container right-menu-item hover-effect" />-->
        <!-- <screenfull id="screenfull" class="right-menu-item hover-effect" />
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip> -->
        <!-- 中英文切换 -->
        <!-- <lang-select class="right-menu-item hover-effect" /> -->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <!-- <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" /> -->
          <span>{{ name }}</span>
          <CaretBottom style="width: 0.6em; height: 0.6em; margin-left: 5px" />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>{{ $t('navbar.dashboard') }}</el-dropdown-item>
            </router-link>
            <el-dropdown-item divided @click="clickPwa">
              修改密码
            </el-dropdown-item>
            <!-- <a target="_blank" href="https://github.com/hxrui">
              <el-dropdown-item>Github</el-dropdown-item>
            </a>
            <a target="_blank" href="https://gitee.com/haoxr">
              <el-dropdown-item>{{ $t('navbar.gitee') }}</el-dropdown-item>
            </a>
            <a target="_blank" href="https://www.cnblogs.com/haoxianrui/">
              <el-dropdown-item>{{ $t('navbar.document') }}</el-dropdown-item>
            </a> -->
            <el-dropdown-item divided @click="logout">
              {{ $t('navbar.logout') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import Logo from '../../layout/components/Sidebar/Logo.vue';
import { CaretBottom } from '@element-plus/icons-vue';
// 组件依赖
// import Breadcrumb from '@/components/Breadcrumb/index.vue';
import Hamburger from '@/components/Hamburger/index.vue';
import Screenfull from '@/components/Screenfull/index.vue';
import SizeSelect from '@/components/SizeSelect/index.vue';
// import LangSelect from '@/components/LangSelect/index.vue';
import LeftBar from '@/components/LeftBar/index.vue';
import WorkBench from '@/components/WorkBench/index.vue';
import useStore from '@/store';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
// 图标依赖

// 接收子组件方法，关闭抽屉
const childrencloseRef = ref();
const drawerClose = () => {
  childrencloseRef.value.close();
};

const { app, user, tagsView } = useStore();
const name = ref('');

const route = useRoute();
const router = useRouter();

const sidebar = computed(() => app.sidebar);
const device = computed(() => app.device);
const avatar = computed(() => user.avatar);

function toggleSideBar() {
  app.toggleSidebar();
}
onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name.value = JSON.parse(window.localStorage.getItem('user')).UserName;
});
const clickPwa = () => {
  $bus.emit('clickPwa', true);
};
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    user
      .logout()
      .then(() => {
        tagsView.delAllViews();
        localStorage.removeItem('account');
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    // float: left;
    .left-minbox {
      display: flex;
      justify-content: space-around;
    }
  }

  .middle-header {
    flex: 1;
    .logo {
      width: auto;
      height: 60px;
      background-color: #fff;
    }
  }

  .right-menu {
    // float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        line-height: 50px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
