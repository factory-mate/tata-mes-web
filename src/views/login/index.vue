<template>
  <div class="login-container">
    <div :class="'login_left'"></div>
    <div class="login_right">
      <div :class="'logo_bg'"></div>
      <el-button @click="downloadAPK">下载 APK</el-button>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        auto-complete="on"
        label-position="right"
      >
        <div class="title-container">
          <!-- <h3 class="title">{{ $t('login.title') }}</h3> -->
          <!-- <lang-select class="set-language" /> -->
        </div>
        <el-form-item prop="cLoginName" label="账号：">
          <!-- <span class="svg-container">
            <svg-icon icon-class="user" />
          </span> -->
          <el-input
            ref="cLoginName"
            v-model="loginForm.cLoginName"
            placeholder="账号"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-tooltip
          :disabled="capslockTooltipDisabled"
          content="Caps lock is On"
          placement="right"
        >
          <el-form-item prop="cPassWord" label="密码：">
            <!-- <span class="svg-container">
              <svg-icon icon-class="password" />
            </span> -->
            <el-input
              style=""
              ref="passwordRef"
              :key="passwordType"
              v-model="loginForm.cPassWord"
              type="password"
              placeholder="密码"
              show-password
              tabindex="2"
              auto-complete="on"
              @keyup="checkCapslock"
              @blur="capslockTooltipDisabled = true"
              @keyup.enter="handleLogin"
            />
            <!-- <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span> -->
          </el-form-item>
        </el-tooltip>
        <el-button
          size="default"
          :loading="loading"
          type="primary"
          style="
            width: 100%;
            margin-bottom: 30px;
            background: #971e23;
            border-color: transparent;
          "
          @click="handleLogin"
        >
          登录
        </el-button>
      </el-form>
      <div class="logo_hint">
        <img src="../../assets/img/home.jpg" alt="" />
        <p>
          联系我们：19919980909 4000153699<br />
          Copyright © 慧友科技股份有限公司 版权所有
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch, nextTick } from 'vue';
import { ENV } from '@/utils/env';
// 组件依赖
import { ElForm, ElInput } from 'element-plus';
import router from '@/router';
// import LangSelect from '@/components/LangSelect/index.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';

// 状态管理依赖
import useStore from '@/store';

// API依赖
import { useRoute } from 'vue-router';
import { LoginForm } from '@/api/auth/types';

const { user } = useStore();
const route = useRoute();

const loginFormRef = ref(ElForm);
const passwordRef = ref(ElInput);

const env = import.meta.env;

const state = reactive({
  init: true,
  redirect: '',
  loginForm: {
    cLoginName: '', //密码
    cPassWord: '', //账号
    cSourceAppType: '001'
  } as LoginForm,
  loginRules: {
    cLoginName: [
      { required: true, trigger: 'blur', validator: validateUserName }
    ],
    cPassWord: [
      { required: true, trigger: 'blur', validator: validatePassword }
    ]
  },
  loading: false,
  passwordType: 'cPassWord',
  // 大写提示禁用
  capslockTooltipDisabled: true,
  otherQuery: {},
  clientHeight: document.documentElement.clientHeight,
  showDialog: false
});

function validatePassword(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('密码长度不能小于6位'));
  } else {
    callback();
  }
}
function validateUserName(rule: any, value: any, callback: any) {
  if (!value) {
    callback(new Error('请输入账号.'));
  } else {
    callback();
  }
}

const {
  init,
  loginForm,
  loginRules,
  loading,
  passwordType,
  capslockTooltipDisabled
} = toRefs(state);

function checkCapslock(e: any) {
  const { key } = e;
  state.capslockTooltipDisabled =
    key && key.length === 1 && key >= 'A' && key <= 'Z';
}

function showPwd() {
  if (passwordType.value === 'cPassWord') {
    passwordType.value = '';
  } else {
    passwordType.value = 'cPassWord';
  }
  nextTick(() => {
    passwordRef.value.focus();
  });
}

const downloadAPK = () => {
  window.open(import.meta.env.VITE_APK_URL);
};
/**
 *  登录处理
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      user
        .login(state.loginForm)
        .then(() => {
          // router.push({ path: state.redirect || '/', query: state.otherQuery });
          router.push({ path: '/' });
          state.loading = false;
          localStorage.setItem(
            'account',
            JSON.stringify({
              cLoginName: state.loginForm.cLoginName,
              cPassWord: state.loginForm.cPassWord
            })
          );
        })
        .catch(() => {
          state.loading = false;
        });
    } else {
      return false;
    }
  });
}

watch(
  route,
  () => {
    const query = route.query;
    if (query) {
      state.redirect = query.redirect as string;
      state.otherQuery = getOtherQuery(query);
    }
  },
  {
    immediate: true
  }
);

function getOtherQuery(query: any) {
  return Object.keys(query).reduce((acc: any, cur: any) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});
}

onMounted(() => {
  const account = localStorage.getItem('account');
  if (account) {
    const { cLoginName, cPassWord } = JSON.parse(account);
    state.loginForm.cLoginName = cLoginName;
    state.loginForm.cPassWord = cPassWord;
  }
});
function refresh() {
  location.reload();
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: black;

/*element-ui css */
.login-container {
  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .el-input {
    display: inline-block;
    height: 36px;
    width: 75%;
    .el-input__wrapper {
      padding: 0;
      background: transparent;
      box-shadow: none;
      .el-input__inner {
        background: transparent;
        -webkit-appearance: none;
        border-radius: 0px;
        color: $light_gray;
        height: 36px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px rgb(238, 237, 237) inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-input__inner {
    &:hover {
      border-color: whitesmoke;
      box-shadow: #eee;
    }

    box-shadow: #eee;
  }

  .el-form-item {
    border: 1px solid rgba(238, 236, 236, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    text-align: center;
  }

  .copyright {
    width: 100%;
    position: absolute;
    bottom: 0;
    font-size: 12px;
    text-align: center;
    color: #cccccc;
  }
  .el-input {
    width: 100%;
  }
  .el-input .el-input__wrapper {
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
$bg: white;
$dark_gray: white;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background: url('../../assets/img/bottom-bg.jpg') no-repeat;
  overflow: hidden;
  background-size: 100% 100%;
  background-attachment: fixed;
  display: flex;
  .login_left {
    flex: 1;
    background: url('../../assets/bg_l.png') no-repeat;
    background-size: 100% 100%;
  }
  .login_right {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .logo_bg {
    margin: 10% auto 0 auto;
    width: 60%;

    height: 200px;
    background: url('../../assets/bg_logo.png') no-repeat;
    background-size: contain;
    background-position: center center;
    // display: flex;
    // justify-content: center;
    // align-items: center;
    // img{
    //   width: 100%;
    //   height: auto;
    //   display: inline-block;
    // }
    // p{
    //   border: 1px solid red;
    //   width: 50%;
    //   height: 100px;
    //     background: url('../../assets/bg_logo.png') no-repeat;
    //     background-size:contain;
    //     background-position: center center
    // }
  }
  .login-form {
    width: 450px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    text-align: center;
    :deep(.el-form-item__label) {
      line-height: 36px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 5px 10px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    position: absolute;
    right: 0;
    top: 0;

    img {
      height: 42px;
      cursor: pointer;
      vertical-align: middle;
    }
  }

  // 提示
  .logo_hint {
    width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: auto;
      height: 30px;
      display: inline-block;
    }
    p {
      margin-left: 4%;
      font-size: 12px;
      color: #767373;
    }
  }
}

.thirdparty-button {
  position: absolute;
  right: 40px;
  bottom: 6px;
}
.login-container .el-form-item {
  padding: 0 10px;
}

@media only screen and (max-width: 470px) {
  .thirdparty-button {
    display: none;
  }
}
</style>
