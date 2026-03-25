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
      size="small"
      :show-summary="props.showSummary"
      :summary-method="props.summaryMethod"
      sum-text="合计"
    >
      <!-- 无数据时的插槽 -->
      <slot name="empty">{{ noData }}</slot>

      <!-- 表格勾选框 -->
      <el-table-column v-if="props.selection" type="selection" width="55" />
      <el-table-column width="60" fixed v-if="showIndex">
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
          :min-width="customWidth ? setWidth(item) : calcWidth(item)"
          filter-multiple
          :filter-method="filterMethod"
          filter-placement="top-start"
          :filters="item.filters"
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
            <div v-if="funEdit(item.edit)">
              <el-switch
                v-if="item.cControlTypeCode == 'Switch'"
                style="margin: 0 10px"
                v-model="scope.row[item.prop]"
                :disabled="props.disabled"
                @change="e => handleSwitchChange(e, item, scope)"
                active-text="是"
                inactive-text="否"
                :active-value="true"
                :inactive-value="false"
              />
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
                @change="changeDatePicker(scope.$index, scope.row)"
                style="width: auto"
              />
              <el-select
                :disabled="props.disabled || item.DefinedParm4 === '1'"
                v-if="item.cControlTypeCode == 'ComboBox'"
                v-model="scope.row[item.prop]"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
                placeholder="请选择"
                @change="(value:any)=>tableSelect(value,item.prop,scope.$index,item.PullData)"
                filterable
              >
                <el-option
                  v-for="(val, index) in item.PullData"
                  :key="index"
                  :label="
                    val.cDictonaryName || val.cUnitName || val.cFactoryUnitName
                  "
                  :value="
                    val.cDictonaryCode || val.cUnitCode || val.cFactoryUnitCode
                  "
                />
              </el-select>
              <el-input-number
                :disabled="props.disabled"
                v-if="
                  item.cControlTypeCode == 'TextBox' &&
                  item.cDataTypeCode == 'Int'
                "
                v-model="scope.row[item.prop]"
                onmousewheel="return false;"
                :placeholder="disabled ? '' : '请输入'"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
              />
              <el-input
                v-else-if="item.cControlTypeCode == 'TextBox'"
                v-model="scope.row[item.prop]"
                placeholder="请输入"
                @input="handleTextBoxInput(scope.$index, scope)"
                @change="v => changeTextBox(scope.$index, scope, v)"
                :disabled="props.disabled"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
              />
              <el-autocomplete
                v-if="item.cControlTypeCode == 'AutoComplete'"
                :disabled="props.disabled"
                v-model="scope.row[item.prop]"
                :placeholder="disabled ? '' : '请输入'"
                :fetch-suggestions="
                  (queryString, cb) =>
                    querySearchAsync(item, scope, queryString, cb)
                "
                @select="s => handleAutoTextSelect(s, item, scope)"
                @change="handleAutoTextChange"
                :style="
                  funShow(scope.$index, scope.row, item.prop) ? styleMain : ''
                "
                @keyup.enter.native="e => onKeyPressEnter(e, item, scope)"
              ></el-autocomplete>
              <el-autocomplete
                v-if="item.cControlTypeCode == 'AutoTextBoxLink'"
                :disabled="props.disabled"
                v-model="scope.row[item.prop]"
                :placeholder="disabled ? '' : '请输入'"
                :fetch-suggestions="
                  (queryString, cb) =>
                    querySearchAsync(item, scope, queryString, cb)
                "
                @select="s => handleAutoTextSelect(s, item, scope)"
                @change="handleAutoTextChange"
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
              </el-autocomplete>
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
                (Route.name === 'AddPurchaseNoteNoOrigin' ||
                  Route.name === 'AddPurchaseNoteEditNoOrigin') &&
                item.cAttributeCode === 'cVendorName' &&
                props.headData.cVouchTypeCode == '2'
              "
            >
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
                ([
                  'AddPurchaseNoteNoOrigin',
                  'AddPurchaseNoteEditNoOrigin',
                  'KnifeAddPurchaseNoteNoOrigin',
                  'KnifeAddPurchaseNoteEditNoOrigin',
                  'newPurchaseAuditEdit',
                  'KnifeNewPurchaseAuditEdit',
                  'AddPurchaseRequestEdit',
                  'KnifeAddPurchaseRequestEdit',
                ].includes(Route.name as any) &&
                  item.cAttributeCode === 'cVendorName') ||
                (['otherInNotifyAdd', 'otherInNotifyEdit'].includes(
                  Route.name as any
                ) &&
                  item.cAttributeCode === 'cDefindParm06')
              "
            >
              <el-select
                v-model="scope.row[item.prop]"
                placeholder="请选择"
                @change="e => onVendorChange(e, scope)"
                value-key="cVendorCode"
              >
                <el-option
                  v-for="selectItem in scope.row['list_sap']"
                  :key="selectItem.cVendorCode"
                  :label="`${selectItem.cVendorName}${
                    selectItem.cSAPCode ? `(${selectItem.cSAPCode})` : ''
                  }`"
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
  reactive,
  toRefs,
  onMounted,
  onActivated
} from 'vue';
import {
  ElTable,
  ElTableColumn,
  ElIcon,
  ElInput,
  ElButton,
  ElMessage
} from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import BigNumber from 'bignumber.js';
import {
  InventoryInfoGetForPage,
  InventoryInfoGetForPageNoOrigin,
  InventorySAPGetForPage,
  InventorySAPGetForList,
  KnifeInventorySAPGetForPage,
  KnifeInventoryInfoGetForPage,
  getPrice,
  getKnifePrice
} from '@/api/configApi/index';
import request from '@/utils/request';
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
  codeType: ''
});
const { dialogType, titleName, codeType, MulitChoose, AttributeCode } =
  toRefs(data);
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
  },
  showIndex: {
    type: Boolean,
    default: () => true
  },
  setWidth: {
    type: Function,
    default: () => {}
  },
  customWidth: {
    type: Boolean,
    default: () => false
  },
  showSummary: {
    type: Boolean,
    default: () => false
  },
  summaryMethod: {
    type: Function,
    default: (data: any) => {
      return [];
    }
  },
  headData: {
    type: Object,
    default: () => {}
  }
});
const tableHeader: any = ref(
  props.tableColumns.filter((item: any) => {
    return item.checkType;
  })
);
const tableDataVal: any = ref([]);
const tableDataValCopy: any = ref([]);
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
  },
  { deep: true }
);

onMounted(() => {
  if (BGTableData.value.length) {
    BGTableDataObj.value = BGTableData.value[0];
  }
});
onActivated(() => {
  if (
    (Route.name === 'AddPurchaseRequest' ||
      Route.name === 'KnifeAddPurchaseRequest') &&
    tableDataVal.value.length === 0
  ) {
    for (let i = 0; i < 10; i++) {
      tableDataVal.value.push(tableFunObj());
    }
  }
});
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
    emit('handleTableDataChange', tableDataVal.value);
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
  if (!v) {
    return true;
  }
  return false;
};
const tableFunObj = () => {
  let obj = {};
  tableHeader.value.forEach((item: any) => {
    obj[item.prop] = '';
  });
  if (
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView' ||
    Route.name == 'KnifeAddPurchaseRequestEdit' ||
    Route.name == 'KnifeAddPurchaseRequestView'
  ) {
    obj.UID = '00000000-0000-0000-0000-000000000000';
  }
  if (
    Route.name === 'DeliveryWarehouseAdd' ||
    Route.name === 'DeliveryWarehouseEdit'
  ) {
    obj.IsWarn = false;
  }
  return obj;
};
const tableSelect = (val: any, prop: any, i: any, list: any) => {
  console.log(val, prop, i, list);
  let dataVal: any = [];
  if (list.length) {
    dataVal = list.filter((item: any) => {
      if (
        Route.name == 'AddPurchaseRequest' ||
        Route.name == 'AddPurchaseRequestEdit' ||
        Route.name == 'AddPurchaseRequestView' ||
        Route.name == 'KnifeAddPurchaseRequest' ||
        Route.name == 'KnifeAddPurchaseRequestEdit' ||
        Route.name == 'KnifeAddPurchaseRequestView' ||
        Route.name == 'newPurchaseAuditEdit' ||
        Route.name == 'newPurchaseAuditView' ||
        Route.name == 'KnifeNewPurchaseAuditEdit' ||
        Route.name == 'KnifeNewPurchaseAuditView'
      ) {
        if (prop == 'cUnitName') {
          return item.cUnitCode == val;
        }
      }
      if (
        Route.name === 'WorkshopStatisticsCoreOrderEdit' ||
        Route.name === 'WorkshopStatisticsCoreOrderAdd'
      ) {
        if (prop == 'cFactoryUnitCode') {
          return item.cFactoryUnitCode == val;
        }
      }
    });
  }
  if (
    Route.name === 'DeliveryWarehouseAdd' ||
    Route.name === 'DeliveryWarehouseEdit'
  ) {
    if (prop === 'cCallTypeName') {
      dataVal = list.filter((i: any) => i.cDictonaryCode === val);
      tableDataVal.value[i]['cCallTypeName'] = dataVal[0].cDictonaryName;
      tableDataVal.value[i]['cCallTypeCode'] = dataVal[0].cDictonaryCode;
    }
  }
  if (
    Route.name === 'WorkshopStatisticsCoreOrderEdit' ||
    Route.name === 'WorkshopStatisticsCoreOrderAdd'
  ) {
    console.log(prop, dataVal[0]);
    if (prop == 'cFactoryUnitCode') {
      tableDataVal.value[i]['cFactoryUnitCode'] = dataVal[0].cFactoryUnitCode;
      tableDataVal.value[i]['cFactoryUnitName'] = dataVal[0].cFactoryUnitName;
    }
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
    Route.name == 'newPurchaseAuditView' ||
    Route.name == 'KnifeNewPurchaseAuditEdit' ||
    Route.name == 'KnifeNewPurchaseAuditView'
  ) {
    if (prop == 'cUnitName') {
      tableDataVal.value[i]['cUnitCode'] = dataVal[0].cUnitCode;
      tableDataVal.value[i]['cUnitName'] = dataVal[0].cUnitName;
    }
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
const changeTextBox = async (i: any, scope: any, v) => {
  console.log(i, scope, v);
  const p = scope.column.property;
  const row = scope.row;
  if (Route.name === 'AddGrindOrder' || Route.name === 'EditGrindOrder') {
    if (p === 'nTaxPrice' || p === 'nQuantity') {
      const nTaxMoney = new BigNumber(
        Number(tableDataVal.value[i].nTaxPrice ?? 0) *
          Number(tableDataVal.value[i].nQuantity ?? 0)
      );
      tableDataVal.value[i].nTaxMoney = nTaxMoney.toString();
    }
  }
  if (
    Route.name === 'newPurchasedGoods' ||
    Route.name === 'newPurchasedGoodsEdit' ||
    Route.name === 'KnifeNewPurchasedGoods'
  ) {
    if (
      p === 'nAccReceiveQuantity' ||
      p === 'nAccQuantity' ||
      p === 'nReceiveQuantity'
    ) {
      const nAccReceiveQuantity =
        Route.name === 'KnifeNewPurchasedGoods'
          ? 1
          : tableDataVal.value[i].nAccReceiveQuantity;
      const nReceiveQuantity = new BigNumber(
        Number(nAccReceiveQuantity ?? 0) *
          Number(tableDataVal.value[i].nAccQuantity ?? 0)
      ); // 到货数量
      const nTaxPrice = new BigNumber(
        tableDataVal.value[i].nTaxPrice ?? 0
      ).decimalPlaces(8); // 含税单价
      const nTaxRate = new BigNumber(tableDataVal.value[i].nTaxRate ?? 0); // 税率
      const nTaxMoney = nReceiveQuantity.multipliedBy(nTaxPrice); // 税价合计：到货数量*含税单价
      const cDefindParm06 = nTaxMoney
        .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
        .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
      const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
      const nPrice = nReceiveQuantity.isGreaterThan(0)
        ? nMoney.dividedBy(nReceiveQuantity).decimalPlaces(8)
        : 0; // 不含税单价：不含税金额/到货数量

      tableDataVal.value[i].nReceiveQuantity = nReceiveQuantity.toString();
      tableDataVal.value[i].nTaxPrice = nTaxPrice.toString();
      tableDataVal.value[i].nTaxRate = nTaxRate.toString();
      tableDataVal.value[i].nTaxMoney = nTaxMoney.toString();
      tableDataVal.value[i].cDefindParm06 = cDefindParm06
        .toFixed(2)
        .replace(/\.?0+$/, '');
      tableDataVal.value[i].nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
      tableDataVal.value[i].nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
      console.log('计算完毕');
    }
  }
  if (Route.name === 'PurchaseReturnCheckEdit') {
    console.log(p);
    if (p === 'nQuantity' || p === 'nTaxPrice') {
      const nQuantity = new BigNumber(tableDataVal.value[i].nQuantity ?? 0); // 到货数量
      const nTaxPrice = new BigNumber(
        tableDataVal.value[i].nTaxPrice ?? 0
      ).decimalPlaces(8); // 含税单价
      const nTaxRate = new BigNumber(tableDataVal.value[i].nTaxRate ?? 0); // 税率
      const nTaxMoney = nQuantity.multipliedBy(nTaxPrice); // 税价合计：到货数量*含税单价
      const cDefindParm06 = nTaxMoney
        .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
        .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
      const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
      const nPrice = nQuantity.isGreaterThan(0)
        ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
        : 0; // 不含税单价：不含税金额/到货数量

      tableDataVal.value[i].nReceiveQuantity = nQuantity.toString();
      tableDataVal.value[i].nTaxPrice = nTaxPrice.toString();
      tableDataVal.value[i].nTaxRate = nTaxRate.toString();
      tableDataVal.value[i].nTaxMoney = nTaxMoney.toString();
      tableDataVal.value[i].cDefindParm06 = cDefindParm06
        .toFixed(2)
        .replace(/\.?0+$/, '');
      tableDataVal.value[i].nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
      tableDataVal.value[i].nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
      console.log('计算完毕');
    }
  }
  if (
    Route.name === 'TooolInfo' ||
    Route.name === 'EditTooolInfo' ||
    Route.name === 'KnifeAddPurchaseNoteNoOrigin' ||
    Route.name === 'KnifeAddPurchaseNoteEditNoOrigin' ||
    Route.name === 'KnifeAddPurchaseNote' ||
    Route.name === 'KnifeAddPurchaseNoteEdit' ||
    Route.name === 'AddGrindOrder' ||
    Route.name === 'EditGrindOrder' ||
    Route.name === 'PurchaseReturnStockAdd' ||
    Route.name === 'PurchaseReturnStockEdit'
  ) {
    console.log(p);
    if (p === 'nQuantity' || p === 'nTaxPrice') {
      if (p === 'nQuantity') {
        const result = tableDataVal.value[i].list_price?.[0];
        console.log(result);
        tableDataVal.value[i].nTaxPrice = result?.nTaxPrice ?? 0;
        tableDataVal.value[i].nTaxRate = result?.nTaxRate ?? 0;
      }
      if (!row.nQuantity || !row.nTaxPrice) {
        tableDataVal.value[i].nTaxMoney = 0;
        tableDataVal.value[i].cDefindParm06 = 0;
        tableDataVal.value[i].nMoney = 0;
        tableDataVal.value[i].nPrice = 0;
        if (!row.nTaxRate) {
          tableDataVal.value[i].nTaxRate = 0;
        }
      } else {
        const nQuantity = new BigNumber(row.nQuantity); // 数量
        const nTaxPrice = new BigNumber(row.nTaxPrice).decimalPlaces(8); // 含税单价
        const nTaxRate = new BigNumber(row.nTaxRate); // 税率
        const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
        const cDefindParm06 = nTaxMoney
          .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
          .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
        const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
        const nPrice = nQuantity.isGreaterThan(0)
          ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
          : 0; // 不含税单价：不含税金额/采购数量

        tableDataVal.value[i].nQuantity = nQuantity.toString();
        tableDataVal.value[i].nTaxPrice = nTaxPrice.toString();
        tableDataVal.value[i].nTaxRate = nTaxRate.toString();
        tableDataVal.value[i].nTaxMoney = nTaxMoney.toString();
        tableDataVal.value[i].cDefindParm06 = cDefindParm06
          .toFixed(2)
          .replace(/\.?0+$/, '');
        tableDataVal.value[i].nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
        tableDataVal.value[i].nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
      }
    }
    if (p === 'nTaxRate' || p === 'cDefindParm06') {
      if (!row.nTaxPrice || !row.nQuantity) {
        tableDataVal.value[i].nTaxMoney = 0;
        tableDataVal.value[i].cDefindParm06 = 0;
        tableDataVal.value[i].nMoney = 0;
        tableDataVal.value[i].nPrice = 0;
      } else {
        // 修改税率，改变税额、不含税单价、不含税金额
        // 修改税额，改变不含税单价、不含税金额
        const nQuantity = new BigNumber(row.nQuantity); // 数量
        const nTaxPrice = new BigNumber(row.nTaxPrice).decimalPlaces(8); // 含税单价
        const nTaxRate = new BigNumber(row.nTaxRate); // 税率
        const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
        let cDefindParm06 = nTaxMoney
          .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
          .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
        if (p === 'cDefindParm06') {
          cDefindParm06 = new BigNumber(row.cDefindParm06); // 修改税额，则不计算
        }
        const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
        const nPrice = nQuantity.isGreaterThan(0)
          ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
          : 0; // 不含税单价：不含税金额/采购数量

        if (p === 'nTaxRate') {
          tableDataVal.value[i].cDefindParm06 = cDefindParm06
            .toFixed(2)
            .replace(/\.?0+$/, '');
        }
        console.log(nMoney.toFixed(2).replace(/\.?0+$/, ''), 'nMoney');
        tableDataVal.value[i].nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
        tableDataVal.value[i].nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
      }
    }
  }
  if (
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin' ||
    Route.name === 'AddPurchaseNote' ||
    Route.name === 'AddPurchaseNoteEdit'
  ) {
    console.log(p);
    if (p === 'nQuantity' || p === 'nTaxPrice') {
      if (p === 'nQuantity') {
        try {
          const r = await getPrice({
            cInvCode: row.cInvCode,
            cVendorCode: row.cVendorCode
          });
          const result = r.data?.data?.[0];
          console.log(result);
          tableDataVal.value[i].nTaxPrice = result?.nTaxPrice ?? 0;
          tableDataVal.value[i].nTaxRate = result?.nTaxRate ?? 0;
        } catch {
          tableDataVal.value[i].nTaxPrice = 0;
          tableDataVal.value[i].nTaxRate = 0;
        }
      }
      if (!row.nQuantity || !row.nTaxPrice) {
        tableDataVal.value[i].nTaxMoney = 0;
        tableDataVal.value[i].cDefindParm06 = 0;
        tableDataVal.value[i].nMoney = 0;
        tableDataVal.value[i].nPrice = 0;
        if (!row.nTaxRate) {
          tableDataVal.value[i].nTaxRate = 0;
        }
      } else {
        const nQuantity = new BigNumber(row.nQuantity); // 数量
        const nTaxPrice = new BigNumber(row.nTaxPrice).decimalPlaces(8); // 含税单价
        const nTaxRate = new BigNumber(row.nTaxRate); // 税率
        const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
        const cDefindParm06 = nTaxMoney
          .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
          .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
        const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
        const nPrice = nQuantity.isGreaterThan(0)
          ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
          : 0; // 不含税单价：不含税金额/采购数量

        tableDataVal.value[i].nQuantity = nQuantity.toString();
        tableDataVal.value[i].nTaxPrice = nTaxPrice.toString();
        tableDataVal.value[i].nTaxRate = nTaxRate.toString();
        tableDataVal.value[i].nTaxMoney = nTaxMoney.toString();
        tableDataVal.value[i].cDefindParm06 = cDefindParm06
          .toFixed(2)
          .replace(/\.?0+$/, '');
        tableDataVal.value[i].nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
        tableDataVal.value[i].nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
      }
    }
    if (p === 'nTaxRate' || p === 'cDefindParm06') {
      if (!row.nTaxPrice || !row.nQuantity) {
        tableDataVal.value[i].nTaxMoney = 0;
        tableDataVal.value[i].cDefindParm06 = 0;
        tableDataVal.value[i].nMoney = 0;
        tableDataVal.value[i].nPrice = 0;
      } else {
        // 修改税率，改变税额、不含税单价、不含税金额
        // 修改税额，改变不含税单价、不含税金额
        const nQuantity = new BigNumber(row.nQuantity); // 数量
        const nTaxPrice = new BigNumber(row.nTaxPrice).decimalPlaces(8); // 含税单价
        const nTaxRate = new BigNumber(row.nTaxRate); // 税率
        const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
        let cDefindParm06 = nTaxMoney
          .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
          .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
        if (p === 'cDefindParm06') {
          cDefindParm06 = new BigNumber(row.cDefindParm06); // 修改税额，则不计算
        }
        const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
        const nPrice = nQuantity.isGreaterThan(0)
          ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
          : 0; // 不含税单价：不含税金额/采购数量

        if (p === 'nTaxRate') {
          tableDataVal.value[i].cDefindParm06 = cDefindParm06
            .toFixed(2)
            .replace(/\.?0+$/, '');
        }
        console.log(nMoney.toFixed(2).replace(/\.?0+$/, ''), 'nMoney');
        tableDataVal.value[i].nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
        tableDataVal.value[i].nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
      }
    }
  }
  nextTick(() => {
    emit('handleTableDataChange', tableDataVal.value);
  });
};
const handleTextBoxInput = (i: any, scope: any) => {
  // console.log('🚀🚀 输入框的索引', i);
  // console.log('🚀🚀 输入框的值', scope);
};
const changeDatePicker = (i, scope) => {
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
  if (Route.name === 'TooolInfo' || Route.name === 'EditTooolInfo') {
    if (AttributeCode.value === 'cDefindParm03') {
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
    }
  }
  if(Route.name === 'DeliveryWarehouseBind'){
    if(AttributeCode.value === 'cFactoryUnitCode' || AttributeCode.value === 'cFactoryUnitName'){
      tableDataVal.value[IndexType.value].cFactoryUnitCode = val.value[0].cFactoryUnitCode;
      tableDataVal.value[IndexType.value].cFactoryUnitName = val.value[0].cFactoryUnitName;
    }
  }
  if (
    Route.name === 'DeliveryWarehouseAdd' ||
    Route.name === 'DeliveryWarehouseEdit'
  ) {
    if (AttributeCode.value === 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvMGroupCode =
        val.value[0].cInvClassCode;
      tableDataVal.value[IndexType.value].cInvMGroupName =
        val.value[0].cInvClassName;
    }
  }
  if (Route.name === 'DeliveryRouteAdd' || Route.name === 'DeliveryRouteEdit') {
    if (
      AttributeCode.value === 'cWareHouseCode' ||
      AttributeCode.value === 'cWareHouseName'
    ) {
      tableDataVal.value[IndexType.value].cWareHouseCode =
        val.value[0].cWareHouseCode;
      tableDataVal.value[IndexType.value].cWareHouseName =
        val.value[0].cWareHouseName;
    }
  }
  //#region 刀具
  if (Route.name === 'KnifeAddPurchaseNote') {
    if (AttributeCode.value == 'cVendorName') {
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
      // 获取价格
      getKnifePrice({
        cInvCode: tableDataVal.value[IndexType.value].cInvCode,
        cVendorCode: val.value[0].cVendorCode,
        cSAPCode: val.value[0].cSAPCode
      })
        .then(res => {
          const result = res.data?.data?.[0];
          tableDataVal.value[IndexType.value].nTaxPrice =
            result?.nTaxPrice ?? 0;
          tableDataVal.value[IndexType.value].nTaxRate = result?.nTaxRate ?? 0;
        })
        .catch(() => {
          tableDataVal.value[IndexType.value].nTaxPrice = 0;
          tableDataVal.value[IndexType.value].nTaxRate = 0;
        })
        .finally(() => {
          const v = tableDataVal.value[IndexType.value];
          const nQuantity = new BigNumber(v.nQuantity ?? 0); // 数量
          const nTaxPrice = new BigNumber(v.nTaxPrice).decimalPlaces(8); // 含税单价
          const nTaxRate = new BigNumber(v.nTaxRate); // 税率
          const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
          const cDefindParm06 = nTaxMoney
            .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
            .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
          const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
          const nPrice = nQuantity.isGreaterThan(0)
            ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
            : 0; // 不含税单价：不含税金额/采购数量

          tableDataVal.value[IndexType.value].nQuantity = nQuantity.toString();
          tableDataVal.value[IndexType.value].nTaxPrice = nTaxPrice.toString();
          tableDataVal.value[IndexType.value].nTaxRate = nTaxRate.toString();
          tableDataVal.value[IndexType.value].nTaxMoney = nTaxMoney.toString();
          tableDataVal.value[IndexType.value].cDefindParm06 = cDefindParm06
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[IndexType.value].nMoney = nMoney
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[IndexType.value].nPrice = nPrice
            .toFixed(8)
            .replace(/\.?0+$/, '');
        });
    }
  }
  if (
    Route.name === 'KnifeAddPurchaseNoteNoOrigin' ||
    Route.name === 'KnifeAddPurchaseNoteEditNoOrigin' ||
    Route.name === 'KnifeAddPurchaseNote' ||
    Route.name === 'KnifeAddPurchaseNoteEdit' ||
    Route.name == 'AddGrindOrder' ||
    Route.name == 'EditGrindOrder' ||
    Route.name == 'KnifeAddPurchaseRequest' ||
    Route.name == 'KnifeAddPurchaseRequestEdit' ||
    Route.name == 'KnifeAddPurchaseRequestView'
  ) {
    if (
      (Route.name === 'KnifeAddPurchaseRequest' ||
        Route.name === 'KnifeAddPurchaseRequestEdit' ||
        Route.name === 'KnifeAddPurchaseRequestView') &&
      AttributeCode.value == 'cDefindParm03'
    ) {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].cUnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].cUnitName;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
    }

    if (
      AttributeCode.value == 'cInvCode' ||
      AttributeCode.value == 'cInvName'
    ) {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      metadata.value.cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].list_sap = val.value[0].list_sap;
      tableDataVal.value[IndexType.value].list_price = val.value[0].list_price;

      tableDataVal.value[IndexType.value].cDefindParm03 =
        val.value[0]?.list_price?.find(
          i =>
            i.cInvCode === val.value[0].cInvCode &&
            i.cVendorCode === val.value[0].cVendorCode
        )?.cSAPCode || '';
      if (
        Route.name == 'KnifeAddPurchaseRequest' ||
        Route.name == 'KnifeAddPurchaseRequestEdit' ||
        Route.name == 'KnifeAddPurchaseRequestView'
      ) {
        tableDataVal.value[IndexType.value].cDefindParm03 =
          val.value[0]?.list_price?.find(
            i =>
              i.cInvCode === val.value[0].cInvCode &&
              i.cVendorCode === val.value[0].cVendorCode
          )?.cSAPCode ||
          val.value[0].cDefindParm01 ||
          '';
      }
      if (
        Route.name == 'KnifeAddPurchaseRequest' ||
        Route.name == 'KnifeAddPurchaseRequestEdit' ||
        Route.name == 'KnifeAddPurchaseRequestView' ||
        Route.name === 'KnifeAddPurchaseNoteNoOrigin' ||
        Route.name === 'KnifeAddPurchaseNoteEditNoOrigin' ||
        Route.name == 'AddGrindOrder' ||
        Route.name == 'EditGrindOrder'
      ) {
        tableDataVal.value[IndexType.value].cUnitCode = val.value[0].cUnitCode;
        tableDataVal.value[IndexType.value].cUnitName = val.value[0].cUnitName;
      }
      const result = val.value[0].list_price?.[0];
      // 研磨单不带单价
      if (Route.name == 'AddGrindOrder' || Route.name == 'EditGrindOrder') {
        tableDataVal.value[IndexType.value].nTaxRate = result?.nTaxRate ?? 0;
      } else {
        tableDataVal.value[IndexType.value].nTaxPrice = result?.nTaxPrice ?? 0;
        tableDataVal.value[IndexType.value].nTaxRate = result?.nTaxRate ?? 0;
      }
    }

    if (AttributeCode.value == 'cVendorName') {
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
      tableDataVal.value[IndexType.value].nTaxPrice =
        val.value[0].nTaxPrice ?? 0;
      tableDataVal.value[IndexType.value].nTaxRate = val.value[0].nTaxRate ?? 0;
    }
  }

  // SAP 编码选择
  if (
    Route.name === 'KnifeAddPurchaseNoteNoOrigin' ||
    Route.name === 'KnifeAddPurchaseNoteEditNoOrigin' ||
    Route.name === 'KnifeAddPurchaseNoteEdit' ||
    Route.name === 'KnifeAddPurchaseNote'
  ) {
    if (AttributeCode.value == 'cDefindParm03') {
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
    }
  }
  //#endregion

  //#region WMS
  if (Route.name === 'AddPurchaseNote') {
    if (AttributeCode.value == 'cVendorName') {
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
      tableDataVal.value[IndexType.value].cDefindParm09 =
        val.value[0].cDefindParm09;
      tableDataVal.value[IndexType.value].cDefindParm10 =
        val.value[0].cDefindParm10;
      // 获取价格
      getPrice({
        cInvCode: tableDataVal.value[IndexType.value].cInvCode,
        cVendorCode: val.value[0].cVendorCode,
        cSAPCode: val.value[0].cSAPCode
      })
        .then(res => {
          const result = res.data?.data?.[0];
          tableDataVal.value[IndexType.value].nTaxPrice =
            result?.nTaxPrice ?? 0;
          tableDataVal.value[IndexType.value].nTaxRate = result?.nTaxRate ?? 0;
        })
        .catch(() => {
          tableDataVal.value[IndexType.value].nTaxPrice = 0;
          tableDataVal.value[IndexType.value].nTaxRate = 0;
        })
        .finally(() => {
          const v = tableDataVal.value[IndexType.value];
          const nQuantity = new BigNumber(v.nQuantity ?? 0); // 数量
          const nTaxPrice = new BigNumber(v.nTaxPrice).decimalPlaces(8); // 含税单价
          const nTaxRate = new BigNumber(v.nTaxRate); // 税率
          const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
          const cDefindParm06 = nTaxMoney
            .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
            .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
          const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
          const nPrice = nQuantity.isGreaterThan(0)
            ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
            : 0; // 不含税单价：不含税金额/采购数量

          tableDataVal.value[IndexType.value].nQuantity = nQuantity.toString();
          tableDataVal.value[IndexType.value].nTaxPrice = nTaxPrice.toString();
          tableDataVal.value[IndexType.value].nTaxRate = nTaxRate.toString();
          tableDataVal.value[IndexType.value].nTaxMoney = nTaxMoney.toString();
          tableDataVal.value[IndexType.value].cDefindParm06 = cDefindParm06
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[IndexType.value].nMoney = nMoney
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[IndexType.value].nPrice = nPrice
            .toFixed(8)
            .replace(/\.?0+$/, '');
        });
      // #4200 辅料逻辑
      if (props.headData.cVouchTypeCode == '2') {
        InventorySAPGetForList(tableDataVal.value[IndexType.value].cInvCode)
          .then(res => {
            console.log(res);
            const result = res.data?.[0];
            tableDataVal.value[IndexType.value].cDefindParm03 =
              result?.cSAPCode;
          })
          .catch(() => {});
      }
    }
  }
  if (
    Route.name == 'MaterialOutboundAdd' ||
    Route.name == 'MaterialOutboundEdit'
  ) {
    if (
      AttributeCode.value == 'cInvCode' ||
      AttributeCode.value == 'cInvName'
    ) {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      tableDataVal.value[IndexType.value].list_sap = val.value[0].list_sap;
      tableDataVal.value[IndexType.value].cDefindParm03 =
        val.value[0]?.list_sap?.find(i => i.cInvCode === val.value[0].cInvCode)
          ?.cSAPCode || '';

      if (val.value.length > 1) {
        for (let i = 0; i < val.value.length - 1; i++) {
          const emptyRow = tableDataVal.value?.find(
            (item: any) => !item.cInvCode
          );
          if (emptyRow) {
            emptyRow.cInvCode = val.value[i + 1].cInvCode;
            emptyRow.cInvName = val.value[i + 1].cInvName;
            emptyRow.cInvStd = val.value[i + 1].cInvStd;
            emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
            emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
            emptyRow.list_sap = val.value[i + 1].list_sap;
            emptyRow.cDefindParm03 =
              val.value[i + 1]?.list_sap?.find(
                j => j.cInvCode === val.value[i + 1].cInvCode
              )?.cSAPCode || '';
          } else {
            const currentItem = {
              cInvCode: val.value[i + 1].cInvCode,
              cInvName: val.value[i + 1].cInvName,
              cInvStd: val.value[i + 1].cInvStd,
              cUnitCode: val.value[i + 1].CG_UnitCode,
              cUnitName: val.value[i + 1].CG_UnitName,
              list_sap: val.value[i + 1].list_sap,
              cDefindParm03:
                val.value[i + 1]?.list_sap?.find(
                  j => j.cInvCode === val.value[i + 1].cInvCode
                )?.cSAPCode || ''
            } as any;
            tableDataVal.value.push(currentItem);
          }
        }
      }
    }
    if (AttributeCode.value === 'cDefindParm03') {
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
    }
  }
  if (
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin'
  ) {
    if (
      AttributeCode.value == 'cInvCode' ||
      AttributeCode.value == 'cInvName'
    ) {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      metadata.value.cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].list_sap = val.value[0].list_sap;
      tableDataVal.value[IndexType.value].list_price = val.value[0].list_price;
      tableDataVal.value[IndexType.value].cDefindParm04 =
        val.value[0].cDefindParm04;
      tableDataVal.value[IndexType.value].cDefindParm05 =
        val.value[0].cDefindParm05;
      tableDataVal.value[IndexType.value].cDefindParm03 =
        val.value[0]?.list_sap?.find(
          i =>
            i.cInvCode === val.value[0].cInvCode &&
            i.cVendorCode === val.value[0].cVendorCode
        )?.cSAPCode || '';
      getPrice({
        cInvCode: val.value[0].cInvCode,
        cVendorCode: val.value[0].cVendorCode
      })
        .then(res => {
          const result = res.data?.data?.[0];
          tableDataVal.value[IndexType.value].nTaxPrice =
            result?.nTaxPrice ?? 0;
          tableDataVal.value[IndexType.value].nTaxRate = result?.nTaxRate ?? 0;
        })
        .catch(() => {
          tableDataVal.value[IndexType.value].nTaxPrice = 0;
          tableDataVal.value[IndexType.value].nTaxRate = 0;
        })
        .finally(() => {
          const v = tableDataVal.value[IndexType.value];
          const nQuantity = new BigNumber(0); // 数量
          const nTaxPrice = new BigNumber(v.nTaxPrice).decimalPlaces(8); // 含税单价
          const nTaxRate = new BigNumber(v.nTaxRate); // 税率
          const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
          const cDefindParm06 = nTaxMoney
            .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
            .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
          const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
          const nPrice = nQuantity.isGreaterThan(0)
            ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
            : 0; // 不含税单价：不含税金额/采购数量

          tableDataVal.value[IndexType.value].nQuantity = nQuantity.toString();
          tableDataVal.value[IndexType.value].nTaxPrice = nTaxPrice.toString();
          tableDataVal.value[IndexType.value].nTaxRate = nTaxRate.toString();
          tableDataVal.value[IndexType.value].nTaxMoney = nTaxMoney.toString();
          tableDataVal.value[IndexType.value].cDefindParm06 = cDefindParm06
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[IndexType.value].nMoney = nMoney
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[IndexType.value].nPrice = nPrice
            .toFixed(8)
            .replace(/\.?0+$/, '');
        });
    }

    // 将 val.value 里的索引不为0的所有值依次填充到列表中的其他 cInvCode 不存在的行里，为 0 就填充到当前行
    if (val.value.length > 1) {
      for (let i = 0; i < val.value.length - 1; i++) {
        const emptyRow = tableDataVal.value?.find(
          (item: any) => !item.cInvCode
        );
        if (emptyRow) {
          emptyRow.cInvCode = val.value[i + 1].cInvCode;
          emptyRow.cInvName = val.value[i + 1].cInvName;
          emptyRow.cInvStd = val.value[i + 1].cInvStd;
          emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
          emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
          emptyRow.cVendorName = val.value[i + 1].cVendorName;
          emptyRow.cVendorCode = val.value[i + 1].cVendorCode;
          emptyRow.list_sap = val.value[i + 1].list_sap;
          emptyRow.cDefindParm04 = val.value[i + 1].cDefindParm04;
          emptyRow.cDefindParm05 = val.value[i + 1].cDefindParm05;
          emptyRow.cDefindParm03 =
            val.value[i + 1]?.list_sap?.find(
              j =>
                j.cInvCode === val.value[i + 1].cInvCode &&
                j.cVendorCode === val.value[i + 1].cVendorCode
            )?.cSAPCode || '';

          getPrice({
            cInvCode: val.value[i + 1].cInvCode,
            cVendorCode: val.value[i + 1].cVendorCode
          })
            .then(res => {
              const result = res.data?.data?.[0];
              emptyRow.nTaxPrice = result?.nTaxPrice ?? 0;
              emptyRow.nTaxRate = result?.nTaxRate ?? 0;
            })
            .catch(() => {
              emptyRow.nTaxPrice = 0;
              emptyRow.nTaxRate = 0;
            })
            .finally(() => {
              const v = emptyRow;
              const nQuantity = new BigNumber(0); // 数量
              const nTaxPrice = new BigNumber(v.nTaxPrice).decimalPlaces(8); // 含税单价
              const nTaxRate = new BigNumber(v.nTaxRate); // 税率
              const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
              const cDefindParm06 = nTaxMoney
                .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
                .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
              const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
              const nPrice = nQuantity.isGreaterThan(0)
                ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
                : 0; // 不含税单价：不含税金额/采购数量

              emptyRow.nQuantity = nQuantity.toString();
              emptyRow.nTaxPrice = nTaxPrice.toString();
              emptyRow.nTaxRate = nTaxRate.toString();
              emptyRow.nTaxMoney = nTaxMoney.toString();
              emptyRow.cDefindParm06 = cDefindParm06
                .toFixed(2)
                .replace(/\.?0+$/, '');
              emptyRow.nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
              emptyRow.nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
            });
        } else {
          const currentItem = {
            cInvCode: val.value[i + 1].cInvCode,
            cInvName: val.value[i + 1].cInvName,
            cInvStd: val.value[i + 1].cInvStd,
            cUnitCode: val.value[i + 1].CG_UnitCode,
            cUnitName: val.value[i + 1].CG_UnitName,
            cVendorName: val.value[i + 1].cVendorName,
            cVendorCode: val.value[i + 1].cVendorCode,
            list_sap: val.value[i + 1].list_sap,
            cDefindParm04: val.value[i + 1].cDefindParm04,
            cDefindParm05: val.value[i + 1].cDefindParm05,
            cDefindParm03:
              val.value[i + 1]?.list_sap?.find(
                j =>
                  j.cInvCode === val.value[i + 1].cInvCode &&
                  j.cVendorCode === val.value[i + 1].cVendorCode
              )?.cSAPCode || ''
          } as any;
          getPrice({
            cInvCode: val.value[i + 1].cInvCode,
            cVendorCode: val.value[i + 1].cVendorCode
          })
            .then(res => {
              const result = res.data?.data?.[0];
              currentItem.nTaxPrice = result?.nTaxPrice ?? 0;
              currentItem.nTaxRate = result?.nTaxRate ?? 0;
            })
            .catch(() => {
              currentItem.nTaxPrice = 0;
              currentItem.nTaxRate = 0;
            })
            .finally(() => {
              const v = currentItem;
              const nQuantity = new BigNumber(0); // 数量
              const nTaxPrice = new BigNumber(v.nTaxPrice).decimalPlaces(8); // 含税单价
              const nTaxRate = new BigNumber(v.nTaxRate); // 税率
              const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
              const cDefindParm06 = nTaxMoney
                .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
                .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
              const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
              const nPrice = nQuantity.isGreaterThan(0)
                ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
                : 0; // 不含税单价：不含税金额/采购数量

              currentItem.nQuantity = nQuantity.toString();
              currentItem.nTaxPrice = nTaxPrice.toString();
              currentItem.nTaxRate = nTaxRate.toString();
              currentItem.nTaxMoney = nTaxMoney.toString();
              currentItem.cDefindParm06 = cDefindParm06
                .toFixed(2)
                .replace(/\.?0+$/, '');
              currentItem.nMoney = nMoney.toFixed(2).replace(/\.?0+$/, '');
              currentItem.nPrice = nPrice.toFixed(8).replace(/\.?0+$/, '');
            });
          tableDataVal.value.push(currentItem);
        }
      }
    }

    // #4200 辅料逻辑
    if (props.headData.cVouchTypeCode == '2') {
      if (AttributeCode.value == 'cVendorName') {
        tableDataVal.value[IndexType.value].cVendorName =
          val.value[0].cVendorName;
        tableDataVal.value[IndexType.value].cVendorCode =
          val.value[0].cVendorCode;
        InventorySAPGetForList(tableDataVal.value[IndexType.value].cInvCode)
          .then(res => {
            console.log(res);
            const result = res.data?.[0];
            tableDataVal.value[IndexType.value].cDefindParm03 =
              result?.cSAPCode;
          })
          .catch(() => {});
      }
    }
  }

  if (
    Route.name === 'PurchaseRequestNoProdAdd' ||
    Route.name === 'PurchaseRequestNoProdEdit' ||
    Route.name === 'PurchaseRequestNotionsAdd' ||
    Route.name === 'PurchaseRequestNotionsEdit'
  ) {
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      const sapFirst = val.value[0]?.list_sap?.[0];
      tableDataVal.value[IndexType.value].cDefindParm08 = sapFirst?.cSAPCode;
      tableDataVal.value[IndexType.value].cDefindParm10 = sapFirst?.cSAPName;
    }
    if (AttributeCode.value == 'cUnitName') {
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].cUnitName;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].cUnitCode;
    }
  }

  if (
    Route.name == 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
  ) {
    if (AttributeCode.value == 'cUnitName') {
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].cUnitName;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].cUnitCode;
    }
    if (AttributeCode.value === 'cDefindParm03') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      metadata.value.cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
    }
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      metadata.value.cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].list_sap = val.value[0].list_sap;
      tableDataVal.value[IndexType.value].cDefindParm03 = val.value[0].cSAPCode;
      tableDataVal.value[IndexType.value].cVendorName =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;

      // 将 val.value 里的索引不为0的所有值依次填充到列表中的其他 cInvCode 不存在的行里，为 0 就填充到当前行
      if (val.value.length > 1) {
        for (let i = 0; i < val.value.length - 1; i++) {
          const emptyRow = tableDataVal.value?.find(
            (item: any) => !item.cInvCode
          );
          if (emptyRow) {
            emptyRow.cInvCode = val.value[i + 1].cInvCode;
            emptyRow.cInvName = val.value[i + 1].cInvName;
            emptyRow.cInvStd = val.value[i + 1].cInvStd;
            emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
            emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
            emptyRow.list_sap = val.value[i + 1].list_sap;
            emptyRow.cDefindParm03 = val.value[i + 1].cSAPCode;
            emptyRow.cVendorName = val.value[i + 1].cVendorName;
            emptyRow.cVendorCode = val.value[i + 1].cVendorCode;
          } else {
            tableDataVal.value.push({
              cInvCode: val.value[i + 1].cInvCode,
              cInvName: val.value[i + 1].cInvName,
              cInvStd: val.value[i + 1].cInvStd,
              cUnitCode: val.value[i + 1].CG_UnitCode,
              cUnitName: val.value[i + 1].CG_UnitName,
              list_sap: val.value[i + 1].list_sap,
              cDefindParm03: val.value[i + 1].cSAPCode,
              cVendorName: val.value[i + 1].cVendorName,
              cVendorCode: val.value[i + 1].cVendorCode
            });
          }
        }
      }
    }
    if (Route.name == 'AddPurchaseRequest') {
      if (AttributeCode.value == 'cVendorName') {
        tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
        tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
        tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
        tableDataVal.value[IndexType.value].cUnitCode =
          val.value[0].CG_UnitCode;
        tableDataVal.value[IndexType.value].cUnitName =
          val.value[0].CG_UnitName;
        metadata.value.cInvCode = val.value[0].cInvCode;
        tableDataVal.value[IndexType.value].list_sap = val.value[0].list_sap;
        tableDataVal.value[IndexType.value].cDefindParm03 =
          val.value[0].cSAPCode;
        tableDataVal.value[IndexType.value].cVendorName =
          val.value[0].cVendorName;
        tableDataVal.value[IndexType.value].cVendorCode =
          val.value[0].cVendorCode;

        // 将 val.value 里的索引不为0的所有值依次填充到列表中的其他 cInvCode 不存在的行里，为 0 就填充到当前行
        if (val.value.length > 1) {
          for (let i = 0; i < val.value.length - 1; i++) {
            const emptyRow = tableDataVal.value?.find(
              (item: any) => !item.cInvCode
            );
            if (emptyRow) {
              emptyRow.cInvCode = val.value[i + 1].cInvCode;
              emptyRow.cInvName = val.value[i + 1].cInvName;
              emptyRow.cInvStd = val.value[i + 1].cInvStd;
              emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
              emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
              emptyRow.list_sap = val.value[i + 1].list_sap;
              emptyRow.cDefindParm03 = val.value[i + 1].cSAPCode;
              emptyRow.cVendorName = val.value[i + 1].cVendorName;
              emptyRow.cVendorCode = val.value[i + 1].cVendorCode;
            } else {
              tableDataVal.value.push({
                cInvCode: val.value[i + 1].cInvCode,
                cInvName: val.value[i + 1].cInvName,
                cInvStd: val.value[i + 1].cInvStd,
                cUnitCode: val.value[i + 1].CG_UnitCode,
                cUnitName: val.value[i + 1].CG_UnitName,
                list_sap: val.value[i + 1].list_sap,
                cDefindParm03: val.value[i + 1].cSAPCode,
                cVendorName: val.value[i + 1].cVendorName,
                cVendorCode: val.value[i + 1].cVendorCode
              });
            }
          }
        }
      }
    } else {
      if (AttributeCode.value == 'cVendorName') {
        tableDataVal.value[IndexType.value].cVendorName =
          val.value[0].cVendorName;
        tableDataVal.value[IndexType.value].cVendorCode =
          val.value[0].cVendorCode;
      }
    }
  }
  //#endregion

  if (
    Route.name == 'newPurchaseAudit' ||
    Route.name == 'newPurchaseAuditEdit' ||
    Route.name == 'newPurchaseAuditView' ||
    Route.name == 'KnifeNewPurchaseAudit' ||
    Route.name == 'KnifeNewPurchaseAuditEdit' ||
    Route.name == 'KnifeNewPurchaseAuditView' ||
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
    Route.name === 'WorkshopStatisticsCoreOrderEdit' ||
    Route.name === 'WorkshopStatisticsCoreOrderAdd'
  ) {
    if (AttributeCode.value == 'cEmployeeName') {
      tableDataVal.value[IndexType.value].cEmployeeCode =
        val.value[0].cEmployeeCode;
      tableDataVal.value[IndexType.value].cEmployeeName =
        val.value[0].cEmployeeName;
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
  if (
    Route.name == 'newPurchaseAuditEdit' ||
    Route.name == 'KnifeNewPurchaseAuditEdit'
  ) {
    if (AttributeCode.value == 'cVendorName') {
      tableDataVal.value[IndexType.value][AttributeCode.value] =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].cVendorCode =
        val.value[0].cVendorCode;
    }
  }
  //工厂变更
  if (Route.name == 'ProductionOrderBG') {
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

  if (Route.name == 'ScrapToolInfoAdd' || Route.name == 'ScrapToolInfoEdit') {
    tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
    tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
    tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
    tableDataVal.value[IndexType.value].cUnitCode = val.value[0].cUnitCode;
    tableDataVal.value[IndexType.value].cUnitName = val.value[0].cUnitName;
    tableDataVal.value[IndexType.value].cDefindParm03 =
      val.value[0]?.list_price?.[0].cSAPCode;
  }

  if (Route.name == 'memAdminAdd' || Route.name == 'memAdminEdit') {
    tableDataVal.value[IndexType.value].cLableCode = val.value[0].cLableCode;
    tableDataVal.value[IndexType.value].cLableName = val.value[0].cLableName;
    tableDataVal.value[IndexType.value].model = '';
  }
  if (
    Route.name == 'otherInNotifyAdd' ||
    Route.name == 'otherInNotifyEdit' ||
    Route.name == 'otherOutNotifyAdd' ||
    Route.name == 'otherOutNotifyEdit'
  ) {
    if (AttributeCode.value === 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
      tableDataVal.value[IndexType.value].cDefindParm05 =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cDefindParm06 =
        val.value[0].cVendorName;
      tableDataVal.value[IndexType.value].list_sap = val.value[0].list_sap;
      tableDataVal.value[IndexType.value].cDefindParm08 = val.value[0].cSAPCode;
    }
    if (AttributeCode.value === 'cDefindParm06') {
      tableDataVal.value[IndexType.value].cDefindParm05 =
        val.value[0].cVendorCode;
      tableDataVal.value[IndexType.value].cDefindParm06 =
        val.value[0].cVendorName;
    }
  }

  if (Route.name == 'TransferRecordAdd' || Route.name == 'TransferRecordEdit') {
    if (AttributeCode.value === 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
      tableDataVal.value[IndexType.value].cUnitCode = val.value[0].CG_UnitCode;
      tableDataVal.value[IndexType.value].cUnitName = val.value[0].CG_UnitName;
    }
  }

  if (
    Route.name == 'LabelUsageConfigurationAdd' ||
    Route.name == 'LabelUsageConfigurationEdit' ||
    Route.name == 'LabelUsageConfigurationView'
  ) {
    tableDataVal.value[IndexType.value].LABELCODE = val.value[0].LABELCODE;
    tableDataVal.value[IndexType.value].LABELNAME = val.value[0].LABELNAME;
  }
  if (
    Route.name == 'FinishedSubPartComparisonAdd' ||
    Route.name == 'FinishedSubPartComparisonEdit' ||
    Route.name == 'FinishedSubPartComparisonView'
  ) {
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

  dialogType.value = false;
  // myTableRef.value.doLayout()
};

const onKeyPressEnter = async (e, item, scope) => {
  console.log(e.target.value, item, scope);
  if (!e.target.value) {
    return;
  }

  if (
    ((Route.name === 'AddPurchaseRequest' ||
      Route.name == 'AddPurchaseRequestEdit' ||
      Route.name == 'AddPurchaseRequestView' ||
      Route.name === 'MaterialOutboundAdd' ||
      Route.name === 'MaterialOutboundEdit') &&
      item.prop === 'cInvCode') ||
    Route.name == 'PurchaseRequestNoProdAdd' ||
    Route.name == 'PurchaseRequestNoProdEdit' ||
    Route.name == 'PurchaseRequestNotionsAdd' ||
    Route.name == 'PurchaseRequestNotionsEdit' ||
    Route.name == 'InventoryListAdd'
  ) {
    const {
      data: { data }
    } = await InventoryInfoGetForPage(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvStd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].CG_UnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].CG_UnitName;
      tableDataVal.value[scope.$index].cDefindParm03 = data[0].cSAPCode;
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

  if (
    (Route.name === 'KnifeAddPurchaseRequest' ||
      Route.name === 'KnifeAddPurchaseRequestEdit') &&
    item.prop === 'cInvCode'
  ) {
    const {
      data: { data }
    } = await KnifeInventoryInfoGetForPage(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvStd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].cUnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].cUnitName;
      tableDataVal.value[scope.$index].cDefindParm03 =
        data[0]?.list_price?.find(
          i =>
            i.cInvCode === data[0].cInvCode &&
            i.cVendorCode === data[0].cVendorCode
        )?.cSAPCode ||
        data[0].cDefindParm01 ||
        '';
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
  if (
    (Route.name === 'AddPurchaseRequest' ||
      Route.name == 'AddPurchaseRequestEdit' ||
      Route.name == 'AddPurchaseRequestView' ||
      Route.name == 'MaterialOutboundAdd' ||
      Route.name == 'MaterialOutboundEdit') &&
    item.prop === 'cDefindParm03'
  ) {
    const {
      data: { data }
    } = await InventorySAPGetForPage(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvStd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].CG_UnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].CG_UnitName;
      tableDataVal.value[scope.$index].cDefindParm03 = data[0].cSAPCode;
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

  if (
    (Route.name === 'KnifeAddPurchaseRequest' ||
      Route.name == 'KnifeAddPurchaseRequestEdit' ||
      Route.name == 'KnifeAddPurchaseRequestView') &&
    item.prop === 'cDefindParm03'
  ) {
    const {
      data: { data }
    } = await KnifeInventorySAPGetForPage(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvStd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].cUnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].cUnitName;
      tableDataVal.value[scope.$index].cDefindParm03 = data[0].cSAPCode;
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

  if (
    Route.name === 'otherInNotifyAdd' ||
    Route.name === 'otherInNotifyEdit' ||
    Route.name === 'otherOutNotifyAdd' ||
    Route.name === 'otherOutNotifyEdit'
  ) {
    const {
      data: { data }
    } = await InventoryInfoGetForPage(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvStd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].CG_UnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].CG_UnitName;
      tableDataVal.value[scope.$index].list_sap = data[0].list_sap;
      tableDataVal.value[scope.$index].cDefindParm05 = data[0].cVendorCode;
      tableDataVal.value[scope.$index].cDefindParm06 = data[0].cVendorName;
      tableDataVal.value[scope.$index].cDefindParm08 = data[0].cSAPCode;
    } else {
      // 提示错误：未找到物料
      ElMessage.error('未找到数据');
      tableDataVal.value[scope.$index].cInvCode = '';
      tableDataVal.value[scope.$index].cInvName = '';
      tableDataVal.value[scope.$index].cInvStd = '';
      tableDataVal.value[scope.$index].cUnitCode = '';
      tableDataVal.value[scope.$index].cUnitName = '';
      tableDataVal.value[scope.$index].cDefindParm08 = '';
      tableDataVal.value[scope.$index].cDefindParm05 = '';
      tableDataVal.value[scope.$index].cDefindParm06 = '';
      tableDataVal.value[scope.$index].list_sap = [];
    }
  }

  if (
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin'
  ) {
    const {
      data: { data }
    } = await InventoryInfoGetForPageNoOrigin(e.target.value);
    if (data[0]) {
      ElMessage.success('录入成功');
      tableDataVal.value[scope.$index].cInvCode = data[0].cInvCode;
      tableDataVal.value[scope.$index].cInvName = data[0].cInvName;
      tableDataVal.value[scope.$index].cInvStd = data[0].cInvStd;
      tableDataVal.value[scope.$index].cUnitCode = data[0].CG_UnitCode;
      tableDataVal.value[scope.$index].cUnitName = data[0].CG_UnitName;
      tableDataVal.value[scope.$index].cVendorName = data[0].cVendorName;
      tableDataVal.value[scope.$index].cVendorCode = data[0].cVendorCode;
      tableDataVal.value[scope.$index].list_sap = data[0].list_sap;
      tableDataVal.value[scope.$index].cDefindParm04 = data[0].cDefindParm04;
      tableDataVal.value[scope.$index].cDefindParm05 = data[0].cDefindParm05;
      tableDataVal.value[scope.$index].cDefindParm03 =
        data[0]?.list_sap?.find(
          i =>
            i.cInvCode === data[0].cInvCode &&
            i.cVendorCode === data[0].cVendorCode
        )?.cSAPCode || '';
      // 获取价格
      getPrice({
        cInvCode: data[0].cInvCode,
        cVendorCode: data[0].cVendorCode
      })
        .then(res => {
          const result = res.data?.data?.[0];
          tableDataVal.value[scope.$index].nTaxPrice = result?.nTaxPrice
            ? result?.nTaxPrice
            : 0;
          tableDataVal.value[scope.$index].nTaxRate = result?.nTaxRate
            ? result?.nTaxRate
            : 0;
        })
        .catch(() => {
          tableDataVal.value[scope.$index].nTaxPrice = 0;
          tableDataVal.value[scope.$index].nTaxRate = 0;
        })
        .finally(() => {
          const v = tableDataVal.value[scope.$index];
          const nQuantity = new BigNumber(0); // 数量
          const nTaxPrice = new BigNumber(v.nTaxPrice).decimalPlaces(8); // 含税单价
          const nTaxRate = new BigNumber(v.nTaxRate); // 税率
          const nTaxMoney = nTaxPrice.multipliedBy(nQuantity); // 税价合计：采购数量*含税单价
          const cDefindParm06 = nTaxMoney
            .dividedBy(new BigNumber(1).plus(nTaxRate.dividedBy(100)))
            .multipliedBy(nTaxRate.dividedBy(100)); // 税额：（价税合计/（1+税率/100））*税率/100
          const nMoney = nTaxMoney.minus(cDefindParm06); // 不含税金额：价税合计-税额
          const nPrice = nQuantity.isGreaterThan(0)
            ? nMoney.dividedBy(nQuantity).decimalPlaces(8)
            : 0; // 不含税单价：不含税金额/采购数量

          tableDataVal.value[scope.$index].nQuantity = nQuantity.toString();
          tableDataVal.value[scope.$index].nTaxPrice = nTaxPrice.toString();
          tableDataVal.value[scope.$index].nTaxRate = nTaxRate.toString();
          tableDataVal.value[scope.$index].nTaxMoney = nTaxMoney.toString();
          tableDataVal.value[scope.$index].cDefindParm06 = cDefindParm06
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[scope.$index].nMoney = nMoney
            .toFixed(2)
            .replace(/\.?0+$/, '');
          tableDataVal.value[scope.$index].nPrice = nPrice
            .toFixed(8)
            .replace(/\.?0+$/, '');
        });
    } else {
      // 提示错误：未找到物料
      ElMessage.error('未找到数据');
      tableDataVal.value[scope.$index].cInvCode = '';
      tableDataVal.value[scope.$index].cInvName = '';
      tableDataVal.value[scope.$index].cInvStd = '';
      tableDataVal.value[scope.$index].cUnitCode = '';
      tableDataVal.value[scope.$index].cUnitName = '';
      tableDataVal.value[scope.$index].cVendorName = '';
      tableDataVal.value[scope.$index].cVendorCode = '';
      tableDataVal.value[scope.$index].list_sap = [];
      tableDataVal.value[scope.$index].cDefindParm03 = '';
      tableDataVal.value[scope.$index].cDefindParm04 = '';
      tableDataVal.value[scope.$index].cDefindParm05 = '';
    }
  }
};
// 搜索弹框事件
const clickModel = (obj: any, type: any, i: any, scope: any) => {
  console.log();
  console.log('clickModel:obj', obj);
  console.log('clickModel:scope.row', scope.row);
  if (Route.name === 'KnifeAddPurchaseNote') {
    metadata.value.cInvCode = scope.row.cInvCode;
  }
  // #4200 辅料特殊处理
  if (Route.name === 'AddPurchaseNote') {
    if (props.headData.cVouchTypeCode == '2') {
      console.log('辅料');
      obj.cIncludeModelCode = 'ManageCenter.Vendor.M.FormList';
    } else {
      metadata.value.cInvCode = scope.row.cInvCode;
      console.log('原料');
    }
  }
  if (
    Route.name === 'AddPurchaseRequest' ||
    Route.name === 'AddPurchaseRequestEdit'
  ) {
    if (obj.cAttributeCode === 'cUnitName') {
      if (scope.row.cInvCode) {
        metadata.value.cInvCode = scope.row.cInvCode;
      } else {
        metadata.value.cInvCode = '';
        ElMessage.warning('请先选择物料');
        return;
      }
    }
  }
  if (Route.name === 'KnifeAddPurchaseNoteNoOrigin') {
    if (obj.cAttributeCode === 'cVendorName') {
      if (scope.row.cInvCode) {
        metadata.value.cInvCode = scope.row.cInvCode;
        metadata.value.cVendorCode = scope.row.cVendorCode;
      } else {
        metadata.value.cInvCode = '';
        metadata.value.cVendorCode = '';
        ElMessage.warning('请先选择刀具');
        return;
      }
    }
  }
  if (Route.name === 'EditGrindOrder' || Route.name === 'AddGrindOrder') {
    if (obj.cAttributeCode === 'cDefindParm03') {
      if (scope.row.cInvCode) {
        metadata.value.cInvCode = scope.row.cInvCode;
        metadata.value.cVendorCode = scope.row.cVendorCode;
      } else {
        metadata.value.cInvCode = '';
        metadata.value.cVendorCode = '';
        ElMessage.warning('请先选择刀具');
        return;
      }
    }
  }

  if (
    Route.name === 'TooolInfo' ||
    Route.name === 'EditTooolInfo' ||
    Route.name === 'AddGrindOrder' ||
    Route.name === 'EditGrindOrder'
  ) {
    metadata.value.cInvCode = scope.row.cInvCode;
    metadata.value.cVendorCode = scope.row.cVendorCode;
  }

  if (
    Route.name === 'MaterialOutboundAdd' ||
    Route.name === 'MaterialOutboundEdit'
  ) {
    metadata.value.cInvCode = scope.row.cInvCode;
  }

  if (
    Route.name === 'PurchaseRequestNotionsAdd' ||
    Route.name === 'PurchaseRequestNotionsEdit'
  ) {
    if (obj.cAttributeCode === 'cUnitName') {
      if (scope.row.cInvCode) {
        metadata.value.cInvCode = scope.row.cInvCode;
      } else {
        metadata.value.cInvCode = '';
        ElMessage.warning('请先选择物料');
        return;
      }
    }
  }

  ajax.value = obj.ajax;
  IndexType.value = i;
  MulitChoose.value =
    Route.name === 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView' ||
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin' ||
    Route.name === 'MaterialOutboundEdit' ||
    Route.name === 'MaterialOutboundAdd'
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

const clickSort = (i: number, val: string) => {
  tableHeader.value[i].slot = val;
  const prop = tableHeader.value[i].prop;
  emit('tableHearData', { prop, val });
};

const rowVal = ref({});
const columnVal = ref({});
const cellVal = ref({});
const eventVal = ref({});
// 操作完成后添加样式
const cellClick = (type: any, row: any, column: any, cell: any, event: any) => {
  rowInt.value = row.int;
  rowVal.value = row;
  columnVal.value = column;
  cellVal.value = cell;
  eventVal.value = event;
  if (type) {
    cell.style = 'background:pink';
  }
};

const funShow = (index: any, row: any, prop: any) => {
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

$bus.on('tablecopy', (val: any) => {
  tableDataValCopy.value = tableDataVal.value;
  myTableRef.value!.clearSelection();
});
const clearFilter = () => {
  myTableRef.value!.clearFilter();
};

const querySearchAsync = async (
  item,
  scope,
  queryString: string,
  cb: (arg: any) => void
) => {
  console.log(item, scope);
  let queryParams: any = {};
  let queryData: any = {
    PageIndex: 1,
    PageSize: 20,
    OrderByFileds: '',
    conditions: ''
  };
  let results = [];
  if (queryString) {
    if (Route.name === 'ProductionOrderBG') {
      if (item.prop === 'Items_cInvName' || item.prop === 'Itemss_cInvName') {
        queryData.conditions = `cInvName like ${queryString}`;
      }
      if (
        [
          'Itemss_cStructName',
          'Itemss_cDefindParm01Name',
          'Itemss_cDefindParm02Name',
          'Itemss_cDefindParm03Name',
          'Itemss_cDefindParm04Name',
          'Itemss_cDefindParm05Name',
          'Itemss_cDefindParm06Name'
        ].includes(item.prop)
      ) {
        queryData.conditions = `cDictonaryName like ${queryString}`;
      }
    }
  }
  if (
    Route.name === 'otherInNotifyAdd' ||
    Route.name === 'otherInNotifyEdit' ||
    Route.name === 'otherOutNotifyAdd' ||
    Route.name === 'otherOutNotifyEdit'
  ) {
    if (item.prop === 'cUnitName') {
      if (scope.row.cInvCode) {
        const conditions = [
          `cInvCode = ${scope.row.cInvCode}`,
          'cUnitTypeCode=1 '
        ];
        console.log(queryString);
        if (queryString && queryString != 'null') {
          conditions.push(`cUnitName like ${queryString}`);
        }
        queryData.conditions = conditions.join(' && ');
      } else {
        cb(results);
        return;
      }
    }
  }
  try {
    const { data } = await request({
      url: item.cServerIP + item.cUrl,
      method: item.cHttpTypeCode,
      params: queryParams,
      data: queryData
    });
    results = (data.data ?? data).map(i => {
      const r = { ...i };
      if (Route.name === 'ProductionOrderBG') {
        if (item.prop === 'Items_cInvName' || item.prop === 'Itemss_cInvName') {
          r.value = i.cInvName;
        }
        if (
          [
            'Itemss_cStructName',
            'Itemss_cDefindParm01Name',
            'Itemss_cDefindParm02Name',
            'Itemss_cDefindParm03Name',
            'Itemss_cDefindParm04Name',
            'Itemss_cDefindParm05Name',
            'Itemss_cDefindParm06Name'
          ].includes(item.prop)
        ) {
          r.value = i.cDictonaryName;
        }
      }

      if (
        Route.name === 'otherInNotifyAdd' ||
        Route.name === 'otherInNotifyEdit' ||
        Route.name === 'otherOutNotifyAdd' ||
        Route.name === 'otherOutNotifyEdit'
      ) {
        if (item.prop === 'cUnitName') {
          r.value = i.cUnitName;
        }
      }
      return r;
    });
    cb(results);
  } catch {
    //
  }
};

const handleSwitchChange = (val, item, scope) => {
  console.log(val, item, scope);
};

// 自动补全选择
const handleAutoTextSelect = (data: any, item, scope) => {
  console.log(item);
  if (Route.name === 'ProductionOrderBG') {
    if (item.prop === 'Itemss_cStructName') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cStructCode'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Itemss_cDefindParm01Name') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cDefindParm01'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Itemss_cDefindParm02Name') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cDefindParm02'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Itemss_cDefindParm03Name') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cDefindParm03'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Itemss_cDefindParm04Name') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cDefindParm04'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Itemss_cDefindParm05Name') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cDefindParm05'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Itemss_cDefindParm06Name') {
      tableDataVal.value[scope.$index][item.prop] = data.cDictonaryName;
      tableDataVal.value[scope.$index]['Itemss_cDefindParm06'] =
        data.cDictonaryCode;
    }
    if (item.prop === 'Items_cInvName') {
      tableDataVal.value[scope.$index][item.prop] = data.cInvName;
      tableDataVal.value[scope.$index]['Items_cInvCode'] = data.cInvCode;
    }
    if (item.prop === 'Itemss_cInvName') {
      tableDataVal.value[scope.$index][item.prop] = data.cInvName;
      tableDataVal.value[scope.$index]['Itemss_cInvCode'] = data.cInvCode;
    }
  }
  console.log(tableDataVal.value);
};

// 自动补全修改（移除数据）
const handleAutoTextChange = item => {
  console.log(item);
};

const onVendorChange = (e, scope) => {
  console.log(e, scope);
  if (!['otherInNotifyAdd', 'otherInNotifyEdit'].includes(Route.name)) {
    tableDataVal.value[scope.$index].cDefindParm03 = e.cSAPCode;
  }
  if (Route.name === 'otherInNotifyAdd' || Route.name === 'otherInNotifyEdit') {
    tableDataVal.value[scope.$index].cDefindParm05 = e.cVendorCode;
    tableDataVal.value[scope.$index].cDefindParm06 = e.cVendorName;
    tableDataVal.value[scope.$index].cDefindParm08 = e.cSAPCode;
  }
  tableDataVal.value[scope.$index].cVendorCode = e.cVendorCode;
  tableDataVal.value[scope.$index].cVendorName = e.cVendorName;
  console.log(tableDataVal.value, 'tableDataVal.value onVendorChange');
  if (
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin'
  ) {
    // 获取价格
    getPrice({
      cInvCode: tableDataVal.value[scope.$index].cInvCode,
      cVendorCode: e.cVendorCode
    })
      .then(res => {
        const result = res.data?.data?.[0];
        tableDataVal.value[scope.$index].nTaxPrice = result?.nTaxPrice ?? 0;
        tableDataVal.value[scope.$index].nTaxRate = result?.nTaxRate ?? 0;
      })
      .catch(() => {
        tableDataVal.value[scope.$index].nTaxPrice = 0;
        tableDataVal.value[scope.$index].nTaxRate = 0;
      });
  }
};

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
