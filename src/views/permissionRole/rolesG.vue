<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <div class="maintain">
    <!-- 过滤 -->
    <FilterForm
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    ></FilterForm>
    <el-card>
      <!-- button -->
      <ButtonViem
        :ToolBut="ToolBut"
        @clickAdd="clickAdd"
        @clickEdit="clickEdit"
        @ExportOne="ExportOne"
        @ExportAll="ExportAll"
      ></ButtonViem>
      <!-- table -->
      <myTable
        v-if="tabType"
        :tableData="tableData"
        :tableColumns="tableColumns"
        ref="myTableRefs"
        :tableBorder="true"
        :selection="true"
        @tableHearData="tableHearData"
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
                  v-if="item.iIndex < 2"
                  type="primary"
                  size="small"
                  @click="clickTableBut(scope.row, item)"
                >
                  {{ item.Resource.cAttributeName }}
                </el-button>
              </template>
              <el-dropdown
                style="margin-left: 10px"
                v-if="tableButton.length > 2"
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
                        @click="clickTableBut(scope.row, item)"
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
        v-model:page="PageIndex"
        v-model:limit="PageSize"
        @pagination="handleSizeChange"
      />
    </el-card>
    <!--弹框 -->
    <model :dialogV="dialogV" :dialogTitle="dialogTitle"></model>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onMounted, onActivated } from 'vue';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import myPopup from '@/components/Popup/index.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  Delete,
  Plus,
  Edit,
  Refresh,
  Document,
  View,
  Search,
  ArrowDown,
  MoreFilled,
  Tools,
  Upload
} from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElDatePicker,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElOption,
  ElSelect,
  ElTableColumn,
  FormInstance,
  FormRules
} from 'element-plus';
import model from './components/rolesModel.vue';
import { sessionStorage } from '@/utils/storage';
import { configApi, DataApi } from '@/api/configApi/index';
import router from '@/router';
import { useRoute } from 'vue-router';
import useStore from '@/store';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const { tagsView, permission } = useStore();
const Route = useRoute();

interface columnType {
  label: string;
  prop?: string;
  width?: string;
  headerSlot?: boolean;
  slotName?: string;
  fixed?: string;
  minwidth?: string;
  slot?: number;
  checkType?: boolean;
}
const Filter = ref([]) as any;
const ToolBut = ref([]) as any;
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const tabType = ref(true);
const tabKey = ref(0);
const myTableRefs = ref();

const data = reactive({
  dialogV: false,
  dialogTitle: '新增',
  tableData: [],
  total: 0,
  Conditions: '',
  OrderByFileds: '',
  PageIndex: 1,
  PageSize: 20
});
const {
  tableData,
  PageIndex,
  PageSize,
  total,
  dialogV,
  Conditions,
  OrderByFileds,
  dialogTitle
} = toRefs(data);
let { ctx: that } = getCurrentInstance() as any;
const initType = ref(true);
onActivated(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let val = window.sessionStorage.getItem('clickSider')
    ? JSON.parse(window.sessionStorage.getItem('clickSider'))
    : '';
  if (val == Route.name) {
    initType.value = false;
    userConfig(Route.meta.ModelCode);
  }
  if (initType.value) {
    userConfig(Route.meta.ModelCode);
  }
  initType.value = false;
});
onMounted(() => {});
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'rolesG') {
      tableAxios();
    }
  }, 300);
});
// init  数据
const userConfig: any = (val: string) => {
  ElLoading.service({ lock: true, text: '加载中.....' });
  configApi(val).then(res => {
    if (res.status === 200) {
      Filter.value = [];
      ToolBut.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          ToolBut.value = item[import.meta.env.VITE_APP_key].sort(
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
      ElLoading.service().close();
    }
  });
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
      // 去重一下
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
// table 按钮 集合
const clickTableBut = (scopeItem: any, butItem: any) => {
  console.log(scopeItem, '00----bbb');

  switch (butItem.Resource.cAttributeCode) {
    case 'Edit': //编辑
      router.push({
        name: 'rolesAddEdit',
        params: {
          t: Date.now(),
          rowId: scopeItem.UID
        },
        state: {
          modelCode: butItem.cIncludeModelCode,
          title: '角色编辑',
          pathName: 'rolesG',
          row: JSON.stringify(scopeItem)
        }
      });
      break;
    case 'Delete': //删除
      // eslint-disable-next-line no-case-declarations
      ElMessageBox.confirm('确定删除这条数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const DelData: any = {
            method: butItem.Resource.cHttpTypeCode,
            url: butItem.Resource.cServerIP + butItem.Resource.cUrl,
            data: [scopeItem.UID]
          };
          butAxios(DelData);
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除'
          });
        });

      break;
    case 'Start': //启用
      // eslint-disable-next-line no-case-declarations
      const startData = {
        method: butItem.Resource.cHttpTypeCode,
        url: butItem.Resource.cServerIP + butItem.Resource.cUrl,
        data: [scopeItem.UID]
      };
      butAxios(startData);
      break;
    case 'Stop': //停用
      // eslint-disable-next-line no-case-declarations
      const StopData = {
        method: butItem.Resource.cHttpTypeCode,
        url: butItem.Resource.cServerIP + butItem.Resource.cUrl,
        data: [scopeItem.UID]
      };
      butAxios(StopData);
      break;
    case 'View': //详情
      router.push({
        name: 'rolesAddView',
        params: {
          t: Date.now(),
          rowId: scopeItem.UID
        },
        state: {
          modelCode: butItem.cIncludeModelCode,
          title: '角色详情',
          pathName: 'rolesG',
          row: JSON.stringify(scopeItem)
        }
      });
      break;
    default:
      break;
  }
};
const butAxios = (DelData: { method: any; url: any; data: any[] }) => {
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(DelData).then((res: any) => {
    if (res.status == 200) {
      ElMessage({
        message: res.msg,
        type: 'success'
      });
      tableAxios();
    } else {
      ElMessage.error(res.msg);
    }
    ElLoading.service().close();
  });
  tableAxios();
};
// table 数据
const tableAxios = () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: PageIndex.value,
      PageSize: PageSize.value,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  DataApi(data).then(res => {
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
      myTableRefs.value.handleRemoveSelectionChange();
    } else {
      console.log('请求出错');
    }
    ElLoading.service().close();
  });
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

// 搜索
const ClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  console.log(val, 'resetForm');
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  (PageIndex.value = 1), (PageSize.value = 10);
  myTableRefs.value.clearFilter();
  tableAxios();
};
// 新增
const clickAdd = (val: any) => {
  console.log();

  router.push({
    name: 'rolesAdd',
    params: {
      t: Date.now(),
      rowId: ' '
    },
    state: {
      modelCode: val.cIncludeModelCode,
      title: '角色新增',
      pathName: 'rolesG',
      pageType: 'view',
      type: 'add'
    }
  });
};
// 编辑
const clickEdit = (val: any) => {
  console.log(val, 'clickEdit');
  // dialogV.value=true
  // dialogTitle.value='编辑'
};
//按钮导出所有
const ExportAll = async (obj: any) => {
  let ExcelData = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 0,
      PageSize: 0,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(ExcelData, '角色管理-所有');
  ElLoading.service().close();
};
//按钮导出当前页
const ExportOne = async (obj: any) => {
  let ExcelData = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: PageIndex.value,
      PageSize: PageSize.value,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(ExcelData, '角色管理');
  ElLoading.service().close();
};

// 列表排序

const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
    tableAxios();
    // that.$forceUpdate()
  });
};
// 恢复
const renew = () => {
  userConfig(Route.meta.ModelCode);
};
// 分页
const handleSizeChange = (val: any) => {
  (PageIndex.value = val.page), (PageSize.value = val.limit);
  tableAxios();
};
</script>

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
}

.maintain .selectSty {
  width: 233px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
