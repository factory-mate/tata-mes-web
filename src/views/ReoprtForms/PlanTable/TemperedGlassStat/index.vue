<template>
  <div class="maintain">
    <!-- 搜索区域 -->
    <FilterForm
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    />
    <el-card>
      <!-- 按钮区域 -->
      <ButtonView
        :ToolBut="But"
        @clickDelete="clickDel"
        @PushPurcharse="PushPurcharse"
        @ExportAll="ExportAll"
        @ExportOne="ExportOne"
        @ImportPush="ImportPush"
      />
      <!-- 表格区域 -->
      <MyTable
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
              <MyPopup :list="tableColumns" @newList="newList" @renew="renew" />
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
      </MyTable>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="changPage"
      />
    </el-card>
    <!-- 组织管理弹窗 -->
    <DialogModal
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :modeCode="butmodeCode"
      :objData="objData"
      :disabled="disabled"
      :Trow="Trow"
      @FmodelClose="modelClose"
    />
  </div>
</template>

<script setup>
import { ref, toRefs, reactive, nextTick, onActivated, provide } from 'vue';
import MyTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonView from '@/components/Button/index.vue';
import MyPopup from '@/components/Popup/index.vue';
import DialogModal from '@/components/DialogModel/index.vue';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { useRouter, useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance

const $bus = getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const router = useRouter();
const Filter = ref([]);
const But = ref([]);
const TabRef = ref();
const Trow = ref({});
const tableColumns = ref([]);
const tableButton = ref([]);
const AxiosData = ref({});
const tabType = ref(true);
const ZZdialogFormVisible = ref(false);
const title = ref('优化');
const ZZBut = ref([]);
const ZZFormData = ref([]);
const ruleForm = ref();
const disabled = ref(false);
const row = ref();
const objData = ref({});
//启用传递的UID
const sendId = ref([]);
const sendIdArr = ref([]);
const butmodeCode = ref('');
const initType = ref(true);
onActivated(() => {
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
$bus.on('tableUpData', v => {
  setTimeout(() => {
    if (v.name == 'TripartiteOptimize') {
      tableAxios();
    }
  }, 300);
});
//调取用户管理接口
const getData = async val => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(val);
    if (res.status == 200) {
      ElLoading.service().close();
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      res.data.forEach(item => {
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
const tableData = ref([]);
// table 按钮 集合
const clickTableBut = (scope, event) => {
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
      tableData.value = res.data.data.map(item => {
        return {
          ...item,
          IsValid: item.IsValid ? '是' : '否'
        };
      });
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
  tableColumns.value.forEach(aItem => {
    let filData = [];
    tableData.value.forEach(bItem => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter((item, index, self) => {
        const i = self.findIndex(t => t.text === item.text);
        return i === index;
      });
    }
  });
};
// table  排序
const tableHearData = val => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  tableAxios();
};
// table 数据整合
const funTable = arr => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow == true) {
      let itemData = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
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
      tableColumns.value = tableColumns.value.filter((item, index, self) => {
        // 利用findIndex方法找到第一个与当前元素id相等的元素索引
        const i = self.findIndex(t => t.label === item.label);
        // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
        return i === index;
      });
    }
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      AxiosData.value = item;
      tableAxios();
    }
  });
};
//页码变化
const changPage = val => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
const modelClose = v => {
  ZZdialogFormVisible.value = v.type;
};
const PushPurcharse = obj => {
  if (sendIdArr.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要推送的数据'
    });
    return;
  }
  DataApi({
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      list_uid: sendIdArr.value.map(i => i.UID)
    }
  }).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '推送成功'
      });
      tableAxios();
      TabRef.value.handleRemoveSelectionChange();
      sendIdArr.value = [];
    } else {
      console.log('推送失败');
    }
  });
};
//按钮删除
const clickDel = obj => {
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
          TabRef.value.handleRemoveSelectionChange();
          sendId.value = [];
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
const clickView = (scope, obj) => {
  router.push({
    name: 'WareMangeReportViewiew',
    params: {
      t: Date.now(),
      rowId: scope.row
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      pageType: 'view',
      row: JSON.stringify(scope.row),
      pathName: 'WareMangeReportMain',
      title: '报表详情'
    }
  });
};
//按钮导出所有
const ExportAll = async obj => {
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
  exportAnalysisHooks(data, '库房明细-所有');
};
//按钮导出当前页
const ExportOne = async obj => {
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
  exportAnalysisHooks(data, '库房明细-当前');
};

function ImportPush(obj) {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });

  const formData = new FormData();
  formData.append('cfile', obj.files[0].raw);

  let url = obj.Resource.cServerIP + obj.Resource.cUrl;

  let data = {
    method: obj.Resource.cHttpTypeCode,
    url,
    data: formData
  };

  DataApi(data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: res.msg || '操作成功'
        });
        close();
        tableAxios();
      } else {
        ElMessage({
          message: res.msg || '操作失败',
          type: 'error'
        });
      }
    })
    .catch(err => {
      ElMessage({
        message: '操作失败',
        type: 'error'
      });
    })
    .finally(() => {
      loading.close();
    });
}

//多选获取UID
const handleSelectionChange = arr => {
  if (arr.length) {
    sendIdArr.value = arr;
  } else {
    sendIdArr.value = [];
  }
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
const ClickSearch = val => {
  queryParams.PageIndex = 1;
  let searchData = JSON.parse(JSON.stringify(val.value));
  Conditions.value = filterModel(searchData);
  tableAxios();
};
// 重置
const resetForm = val => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  tableAxios();
};

// 列表排序
const newList = val => {
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
provide('tableAxios', { tableAxios });
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
