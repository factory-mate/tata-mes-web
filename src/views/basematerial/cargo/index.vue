<template>
  <!-- 库位/货道档案页面 -->
  <div class="maintain">
    <!-- 搜索区域 -->
    <FilterForm
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    >
    </FilterForm>
    <el-card>
      <!-- 按钮区域 -->
      <ButtonViem
        :ToolBut="But"
        @clickAdd="clickAdd"
        @ExportAll="ExportAll"
        @ExportOne="ExportOne"
        @clickStart="Start"
        @clickDelete="clickDel"
      ></ButtonViem>
      <!-- 表格区域 -->
      <myTable
        ref="Tref"
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
                v-for="item in tableButton"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  v-if="item.iIndex < 3"
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
      />
    </el-card>
    <!-- 组织管理弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :Btn="ZZBut"
      :FormData="ZZFormData"
      :ruleForm="ruleForm"
      :disabled="disabled"
      :row="row"
    ></Odialog>
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
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import Odialog from './components/Oragio.vue';
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
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
let Filter = ref([]) as any;
let But = ref([]) as any;
const Tref = ref();
// 表格配置数据
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const tabType = ref(true);
const tabKey = ref(0);
//启用传递的UID
const CheckDataList = ref([]) as any;
const sendId = ref([]) as any;
//物料分类新增/编辑/详情弹框数据
const ZZdialogFormVisible = ref(false);
const ZZFormData = ref([]) as any;
const ZZBut = ref([]) as any;
const title = ref('');
const ruleForm = ref();
const row = ref();
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
    if (v.name == 'cargo') {
      tableAxios();
    }
  }, 300);
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
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data.data;
      total.value = res.data.dataCount;
      tablefilter();
      Tref.value.handleRemoveSelectionChange();
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
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
//表格按钮详情
const disabled = ref(false);
const clickView = async (scope: any, obj: any) => {
  console.log(obj, '详情');
  row.value = scope.row;
  ZZdialogFormVisible.value = true;
  title.value = '库位详情';
  disabled.value = true;
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
  }
};

//表格按钮编辑
const clickEditTable = async (scope: any, obj: any) => {
  row.value = scope.row;
  ZZdialogFormVisible.value = true;
  title.value = '库位编辑';
  disabled.value = false;
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
  }
};

//表格按钮停用
const clickStop = (scope: any, obj: any) => {
  console.log(scope, obj, '停用');
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      console.log('成功');
      tableAxios();
    } else {
      console.log('失败');
    }
  });
};

//组织管理新增按钮
const clickAdd = async (obj: { cIncludeModelCode: any }) => {
  ZZdialogFormVisible.value = true;
  disabled.value = false;
  title.value = '库位新增';
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
  }
};

//按钮删除
const clickDel = (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: { UID: any }) =>
    sendId.value.push(item.UID)
  );
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
          Tref.value.handleRemoveSelectionChange();
          sendId.value = [];
        } else {
          console.log('删除失败');
          sendId.value = [];
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
//多选获取启用/删除UID
const handleSelectionChange = (arr: any) => {
  CheckDataList.value = arr;
};
//按钮启用
const Start = (obj: any) => {
  sendId.value = [];
  CheckDataList.value.forEach((item: { UID: any }) =>
    sendId.value.push(item.UID)
  );
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选启用的数据'
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
      Tref.value.handleRemoveSelectionChange();
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
      PageIndex: 1,
      PageSize: 999999,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ExportApi(data).then((res: any) => {
    if (res.status == '200') {
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
      const fileName = decodeURI(
        res.headers['content-disposition'] || '库位档案-所有'
      );
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
  });
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
  ExportApi(data).then((res: any) => {
    if (res.status == '200') {
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
      const fileName = decodeURI(
        res.headers['content-disposition'] || '库位档案'
      );
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
  });
};

const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: ''
});
const { dialogV, dialogTitle, Conditions, OrderByFileds } = toRefs(data);
// 搜索
const ClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  console.log(val, '重置');
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  tableAxios();
  Tref.value.clearFilter();
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
