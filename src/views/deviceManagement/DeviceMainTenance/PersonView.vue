<template>
  <!-- 项目详情 -->
  <div class="maintain">
    <!-- 按钮区域 -->
    <div style="display: flex">
      <ButtonViem :ToolBut="But"> </ButtonViem>
    </div>
    <el-card>
      <!-- tab切换 -->
      <el-tabs type="card" v-model="tabVal" v-if="TabPageVal.length">
        <el-tab-pane
          v-for="item in TabPageVal"
          :key="item.cIncludeModelCode"
          :label="item.Resource.cAttributeName"
          :name="item.cIncludeModelCode"
        ></el-tab-pane>
      </el-tabs>
      <!-- 主题 -->
      <div v-show="head.length">
        <Head-View
          :Head="head"
          :row="row"
          :rowId="rowId"
          ref="headRef"
          :disabled="disabled"
          :dialogFormVisible="dialogFormVisible"
          :tabVal="tabVal"
          @RoleBut="RoleBut"
        ></Head-View>
      </div>
      <!-- 表格区域 -->
      <div v-show="tableColumns.length">
        <myTable
          ref="TabRef"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="false"
        >
          <template #button>
            <el-table-column
              label="操作"
              fixed="right"
              width="100px"
              align="center"
            >
              <template #header>
                <span>操作</span>
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
      </div>
      <pagination
        v-if="ftotal > 0"
        :total="ftotal"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
        @pagination="changPage"
      />
      <!-- 组织管理弹窗 -->
      <pop-model
        :dialogFormVisible="dialogFormVisible"
        :title="modelTitle"
        :modelCIncludeModelCode="modelCIncludeModelCode"
        :modelGridType="modelGridType"
        :modelGrid="modelGrid"
        @modelClose="modelClose"
        @clickHandAdd="clickHandAdd"
      ></pop-model>
    </el-card>
    <!-- 添加弹窗表格 -->
    <div>
      <el-dialog
        v-model="TdialogFormVisible"
        title="添加"
        draggable
        :modal="false"
        :close-on-click-modal="false"
      >
        <!-- 搜索区域 -->
        <div v-if="TFilter.length">
          <FilterForm :Filter="TFilter"></FilterForm>
        </div>
        <myTable
          ref="TTABRef"
          :tableData="TtableData"
          :tableColumns="TtableColumns"
          :tableBorder="true"
          :selection="true"
          :disabledHide="false"
        >
        </myTable>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="TdialogFormVisible = false">取消</el-button>
            <!-- <el-button type="primary" @click="Tconfirm">
                        确认
                    </el-button> -->
            <el-button type="primary" v-for="item in TBut" :key="item.UID">
              {{ item.Resource.cAttributeName }}
            </el-button>
          </span>
        </template>
        <pagination
          v-if="total > 0"
          :total="total"
          v-model:page="queryParams.PageIndex"
          v-model:limit="queryParams.PageSize"
        />
      </el-dialog>
    </div>
    <!-- 弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="ZZtitle"
      :objData="objData"
      :headRow="headRow"
      :modeCode="objModeCode"
      :disabled="disabled"
      :Trow="Trow"
      @FmodelClose="modelClose"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, provide } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import FilterForm from '@/components/Filter/index.vue';
import { ElLoading } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import Odialog from '@/components/DialogModel/index.vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { Picture as IconPicture } from '@element-plus/icons-vue';
import PopModel from '@/components/PopModel/model.vue';
import {
  configApi,
  ParamsApi,
  DataApi,
  ExportApi,
  delApi
} from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import ImgPreview from '@/components/ImgPrive/index.vue'; //图片预览
import type { UploadInstance, UploadUserFile } from 'element-plus';
import { useRoute } from 'vue-router';
import { compare, filterModel, tableSortInit } from '@/utils';
import router from '@/router';
import { fa } from 'element-plus/es/locale';
import useStore from '@/store';
const Route = useRoute();
//上传
const dialogVisible = ref(false);
const cover = ref(false);
const uploadRef = ref<UploadInstance>();
const { tagsView, permission, user } = useStore();
const hasToken = user.token;
const fileList = ref<UploadUserFile[]>([]);
const headers = ref({
  Authorization: hasToken
});

const modelCode = ref();
const row = ref();
const Trow = ref();
const tabVal = ref();
const tabValBol = ref(true);
const rowId = ref('') as any;
const headRef = ref(null);
let But = ref([]) as any;
const FirBut = ref([]) as any;
const EditType = ref(false);
//表格数据
const tableData = ref([] as any);
//总条数
const ftotal = ref(0);
const total = ref(0);
// 表格配置数据
const TabRef = ref();
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const tableButton = ref([]) as any;
const tabType = ref(true);
const tableHB = ref(false);
const dialogVisibleImg = ref(false);
const ImgList = ref([]) as any;
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
const imgIshow = ref(false); //预览图片
const tableIndex = ref(null);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//弹窗数据
const TTABRef = ref();
const TdialogFormVisible = ref();
const TAxiosData = ref({}) as any;
const TtableData = ref([]) as any;
const TtableColumns = ref([]) as any;
const TFilter = ref([]) as any;
const TBut = ref([]) as any;
//弹窗数据
const headRow = ref({});
const ZZdialogFormVisible = ref(false);
const ZZtitle = ref('优化');
const ZZBut = ref([]) as any;
const ZZFormData = ref([]) as any;
const ruleForm = ref();
const disabled = ref(false);
const objData = ref({});
const objModeCode = ref('');
const SessionDevCode = ref('');
const codess = ref('');
//启用传递的UID
let head = ref([]) as any;
let rowVal = ref([]) as any;
let TabPageVal = ref([]) as any;
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  disabled: false,
  dialogFormVisible: false,
  modelTitle: '标题',
  modelCIncludeModelCode: ''
});
const {
  dialogFormVisible,
  modelTitle,
  modelCIncludeModelCode,
  OrderByFileds,
  Conditions
} = toRefs(data);
const initType = ref(true);
onActivated(() => {
  tabValBol.value = true;
  modelCode.value = history.state.modelCode
    ? history.state.modelCode
    : Route.meta.ModelCode;
  Route.meta.ModelCode = history.state.modelCode
    ? history.state.modelCode
    : Route.meta.ModelCode;
  Route.meta.title = history.state.title
    ? history.state.title
    : Route.meta.title;
  tagsView.updateVisitedView(Route);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }
  rowId.value = Route.params.rowId;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  SessionDevCode.value = JSON.parse(
    window.sessionStorage.getItem('DeviceData')
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  codess.value = JSON.parse(
    window.sessionStorage.getItem('DeviceData')
  )?.cDeviceCode;
  initType.value = false;

  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row)?.UID;
    rowVal.value = JSON.parse(history.state.row);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Route.meta.title.match(/详情/gi)) {
    disabled.value = true;
  }
});
// 权限按钮
const RoleBut = (v: any) => {
  let ToolData = head.value.filter((BItem: any) => {
    return BItem.cAttributeCode == 'Tool';
  });
  if (ToolData.length) {
    let dataVal = {
      method: ToolData[0].Resource.cHttpTypeCode,
      url: ToolData[0].Resource.cServerIP + ToolData[0].Resource.cUrl,
      data: v
    };
    DataApi(dataVal).then((res: any) => {
      if (res.data.cPropertyClassTypeCode == 'ToolBut') {
        But.value = res.data[import.meta.env.VITE_APP_key].sort(
          compare('iIndex', true)
        );
      }
    });
  }
};

const getAddUser = async (code: any) => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(code);
    if (res.status == 200) {
      head.value = [];
      tableColumns.value = [];
      total.value = 0;
      tableData.value = [];
      But.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          head.value = item[import.meta.env.VITE_APP_key].sort(
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
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
    ElLoading.service().close();
  }
};

//排序
const sortArr = (property: any) => {
  return function (a: any, b: any) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2; //正序
    // return value2 - value1; //倒叙
  };
};

// table 数据整合
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  tableColumns.value = [];
  tableData.value = [];
  tableButton.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        cFormPropertyCode: item.cFormPropertyCode,
        cModelCode: item.cModelCode,
        DefinedParm1: item.DefinedParm1,
        DefinedParm2: item.DefinedParm2
      };
      tableColumns.value.push(itemData);
      if (
        tabVal.value == 'ManageCenter.Inentory.M.Add.Unit' ||
        tabVal.value == 'ManageCenter.Inentory.M.Edit.Unit'
      ) {
        tableColumns.value.push({
          checkType: true,
          label: '操作',
          slotName: 'button'
        });
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

//表格数据查询
const tableAxios = async () => {
  let dataVal = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      val: rowId.value
    }
  };
  ParamsApi(dataVal).then((res: any) => {
    if (!res.data) {
      return false;
    }
    tableData.value = res.data;
    // ftotal.value=res.data.dataCount
    ElLoading.service().close();
  });
  ElLoading.service().close();
};
provide('tableAxios', { tableAxios });
// table 按钮 集合
const clickTableHandDel = (val: any) => {
  tableData.value.splice(val.$index, 1);
  total.value = total.value - 1;
};
const clickTableAdd = () => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
};
const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  total.value = total.value + 1;
};
//表格按钮
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'ReportRepair':
      ReportRepair(scope, event);
      break;
    case 'ViewStand':
      ViewStand(scope, event);
      break;
    case 'Edit':
      ClickEdit(scope, event);
      break;
    default:
      break;
  }
};
//转维修
const ReportRepair = (scope: any, event: any) => {
  console.log(event, '转维修');
  disabled.value = false;
  ZZdialogFormVisible.value = true;
  objData.value = event;
  ZZtitle.value = '转维修';
  objModeCode.value = event.cIncludeModelCode;
  Trow.value = scope.row;
  headRow.value = rowVal.value;
};
//新增/编辑/详情弹窗
const modelClose = (v: any) => {
  ZZdialogFormVisible.value = v.type;
};

const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};

//指标详情
const ViewStand = (scope: any, obj: any) => {
  router.push({
    name: 'PonitTargetView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'ProjectView',
      title: '指标详情'
    }
  });
};
//编辑
const ClickEdit = (scope: any, obj: any) => {
  disabled.value = false;
  row.value = scope.row;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  ZZtitle.value = '编辑';
  objModeCode.value = obj.cIncludeModelCode;
};

const seleData = ref([]) as any;
const sendId = ref([]) as any;
const tabRefs = ref(null) as any;
const handleSelectionChange = (val: any) => {
  console.log(val, '---sel');
  seleData.value = val;
};
// 重置
const TresetForm = (val: any) => {
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

  .bot-btn-cen {
    margin: 10px 0;
    .buttonMain {
      margin-left: -80%;
    }
  }
  .repairTab {
    .el-table :deep(.el-table__header th) {
      border-color: #000 !important;
    }
    // //表格下面
    ::v-deep .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid #000 !important;
    }
    // // 列表中间的竖线
    ::v-deep .el-table--border td,
    .el-table--border th {
      border-right: 1px solid #000 !important;
    }
    //表格外围4条线
    .el-table--group {
      border: 1px solid #000 !important;
    }
    /**
改变表格内竖线颜色
 */
    .el-table--border td,
    .el-table--border th,
    .el-table__body-wrapper
      .el-table--border.is-scrolling-left
      ~ .el-table__fixed {
      border-right: 1px solid #000 !important;
    }
    /**
改变表格内行线颜色
 */
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: 1px solid #000 !important;
    }

    .el-table thead tr th {
      border-color: #000;
    }

    ::v-deep .el-table {
      --el-table-border-color: #000 !important;
    }
  }
}

.maintain .selectSty {
  width: 233px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
.demo-image__previe {
  width: 100%;
  min-height: 100px;
}
.image-slot {
  width: 100%;
  font-size: 50px;
  text-align: center;
}

.buttSty {
  margin-left: 0 !important;
}
.uploadTc {
  .fileSty {
    display: flex;
    justify-content: center;
  }
}
</style>
