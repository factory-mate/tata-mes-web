<template>
  <!-- 原始订单详情 返修-->
  <div class="maintain">
    <!-- 按钮区域 -->
    <div style="display: flex">
      <ButtonViem
        :ToolBut="FirBut"
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
        @CancelSuspend="CancelSuspend"
        @ExportDetails="ExportDetails"
        @Splitting="Splitting"
        @cDefindParm07="clickDefindParm07"
        @ManualSplitting="ManualSplitting"
        @ManualReview="ManualReview"
        @closeCancel="closeCancel"
      >
      </ButtonViem>
      <div
        style="margin: 0 10px"
        v-if="
          tabVal == 'MES.Productvouch_infor.M.List' ||
          tabVal == 'MES.PRODUCTVOUCH.M.View.Base'
        "
      >
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
          @CancelSuspend="CancelSuspend"
          @ExportDetails="ExportDetails"
          @Splitting="Splitting"
          @cDefindParm07="clickDefindParm07"
          @closeCancel="closeCancel"
        >
        </ButtonViem>
      </div>
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
      <div v-show="tableColumns.length" class="repairTab">
        <myTable
          v-if="tabVal == 'MES.PRODUCTVOUCH_InternalRepair.M.List'"
          ref="tabRefs_1"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="true"
          :tableHB="tableHB"
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
              <template
                #default="scope"
                v-if="tabVal != 'MES.PRODUCTVOUCH_InternalRepair.M.List'"
              >
                <el-button
                  type="primary"
                  :disabled="disabled"
                  size="small"
                  @click="clickTableHandDel(scope)"
                  >删除</el-button
                >
              </template>
              <template #default="scope" v-else>
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
        <myAutoTable
          v-else
          ref="tabRefs"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="true"
          :tableHB="tableHB"
          :tableHeight="600"
          @handleSelectionChange="handleSelectionChange"
          @TabCelClick="TabCelClick"
        >
          <template #button>
            <el-table-column
              label="操作"
              fixed="right"
              width="70px"
              align="center"
              class="buttColum"
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
                    class="buttSty"
                    @click="clickTableBut(scope, item)"
                  >
                    {{ item.Resource.cAttributeName }}
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </template>
        </myAutoTable>
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
    <el-dialog v-model="dialogVisibleImg" title="图片" width="50%">
      <div class="demo-image__preview">
        <el-image
          style="width: 100%; height: 100%"
          :src="ImgList.length ? ImgList[0] : ''"
          :zoom-rate="1.2"
          :preview-src-list="ImgList"
          :initial-index="4"
          :lazy="true"
          :infinite="true"
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisibleImg = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="uploadTc">
      <el-dialog
        v-model="dialogVisible"
        title="上传文件"
        width="30%"
        center
        draggable
      >
        <el-upload
          v-model:file-list="fileList"
          class="fileSty"
          ref="uploadRef"
          :multiple="false"
          :data="{ uid: [itemss_UID], bCover: cover }"
          :show-file-list="false"
          :action="action"
          :headers="headers"
          :limit="1"
          :on-success="SuccessFun"
        >
          <el-button class="uploadBtn" type="primary" size="small">
            上传文件
          </el-button>
        </el-upload>
      </el-dialog>
    </div>
    <!-- 显示预览图片 -->
    <ImgPreview v-model="imgIshow" :imgs="srcList" />
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated } from 'vue';
import myAutoTable from '@/components/MyFormTable/index_auto.vue';
import myTable from '@/components/MyFormTable/index.vue';
import { ElLoading } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
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
  ExportApi
} from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import ImgPreview from '@/components/ImgPrive/index.vue'; //图片预览
import type { UploadInstance, UploadUserFile } from 'element-plus';
import { useRoute } from 'vue-router';
import { compare } from '@/utils';
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
const tabVal = ref();
const tabValBol = ref(true);
const rowId = ref('') as any;
const headRef = ref(null);
let But = ref([]) as any;
const FirBut = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
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
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
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
    if (window.sessionStorage.getItem('RepairUID') || '') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.sessionStorage.clear('RepairUID');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    if (row.value !== JSON.parse(history.state.row)) {
      tabVal.value = 'MES.PRODUCTVOUCH.M.View.Base';
      getAddUser(tabVal.value);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
    rowVal.value = JSON.parse(history.state.row);
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Route.meta.title.match(/详情/gi)) {
    disabled.value = true;
  }
});
// tabs 切换，调取对应Tab数据
const clickTabs = (val: any) => {
  head.value = [];
  tableColumns.value = [];
  total.value = 0;
  tableData.value = [];
  if (val.props.label == '产品信息') {
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
          if (item.cModelCode == 'MES.PRODUCTVOUCH.M.View') {
            FirBut.value = item[import.meta.env.VITE_APP_key].sort(
              compare('iIndex', true)
            );
          } else {
            But.value = item[import.meta.env.VITE_APP_key].sort(
              compare('iIndex', true)
            );
          }
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
  tableData.value = [];
  tableButton.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.Resource.cAttributeName,
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
      let itemData = {
        checkType: true,
        label: '操作',
        slotName: 'button',
        DefinedParm2: true,
        prop: 'button'
      };
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
  let params = {};
  if (tabVal.value == 'MES.PRODUCTVOUCH_CancellationOrder.M.List') {
    //取消单
    // cVouchTypeCode =6 && cSourceCode = P23000727073 || cVouchTypeCode =9&& cSourceCode = P23000727073
    // params={Conditions:'cVouchTypeCode in (6,7) && cSourceCode = '+rowVal.value.cCode}
    params = {
      Conditions:
        'cVouchTypeCode =6 && cSourceCode = ' +
        rowVal.value.cCode +
        '||' +
        'cVouchTypeCode =9 && cSourceCode = ' +
        rowVal.value.cCode
    };
  } else if (tabVal.value == 'MES.PRODUCTVOUCH_ChangeOrder.M.List') {
    //变更单
    params = {
      Conditions:
        'cVouchTypeCode in (8,7) && cSourceCode = ' + rowVal.value.cCode
    };
  } else if (tabVal.value == 'MES.PRODUCTVOUCH_LLOW.M.List') {
    //审批日志
    params = {
      OrderByFileds: 'utfs asc',
      Conditions: `Mid = ${RepairUID.value ? RepairUID.value : row.value.UID}`
    };
    // params={Conditions:'Mid = '+ RepairUID.value?RepairUID.value:row.value.UID,OrderByFileds:"utfs asc"}
  } else if (tabVal.value == 'MES.PRODUCTVOUCH_RepairOrder.M.List') {
    //返修单
    params = {
      Conditions:
        'cVouchTypeCode in (1,4,5) && cSourceCode = ' + rowVal.value.cCode,
      OrderByFileds: 'dDate desc'
    };
  } else if (tabVal.value == 'MES.PRODUCTVOUCH_InternalRepair.M.List') {
    //内返记录
    params = { Conditions: 'cSourceCode = ' + rowVal.value.cCode };
  } else if (tabVal.value == 'MES.PACKAGE_VOUCH.M.List') {
    //分包信息
    params = {
      val: RepairUID.value ? RepairUID.value : row.value.UID,
      Conditions: 'cDefindParm01 = 是 '
    };
  } else if (tabVal.value == 'MES.Original_PACKAGE_VOUCH.M.List') {
    //原分包信息
    params = {
      val: RepairUID.value ? RepairUID.value : row.value.UID,
      Conditions: 'cDefindParm01 = 否 '
    };
  } else {
    params = { val: RepairUID.value ? RepairUID.value : row.value.UID };
  }

  let dataVal = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: params
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  ParamsApi(dataVal).then((res: any) => {
    if (!res.data) {
      return false;
    }
    if (tabVal.value == 'MES.Productvouch_infor.M.List') {
      let obj = res.data[0];
      res.data.forEach((item: any, i: any) => {
        for (let key in obj) {
          item[key] = item[key] ? item[key] : ' ';
        }
      });
      tableData.value = res.data;
    } else {
      tableData.value = res.data;
    }
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
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'fileImg':
      clickcAttributeCode(scope, event);
      break;
    case 'UpLoad':
      UpLoad(scope, event);
      break;
    case 'DownLoad':
      DownLoad(scope, event);
      break;
    default:
      break;
  }
};

const clickDefindParm07 = (obj: any) => {
  if (tabVal.value == 'MES.PRODUCTVOUCH.M.View.Base') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.downFile(obj.cAttributeCode);
  }
};
// 按钮详情
const clickView = (scope: any, event: any) => {
  console.log(scope.row, event, '详情');

  if (tabVal.value == 'MES.PRODUCTVOUCH_RepairOrder.M.List') {
    console.log(scope.row.cModelCode, '返修单-----');
    tabVal.value = 'MES.PRODUCTVOUCH.M.View.Base';
    getAddUser(scope.row.cModelCode);
    window.sessionStorage.setItem('RepairUID', scope.row.UID);
    RepairUID.value = scope.row.UID;
  }
};
const clickcAttributeCode = (scope: string, event: any) => {
  ImgList.value = [];
  dialogVisibleImg.value = true;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ImgList.value = scope.row.file || [];
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
  head.value = [];
  tableColumns.value = [];
  total.value = 0;
  tableData.value = [];
  But.value = [];
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
  obj.pathName = 'originalOrder';
  obj.tableData = tableData.value;
  obj.tabVal = tabVal.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
//基础信息保存  修改
const SaveEditBase = (obj: any) => {
  obj.pathName = 'originalOrder';
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
    obj.pathName = 'originalOrder';
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
    obj.pathName = 'originalOrder';
    obj.tableData = tableData.value;
    obj.tabVal = tabVal.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-undef
    router.push({ name: 'originalOrder' });
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
    obj.pathName = 'originalOrder';
    obj.tableData = tableData.value;
    obj.tabVal = tabVal.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj);
  }
};
// 拆单
const Splitting = (obj: any) => {
  console.log(obj, '拆单运算');
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // "cProjectCode":'',
      forList: {
        PageIndex: 1,
        Pagesize: 10,
        OrderByFileds: '',
        Conditions: ''
      },
      bIsSearch: false,
      iDs: [row.value.UID]
    }
  };
  ElMessageBox.confirm('确定拆单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '拆单成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '拆单失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消拆单'
      });
    });
};
// 手动拆单
const ManualSplitting = (obj: any) => {
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      iDs: [row.value.UID]
    }
  };
  ElMessageBox.confirm('确定拆单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '拆单成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '拆单失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消拆单'
      });
    });
};
const seleData = ref([]) as any;
const sendId = ref([]) as any;
const tabRefs = ref(null) as any;
const handleSelectionChange = (val: any) => {
  console.log(val, '---sel');
  seleData.value = val;
};
const closeCancel = (obj: any) => {
  sendId.value = [];
  seleData.value.forEach((item: any) => {
    sendId.value.push(item.Items_UID);
  });
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要取消的数据'
    });
    return false;
  }
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  DataApi(dataVal).then(res => {
    if (res.status == 200) {
      ElMessage({
        type: 'success',
        message: res.msg || '取消成功'
      });
      tabRefs.value.handleRemoveSelectionChange();
      // tableAxios()
    } else {
      ElMessage({
        type: 'error',
        message: res.msg || '取消失败'
      });
    }
  });
};
//系统审单
const SysReview = (obj: any) => {
  console.log(obj, '系统审单----');
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // "cProjectCode":'',
      forList: {
        PageIndex: 0,
        Pagesize: 0,
        OrderByFileds: '',
        Conditions: ''
      },
      bIsSearch: false,
      iDs: [row.value.UID]
    }
  };
  ElMessageBox.confirm('确定审单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '审单成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '审单失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消审单'
      });
    });
};
//手动审单
const ManualReview = (obj: any) => {
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      iDs: [row.value.UID]
    }
  };
  ElMessageBox.confirm('确定审单?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '审单成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '审单失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消审单'
      });
    });
};
//通过
const Adopt = (obj: any) => {
  console.log(obj, '通过----');
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // "cProjectCode":'',
      forList: {
        PageIndex: 0,
        Pagesize: 0,
        OrderByFileds: '',
        Conditions: ''
      },
      bIsSearch: false,
      iDs: [row.value.UID],
      iStatus: row.value.iStatus
    }
  };
  ElMessageBox.confirm('确定通过?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '通过成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '通过失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消通过'
      });
    });
};
//挂起
const Suspend = (obj: any) => {
  console.log(obj, '挂起----');
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      cProjectCode: '',
      iType: 1,
      iDs: [row.value.UID]
    }
  };
  ElMessageBox.confirm('确定挂起?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '挂起成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '挂起失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消挂起'
      });
    });
};
//取消挂起
const CancelSuspend = (obj: any) => {
  console.log(obj, '挂起----');
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      cProjectCode: '',
      iType: 0,
      iDs: [row.value.UID]
    }
  };
  ElMessageBox.confirm('确定挂起?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      DataApi(dataVal).then(res => {
        if (res.status == 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '挂起成功'
          });
          tabRefs.value.handleRemoveSelectionChange();
          // tableAxios()
        } else {
          ElMessage({
            type: 'error',
            message: res.msg || '挂起失败'
          });
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消挂起'
      });
    });
};
//上传
const itemss_UID = ref('');
const action = ref('');
const UpLoad = (scope: any, obj: any) => {
  action.value =
    obj.Resource.cServerIP + obj.Resource.cUrl + '?uid=' + scope.row.Itemss_UID;
  itemss_UID.value = scope.row.Itemss_UID;
  let dataVal = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      file: '',
      bCover: false
    },
    params: {
      uid: itemss_UID.value
    }
  };
  DataApi(dataVal)
    .then(res => {
      cover.value = false;
      dialogVisible.value = true;
    })
    .catch(err => {
      ElMessageBox.confirm('改数据已绑定文件,确定覆盖文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          cover.value = true;
          dialogVisible.value = true;
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消覆盖'
          });
        });
    });
};

//上传
let uploadObj = ref({}) as any;
const funAction = (obj: any) => {
  cover.value = false;
  uploadObj.value = obj;
  let http = obj.Resource.cServerIP + obj.Resource.cUrl;
  return http;
};

const SuccessFun = (response: any, uploadFile: any, uploadFiles: any) => {
  fileList.value = uploadFiles;
  if (response.status == 200) {
    fileList.value = [];
    dialogVisible.value = false;
    ElMessage({
      message: '上传成功！',
      type: 'success'
    });
  } else {
    ElMessage({
      message: '失败',
      type: 'error'
    });
  }
};
//下载
const DownLoad = (scope: any, event: any) => {
  itemss_UID.value = scope.row.Itemss_UID;
  clickDonwnFile(event);
};

let url = ref('');
const srcList = ref([]) as any;
// 下载（文件下载/查看图片）
const clickDonwnFile = (item: any) => {
  srcList.value = [];
  let obj = {
    val: itemss_UID.value
  };
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    params: obj
  };
  ParamsApi(data).then(res => {
    if (res.status == 200) {
      if (
        res.data[0].cFileSuffix == '.jpg' ||
        res.data[0].cFileSuffix == '.png'
      ) {
        imgIshow.value = true;
        url.value =
          res.data[0].cFilePath +
          res.data[0].cFileReName +
          res.data[0].cFileSuffix;
        srcList.value.push(url.value);
      } else {
        let src =
          res.data[0].cFilePath +
          res.data[0].cFileReName +
          res.data[0].cFileSuffix;
        window.location.href = src;
      }
    } else {
      console.log('请求出错');
    }
  });
};
const downloadFile = (url: any) => {
  fetch(url) //使用fetch函数发送一个GET请求到指定的URL，获取文件的响应对象。
    .then(response => response.blob()) //通过.then方法链，将响应对象转换为Blob数据（文件的二进制数据）。
    .then(blob => {
      //再次使用.then方法链，处理获取到的Blob数据。
      const link = document.createElement('a'); //使用document.createElement创建一个<a>节点。
      link.href = URL.createObjectURL(blob); //通过URL.createObjectURL方法，将Blob数据转换成URL对象，然后将该URL赋值给link的href属性。这一步相当于生成了一个临时URL，供下载使用。
      link.download = 'xx.jpg'; // 替换为你要保存的文件名和扩展名(设置用户下载文件时使用的文件名和扩展名)
      link.click(); //调用click方法模拟用户点击链接，从而触发浏览器的文件下载行为。

      URL.revokeObjectURL(link.href); // 释放URL对象资源(使用URL.revokeObjectURL方法释放之前创建的URL对象资源，避免内存泄漏)
    })
    .catch(error => {
      console.error('下载失败:', error);
    });
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
const RepairUID = ref('');

//返修单详情-->主单信息(点击单元格)
const TabCelClick = (val: any) => {
  if (tabVal.value == 'MES.PRODUCTVOUCH_RepairOrder.M.List') {
    console.log(val.cModelCode, '返修单-----');
    tabVal.value = 'MES.PRODUCTVOUCH.M.View.Base';
    getAddUser(val.cModelCode);
    window.sessionStorage.setItem('RepairUID', val.UID);
    RepairUID.value = val.UID;
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
