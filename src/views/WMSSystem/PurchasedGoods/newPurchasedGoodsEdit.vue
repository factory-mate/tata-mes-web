<template>
  <!--到货单编辑新增页面 -->
  <div class="maintain">
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          :ToolBut="ButOne"
          :printDis="printDis"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @ItemAdd="ItemAdd"
          @Commit="Commit"
          @PrintLabel="PrintLabel"
        >
        </ButtonViem>
      </div>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="disabled"
        :dialogFormVisible="dialogFormVisible"
        :treeSelData="treeSelData"
        @clickView="clickView"
        @BtnDAel="BtnDAel"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 打印 ------------->
      <div class="DY" id="printMe">
        <div
          v-for="(item, i) in printData"
          :key="i"
          style="width: 100%; height: 100%"
        >
          <div class="DY-Text">
            <div class="Te-con">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="grid-content ep-bg-purple">
                    物料编码: {{ item.cInvCode }}
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="grid-content ep-bg-purple">
                    数量：{{ item.iDefindParm13 }}{{ item.cDefindParm06 }}
                  </div>
                </el-col>
                <el-col :span="21">
                  <div class="grid-content ep-bg-purple">
                    物料名称：{{ item.cInvName }}
                  </div>
                </el-col>
                <el-col :span="2" style="position: relative">
                  <!-- 二维码 -->
                  <div style="position: absolute; top: 0; right: 0">
                    <div
                      style="
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                      "
                    >
                      <div>
                        <qrcode-vue
                          :value="item.cQRCode"
                          :size="55"
                        ></qrcode-vue>
                      </div>
                      <div style="margin-top: 8px">{{ item.cQRCode }}</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <div>物料规格: {{ item.cDefindParm03 }}</div>
              <div>批次号: {{ item.cDefindParm01 }}</div>
              <div>生产日期: {{ item.cDefindParm04 }}</div>
              <div>采购订单号: {{ item.cSourceCode }}</div>
              <div>供应商: {{ item.cVendorName }}</div>
              <div style="margin-bottom: 20px">
                供应商批号: {{ item.cVendorBatch }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 打印 -------------->
      <div style="float: right">
        <ButtonViem :ToolBut="Buttwo" @ItemAdd="ItemAdd"></ButtonViem>
      </div>
      <myTable
        ref="TABRef"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
        :EditType="EditType"
        @handleSelectionChange="handleSelectionChange"
        :disabled="disa"
        :disabledHide="false"
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
      <!-- <pagination v-if="total > 0" :total="total" v-model:page="queryParams.PageIndex"
                v-model:limit="queryParams.PageSize" /> -->
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
        :Filter="Filter"
        @ClickSearch="ClickSearch"
        @resetForm="resetForm"
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
      >
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
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onActivated, watch } from 'vue';
import myTable from '@/components/MyFormTable/index_Edit.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import { compare, filterModel, tableSortInit } from '@/utils';
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
import { useRoute } from 'vue-router';
//引入二维码
import QrcodeVue from 'qrcode.vue';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import useStore from '@/store';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const TABRef = ref();
const printDis = ref(true);
const TTABRef = ref();
const modelCode = ref();
const row = ref();
const rowId = ref('') as any;
const Route = useRoute();
let Filter = ref([]) as any;
const headRef = ref(null);
let ButOne = ref([]) as any;
const But = ref([]) as any;
const Buttwo = ref([]) as any;
const EditType = ref(false);
//弹窗数据
const TdialogFormVisible = ref();
const TAxiosData = ref({}) as any;
const TtableData = ref([]) as any;
const TtableColumns = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
const disa = ref(false);
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const selectArr = ref([]) as any;
const printData = ref([]) as any;
const modelGridType = ref(true);
const View1val = ref('');
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 10
});
//打印参数
const frame = ref(null);
const printDiv = ref(null);
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
//监听勾选，控制打印按钮
watch(
  selectArr,
  (v: any) => {
    if (v.length) {
      printData.value = [];
      printajax();
      printDis.value = false;
    } else {
      printDis.value = true;
    }
  },
  { deep: true }
);
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
  if (history.state.title == '到货单详情') {
    disabled.value = true;
  }
});
const clickView = (val: any) => {
  rowId.value = val.val;
  disabled.value = true;
  getAddUser(View1val.value);
  $bus.emit('TabTitleVal', { name: Route.name, title: '到货单详情' });
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
          ButOne.value = item[import.meta.env.VITE_APP_key].filter(
            (item: any) => item.Resource.cAttributeName !== '添加'
          );
          Buttwo.value = item[import.meta.env.VITE_APP_key].filter(
            (item: any) => item.Resource.cAttributeName == '添加'
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
          label: item.Resource.cAttributeName,
          prop: item.Resource.cAttributeCode,
          edit: item.DefinedParm4,
          cServerIP: item.Resource.cServerIP,
          cUrl: item.Resource.cUrl,
          cHttpTypeCode: item.Resource.cHttpTypeCode,
          cControlTypeCode: item.cControlTypeCode,
          cAttributeCode: item.Resource.cAttributeCode,
          headerSlot: false,
          slot: ''
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
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await ParamsApi(data);
    if (res.status == 200) {
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
// 搜索
const ClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  TtableAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 10;
  TtableAxios();
  TTABRef.value.clearFilter();
};
// table 按钮 集合
const clickTableHandDel = (val: any) => {
  tableData.value.splice(val.$index, 1);
};

const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  // total.value=total.value+1
};
//添加t弹窗表格
const ItemAdd = async (obj: any) => {
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
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
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
// TTTtable 数据整合
const funTables = (arr: Array<any>) => {
  modelGrid.value = arr;
  arr.forEach(item => {
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

//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  TtableAxios();
};

const itemData = ref([]) as any;
//弹窗表格选中
const ThandleSelectionChange = (val: any) => {
  itemData.value = val;
};
//弹窗确认
const Tconfirm = () => {
  TdialogFormVisible.value = false;
  // 表格添加数据
  itemData.value.forEach((item: any) => {
    tableData.value.push(item);
  });
  TTABRef.value.handleRemoveSelectionChange();
};

// 添加弹窗form
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
  View1val.value = obj.cIncludeModelCode;
  obj.pathName = 'newPurchasedGoods';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
  disa.value = true;
};
//打印显示一个按钮
const BtnDAel = (v: any) => {
  if (v > 0) {
    But.value = But.value.filter(
      (item: { Resource: { cAttributeName: string } }) =>
        item.Resource.cAttributeName == '打印标签'
    );
  }
};
//提交
const Commit = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [rowId.value]
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '提交成功'
      });
      // tableAxios()
      // TabRef.value.handleRemoveSelectionChange()
      // sendId.value = []
    } else {
      console.log('提交失败');
    }
  });
  console.log(obj, '提交');
};

const DYUID = ref([]) as any;
//表格多选
const handleSelectionChange = (v: any) => {
  selectArr.value = v;
  DYUID.value = [];
  v.forEach((item: { UID: any }) => DYUID.value.push(item.UID));
  //多选去重
  DYUID.value = DYUID.value.filter(
    (i: any, index: any) => DYUID.value.indexOf(i) === index
  );
};

// 打印数据
const printajax = () => {
  if (DYUID.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请选择打印数据'
    });
    return false;
  }
  let data = {
    method: 'post',
    url: import.meta.env.VITE_APP_DY_API + '/api/ArriveVouch/PrintItemsLabel',
    data: DYUID.value
  };
  // let data = {
  //     method: obj.Resource.cHttpTypeCode,
  //     url: obj.Resource.cServerIP + obj.Resource.cUrl,
  //     data: DYUID.value
  // }
  DataApi(data).then(res => {
    if (res.status == 200) {
      if (res.data.length == 0) {
        ElMessage({
          type: 'info',
          message: '暂无数据需要打印'
        });
      }
      printData.value = res.data;
    } else {
      console.log('失败');
    }
  });
};

//打印标签
const PrintLabel = (obj: any, v: any) => {
  setTimeout(() => {
    var printIframe = frame.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    var html = printDiv?.value?.innerHTML;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    printIframe.setAttribute('srcdoc', html);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    printIframe.onload = function () {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(printIframe.contentWindow);
      // 去掉iframe里面的dom的body的padding margin的默认数值
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      printIframe.contentWindow.document.body.style.padding = '0px';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      printIframe.contentWindow.document.body.style.margin = '0px';
      // 开始打印
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      printIframe.contentWindow.focus();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      printIframe.contentWindow.print();
    };
  }, 100);
};

//修改保存
const SaveEdit = (obj: any) => {
  View1val.value = obj.cIncludeModelCode;
  obj.pathName = 'PurchasedGoods';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
  disa.value = true;
};
// 编辑按钮
const clickEdit = (obj: any) => {
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
  disa.value = false;
  $bus.emit('TabTitleVal', { name: Route.name, title: '到货单编辑' });
};
</script>

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;

  .DY {
    background: #fff;
    width: 320px;
    height: 200px;
    border: 1px solid black;
    font-size: 14px;
    display: none;
    .js_barcode {
      height: 40%;

      .imgs {
        padding-top: 10px;
        padding-left: 10px;
      }
    }

    :deep(.el-col-12) {
      margin: 10px 0;
    }

    .DY-Text {
      height: 60%;

      .Te-con {
        padding: 10px;
      }
      .Qrcode {
        margin-left: 30px;
      }
    }
  }

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
