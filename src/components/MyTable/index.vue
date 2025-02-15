<template>
  <div class="myTable" style="width: 100%">
    <template v-if="tableHeader.length > 0">
      <el-table
        ref="myTableRef"
        :data="tableDataValVVV"
        :height="props.tableHeight"
        style="width: 100%"
        :border="tableBorder"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        @row-dblclick="handledbClick"
        :size="size"
        :max-height="props.maxHeight"
        :row-class-name="tableRowClassName"
        :cell-style="{
          padding: '0',
          height: '12px',
          margin: '0'
        }"
        scrollbar-always-on
        v-loading="loading"
      >
        <!-- 无数据时的插槽 -->
        <slot name="empty">{{ noData }}</slot>
        <!-- 表格勾选框 -->
        <el-table-column
          v-if="selection"
          type="selection"
          :fixed="selectionFixed"
          :reserve-selection="true"
          :selectable="selectDisableRoom"
        >
        </el-table-column>

        <el-table-column width="45" fixed v-if="showIndex">
          <template #header> 序号 </template>
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 浮动操作按钮 占时弃用-->
        <!-- <el-table-column fixed="right" align="right" class-name="s-btn">

                    <el-tooltip :disabled="disabled" placement="left" effect="light" :show-arrow="false">
                        <template #content="scope">
                            <slot name="opt" :scope="{ scope }"></slot>
                        </template>
                        <el-button  :class="disabled ? '' : 'show-btn'" text @click="disabled = !disabled"
                            :icon="disabled ? DArrowLeft : DArrowRight"></el-button>
                    </el-tooltip>
                </el-table-column> -->

        <!-- 表格主体内容 -->
        <template v-for="(item, index) in tableHeader" :key="item.prop">
          <!-- 插槽 -->
          <slot v-if="item.slotName" :name="item.slotName"> </slot>
          <el-table-column
            v-else
            v-bind="item"
            :fixed="item.fixed"
            :min-width="calcWidth(item)"
            :width="item.minwidth"
            :sortable="item.sortable"
            filter-multiple
            :filter-method="filterMethod"
            filter-placement="top-start"
            :filters="item.filters"
          >
            <template #header v-if="item?.headerSlot">
              <div style="display: inline-flex; justify-items: center">
                <div>{{ item.label }}</div>
                <!-- <el-popover placement="top" :width="160" trigger="click" @hide="popHide"> -->
                <!-- 列搜索 -->
                <!-- <template #reference>
                                    <el-icon @click="clickIcon(scope)">
                                        <Filter />
                                    </el-icon>
                                </template>
                                <el-input v-model="selInpVal" class="w-50 m-2" size="small" placeholder="请输入"
                                    :suffix-icon="Search"/> -->

                <!-- <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                                    <el-checkbox v-for="city in cities" :key="city" :label="city">{{
                                        city
                                    }}</el-checkbox>
                                </el-checkbox-group>
                                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                                    @change="handleCheckAllChange">全选</el-checkbox><br>
                                <el-button type="info" round size="small" style="margin-left:13px ;">取消</el-button>
                                <el-button type="danger" round size="small" >确定</el-button> -->
                <!-- </el-popover> -->
                <!-- 锁 -->
                <div class="extra-icon">
                  <!-- <el-icon
                    v-if="item.lock === true"
                    @click="() => clickLock(index, false)"
                  >
                    <Lock style="color: #999" />
                  </el-icon>
                  <el-icon v-else @click="() => clickLock(index, true)">
                    <Unlock />
                  </el-icon> -->
                  <!-- 排序 升-->
                  <el-icon
                    v-if="item.slot == 'asc'"
                    @click="() => clickSort(index, 'desc')"
                  >
                    <CaretTop />
                  </el-icon>
                  <!-- 排序 降-->
                  <el-icon
                    v-else-if="item.slot == 'desc'"
                    @click="() => clickSort(index, '')"
                  >
                    <CaretBottom />
                  </el-icon>
                  <!-- 排序 默认-->
                  <el-icon v-else @click="() => clickSort(index, 'asc')">
                    <DCaret />
                  </el-icon>
                </div>
              </div>
            </template>
            <template #default="scope">
              <div
                v-if="
                  (Route.name == 'originalOrder' ||
                    Route.name == 'productionOrder') &&
                  !item.label.includes('原因') &&
                  !item.label.includes('客户姓名')
                "
              >
                <p v-if="item.prop == 'dCreateTime' || item.prop == 'dDate'">
                  {{ formatDate(scope.row[item.prop]) }}
                </p>
                <p v-else @click="DownLoad(scope, item)">
                  {{ formatImage(scope.row[item.prop]) }}
                </p>
              </div>
              <el-tooltip
                v-else
                effect="light"
                :content="funContent(scope.row[item.prop], item)"
                placement="top"
              >
                <p v-if="item.prop == 'dCreateTime' || item.prop == 'dDate'">
                  {{ formatDate(scope.row[item.prop]) }}
                </p>
                <p v-else class="tableTextSty" @click="DownLoad(scope, item)">
                  {{ formatImage(scope.row[item.prop]) }}
                </p>
              </el-tooltip>
              <span
                class="butPP"
                v-if="
                  (Route.name == 'RepairRecord' && item.label == '照片1') ||
                  item.label == '照片2' ||
                  item.label == '照片3'
                "
              >
                <span @click="DownLoad(scope, item)"></span>
              </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </template>
    <!-- 显示预览图片 -->
    <ImgPreview v-model="imgIshow" :imgs="srcList" />
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  nextTick,
  PropType,
  watch,
  computed,
  defineEmits,
  getCurrentInstance
} from 'vue';
import {
  Filter,
  Search,
  Lock,
  Unlock,
  DCaret,
  CaretTop,
  CaretBottom,
  DArrowRight,
  DArrowLeft
} from '@element-plus/icons-vue';
import {
  ElTable,
  ElTableColumn,
  ElPopover,
  ElIcon,
  ElInput,
  ElCheckboxGroup,
  ElCheckbox,
  ElButton
} from 'element-plus';
import { useRoute } from 'vue-router';
import ImgPreview from '@/components/ImgPrive/index.vue'; //图片预览
const disabled = ref(false);
const myTableRef = ref();
const Route = useRoute();
//选中数据
interface dataType {
  id?: string;
  date?: string;
  name?: string;
  name3?: string;
  address?: string;
}
interface columnType {
  label: string;
  prop?: string;
  width?: string;
  headerSlot?: boolean;
  slotName?: string;
  fixed?: string;
  aline?: string;
  minwidth?: string;
  sortable?: boolean;
  slot?: number;
}
const imgIshow = ref(false); //预览图片
const ImgName = ref('');
const selectData = ref([]);
const selInpVal = ref('');
const checkAll = ref(false);
const loading = ref(false);
const isIndeterminate = ref(true);
const checkedCities = ref(['Shanghai', 'Beijing']);
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'];
const props = defineProps({
  tableData: {
    // 表格总数据
    type: Array as PropType<dataType[]>,
    default: () => {
      return [];
    }
  },
  tableColumns: {
    // 表头数据
    type: Array as PropType<columnType[]>,
    default: () => {
      return [];
    }
  },
  noData: {
    //表格无数据提示
    type: String,
    default: () => {
      return '暂无数据';
    }
  },
  tableLoading: {
    // 表格加载
    type: Boolean,
    default: () => {
      return false;
    }
  },
  tableHeight: {
    // 表格高度
    type: [Number, String],
    default: () => {
      return null;
    }
  },
  tableBorder: {
    //表格纵向边框
    type: Boolean,
    default: false
  },
  selectionFixed: {
    // 列固定
    type: Boolean || String,
    default: () => {
      return false;
    }
  },
  fixed: {
    // 列固定
    type: Boolean || String,
    default: () => {
      return false;
    }
  },
  selection: {
    // 勾选框
    type: Boolean,
    default: () => {
      return false;
    }
  },
  selectDisableRoom: {
    type: Function,
    default: () => {
      return;
    }
  },
  size: {
    type: String as any,
    default: () => 'small'
  },
  maxHeight: {
    type: String as any,
    default: () => 'calc(100vh - 445px)'
  },
  showIndex: {
    type: Boolean,
    default: () => false
  }
});

const tableRowClassName: any = ({ row, rowIndex }) => {
  let uniqueField = 'UID';
  if (Route.name === 'MinMaterielStorage') {
    uniqueField = 'cKeyCode';
  }
  if (selectData.value.map(i => i[uniqueField]).includes(row[uniqueField])) {
    return 'hover-row';
  }
  if (Route.name == 'TaskListQuery') {
    if (row.iStatus == '1') {
      return 'success-row';
    }
  }
  return '';
};

const tableHeader: any = ref(
  props.tableColumns.filter((item: any) => {
    return item.checkType;
  })
);
const tableDataVal: any = ref([]);
const tableInit: any = ref([]);

const emit = defineEmits([
  'tableHearData',
  'handleSortChange',
  'handledbClick',
  'handleSelectionChange'
]);
watch(
  () => props.tableLoading,
  newVal => {
    loading.value = newVal;
  },
  { deep: true, immediate: true }
);
watch(
  () => props.tableColumns,
  val => {
    tableHeader.value = val.filter((item: any) => {
      return item.checkType;
    });
    // demo()
  },
  { deep: true }
);
watch(
  () => props.tableData,
  val => {
    tableDataVal.value = JSON.parse(JSON.stringify(val));
    tableInit.value = JSON.parse(JSON.stringify(val));
  },
  { deep: true }
);

const calcWidth = (row: { label: any }) => {
  if (Route.name === 'TaskReleaseRecord') {
    switch (row.label) {
      case '业务类型':
        return 50;
      case '是否接收':
      case '是否成功':
        return 40;
      case '计划接收者编码':
      case '计划接收者':
      case '计划接收者名称':
      case '实际接收者编码':
      case '实际接收者名称':
        return 70;
      default:
        return null;
    }
  }
  if (Route.name === 'PackageProgram') {
    switch (row.label) {
      case '规则编码':
      case '合包类型编码':
      case '正常基数':
      case '超标基数':
        return 50;
      default:
        return null;
    }
  }
  if (Route.name == 'originalOrder' || Route.name == 'productionOrder') {
    if (row.label.includes('单号') && Route.name == 'originalOrder') {
      return 90;
    }
    if (Route.name == 'productionOrder') {
      switch (row.label) {
        case '(P/F)单号':
          return 100;
        case '来源单号':
        case 'S单号':
          return 80;
      }
    }
    switch (row.label) {
      case '是否挂起':
      case '返修次数':
      case '所属城市':
      case '材质类型':
        return 60;
    }
    return null;
  } else {
    let flexWidth = 50;
    for (const char of row.label) {
      if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
        // 如果是英文字符，为字符分配8个单位宽度
        flexWidth += 8;
      } else if (char >= '\u4e00' && char <= '\u9fa5') {
        // 如果是中文字符，为字符分配20个单位宽度
        flexWidth += 20;
      } else {
        // 其他种类字符，为字符分配5个单位宽度
        flexWidth += 15;
      }
    }
    if (flexWidth < 50) {
      // 设置最小宽度
      flexWidth = 200;
    }
    if (flexWidth > 250) {
      // 设置最大宽度
      flexWidth = 250;
    }
    return flexWidth + 'px';
  }
};
const demo = () => {
  let len = tableHeader.value.filter((item: any) => {
    return item.popoverVal !== '';
  });
  if (len.length > 1) {
    tableHeader.value.forEach((item: any) => {
      if (item.popoverVal) {
        console.log(item.popoverVal, '--===item.popoverVal');
        console.log(item, '--===item');
        const tableDataValVVV = tableInit.value.filter(
          (data: any) =>
            !item.popoverVal || data[item.prop].includes(item.popoverVal)
        );

        tableDataVal.value = tableDataValVVV;
      }
    });
  } else {
    tableDataVal.value = tableInit.value;
  }
};
const conRef = ref();
const tooltipShow = ref(false);
const headProper = ref('');
const ShowTop = () => {
  tooltipShow.value = !tooltipShow.value;
};

const show = ref(false);
// table  过滤
const tableDataValVVV = computed(() =>
  tableDataVal.value.filter(
    (data: any) =>
      !selInpVal.value || data[headProper.value].includes(selInpVal.value)
  )
);
const filterMethod = (value: string, row: any, column: any) => {
  const property = column['property'];
  return row[property] === value; //绝对匹配
  // return row[property].includes(value)  //模糊匹配
};
// 设备详情页面图片预览/文件下载
const srcList = ref([]) as any;
const PriveImg = (obj: any) => {
  srcList.value = [];
  let arr = obj.split('&');
  ImgName.value = arr[0];
  let url = arr[1];
  imgIshow.value = true;
  srcList.value.push(url);
};
const DownLoad = (scope: any, item: any) => {
  if (
    item.label == '文件名称1' ||
    item.label == '图片1' ||
    item.label == '照片1'
  ) {
    PriveImg(scope.row.FileName1);
  }
  if (
    item.label == '文件名称2' ||
    item.label == '图片2' ||
    item.label == '照片2'
  ) {
    PriveImg(scope.row.FileName2);
  }
  if (
    item.label == '文件名称3' ||
    item.label == '图片3' ||
    item.label == '照片3'
  ) {
    PriveImg(scope.row.FileName3);
  }
};
// 排序
const clickLock = (i: number, val: boolean) => {
  tableHeader.value[i].lock = val;
  if (val) {
    tableHeader.value[i].fixed = 'left';
  } else {
    delete tableHeader.value[i].fixed;
  }
};
// 排序
const clickSort = (i: number, val: string) => {
  tableHeader.value[i].slot = val;
  emit('tableHearData', { value: tableHeader.value });
};
// 表格行数据的Key
const getRowKey = (row: any) => {
  return row.id;
};
//表格不让勾选
const selectDisableRoom = (row: any, index: any) => {
  if (
    Route.name == 'originalOrder' ||
    Route.name == 'PurchaseAudit' ||
    Route.name == 'markDelivery'
  ) {
    if (
      row.iStatusName == '已拆分' ||
      row.iStatusName == '已审核' ||
      row.iStatusName == '驳回' ||
      row.iStatusName == '提交'
    )
      return false;
  } else {
    return true;
  }
  if (row.select) {
    return false;
  }
  return true;
};

const handelData = (val: any) => {
  if (val == '0') {
    return '0';
  } else if (val) {
    return val;
  }
  return '--';
};

// 排序
const handleSortChange = (val: any) => {
  emit('handleSortChange', val);
};
//双击事件
const handledbClick = (val: any) => {
  emit('handledbClick', val);
  // console.log(val);
};
// 多选事件
const handleSelectionChange = (val: any) => {
  console.log('table-多选--', val);
  selectData.value = val;
  emit('handleSelectionChange', val);
};
// 清除多选
const handleRemoveSelectionChange = () => {
  nextTick(() => {
    myTableRef.value!.clearSelection();
  });
};
//双击事件
const handleClick = (val: any) => {
  console.log(val);
};
// tableHear 操作
const clickIcon = (val: any) => {
  console.log('click icon--', val);
  selInpVal.value = '';
  headProper.value = val.column.property;
};
// 多选框api
const handleCheckAllChange = (val: any) => {
  checkedCities.value = val ? cities : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: any) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
};
const tablefilter = () => {
  tableHeader.value.forEach((aItem: any) => {
    let filData = [] as any;
    tableDataVal.value.forEach((bItem: any) => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item: { text: any }, index: any, self: any[]) => {
          const i = self.findIndex((t: { text: any }) => t.text === item.text);
          return i === index;
        }
      );
    }
  });
};
const formatDate = (date: any) => {
  if (!date) {
    return '';
  }
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

const formatImage = (text: string) => {
  if (text === 0) return 0;
  if (!text) return '';
  if (!text.toString().includes('&')) return text;
  const [name, url] = text.split('&');
  if (!url) {
    return text;
  } else {
    return name;
  }
};
const funContent = (val: any, item: any) => {
  let str = '';
  console.log(val);
  if (item.label?.includes('文件') && val?.includes('&')) {
    str = formatImage(val);
  } else if (typeof val == 'number') {
    str = val.toString();
  } else if (typeof val == 'boolean') {
    str = val.toString();
  } else {
    if (Route.name == 'ProductionOrderChange' && item.prop == 'dCreateTime') {
      str = formatDate(val);
    } else {
      str = val;
    }
  }
  return str;
};
// 重置
const clearFilter = () => {
  myTableRef.value!.clearFilter();
};
// 暴露方法
defineExpose({ handleRemoveSelectionChange, clearFilter });
</script>

<style lang="scss" scoped>
.s-btn {
  &:hover {
    .show-btn {
      opacity: 1;
    }
  }
}

.show-btn {
  opacity: 0;
}
.tableTextSty {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
::v-deep .el-table .cell {
  line-height: 20px;
}
::v-deep .el-table--small .el-table__cell {
  padding: 0px;
}

::v-deep .el-table__row.hover-row {
  --el-table-tr-bg-color: #fab6b6 !important;
  --el-bg-color: #fab6b6 !important;
}

::v-deep .el-table__row.success-row {
  --el-table-tr-bg-color: #32cd32 !important;
  --el-bg-color: #32cd32 !important;
}

::v-deep .el-table__cell {
  p {
    margin: 0;
    margin-block-start: 2px;
    margin-block-end: 2px;
  }
}

:deep(.el-table__cell) {
  .extra-icon,
  .el-table__column-filter-trigger {
    display: none;
  }

  :hover {
    .el-table__column-filter-trigger {
      width: fit-content;
      display: inline-flex;
    }
    .extra-icon {
      display: block;
    }
  }
}

// :deep(.el-popper) {
//   span {
//     max-width: 400px;
//     display: flex;
//   }
// }
</style>
