<!-- eslint-disable vue/no-mutating-props -->
<template>
  <el-dialog
    class="modelMain"
    v-model="dialogTypeVal"
    :destroy-on-close="true"
    @open="clickOpen"
    @close="close"
    :title="propsData.titleName"
    center
    width="60%"
  >
    <!-- 搜索区域 -->
    <FilterForm
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    ></FilterForm>
    <el-card>
      <el-table
        ref="myTableRef"
        :data="tableData"
        border
        @selection-change="handleSelectionChange"
        :row-key="getRowKey"
        @select="selectClick"
        max-height="300"
      >
        <el-table-column type="selection" width="55" />
        <template v-for="item in tableColumn" :key="item.value">
          <el-table-column :prop="item.key" :label="item.name" />
        </template>
      </el-table>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        :pagerCount="5"
        @pagination="changPage"
      />
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="dialogEnd">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, watch, Ref, provide } from 'vue';
import { ElMessage } from 'element-plus';
import { configApi, DataApi } from '@/api/configApi/index';
import { filterModel, tableSortInit } from '@/utils';
import FilterForm from '@/components/Filter/index.vue';
import { useRoute } from 'vue-router';
const myTableRef = ref();
const Route = useRoute();
const propsData = defineProps({
  dialogType: {
    //状态
    type: Boolean,
    required: true
  },
  titleName: {
    //表头
    type: String,
    default: ''
  },
  filterVal: {
    type: String,
    default: ''
  },
  codeType: {
    //接口code
    type: String,
    required: true,
    default: ''
  },
  MulitChoose: {
    //false 单选  true  多选
    type: Boolean,
    required: true
  },
  filterData: {
    type: Array,
    default: () => []
  },
  ajax: {
    type: Object,
    default: () => {}
  },
  tableSet: {
    //动态table   弃用
    type: Array,

    default: () => []
  },
  gridData: {
    //table数据   弃用
    type: Array,
    default: () => []
  },
  metadata: {
    type: Object,
    default: () => {}
  },
  ruleForm: {
    type: Object,
    default: () => {}
  }
});
const selectData = ref([]);
const Conditions = ref('');
const OrderByFileds = ref('');
const tableColumn = ref([]) as any;
const tableColumns = ref([]) as any;
const Filter = ref([]) as any;
const tableData = ref([]) as any;
const ajaxData = ref([]) as any;
const tableItemData = ref(null) as any;
const total = ref(0);
const queryParams = ref({
  PageIndex: 1,
  PageSize: 5
}) as any;
const dialogTypeVal: Ref<boolean> = ref(false);
watch(
  propsData,
  (newValue, oldValue) => {
    ajaxData.value = newValue.ajax || {};
    dialogTypeVal.value = newValue.dialogType;
    if (
      ['newOutputPlan', 'newOutputPlanEdit'].includes(Route.name as any) &&
      newValue.titleName === '寻线批次号'
    ) {
      Conditions.value = `cVouchTypeCode=01 && iStatus=1 && dProductDate=${
        newValue.ruleForm.dProductDate.split(' ')[0]
      }`;
    } else if (
      Route.name == 'AddPurchaseRequest' ||
      Route.name == 'AddPurchaseRequestEdit' ||
      Route.name == 'AddPurchaseRequestView'
    ) {
      if (newValue.metadata?.cInvCode) {
        Conditions.value = `cInvCode=${newValue.metadata.cInvCode}`;
      }
    } else if (
      (Route.name === 'AddBusineScen' ||
        Route.name === 'newProductPlan' ||
        Route.name === 'newProductPlanView') &&
      newValue.codeType === 'ManageCenter.SYS_DICTONARY.M.FormList' &&
      newValue.metadata?.cDictonaryTypeCode
    ) {
      Conditions.value = `cDictonaryTypeCode=${newValue.metadata.cDictonaryTypeCode}`;
    } else if (
      Route.name === 'AddGrindOrder' &&
      newValue.codeType === 'TMS.TMS_INVETORY.M.FormList'
    ) {
      Conditions.value = `IsRepair = true`;
    } else {
      Conditions.value = '';
    }
    if (newValue.codeType && newValue.dialogType) {
      configData(newValue.codeType);
    } else {
      tableColumn.value = [];
      tableData.value = [];
      total.value = 0;
      queryParams.value = {
        PageIndex: 1,
        PageSize: 5
      };
    }
  },
  { deep: true }
);
const emit = defineEmits(['ModelClose', 'selectData']);

// 勾选
const handleSelectionChange = (val: any) => {
  selectData.value = val;
};
const clickOpen = () => {
  queryParams.value = {
    PageIndex: 1,
    PageSize: 5
  };
};
// 关闭
const close = () => {
  emit('ModelClose', { type: false });
  selectData.value = [];
  Conditions.value = '';
};
// 表格行数据的Key
const getRowKey = (row: any) => {
  return row.id;
};
// 控制单选——table选择项发生变化时
const selectClick = (selection: any[], row: any) => {
  console.log('🚀🚀 弹窗单选中行');
  console.table(row);
  if (!propsData.MulitChoose && selection.length > 1) {
    let del_row = selection.shift();
    myTableRef.value.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
  }
};
// 确认
const dialogEnd = () => {
  // NOTE: #1684 清空选择项
  // if (selectData.value.length <= 0)
  //   return ElMessage({
  //     message: '请选择！',
  //     type: 'warning'
  //   });

  const data = selectData.value.length <= 0 ? [{}] : selectData.value;

  if (propsData.MulitChoose) {
    emit('selectData', { value: data, type: true });
    return true;
  }
  if (selectData.value.length > 1) {
    ElMessage({
      message: '只能选择一条！',
      type: 'warning'
    });
    return false;
  }
  emit('selectData', { value: data, type: false });
};
// 搜索
const ClickSearch = (val: any) => {
  queryParams.value = {
    PageIndex: 1,
    PageSize: 5
  };
  Conditions.value = filterModel(val.value);
  if (ajaxData.value && ajaxData.value.url) {
    tableAxios_2(ajaxData.value);
  } else {
    tableAxios(tableItemData.value);
  }
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.value = {
    PageIndex: 1,
    PageSize: 5
  };
  if (ajaxData.value && ajaxData.value.url) {
    tableAxios_2(ajaxData.value);
  } else {
    tableAxios(tableItemData.value);
  }
  myTableRef.value.clearFilter();
};
// 配置接口
const configData = (val: string) => {
  Filter.value = [];
  tableColumn.value = [];
  configApi(val).then(res => {
    if (res.status === 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key];
        }
        // if(item.cPropertyClassTypeCode == 'ToolBut'){
        //     xx.value=item[import.meta.env.VITE_APP_key]
        // }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(item[import.meta.env.VITE_APP_key]);
        }
      });
    }
  });
};

// table 数据
const funTable = (arr: Array<any>) => {
  tableColumn.value = [];
  arr.forEach(item => {
    // if(item.Resource.cAttributeTypeCode=='method'){}
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      if (ajaxData.value && ajaxData.value.url) {
        tableAxios_2(ajaxData.value);
      } else {
        tableItemData.value = item;
        tableAxios(tableItemData.value);
      }
    }
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      if (item.IsShow) {
        const obj: any = {
          name: item.Resource.cAttributeName,
          key: item.Resource.cAttributeCode
        };
        tableColumn.value.push(obj);
      }
    }
  });
};
// table 数据
const tableAxios = (obj: {
  Resource: { cHttpTypeCode: any; cUrl: any; cServerIP: any };
}) => {
  const data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: queryParams.value.PageIndex,
      PageSize: queryParams.value.PageSize,
      OrderByFileds: '',
      Conditions: Conditions.value
    }
  };
  if (Route.name == 'newFileContrast') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let type = {
      ctype: propsData.filterVal
    };
    data.data = { ...data.data, ...type };
  }

  DataApi(data).then(res => {
    tableData.value = res.data?.data || [];
    total.value = res.data.dataCount || 0;
  });
};
// table 数据
const tableAxios_2 = (obj: any) => {
  const data = {
    method: obj.method,
    url: obj.url,
    data: {
      PageIndex: queryParams.value.PageIndex,
      PageSize: queryParams.value.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  if (Route.name == 'newFileContrast') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let type = {
      ctype: propsData.filterVal
    };
    data.data = { ...data.data, ...type };
  }

  DataApi(data).then(res => {
    tableData.value = res.data?.data || [];
    total.value = res.data.dataCount || 0;
  });
};
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  if (ajaxData.value && ajaxData.value.url) {
    tableAxios_2(ajaxData.value);
  } else {
    tableAxios(tableItemData.value);
  }
};
</script>

<style>
.modelMain .el-dialog__body {
  height: 100%;
}
.modelMain .el-dialog__headerbtn {
  top: 0;
  background-color: var(--el-color-primary);
}
.modelMain .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
  margin-top: 4px;
  font-size: 20px;
}
</style>
