<template>
  <!-- 设备新增 -->
  <div class="maintain">
    <!-- 按钮区域 -->
    <div style="display: flex">
      <ButtonViem :ToolBut="But" @SaveAdd="SaveAdd" @clickAdd="clickAdd">
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
          ref="TabRef"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="true"
          @tableHearData="tableHearData"
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
          <FilterForm
            :Filter="TFilter"
            @ClickSearch="TClickSearch"
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
        <pagination
          v-if="total > 0"
          :total="total"
          v-model:page="queryParams.PageIndex"
          v-model:limit="queryParams.PageSize"
          @pagination="TchangPage"
        />
      </el-dialog>
    </div>
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="ZZtitle"
      :objData="objData"
      :modeCode="objModeCode"
      :disabled="disabled"
      :Trow="Trow"
      @FmodelClose="modelClose"
    ></Odialog>
    <!-- 显示预览图片 -->
    <ImgPreview v-model="imgIshow" :imgs="srcList" />
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
import { compare, filterModel, tableSortInit, tableSortModel } from '@/utils';
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
const Trow = ref({});
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
  SessionDevCode.value = JSON.parse(
    window.sessionStorage.getItem('DeviceData')
  );
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
const tableHearData = (val: any) => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  tableAxios();
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
      ftotal.value = 0;
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
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: row.value
        ? `cDeviceCode=${rowVal.value.cDeviceCode}`
        : `cDeviceCode=${codess.value}`
    }
  };
  DataApi(dataVal).then((res: any) => {
    if (!res.data) {
      return false;
    }
    tableData.value = res.data.data;
    ftotal.value = res.data.dataCount;
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
    case 'fileImg':
      clickcAttributeCode(scope, event);
      break;
    case 'UpLoad':
      UpLoad(scope, event);
      break;
    case 'DownLoad':
      DownLoad(scope, event);
      break;
    case 'CheckProject':
      CheckProjec(scope, event);
      break;
    case 'Delete':
      Delete(scope, event);
      break;
    case 'CheckPerson':
      CheckPerson(scope, event);
      break;
    case 'Edit':
      ClickEdit(scope, event);
      break;
    case 'CheckPart':
      CheckPart(scope, event);
      break;
    case 'CheckFile':
      CheckFile(scope, event);
      break;
    default:
      break;
  }
};
const clickcAttributeCode = (scope: string, event: any) => {
  ImgList.value = [];
  dialogVisibleImg.value = true;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ImgList.value = scope.row.file || [];
};
//基础信息保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'EditDevice';
  obj.tableData = tableData.value;
  obj.tabVal = tabVal.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 添加
const clickAdd = async (obj: any) => {
  TFilter.value = [];
  TBut.value = [];
  if (obj.cAttributeName == '添加项目') {
    disabled.value = false;
    ZZdialogFormVisible.value = true;
    objData.value = obj;
    ZZtitle.value = '添加项目';
    objModeCode.value = obj.cIncludeModelCode;
    row.value = rowVal.value;
  } else {
    TdialogFormVisible.value = true;
    try {
      const res = await configApi(obj.cIncludeModelCode);
      if (res.status == 200) {
        res.data.forEach((item: any) => {
          if (item.cPropertyClassTypeCode == 'Grid') {
            TfunTables(
              item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
            );
          }
          if (item.cPropertyClassTypeCode == 'Filter') {
            TFilter.value = item[import.meta.env.VITE_APP_key];
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
    } catch (error) {
      console.log(error, '程序出错了');
    }
  }
};
//新增/编辑/详情弹窗
const modelClose = (v: any) => {
  ZZdialogFormVisible.value = v.type;
};
// TTTtable 数据整合
const TfunTables = (arr: Array<any>) => {
  modelGrid.value = arr;
  TtableColumns.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
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
  if (tabVal.value !== 'Device.device_dev_file.M.List') {
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: {
        cDeviceCode: row.value ? rowVal.value.cDeviceCode : codess.value,
        list_fault: itemData.value
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
  } else {
    //添加文档
    let data = {
      method: obj.Resource.cHttpTypeCode,
      url: obj.Resource.cServerIP + obj.Resource.cUrl,
      data: {
        cDeviceCode: row.value ? rowVal.value.cDeviceCode : codess.value,
        list_file: itemData.value
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
  }
};
const Tconfirm = () => {
  TdialogFormVisible.value = false;
  // 表格添加数据
  itemData.value.forEach((item: any) => {
    tableData.value.push(item);
  });
  TTABRef.value.handleRemoveSelectionChange();
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
//查看方案
const CheckProjec = (scope: any, obj: any) => {
  router.push({
    name: 'CheckProgram',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'device',
      title: '查看方案'
    }
  });
};

//维护人员
const CheckPerson = (scope: any, obj: any) => {
  router.push({
    name: 'protectPeople',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'device',
      title: '维护人员'
    }
  });
};
//编辑
const ClickEdit = (scope: any, obj: any) => {
  disabled.value = false;
  Trow.value = scope.row;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  ZZtitle.value = '编辑';
  objModeCode.value = obj.cIncludeModelCode;
};
//维护部件
const CheckPart = (scope: any, obj: any) => {
  router.push({
    name: 'protectPart',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'device',
      title: '维护部件'
    }
  });
};
//查看文档
const CheckFile = (scope: any, obj: any) => {
  router.push({
    name: 'Checkifile',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'device',
      title: '查看文档'
    }
  });
};
//删除
const Delete = (scope: any, obj: any) => {
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
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除数据成功'
          });
          tableAxios();
          sendId.value = [];
          TabRef.value.handleRemoveSelectionChange();
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

const seleData = ref([]) as any;
const sendId = ref([]) as any;
const tabRefs = ref(null) as any;
const handleSelectionChange = (val: any) => {
  console.log(val, '---sel');
  seleData.value = val;
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
  if (tabVal.value == 'Device.device_dev_file.M.List') {
    let url =
      scope.row.cFileRoteUrl + scope.row.cFileName + scope.row.cFileType;
    let name = scope.row.cFileTypeName;
    if (scope.row.cFileType == '.xlsx') {
      window.location.href = url;
    } else {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.click();
      document.body.removeChild(a);

      // downloadPicture(url,name)
    }
  } else {
    itemss_UID.value = scope.row.Itemss_UID;
    clickDonwnFile(event);
  }
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
