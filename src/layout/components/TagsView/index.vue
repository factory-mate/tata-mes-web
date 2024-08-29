<template>
  <div class="tags-view__container">
    <scroll-pane
      ref="scrollPaneRef"
      class="tags-view__wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :data-path="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path }"
        class="tags-view__item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @click.left="clickTagMeta(tag)"
        @contextmenu.prevent="openMenu(tag, $event)"
        @click="close(tag)"
      >
        {{ tag.meta.title }}
        <span
          v-if="!isAffix(tag)"
          class="icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        >
          <svg-icon icon-class="close" />
        </span>
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="tags-view__menu"
    >
      <!-- <li @click="refreshSelectedTag(selectedTag)">
        <svg-icon icon-class="refresh" />
        刷新
      </li> -->
      <!-- <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        <svg-icon icon-class="close" />
        关闭
      </li> -->
      <li @click="closeOtherTags">
        <svg-icon icon-class="close_other" />
        关闭其它
      </li>
      <li v-if="!isFirstView()" @click="closeLeftTags">
        <svg-icon icon-class="close_left" />
        关闭左侧
      </li>
      <li v-if="!isLastView()" @click="closeRightTags">
        <svg-icon icon-class="close_right" />
        关闭右侧
      </li>
      <li @click="closeAllTags(selectedTag)">
        <svg-icon icon-class="close_all" />
        关闭所有
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CircularJSON from 'circular-json';

// npm install -S circular-json
import {
  computed,
  getCurrentInstance,
  nextTick,
  ref,
  watch,
  onMounted,
  ComponentInternalInstance
} from 'vue';

import path from 'path-browserify';

import { useRoute, useRouter } from 'vue-router';

import ScrollPane from './ScrollPane.vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import useStore from '@/store';
import { TagView } from '@/store/modules/types';
import { sessionStorage } from '@/utils/storage';
const Route = useRoute();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus

//导入pinia数据,全局设置抽屉开关
const store = useStore();
const { drawerclose, cache } = store;

const { tagsView, permission } = useStore();

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const router = useRouter();
const route = useRoute();
// const visitedViews=ref([])
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// visitedViews.value=tagsView.visitedViews
const visitedViews = computed<any>(() => tagsView.visitedViews);
const routes = computed<any>(() => permission.routes);

const affixTags = ref([]);
const visible = ref(false);
const selectedTag = ref({});
const scrollPaneRef = ref();
const left = ref(0);
const top = ref(0);

//详情Tab编辑按钮变成编辑Tab
$bus.on('TabTitleVal', (v: any) => {
  const dd = visitedViews.value.filter(
    (item: { name: any }) => item.name == v.name
  );
  // visitedViews.value[1].meta.title = v.title
  dd[0].meta.title = v.title;
});
// 本地存储tags
watch(
  () => tagsView.visitedViews,
  v => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // visitedViews.value=tagsView.visitedViews
    // console.log(visitedViews.value,"--==22222");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // window.sessionStorage.removeItem('routerTag');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.localStorage.setItem(
      'tagsViewList',
      JSON.stringify(tagsView.visitedViews)
    );

    // let tagData={
    //   val:tagsView.visitedViews
    // }
    //  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // // @ts-ignore
    // window.sessionStorage.setItem('routerTag',JSON.stringify(tagData))
  },
  { deep: true }
);
watch(
  route,
  val => {
    addTags();
    moveToCurrentTag();
  },
  {
    //初始化立即执行
    immediate: true
  }
);

watch(visible, value => {
  if (value) {
    document.body.addEventListener('click', closeMenu);
  } else {
    document.body.removeEventListener('click', closeMenu);
  }
});
// 关闭抽屉
const close = (tag: any) => {
  window.sessionStorage.setItem('clickSider', '');
  sessionStorage.set('routerMeta', tag.meta);
  drawerclose.setDrawer(false);
};
const removeITem = () => {
  let bj = /编辑/g;
  let xq = /详情/g;
  let bjlist = [];
  let xqlist = [];
  tagsView.visitedViews.forEach((item: any) => {
    let string = item.meta.title;
    bjlist = string.match(bj) || [];
    xqlist = string.match(xq) || [];
    if (bjlist.length || xqlist.length) {
      tagsView.delView(item).then((res: any) => {
        if (isActive(item)) {
          toLastView(res.visitedViews, item);
        }
      });
    }
  });
};
function filterAffixTags(routes: any[], basePath = '/') {
  let tags: TagView[] = [];

  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = path.resolve(basePath, route.path);
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      });
    }

    if (route.children) {
      const childTags = filterAffixTags(route.children, route.path);
      if (childTags.length >= 1) {
        tags = tags.concat(childTags);
      }
    }
  });
  return tags;
}

function initTags() {
  const res = filterAffixTags(routes.value) as [];
  affixTags.value = res;
  for (const tag of res) {
    // Must have tag name
    if ((tag as TagView).name) {
      tagsView.addVisitedView(tag);
    }
  }
}

function addTags() {
  if (route.name) {
    tagsView.addView(route);
  }
}

function moveToCurrentTag() {
  nextTick(() => {
    for (const r of visitedViews.value) {
      if (r.path === route.path) {
        scrollPaneRef.value.moveToTarget(r);
        // when query is different then update
        if (r.fullPath !== route.fullPath) {
          tagsView.updateVisitedView(route);
        }
      }
    }
  });
}

function isActive(tag: TagView) {
  return tag.path === route.path;
}

function isAffix(tag: TagView) {
  return tag.meta && tag.meta.affix;
}

function isFirstView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
        visitedViews.value[1].fullPath ||
      (selectedTag.value as TagView).fullPath === '/index'
    );
  } catch (err) {
    return false;
  }
}

function isLastView() {
  try {
    return (
      (selectedTag.value as TagView).fullPath ===
      visitedViews.value[visitedViews.value.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
}

function refreshSelectedTag(view: TagView) {
  tagsView.delCachedView(view);
  const { fullPath } = view;
  nextTick(() => {
    router.replace({ path: '/redirect' + fullPath }).catch(err => {
      console.warn(err);
    });
  });
}

function toLastView(visitedViews: TagView[], view?: any) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath });
    } else {
      router.push('/');
    }
  }
}
function clickTagMeta(item: any) {
  sessionStorage.set('routerMeta', item.meta);
}
function closeSelectedTag(view: TagView) {
  tagsView.delView(view).then((res: any) => {
    cache.addInvalidPage(view.name);
    if (isActive(view)) {
      toLastView(res.visitedViews, view);
    }
  });
  // 关闭面包屑，如果不是当前页签，关闭后，默认加载最后一个
  // if(view.path === route.path){
  //     sessionStorage.set('routerMeta', visitedViews.value[visitedViews.value.length-1].meta);
  // }
}

function closeLeftTags() {
  tagsView.delLeftViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}
function closeRightTags() {
  tagsView.delRightViews(selectedTag.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastView(res.visitedViews);
    }
  });
}

function closeOtherTags() {
  router.push(selectedTag.value);
  tagsView.delOtherViews(selectedTag.value).then(() => {
    moveToCurrentTag();
  });
}

function closeAllTags(view: TagView) {
  tagsView.delAllViews().then((res: any) => {
    toLastView(res.visitedViews, view);
  });
}

function openMenu(tag: TagView, e: MouseEvent) {
  const menuMinWidth = 105;
  const offsetLeft = proxy?.$el.getBoundingClientRect().left; // container margin left
  const offsetWidth = proxy?.$el.offsetWidth; // container width
  const maxLeft = offsetWidth - menuMinWidth; // left boundary
  const l = e.clientX - offsetLeft + 15; // 15: margin right

  if (l > maxLeft) {
    left.value = maxLeft;
  } else {
    left.value = l;
  }

  top.value = e.clientY;
  visible.value = true;
  selectedTag.value = tag;
}

function closeMenu() {
  visible.value = false;
}

function handleScroll() {
  closeMenu();
}

onMounted(() => {
  initTags();
});
</script>

<style lang="scss" scoped>
.tags-view__container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view__wrapper {
    .tags-view__item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &:hover {
        color: var(--el-color-primary);
      }

      &.active {
        background-color: var(--el-color-primary);
        color: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary);

        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }

      .icon-close {
        border-radius: 50%;
        text-align: center;

        &:hover {
          background-color: #ccc;
          color: #fff;
        }
      }
    }
  }

  .tags-view__menu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
