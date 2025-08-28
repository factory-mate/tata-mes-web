<template>
  <div class="nav-box">
    <div class="icon-mark">
      <!-- <el-icon color="skyblue" @mousemove="drawerclose.setDrawer(true)" style="    border-radius: 20%;
            box-shadow: 0 0px 5px #c1c1c1;">
                <Menu />
            </el-icon> -->
      <div class="SvgSty" @click="menmclick">
        <svg
          t="1677572371109"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="18510"
          width="200"
          height="200"
        >
          <path
            d="M36.285217 98.615652m44.52174 0l264.45913 0q44.521739 0 44.521739 44.521739l0 264.459131q0 44.521739-44.521739 44.521739l-264.45913 0q-44.521739 0-44.52174-44.521739l0-264.459131q0-44.521739 44.52174-44.521739Z"
            fill="#7ab653"
            p-id="18511"
          ></path>
          <path
            d="M36.285217 619.52m44.52174 0l264.45913 0q44.521739 0 44.521739 44.521739l0 264.459131q0 44.521739-44.521739 44.521739l-264.45913 0q-44.521739 0-44.52174-44.521739l0-264.459131q0-44.521739 44.52174-44.521739Z"
            fill="var(--el-color-primary)"
            p-id="18512"
          ></path>
          <path
            d="M580.786087 619.52m44.521739 0l264.459131 0q44.521739 0 44.521739 44.521739l0 264.459131q0 44.521739-44.521739 44.521739l-264.459131 0q-44.521739 0-44.521739-44.521739l0-264.459131q0-44.521739 44.521739-44.521739Z"
            fill="#7ab653"
            p-id="18513"
          ></path>
          <path
            d="M507.574882 275.237211m31.481623-31.481624l187.000845-187.000844q31.481624-31.481624 62.963247 0l187.000844 187.000844q31.481624 31.481624 0 62.963247l-187.000844 187.000845q-31.481624 31.481624-62.963247 0l-187.000845-187.000845q-31.481624-31.481624 0-62.963247Z"
            fill="#1582c7"
            p-id="18514"
          ></path>
        </svg>
      </div>
    </div>
    <!-- 抽屉 -->
    <div class="drawer-box">
      <el-drawer
        v-model="drawerclose.drawer"
        direction="ltr"
        :with-header="false"
        :size="funWidth()"
      >
        <div class="sidebar-box">
          <el-autocomplete
            v-model="searchText"
            :fetch-suggestions="querySearch"
            placeholder="请输入菜单名称"
            @select="handleSelect"
            style="margin-bottom: 4px"
          >
            <template #default="{ item }">
              <div>{{ item.title }}</div>
            </template>
          </el-autocomplete>
          <LeftSidebar @close="close"></LeftSidebar>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import LeftSidebar from '@/layout/components/LeftSidebar/index.vue';
import useStore from '@/store';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const router = useRouter();
const searchText = ref('');
const store = useStore();
const { drawerclose, permission } = store;
const drawer = drawerclose.drawer;
const indextype = ref('1');
const itemChild = ref([]);
const close = () => {
  drawerclose.setDrawer(false);
};
const menmclick = () => {
  drawerclose.setDrawerOpen(true);
};
$bus.on('clickIndexType', (v: any) => {
  indextype.value = v.type;
  itemChild.value = v.children || [];
  funWidth();
});

const menus = ref<any>([]);

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? menus.value.filter(createFilter(queryString))
    : menus.value;
  cb(results);
};

const createFilter = queryString => {
  return restaurant => {
    console.log(restaurant);
    return (
      restaurant &&
      restaurant?.title.toLowerCase().includes(queryString.toLowerCase())
    );
  };
};

const handleSelect = (item: any) => {
  if ([].includes(item.link)) {
    window.open(router.resolve({ name: item.link }).href, '_blank');
    return;
  }
  router.push({ name: item.link });
};

const funWidth = () => {
  if (indextype.value == '1' && itemChild.value.length) {
    return '402px';
  } else if (indextype.value == '2' && itemChild.value.length) {
    return '584px';
  } else {
    return '220px';
  }
};

const filterRouterData = (myList: Array<any>) => {
  return myList
    .filter(item => item.path !== '/')
    .filter(item => {
      return item.meta.hidden != true; //过滤条件
    })
    .map(item => {
      item = Object.assign({}, item);
      if (item.children) {
        item.children = filterRouterData(item.children);
      }
      return item;
    });
};

const getSelectorData = (list: any[]) => {
  const result = [];
  list.forEach(i => {
    if (i.children && i.children.length > 0) {
      i.children.forEach((j: any) => {
        if (j.children && j.children.length > 0) {
          j.children.forEach((k: any) => {
            result.push({
              title: i.meta.title + '/' + j.meta.title + '/' + k.meta.title,
              link: k.path
            });
          });
        } else {
          result.push({
            title: i.meta.title + '/' + j.meta.title,
            link: j.path
          });
        }
      });
    } else {
      result.push({
        title: i.meta.title,
        link: i.path
      });
    }
  });
  return result;
};

watch(
  () => permission.routes,
  val => {
    menus.value = getSelectorData(filterRouterData(val));
  },
  { immediate: true }
);

// 子传父，方法暴露
defineExpose({
  close
});

//提供抽屉关闭方法
provide('close', close);
</script>

<style lang="scss" scoped>
.nav-box {
  margin: 0 20px;

  .icon-mark {
    font-size: 36px;
  }

  .sidebar-box {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
}
.el-icon {
  color: var(--el-color-primary);
  margin-top: 6px;
}

.SvgSty {
  margin-top: 5px;
  .icon {
    width: 36px;
    height: 36px;
  }
}
:deep(.el-drawer__body) {
  background: #fff;
}
:deep(.el-drawer__body) {
  overflow-x: none !important;
}
</style>
<style>
.drawer-box .el-overlay {
  height: calc(100% - 86px) !important;
  margin-top: 86px !important;
}
</style>
