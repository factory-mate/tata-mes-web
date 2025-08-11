<!-- eslint-disable vue/no-mutating-props -->

<template>
  <el-cascader-panel
    class="cascader_main"
    :options="data.sort(compare('iIndex', true))"
    :props="defaultProps"
  >
    <template #default="{ node, data }">
      <!-- <div @click="setActiveData(node,data)" class="cascader_item">
                <svg-icon v-if="(data.meta && data.meta.icon)" :icon-class="data.meta.icon" />
                {{ data.meta.title }}
            </div> -->
      <div
        class="cascader_item linkSty"
        v-if="data.children"
        @click="setActiveData(node, data)"
      >
        <div class="nav_box">
          <svg-icon
            v-if="data.meta && data.meta.icon"
            :icon-class="data.meta.icon"
          />
          <span class="itemText">
            {{ data.meta.title }}
          </span>
        </div>
        <span>
          <el-icon class="cascader_icon" v-if="data.meta && data.children">
            <ArrowRight />
          </el-icon>
        </span>
      </div>
      <div class="cascader_item" v-else style="width: 100%; height: 100%">
        <!-- 外链 -->
        <a
          v-if="isExternal(data.path)"
          :href="data.path"
          target="_blank"
          rel="noopener"
          class="linkSty"
        >
          <div class="nav_box">
            <svg-icon
              v-if="data.meta && data.meta.icon"
              :icon-class="data.meta.icon"
            />
            <span class="itemText">
              {{ data.meta.title }}
            </span>
          </div>
          <span>
            <el-icon class="cascader_icon" v-if="data.meta && data.children">
              <ArrowRight />
            </el-icon>
          </span>
        </a>
        <div
          v-else-if="['PurchaseNote', 'PurchaseRequest'].includes(data.path)"
          @click="onOuterClick(node, data)"
        >
          <div class="nav_box">
            <svg-icon
              v-if="data.meta && data.meta.icon"
              :icon-class="data.meta.icon"
            />
            <span class="itemText">
              {{ data.meta.title }}
            </span>
          </div>
          <span>
            <el-icon class="cascader_icon" v-if="data.meta && data.children">
              <ArrowRight />
            </el-icon>
          </span>
        </div>
        <!-- 内部路由 -->
        <router-link
          v-else
          :to="{ name: data.name }"
          class="linkSty"
          @click="setActiveData(node, data)"
        >
          <div class="nav_box">
            <svg-icon
              v-if="data.meta && data.meta.icon"
              :icon-class="data.meta.icon"
            />
            <span class="itemText">
              {{ data.meta.title }}
            </span>
          </div>
          <span>
            <el-icon class="cascader_icon" v-if="data.meta && data.children">
              <ArrowRight />
            </el-icon>
          </span>
        </router-link>
      </div>
    </template>
  </el-cascader-panel>
</template>

<script lang="ts" setup>
import { ref, toRefs, reactive, inject, watch, computed, Ref } from 'vue';
import { ArrowRight } from '@element-plus/icons-vue';
import SvgIcon from '@/components/SvgIcon/index.vue';
import { PropType } from 'vue';
import { compare } from '@/utils';
import { sessionStorage } from '@/utils/storage';
import { ElIcon } from 'element-plus';
import { Tree } from 'element-plus/es/components/tree-v2/src/types';
import { RouterLink } from 'vue-router';
import { isExternal } from '@/utils/validate';
import { useRouter } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
let router = useRouter();
const propsData = defineProps({
  data: {
    type: Array as any,
    default: () => []
  },
  isIndex: {
    type: Number,
    default: () => 1
  },
  isNest: {
    type: Boolean,
    required: false
  }
});
const defaultProps = {
  children: 'children',
  label: 'name'
};
//注入关闭抽屉方法
const isClose = inject('close', Function, true);

const emit = defineEmits<{
  (event: 'changeTitle', val: string): void;
}>();

const avtiveVal = ref('');
const isActive = ref('');
const activeData = ref(null);
const setActiveData = (node: any, data: any) => {
  $bus.emit('clickIndexType', data);
  avtiveVal.value = data.meta.title;
  emit('changeTitle', avtiveVal.value);

  if (data.children && data.children.length) {
    activeData.value = data.children;
  } else {
    sessionStorage.set('clickSider', JSON.stringify(data.name));
    sessionStorage.set('routerMeta', data.meta);
    activeData.value = null;
    isClose();
  }
};

const onOuterClick = (node, data) => {
  console.log('onOuterClick', node, data);
  // 通过新标签页打开
  window.open(router.resolve({ name: data.path }).href, '_blank');
};
</script>

<style lang="scss">
.cascader_main {
  height: 100%;
  // border: 1px solid red !important;
  // .itemText,.cascader_icon{
  //     color: #000;
  // }
  .cascader_item {
    // border: 1px solid red;
    display: inline-block;
    width: 100%;
    // padding: 14px 20px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .linkSty {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .el-cascader-menu__wrap.el-scrollbar__wrap {
    height: 100%;
  }
  .el-cascader-node.in-active-path,
  .el-cascader-node.is-active,
  .el-cascader-node.is-selectable.in-checked-path {
    color: #fff !important;
    background-color: var(--el-color-primary);
  }
  .el-cascader-node:not(.is-disabled):focus,
  .el-cascader-node:not(.is-disabled):hover {
    background-color: var(--el-color-primary);
    color: #fff !important;
  }
  .el-cascader-node {
    height: 40px;
    margin: 4px 0;
    border-radius: 4px;
    padding: 0;
  }
  .el-cascader-menu:last-child .el-cascader-node {
    padding: 0;
  }
  .el-cascader-node__label {
    padding: 0;
  }
  .el-icon {
    display: none;
  }
  .cascader_icon {
    display: block;
  }
}
</style>
