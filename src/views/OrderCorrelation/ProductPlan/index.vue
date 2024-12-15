<template>
  <!-- 班组页面 -->
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
        @clickStart="Start"
        @clickDelete="clickDel"
        @PickOrder="PickOrder"
        @Revoke="Revoke"
        @SubpackageOperation="SubpackageOperation"
      ></ButtonViem>
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
            width="280px"
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
              <!-- <el-dropdown style="margin-left: 10px;" v-if="tableButton.length > 3">
                                <el-button type="primary" size="small">
                                    <el-icon>
                                        <MoreFilled />
                                    </el-icon>
                                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item
                                            v-for="item in tableButton.filter((v: any) => [0, 1].indexOf(v.iIndex) == -1)"
                                            :key="item.Resource.cAttributeName">
                                            <el-button type="primary" size="small" @click="clickTableBut(scope, item)">
                                                {{ item.Resource.cAttributeName }}
                                            </el-button>
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown> -->
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
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
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
import type { FormInstance, FormRules } from 'element-plus';
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance

import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
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
const initType = ref(true);
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
    if (v.name == 'ProductPlan') {
      tableAxios();
    }
  }, 300);
});
//调取车间档案接口
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
  console.log(event.cAttributeCode, 'butt');

  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'Edit':
      clickEditTable(scope, event);
      break;
    case 'Stop':
      clickStop(scope, event);
      break;
    case 'Revoke':
      clickRevoke(scope, event);
      break;
    case 'PickOrder':
      clickPickOrder(scope, event);
      break;
    case 'Delete':
      handleDelete(scope, event);
      break;
    default:
      break;
  }
};
$bus.on('clickTableUp', (v: any) => {
  tableAxios();
});
//表格数据查询
const tableAxios = async () => {
  let valDat: any = '';
  if (Route.name == 'ProductPlan') {
    valDat = Conditions.value;
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
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data.data.map(
        (item: { IsValid: string | boolean; IsProduct: string | boolean }) => {
          return {
            ...item,
            IsValid: item.IsValid ? '是' : '否',
            IsProduct: item.IsProduct ? '是' : '否'
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
        label: item.Resource.cAttributeName,
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
// 挑单
const PickOrder = (obj: any) => {
  console.log(obj, '----');
  sendId.value = [];
  ChooseData.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要挑单的数据'
    });
    return false;
  }
  if (sendId.value.length > 1) {
    ElMessage({
      type: 'info',
      message: '只能选择一条数据！'
    });
    return false;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      cProjectCode: '',
      PlanGuid: sendId.value[0]
    }
  };
  ElMessageBox.confirm('确定挑单?', '提示', {
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
            message: '挑单成功'
          });
          tableAxios();
          sendId.value = [];
          TabRef.value.handleRemoveSelectionChange();
        } else {
          console.log('挑单失败');
        }
        ElLoading.service().close();
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消挑单'
      });
    });
};

const handleDelete = (scope, obj) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [scope.row.UID]
  };
  // ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      });
      tableAxios();
      TabRef.value.handleRemoveSelectionChange();
      ElLoading.service().close();
    } else {
      console.log('删除失败');
      ElLoading.service().close();
    }
  });
};
// 撤销
const Revoke = (obj: any) => {
  sendId.value = [];
  ChooseData.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要撤销的数据'
    });
    return false;
  }
};
// 分包
const SubpackageOperation = (obj: any) => {
  console.log(obj, '----');
  sendId.value = [];
  ChooseData.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要分包运算的数据'
    });
    return false;
  }
};
//按钮删除
const clickDel = (obj: any) => {
  sendId.value = [];
  ChooseData.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要删除的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  ElMessageBox.confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除数据成功'
          });
          tableAxios();
          sendId.value = [];
          TabRef.value.handleRemoveSelectionChange();
        } else {
          console.log('删除失败');
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      });
    });
};
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'newProductPlanView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'ProductPlan',
      title: '生产计划详情'
    }
  });
};
//表格按钮编辑
const clickEditTable = (scope: any, obj: any) => {
  router.push({
    name: 'newProductPlanEdit',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'ProductPlan',
      title: '生产计划编辑'
    }
  });
};
//表格按钮停用
const clickStop = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '停用成功'
      });
      tableAxios();
    } else {
      ElMessage.error('停用失败');
    }
  });
};
//撤销
const clickRevoke = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PlanGuid: senid
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.msg || '撤销成功'
      });
      tableAxios();
    } else {
      ElMessage.error(res.msg || '撤销失败');
    }
    ElLoading.service().close();
  });
};
//挑单
const clickPickOrder = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      cProjectCode: '',
      PlanGuid: senid
    }
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: res.msg || '撤销成功'
      });
      tableAxios();
    } else {
      ElMessage.error(res.msg || '撤销失败');
    }
  });
};

//按钮新增
const clickAdd = (obj: { cIncludeModelCode: any }) => {
  router.push({
    name: 'newProductPlan',
    params: {
      t: Date.now(),
      rowId: ' '
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      title: '新增生产计划',
      type: 'add'
    }
  });
};
const ChooseData = ref([]) as any;
//多选获取UID
const handleSelectionChange = (arr: any) => {
  ChooseData.value = arr;
  // arr.forEach((item: { IsValid: string; UID: any; }) => {
  //     if (item.IsValid === '否') {
  //         sendId.value.push(item.UID)
  //     }
  // })
  // sendId.value=[]
  // arr.forEach((item: { UID: any; }) =>
  //     sendId.value.push(item.UID)
  // )
};
//启用按钮
const Start = (obj: any) => {
  sendId.value = [];
  ChooseData.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
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
      TabRef.value.handleRemoveSelectionChange();
      ElMessage({
        type: 'success',
        message: '启用成功'
      });
      sendId.value = [];
    } else {
      console.log('启用出错了');
    }
  });
};

//按钮导出所有
const ExportAll = async (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 0,
      PageSize: 0,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  exportAnalysisHooks(data, '生产计划-所有');
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
  exportAnalysisHooks(data, '生产计划-所有');
};

const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: 'dProductDate desc'
});
const { dialogV, dialogTitle, Conditions, OrderByFileds } = toRefs(data);
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
