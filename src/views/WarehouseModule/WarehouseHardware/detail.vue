<script setup>
import { ref, reactive, onActivated, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElLoading
} from 'element-plus';
import FilterArea from '@/components/Filter/index.vue';
import ButtonArea from '@/components/Button/index.vue';
import TableArea from '@/components/MyTable/index.vue';
import PopupArea from '@/components/Popup/index.vue';
import { configApi, DataApi } from '@/api/configApi/index';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import useStore from '@/store';
import { useVueToPrint } from 'vue-to-print';
import QrcodeVue from 'qrcode.vue';

const componentRef = ref();
const { handlePrint } = useVueToPrint({
  content: componentRef,
  documentTitle: '任务单'
});

const { cache } = useStore();
const route = useRoute();
const router = useRouter();

const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const total = ref(0);
const orderBy = ref('');
const conditions = ref('');
const selectedIds = ref([]);

const filters = ref([]);
const toolButtons = ref([]);
const tableRef = ref(null);
const tableColumns = ref([]);
const tableButtons = ref([]);
const tableData = ref([]);
const groupedData = ref([]);
const tableQueryConfig = ref({});
const printData = ref([]);

// 获取数据
const getData = async () => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const { data, success } = await configApi(route.meta.ModelCode);
  if (success) {
    data.forEach(i => {
      const list = i.Parms.sort(compare('iIndex', true));
      let queryConfig;
      switch (i.cPropertyClassTypeCode) {
        case 'Filter':
          filters.value = list;
          break;
        case 'ToolBut':
          toolButtons.value = list;
          break;
        case 'Grid':
          tableColumns.value = list
            .filter(
              i => i.Resource.cAttributeTypeCode == 'property' && i.IsShow
            )
            .map(i => ({
              checkType: true,
              label: i.cShowName ?? i.Resource.cAttributeName,
              prop: i.Resource.cAttributeCode,
              headerSlot: true,
              slot: '',
              lock: false,
              filters: [],
              cControlTypeCode: i.cControlTypeCode,
              cIncludeModelCode: i.cIncludeModelCode,
              cHttpTypeCode: i.Resource.cHttpTypeCode,
              cServerIP: i.Resource.cServerIP,
              cUrl: i.Resource.cUrl,
              cAttributeCode: i.Resource.cAttributeCode,
              DefinedParm4: i.DefinedParm4
            }));
          tableButtons.value = list.filter(
            i => i.Resource.cAttributeTypeCode == 'method'
          );
          queryConfig = list.find(
            i => i.Resource.cAttributeTypeCode == 'binddata'
          );
          if (queryConfig) {
            tableQueryConfig.value = queryConfig;
          }
          break;
        default:
          break;
      }
    });
  }
  if (tableButtons.value.length > 0) {
    tableColumns.value.push({
      checkType: true,
      label: '操作',
      slotName: 'button'
    });
  }
  if (tableQueryConfig.value.Resource) {
    getTableData();
  }
  loading.close();
};

// 表格数据
const getTableData = async () => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const params = {
    method: tableQueryConfig.value.Resource.cHttpTypeCode,
    url:
      tableQueryConfig.value.Resource.cServerIP +
      tableQueryConfig.value.Resource.cUrl +
      `?val=${route.params.rowId}`,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: orderBy.value,
      Conditions: conditions.value
    }
  };
  const { success, data: resData } = await DataApi(params);
  if (success) {
    const { data, dataCount } = resData;
    // resData 根据组柜序号cDefindParm09 分组
    tableData.value = resData;
    groupedData.value = (resData ?? []).reduce((acc, item) => {
      // 查找当前 cDefindParm09 是否已经在 acc 中
      let group = acc.find(g => g.cDefindParm09 === item.cDefindParm09);

      // 如果没有，创建一个新的分组
      if (!group) {
        group = {
          cDefindParm09: item.cDefindParm09,
          cDefindParm08: item.cDefindParm08,
          UID: item.VID,
          list: [],
          selected: false
        };
        acc.push(group);
      }

      // 将当前项添加到对应分组的 list 中
      group.list.push(item);

      return acc;
    }, []);
    total.value = dataCount;
    filterTable();
    // tableRef.value.handleRemoveSelectionChange();
  }
  loading.close();
};

// 点击操作按钮
const handleClickTableButton = (scope, event) => {
  switch (event.cAttributeCode) {
    case 'View':
      handleView(scope, event);
      break;
    default:
      break;
  }
};

// 查看
const handleView = (scope, obj) => {
  router.push({
    name: 'WarehouseHardwareDetail',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'WarehouseHardware',
      title: '库房五金详情'
    }
  });
};

// 多选
const handleSelectionChange = val => {
  selectedIds.value = val.map(i => i.UID);
};

// 分页
const handleChangePage = val => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  getTableData();
};

// 重置搜索
const resetSearchParams = () => {
  conditions.value = '';
  orderBy.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  getTableData();
  tableRef.value.clearFilter();
};

// 搜索
const handleSearch = val => {
  queryParams.PageIndex = 1;
  conditions.value = filterModel(val.value);
  getTableData();
};

// 过滤表格
const filterTable = () => {
  tableColumns.value.forEach(aItem => {
    const filData = [];
    tableData.value.forEach(bItem => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item, index, self) =>
          self.findIndex(t => t.text === item.text) === index
      );
    }
  });
};

// 排序
const sortTable = val => {
  orderBy.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  getTableData();
};

// 列表排序
const newList = val => {
  tableColumns.value = val.list;
  getTableData();
};

// 恢复
const renew = () => getData();

function PrintRWQD() {
  if (groupedData.value.filter(i => i.selected).length == 0) {
    ElMessage({
      message: '请选择数据',
      type: 'warning'
    });
    return;
  }
  const data = {
    method: 'POST',
    url: import.meta.env.VITE_APP_DY_100_API + '/api/Package/GetRWD_KFWJData',
    data: {
      UID: groupedData.value[0].UID,
      list_cDefindParm09: groupedData.value
        .filter(i => i.selected)
        .map(i => i.cDefindParm09)
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
}

onMounted(() => getData());

onActivated(async () => {
  // if (cache.isCurrentPageInvalid()) {
  await getData();
  //   cache.removeCurrentPageInvalid();
  // }
});
</script>

<template>
  <div class="container">
    <!-- <FilterArea
      :Filter="filters"
      @click-search="handleSearch"
      @reset-form="resetSearchParams"
    /> -->
    <el-card>
      <!-- <ButtonArea :ToolBut="toolButtons" @click-add="handleAdd" />
      <TableArea
        ref="tableRef"
        :table-data="tableData"
        :table-columns="tableColumns"
        table-border
        selection
        @table-hear-data="sortTable"
        @handle-selection-change="handleSelectionChange"
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
              <PopupArea
                :list="tableColumns"
                @newList="newList"
                @renew="renew"
              />
            </template>
            <template #default="scope">
              <template
                v-for="(i, idx) in tableButtons"
                :key="i.Resource.cAttributeName"
              >
                <el-button
                  v-if="idx < (tableButtons.length > 3 ? 2 : 3)"
                  type="primary"
                  size="small"
                  @click="handleClickTableButton(scope, i)"
                >
                  {{ i.Resource.cAttributeName }}
                </el-button>
              </template>
              <el-dropdown
                style="margin-left: 10px"
                v-if="tableButtons.length > 3"
              >
                <el-button type="primary" size="small">
                  <el-icon>
                    <MoreFilled />
                  </el-icon>
                  <el-icon class="el-icon--right">
                    <ArrowDown />
                  </el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in tableButtons.slice(2)"
                      :key="item.Resource.cAttributeName"
                    >
                      <el-button
                        type="primary"
                        size="small"
                        @click="handleClickTableButton(scope, item)"
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
      </TableArea>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="handleChangePage"
      /> -->
      <el-button
        @click="PrintRWQD"
        style="margin-bottom: 10px; margin-left: 10px"
      >
        打印任务单
      </el-button>
      <el-row>
        <el-col :span="24" v-for="item in groupedData" :key="item.UID">
          <div style="padding: 10px">
            <el-card shadow="always">
              <template #header>
                <ElCheckbox v-model="item.selected" size="large" />
                <span style="margin-left: 10px">
                  组柜序号：{{ item.cDefindParm09 }}
                </span>
                <span style="margin-left: 10px">
                  当前组柜名称：{{ item.cDefindParm08 }}
                </span>
              </template>

              <el-table
                :data="item.list"
                border
                :cell-style="{
                  padding: '0',
                  height: '12px',
                  margin: '0'
                }"
              >
                <el-table-column prop="cInvName" label="五金名称">
                </el-table-column>
                <el-table-column prop="cInvCode" label="五金ID">
                </el-table-column>
                <el-table-column prop="cInvStd" label="规格"> </el-table-column>
                <el-table-column prop="cUnitCode" label="单位">
                </el-table-column>
                <el-table-column prop="nQuantity" label="数量">
                </el-table-column>
                <el-table-column prop="cInStatus" label="包装状态">
                </el-table-column>
                <el-table-column prop="dCreateTime" label="包装时间">
                </el-table-column>
              </el-table>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div ref="componentRef" class="print-content">
      <div
        :class="printData.length > 1 && 'per-page'"
        v-for="(item, index) in printData"
        :key="index"
      >
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <div style="font-size: 48px; font-weight: 900">TATA</div>
          <div style="font-size: 30px">包装任务单（五金）</div>
          <div
            style="display: flex; flex-direction: column; align-items: center"
          >
            <qrcode-vue :value="item.list_bodys?.[0]?.WJPBarcode" :size="90" />
            <span style="margin-top: 4px">
              {{ item.list_bodys?.[0]?.WJPBarcode }}
            </span>
          </div>
        </div>

        <div style="display: flex; flex-direction: column">
          <div style="display: flex; justify-content: space-between">
            <div style="width: 43%">P订单号：{{ item?.cCode ?? '' }}</div>
            <div style="width: 23%">
              产品：{{ item.list_bodys?.[0]?.cDefindParm08 ?? '' }}
            </div>
            <div style="width: 33%">
              城市：{{ `${item?.cProvinceCode ?? ''}${item?.cCityCode ?? ''}` }}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between">
            <div style="width: 43%">门店：{{ item?.cDefindParm04 ?? '' }}</div>
            <div style="width: 16%">客户：{{ item?.cCusName ?? '' }}</div>
            <div style="width: 40%">工厂：兰考闼闼同创工贸有限公司(25厂)</div>
          </div>

          <div style="display: flex; justify-content: space-between">
            <div style="width: 43%">
              生产批次：{{
                `${item?.cBatch ?? ''}-000${item?.iDefindParm13 ?? ''}-${
                  item.list_bodys?.[0]?.cDefindParm09 ?? ''
                }`
              }}
            </div>
            <div style="width: 23%">
              包装完成日期：{{ item?.dPlanDateStartStr ?? '' }}
            </div>
            <div style="width: 33%">
              D订单号：{{ item?.cDefindParm05 ?? '' }}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between">
            <div style="width: 66%">
              子订单号：{{
                `${item?.cDefindParm30 ?? ''}-${item?.cCode ?? ''}-${
                  item?.cProvinceCode ?? ''
                }-${item?.cCityCode ?? ''}-000${item?.iDefindParm13 ?? ''}-${
                  item.list_bodys?.[0]?.cDefindParm09 ?? ''
                }`
              }}
            </div>
            <div style="width: 33%">五金组柜</div>
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
              <th style="border: 1px solid #000; padding: 5px">五金名称</th>
              <th style="border: 1px solid #000; padding: 5px">五金ID</th>
              <th style="border: 1px solid #000; padding: 5px">规格</th>
              <th style="border: 1px solid #000; padding: 5px">单位</th>
              <th style="border: 1px solid #000; padding: 5px">品牌</th>
              <th style="border: 1px solid #000; padding: 5px">数量</th>
              <th style="border: 1px solid #000; padding: 5px">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, index) in item.list_bodys"
              :key="index"
              style="text-align: center"
            >
              <td style="border: 1px solid #000; padding: 5px">
                {{ index + 1 }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.cInvName }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.cInvCode }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.cInvStd }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.cUnitCode }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.cDefindParm25 }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.nQuantity }}
              </td>
              <td style="border: 1px solid #000; padding: 5px">
                {{ item.cMemo }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
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
