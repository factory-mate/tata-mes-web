<template>
  <!-- 新增页面 -->
  <div class="maintain">
    <div class="bot-btn-cen">
      <!-- 按钮区域 -->
      <ButtonViem
        :ToolBut="But"
        @SaveAddBase="SaveAddBase"
        @SaveAddUnit="SaveAddUnit"
        @SaveAddWMS="SaveAddWMS"
        @SaveAddExtend="SaveAddExtend"
        @clickAddConvert="clickAddConvert"
        @SaveEditBase="SaveEditBase"
        @SaveEditUnit="unitTableAdd"
        @SaveEditWMS="SaveAddWMS"
        @SaveEditExtend="SaveAddExtend"
        @InfoEdit="InfoEdit"
        @SysReview="SysReview"
        @Adopt="Adopt"
        @Suspend="Suspend"
        @ExportDetails="ExportDetails"
      >
      </ButtonViem>
    </div>
    <el-card>
      <!-- tab切换 -->
      <el-tabs
        type="card"
        v-model="tabVal"
        v-if="TabPageVal.length"
        @tab-click="clickTabs"
      >
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
          @tabValType="tabValType"
          @RoleBut="RoleBut"
        ></Head-View>
      </div>
      <!-- 表格区域 -->
      <div v-show="tableColumns.length">
        <myTable
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="true"
          :tableHB="tableHB"
          :tableHeight="600"
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
                <el-button
                  type="primary"
                  :disabled="disabled"
                  size="small"
                  @click="clickTableHandDel(scope)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </template>
        </myTable>
      </div>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
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
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated } from 'vue';
import myTable from '@/components/MyFormTable/index_auto.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox,
  ElLoading
} from 'element-plus';
import PopModel from '@/components/PopModel/model.vue';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { useRoute } from 'vue-router';
import { compare } from '@/utils';
import router from '@/router';
import useStore from '@/store';
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const tabVal = ref('');
const tabValName = ref('');
const tabValBol = ref(true);
const rowId = ref('') as any;
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
const tableHB = ref(false);
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const tableButton = ref([]) as any;
const tabType = ref(true);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//启用传递的UID
let head = ref([]) as any;
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
const { disabled, dialogFormVisible, modelTitle, modelCIncludeModelCode } =
  toRefs(data);
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
  // getAddUser(Route.meta.ModelCode)
  // if(initType.value){
  //     getAddUser(Route.meta.ModelCode)
  // }
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }
  rowId.value = Route.params.rowId;
  initType.value = false;

  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    console.log(row.value, '详情按钮啊-------------------');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
  }
  if (
    history.state.title == '原始订单详情' ||
    history.state.title == '生产订单详情'
  ) {
    disabled.value = true;
  }
});
// tabs 切换，调取对应Tab数据
const clickTabs = (val: any) => {
  console.log(val, '0000----');
  tabValName.value = val.props.label;

  head.value = [];
  tableColumns.value = [];
  total.value = 0;
  tableData.value = [];
  if (val.props.label == '生产订单产品信息') {
    tableHB.value = true;
  } else {
    tableHB.value = false;
  }
  tabVal.value = val.props.name;
  getAddUser(tabVal.value);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.clearValidate();
};
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
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          head.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'TabPage') {
          let itemArr = item[import.meta.env.VITE_APP_key].sort(
            sortArr('iIndex')
          );
          if (tabValBol.value) {
            tabVal.value = itemArr[0].cIncludeModelCode;
          }
          tabValBol.value = false;
          TabPageVal.value = itemArr;
          //调取第一个tab数据
          getAddUser(TabPageVal.value[0].cIncludeModelCode);
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

// 详情  ==》》编辑
const InfoEdit = (obj: any) => {
  ElMessage({
    message: '请去页面点击编辑！',
    type: 'info'
  });
  // disabled.value = false
  // getAddUser(obj.cIncludeModelCode)
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
  // TODO：
  let val = {};
  if (tabValName.value == '生产变记录' || tabValName.value == '生产变更记录') {
    val = {
      OrderByFileds: '',
      Conditions: 'cSourceCode = ' + row.value.cCode + ' && cVouchTypeCode = 8 '
    };
  } else {
    val = { val: row.value.UID };
  }
  let dataVal = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: val
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  ParamsApi(dataVal).then((res: any) => {
    tableData.value = res.data;
    ElLoading.service().close();
  });
};

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
const clickTableBut = (val: string) => {
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
// 添加
const clickAddConvert = (val: any) => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
  modelCIncludeModelCode.value = val.cIncludeModelCode;
};
const modelClose = (val: any) => {
  dialogFormVisible.value = val.type;
};
// tab切换，自动切换
const tabValType = (d: any) => {
  console.log(d, 'tab切换---------');

  // ManageCenter.Inentory.M.Add.Unit
  if (d.val == 1) {
    tabVal.value = 'ManageCenter.Inentory.M.Add.Unit';
  }
  // ManageCenter.Inentory.M.Add.Extend
  if (d.val == 3) {
    tabVal.value = 'ManageCenter.Inentory.M.Add.Extend';
  }
  // ManageCenter.Inentory.M.Add.Unit
  if (d.val == 11) {
    tabVal.value = 'ManageCenter.Inentory.M.Edit.Unit';
  }
  // ManageCenter.Inentory.M.Add.Extend
  if (d.val == 33) {
    tabVal.value = 'ManageCenter.Inentory.M.Edit.Extend';
  }
  getAddUser(tabVal.value);
};
//基础信息保存
const SaveAddBase = (obj: any) => {
  obj.pathName = 'productionOrder';
  obj.tableData = tableData.value;
  obj.tabVal = tabVal.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
//基础信息保存  修改
const SaveEditBase = (obj: any) => {
  obj.pathName = 'productionOrder';
  obj.tableData = tableData.value;
  obj.tabVal = tabVal.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//保存
const SaveAddUnit = (obj: any) => {
  if (
    tabVal.value == 'ManageCenter.Inentory.M.Add.Unit' ||
    tabVal.value == 'ManageCenter.Inentory.M.Edit.Unit'
  ) {
    //单位信息
    // table add
    unitTableAdd(obj);
  } else {
    obj.pathName = 'productionOrder';
    obj.tableData = tableData.value;
    obj.tabVal = tabVal.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj);
  }
};
const unitTableAdd = (obj: any) => {
  if (!window.sessionStorage.getItem('cInvCode')) {
    ElMessage({
      type: 'error',
      message: '请先创建基本信息。'
    });
    return false;
  }
  if (!tableData.value.length) {
    ElMessage({
      type: 'error',
      message: '请添加数据。'
    });
    return false;
  }
  let tableType = tableData.value.some((item: any) => {
    return JSON.stringify(item) !== '{}';
  });
  console.log(Route.query.pageType);

  if (tableType) {
    tableData.value.forEach((item: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      item.cInvCode = window.sessionStorage.getItem('cInvCode');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore

      item.cInvClassCode = window.sessionStorage.getItem('cInvClassCode');
    });
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      data: { singerModels: tableData.value }
    };
    DataApi(data).then((res: any) => {
      if (res.status == 200) {
        ElMessage({
          message: res.msg,
          type: 'success'
        });
        // TODO:
        if (Route.query.pageType == 'add') {
          tabVal.value = 'ManageCenter.Inentory.M.Add.WMS';
        } else {
          tabVal.value = 'ManageCenter.Inentory.M.Edit.WMS';
        }
        getAddUser(tabVal.value);
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
    });
  } else {
    ElMessage({
      type: 'error',
      message: '请删除空数据。'
    });
  }
};
// 扩展信息保存
const SaveAddExtend = (obj: any) => {
  if (!window.sessionStorage.getItem('cInvCode')) {
    ElMessage({
      type: 'error',
      message: '请先创建基本信息。'
    });
    return false;
  } else {
    obj.pathName = 'productionOrder';
    obj.tableData = tableData.value;
    obj.tabVal = tabVal.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-undef
    router.push({ name: 'productionOrder' });
  }
};

//库管信息保存
const SaveAddWMS = (obj: any) => {
  if (!window.sessionStorage.getItem('cInvCode')) {
    ElMessage({
      type: 'error',
      message: '请先创建基本信息。'
    });
    return false;
  } else {
    obj.pathName = 'productionOrder';
    obj.tableData = tableData.value;
    obj.tabVal = tabVal.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj);
  }
};

//系统审单
const SysReview = (obj: any) => {
  console.log(obj, '系统审单----');
};
//通过
const Adopt = (obj: any) => {
  console.log(obj, '通过----');
};
//挂起
const Suspend = (obj: any) => {
  console.log(obj, '挂起----');
};
//导出详情
const ExportDetails = (obj: any) => {
  console.log(obj, '导出详细----');
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
    margin: 20px 0;

    .buttonMain {
      margin-right: 10%;
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
