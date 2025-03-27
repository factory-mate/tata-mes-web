<!-- button 组件 -->
<template>
  <div class="buttonMain">
    <div class="butItem" v-for="item in ToolButVal" :key="item.cAttributeCode">
      <!-- 导出 -->
      <el-upload
        v-if="
          item.cAttributeCode === 'ImportIn' ||
          item.cAttributeCode === 'ImportInOnKF'
        "
        ref="importUploadRef"
        v-model:file-list="importFileList"
        :limit="1"
        :auto-upload="false"
        :show-file-list="false"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :on-change="
          (uploadFile, uploadFiles) => {
            handleImport(uploadFiles, item);
          }
        "
      >
        <el-button>
          {{ item.Resource.cAttributeName }}
        </el-button>
      </el-upload>
      <el-dropdown
        v-else-if="item.Resource.cAttributeCode == 'Export'"
        @command="HandExport($event, item)"
      >
        <el-button>
          {{ item.Resource.cAttributeName }}
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="ExportOne">当前页</el-dropdown-item>
            <el-dropdown-item command="ExportAll">导出所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button
        v-else-if="
          item.Resource.cAttributeCode == 'ExportTemplate' ||
          item.Resource.cAttributeCode == 'Download' ||
          item.Resource.cAttributeCode == 'Download_DZJ' ||
          item.Resource.cAttributeCode == 'DownloadLack' ||
          item.Resource.cAttributeCode == 'DownloadS_S_S_Detail' ||
          item.Resource.cAttributeCode == 'DownloadLX_45' ||
          item.Resource.cAttributeCode == 'ExportFault' ||
          item.Resource.cAttributeCode == 'ExportStandard' ||
          item.Resource.cAttributeCode == 'ExportPerson'
        "
        type="primary"
        @click="HandExport('ExportAll', item)"
      >
        {{ item.Resource.cAttributeName }}
      </el-button>
      <!-- 下载模版 -->
      <el-button
        v-else-if="item.Resource.cAttributeCode == 'GetTemplate'"
        type="primary"
        @click="clickDonwnFile(item)"
        >{{ item.Resource.cAttributeName }}</el-button
      >
      <!-- 导入 -->

      <el-upload
        v-else-if="
          item.Resource.cAttributeCode == 'ImportOrder' ||
          item.Resource.cAttributeCode == 'Import' ||
          item.Resource.cAttributeCode == 'UploadFile'
        "
        v-model:file-list="fileList"
        class="fileSty"
        ref="uploadRef"
        :multiple="false"
        :data="uploadFiledata"
        :show-file-list="false"
        :action="funAction(item)"
        :headers="headers"
        :limit="1"
        :on-success="SuccessFun"
        :before-upload="beforeUpload"
        :on-progress="Progress"
      >
        <el-button type="primary" @click="clickButton(item)">{{
          item.cAttributeName || '导入'
        }}</el-button>
      </el-upload>
      <!-- 单个button -->
      <template v-else>
        <el-button
          v-if="
            item.Resource.cAttributeName !== '打印标签' &&
            item.Resource.cAttributeName !== '补打'
          "
          :type="
            item.cAttributeCode == 'Add' ||
            item.cAttributeCode == 'SaveAdd' ||
            item.cAttributeCode == 'SaveEdit' ||
            item.cAttributeCode == 'Edit'
              ? 'primary'
              : item.cAttributeCode == 'Delete'
              ? 'danger'
              : item.cAttributeCode == 'Start'
              ? 'success'
              : ''
          "
          icon=""
          @click="clickButton(item)"
          >{{ item.Resource.cAttributeName }}</el-button
        >
        <el-tooltip
          v-else
          :content="props.printDis ? '请选择打印数据' : '请打印'"
          placement="top"
          effect="light"
        >
          <el-button
            v-print="{
              id: 'printMe',
              previewTitle: '',
              popTitle: ''
            }"
            :disabled="props.printDis"
            @click="clickButton(item)"
            >{{ item.Resource.cAttributeName }}</el-button
          >
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch, ref } from 'vue';
import useStore from '@/store';
import { ArrowDown, SuccessFilled } from '@element-plus/icons-vue';
import {
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElMessage
} from 'element-plus';
import type { UploadInstance, UploadUserFile } from 'element-plus';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { ElLoading } from 'element-plus';
import EquipmentD from '@/views/newSystem/systemRule/contrast/equipmentD.vue';
const Route = useRoute();
const uploadRef = ref<UploadInstance>();
const { user } = useStore();

const hasToken = user.token;

const props = defineProps({
  ToolBut: {
    required: true,
    type: Array as any,
    default: () => []
  },
  printDis: {
    type: Boolean,
    default: () => true
  }
});
const uploadFiledata = ref({}) as any; //上传的参数
const fileList = ref<UploadUserFile[]>([]);
const ToolButVal = ref([]);
const headers = ref({
  Authorization: hasToken
});

const importUploadRef = ref<any>();
const importFileList = ref<any>([]);

const emits = defineEmits([
  'AddForm',
  'addorder',
  'Delay',
  'AllOut',
  'EqupimentRead',
  'EquipmentClose',
  'AddFile',
  'clickAdd',
  'AddPersonGroup',
  'AddPerson',
  'Schedule',
  'BarcodeStatus',
  'DistributeStatus',
  'clickEdit',
  'clickDelete',
  'CancelSuspend',
  'BOMOperation',
  'clickView',
  'PrintLabel',
  'ExportOne',
  'ExportAll',
  'SaveAdd',
  'SaveEdit',
  'clickStart',
  'Again',
  'clickDistribute',
  'UserPolicyDelete',
  'UserRoleDelete',
  'UserPolicyAdd',
  'UserPolicySaveAdd',
  'UserRoleAdd',
  'clickAddConvert',
  'UserRoleSaveAdd',
  'SaveAddBase',
  'SaveAddUnit',
  'SaveAddWMS',
  'SaveAddExtend',
  'ProductionUP',
  'SaveEditBase',
  'SaveEditUnit',
  'SaveEditWMS',
  'SaveEditExtend',
  'InfoEdit',
  'SysReview',
  'Adopt',
  'Suspend',
  'ExportDetails',
  'Enter',
  'TakeOut',
  'Splitting',
  'ImportOrder',
  'Commit',
  'ItemAdd',
  'ItemAddOnMaterial',
  'clickPick',
  'ChangeProductionDate',
  'cDefindParm07',
  'AddChange',
  'clickReject',
  'clickAudit',
  'clickOptimize',
  'DispatchStation',
  'revoke',
  'BarcodeRevoke',
  'BtnClearType',
  'BtnCancel',
  'PickOrder',
  'Revoke',
  'SubpackageOperation',
  'BatchReview',
  'BatchInspection',
  'ManualSplitting',
  'ManualReview',
  'ViewFile',
  'GetOrder',
  'getOrder',
  'ButClose',
  'ImportData',
  'closeCancel',
  'ExpotrTableData',
  'ExpotrFile',
  'ClickExportSave',
  'GetPADOrder',
  'ChangeOrde',
  'AddIncludMode',
  'SaveAddUser',
  'SaveIncludMode',
  'PrintCheckLabel',
  'CustomExport',
  'Scheduling',
  'BarcodeMake',
  'Stop',
  'SetLine',
  'RollBack',
  'DistributeRollBack',
  'AdjustLine',
  'AddBody',
  'ChooseInv',
  'Submit',
  'Issue',
  'Calculate',
  'AddRow',
  'AddOrder',
  'ImportPick',
  'ImportIn',
  'ImportInOnKF',
  'ExportDetail',
  'HangUp',
  'Copy',
  'Print',
  'Del'
]);

watch(
  () => props.ToolBut,
  newVal => {
    if (newVal.length) {
      ToolButVal.value = newVal.filter((item: any) => {
        return item.IsShow == true;
      });
    }
  },
  { deep: true }
);

// 生成GUID
const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const beforeUpload = () => {
  console.log(guid());
  if (
    Route.name == 'inspectionNormeAdd' ||
    Route.name == 'inspectionNormeEdit' ||
    Route.name == 'inspectionNormeView'
  ) {
    uploadFiledata.value = {
      uid: guid()
    };
  }
};
const SuccessFun = (response: any, uploadFile: any, uploadFiles: any) => {
  // console.log(1111);

  const loadingInstance = ElLoading.service();
  loadingInstance.close();
  emits('ExpotrFile', { uid: guid() });
  if (response.status == 200) {
    emits('ExpotrTableData', response.data);

    emits('ExpotrFile', { uid: guid() });
    fileList.value = [];
    ElMessage({
      message: '上传成功！',
      type: 'success'
    });
  } else {
    if (response.status == 500) {
      ElMessage({
        message: response.errmsg?.[0].Value || '500: 导入出错！',
        type: 'error'
      });
    } else {
      ElMessage({
        message: response.msg || '导入出错！',
        type: 'error'
      });
    }

    // console.log(fileList.value);
    fileList.value = [];
  }
  clickButClose();
};
const Progress = (evt: any, uploadFile: any, uploadFiles: any) => {
  ElLoading.service({
    lock: true,
    text: '导入中.....',
    background: 'rgba(0, 0, 0, 0.7)'
  });
  clickButOpen();
};
const clickButClose = () => {
  emits('ButClose', false);
};
const clickButOpen = () => {
  emits('ButClose', true);
};
// 新增
const clickAdd = (obj: any) => {
  console.log(obj, '新增');
  emits('clickAdd', obj);
};
const clickAddConvert = (obj: any) => {
  console.log(obj, '添加');
  emits('clickAddConvert', obj);
};
// 编
const clickEdit = (obj: any) => {
  console.log('编辑--', obj);
  emits('clickEdit', obj);
};
// 删除
const clickDelete = (obj: any) => {
  console.log('删除--', obj);
  emits('clickDelete', obj);
};

// 详情
const clickView = (obj: any) => {
  console.log('详情', obj);
  emits('clickView', obj);
};
// 导出当前
const ExportOne = (obj: any) => {
  console.log('导出当前', obj);
  emits('ExportOne', obj);
};
// 导出所有
const ExportAll = (obj: any) => {
  console.log('导出所有', obj);
  emits('ExportAll', obj);
};
//新增保存
const SaveAdd = (obj: any) => {
  console.log(obj, '新增保存');
  emits('SaveAdd', obj);
};
//编辑保存
const SaveEdit = (obj: any) => {
  console.log('编辑保存', obj);
  emits('SaveEdit', obj);
};
//是否开启
const clickStart = (obj: any) => {
  console.log('启用--', obj);
  emits('clickStart', obj);
};
const clickDistribute = (obj: any) => {
  console.log('执行--', obj);
  emits('clickDistribute', obj);
};
const Again = (obj: any) => {
  console.log('Again', obj);
  emits('Again', obj);
};
//删除用户策略
const UserPolicyDelete = (obj: any) => {
  emits('UserPolicyDelete', obj);
};
//用户策略添加
const UserPolicyAdd = (obj: any) => {
  emits('UserPolicyAdd', obj);
};
//用户策略添加保存
const UserPolicySaveAdd = (obj: any) => {
  emits('UserPolicySaveAdd', obj);
};
//用户角色添加
const UserRoleAdd = (obj: any) => {
  emits('UserRoleAdd', obj);
};
//删除用户角色
const UserRoleDelete = (obj: any) => {
  emits('UserRoleDelete', obj);
};
//用户角色新增保存
const UserRoleSaveAdd = (obj: any) => {
  emits('UserRoleSaveAdd', obj);
};
//物料保存基本信息
const SaveAddBase = (obj: any) => {
  emits('SaveAddBase', obj);
};
//物料保存单位信息
const SaveAddUnit = (obj: any) => {
  emits('SaveAddUnit', obj);
};

//物料保存库管信息
const SaveAddWMS = (obj: any) => {
  emits('SaveAddWMS', obj);
};
//物料保存扩展信息
const SaveAddExtend = (obj: any) => {
  emits('SaveAddExtend', obj);
};
// 保存修改
const SaveEditBase = (obj: any) => {
  emits('SaveEditBase', obj);
};
// 保存修改
const SaveEditUnit = (obj: any) => {
  emits('SaveEditUnit', obj);
};
// 保存修改
const SaveEditWMS = (obj: any) => {
  emits('SaveEditWMS', obj);
};
// 保存修改
const SaveEditExtend = (obj: any) => {
  emits('SaveEditExtend', obj);
};
// 保存修改
const InfoEdit = (obj: any) => {
  emits('InfoEdit', obj);
};
//拆单运算
const Splitting = (obj: any) => {
  emits('Splitting', obj);
};
// 系统审单
const SysReview = (obj: any) => {
  emits('SysReview', obj);
};
// 通过Adopt
const Adopt = (obj: any) => {
  emits('Adopt', obj);
};
//挂起
const Suspend = (obj: any) => {
  emits('Suspend', obj);
};
//BOM运算
const BOMOperation = (obj: any) => {
  emits('BOMOperation', obj);
};
const ImportData = (obj: any) => {
  emits('ImportData', obj);
};
const AddFile = (obj: any) => {
  emits('AddFile', obj);
};
const Submit = (obj: any) => {
  emits('Submit', obj);
};
//导入
const funAction = (obj: any) => {
  let http = '';
  if (Route.name == 'inspectionNormeAdd') {
    http = obj.Resource.cServerIP + obj.Resource.cUrl + '?uid=' + guid();
  } else if (Route.name == 'inspectionNormeEdit') {
    http =
      obj.Resource.cServerIP + obj.Resource.cUrl + '?uid=' + Route.params.rowId;
  } else {
    http = obj.Resource.cServerIP + obj.Resource.cUrl;
  }
  return http;
};
const ImportOrder = (obj: any) => {
  emits('ImportOrder', obj);
};
//导出详细
const ExportDetails = (obj: any) => {
  emits('ExportDetails', obj);
};
//确认生产
const Enter = (obj: any) => {
  emits('Enter', obj);
};
//取单
const TakeOut = (obj: any) => {
  emits('TakeOut', obj);
};
//提交
const Commit = (obj: any) => {
  emits('Commit', obj);
};
//添加
const ItemAdd = (obj: any) => {
  emits('ItemAdd', obj);
};
const ItemAddOnMaterial = obj => {
  emits('ItemAddOnMaterial', obj);
};
//打印标签
const PrintLabel = (obj: any) => {
  emits('PrintLabel', obj);
};
const clickPick = (obj: any) => {
  emits('clickPick', obj);
};
const ChangeProductionDate = (obj: any) => {
  emits('ChangeProductionDate', obj);
};
//下载附件
const cDefindParm07 = (obj: any) => {
  emits('cDefindParm07', obj);
};
const AddChange = (obj: any) => {
  emits('AddChange', obj);
};
//审核
const clickAudit = (obj: any) => {
  emits('clickAudit', obj);
};
//驳回
const clickReject = (obj: any) => {
  emits('clickReject', obj);
};
const clickOptimize = (obj: any) => {
  emits('clickOptimize', obj);
};
const DispatchStation = (obj: any) => {
  emits('DispatchStation', obj);
};
const BtnClearType = (obj: any) => {
  emits('BtnClearType', obj);
};
const BtnCancel = (obj: any) => {
  emits('BtnCancel', obj);
};
const PickOrder = (obj: any) => {
  emits('PickOrder', obj);
};
const Revoke = (obj: any) => {
  emits('Revoke', obj);
};
const BarcodeRevoke = (obj: any) => {
  emits('BarcodeRevoke', obj);
};
const SubpackageOperation = (obj: any) => {
  emits('SubpackageOperation', obj);
};
const BatchReview = (obj: any) => {
  emits('BatchReview', obj);
};
const BatchInspection = (obj: any) => {
  emits('BatchInspection', obj);
};
const ManualSplitting = (obj: any) => {
  emits('ManualSplitting', obj);
};
const ManualReview = (obj: any) => {
  emits('ManualReview', obj);
};
const closeCancel = (obj: any) => {
  emits('closeCancel', obj);
};
//生产同步上游
const ProductionUP = (obj: any) => {
  emits('ProductionUP', obj);
};
//撤销
const revoke = (obj: any) => {
  emits('revoke', obj);
};
//取消挂起
const CancelSuspend = (obj: any) => {
  emits('CancelSuspend', obj);
};
//查看文档
const ViewFile = (obj: any) => {
  emits('ViewFile', obj);
};
const GetOrder = (obj: any) => {
  emits('GetOrder', obj);
};
const getOrder = (obj: any) => {
  emits('getOrder', obj);
};
const AddPerson = (obj: any) => {
  emits('AddPerson', obj);
};
const AddPersonGroup = (obj: any) => {
  emits('AddPersonGroup', obj);
};
//进度
const Schedule = (obj: any) => {
  emits('Schedule', obj);
};
const BarcodeStatus = (obj: any) => {
  emits('BarcodeStatus', obj);
};
const DistributeStatus = (obj: any) => {
  emits('DistributeStatus', obj);
};
const AddForm = (obj: any) => {
  emits('AddForm', obj);
};
//原始订单导入二次确认保存
const ClickExportSave = (obj: any) => {
  emits('ClickExportSave', obj);
};
const GetPADOrder = (obj: any) => {
  emits('GetPADOrder', obj);
};
const ChangeOrde = (obj: any) => {
  emits('ChangeOrde', obj);
};
const AddIncludMode = (obj: any) => {
  emits('AddIncludMode', obj);
};
const EquipmentClose = (obj: any) => {
  emits('EquipmentClose', obj);
};
const EqupimentRead = (obj: any) => {
  emits('EqupimentRead', obj);
};
const SaveAddUser = (obj: any) => {
  emits('SaveAddUser', obj);
};
const SaveIncludMode = (obj: any) => {
  emits('SaveIncludMode', obj);
};
const PrintCheckLabel = (obj: any) => {
  emits('PrintCheckLabel', obj);
};
const CustomExport = (obj: any) => {
  emits('CustomExport', obj);
};
const addorder = (obj: any) => {
  emits('addorder', obj);
};
const AddOrder = (obj: any) => {
  emits('AddOrder', obj);
};
const Scheduling = (obj: any) => {
  emits('Scheduling', obj);
};
const BarcodeMake = (obj: any) => {
  emits('BarcodeMake', obj);
};
const Stop = (obj: any) => {
  emits('Stop', obj);
};
const SetLine = (obj: any) => {
  emits('SetLine', obj);
};
const RollBack = (obj: any) => {
  emits('RollBack', obj);
};
const DistributeRollBack = (obj: any) => {
  emits('DistributeRollBack', obj);
};
const AdjustLine = (obj: any) => {
  emits('AdjustLine', obj);
};
const AllOut = (obj: any) => {
  emits('AllOut', obj);
};
const Delay = (obj: any) => {
  emits('Delay', obj);
};
const AddBody = (obj: any) => {
  emits('AddBody', obj);
};
const ChooseInv = (obj: any) => {
  emits('ChooseInv', obj);
};
const Issue = (obj: any) => {
  emits('Issue', obj);
};
const Calculate = (obj: any) => {
  emits('Calculate', obj);
};
const AddRow = (obj: any) => {
  emits('AddRow', obj);
};
const ImportPick = (obj: any) => {
  emits('ImportPick', obj);
};
const ExportDetail = (obj: any) => {
  emits('ExportDetail', obj);
};
const HangUp = (obj: any) => {
  emits('HangUp', obj);
};
const Copy = (obj: any) => {
  emits('Copy', obj);
};
const Print = (obj: any) => {
  emits('Print', obj);
};
const Del = (obj: any) => {
  emits('Del', obj);
};
const HandExport = (command: any, event: any) => {
  switch (command) {
    case 'ExportOne':
      ExportOne(event);
      break;
    case 'ExportAll':
      ExportAll(event);
      break;
    default:
      break;
  }
};
// 下载模板
const clickDonwnFile = (item: any) => {
  console.log(item, '--====item,,,,');
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    params: {}
  };
  ParamsApi(data)
    .then(res => {
      if (res.status == 200) {
        window.location.href =
          res.data.cFilePath + res.data.cFileReName + res.data.cFileSuffix;
      }
    })
    .finally(() => {
      loading.close();
    });
};

// 事件总线
const clickButton = (event: any) => {
  switch (event.cAttributeCode) {
    case 'Add': //新增
      clickAdd(event);
      break;
    case 'AddConvert': //添加
      clickAddConvert(event);
      break;
    case 'Edit': //编辑
      clickEdit(event);
      break;
    case 'Delete': //删除
      clickDelete(event);
      break;
    case 'view': //详情
      clickView(event);
      break;
    case 'SaveAdd': //form 新增
      SaveAdd(event);
      break;
    case 'SaveEdit': //from  编辑
      SaveEdit(event);
      break;
    case 'Start': //启用
      clickStart(event);
      break;
    case 'Distribute': //启用
      clickDistribute(event);
      break;
    case 'Again': //启用
      Again(event);
      break;
    case 'UserPolicyDelete':
      UserPolicyDelete(event);
      break;
    case 'UserPolicyAdd':
      UserPolicyAdd(event);
      break;
    case 'UserRoleDelete':
      UserRoleDelete(event);
      break;
    case 'UserPolicySaveAdd':
      UserPolicySaveAdd(event);
      break;
    case 'UserRoleAdd':
      UserRoleAdd(event);
      break;
    case 'UserRoleSaveAdd':
      UserRoleSaveAdd(event);
      break;
    case 'SaveAddBase':
      SaveAddBase(event);
      break;
    case 'SaveAddUnit':
      SaveAddUnit(event);
      break;
    case 'SaveAddWMS':
      SaveAddWMS(event);
      break;
    case 'SaveAddExtend':
      SaveAddExtend(event);
      break;
    case 'SaveEditBase':
      SaveEditBase(event);
      break;
    case 'SaveEditUnit':
      SaveEditUnit(event);
      break;
    case 'SaveEditWMS':
      SaveEditWMS(event);
      break;
    case 'SaveEditExtend':
      SaveEditExtend(event);
      break;
    case 'InfoEdit':
      InfoEdit(event);
      break;
    case 'SysReview':
      SysReview(event);
      break;
    case 'Adopt':
      Adopt(event);
      break;
    case 'Suspend':
      Suspend(event);
      break;
    case 'ExportDetails':
      ExportDetails(event);
      break;
    case 'Enter':
      Enter(event);
      break;
    case 'TakeOut':
      TakeOut(event);
      break;
    case 'Splitting':
      Splitting(event);
      break;
    case 'ImportOrder':
      ImportOrder(event);
      break;
    case 'Commit':
      Commit(event);
      break;
    case 'ItemAdd':
      ItemAdd(event);
      break;
    case 'ItemAddOnMaterial':
      ItemAddOnMaterial(event);
      break;
    case 'PrintLabel':
      PrintLabel(event);
      break;
    case 'pick':
      clickPick(event);
      break;
    case 'ChangeProductionDate':
      ChangeProductionDate(event);
      break;
    case 'cDefindParm07':
      cDefindParm07(event);
      break;
    case 'AddChange':
      AddChange(event);
      break;
    case 'Audit':
      clickAudit(event);
      break;
    case 'Reject':
      clickReject(event);
      break;
    case 'Optimize':
      clickOptimize(event);
      break;
    case 'DispatchStation':
      DispatchStation(event);
      break;
    case 'BtnClearType':
      BtnClearType(event);
      break;
    case 'BtnCancel':
      BtnCancel(event);
      break;
    case 'revoke':
      revoke(event);
      break;
    case 'BarcodeRevoke':
      BarcodeRevoke(event);
      break;
    case 'ProductionUP':
      ProductionUP(event);
      break;
    case 'PickOrder':
      PickOrder(event);
      break;
    case 'Revoke':
      Revoke(event);
      break;
    case 'Submit':
      Submit(event);
      break;
    case 'SubpackageOperation':
      SubpackageOperation(event);
      break;
    case 'BatchInspection':
      BatchInspection(event);
      break;
    case 'BatchReview':
      BatchReview(event);
      break;
    case 'ManualSplitting':
      ManualSplitting(event);
      break;
    case 'ManualReview':
      ManualReview(event);
      break;
    case 'ViewFile':
      ViewFile(event);
      break;
    case 'GetOrder':
      GetOrder(event);
      break;
    case 'getOrder':
      getOrder(event);
      break;
    case 'CancelSuspend':
      CancelSuspend(event);
      break;
    case 'BOMOperation':
      BOMOperation(event);
      break;
    case 'Schedule':
      Schedule(event);
      break;
    case 'BarcodeStatus':
      BarcodeStatus(event);
      break;
    case 'DistributeStatus':
      DistributeStatus(event);
      break;
    case 'ImportData':
      ImportData(event);
      break;
    case 'Cancel':
      closeCancel(event);
      break;
    case 'Save':
      ClickExportSave(event);
      break;
    case 'GetPADOrder':
      GetPADOrder(event);
      break;
    case 'AddForm':
      AddForm(event);
      break;
    case 'ChangeOrde':
      ChangeOrde(event);
      break;
    case 'AddPerson':
      AddPerson(event);
      break;
    case 'AddPersonGroup':
      AddPersonGroup(event);
      break;
    case 'AddIncludMode':
      AddIncludMode(event);
      break;
    case 'AddFile':
      AddFile(event);
      break;
    case 'Close':
      EquipmentClose(event);
      break;
    case 'Read':
      EqupimentRead(event);
      break;
    case 'SaveAddUser':
      SaveAddUser(event);
      break;
    case 'SaveIncludMode':
      SaveIncludMode(event);
      break;
    case 'PrintCheckLabel':
      PrintCheckLabel(event);
      break;
    case 'CustomExport':
      CustomExport(event);
      break;
    case 'addorder':
      addorder(event);
      break;
    case 'Scheduling':
      Scheduling(event);
      break;
    case 'BarcodeMake':
      BarcodeMake(event);
      break;
    case 'Stop':
      Stop(event);
      break;
    case 'SetLine':
      SetLine(event);
      break;
    case 'RollBack':
      RollBack(event);
      break;
    case 'DistributeRollBack':
      DistributeRollBack(event);
      break;
    case 'AdjustLine':
      AdjustLine(event);
      break;
    case 'AllOut':
      AllOut(event);
      break;
    case 'Delay':
      Delay(event);
      break;
    case 'AddBody':
      AddBody(event);
      break;
    case 'ChooseInv':
      ChooseInv(event);
      break;
    case 'Issue':
      Issue(event);
      break;
    case 'Calculate':
      Calculate(event);
      break;
    case 'AddRow':
      AddRow(event);
      break;
    case 'AddOrder':
      AddOrder(event);
      break;
    case 'ImportPick':
      ImportPick(event);
      break;
    case 'ExportDetail':
      ExportDetail(event);
      break;
    case 'HangUp':
      HangUp(event);
      break;
    case 'Copy':
      Copy(event);
      break;
    case 'Print':
      Print(event);
      break;
    case 'Del':
      Del(event);
      break;
    default:
      break;
  }
};

function handleImport(uploadFiles, obj) {
  if (!uploadFiles.length) {
    ElMessage({
      message: '请选择文件',
      type: 'warning'
    });
    return;
  }
  emits(obj.cAttributeCode, { ...obj, files: [...uploadFiles] });
  importFileList.value = [];
}
</script>

<style scoped lang="scss">
.buttonMain {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;

  .butItem {
    margin-left: 10px;
  }
}
</style>
