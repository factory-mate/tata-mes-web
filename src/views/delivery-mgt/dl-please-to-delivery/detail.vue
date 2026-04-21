<template>
  <!-- 编辑页面 -->
  <div class="maintain">
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          :ToolBut="But"
          @Edit="clickEdit"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @check="clickCheck"
          @del="clickDelete"
          @un-check="clickUnCheck"
          @Pick="clickPick"
          @UnPick="clickUnPick"
        ></ButtonViem>
      </div>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
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
        :disabled-hide="false"
        @handle-selection-change="handleSelectionChange"
      >
      </myTable>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
      />
      <div>
        <el-dialog
          v-model="TdialogFormVisible"
          title="添加"
          draggable
          :modal="false"
          :close-on-click-modal="false"
          width="98%"
        >
          <!-- 搜索区域 -->

          <FilterForm
            :Filter="TFilter"
            @ClickSearch="TClickSearch"
            @resetForm="TresetForm"
          ></FilterForm>

          <myTable
            ref="TTABRef"
            :tableData="TtableData"
            :tableColumns="TtableColumns"
            :tableBorder="true"
            :selection="true"
            :EditType="EditType"
            @handleSelectionChange="ThandleSelectionChange"
            :disabledHide="false"
            max-height="52vh"
            custom-width
            :show-index="false"
          >
            <template #button>
              <!-- <el-table-column
                label="操作"
                fixed="right"
                width="80px"
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
                    @click="handleClose(scope)"
                  >
                    关闭
                  </el-button>
                </template>
              </el-table-column> -->
            </template>
          </myTable>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="TdialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="Tconfirm"> 确认 </el-button>
            </span>
          </template>
          <pagination
            v-if="total > 0"
            :total="total"
            v-model:page="queryParams.PageIndex"
            v-model:limit="queryParams.PageSize"
            @pagination="changPage"
          />
        </el-dialog>
      </div>

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
import { ref, toRefs, reactive, onActivated, watch } from 'vue';
import myTable from '@/components/MyFormTable/index_Edit.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import { compare, filterModel, tableSortInit } from '@/utils';
import {
  ElButton,
  ElCard,
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElTableColumn
} from 'element-plus';
import PopModel from '@/components/PopModel/model.vue';
import {
  buttonConfigApi,
  configApi,
  DataApi,
  ParamsApi
} from '@/api/configApi/index';
import { useRoute, useRouter } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import useStore from '@/store';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const modelCode = ref();
const router = useRouter();
const row = ref();
const rowId = ref('') as any;
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
const tabVal = ref();
const tabValBol = ref(true);
let TabPageVal = ref([]) as any;
const TABRef = ref();
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
const TdialogFormVisible = ref();
const TAxiosData = ref({}) as any;
const TtableData = ref([]) as any;
const TtableColumns = ref([]) as any;
const EditType = ref(false);
const TTABRef = ref();
const selectedItems = ref([]) as any;

const TFilter = ref([]) as any;
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
  treeSelData,
  Conditions,
  OrderByFileds
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
  // getAddUser(Route.meta.ModelCode)
  // if(initType.value){
  //     getAddUser(Route.meta.ModelCode)
  // }
  // if (rowId.value != Route.params.rowId) {
  //   getAddUser(Route.meta.ModelCode);
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

watch(
  () => headRef.value?.ruleForm.iStatus,
  iStatus => {
    if (typeof iStatus === 'number' && !But.value.length) {
      buttonConfigApi(Route.meta.ModelCode, { iStatus }).then(res => {
        console.log(res);
        if (res.data?.[import.meta.env.VITE_APP_key].length > 0) {
          But.value = res.data?.[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
      });
    }
  }
);
watch(
  () => headRef.value?.ruleForm?.Items,
  newVal => {
    tableData.value = newVal;
  }
);

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
  But.value = [];
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
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      if (item.IsShow) {
        let itemData = {
          checkType: true,
          label: item.cShowName ?? item.Resource.cAttributeName,
          prop: item.Resource.cAttributeCode,
          headerSlot: false,
          slot: '',
          edit: true,
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
  if (!rowId.value) {
    return false;
  }
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      val: rowId.value
    }
  };
  try {
    const res = await ParamsApi(data);
    if (res.status == 200) {
      tableData.value = res.data;
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
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

// table 按钮删除
const clickTableHandDel = (val: any) => {
  //调用子组件的 DelBtn方法
  tableData.value.splice(val.$index, 1);
};

const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  // total.value=total.value+1
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
//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'resizeDial';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'resizeDial';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  console.log(obj);
  router.push({
    name: 'RDRecordOutEdit',
    params: {
      t: Date.now(),
      rowId: rowId.value
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(row.value),
      pathName: 'RDRecordOut',
      title: '出库单编辑'
    }
  });
  // getAddUser(obj.cIncludeModelCode);
  // disabled.value = false;
  // $bus.emit('TabTitleVal', { name: Route.name, title: '采购申请单编辑' });
};
const TToolBut = ref([]) as any;

const clickPick = async obj => {
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
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          TToolBut.value = item[import.meta.env.VITE_APP_key]?.[0] ?? {};
        }
      });
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
};

const itemData = ref([]) as any;

const handleSelectionChange = (val: any) => {
  selectedItems.value = val;
};

//弹窗表格选中
const ThandleSelectionChange = (val: any) => {
  itemData.value = val;
};

//弹窗确认
const Tconfirm = () => {
  console.log(TToolBut.value);
  if (!itemData.value.length) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }
  DataApi({
    method: TToolBut.value.cHttpTypeCode,
    url: `${TToolBut.value.cServerIP}${TToolBut.value.cUrl}`,
    data: {
      UID: rowId.value,
      Items: (itemData.value ?? []).map((item: any) => item.UIDs)
    }
  })
    .then((res: any) => {
      if (res?.success) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
        TdialogFormVisible.value = false;
      }
    })
    .finally(() => {
      TTABRef.value.handleRemoveSelectionChange();
      itemData.value = [];
      tableFilter();
      headRef.value.funHeadview();
    });
};

const tableFilter = () => {
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
    // if (item.Resource.cAttributeTypeCode == 'method') {
    //   closeBtnConfig.value = item;
    //   console.log(closeBtnConfig.value);
    // }
  });
};

const TClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  TtableAxios();
};
const TresetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  TtableAxios();
  TTABRef.value.clearFilter();
};

const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  TtableAxios();
};

//表格数据查询
const TtableAxios = async () => {
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
      // TtableData.value = res.data.data;
      TtableData.value = res.data;
      total.value = res.data.dataCount;
      Ttablefilter();
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};

const Ttablefilter = () => {
  TtableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    TtableData.value.forEach((bItem: any) => {
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

const clickUnPick = obj => {
  if (!selectedItems.value.length) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }
  ElMessageBox.confirm('确定要挑出吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let url = `${obj.Resource.cServerIP}${obj.Resource.cUrl}?`;
    url += selectedItems.value
      .map((item: any) => `Items=${item.UIDs}`)
      .join('&');

    const data = {
      method: obj.Resource.cHttpTypeCode,
      url
      // data: {
      //   UID: rowId.value,
      //   Items: selectedItems.value.map((item: any) => item.UID)
      // }
    };
    DataApi(data)
      .then((res: any) => {
        if (res?.success) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          });
        }
      })
      .finally(() => {
        selectedItems.value = [];
        tableFilter();
        headRef.value.funHeadview();
      });
  });
};

const clickCheck = (obj: any) => {
  console.log(obj);
  const data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: { UID: rowId.value }
  };
  ElMessageBox.confirm('确定操作数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const loading = ElLoading.service({ lock: true, text: '加载中.....' });
    DataApi(data)
      .then(res => {
        if (res?.success) {
          ElMessage({
            type: 'success',
            message: '操作成功'
          });
          getAddUser(Route.meta.ModelCode);
        } else {
          ElMessage.error('操作失败');
        }
      })
      .finally(() => {
        loading.close();
      });
  });
};

const clickUnCheck = (obj: any) => {
  console.log(obj);
  const data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: { UID: rowId.value, utf: headRef.value.ruleForm.utfs }
  };
  ElMessageBox.confirm('确定弃审数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const loading = ElLoading.service({ lock: true, text: '加载中.....' });
    DataApi(data)
      .then(res => {
        if (res?.success) {
          ElMessage({
            type: 'success',
            message: '弃审成功'
          });
          getAddUser(Route.meta.ModelCode);
        } else {
          ElMessage.error('弃审失败');
        }
      })
      .finally(() => {
        loading.close();
      });
  });
};

const clickDelete = (obj: any) => {
  console.log(obj);
  const data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: { UID: rowId.value }
  };
  ElMessageBox.confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const loading = ElLoading.service({ lock: true, text: '加载中.....' });
    DataApi(data)
      .then(res => {
        console.log(res);
        if (res?.success) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          });
          router.push({
            name: 'RDRecordOut',
            params: { t: Date.now() },
            state: { modelCode: modelCode.value, title: '出库单列表' }
          });
          closeSelectedTag(Route);
        } else {
          ElMessage.error('删除失败');
        }
      })
      .finally(() => {
        loading.close();
      });
  });
};

const closeSelectedTag = (view: any) => {
  tagsView.delVisitedView(view).then((res: any) => {
    console.log(res, '--res');
    // if (isActive(view)) {
    //     toLastView(res.visitedViews, view);
    // }
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

:deep(.el-table .cell) {
  // padding: 5px;
  .el-input-number .el-input__inner {
    width: 30px;
  }
}
</style>
