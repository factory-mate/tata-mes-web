<template>
  <div class="sideMain">
    <Menu
      :data="filterRoutes"
      :Key="keyVal"
      @changeTitle="keyVal = $event"
    ></Menu>
  </div>
</template>

<script setup lang="ts">
import Menu from './myMenu.vue';
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import useStore from '@/store';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
// 递归数据
const filterRouterData = (myList: Array<any>) => {
  return myList
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

const { permission } = useStore();
const routes = computed(() => permission.routes);
const filterRoutes: Array<any> = filterRouterData(routes.value);

// const filterRoutes:Array<any>=routes.value.filter((item:any)=>{return item.meta.hidden!=true})

if (filterRoutes.length) {
  if (filterRoutes[0].path === '/') {
    filterRoutes[0].children = null;
  }
}
const type = ref(true);
const data = reactive({
  keyVal: ''
});
const { keyVal } = toRefs(data);

const changeTitle = (val: string) => {
  keyVal.value = val;
};
</script>

<style scoped lang="scss">
.sideMain {
  width: 100%;
  height: 100%;
}
</style>
