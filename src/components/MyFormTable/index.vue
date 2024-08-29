<template>
  <div class="myTable">
    <template v-if="tableHeader.length > 0">
      <el-table
        ref="myTableRef"
        :loading="tableLoading"
        :data="tableDataValVVV"
        :height="tableHeight"
        style="width: 100%"
        :border="tableBorder"
        :row-key="getRowKey"
        @selection-change="handleSelectionChange"
        @select="selectClick"
        @sort-change="handleSortChange"
        @row-dblclick="handledbClick"
        :span-method="objectSpanMethod"
        aria-disabled="false"
        fit
        :size="size"
        :max-height="props.maxHeight"
        :row-class-name="tableRowClassName"
        :cell-style="{ padding: '0', height: '12px', margin: '0' }"
        scrollbar-always-on
      >
        <!-- 无数据时的插槽 -->
        <slot name="empty">{{ noData }}</slot>
        <!-- 表格勾选框 -->
        <el-table-column v-if="indexTable" type="index" width="200" />
        <el-table-column
          v-if="selection"
          type="selection"
          :fixed="selectionFixed"
          :reserve-selection="true"
          :selectable="selectDisableRoom"
        >
        </el-table-column>
        <el-table-column width="45" fixed>
          <template #header> 序号 </template>
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 表格主体内容 -->
        <template v-for="item in tableHeader" :key="item.prop">
          <!-- 插槽 -->
          <slot v-if="item.slotName" :name="item.slotName"> </slot>

          <el-table-column
            v-else
            v-bind="item"
            :fixed="item.fixed"
            :min-width="item.minwidth"
            :sortable="item.sortable"
            filter-multiple
          >
            <template #header v-if="item?.headerSlot">
              <span>
                {{ item.label }}
              </span>
            </template>
            <template #default="scope">
              <span
                v-if="
                  Route.name == 'material' && item.label == '计量单位应用类型'
                "
              >
                <span v-if="scope.row[item.prop] == 4">库存计量单位</span>
                <span v-if="scope.row[item.prop] == 3">销售计量单位</span>
                <span v-if="scope.row[item.prop] == 2">生产计量单位</span>
                <span v-if="scope.row[item.prop] == 1">采购计量单位</span>
              </span>
              <span
                v-else-if="Route.name == 'material' && item.label == '是否默认'"
              >
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span v-else-if="item.label == '是否必要节点'">
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span
                v-else-if="
                  Route.name == 'addWorkingShift' && item.label == '是否跨天'
                "
              >
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span
                v-else-if="
                  Route.name == 'addWorkingShift' && item.label == '是否考勤'
                "
              >
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span
                v-else-if="
                  Route.name == 'AddCalendlerWork' && item.label == '是否考勤'
                "
              >
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span
                v-else-if="
                  Route.name == 'AddCalendlerWork' && item.label == '是否跨天'
                "
              >
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span
                v-else-if="
                  Route.name == 'materialEdit' && item.label == '是否默认'
                "
              >
                <span v-if="scope.row[item.prop] == true">是</span>
                <span v-if="scope.row[item.prop] == false">否</span>
              </span>
              <span v-else-if="Route.name == 'newProductionOrderChange'">
                <span v-if="scope.$index % 2 == 0">
                  {{ scope.row[item.prop] }}
                </span>
                <span
                  v-else
                  :style="{
                    color: labelSty(
                      scope.row[item.prop],
                      item.prop,
                      scope.$index
                    )
                      ? 'red'
                      : ''
                  }"
                >
                  {{ scope.row[item.prop] }}
                </span>
              </span>
              <span v-else>
                <!-- {{ scope.row[item.prop] }} -->
                <el-tooltip
                  effect="light"
                  :content="funContent(scope.row[item.prop], item)"
                  placement="top"
                  :hide-after="0"
                  :show-after="1000"
                >
                  <p v-if="item.prop == 'dCreateTime' || item.prop == 'dDate'">
                    {{ formatDate(scope.row[item.prop]) }}
                  </p>
                  <p v-else class="tableTextSty" @click="DownLoad(scope, item)">
                    {{ scope.row[item.prop] }}
                  </p>
                </el-tooltip>
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
import { ref, nextTick, PropType, watch, computed, defineEmits } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import ImgPreview from '@/components/ImgPrive/index.vue'; //图片预览
import { getMergeCells } from '@/utils/myTable';
const Route = useRoute();
const disabled = ref(false);
const myTableRef = ref();
const pagePath = ref();
const imgIshow = ref(false); //预览图片
//判断当前页面路径
let router = useRouter();

watch(
  () => router,
  (newValue, oldValue) => {
    pagePath.value = newValue.currentRoute.value.path;
  },
  { immediate: true }
);
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
const selectData = ref([]);
const selInpVal = ref('');
const checkAll = ref(false);
const isIndeterminate = ref(true);
const checkedCities = ref(['Shanghai', 'Beijing']);
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'];
const ImgName = ref('');
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
  tableHB: {
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
  indexTable: {
    // 表格序号
    type: Boolean,
    default: () => {
      return false;
    }
  },
  selectionType: {
    // 勾选框  true 多选  false 单选选
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
    default: () => {
      return 'default';
    }
  },
  maxHeight: {
    type: String as any,
    default: () => 'calc(100vh - 445px)'
  }
});
const tableRowClassName: any = ({ row, rowIndex }) => {
  if (selectData.value.map(i => i.UID).includes(row.UID)) {
    return 'success-row';
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
//表格合并数据
const HBData = ref([]) as any;
let DH = ref([]) as any;
let Colunm = ref([]) as any;
const BaseColum = ref([]) as any;
const OneColunm = ref([]) as any;
const emit = defineEmits([
  'tableHearData',
  'handleSortChange',
  'handledbClick',
  'handleSelectionChange'
]);
watch(
  () => props.tableColumns,
  val => {
    //所有列（表头）
    tableHeader.value = val.filter((item: any) => {
      return item.checkType;
    });
    Colunm.value = tableHeader.value.filter((item: { prop: any }) => {
      return item.prop;
    });
    if (props.tableHB) {
      //需要合并的列的字段
      HBData.value = tableHeader.value.filter((item: { DefinedParm2: any }) => {
        return item.DefinedParm2;
      });
      DH.value = HBData.value.map((item: { prop: any }) => {
        return item.prop;
      });
      //参照列
      BaseColum.value = tableHeader.value.filter(
        (item: { DefinedParm1: any }) => {
          return item.DefinedParm1;
        }
      );
      OneColunm.value = BaseColum.value.map((item: { prop: any }) => {
        return item.prop;
      });
    }
  },
  { deep: true }
);
watch(
  () => props.tableData,
  val => {
    //表格数据
    tableDataVal.value = JSON.parse(JSON.stringify(val));
    tableInit.value = JSON.parse(JSON.stringify(val));
    if (props.tableHB) {
      //要合并的列：['参照列']
      const effectMerge = ref({}) as any;
      DH.value.map((item: string | number) => {
        effectMerge.value[item] = OneColunm.value;
      });
      //判断页面，表格合并
      if (pagePath.value === '/OrderCorrelation/neworiginalOrder') {
        setTabelRowSpan(tableDataVal.value, DH.value, effectMerge);
      }
    }
  },
  { deep: true }
);
const demo = () => {
  let len = tableHeader.value.filter((item: any) => {
    return item.popoverVal !== '';
  });
  if (len.length > 1) {
    tableHeader.value.forEach((item: any) => {
      if (item.popoverVal) {
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
const formatDate = (date: any) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
const funContent = (val: any, item: any) => {
  // console.log(val,typeof val,"-=-vvaaall");
  let str = '';
  if (typeof val == 'number') {
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
const downloadFile = (url: any, filename: string) => {
  let a = document.createElement('a');
  a.href = url;
  a.download = filename + '.' + url.split('.').pop();
  a.click();
  a.remove();
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
  if (item.label == '附件名称') {
    downloadFile(scope.row.cFileUrl, scope.row.cFileName);
  }
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

const labelSty = (val: any, prop: any, i: any) => {
  // console.log(prop,i,"---sss");
  // console.log(tableDataValVVV,"---tableDataValVVV");

  if (prop) {
    if (i > 0) {
      // console.log(val,tableDataValVVV.value[i-1][prop]);

      if (val != tableDataValVVV.value[i - 1][prop]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
//鼠标移动事件
// 离开
const showThing = () => {
  //可以查看提示内容时，disabled.value为false,这时当我鼠标离开，就不显示箭头//////
  nextTick(() => {
    if (disabled.value === true) {
      show.value = false;
    }
    if (disabled.value === false) {
      show.value = true;
    }
  });
};
// 进入
const showThings = () => {
  nextTick(() => {
    if (disabled.value === false) {
      show.value = false;
      // console.log(disabled.value, '进入');
    }
  });
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

const selectDisableRoom = (row: any, index: any) => {
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
  selectData.value = val;
  emit('handleSelectionChange', val);
};
// 清除多选
const handleRemoveSelectionChange = () => {
  nextTick(() => {
    myTableRef.value!.clearSelection();
  });
};

// 控制单选——table选择项发生变化时
const selectClick = (selection: any[], row: any) => {
  if (!props.selectionType) {
    if (selection.length > 1) {
      let del_row = selection.shift();
      myTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    }
  }
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
const popHide = () => {
  selInpVal.value = '';
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
// 重置
const clearFilter = () => {
  myTableRef.value!.clearFilter();
};
//表格合并
interface SpanMethodProps {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}
//tableData:表格数据，fieldArr：要合并的列，effectMerge：参照对象
const setTabelRowSpan = (tableData: any, fieldArr: any, effectMerge: any) => {
  let lastItem = {} as any;
  fieldArr.forEach((field: any, index: any) => {
    let judgeArr = fieldArr.slice(0, index + 1);
    if (effectMerge[field]) {
      judgeArr = [...effectMerge[field], field];
    }
    tableData.forEach((item: any) => {
      item.mergeCell = fieldArr;
      const rowSpan = `rowspan_${field}`;
      // 判断是否合并到上个单元格。
      // if (judgeArr.every((e: string | number) => lastItem[e] === item[e] && item[e] !== null)) {
      if (
        judgeArr.every(
          (e: string | number) => lastItem[e] === item[e] && item[e]
        )
      ) {
        // 判断是否所在行的列对应的值全部相同，并且此列的值不为空
        // 是：合并行
        item[rowSpan] = 0;
        lastItem[rowSpan] += 1;
      } else {
        // 否：完成一次同类合并。lastItem重新赋值，进入下一次合并计算。
        item[rowSpan] = 1;
        lastItem = item;
      }
    });
  });
};
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex
}: SpanMethodProps) => {
  if (props.tableHB) {
    if (row.mergeCell.includes(column.property)) {
      const rowspan = row[`rowspan_${column.property}`];
      if (rowspan) {
        return { rowspan: rowspan, colspan: 1 };
      } else {
        return { rowspan: 0, colspan: 0 };
      }
    }
  }
};
// 暴露方法
defineExpose({ handleRemoveSelectionChange, clearFilter, tableDataVal });
</script>

<style lang="scss" scoped>
.s-btn {
  &:hover {
    .show-btn {
      opacity: 1;
    }
  }
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

::v-deep .el-table__row.success-row {
  --el-table-tr-bg-color: #fab6b6 !important;
  --el-bg-color: #fab6b6 !important;
}
// .show-btn {
//     opacity: 0;
// }
// ::v-deep .el-table{
//     width: 100%;
// }
// ::v-deep .el-table__header-wrapper table,::v-deep .el-table__body-wrapper table{
//     width: 100% !important;
// }
// ::v-deep .el-table__body,::v-deep .el-table__footer,::v-deep .el-table__header{
//     table-layout: auto !important;
// }

::v-deep .el-table__cell {
  p {
    margin: 0;
    margin-block-start: 2px;
    margin-block-end: 2px;
  }
}
</style>
