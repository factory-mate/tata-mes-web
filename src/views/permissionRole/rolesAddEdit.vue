<template>
  <!-- /编辑新增用户管理页面 -->
  <div class="maintain">
    <!-- 搜索区域 -->
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn">
        <ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @SaveAddUser="SaveAddUser"
        ></ButtonViem>
      </div>
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
                v-for="(item, idnex) in tableButton"
                :key="idnex"
                :disabled="disabled"
                size="small"
                @click="clickTableHandDel(scope, item)"
                >{{ item.cAttributeName }}</el-button
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

      <!-- 编辑 -->
      <model :dialogV="dialogV" :dialogTitle="dialogTitle"></model>
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

        <FilterForm
          :Filter="TFilter"
          @ClickSearch="TClickSearch"
          @resetForm="TresetForm"
        />

        <myTable
          ref="TTABRef"
          :tableData="TtableData"
          :tableColumns="TtableColumns"
          :tableBorder="true"
          :tableHeight="300"
          :selection="true"
          :EditType="EditType"
          @handleSelectionChange="ThandleSelectionChange"
          :disabledHide="false"
        >
        </myTable>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="TdialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="Tconfirm"> 确认 </el-button>
          </span>
        </template>
        <pagination
          v-if="Ttotal > 0"
          :total="Ttotal"
          v-model:page="TqueryParams.PageIndex"
          v-model:limit="TqueryParams.PageSize"
          @pagination="TchangPage"
          :pager-count="5"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onMounted, onActivated } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
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
import model from './components/userGModel.vue';
import { configApi, DataApi } from '@/api/configApi/index';
import { compare, filterModel, tableSortInit } from '@/utils';
import FilterForm from '@/components/Filter/index.vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import useStore from '@/store';
import { set } from '@vueuse/core';
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const TTABRef = ref();
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
const Ttotal = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const tableButton = ref([]) as any;
const tabType = ref(true);
const EditType = ref(false);
const TdialogFormVisible = ref(false);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const TtableColumns = ref([]) as any;
const TAxiosData = ref([]) as any;
const TtableData = ref([]) as any;
const TFilter = ref([]) as any;
const itemData = ref([]) as any;
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const TqueryParams = reactive({
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
  rowId: '' as any,
  OrderByFileds: '',
  disabled: false
});
const { dialogV, dialogTitle, Conditions, OrderByFileds, disabled, rowId } =
  toRefs(data);
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
  // if(initType.value){
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
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
    row.value = history.state.row ? JSON.parse(history.state.row) : '';
    rowId.value = JSON.parse(history.state.row).UID;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Route.meta.title.match(/详情/gi)) {
    disabled.value = true;
  }
});
onMounted(() => {
  // console.log(initType.value,"--initType.value");
  // modelCode.value =history.state.modelCode?history.state.modelCode:Route.meta.ModelCode
  // Route.meta.ModelCode = history.state.modelCode?history.state.modelCode:Route.meta.ModelCode
  // Route.meta.title = history.state.title?history.state.title:Route.meta.title
  // tagsView.updateVisitedView(Route)
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // getAddUser(Route.meta.ModelCode)
  // if(Route.params.rowId){
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     rowId.value = Route.params.rowId
  // }
  // if(history.state.row){
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     row.value=JSON.parse(history.state.row)
  //     rowId.value=JSON.parse(history.state.row).UID
  // }
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // if(Route.meta.title.match(/详情/ig)){
  //     disabled.value=true
  // }
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
  tableData.value = [];
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
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

// table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.cShowName ?? item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        cFormPropertyCode: item.cFormPropertyCode
      };
      tableColumns.value.push(itemData);
      console.log(tableColumns.value, '表头数据----');
    }
    if (item.Resource.cAttributeTypeCode == 'method') {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      tableButton.value.push(item);
      console.log(tableButton.value, '表格按钮---');
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
      tableButton.value = tableButton.value.filter(
        (item: any, index: any, self: any[]) => {
          // 利用findIndex方法找到第一个与当前元素id相等的元素索引
          const i = self.findIndex(
            (t: any) => t.cAttributeName === item.cAttributeName
          );
          // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
          return i === index;
        }
      );
    }
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      AxiosData.value = item;
      console.log(item, '表格内的数据------');
      tableAxios();
    }
  });
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Conditions: 'cRoleCode = ' + headRef.value.ruleForm.cRoleCode
      // "Conditions": 'cRoleCode = '+headRef.value.ruleForm.cRoleName,
    }
  };
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data.data;
      total.value = res.data.dataCount;
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

// table 按钮 集合
const clickTableBut = (val: string) => {
  console.log(val, '---val');

  switch (val) {
    case 'View':
      clickView();
      break;
    default:
      break;
  }
};

// 按钮详情
const clickView = () => {
  console.log('详情');
};

//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'rolesG';
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'rolesG';
  obj.tableData = tableData.value;
  console.log(obj, '修改保存');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  obj.pathName = 'rolesG';
  console.log(obj, '修改编辑');
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
};
const objAjax = ref({}) as any;
const SaveAddUser = async (obj: any) => {
  console.log(obj, '--obj');
  objAjax.value = obj;
  TdialogFormVisible.value = true;
  try {
    const res = await configApi(obj.cIncludeModelCode);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTables(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
        if (item.cPropertyClassTypeCode == 'Filter') {
          TFilter.value = item[import.meta.env.VITE_APP_key];
        }
      });
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
};
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
//页码变化
const TchangPage = (val: any) => {
  TqueryParams.PageIndex = val.page;
  TqueryParams.PageSize = val.limit;
  TtableAxios();
};
//弹窗确认
const Tconfirm = () => {
  console.log(itemData.value, '--===itemData.value');
  addAjax();
  // TdialogFormVisible.value = false
  // // 表格添加数据
  // itemData.value.forEach((item: any) => {
  //     tableData.value.push(item)
  // })
  // TTABRef.value.handleRemoveSelectionChange()
};
const addAjax = async () => {
  itemData.value.forEach((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    item.cRoleCode = headRef.value.ruleForm.cRoleCode;
  });
  let data = {
    method: objAjax.value.Resource.cHttpTypeCode,
    url: objAjax.value.Resource.cServerIP + objAjax.value.Resource.cUrl,
    data: {
      Items: itemData.value
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      ElMessage({
        message: '成功！',
        type: 'success'
      });
      TdialogFormVisible.value = false;
      // 表格添加数据
      itemData.value.forEach((item: any) => {
        tableData.value.push(item);
      });
      TTABRef.value.handleRemoveSelectionChange();
      tableAxios();
    } else {
      ElMessage({
        message: '失败',
        type: 'error'
      });
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
// table 按钮 集合
const clickTableHandDel = (val: any, item: any) => {
  // tableData.value.splice(val.$index, 1);
  // total.value= TtableData.value.length
  console.log(item.cAttributeCode, '---cAttributeCode');

  switch (item.cAttributeCode) {
    case 'DeleteUser':
      clickDeleteUser(val, item);
      break;

    default:
      break;
  }
};
//弹窗表格选中
const ThandleSelectionChange = (val: any) => {
  itemData.value = JSON.parse(JSON.stringify(val));
};
const clickDeleteUser = (scope: any, obj: any) => {
  const senid = scope.row.UID;
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
      DataApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          });
          tableAxios();
        } else {
          ElMessage.error('删除失败');
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
// TTTtable 数据整合
const funTables = (arr: Array<any>) => {
  modelGrid.value = arr;
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
//表格数据查询
const TtableAxios = async () => {
  let data = {
    method: TAxiosData.value.Resource.cHttpTypeCode,
    url: TAxiosData.value.Resource.cServerIP + TAxiosData.value.Resource.cUrl,
    data: {
      PageIndex: TqueryParams.PageIndex,
      PageSize: TqueryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      TtableData.value = res.data.data;
      Ttotal.value = res.data.dataCount;
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
// T弹窗搜索
const TClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  TtableAxios();
};
// 重置
const TresetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  TtableAxios();
  TTABRef.value.clearFilter();
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
