<template>
  <!--维护方案页面 -->
  <div class="maintain">
    <el-card>
      <!-- 搜索区域 -->
      <FilterForm
        :Filter="Filter"
        @ClickSearch="ClickSearch"
        @resetForm="resetForm"
      ></FilterForm>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="disabled"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 按钮区域 -->
      <div class="bot-btn">
        <ButtonViem
          :ToolBut="But"
          @clickAdd="clickAdd"
          @BatchDelete="BatchDelete"
        ></ButtonViem>
      </div>
      <!-- 表格区域 -->
      <myTable
        ref="TabRef"
        v-if="tabType"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
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
        @pagination="changPage"
      />
    </el-card>
    <!-- 添加弹窗表格 -->
    <div>
      <el-dialog
        v-model="TdialogFormVisible"
        title="添加"
        draggable
        :modal="false"
        :close-on-click-modal="false"
        width="80%"
      >
        <!-- 搜索区域 -->
        <div>
          <FilterForm
            :Filter="TFilter"
            @ClickSearch="TClickSearch"
            @resetForm="FilresetForm"
          ></FilterForm>
        </div>
        <myTable
          ref="TTABRef"
          :tableData="TtableData"
          :tableColumns="TtableColumns"
          :tableBorder="true"
          :selection="true"
          @handleSelectionChange="ThandleSelectionChange"
          :disabledHide="false"
        >
        </myTable>
        <pagination
          v-if="total > 0"
          :total="total"
          v-model:page="queryParams.PageIndex"
          v-model:limit="queryParams.PageSize"
          @pagination="TchangPage"
        />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="TdialogFormVisible = false">取消</el-button>
            <!-- <el-button type="primary" @click="Tconfirm">
                        确认
                    </el-button> -->
            <el-button
              type="primary"
              @click="Save(item)"
              v-for="item in TBut"
              :key="item.UID"
            >
              {{ item.Resource.cAttributeName }}
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <!-- 弹窗 -->
    <Odialog
      ref="DorRef"
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :objData="objData"
      :modeCode="objModeCode"
      :disabled="Tdisabled"
      :Trow="Trow"
      @FmodelClose="DmodelClose"
      :FalutCode="FalutCode"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, provide } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import Odialog from '@/components/DialogModel/index.vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { compare, filterModel, tableSortInit } from '@/utils';
import useStore from '@/store';
import { useRouter } from 'vue-router';
const Route = useRoute();
const router = useRouter();
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const rowId = ref();
const headRef = ref(null);
let But = ref([]) as any;
const DorRef = ref();
//表格数据
const TabRef = ref();
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const tableButton = ref([]) as any;
const tabType = ref(true);
const AxiosData = ref({}) as any;
const objModeCode = ref('');
//弹窗数据
const ZZdialogFormVisible = ref(false);
const title = ref('优化');
const Tdisabled = ref(false);
const Trow = ref({});
const objData = ref({});
const CheckDataList = ref([]) as any;
//弹窗数据
const modelGrid = ref([]) as any;
const TTABRef = ref();
const TdialogFormVisible = ref();
const TAxiosData = ref({}) as any;
const TtableData = ref([]) as any;
const TtableColumns = ref([]) as any;
const TFilter = ref([]) as any;
const Filter = ref([]) as any;
const TBut = ref([]) as any;
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//启用传递的UID
const sendId = ref([]) as any;
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  disabled: false
});
const { dialogV, dialogTitle, Conditions, OrderByFileds, disabled } =
  toRefs(data);
let head = ref([]) as any;
const initType = ref(true);
const FalutCode = ref();
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
  // if(initType.value){
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     getAddUser(Route.meta.ModelCode)
  // }
  getAddUser(Route.meta.ModelCode);
  // if (rowId.value != Route.params.rowId) {
  //   getAddUser(Route.meta.ModelCode);
  // }
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
    FalutCode.value = row.value.cProgramCode;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
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
    if (!code) {
      return false;
    }
    const res = await configApi(code);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
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
  tableColumns.value = [];
  tableButton.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: ''
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
  const conditions = [`cPersonGroupCode=${row.value.cPersonGroupCode}`];

  if (Conditions.value) {
    conditions.push(Conditions.value);
  }

  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: conditions.join(' && ')
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      // tableData.value = res.data.data;
      tableData.value = res.data.data;
      total.value = res.data.dataCount;
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
provide('tableAxios', { tableAxios });
// table 按钮集合
const clickTableBut = (
  scope: { row: { UID: any } },
  event: { cAttributeCode: any; cIncludeModelCode?: any; Resource?: any }
) => {
  switch (event.cAttributeCode) {
    case 'Delete':
      clickDel(scope, event);
      break;
    case 'ViewFile':
      ViewFile(scope, event);
      break;
    case 'DownLoad':
      download(scope, event);
      break;
    default:
      break;
  }
};
const download = (scope, event) => {
  const { cFileRoteUrl, cActName, cFileType, cFileName } = scope.row;
  const url = `${cFileRoteUrl}${cActName}${cFileType}`;
  // fetch(url)
  //   .then(response => response.blob())
  //   .then(blob => {
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `${cFileName}${cFileType}`;
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //   })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.setAttribute('download', `${cFileName}${cFileType}`);
  downloadLink.setAttribute('target', '_blank');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  console.log(`${cFileName}${cFileType}`);
};
//多选获取UID
const handleSelectionChange = (arr: any) => {
  CheckDataList.value = arr;
};
//新增/编辑/详情弹窗
const DmodelClose = (v: any) => {
  ZZdialogFormVisible.value = v.type;
};
//添加
const clickAdd = async (obj: any) => {
  // ZZdialogFormVisible.value = true
  // objData.value=obj
  // title.value='添加'
  // objModeCode.value=obj.cIncludeModelCode
  TdialogFormVisible.value = true;
  const res = await configApi(obj.cIncludeModelCode);
  if (res.status == 200) {
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'Grid') {
        TfunTables(
          item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
        );
      }
      if (item.cPropertyClassTypeCode == 'Filter') {
        TFilter.value = item[import.meta.env.VITE_APP_key].sort(
          compare('iIndex', true)
        );
      }
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        TBut.value = item[import.meta.env.VITE_APP_key].sort(
          compare('iIndex', true)
        );
      }
    });
  } else {
    console.log('请求出错');
  }
};
// TTTtable 数据整合
const TfunTables = (arr: Array<any>) => {
  modelGrid.value = arr;
  TtableColumns.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        edit: item.DefinedParm4,
        cControlTypeCode: item.cControlTypeCode,
        headerSlot: false,
        slot: ''
      };
      TtableColumns.value.push(itemData);
      TtableColumns.value.push({
        checkType: true,
        label: '操作',
        slotName: 'button'
      });
      TtableColumns.value = TtableColumns.value.filter(
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
      TAxiosData.value = item;
      TtableAxios();
    }
  });
};
//TT弹窗表格数据查询
const TtableAxios = async () => {
  TtableData.value = [];
  total.value = 0;
  let data = {
    method: TAxiosData.value.Resource.cHttpTypeCode,
    url: TAxiosData.value.Resource.cServerIP + TAxiosData.value.Resource.cUrl,
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
      TtableData.value = res.data.data;
      total.value = res.data.dataCount;
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
const itemData = ref([]) as any;
//TT弹窗多选
const ThandleSelectionChange = (val: any) => {
  itemData.value = val;
};
//TT弹窗保存
const Save = async (obj: any) => {
  console.log(obj, '弹窗保存---');
  //添加文档
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // cProgramCode: FalutCode.value,
      ms: itemData.value.map(i => ({
        ...i,
        cPersonGroupCode: row.value?.cPersonGroupCode,
        cPersonGroupName: row.value?.cPersonGroupName
      }))
    }
  };
  try {
    const res = await DataApi(data);
    TTABRef.value.handleRemoveSelectionChange();
    if (res.status == 200) {
      ElMessage({
        type: 'success',
        message: '保存成功'
      });
      TdialogFormVisible.value = false;
      tableAxios();
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
//TT弹窗搜索
const TClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  TtableAxios();
};
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
//TT页码变化
const TchangPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  TtableAxios();
};
const BatchDelete = obj => {
  if (CheckDataList.value.length === 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要删除的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: CheckDataList.value.map(i => i.DevProPersonUID)
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
//删除
const clickDel = (
  scope: { row: any },
  obj: { cAttributeCode?: any; cIncludeModelCode?: any; Resource?: any }
) => {
  const senid = scope.row.DevProPersonUID;
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
//查看文档
const ViewFile = (
  scope: { row: any },
  obj: { cAttributeCode?: any; cIncludeModelCode?: any; Resource?: any }
) => {
  router.push({
    name: 'Checkifile',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'addFile',
      title: '查看文档'
    }
  });
};
// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
  });
};

// 搜索
const ClickSearch = (val: any) => {
  queryParams.PageIndex = 1;
  Conditions.value = filterModel(val.value);
  tableAxios();
};
// 重置
const FilresetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  TtableAxios();
  TabRef.value.clearFilter();
};

// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  tableAxios();
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
