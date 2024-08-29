<!-- eslint-disable vue/no-setup-props-destructure -->
<template>
  <div style="display: inline-block; padding: 0 10px" @click.stop>
    <el-popover placement="bottom" :width="300" trigger="click">
      <template #reference>
        <el-icon @click="clickIcon">
          <Switch />
        </el-icon>
      </template>
      <!-- <el-input v-model="input3" placeholder="请输入" :suffix-icon="Search" /> -->
      <draggable
        :list="listVal"
        item-key="id"
        :group="{ name: 'article', pull: '' }"
        :disabled="false"
        @start="start2"
        @end="end2"
        class="dragArea2"
      >
        <template #item="{ element }">
          <div class="listItem" v-show="element.label != '操作'">
            <!-- <el-checkbox :checked="element.checkType" @change="(value)=>changeCheck(value,element.label)" ></el-checkbox> -->
            <input
              type="checkbox"
              :checked="element.checkType"
              @change="(value:any)=>changeCheck(value,element.label)"
            />
            {{ element.label || element.name }}
            <el-button
              class="iconSty"
              size="small"
              type="info"
              :icon="Sort"
              circle
              plain
            />
          </div>
        </template>
      </draggable>
      <div class="booter_but">
        <div></div>
        <!-- <el-checkbox
                    v-model="checkAll"
                >全选</el-checkbox> -->
        <div>
          <el-button size="small" @click="renew">恢复</el-button>
          <el-button type="primary" size="small" @click="clikEnd"
            >确认</el-button
          >
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, watch, onMounted, getCurrentInstance } from 'vue';
import { Search, Switch, Sort } from '@element-plus/icons-vue';
import draggable from 'vuedraggable';
import { tableSort } from '@/api/auth/index';
let { ctx: that } = getCurrentInstance() as any;

interface ListType {
  id?: number;
  label: string;
}

const props = defineProps({
  list: {
    type: Array as PropType<ListType[]>
  }
});
const emit = defineEmits(['newList', 'renew']);
const listVal: any = ref(null);
listVal.value = JSON.parse(JSON.stringify(props.list));

watch(
  () => props.list,
  newValue => {
    listVal.value = JSON.parse(JSON.stringify(newValue));
  },
  { deep: true }
);

// 输入框，复选框 数据
const checkAll = ref(false);
const isIndeterminate = ref(false);
const input3 = '';

//  多选
const changeCheck = (val: any, name: string) => {
  // console.log(val.target.checked,"--vvv");
  // console.log(name,"--name");
  listVal.value.forEach((e: any) => {
    if (e.label == name) {
      e.checkType = val.target.checked;
    }
  });
  listVal.value = JSON.parse(JSON.stringify(listVal.value));
  // console.log(listVal.value,"listVal.value");
};

// icon click
const clickIcon = () => {
  console.log('icon');
};

// 拖拽插件函数
const start2 = (event: any) => {
  console.log('拖动开始', event);
};
const end2 = (ev: any) => {
  console.log('拖动结束2', ev);
  listVal.value = JSON.parse(JSON.stringify(listVal.value));
};
// 确认
const clikEnd = () => {
  const sortNewDat: any = [];

  listVal.value
    .filter((item: any) => {
      return item.label != '操作';
    })
    .map((item: any, i: any) => {
      if (item.label != '操作') {
        let obj = {
          iIndex: Number(i),
          IsShow: item.checkType,
          cAttributeCode: item.prop,
          cAttributeName: item.label,
          cFormPropertyCode: item.cFormPropertyCode
        };
        sortNewDat.push(obj);
      }
    });
  // tableSortFun(sortNewDat)
  emit('newList', { list: listVal.value, type: true });
};
const renew = () => {
  emit('renew');
};
// table sort
const tableSortFun = (event: any) => {
  tableSort(event).then(res => {
    console.log(res, '0998888');
  });
};
</script>
<style lang="scss" scoped>
.iconSty {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 10px;
}
.booter_but {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.listItem {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0;
}
.dragArea2 {
  max-height: 300px;
  overflow-y: auto;
  margin: 10px 0;
}
.listItem input[type='checkbox'] {
  -webkit-appearance: none;
  vertical-align: middle;
  margin-top: 0;
  background: #fff;
  border: #999 solid 1px;
  border-radius: 2 px;
  min-height: 12px;
  min-width: 12px;
  position: relative;
  cursor: pointer;
}
.listItem input[type='checkbox']:checked {
  background: var(--el-color-primary);
  border: none;
}
.listItem input[type='checkbox']:checked::after {
  content: '';
  top: 4px;
  left: 2px;
  position: absolute;
  background: transparent;
  border: #fff solid 1px;
  border-top: none;
  border-right: none;
  height: 4px;
  width: 8px;
  -moz-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}
</style>
