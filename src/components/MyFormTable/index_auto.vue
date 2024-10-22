<template>
  <div class="myTable item-body">
    <el-table
      ref="myTableRef"
      :loading="tableLoading"
      :data="tableDataVal"
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
      :row-class-name="tableRowClassName"
      :cell-style="RowStyle"
      :size="size"
    >
      <!-- 无数据时的插槽 -->
      <!-- 表格勾选框 -->
      <el-table-column
        v-if="selection"
        type="selection"
        :fixed="selectionFixed"
        :reserve-selection="true"
        :selectable="selectDisableRoom"
      >
      </el-table-column>
      <slot name="empty">{{ noData }}</slot>
      <template v-for="item in tableHeader" :key="item.prop">
        <slot v-if="item.slotName" :name="item.slotName"> </slot>
        <!-- 表格主体内容 -->
        <el-table-column
          v-else
          v-bind="item"
          min-width="30"
          :width="funWidth(item.label, item)"
        >
          <template #header v-if="item?.headerSlot">
            <span>
              {{ item.label }}
            </span>
          </template>
          <template #default="scope">
            <span
              class="butPP"
              v-if="
                (Route.name == 'neworiginalOrder' ||
                  Route.name == 'neworiginalOrderFX' ||
                  Route.name == 'newProductionOrder') &&
                item.label == '取消单号' &&
                item.prop == 'cCode'
              "
            >
              <span style="color: red" @click="clickCode(scope, item)">{{
                scope.row[item.prop]
              }}</span>
            </span>
            <span
              class="butPP"
              v-if="
                (Route.name == 'neworiginalOrder' ||
                  Route.name == 'neworiginalOrderFX' ||
                  Route.name == 'newProductionOrder') &&
                item.label == '变更单号' &&
                item.prop == 'cSourceCode'
              "
            >
              <span style="color: red" @click="clickCode(scope, item)">
                {{ scope.row[item.prop] }}</span
              >
            </span>
            <span
              class="butPP"
              v-if="
                (Route.name == 'neworiginalOrder' ||
                  Route.name == 'neworiginalOrderFX' ||
                  Route.name == 'newProductionOrder') &&
                item.label == '订单号' &&
                item.prop == 'cCode'
              "
            >
              <span style="color: red" @click="clickCode(scope, item)">{{
                scope.row[item.prop]
              }}</span>
            </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, PropType, watch, defineEmits } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
const Route = useRoute();
const myTableRef = ref();
const pagePath = ref();

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
  }
});
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
const effectMerge = ref({}) as any;
const emit = defineEmits([
  'tableHearData',
  'handleSortChange',
  'handledbClick',
  'handleSelectionChange',
  'TabCelClick'
]);
//判断当前页面路径
let router = useRouter();
watch(
  () => router,
  (newValue, oldValue) => {
    pagePath.value = newValue.currentRoute.value.name;
  },
  { immediate: true }
);
watch(
  () => props.tableColumns,
  val => {
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
      effectMerge.value = ref({}) as any;
      DH.value.map((item: string | number) => {
        effectMerge.value[item] = OneColunm.value;
      });
      //判断页面，表格合并
      if (
        Route.name === 'neworiginalOrder' ||
        Route.name === 'newProductionOrder'
      ) {
        nextTick(() => {
          setTabelRowSpan(tableDataVal.value, DH.value, effectMerge.value);
        });
      }
    }
  },
  { deep: true }
);

const funWidth = (val: any, item: any) => {
  if (Route.name == 'neworiginalOrder') {
    if (
      [
        '序号',
        '位置',
        '套数',
        '洞口高',
        '洞口宽',
        '洞口厚',
        '长',
        '宽',
        '厚',
        '数量'
      ].includes(val)
    ) {
      return '50px';
    }
    if (['名称'].includes(val)) {
      return '200px';
    } else if (
      [
        '材质名称',
        '尺寸',
        '子件编号',
        '结构',
        '分包材质',
        '产品编号',
        '安装方式',
        '开向',
        '合页',
        '锁孔',
        '磁吸代别',
        '审核失败原因'
      ].includes(val)
    ) {
      return '80px';
    } else if (
      [
        '分包序号',
        '生产编号',
        '分包条码',
        '成品名称',
        '包内件数',
        '分包类别',
        '分包材质',
        '产品序号'
      ].includes(val)
    ) {
      return '120px';
    } else {
      return null;
    }
  }
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

// 控制单选——table选择项发生变化时
const selectClick = (selection: any[], row: any) => {
  // if (selection.length > 1) {
  //     let del_row = selection.shift();
  //     myTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
  // }
};
//点击单号跳转
const clickCode = (scope: any, item: any) => {
  if (scope.row.cVouchTypeName == '总部变更单' && item.label == '订单号') {
    router.push({
      name: 'newproductionChangeOrder',
      params: {
        t: Date.now(),
        rowId: scope.row.UID
      },
      state: {
        modelCode: scope.row.cModelCode,
        row: JSON.stringify(scope.row),
        pathName: 'originalOrder'
        // title: '变更单详情'
      }
    });
  } else if (
    scope.row.cVouchTypeName == '工厂变更单' &&
    item.label == '订单号'
  ) {
    router.push({
      name: 'newProductionOrderChange',
      params: {
        t: Date.now(),
        rowId: scope.row.UID
      },
      state: {
        modelCode: scope.row.cModelCode,
        row: JSON.stringify(scope.row),
        pathName: 'originalOrder'
        // title: '变更单详情',
      }
    });
  } else if (
    scope.row.cVouchTypeName == '工厂取消单' &&
    item.label == '取消单号'
  ) {
    router.push({
      name: 'FactoryCancellationNoteView',
      params: {
        t: Date.now(),
        rowId: scope.row.UID
      },
      state: {
        modelCode: scope.row.cModelCode,
        pageType: 'view',
        row: JSON.stringify(scope.row),
        pathName: 'originalOrder'
        // title: '取消单详情',
      }
    });
  } else if (
    scope.row.cVouchTypeName == '总部取消单' &&
    item.label == '取消单号'
  ) {
    console.log('22');
    router.push({
      name: 'newproductionCancellationOrder',
      params: {
        t: Date.now(),
        rowId: scope.row.UID
      },
      state: {
        modelCode: scope.row.cModelCode,
        row: JSON.stringify(scope.row),
        pathName: 'originalOrder'
        // title: '取消单详情'
      }
    });
    //返修单
  } else if (
    scope.row.cVouchTypeName == '生产反馈单' &&
    item.label == '订单号'
  ) {
    if (Route.name == 'neworiginalOrder') {
      router.push({
        name: 'neworiginalOrderFX',
        params: {
          t: Date.now(),
          rowId: scope.row.UID
        },
        state: {
          modelCode: scope.row.cModelCode,
          row: JSON.stringify(scope.row),
          pathName: 'neworiginalOrder'
          // title: '返修单详情'
        }
      });
    } else if (Route.name == 'newProductionOrder') {
      router.push({
        name: 'newProductOrderFX',
        params: {
          t: Date.now(),
          rowId: scope.row.UID
        },
        state: {
          modelCode: scope.row.cModelCode,
          row: JSON.stringify(scope.row),
          pathName: 'newProductionOrder'
          // title: '返修单详情'
        }
      });
    }
  }
};

// 重置
const clearFilter = () => myTableRef.value!.clearFilter();

//表格合并
interface SpanMethodProps {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}

//tableData:表格数据，fieldArr：要合并的列，effectMerge：参照对象
const setTabelRowSpan = (tableData: any, fieldArr: any, effectMerge: any) => {
  let hashObj = {} as any;
  tableData.forEach((item: any, idx: number) => {
    item.mergeCell = fieldArr;
    fieldArr.forEach((field: any, index: any) => {
      let judgeArr = fieldArr.slice(0, index + 1);
      if (effectMerge[field]) {
        judgeArr = [...effectMerge[field], field];
      }
      const rowSpan = `rowspan_${field}`;
      if (idx === 0) {
        item[rowSpan] = 1;
        hashObj[rowSpan] = idx;
      } else if (
        judgeArr.every(
          (e: string | number) =>
            !!(item[e] && item[e] === tableData?.[idx - 1]?.[e])
        )
      ) {
        // 判断是否所在行的列对应的值全部相同，并且此列的值不为空
        // 是：合并行
        item[rowSpan] = 0;
        tableData[hashObj[rowSpan]][rowSpan] += 1;
      } else {
        // 否：完成一次同类合并。lastItem重新赋值，进入下一次合并计算。
        item[rowSpan] = 1;
        hashObj[rowSpan] = idx;
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
    if (columnIndex == 0) {
      const rowspan = row[`rowspan_${OneColunm.value}`];
      if (rowspan === undefined) {
        return { rowspan: 1, colspan: 1 };
      } else {
        if (rowspan) {
          return { rowspan, colspan: 1 };
        } else {
          return { rowspan: 0, colspan: 0 };
        }
      }
    } else {
      if (row.mergeCell) {
        if (row.mergeCell.includes(column.property)) {
          const rowspan = row[`rowspan_${column.property}`];
          if (rowspan) {
            return { rowspan, colspan: 1 };
          } else {
            return { rowspan: 0, colspan: 0 };
          }
        }
      }
    }
  }
};

//单元格高亮
const tableRowClassName = ({
  row,
  rowIndex
}: {
  row: any;
  rowIndex: number;
}) => {
  if (rowIndex % 2 === 1) {
    //单行
    return 'singel';
  } else if (rowIndex % 2 === 0) {
    //双行
    return 'duble-row';
  }
  return '';
};
//订单取消的状态
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const RowStyle = ({ row, column, rowIndex, columnIndex }) => {
  // console.log( row, column);

  if (row.Items_cDefindParm03 == '是') {
    return {
      background: '#e3e3e3'
    };
  } else {
    return {
      background: '#fff'
    };
  }
};
// 暴露方法
defineExpose({ handleRemoveSelectionChange, clearFilter });
</script>

<style lang="scss" scoped>
.butPP {
  cursor: pointer;
}
.myTable {
  width: 100%;
}

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

.el-table :deep(.el-table__header th) {
  border-color: #000 !important;
}
// //表格下面
::v-deep .el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #000 !important;
}
// // 列表中间的竖线
::v-deep .el-table--border td,
.el-table--border th {
  border-right: 1px solid #000 !important;
}

//表格外围4条线

.el-table--group {
  border: 1px solid #000 !important;
}
/**
改变表格内竖线颜色
 */
.el-table--border td,
.el-table--border th,
.el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
  border-right: 1px solid #000 !important;
}
/**
改变表格内行线颜色
 */
.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #000 !important;
}

.el-table thead tr th {
  border-color: #000;
}
// 取消hover的状态
::v-deep .el-table tbody tr:hover > td {
  background-color: none !important;
}
::v-deep .el-table {
  --el-table-border-color: #000 !important;
}
//-------------隐藏滚动条-----------
// :deep(.el-scrollbar__wrap) {
//   overflow-x: hidden !important;
// }
// :deep(.el-scrollbar__bar.is-horizontal) {
//   height: 0 !important;
// }

// 单元格高亮
::v-deep .el-table .singel {
  //   --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
::v-deep .el-table .duble-row {
  //   --el-table-tr-bg-color: var(--el-color-success-light-9);
}
// ::v-deep .el-table {
//     width: 100%;
// }

// ::v-deep .el-table__header-wrapper table,
// ::v-deep .el-table__body-wrapper table {
//     width: 100% !important;
// }

// ::v-deep .el-table__body,
// ::v-deep .el-table__footer,
// ::v-deep .el-table__header {
//     table-layout: auto !important;
// }

::v-deep .el-table .cell {
  text-overflow: unset;
}

::v-deep .el-table__cell {
  p {
    margin: 0;
    margin-block-start: 2px;
    margin-block-end: 2px;
  }
}
</style>
