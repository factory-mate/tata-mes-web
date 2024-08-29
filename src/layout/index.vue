<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div style="border: 1px solid red;"
    v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    /> -->
    <!-- 左侧导航  用的时候自己打开 -->
    <!-- <Sidebar class="sidebar-container"  v-if="!sidebar.opened"/> -->
    <div
      :class="{ hasTagsView: needTagsView }"
      :style="{ marginLeft: sidebar.opened ? 0 : 0 }"
      class="main-container"
    >
      <div :class="{ 'fixed-header': true }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <!--主页面-->
      <app-main />

      <!-- 设置面板 -->
      <RightPanel v-if="showSettings">
        <settings />
      </RightPanel>

      <!-- 修改密码弹窗 -->
      <div>
        <el-dialog v-model="dialogType" center title="修改密码" @open="open">
          <el-form
            ref="MAruleFormRefs"
            :model="MAruleFormRef"
            label-width="120px"
            class="demo-ruleForm"
            :rules="rules"
            status-icon
          >
            <el-form-item label="账户：">
              <el-input type="text" v-model="MAruleFormRef.name" disabled />
            </el-form-item>
            <el-form-item label="旧密码：" prop="cPassWordOld">
              <el-input
                type="password"
                v-model="MAruleFormRef.cPassWordOld"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码：" prop="cPassWordNew">
              <el-input
                type="password"
                v-model="MAruleFormRef.cPassWordNew"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认新密码：" prop="newPassWord">
              <el-input
                type="password"
                v-model="MAruleFormRef.newPassWord"
                show-password
              />
            </el-form-item>
            <p style="height: 30px; margin-left: 120px; color: red">
              <span v-if="pwaSty">密码不一致！</span>
            </p>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="clickAdd(MAruleFormRefs)"
                >确认</el-button
              >
              <el-button @click="close">取消</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { AppMain, Navbar, Settings, TagsView } from './components/index';
import useStore from '@/store';
import Sidebar from './components/Sidebar/index.vue';
import RightPanel from '@/components/RightPanel/index.vue';
import { DataApi } from '@/api/configApi/index';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus

const { width } = useWindowSize();
const WIDTH = 992;
const MAruleFormRefs = ref<FormInstance>();
const MAruleFormRef = reactive({
  UID: '',
  name: '11',
  cPassWordOld: '',
  cPassWordNew: '',
  newPassWord: ''
});
const rules = reactive({
  cPassWordOld: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  cPassWordNew: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  newPassWord: [{ required: true, message: '确认新密码', trigger: 'blur' }]
});

const { app, setting } = useStore();
let aa = localStorage.getItem('sidebarStatus');

const sidebar = computed(() => app.sidebar);
const device = computed(() => app.device);
const needTagsView = computed(() => setting.tagsView);
const fixedHeader = computed(() => setting.fixedHeader);
const showSettings = computed(() => setting.showSettings);
const dialogType = ref(false);
const pwaSty = ref(false);

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation
  // mobile: device.value === 'mobile'   //缩放的时候，左侧消失
}));
onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let user = JSON.parse(window.localStorage.getItem('user'));
  MAruleFormRef.name = user.UserName;
  MAruleFormRef.UID = user.UserId;
});

watchEffect(() => {
  if (width.value < WIDTH) {
    app.toggleDevice('mobile');
    app.closeSideBar(true);
  } else {
    app.toggleDevice('desktop');
  }
});
$bus.on('clickPwa', (v: any) => {
  dialogType.value = v;
});
const open = () => {
  MAruleFormRef.cPassWordOld = '';
  MAruleFormRef.cPassWordNew = '';
  MAruleFormRef.newPassWord = '';
  pwaSty.value = false;
};
const close = () => {
  dialogType.value = false;
};
const clickAdd = async (formEl: FormInstance | undefined) => {
  let data = {
    method: 'post',
    url: import.meta.env.VITE_APP_BASE_API + '/api/User/SetPass',
    data: MAruleFormRef
  };
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(data, 'submit!');
      if (MAruleFormRef.cPassWordNew != MAruleFormRef.newPassWord) {
        pwaSty.value = true;
        return false;
      } else {
        pwaSty.value = false;
      }
      DataApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '修改成功'
          });
          dialogType.value = false;
        } else {
          ElMessage.error('修改失败');
        }
      });
    } else {
      console.log('error submit!', fields);
    }
  });
};
// function handleClickOutside() {
//   app.closeSideBar(false);
// }
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  opacity: 0.3;
  background: #000;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  right: 0;
  z-index: 9;
  width: 100%;
  //width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
