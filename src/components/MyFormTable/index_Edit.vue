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
                placeholder=""
                @change="(value:any)=>tableSelect(value,item.prop,scope.$index,item.PullData)"
                filterable
              >
                <el-option
                  v-for="(val, index) in item.PullData"
                  :key="index"
                  :label="val.cDictonaryName || val.cUnitName"
                  :value="val.cDictonaryCode || val.cUnitCode"
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
            <div
              v-else-if="
                ([
                  'AddPurchaseNoteNoOrigin',
                  'AddPurchaseNoteEditNoOrigin',
                  'newPurchaseAuditEdit',
                  'AddPurchaseRequestEdit'
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
              >
                <el-option
                  v-for="(selectItem, index) in scope.row['list_sap']"
                  :key="index"
                  :label="selectItem.cVendorName"
                  :value="selectItem.cVendorCode"
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
import BigNumber from 'bignumber.js';
import {
  ParamsApi,
  InventoryInfoGetForPage,
  InventoryInfoGetForPageNoOrigin,
  getPrice
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
  if (!v) {
    return true;
  }
  return false;
};
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
  if (Route.name === 'newPurchasedGoods') {
    if (
      p === 'nAccReceiveQuantity' ||
      p === 'nAccQuantity' ||
      p === 'nReceiveQuantity'
    ) {
      const nReceiveQuantity = new BigNumber(row.nReceiveQuantity ?? 0); // 到货数量
      const nTaxPrice = new BigNumber(row.nTaxPrice ?? 0).decimalPlaces(8); // 含税单价
      const nTaxRate = new BigNumber(row.nTaxRate ?? 0); // 税率
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
  if (
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNote'
  ) {
    console.log(p);
    if (p === 'nQuantity' || p === 'nTaxPrice') {
      if (p === 'nQuantity' && !row.nTaxPrice) {
        try {
          const r = await getPrice({
            cInvCode: row.cInvCode,
            cVendorCode: row.cVendorCode
          });
          const result = r.data?.[0];
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
  console.log(tableDataVal.value);
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
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin'
  ) {
    if (AttributeCode.value == 'cInvCode') {
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
      tableDataVal.value[IndexType.value].cDefindParm03 =
        val.value[0].list_sap.find(
          i =>
            i.cInvCode === val.value[0].cInvCode &&
            i.cVendorCode === val.value[0].cVendorCode
        )?.cSAPCode || '';
      getPrice({
        cInvCode: val.value[0].cInvCode,
        cVendorCode: val.value[0].cVendorCode
      })
        .then(res => {
          const result = res.data?.[0];
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
        const emptyRow = tableDataVal.value.find((item: any) => !item.cInvCode);
        if (emptyRow) {
          emptyRow.cInvCode = val.value[i + 1].cInvCode;
          emptyRow.cInvName = val.value[i + 1].cInvName;
          emptyRow.cInvStd = val.value[i + 1].cInvStd;
          emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
          emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
          emptyRow.cVendorName = val.value[i + 1].cVendorName;
          emptyRow.cVendorCode = val.value[i + 1].cVendorCode;
          emptyRow.list_sap = val.value[i + 1].list_sap;
          emptyRow.cDefindParm03 =
            val.value[i + 1].list_sap.find(
              j =>
                j.cInvCode === val.value[i + 1].cInvCode &&
                j.cVendorCode === val.value[i + 1].cVendorCode
            )?.cSAPCode || '';

          getPrice({
            cInvCode: val.value[i + 1].cInvCode,
            cVendorCode: val.value[i + 1].cVendorCode
          })
            .then(res => {
              const result = res.data?.[0];
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
            cDefindParm03:
              val.value[i + 1].list_sap.find(
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
              const result = res.data?.[0];
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
  }
  if (
    Route.name == 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
  ) {
    if (AttributeCode.value == 'cInvCode') {
      tableDataVal.value[IndexType.value].cInvCode = val.value[0].cInvCode;
      tableDataVal.value[IndexType.value].cInvName = val.value[0].cInvName;
      tableDataVal.value[IndexType.value].cInvStd = val.value[0].cInvStd;
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
            emptyRow.cInvStd = val.value[i + 1].cInvStd;
            emptyRow.cUnitCode = val.value[i + 1].CG_UnitCode;
            emptyRow.cUnitName = val.value[i + 1].CG_UnitName;
            emptyRow.cDefindParm03 = val.value[i + 1].SAPCode;
            emptyRow.cVendorName = val.value[i + 1].cVendorName;
            emptyRow.cVendorCode = val.value[i + 1].cVendorCode;
          } else {
            tableDataVal.value.push({
              cInvCode: val.value[i + 1].cInvCode,
              cInvName: val.value[i + 1].cInvName,
              cInvStd: val.value[i + 1].cInvStd,
              cUnitCode: val.value[i + 1].CG_UnitCode,
              cUnitName: val.value[i + 1].CG_UnitName,
              cDefindParm03: val.value[i + 1].SAPCode,
              cVendorName: val.value[i + 1].cVendorName,
              cVendorCode: val.value[i + 1].cVendorCode
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
    Route.name === 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView'
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
      tableDataVal.value[scope.$index].cDefindParm03 =
        data[0].list_sap.find(
          i =>
            i.cInvCode === data[0].cInvCode &&
            i.cVendorCode === data[0].cVendorCode
        )?.cSAPCode || '';
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
    }
  }
};
// 搜索弹框事件
const clickModel = (obj: any, type: any, i: any, scope: any) => {
  console.log(obj);
  ajax.value = obj.ajax;
  IndexType.value = i;
  MulitChoose.value =
    Route.name === 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView' ||
    Route.name === 'AddPurchaseNoteNoOrigin' ||
    Route.name === 'AddPurchaseNoteEditNoOrigin'
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
        if (queryString) {
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
    tableDataVal.value[scope.$index].cDefindParm03 =
      scope.row.list_sap.find(i => i.cVendorCode === e)?.cSAPCode || '';
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
