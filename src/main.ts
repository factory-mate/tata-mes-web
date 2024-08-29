import { createApp, Directive } from 'vue';
import App from './App.vue';
import router from '@/router';

import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import Pagination from '@/components/Pagination/index.vue';
import '@/permission';
import mitt from "mitt"
 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import print from 'vue3-print-nb'
// 滚轮滚动，警告，所以被关闭掉
// import 'default-passive-events';

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入svg注册脚本
import 'virtual:svg-icons-register';

// 国际化
import i18n from '@/lang/index';

// 自定义样式
import '@/styles/index.scss';

// 根据字典编码获取字典列表全局方法
import { listDictItemsByTypeCode } from '@/api/dict';

const app = createApp(App);

// icon图标

// 自定义指令
import * as directive from '@/directive';

Object.keys(directive).forEach(key => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});

// 全局方法
app.config.globalProperties.$listDictItemsByTypeCode = listDictItemsByTypeCode;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.config.globalProperties.mittBus = new mitt()

// 注册全局组件
app
  .component('Pagination', Pagination)
  .use(createPinia())
  .use(router)
  .use(ElementPlus)
  .use(i18n)
  .use(print)
  .mount('#app');
