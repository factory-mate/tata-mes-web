<template>
  <!-- （专业）设备点检任务单页面 -->
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
        @EquipmentClose="EquipmentClose"
        @EqupimentRead="EqupimentRead"
      ></ButtonViem>
      <!-- 表格区域 -->
      <myTable
        ref="TabRef"
        v-if="tabType"
        :tableLoading="loading"
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
            width="140px"
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
                v-for="item in tableButton"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  type="primary"
                  size="small"
                  @click="clickTableBut(scope, item)"
                >
                  {{ item.Resource.cAttributeName }}
                </el-button>
              </template>
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
    </el-card>
    <Odialogs
      ref="OdiaRef"
      :title="title"
      :Btn="ZZBut"
      :FormData="ZZFormData"
      :ruleForm="ruleForm"
      :disabled="disabled"
      :sendIdArr="CheckDataList"
    ></Odialogs>
    <ExportDialog
      ref="ExportDiaRef"
      :dialogFormVisible="ExdialogFormVisible"
      :title="title"
      :objData="ExportData"
      :modeCode="ExportModeCode"
    ></ExportDialog>
    <!-- <div class="zhezhao" v-if="zhezhaoType">
            <div class="zhezhaoBg"></div>
            <el-button class="zhezhaoBut" :icon="Loading" circle :loading="zhezhaoType" size="large" text>加载中...</el-button>
        </div> -->
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
  onActivated,
  provide
} from 'vue';
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import ExportDialog from '@/components/ExportDialog/index.vue';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, Loading, MoreFilled } from '@element-plus/icons-vue';
import { configApi, DataApi, delApi, ExportApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
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
//启用传递的UID
const sendId = ref([]) as any;
const sendIdArr = ref([]) as any;
const iStatus = ref(0);
const loading = ref(false);
const zhezhaoType = ref(false);
const title = ref('');
const ZZBut = ref([]);
const ZZFormData = ref([]);
const ruleForm = ref({});
const disabled = ref(false);
const CheckDataList = ref([]);
const OdiaRef = ref();
const ExportDiaRef = ref();
const ExportDatas = ref([]) as any;
const initType = ref(true);
//导出弹窗
const ExdialogFormVisible = ref(false);
const ExportData = ref({}) as any;
const ExportModeCode = ref('');
onActivated(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let val = window.sessionStorage.getItem('clickSider')
    ? JSON.parse(window.sessionStorage.getItem('clickSider'))
    : '';
  if (val == Route.name) {
    initType.value = false;
    getData(Route.meta.ModelCode);
  }
  if (initType.value) {
    getData(Route.meta.ModelCode);
  }
  initType.value = false;
});
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'ProfessionEquipCheckTask') {
      tableAxios();
    }
  }, 300);
});
//调取接口
const getData: any = async (val: string) => {
  // console.log(import.meta.env.VITE_APP_key,"---kkkk");

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
      //
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
    default:
      break;
  }
};
//表格数据查询
const tableAxios = async () => {
  loading.value = true;
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      // "Conditions": Conditions.value
      Conditions: Conditions.value
        ? 'cVouchTypeCode = 2 && ' + Conditions.value
        : 'cVouchTypeCode = 2'
    }
  };
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      loading.value = false;
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
      loading.value = false;
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
provide('tableAxios', { tableAxios });
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
        checkType: item.IsShow,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
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

//已读
const EqupimentRead = (obj: any) => {
  console.log(obj, '已读----');

  sendId.value = [];
  sendIdArr.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要读的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };

  ElMessageBox.confirm('确定读取数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '读取数据成功'
          });
          tableAxios();
          TabRef.value.handleRemoveSelectionChange();
          sendId.value = [];
        } else {
          console.log('读取失败');
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消读取'
      });
    });
};
//关闭
const EquipmentClose = (obj: any) => {
  console.log(obj, '关闭u----');

  sendId.value = [];
  sendIdArr.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要关闭的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };

  ElMessageBox.confirm('确定关闭数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '关闭数据成功'
          });
          tableAxios();
          TabRef.value.handleRemoveSelectionChange();
          sendId.value = [];
        } else {
          console.log('关闭失败');
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消关闭'
      });
    });
};
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'ProfessionProgressView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      pageType: 'view',
      row: JSON.stringify(scope.row),
      pathName: 'ProfessionEquipCheckTask',
      title: '项目详情'
    }
  });
};

//多选获取UID
const handleSelectionChange = (arr: any) => {
  if (arr.length) {
    sendIdArr.value = arr;
  } else {
    sendIdArr.value = [];
  }
};
//启用按钮
const Start = (obj: any) => {
  sendId.value = [];
  sendIdArr.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });

  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要启用的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  DataApi(data).then(res => {
    if (res.status == 200) {
      tableAxios();
      ElMessage({
        type: 'success',
        message: '启用成功'
      });
      TabRef.value.handleRemoveSelectionChange();
    } else {
      console.log('启用出错了');
    }
  });
};

const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: ''
});
const { Conditions, OrderByFileds } = toRefs(data);
// 搜索
const ClickSearch = (val: any) => {
  queryParams.PageIndex = 1;
  let searchData = JSON.parse(JSON.stringify(val.value));
  Conditions.value = filterModel(searchData);
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
  TabRef.value!.clearFilter();
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
</script>

<style scoped lang="scss">
.maintain {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .zhezhao {
    font-size: 30px;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999;
    color: #000;
    .zhezhaoBg {
      width: 100%;
      height: 100%;
      background: #333;
      opacity: 0.3;
    }
    .zhezhaoBut {
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -15px;
      margin-left: -80px;
    }
    :deep(.el-button) {
      font-size: 30px;
      color: #333;
      z-index: 999;
    }
    :deep(.el-button.is-loading:before) {
      background: none;
    }
  }
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
</style>
