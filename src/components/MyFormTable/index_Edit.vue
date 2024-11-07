<!-- eslint-disable vue/no-unused-vars -->
<template>
  <div class="myTable item-body">
    <div style="float: left; margin: 10px 0" v-if="props.disabledHide">
      <el-button
        type="primary"
        size="small"
        :disabled="props.disabled"
        @click="clickTableAdd()"
        >增行</el-button
      >
    </div>

    <el-table
      ref="myTableRef"
      stripe
      :loading="tableLoading"
      :data="tableDataVal"
      :height="tableHeight"
      style="width: 100%"
      :border="tableBorder"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      @row-dblclick="handledbClick"
      @cell-click="(row:any, column:any, cell:any, event:any)=>cellClick(false,row, column, cell, event)"
      aria-disabled="false"
      fit
      class="visible"
      scrollbar-always-on
      :max-height="props.maxHeight"
    >
      <!-- 无数据时的插槽 -->
      <slot name="empty">{{ noData }}</slot>

      <!-- 表格勾选框 -->
      <el-table-column v-if="props.selection" type="selection" width="55" />
      <el-table-column
        width="60"
        fixed
        v-if="!['ProductionOrderBG'].includes(Route.name)"
      >
        <template #header> 序号 </template>
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <template v-for="(item, index) in tableHeader" :key="item.prop">
        <!-- 插槽 -->
        <slot v-if="item.slotName" :name="item.slotName"> </slot>
        <!-- 表格主体内容 -->

        <el-table-column
          v-else
          v-bind="item"
          :sortable="item.sortable"
          :min-width="calcWidth(item)"
          filter-multiple
          :filter-method="filterMethod"
          filter-placement="top-start"
          :filters="item?.filters"
        >
          <template #header>
            <!-- <template #header > -->
            <div style="display: inline-flex; justify-items: center">
              <div>{{ item.label }}</div>
              <div class="extra-icon">
                <!-- 排序 升-->
                <el-icon
                  v-if="item?.slot == 'asc'"
                  @click="() => clickSort(index, 'desc')"
                >
                  <CaretTop />
                </el-icon>
                <!-- 排序 降-->
                <el-icon
                  v-else-if="item?.slot == 'desc'"
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
            <!-- item.edit== 0||item.edit== 1 -->
            <div v-if="funEdit(item.edit)">
              <el-date-picker
                v-if="item.cControlTypeCode == 'DatePicker'"
                v-model="scope.row[item.prop]"
                type="date"
                placeholder="请选择"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :default-value="new Date()"
                :disabled="props.disabled"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
              />
              <el-select
                :disabled="props.disabled || item.DefinedParm4 === '1'"
                v-if="item.cControlTypeCode == 'ComboBox'"
                v-model="scope.row[item.prop]"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
                @change="(value:any)=>tableSelect(value,item.prop,scope.$index,item.PullData)"
              >
                <el-option
                  v-for="(val, index) in item.PullData"
                  :key="index"
                  :label="val.cDictonaryName || val.cUnitName"
                  :value="val.cDictonaryCode || val.cUnitCode"
                />
                <!-- <ElSelectLoading
                                    :page="page"
                                    :loading="loading"
                                    :hasMore="hasMore"
                                    @loadMore="handloadMore"
                                    ></ElSelectLoading> -->
              </el-select>
              <el-input
                v-if="item.cControlTypeCode == 'TextBox'"
                v-model="scope.row[item.prop]"
                placeholder="请输入"
                @change="changeTextBox(scope.$index, scope.row)"
                :disabled="props.disabled"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
              />
              <el-input-number
                :disabled="props.disabled"
                v-if="item.cControlTypeCode == 'Int'"
                v-model="scope.row[item.prop]"
                onmousewheel="return false;"
                :placeholder="disabled ? '' : '请输入'"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
              />

              <!-- <el-autocomplete
                v-if="item.cControlTypeCode == 'TextBoxLink'"
                v-model="scope.row[item.prop]"
                :disabled="props.disabled"
                :fetch-suggestions="querySearchAsync"
                :placeholder="disabled ? '' : '请输入'"
                @select="handleAutoTextSelect"
                @change="handleAutoTextChange"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
              >
                <template #append>
                  <el-icon
                    @click="clickModel(item, item.prop, scope.$index, scope)"
                  >
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-autocomplete> -->
              <el-input
                v-if="item.cControlTypeCode == 'TextBoxLink'"
                :disabled="props.disabled"
                v-model="scope.row[item.prop]"
                :placeholder="disabled ? '' : '请输入'"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
                @keyup.enter.native="e => onKeyPressEnter(e, item, scope)"
              >
                <template #append>
                  <el-icon
                    @click="clickModel(item, item.prop, scope.$index, scope)"
                  >
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div
              v-else-if="
                Route.name === 'AddPurchaseNote' &&
                item.cAttributeCode === 'cDefindParm03'
              "
            >
              <el-select v-model="scope.row[item.prop]" placeholder="请选择">
                <el-option
                  v-for="selectItem in scope.row['cDefindParm03List']"
                  :key="selectItem"
                  :label="selectItem"
                  :value="selectItem"
                />
              </el-select>
            </div>
            <div v-else>
              <span>{{ scope.row[item.prop] }}</span>
            </div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
  <!-- 搜索弹框 -->
  <searchModel
    :dialogType="dialogType"
    :titleName="titleName"
    :codeType="codeType"
    :MulitChoose="MulitChoose"
    :filterVal="filterVal"
    :filterData="filterData"
    :ajax="ajax"
    @ModelClose="ModelClose"
    @selectData="selectDatas"
    :metadata="metadata"
  ></searchModel>
</template>

<script lang="ts" setup>
import {
  ref,
  nextTick,
  PropType,
  watch,
  defineEmits,
  reactive,
  toRefs,
  onMounted,
  onActivated,
  onBeforeMount
} from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElIcon,
  ElInput,
  ElButton,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import ElSelectLoading from '@/components/ElSelectLoading/index.vue';
import { ParamsApi, InventoryInfoGetForPage } from '@/api/configApi/index';
import {
  MoreFilled,
  DCaret,
  CaretTop,
  CaretBottom
} from '@element-plus/icons-vue';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import { styleType } from 'element-plus/es/components/table-v2/src/common';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const disabled = ref(false);
const myTableRef = ref();
const pagePath = ref();
const ajax = ref({});
const PullData = ref([]) as any;
const page = ref(0);
const loading = ref(false);
const hasMore = ref(true);
//判断当前页面路径
let router = useRouter();
let Route = useRoute();
const metadata = ref<any>({});

watch(
  () => router,
  (newValue, oldValue) => {
    pagePath.value = newValue.currentRoute.value.path;
  },
  { immediate: true }
);
watch(
  () => Route.name,
  () => {
    tableDataVal.value = [];
  }
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
//弹窗组件事件
let filterVal = ref('');
let styleMain = ref({
  border: '1px solid var(--el-color-primary)',
  'border-radius': '5px'
});
let filterData = ref([]) as any;
const data = reactive({
  dialogType: false,
  titleName: '标题',
  AttributeCode: '',
  MulitChoose: false, //判断弹框组件单选或多选
  codeType: '',
  ButObjData: {} as any, //按钮配置数据
  form: {
    name: '',
    date: null,
    optVal: '',
    project: ''
  },
  options: [
    {
      value: '1',
      label: '是'
    },
    {
      value: '2',
      label: '否'
    }
  ]
});
const {
  dialogType,
  titleName,
  codeType,
  ButObjData,
  MulitChoose,
  AttributeCode
} = toRefs(data);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
const BGTableData = ref(
  window.sessionStorage.getItem('BGTableData')
    ? JSON.parse(window.sessionStorage.getItem('BGTableData'))
    : []
) as any;
const BGTableDataObj = ref({});
const selectData = ref([]) as any;
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
  disabledHide: {
    // 增加按钮  显示和隐藏
    type: Boolean,
    default: () => {
      return true;
    }
  },
  selectionType: {
    type: Boolean,
    default: () => {
      return true;
    }
  },
  tableHB: {
    // 表格加载
    type: Boolean,
    default: () => {
      return false;
    }
  },
  EditType: {
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
  disabled: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  maxHeight: {
    type: String as any,
    default: () => undefined
  }
});
const tableHeader: any = ref(
  props.tableColumns.filter((item: any) => {
    return item.checkType;
  })
);
const tableDataVal: any = ref([]);
const tableDataValCopy: any = ref([]);
const tableInit: any = ref([]);
const sType = ref(false);
const emit = defineEmits([
  'tableHearData',
  'handleSortChange',
  'handledbClick',
  'handleSelectionChange',
  'handleTableDataChange'
]);

watch(
  () => props.tableColumns,
  val => {
    //所有列（表头）
    tableHeader.value = val.filter((item: any) => {
      return item.checkType;
    });
  },
  { deep: true }
);
watch(
  () => props.tableData,
  val => {
    console.log(val);
    //表格数据
    tableDataValCopy.value = JSON.parse(JSON.stringify(val));
    tableDataVal.value = JSON.parse(JSON.stringify(val));
    // tableDataVal.value.forEach((item:any,i:any)=>{
    //     item.int=i
    // })
    tableInit.value = JSON.parse(JSON.stringify(val));
  },
  { deep: true }
);

onMounted(() => {
  if (BGTableData.value.length) {
    BGTableDataObj.value = BGTableData.value[0];
  }
});
onActivated(() => {
  if (Route.name === 'AddPurchaseRequest' && tableDataVal.value.length === 0) {
    for (let i = 0; i < 10; i++) {
      tableDataVal.value.push(tableFunObj());
    }
  }
});
/**
 * 加载更多数据
 * https://www.jianshu.com/p/b685ed997a64
 */
const handloadMore = async (newPage: number) => {
  console.log(newPage, '00--000');

  //   await loadDataList(newPage);
};
//增加行
const clickTableAdd = () => {
  // if (Route.name === 'AddPurchaseRequest') {
  //   for (let i = 0; i < 10; i++) {
  //     tableDataVal.value.push(tableFunObj());
  //   }
  //   console.log('🚀🚀 增行后新增的数据');
  //   console.table(tableDataVal.value);
  //   return;
  // }
  if (!Route.meta.title.match(/详情/gi)) {
    tableDataVal.value.push(tableFunObj());
  }
  console.log('🚀🚀 增行后新增的数据');
  console.table(tableDataVal.value);
};

const filterMethod = (value: string, row: any, column: any) => {
  const property = column['property'];
  return row[property] === value; //绝对匹配
  // return row[property].includes(value)  //模糊匹配
};

const calcWidth = (row: { label: any }) => {
  let flexWidth = 50;
  if (row.cControlTypeCode == 'TextBoxLink') {
    return '150px';
  } else if (row.cControlTypeCode == 'Int') {
    return '180px';
  }
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
};
const funEdit = (v: any) => {
  if (Route.name.includes('YL')) {
    if (!v) {
      return true;
    } else {
      return false;
    }
  }
  if (Route.name == 'ReturnQualityInfo') {
    if (v == 0) {
      return true;
    } else {
      return false;
    }
  } else {
    if (v == 1) {
      return true;
    } else {
      return false;
    }
  }
};
//添加数据的处理 added  edit
const tableFunObj = () => {
  let obj = {};
  tableHeader.value.forEach((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[item.prop] = '';
  });
  if (
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj.UID = '00000000-0000-0000-0000-000000000000';
  }
  // if(Route.name=='ScrapToolInfoAdd'||Route.name=='ScrapToolInfoEdit'||Route.name=='LabelUsageConfigurationAdd'||Route.name=='LabelUsageConfigurationEdit'||Route.name=='inishedSubPartComparisonEdit'){
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     obj.state='added'
  // }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  obj.state = 'added';
  return obj;
};
const tableSelect = (val: any, prop: any, i: any, list: any) => {
  console.log(val, prop, i, list, '-----selllll');
  let dataVal: any = [];
  if (list.length) {
    dataVal = list.filter((item: any) => {
      if (
        Route.name == 'AddPurchaseRequest' ||
        Route.name == 'AddPurchaseRequestEdit' ||
        Route.name == 'AddPurchaseRequestView' ||
        Route.name == 'newPurchaseAuditEdit' ||
        Route.name == 'newPurchaseAuditView'
      ) {
        if (prop == 'cUnitName') {
          return item.cUnitCode == val;
        }
      }
    });
  }
  if (Route.name === 'otherInNotifyAdd' || Route.name === 'otherInNotifyEdit') {
    if (prop === 'cUnitCode' || prop === 'cUnitName') {
      dataVal = list.filter((i: any) => i.cDictonaryCode === val);
      tableDataVal.value[i]['cUnitCode'] = dataVal[0].cDictonaryCode;
      tableDataVal.value[i]['cUnitName'] = dataVal[0].cDictonaryName;
    }
  }
  if (
    Route.name == 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
  ) {
    if (prop == 'cUnitName') {
      tableDataVal.value[i]['cUnitCode'] = dataVal[0].cUnitCode;
      tableDataVal.value[i]['cUnitName'] = dataVal[0].cUnitName;
    }
  }
  if (
    Route.name == 'newPurchaseAuditEdit' ||
    Route.name == 'newPurchaseAuditView'
  ) {
    if (prop == 'cUnitName') {
      tableDataVal.value[i]['cUnitCode'] = dataVal[0].cUnitCode;
      tableDataVal.value[i]['cUnitName'] = dataVal[0].cUnitName;
    }
  }
  if (
    Route.name == 'ScrapToolInfoAdd' ||
    Route.name == 'ScrapToolInfoEdit' ||
    Route.name == 'LabelUsageConfigurationAdd' ||
    Route.name == 'LabelUsageConfigurationEdit' ||
    Route.name == 'inishedSubPartComparisonEdit'
  ) {
    tableDataVal.value[i].state =
      tableDataVal.value[i].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
  }
  console.log(tableDataVal.value, '--tableDataVal.value');
};
//表格单独按钮删除
const DelBtn = (index: any) => {
  tableDataVal.value.splice(index, 1);
};
//拆分复制
const CoptTable = (i: any, index: number) => {
  if (typeof index === 'number') {
    tableDataVal.value.splice(index + 1, 0, i);
  } else {
    tableDataVal.value.push(i);
  }
};
//添加表格当前行的Iindex
const IndexType = ref(0) as any;
// 输入框
const changeTextBox = (i: any, scope: any) => {
  tableDataVal.value[i].state =
    tableDataVal.value[i].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
  // if(Route.name=='ScrapToolInfoEdit'||Route.name=='LabelUsageConfigurationEdit'||Route.name=='inishedSubPartComparisonEdit'){
  //     tableDataVal.value[i].state=tableDataVal.value[i].state=='added'?'added':'edit'  //周盈中的方案 报废单菜单  解决丢失覆盖问题
  // }
  emit('handleTableDataChange', tableDataVal.value);
};
//搜索弹框表格选中
const selectDatas = (val: any) => {
  console.log('🚀🚀 可编辑表格下拉搜索的值');
  console.table(val?.value[0]);
  console.log(
    IndexType.value,
    AttributeCode.value,
    '🚀🚀 可编辑表格下拉搜索的 Key'
  );
  if (
    Route.name == 'newPurchaseAudit' ||
    Route.name == 'newPurchaseAuditEdit' ||
    Route.name == 'newPurchaseAuditView' ||
    Route.name == 'newWorkshopMaterialEdit' ||
    Route.name == 'newWorkshopMaterialAdd'
  ) {
    if (val.value.length && !val.value[0].cVendorName) {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvstd;
    }
  }
  if (
    Route.name == 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
  ) {
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvstd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      metadata.value.cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].SAPCode;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;

      // 将 val.value 里的索引不为0的所有值依次填充到列表中的其他 cInvCode 不存在的行里，为 0 就填充到当前行
      if (val.value.length > 1) {
        for (let i = 0; i < val.value.length - 1; i++) {
          const emptyRow = tableDataVal.value.find(
            (item: any) => !item.cInvCode
          );
          if (emptyRow) {
            emptyRow.cInvCode = val.value[i + 1].cInvCode;
            emptyRow.cInvName = val.value[i + 1].cInvName;
            emptyRow.cInvStd = val.value[i + 1].cInvstd;
            emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
            emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
            emptyRow.cDefindParm03 = val.value[i + 1].SAPCode;
            emptyRow.cVendorName = val.value[i + 1].cVendorName;
            emptyRow.cVendorCode = val.value[i + 1].cVendorCode;
          } else {
            tableDataVal.value.push({
              cInvCode: val.value[i + 1].cInvCode,
              cInvName: val.value[i + 1].cInvName,
              cInvStd: val.value[i + 1].cInvstd,
              cUnitCode: val.value[i + 1].CG_UnitCode,
              cUnitName: val.value[i + 1].CG_UnitName,
              cDefindParm03: val.value[i + 1].SAPCode,
              cVendorName: val.value[0].cVendorName,
              cVendorCode: val.value[0].cVendorCode
            });
          }
        }
      }
    }
    if (AttributeCode.value == 'cVendorName') {
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
    }
  }
  if (
    Route.name == 'checkBillsAdd' ||
    Route.name == 'checkBillsEdit' ||
    Route.name == 'checkBillsView'
  ) {
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cInvCode;
      // tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName
    }
    if (AttributeCode.value == 'cInvName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cInvName;
      // tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode
    }
  }
  if (Route.name == 'newPurchaseAuditEdit') {
    if (AttributeCode.value == 'cVendorName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
    }
  }
  //工厂变更
  if (Route.name == 'ProductionOrderBG') {
    //Items_cInvName产品名称
    // Itemss_cInvName 子件名称  Itemss_cDefindParm01Name材质名称  Itemss_cStructName结构名称 Itemss_cDefindParm06Name安装方式
    // Itemss_cDefindParm05Name开向 Itemss_cDefindParm04Name合页  Itemss_cDefindParm03Name锁孔 Itemss_cDefindParm02Name磁吸代别

    if (AttributeCode.value == 'Items_cInvName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cInvName;
      tableDataVal.value[IndexType.value].Items_cInvCode =
        val.value[0].cInvCode;
    }
    if (AttributeCode.value == 'Itemss_cInvName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cInvName;
      tableDataVal.value[IndexType.value].Itemss_cInvCode =
        val.value[0].cInvCode;
    }
    if (AttributeCode.value == 'Itemsss_cInvName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cInvName;
      tableDataVal.value[IndexType.value].Itemsss_cInvCode =
        val.value[0].cInvCode;
    }
    if (AttributeCode.value == 'Itemss_cStructName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cStructCode =
        val.value[0].cDictonaryCode;
    }
    if (AttributeCode.value == 'Itemss_cDefindParm01Name') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cDefindParm01 =
        val.value[0].cDictonaryCode;
    }
    if (AttributeCode.value == 'Itemss_cDefindParm06Name') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cDefindParm06 =
        val.value[0].cDictonaryCode;
    }
    if (AttributeCode.value == 'Itemss_cDefindParm05Name') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cDefindParm05 =
        val.value[0].cDictonaryCode;
    }
    if (AttributeCode.value == 'Itemss_cDefindParm04Name') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cDefindParm04 =
        val.value[0].cDictonaryCode;
    }
    if (AttributeCode.value == 'Itemss_cDefindParm03Name') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cDefindParm03 =
        val.value[0].cDictonaryCode;
    }
    if (AttributeCode.value == 'Itemss_cDefindParm02Name') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cDictonaryName;
      tableDataVal.value[IndexType.value].Itemss_cDefindParm02 =
        val.value[0].cDictonaryCode;
    }

    // 操作完成后添加样式
    // cellClick(true,rowVal.value,columnVal.value,cellVal.value,eventVal.value)
  }
  if (
    Route.name == 'resizeDialAdd' ||
    Route.name == 'resizeDialEdit' ||
    Route.name == 'resizeDialInfo'
  ) {
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cInvCode;
      tableDataVal.value[IndexType.value]['cInvName'] = val.value[0].cInvName;
      tableDataVal.value[IndexType.value]['cInvStd'] = val.value[0].cInvStd;
    }
  }

  if (Route.name == 'AddGrindOrder' || Route.name == 'EditGrindOrder') {
    tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
    tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
    tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
  }
  if (Route.name == 'ScrapToolInfoAdd' || Route.name == 'ScrapToolInfoEdit') {
    tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
    tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
    tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
  }
  if (Route.name == 'memAdminAdd' || Route.name == 'memAdminEdit') {
    tableDataVal.value[IndexType.value].cLableCode = val.value[0].cLableCode;
    tableDataVal.value[IndexType.value].cLableName = val.value[0].cLableName;
    tableDataVal.value[IndexType.value].model = '';
  }
  if (Route.name == 'ScrapToolInfoEdit') {
    tableDataVal.value[IndexType.value].state =
      tableDataVal.value[IndexType.value].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
  }
  if (Route.name == 'otherInNotifyAdd' || Route.name == 'otherInNotifyEdit') {
    tableDataVal.value[IndexType.value].state =
      tableDataVal.value[IndexType.value].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
    tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
    tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
  }
  if (Route.name == 'otherOutNotifyAdd' || Route.name == 'otherOutNotifyEdit') {
    tableDataVal.value[IndexType.value].state =
      tableDataVal.value[IndexType.value].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
    tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
    tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
  }

  if (Route.name == 'TransferRecordAdd' || Route.name == 'TransferRecordEdit') {
    tableDataVal.value[IndexType.value].state =
      tableDataVal.value[IndexType.value].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
    tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
    tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
  }

  if (
    Route.name == 'LabelUsageConfigurationAdd' ||
    Route.name == 'LabelUsageConfigurationEdit' ||
    Route.name == 'LabelUsageConfigurationView'
  ) {
    tableDataVal.value[IndexType.value].state =
      tableDataVal.value[IndexType.value].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
    tableDataVal.value[IndexType.value].LABELCODE = val.value[0].LABELCODE;
    tableDataVal.value[IndexType.value].LABELNAME = val.value[0].LABELNAME;
  }
  if (
    Route.name == 'FinishedSubPartComparisonAdd' ||
    Route.name == 'FinishedSubPartComparisonEdit' ||
    Route.name == 'FinishedSubPartComparisonView'
  ) {
    tableDataVal.value[IndexType.value].state =
      tableDataVal.value[IndexType.value].state == 'added' ? 'added' : 'edit'; //周盈中的方案 报废单菜单  解决丢失覆盖问题
    if (AttributeCode.value == 'cStructureCode') {
      tableDataVal.value[IndexType.value].cStructureCode =
        val.value[0].cDictonaryCode;
      tableDataVal.value[IndexType.value].cStructureName =
        val.value[0].cDictonaryName;
    }
    if (AttributeCode.value == 'cInvCodeChild') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvCodeChild = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvNameChild = val.value[0].cInvName;
    }
  }

  if (Route.name == 'InventoryListAdd' || Route.name === 'InventroyListEdit') {
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvstd = val.value[0].cInvstd;
    }
  }

  if (Route.name === 'AddGrindOrder') {
    if (AttributeCode.value === 'cInvName') {
      $bus.emit('AddGrindOrder:AddHeadRefData', val.value[0]);
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
    }
  }

  dialogType.value = val.type;
  // myTableRef.value.doLayout()
};

const onKeyPressEnter = async (e, item, scope) => {
  console.log(e.target.value, item, scope);
  if (
    Route.name === 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
  ) {
    if (!e.target.value) {
      return;
    }
    const {
      data: { data }
    } = await InventoryInfoGetForPage(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvstd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].CG_UnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].CG_UnitName;
      tableDataVal.value[scope.$index].cDefindParm03 = data[0].SAPCode;
      tableDataVal.value[scope.$index].cVendorName = data[0].cVendorName;
      tableDataVal.value[scope.$index].cVendorCode = data[0].cVendorCode;
    } else {
      // 提示错误：未找到物料
      ElMessage.error('未找到数据');
      tableDataVal.value[scope.$index].cInvCode = '';
      tableDataVal.value[scope.$index].cInvName = '';
      tableDataVal.value[scope.$index].cInvStd = '';
      tableDataVal.value[scope.$index].cUnitCode = '';
      tableDataVal.value[scope.$index].cUnitName = '';
      tableDataVal.value[scope.$index].cDefindParm03 = '';
      tableDataVal.value[scope.$index].cVendorName = '';
      tableDataVal.value[scope.$index].cVendorCode = '';
    }
  }
};
// 搜索弹框事件
const clickModel = (obj: any, type: any, i: any, scope: any) => {
  ajax.value = obj.ajax;
  IndexType.value = i;
  MulitChoose.value =
    Route.name === 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
      ? true
      : false;
  titleName.value = obj.label;
  AttributeCode.value = obj.prop;
  dialogType.value = true;
  codeType.value = obj.cIncludeModelCode || '';
};
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
// 排序
const handleSortChange = (val: any) => {
  emit('handleSortChange', val);
};
//双击事件
const handledbClick = (val: any) => {
  emit('handledbClick', val);
};
// 多选事件
const handleSelectionChange = (val: any) => {
  console.log('table-多选-----', val);
  selectData.value = val;
  emit('handleSelectionChange', val);
};
// 清除多选
const handleRemoveSelectionChange = () => {
  nextTick(() => {
    myTableRef.value!.clearSelection();
  });
};
const rowInt = ref('');
const colInt = ref('');

const clickSort = (i: number, val: string) => {
  tableHeader.value[i].slot = val;
  const prop = tableHeader.value[i].prop;
  emit('tableHearData', { prop, val });
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  // console.log(row,"---row");
  // console.log(column,"---column");
  // console.log(rowIndex,"---行-rowIndex");
  // console.log(columnIndex,"--列-columnIndex");
  // if(Route.name=='ProductionOrderBG'){
  // console.log(tableDataVal.value,"--===tableDataVal.value");
};
const rowVal = ref({});
const columnVal = ref({});
const cellVal = ref({});
const eventVal = ref({});
// 操作完成后添加样式
const cellClick = (type: any, row: any, column: any, cell: any, event: any) => {
  // console.log(row,"---row");
  // console.log(column.no,"---column");
  // console.log(cell,"---cell");
  // console.log(event,"---event");
  // console.log(type,"---type");

  rowInt.value = row.int;
  rowVal.value = row;
  columnVal.value = column;
  cellVal.value = cell;
  eventVal.value = event;

  if (type) {
    cell.style = 'background:pink';
  }
  // if(column.no>=3){
  //     cell.style="background:pink"
  // }
};

const funShow = (index: any, row: any, prop: any) => {
  // console.log(row,"rrrr");
  // console.log(prop,"pppp");
  // console.log(index,"i");
  // console.log(tableDataValCopy.value,"--===tableDataValCopy.value");
  // console.log(tableDataVal.value,"--===aaaa");
  if (Route.name == 'ProductionOrderBG') {
    if (tableDataValCopy.value.length) {
      if (row[prop] == tableDataValCopy.value[index][prop]) {
        return false;
      } else {
        return true;
      }
    }
  }
};
// Math.random()
$bus.on('tablecopy', (val: any) => {
  tableDataValCopy.value = tableDataVal.value;
  myTableRef.value!.clearSelection();
});
// 重置
const clearFilter = () => {
  myTableRef.value!.clearFilter();
};

const autoText = ref('');
const querySearchAsync = async (
  queryString: string,
  cb: (arg: any) => void
) => {
  const data = await fetchRemoteData();
  const results = queryString ? data.filter(createFilter(queryString)) : data;
  cb(results);
};
const createFilter = (queryString: string) => {
  return (restaurant: any) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const fetchRemoteData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
        { value: 'babel', link: 'https://github.com/babel/babel' }
      ]);
    }, 1000);
  });
};

// 自动补全选择
const handleAutoTextSelect = (item: any) => {
  console.log(item);
};

// 自动补全修改（移除数据）
const handleAutoTextChange = () => {};

// 暴露方法
defineExpose({
  handleRemoveSelectionChange,
  clearFilter,
  DelBtn,
  CoptTable,
  tableDataVal
});
</script>
<style>
* {
  touch-action: pan-y;
}
</style>
<style lang="scss" scoped>
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
</style>
