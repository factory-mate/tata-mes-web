<template>
  <!-- 到货单页面 -->
  <div class="maintain">
    <!-- 搜索区域 -->
    <FilterForm
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    ></FilterForm>
    <el-card>
      <!-- 按钮区域 -->
      <ButtonViem
        :ToolBut="But"
        @clickAdd="clickAdd"
        @ExportAll="ExportAll"
        @ExportOne="ExportOne"
        @Commit="Commit"
        @CustomExport="CustomExport"
        @DownloadBarcode="DownloadBarcode"
        @PrintVouch="PrintVouch"
      >
      </ButtonViem>
      <!-- 表格区域 -->
      <myTable
        ref="TabRef"
        v-if="tabType"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
        @tableHearData="tableHearData"
        @handleSelectionChange="handleSelectionChange"
      >
        <template #button>
          <el-table-column
            label="操作"
            fixed="right"
            width="200px"
            align="center"
          >
            <template #header>
              <span>操作</span>
              <myPopup
                :list="tableColumns"
                @newList="newList"
                @renew="renew"
              ></myPopup>
            </template>
            <template #default="scope">
              <template
                v-for="(item, idx) in tableButton"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  v-if="
                    (idx < (tableButton.length > 3 ? 2 : 3) &&
                      ['详情'].includes(item.Resource.cAttributeName)) ||
                    (scope.row.cStatusName == '保存' &&
                      ['编辑', '删除'].includes(item.Resource.cAttributeName))
                  "
                  type="primary"
                  size="small"
                  @click="clickTableBut(scope, item)"
                >
                  {{ item.Resource.cAttributeName }}
                </el-button>
              </template>
              <el-dropdown
                style="margin-left: 10px"
                v-if="tableButton.length > 3"
              >
                <el-button type="primary" size="small">
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in tableButton.slice(2)"
                      :key="item.Resource.cAttributeName"
                    >
                      <el-button
                        type="primary"
                        size="small"
                        @click="clickTableBut(scope, item)"
                      >
                        {{ item.Resource.cAttributeName }}
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </template>
      </myTable>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="changPage"
      />

      <div ref="componentRef" class="print-content">
        <div
          :class="printData.length > 1 && 'per-page'"
          v-for="(item, index) in printData"
          :key="index"
          style="position: relative; height: 100vh"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div style="font-size: 48px; font-weight: 900">TATA</div>
            <div style="font-size: 30px">送货单</div>
            <div
              style="display: flex; flex-direction: column; align-items: center"
            >
              <qrcode-vue :value="item.cCode" :size="90" />
              <span style="margin-top: 4px">
                {{ item.cCode }}
              </span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; font-size: 11px">
            <div style="display: flex; justify-content: space-between">
              <div style="width: 50%">
                供应商编码：{{ item?.cVendorCode ?? '' }}
              </div>
              <div style="width: 50%">
                供应商名称：{{ item.cVendorName ?? '' }}
              </div>
            </div>

            <div style="display: flex; justify-content: space-between">
              <div style="width: 50%">
                SAP订单编号：{{ item?.cDefindParm04 ?? '' }}
              </div>
              <div style="width: 50%">送货单日期：{{ item?.dDate ?? '' }}</div>
            </div>

            <div style="display: flex; justify-content: space-between">
              <div style="width: 50%">发货地址：{{}}</div>
              <div style="width: 50%">送货单编号：{{ item?.cCode ?? '' }}</div>
            </div>

            <div style="display: flex; justify-content: space-between">
              <div style="width: 50%">
                收货单位名称：兰考闼闼同创工贸有限公司
              </div>
              <div style="width: 50%">
                收货单位地址：兰考县产业集聚区迎宾大道004号
              </div>
            </div>

            <div style="display: flex; justify-content: space-between">
              <div style="width: 50%">收货人：{{}}</div>
              <div style="width: 50%">收货人电话：{{}}</div>
            </div>
          </div>

          <table
            style="
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
              font-size: 11px;
            "
          >
            <thead>
              <tr>
                <th style="border: 1px solid #000; padding: 5px">序号</th>
                <th style="border: 1px solid #000; padding: 5px">
                  MES物料编码
                </th>
                <th style="border: 1px solid #000; padding: 5px">物料描述</th>
                <th style="border: 1px solid #000; padding: 5px">订单数量</th>
                <th style="border: 1px solid #000; padding: 5px">
                  本次送货数量
                </th>
                <th style="border: 1px solid #000; padding: 5px">
                  SAP物料编码
                </th>
                <th style="border: 1px solid #000; padding: 5px">单位</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(i, index) in item.list_Body"
                :key="index"
                style="text-align: center"
              >
                <td style="border: 1px solid #000; padding: 5px">
                  {{ index + 1 }}
                </td>
                <td style="border: 1px solid #000; padding: 5px">
                  {{ i.cInvCode }}
                </td>
                <td style="border: 1px solid #000; padding: 5px">
                  {{ i.cInvName }}
                </td>
                <td style="border: 1px solid #000; padding: 5px">
                  {{ i.nQuantity }}
                </td>
                <td style="border: 1px solid #000; padding: 5px">
                  {{ i.nReceiveQuantity }}
                </td>
                <td style="border: 1px solid #000; padding: 5px">
                  {{ i.cSAPCode }}
                </td>
                <td style="border: 1px solid #000; padding: 5px">
                  {{ i.cUnitName }}
                </td>
              </tr>
            </tbody>
          </table>
          <!-- #4030 -->
          <div style="font-size: 11px; font-weight: 400; margin-top: 40px">
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              "
            >
              <div style="width: 100%">供应商全称(盖章)：</div>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              "
            >
              <div style="width: 50%">供应商经办人：</div>
              <div style="width: 50%">司机物流经办人：</div>
            </div>

            <div style="display: flex; justify-content: space-between">
              <div style="width: 50%">签收人：</div>
              <div style="width: 50%">签收日期：</div>
            </div>
            <div
              style="
                width: 100%;
                height: 1px;
                background-color: #000;
                margin: 10px 0;
              "
            ></div>
            <div style="font-size: 9px">
              <div>注：</div>
              <div>
                1.送货单要求打印字迹清晰、明确、不得有遗漏项目，不得有涂改迹象。
              </div>
              <div>
                2.所有相关信息需与集团总部维护信息一致，包括但不限于：供应商编码/名称、物料编码、物料描述、单位等项目。
              </div>
              <div>
                3.送货物料要求包装完好无损，标识清楚，物料编码及名称需与订单保持一致，送货时附带送货单及检验报告(如需要)。
              </div>
              <div>
                4.送货单一式四份(供应商、物流各单位一份；收货单位两份)。
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  reactive,
  nextTick,
  computed,
  watch,
  onActivated
} from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import { useVueToPrint } from 'vue-to-print';
import QrcodeVue from 'qrcode.vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const router = useRouter();
let Filter = ref([]) as any;
let But = ref([]) as any;
// 表格配置数据
const TabRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const tabType = ref(true);
const tabKey = ref(0);
//启用传递的UID
const sendId = ref([]) as any;
const printData = ref([]);

const componentRef = ref();
const { handlePrint } = useVueToPrint({
  content: componentRef,
  documentTitle: '送货单',
  onAfterPrint: () => {
    // printData.value = [];
  }
});

const initType = ref(true);
onActivated(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Route.name === 'PurchasedGoods') {
    getData(Route.meta.ModelCode);

    // let val = window.sessionStorage.getItem('clickSider')
    //   ? JSON.parse(window.sessionStorage.getItem('clickSider'))
    //   : '';

    // if (val == Route.name) {
    //   initType.value = false;
    //   getData(Route.meta.ModelCode);
    // }
    // if (initType.value) {
    //   getData(Route.meta.ModelCode);
    // }
    // initType.value = false;
  }
});
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'PurchasedGoods') {
      tableAxios();
    }
  }, 300);
});
//调取接口
const getData: any = async (val: string) => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(val);
    if (res.status == 200) {
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          But.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
      });
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
    ElLoading.service().close();
  }
};
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//总条数
const total = ref(0);
//表格数据
const tableData = ref([] as any);
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'Edit':
      clickEditTable(scope, event);
      break;
    case 'Delete':
      clickDelete(scope, event);
      break;
    default:
      break;
  }
};
//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data.data.map(
        (item: { IsValid: string | boolean }) => {
          return {
            ...item,
            IsValid: item.IsValid ? '是' : '否'
          };
        }
      );
      total.value = res.data.dataCount;
      tablefilter();
      TabRef.value.handleRemoveSelectionChange();
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
// table filters
const tablefilter = () => {
  tableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    tableData.value.forEach((bItem: any) => {
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
// table  排序
const tableHearData = (val: any) => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  tableAxios();
};
// table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: []
      };
      tableColumns.value.push(itemData);
    }
    if (item.Resource.cAttributeTypeCode == 'method') {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      tableButton.value.push(item);
      tableColumns.value.push(itemData);
      tableColumns.value = tableColumns.value.filter(
        (item: { label: any }, index: any, self: any[]) => {
          // 利用findIndex方法找到第一个与当前元素id相等的元素索引
          const i = self.findIndex(
            (t: { label: any }) => t.label === item.label
          );
          // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
          return i === index;
        }
      );
    }
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      AxiosData.value = item;
      tableAxios();
    }
  });
};
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};

//表格按钮删除
const clickDelete = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  ElMessageBox.confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElLoading.service({ lock: true, text: '加载中.....' });
      DataApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          });
          tableAxios();
          ElLoading.service().close();
        } else {
          ElMessage.error('删除失败');
          ElLoading.service().close();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      });
      ElLoading.service().close();
    });
};
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'newPurchasedGoodsView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'PurchasedGoods',
      title: '到货单详情'
    }
  });
};
//表格按钮编辑
const clickEditTable = (scope: any, obj: any) => {
  if (scope.row.cStatusName == '已收货' || scope.row.cStatusName == '提交') {
    ElMessage({
      type: 'info',
      message: '提交数据，不可编辑'
    });
    return false;
  }
  router.push({
    name: 'newPurchasedGoodsEdit',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'PurchasedGoods',
      title: '到货单编辑'
    }
  });
};

//按钮新增
const clickAdd = (obj: { cIncludeModelCode: any }) => {
  router.push({
    name: 'newPurchasedGoods',
    params: {
      t: Date.now(),
      rowId: ' '
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      title: '到货单添加',
      type: 'add'
    }
  });
};
const chosseData = ref([]) as any;
//多选获取UID
const handleSelectionChange = (arr: any) => {
  chosseData.value = arr;
};
//按钮提交
const Commit = (obj: any) => {
  sendId.value = [];
  chosseData.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要提交的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '提交成功'
      });
      tableAxios();
      TabRef.value.handleRemoveSelectionChange();
      sendId.value = [];
    } else {
      console.log('提交失败');
    }
    ElLoading.service().close();
  });
};
const CustomExport = (obj: any) => {
  const chosseDataList = chosseData.value.map(item => item.UID);
  if (chosseDataList.length <= 0) {
    ElMessage({
      type: 'warning',
      message: '请勾选要导出的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 1,
      PageSize: 999999,
      OrderByFileds: OrderByFileds.value,
      Conditions: `MID in (${chosseDataList.join()})`
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(data, '到货单');
  ElLoading.service().close();
};
const DownloadBarcode = (obj: any) => {
  const barCodeList = chosseData.value.map(item => item.cCode);
  if (barCodeList.length <= 0) {
    ElMessage({
      type: 'warning',
      message: '请勾选要导出的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      OrderByFileds: 'cBarCode',
      Conditions: `cCode in (${barCodeList.join()})`
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(data, '到货明细');
  ElLoading.service().close();
};

//按钮导出所有
const ExportAll = async (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 1,
      PageSize: 999999,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(data, '到货单-所有');
  ElLoading.service().close();
};
//按钮导出当前页
const ExportOne = async (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(data, '到货单');
  ElLoading.service().close();
};

const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: 'cCode desc'
});
const { dialogV, dialogTitle, Conditions, OrderByFileds } = toRefs(data);
// 搜索
const ClickSearch = (val: any) => {
  queryParams.PageIndex = 1;
  Conditions.value = filterModel(val.value);
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  tableAxios();
  TabRef.value.clearFilter();
};

// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
    tableAxios();
  });
};
// 恢复
const renew = () => {
  getData(Route.meta.ModelCode);
};

const PrintVouch = obj => {
  if (chosseData.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要打印的数据'
    });
    return;
  }
  const data = {
    method: 'POST',
    url: `${obj.Resource.cServerIP}${obj.Resource.cUrl}`,
    data: {
      OrderByFileds: '',
      Conditions: `UID in (${chosseData.value.map(item => item.UID).join()})`
    }
  };
  DataApi(data).then(res => {
    if (res.success) {
      printData.value = res.data ?? [];
      if (printData.value.length == 0) {
        ElMessage({
          message: '无数据',
          type: 'warning'
        });
        return;
      }
      setTimeout(() => handlePrint(), 16);
    }
  });
};
</script>

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;

  .maintain_card {
    width: 100%;
    margin-bottom: 20px;

    :deep(.el-card__body) {
      display: flex;
      justify-content: space-between;

      .search_main {
        flex: 1;

        :deep(.el-form) {
          width: 100%;
        }
      }

      .search_but {
        width: 180px;
      }
    }
  }
}

.maintain .selectSty {
  width: 233px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

.print-content {
  display: none;
}

@media print {
  @page {
    margin: 5mm;
  }

  .print-content {
    display: block;
  }

  .per-page {
    page-break-after: always;
    break-after: page;
  }
}
</style>
