<template>
  <!-- 新增页面 -->
  <div class="maintain">
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @AddBody="AddBody"
          @ChooseInv="ChooseInv"
        ></ButtonViem>
      </div>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        :formObj="formObj"
        ref="headRef"
        :disabled="disabled"
        :dialogFormVisible="dialogFormVisible"
        :treeSelData="treeSelData"
        @RoleBut="RoleBut"
      ></Head-View>

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
      <!-- 表格区域 -->
      <myTable
        ref="TABRef"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
        :disabledHide="false"
      >
        <template #button>
          <el-table-column
            label="操作"
            fixed="right"
            width="160px"
            align="center"
          >
            <template #header>
              <span>操作</span>
            </template>
            <template #default="scope">
              <el-button
                type="primary"
                v-for="(item, i) in tableBut"
                :key="i"
                size="small"
                @click="clickTableBut(scope, item)"
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
      />
      <pop-model
        :dialogFormVisible="dialogFormVisible"
        :title="modelTitle"
        :modelCIncludeModelCode="modelCIncludeModelCode"
        :modelGridType="modelGridType"
        :modelGrid="modelGrid"
        @modelClose="modelClose"
        @clickHandAdd="clickHandAdd"
      ></pop-model>
      <!-- 弹窗 -->
      <Odialog
        :dialogFormVisible="ZZdialogFormVisible"
        :title="titleTwo"
        :objData="objData"
        :modeCode="objModeCode"
        :disabled="Mdisabled"
        :row="Mrow"
        @FmodelClose="modelClose"
        @FmodelTable="FmodelTable"
      ></Odialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onActivated, provide } from 'vue';
import myTable from '@/components/MyFormTable/index_Edit.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import Odialog from '@/components/DialogModel/index.vue';
import { compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElTableColumn
} from 'element-plus';
import PopModel from '@/components/PopModel/model.vue';
import { configApi, DataApi, ParamsApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import useStore from '@/store';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const modelCode = ref();
const row = ref();
const rowId = ref('') as any;
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
const tabVal = ref();
const tabValBol = ref(true);
const ZZdialogFormVisible = ref(false);
let TabPageVal = ref([]) as any;
const TABRef = ref();
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
let tableBut = ref([] as any[]);
const tableColumns = ref(dataVal);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
const Mdisabled = ref(false);
const titleTwo = ref('添加');
const objModeCode = ref('');
const objData = ref({}) as any;
const Mrow = ref({}) as any;
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  disabled: false,
  dialogFormVisible: false,
  modelTitle: '标题',
  modelCIncludeModelCode: '',
  treeSelData: [] as any
});
const {
  disabled,
  dialogFormVisible,
  modelTitle,
  modelCIncludeModelCode,
  treeSelData
} = toRefs(data);
let head = ref([]) as any;
const formObj = ref({}) as any;
const initType = ref(true);
onActivated(() => {
  tableData.value = [];
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formObj.value = JSON.parse(
    window.sessionStorage.getItem('InventoryProductComparison')
  );

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
  // if( rowId.value != Route.params.rowId){
  // }
  getAddUser(Route.meta.ModelCode);
  rowId.value = Route.params.rowId;
  initType.value = false;
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
// tabs 切换，调取对应Tab数据
const clickTabs = (val: any) => {
  tableColumns.value = [];
  total.value = 0;
  tableData.value = [];
  tabVal.value = val.props.name;
  getAddUser(tabVal.value);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.clearValidate();
};
//获取下拉框数据
const getComboBoxFun = async () => {
  await tableColumns.value.forEach(async (item: any, i: any) => {
    if (item.cControlTypeCode == 'ComboBox') {
      let obj = {};
      if (item.label == '单位') {
        // obj = { Conditions: "cDictonaryTypeCode=ArriveVouchcAccUnitCode" }
        obj = { Conditions: '' };
      } else {
        obj = { Conditions: 'cDictonaryTypeCode=' + item.cAttributeCode };
      }
      let data = {
        method: item.cHttpTypeCode,
        url: item.cServerIP + item.cUrl,
        params: obj
      };
      await ParamsApi(data).then((res: any) => {
        item.PullData = res.data || [];
      });
    }
  });
};
// table 数据整合
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  tableBut.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      if (item.IsShow) {
        let itemData = {
          checkType: true,
          label: item.cShowName ?? item.Resource.cAttributeName,
          prop: item.Resource.cAttributeCode,
          headerSlot: false,
          slot: '',
          edit: item.DefinedParm4,
          cControlTypeCode: item.cControlTypeCode,
          cIncludeModelCode: item.cIncludeModelCode,
          cHttpTypeCode: item.Resource.cHttpTypeCode,
          cServerIP: item.Resource.cServerIP,
          cUrl: item.Resource.cUrl,
          cAttributeCode: item.Resource.cAttributeCode
        };
        tableColumns.value.push(itemData);
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
      tableBut.value.push(item);
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
  // 获取下拉框数据
  getComboBoxFun();
};

//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      cConfigTypeCode: formObj.value.cConfigTypeCode,
      cProjectCode: formObj.value.cProjectCode,
      cResourceTypeCode: formObj.value.cResourceTypeCode
    }
  };
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await ParamsApi(data);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        item.state = '';
      });
      tableData.value = res.data;
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
//排序
const sortArr = (property: any) => {
  return function (a: any, b: any) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2; //正序
    // return value2 - value1; //倒叙
  };
};
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'DeleteBody':
      clickDelete(scope, event);
      break;
    default:
      break;
  }
};
//表格按钮删除
const clickDelete = (scope: any, obj: any) => {
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
      ElLoading.service({ lock: true, text: '加载中.....' });
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
        ElLoading.service().close();
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      });
      ElLoading.service().close();
    });
};
// table 按钮删除
const clickTableHandDel = (val: any) => {
  console.log('111');
  console.log(tableData.value, '---tableData.value');

  //调用子组件的 DelBtn方法
  TABRef.value.DelBtn(val.$index);
  tableData.value.splice(val.$index, 1);
};

const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  // total.value=total.value+1
};
const FmodelTable = (val: any) => {
  console.log(val.data, '---vvvdd');
  val.data.forEach((item: any, i: any) => {
    item.cResourceCode = item.cInvCode;
    item.cResourceName = item.cInvName;
  });
  tableData.value = [...tableData.value, ...val.data];
};
//添加t弹窗表格
const AddBody = async (obj: any) => {
  ZZdialogFormVisible.value = true;

  objData.value = obj;
  objModeCode.value = obj.cIncludeModelCode;
};
const ChooseInv = async (obj: any) => {
  ZZdialogFormVisible.value = true;

  objData.value = obj;
  objModeCode.value = obj.cIncludeModelCode;
};

// 添加
const clickAddConvert = (val: any) => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
  modelCIncludeModelCode.value = val.cIncludeModelCode;
};
const modelClose = (val: any) => {
  dialogFormVisible.value = val.type;
  ZZdialogFormVisible.value = val.type;
};
//新增保存
const SaveAdd = (obj: any) => {
  if (!TABRef.value.tableDataVal.length) {
    ElMessage({
      type: 'info',
      message: '请添加列表数据'
    });
    return false;
  }
  let list = [];
  list = TABRef.value.tableDataVal.filter((item: any) => {
    return item.cInvCode == '' || item.nQuantity == '';
  });
  if (list.length) {
    ElMessage({
      type: 'error',
      message: '编号/数量不能为空！'
    });
  } else {
    obj.pathName = 'InventoryProductComparison';
    obj.tableData = TABRef.value.tableDataVal;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj);
  }
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'InventoryProductComparison';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
  $bus.emit('TabTitleVal', { name: Route.name, title: '库存检验产品对照编辑' });
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

:deep(.el-table .cell) {
  // padding: 5px;
  .el-input-number .el-input__inner {
    width: 30px;
  }
}
</style>
