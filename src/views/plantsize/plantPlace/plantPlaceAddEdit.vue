<template>
  <!--职员新增页面 -->
  <div class="maintain">
    <el-card>
      <!-- 搜索区域 -->
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="disabled"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 表格区域 -->
      <myTable
        v-if="tabType"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
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
              <myPopup :list="tableColumns" @newList="newList"></myPopup>
            </template>
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                v-for="item in tableButton"
                :key="item.Resource.cAttributeName"
                @click="clickTableBut(scope, item)"
                >{{ item.Resource.cAttributeName }}</el-button
              >
            </template>
          </el-table-column>
        </template>
      </myTable>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
      />
      <!-- 按钮区域 -->
      <div class="bot-btn">
        <ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @AddEquipment="obj => handleOpenDialog(obj, '9')"
          @AddProcess="obj => handleOpenDialog(obj, '3')"
          @AddShowColor="obj => handleOpenDialog(obj, '1')"
        ></ButtonViem>
      </div>
    </el-card>

    <div>
      <el-dialog
        v-model="dialogFormVisible"
        title="添加设备"
        :modal="false"
        :close-on-click-modal="false"
        width="90%"
      >
        <FilterForm
          :Filter="dialogFilter"
          @ClickSearch="clickDialogSearch"
          @resetForm="resetDialogForm"
        ></FilterForm>
        <myTable
          ref="dialogTableRef"
          :tableData="dialogTableData"
          :tableColumns="dialogTableColumns"
          tableBorder
          selection
          @handleSelectionChange="handleDialogSelectionChange"
          :disabledHide="false"
        >
        </myTable>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="dialogConfirm"> 确认 </el-button>
          </span>
        </template>
        <pagination
          v-if="dialogTotal > 0"
          :total="dialogTotal"
          v-model:page="dialogQueryParams.PageIndex"
          v-model:limit="dialogQueryParams.PageSize"
          @pagination="changeDialogPage"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { configApi, DataApi, ParamsApi, delApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { compare, filterModel, tableSortInit } from '@/utils';
import useStore from '@/store';
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const rowId = ref();
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
const dialogTotal = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const tableButton = ref([]) as any;
const tabType = ref(true);
const AxiosData = ref({}) as any;
const dialogFilter = ref([]) as any;
const dialogButton = ref([]);
const dialogTableData = ref([]) as any;
const dialogTableColumns = ref([]) as any;
const dialogAxiosData = ref({}) as any;
const dialogTypeCode = ref(null);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 500
});
const dialogQueryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const dialogFormVisible = ref(false);
const dialogTableRef = ref(null);
//启用传递的UID
const sendId = ref([]) as any;
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  dialogConditions: '',
  dialogOrderByFileds: '',
  disabled: false
});
const {
  dialogV,
  dialogTitle,
  Conditions,
  OrderByFileds,
  dialogConditions,
  dialogOrderByFileds,
  disabled
} = toRefs(data);
let head = ref([]) as any;
const initType = ref(true);
onActivated(() => {
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
  // if(initType.value){
  //     getAddUser(Route.meta.ModelCode)
  // }
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }
  rowId.value = Route.params.rowId;
  initType.value = false;
  if (Route.params.rowId) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = Route.params.rowId;
  }
  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
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
    const res = await configApi(code);
    if (res.status == 200) {
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
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
};

// table 数据整合
const funTable = (arr: Array<any>) => {
  tableButton.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
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

//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: 'cPositionCode = ' + row.value.cPositionCode
    }
  };
  try {
    const res = await ParamsApi(data);
    if (res.status == 200) {
      tableData.value = res.data.map((item: { IsValid: string | boolean }) => {
        return {
          ...item,
          IsValid: item.IsValid ? '是' : '否'
        };
      });
      //启用传递的UID
      tableData.value.forEach((item: { IsValid: string; UID: any }) => {
        if (item.IsValid === '否') {
          sendId.value.push(item.UID);
        }
      });
      total.value = res.data.dataCount;
      tablefilter();
    } else {
      console.log('请求出错');
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
// table 按钮 集合
const clickTableBut = (val: any, item: any) => {
  switch (item.Resource.cAttributeCode) {
    case 'View':
      clickView();
      break;
    case 'DeleteBody':
      deleteItem(val, item);
      break;
    default:
      break;
  }
};

// 按钮详情
const clickView = () => {
  console.log('详情');
};

const deleteItem = (obj, item) => {
  ElMessageBox.confirm('确认删除？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: [obj.row.UID]
    };
    delApi(data).then((res: any) => {
      if (res.status == 200) {
        ElMessage({
          message: '删除成功',
          type: 'success'
        });
        tableAxios();
      } else {
        console.log('请求出错');
      }
    });
  });
};

//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'plantPlace';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'plantPlace';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  console.log(obj, '修改编辑');
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
};

// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
  });
};

const changeDialogPage = (val: any) => {
  dialogQueryParams.PageIndex = val.page;
  dialogQueryParams.PageSize = val.limit;
  getDialogData();
};

const getDialogData = async () => {
  let conditions = dialogConditions.value;
  console.log(row.value, 'row');
  if (dialogTypeCode.value === '1') {
    if (dialogConditions.value) {
      conditions = `MID=${row.value.UID} && ${dialogConditions.value}`;
    } else {
      conditions = `MID=${row.value.UID}`;
    }
  }
  let data = {
    method: dialogAxiosData.value.Resource.cHttpTypeCode,
    url:
      dialogAxiosData.value.Resource.cServerIP +
      dialogAxiosData.value.Resource.cUrl,
    data: {
      PageIndex: dialogQueryParams.PageIndex,
      PageSize: dialogQueryParams.PageSize,
      OrderByFileds: dialogOrderByFileds.value,
      Conditions: conditions
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      dialogTableData.value = res.data.data;
      dialogTotal.value = res.data.dataCount;
      dialogTableRef.value.handleRemoveSelectionChange();
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};

const clickDialogSearch = (val: any) => {
  dialogQueryParams.PageIndex = 1;
  dialogConditions.value = filterModel(val.value);
  getDialogData();
};

const resetDialogForm = () => {
  dialogConditions.value = '';
  dialogOrderByFileds.value = '';
  dialogTableColumns.value = tableSortInit(dialogTableColumns.value);
  dialogQueryParams.PageIndex = 1;
  dialogQueryParams.PageSize = 20;
  getDialogData();
  dialogTableRef.value.clearFilter();
};
const dialogSelectedData = ref([]) as any;

const handleDialogSelectionChange = (val: any) => {
  dialogSelectedData.value = val;
};
const dialogConfirm = async () => {
  if (dialogSelectedData.value.length == 0) {
    ElMessage({
      message: '请选择数据',
      type: 'warning'
    });
    return;
  }
  let cResourceCode;
  let cResourceName;
  switch (dialogTypeCode.value) {
    case '9':
      cResourceCode = dialogSelectedData.value[0].cDeviceCode;
      cResourceName = dialogSelectedData.value[0].cDeviceName;
      break;
    case '3':
      cResourceCode = dialogSelectedData.value[0].cProcessCode;
      cResourceName = dialogSelectedData.value[0].cProcessName;
      break;
    case '1':
      cResourceCode = dialogSelectedData.value[0].cProgramCode;
      cResourceName = dialogSelectedData.value[0].cProgramName;
      break;
  }
  let data = {
    method: dialogButton.value[0].Resource.cHttpTypeCode,
    url:
      dialogButton.value[0].Resource.cServerIP +
      dialogButton.value[0].Resource.cUrl,
    data: {
      cPositionCode: row.value.cPositionCode,
      cResourceTypeCode: dialogTypeCode.value,
      cResourceCode,
      cResourceName
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status === 200) {
      ElMessage({
        message: '添加成功',
        type: 'success'
      });
      dialogFormVisible.value = false;
      getDialogData();
      tableAxios();
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
};

const handleOpenDialog = async (obj, code) => {
  dialogFormVisible.value = true;
  dialogTypeCode.value = code;
  dialogTableColumns.value = [];
  dialogQueryParams.PageIndex = 1;
  try {
    const res = await configApi(obj.cIncludeModelCode);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Grid') {
          const gridArr = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
          gridArr.forEach(item => {
            if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
              if (item.IsShow) {
                let itemData = {
                  checkType: true,
                  label: item.Resource.cAttributeName,
                  prop: item.Resource.cAttributeCode,
                  edit: item.DefinedParm4,
                  cControlTypeCode: item.cControlTypeCode,
                  headerSlot: false,
                  slot: ''
                };
                dialogTableColumns.value.push(itemData);
                dialogTableColumns.value.push({
                  checkType: true,
                  label: '操作',
                  slotName: 'button'
                });
                dialogTableColumns.value = dialogTableColumns.value.filter(
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
            if (item.Resource.cAttributeTypeCode == 'binddata') {
              dialogAxiosData.value = item;
              getDialogData();
            }
          });
        }
        if (item.cPropertyClassTypeCode === 'ToolBut') {
          dialogButton.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Filter') {
          dialogFilter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
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

  .bot-btn {
    margin: 20px 0;
  }
}
.maintain .selectSty {
  width: 233px;
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
