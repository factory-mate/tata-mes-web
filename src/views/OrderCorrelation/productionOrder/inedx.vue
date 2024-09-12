<template>
  <!-- 生产订单页面 -->
  <div class="maintain">
    <!-- 搜索区域 -->
    <FilterForm
      ref="filterRef"
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    ></FilterForm>
    <el-card>
      <!-- 按钮区域 -->
      <ButtonViem
        :ToolBut="But"
        @clickPick="clickPick"
        @ChangeProductionDate="ChangeProductionDates"
        @Schedule="Schedule"
        @ProductionUP="ProductionUP"
        @SubpackageOperation="SubpackageOperation"
        @BOMOperation="BOMOperation"
        @revoke="revoke"
        @ExportAll="ExportAll"
        @ImportPick="ImportPick"
      ></ButtonViem>
      <!-- 表格区域 -->
      <myTable
        ref="TabRefss"
        v-if="tabType"
        :tableLoading="loading"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
        @tableHearData="tableHearData"
        @handleSelectionChange="handleSelectionChange"
        size="small"
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
              <!-- <el-button type="primary" size="small" v-for="item in tableButton"
                                :key="item.Resource.cAttributeName" @click="clickTableBut(scope, item)">{{
                                    item.Resource.cAttributeName }}</el-button> -->
              <template
                v-for="(item, i) of tableButton"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  v-if="i == 0 || i == 1"
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
                  <el-icon><MoreFilled /></el-icon>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in tableButton.filter((v:any) => [0,1].indexOf(v.iIndex) == -1)"
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
        :page-sizes="[20, 50, 100]"
      />
    </el-card>
    <Odialogs
      ref="OdiaRef"
      :title="title"
      :Btn="ZZBut"
      :form-data="ZZFormData"
      :ruleForm="ruleForm"
      :ids="sendId"
      :disabled="disabled"
      :sendIdArr="CheckDataList"
    ></Odialogs>
    <ProcessDialog
      ref="ProcessdiaRef"
      :obj="ProcessData"
      @CloseTC="CloseTC"
    ></ProcessDialog>
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
  provide,
  onUnmounted
} from 'vue';
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import Odialogs from './components/orgDialog.vue';
import ProcessDialog from '@/components/ProgressDialog/index.vue';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
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
const TabRefss = ref();
const OdiaRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const tabType = ref(true);
const BdialogFormVisible = ref(false);
const title = ref('');
const ZZFormData = ref([]) as any;
const ZZBut = ref([]) as any;
const ruleForm = ref();
const disabled = ref(false);
const loading = ref(false);
const row = ref();
const filterRef = ref(null);
//启用传递的UID
const sendId = ref([]) as any;
const sendIdArr = ref([]) as any;
const CheckDataList = ref([]) as any;
const objData = ref({});
const initType = ref(true);
const ProcessData = ref({}) as any;
const ProcessdiaRef = ref();
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
    if (v.name == 'productionOrder') {
      tableAxios();
    }
  }, 300);
});
onUnmounted(() => {
  clearInterval(timer.value);
  timer.value = null;

  //   window.sessionStorage.clear('load')
});
//调取接口
const getData: any = async (val: string) => {
  try {
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
    }
  } catch (error) {
    console.log(error, '程序出错了');
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
  console.log(event.cAttributeCode);

  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'ChangeOrde':
      ChangeOrde(scope, event);
      break;
    case 'ProductionUP':
      clickProductionUP(scope, event);
      break;
    default:
      break;
  }
};
//表格数据查询
const tableAxios = async () => {
  loading.value = true;
  let valDat: any = '';
  if (Route.name == 'productionOrder') {
    valDat = Conditions.value
      ? 'cVouchTypeCode in (0,1,2,3,4,5) && iStatus >= 30 && iDefindParm13 = 0 && ' +
        Conditions.value
      : 'cVouchTypeCode in (0,1,2,3,4,5) && iStatus >= 30 && iDefindParm13 = 0';
  }
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: valDat
    }
  };
  try {
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
      TabRefss.value.handleRemoveSelectionChange();
    } else {
      loading.value = false;
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
provide('tableAxios', { tableAxios });
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
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'newProductionOrder',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      pageType: 'view',
      row: JSON.stringify(scope.row),
      pathName: 'productionOrder',
      title: '生产订单详情'
    }
  });
};
//表格生产上游
const clickProductionUP = (scope: any, obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [scope.row.UID]
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status == 200) {
      tableAxios();
      ElMessage({
        type: 'success',
        message: '成功'
      });
      TabRefss.value.handleRemoveSelectionChange();
    } else {
      console.log('出错了');
    }
    ElLoading.service().close();
  });
};
//表格变更按钮
const ChangeOrde = (scope: any, obj: any) => {
  router.push({
    name: 'ProductionOrderBG',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      pageType: 'edit',
      row: JSON.stringify(scope.row),
      pathName: 'productionOrder',
      title: '生产订单变更'
    }
  });
};
//变更日期
const ChangeProductionDates = async (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: { UID: any }) =>
    sendId.value.push(item.UID)
  );
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要变更的数据'
    });
    return;
  }
  OdiaRef.value.Open();
  title.value = '变更生产日期';
  objData.value = obj;
  ElLoading.service({ lock: true, text: '加载中.....' });
  const res = await configApi(obj.cIncludeModelCode);
  if (res.status === 200) {
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'Head') {
        item[import.meta.env.VITE_APP_key].map((item: any) => {
          item.Resource[item.Resource.cAttributeCode] = '';
        });
        ZZFormData.value = item[import.meta.env.VITE_APP_key];
      }
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        ZZBut.value = item[import.meta.env.VITE_APP_key];
      }
    });
    ElLoading.service().close();
  }
};
//挑选
const clickPick = (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: { UID: any }) =>
    sendId.value.push(item.UID)
  );
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要挑单的数据'
    });
    return false;
  }
  OdiaRef.value.Open();
  title.value = '批量挑单';
  objData.value = obj;
  ElLoading.service({ lock: true, text: '加载中.....' });
  configApi(obj.cIncludeModelCode).then(res => {
    if (res.status === 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          ZZFormData.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          ZZBut.value = item[import.meta.env.VITE_APP_key];
        }
      });
    }
    ElLoading.service().close();
  });
};

// 导入挑单
const ImportPick = (obj: any) => {
  OdiaRef.value.Open();
  title.value = '导入挑单';
  objData.value = obj;
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  configApi(obj.cIncludeModelCode).then(res => {
    if (res.status === 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          ZZFormData.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          ZZBut.value = item[import.meta.env.VITE_APP_key];
        }
      });
    }
    loading.close();
  });
};

//生产同步上游
const ProductionUP = (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });

  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选数据'
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
    if (res.status == 200) {
      tableAxios();
      ElMessage({
        type: 'success',
        message: '成功'
      });
      TabRefss.value.handleRemoveSelectionChange();
    } else {
      console.log('出错了');
    }
    ElLoading.service().close();
  });
};
//撤销
const revoke = (obj: any) => {
  console.log(obj, 'obj---撤销');
  sendId.value = [];
  CheckDataList.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选撤销的数据'
    });
    return false;
  }
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      Ids: sendId.value
    }
  };
  ElMessageBox.confirm('确定撤销?', '挑单', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      ElLoading.service({ lock: true, text: '加载中.....' });
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '撤销成功'
          });
          tableAxios();
          TabRefss.value.handleRemoveSelectionChange();
          sendId.value = [];
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '撤销失败'
          });
        }
        ElLoading.service().close();
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消撤销'
      });
    });
};
//BOM运算
const BOMOperation = (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });

  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选数据'
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
    if (res.status == 200) {
      tableAxios();
      ElMessage({
        type: 'success',
        message: res.msg || '成功'
      });
      TabRefss.value.handleRemoveSelectionChange();
    } else {
      ElMessage({
        type: 'error',
        message: res.msg || '失败'
      });
      console.log('出错了');
    }
    ElLoading.service().close();
  });
};
//分包
const SubpackageOperation = (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: any) => {
    sendId.value.push(item.UID);
  });

  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要分包的数据'
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
    if (res.status == 200) {
      tableAxios();
      ElMessage({
        type: 'success',
        message: res.msg || '成功'
      });
      TabRefss.value.handleRemoveSelectionChange();
    } else {
      ElMessage({
        type: 'error',
        message: res.msg || '失败'
      });
      console.log('出错了');
    }
    ElLoading.service().close();
  });
};
const timer = ref(); // 定时器
let count = ref(0); // 倒计时
const ProcObj = ref({}) as any;
//进度
const Schedule = (obj: any) => {
  // window.sessionStorage.setItem('load',true)
  ProcObj.value = obj;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: []
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status == 200) {
      ProcessdiaRef.value.DiaOpen();
      // ElMessage({
      //     type: 'success',
      //     message: res.msg||'成功',
      // })
      ProcessData.value = res.data;
      count.value = 5; //倒计时
      Verification(); //循环接口
    } else {
      ElMessage({
        type: 'error',
        message: res.msg || '失败'
      });
      console.log('出错了');
    }
    ElLoading.service().close();
  });
};
//循环请求接口
const Verification = () => {
  timer.value = setInterval(() => {
    if (count.value > 0 && count.value <= 5) {
      count.value--;
    } else if (count.value === 0) {
      Schedule(ProcObj.value); // 请求数据
      clearInterval(timer.value);
      timer.value = null;
    }
  }, 1000);
};
//关闭弹窗，关闭定时器
const CloseTC = (val: any) => {
  if (val == false) {
    clearInterval(timer.value);
    timer.value = null;
  }
  // window.sessionStorage.clear('load')
};
//多选获取UID
const handleSelectionChange = (arr: any) => {
  CheckDataList.value = arr;

  CheckDataList.value.forEach((item: { UID: any }) =>
    sendId.value.push(item.UID)
  );
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
  queryParams.PageSize = 10;
  TabRefss.value!.clearFilter();
  tableAxios();
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

const ExportAll = async (obj: any) => {
  let conditions = filterModel(filterRef.value.FilterData);

  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 1,
      PageSize: 999999,
      OrderByFileds: OrderByFileds.value,
      Conditions: conditions
    }
  };

  ExportApi(data).then((res: any) => {
    if (res.status == '200') {
      const blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel;charset=utf-8'
      });
      const fileName = decodeURI('生产订单详情') + '.xlsx';
      if ('download' in document.createElement('a')) {
        // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else {
        // IE10+下载
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        navigator.msSaveBlob(blob, fileName);
      }
    } else {
      ElMessage.error('请求失败');
    }

    ElLoading.service().close();
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
</style>
