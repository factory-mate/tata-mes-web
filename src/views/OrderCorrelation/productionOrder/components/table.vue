<template>
  <div>
    <el-table
      :data="tableDataVal"
      style="width: 100%"
      :span-method="objectSpanMethod"
    >
      <el-table-column
        prop="items_iIndex"
        label="行号"
        align="center"
        :min-width="width"
      />
      <el-table-column
        prop="items_cInvName"
        label="成品"
        align="center"
        :min-width="width"
      />
      <el-table-column label="子件" align="center" :min-width="width">
        <el-table-column
          prop="itemsss_cInvCode"
          label="编码"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="itemsss_cInvName"
          label="名称"
          align="center"
          :min-width="width"
        />
      </el-table-column>
      <el-table-column
        prop="bom_s_cInvGroupName"
        label="结构"
        align="center"
        :min-width="width"
      />
      <!-- <el-table-column label="结构"  align="center" :min-width="width">
                <el-table-column prop="bom_s_cInvGroupName" label="一级"  align="center" :min-width="width"/>
                <el-table-column prop="bom_s_s_cInvGroupName" label="二级"  align="center" :min-width="width"/>
                <el-table-column prop="bom_s_s_s_cInvGroupName" label="三级"  align="center" :min-width="width"/>
            </el-table-column> -->
      <el-table-column label="物料" align="center" :min-width="width">
        <el-table-column
          prop="cInvGroupName"
          label="料组"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cBOMDefindParm15"
          label="名称"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cBOMDefindParm06"
          label="颜色"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cUnitName"
          label="单位"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="nQuantity"
          label="数量"
          align="center"
          :min-width="width"
        />
      </el-table-column>
      <el-table-column label="尺寸" align="center" :min-width="width">
        <el-table-column
          prop="X"
          label="长"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="Y"
          label="宽"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="Z"
          label="厚"
          align="center"
          :min-width="width"
        />
      </el-table-column>
      <el-table-column label="材质" align="center" :min-width="width">
        <el-table-column
          prop="cDynamicsParm06"
          label="名称"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cDefindParm19"
          label="类型"
          align="center"
          :min-width="width"
        />
      </el-table-column>
      <el-table-column
        prop="cDynamicsParm03"
        label="板材"
        align="center"
        :min-width="width"
      />
      <el-table-column label="投料" align="center" :min-width="width">
        <el-table-column
          prop="cBOMDefindParm02"
          label="数量"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cBOMDefindParm01"
          label="规格"
          align="center"
          :min-width="width"
        />
      </el-table-column>
      <!-- <el-table-column prop="cBOMDefindParm07" label="线框类型"  align="center" :min-width="width"/> -->
      <el-table-column label="线框" align="center" :min-width="width">
        <el-table-column
          prop="cBOMDefindParm07"
          label="类型"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cBOMDefindParm08"
          label="根数"
          align="center"
          :min-width="width"
        />
      </el-table-column>
      <el-table-column label="模型" align="center" :min-width="width">
        <el-table-column
          prop="cBOMDefindParm09"
          label="名称"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cBOMDefindParm10"
          label="策略"
          align="center"
          :min-width="width"
        />
        <el-table-column
          prop="cBOMDefindParm11"
          label="规则"
          align="center"
          :min-width="width"
        />
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  PropType,
  watch,
  computed,
  defineEmits,
  getCurrentInstance,
  onMounted
} from 'vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElLoading
} from 'element-plus';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import FilterForm from '@/components/Filter/index.vue';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
const props = defineProps({
  rowId: {
    type: String,
    default: () => ''
  },
  tableData: {
    type: Array,
    default: () => []
  },
  autoType: {
    type: Boolean,
    default: () => false
  }
});
const width = ref('30px');
const Conditions = ref('');
const id = ref('');
const tableDataVal = ref([]) as any;
const FilterItem = [
  {
    cPropertyClassTypeCode: 'Filter',
    cAttributeCode: 'items_iIndex',
    cAttributeName: '项号',
    cControlTypeCode: 'TextBox',
    cDataTypeCode: 'Nvarchar',
    IsShow: true,
    iIndex: 2,
    cConditions: '=',
    cAttributeTypeCode: 'property',
    Resource: {
      cResourcesCode: 'MES.ProductBOM.R',
      cAttributeTypeCode: 'property',
      cAttributeCode: 'items_iIndex',
      cAttributeName: '项号'
    }
  },
  {
    cAttributeCode: 'items_cInvName',
    cAttributeName: '成品',
    cControlTypeCode: 'TextBox',
    cDataTypeCode: 'Nvarchar',
    IsRequest: false,
    iMaxLengh: 60,
    IsShow: true,
    cConditions: 'like',
    cAttributeTypeCode: 'property',
    Resource: {
      cResourcesCode: 'MES.ProductBOM.R',
      cAttributeTypeCode: 'property',
      cAttributeCode: 'items_cInvName',
      cAttributeName: '成品'
    }
  },
  {
    cAttributeCode: 'itemsss_cInvName',
    cAttributeName: '子件名称',
    cControlTypeCode: 'TextBox',
    cDataTypeCode: 'Nvarchar',
    IsRequest: false,
    iMaxLengh: 60,
    IsShow: true,
    cConditions: 'like',
    cAttributeTypeCode: 'property',
    Resource: {
      cResourcesCode: 'MES.ProductBOM.R',
      cAttributeTypeCode: 'property',
      cAttributeCode: 'itemsss_cInvName',
      cAttributeName: '子件名称'
    }
  }
];
watch(
  () => props.tableData,
  newVal => {
    // console.log(newVal,'--vvvv');
    tableDataVal.value = newVal;
    setTimeout(() => {
      const effectMerge = {
        items_iIndex: ['items_iIndex'], //一月参照区域进行合并
        items_cInvName: ['items_iIndex'],
        itemsss_cInvCode: ['items_iIndex'],
        itemsss_cInvName: ['items_iIndex']
      };
      const arr = [
        'items_iIndex',
        'items_cInvName',
        'itemsss_cInvCode',
        'itemsss_cInvName'
      ]; //全部字段
      setTabelRowSpan(tableDataVal.value, arr, effectMerge); // （表格数据，表格字段，合并的条件）
    }, 100);
  },
  { deep: true }
);
onMounted(() => {});
//存储合并单元格的开始位置
const setTabelRowSpan = (
  tableDataVal: any,
  fieldArr: any,
  effectMerge = {}
) => {
  let lastItem = {};
  fieldArr.forEach((field: any, index: any) => {
    let judgeArr = fieldArr.slice(0, index + 1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (effectMerge[field]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      judgeArr = [...effectMerge[field], field];
      // console.log(judgeArr, "--==judgeAr2222");
    }
    tableDataVal.forEach((item: any) => {
      item.mergeCell = fieldArr;
      const rowSpan = `rowspan_${field}`;
      // 判断是否合并到上个单元格。
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if (
        judgeArr.every((e: any) => lastItem[e] === item[e] && item[e] !== '')
      ) {
        // 判断是否所在行的列对应的值全部相同，并且此列的值不为空
        // 是：合并行
        item[rowSpan] = 0;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        lastItem[rowSpan] += 1;
      } else {
        // 否：完成一次同类合并。lastItem重新赋值，进入下一次合并计算。
        item[rowSpan] = 1;
        lastItem = item;
      }
    });
  });
};
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: any) => {
  if (row.mergeCell) {
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
</script>

<style scoped lang="scss">
:deep(.el-table th.el-table__cell) {
  background-color: var(--el-color-primary) !important;
  color: #fff !important;
}
:deep(.el-table td.el-table__cell) {
  border-right: 1px solid #000 !important;
}
:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  border-bottom: 1px solid #000 !important;
}
:deep(.el-table--border .el-table__cell) {
  border-right: 1px solid #000 !important;
}
:deep(.el-table--border th.el-table__cell) {
  border-bottom: 1px solid #000 !important;
}
:deep(.el-table--border td) {
  border-right: 1px solid #000 !important;
}
:deep(.el-table td) {
  border-right: 1px solid #000 !important;
}
:deep(.el-table) {
  --el-table-border-color: #000 !important;
}
</style>
