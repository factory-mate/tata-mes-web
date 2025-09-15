<script setup>
import {
  getTags,
  getCMaterialTypes,
  getInOutTypes,
  updateMaterial,
  getUnitTypes,
  getMaterial
} from '@/api/material';
import { ref, onActivated } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MoreFilled } from '@element-plus/icons-vue';
import CInvClassNameModal from './components/CInvClassNameModal.vue';
import CVendorNameModal from './components/CVendorNameModal.vue';
import UnitModal from './components/UnitModal.vue';
import WarehouseModal from './components/WarehouseModal.vue';
import WarehouseAreaModal from './components/WarehouseAreaModal.vue';
import WarehouseLocationModal from './components/WarehouseLocationModal.vue';
import MaterialModal from './components/MaterialModal.vue';
import useStore from '@/store';
import { ElMessage } from 'element-plus';
import { getCurrentInstance } from '@vue/runtime-core';

const $bus = getCurrentInstance()?.appContext.config.globalProperties.mittBus;

const { tagsView } = useStore();
const route = useRoute();
const router = useRouter();
const ruleFormRef = ref(null);
const formData = ref({
  cInvCode: '',
  cInvName: '',
  IsPeriod: false,
  iPeriodDay: 0,
  IsBatch: false,
  IsStore: false,
  IsQC: false
});
const sAPInfos = ref([]);
const extensionItemData = ref({});
const unitData = ref([]);
const unitItemData = ref({});
const showAddExtensionDialog = ref(false);
const showAddUnitDialog = ref(false);
const tagOptions = ref([]);
const cMaterialTypeOptions = ref([]);
const inOutOptions = ref([]);
const unitTypeOptions = ref([]);

const cInvClassNameModalRef = ref();
const cVendorNameModalRef = ref();
const extensionCVendorNameModalRef = ref();
const mainUnitModalRef = ref();
const secondUnitModalRef = ref();
const warehouseModalRef = ref();
const warehouseAreaModalRef = ref();
const warehouseLocationModalRef = ref();
const materialModalRef = ref();

const rules = ref({
  cInvCode: [{ required: true, message: '请输入物料编号', trigger: 'change' }],
  cInvName: [{ required: true, message: '请输入物料名称', trigger: 'change' }],
  IsBatch: [{ required: true, message: '请选择批次管理', trigger: 'blur' }],
  IsStore: [{ required: true, message: '请选择库存管理', trigger: 'blur' }],
  IsQC: [{ required: true, message: '请选择质检', trigger: 'blur' }]
  // cDefindParm01: [{ required: true, message: '请选择标签', trigger: 'change' }]
});

function fetchTags() {
  getTags().then(res => {
    tagOptions.value = res.data.map(item => ({
      label: item.cDictonaryName,
      value: item.cDictonaryCode
    }));
  });
}

function fetchCMaterialTypes() {
  getCMaterialTypes().then(res => {
    cMaterialTypeOptions.value = res.data.map(item => ({
      label: item.cDictonaryName,
      value: item.cDictonaryCode
    }));
  });
}

function fetchInOutTypes() {
  getInOutTypes().then(res => {
    inOutOptions.value = res.data.map(item => ({
      label: item.cDictonaryName,
      value: item.cDictonaryCode
    }));
  });
}

function fetchUnitTypes() {
  getUnitTypes().then(res => {
    unitTypeOptions.value = res.data.map(item => ({
      label: item.cDictonaryName,
      value: item.cDictonaryCode
    }));
  });
}

async function handleSubmit() {
  const data = {
    ...formData.value,
    singerModels: unitData.value,
    sAPInfos: []
    // sAPInfos: sAPInfos.value
  };
  try {
    const res = await updateMaterial(data);
    if (res.success) {
      closeSelectedTag(route);
      ElMessage.success('保存成功');
      router.push('/basematerial/WMSMaterial');
      $bus.emit('tableUpData', { name: 'WMSMaterial' });
    }
  } catch {
    //
  }
}

function handleClickExtensioncVendorNameModal() {
  extensionCVendorNameModalRef.value.showDialog = true;
}

function handleExtensionCVendorNameModalConfirm(data) {
  console.log(data);
  extensionItemData.value.cVendorName = data?.cVendorName;
  extensionItemData.value.cVendorCode = data?.cVendorCode;
}

function onClickAddExtensionBtn() {
  showAddExtensionDialog.value = true;
  extensionItemData.value = {};
}

function handleDeleteExtensionItem(index) {
  sAPInfos.value.splice(index, 1);
}

function handleSaveAddExtensionData() {
  sAPInfos.value.push(extensionItemData.value);
  showAddExtensionDialog.value = false;
}

function onClickAddUnitBtn() {
  showAddUnitDialog.value = true;
  unitItemData.value = {};
}

function handleDeleteUnitItem(index) {
  unitData.value.splice(index, 1);
}

function handleSaveAddUnitData() {
  if (!unitItemData.value.cUnitTypeCode) {
    ElMessage.error('请选择计量单位应用类型');
    return;
  }
  unitData.value.push(unitItemData.value);
  showAddUnitDialog.value = false;
}

function handleUnitTypeNameChange(data) {
  unitItemData.value.cUnitTypeName = unitTypeOptions.value.find(
    item => item.value == data
  )?.label;
}

function handleClickcInvClassNameModal() {
  cInvClassNameModalRef.value.showDialog = true;
}

function handleCInvClassNameModalConfirm(data) {
  console.log(data);
  formData.value.cInvClassName = data?.cInvClassName;
  formData.value.cInvClassCode = data?.cInvClassCode;
}

function handleClickcVendorNameModal() {
  cVendorNameModalRef.value.showDialog = true;
}

function handleCVendorNameModalConfirm(data) {
  console.log(data);
  formData.value.cVendorName = data?.cVendorName;
  formData.value.cVendorCode = data?.cVendorCode;
}

function handleClickMainUnitModal() {
  mainUnitModalRef.value.showDialog = true;
}

function handleMainUnitModalConfirm(data) {
  console.log(data);
  unitItemData.value.cUnitCode = data?.cUnitCode;
  unitItemData.value.cUnitName = data?.cUnitName;
}

function handleClickSecondUnitModal() {
  secondUnitModalRef.value.showDialog = true;
}

function handleSecondUnitModalConfirm(data) {
  console.log(data);
  unitItemData.value.cAssUnitCode = data?.cUnitCode;
  unitItemData.value.cAssUnitName = data?.cUnitName;
}

function handleClickWarehouseModal() {
  warehouseModalRef.value.showDialog = true;
}

function handleWarehouseModalConfirm(data) {
  console.log(data);
  formData.value.cWareHouseCode = data?.cWareHouseCode;
  formData.value.cWareHouseName = data?.cWareHouseName;
}

function handleClickWarehouseAreaModal() {
  warehouseAreaModalRef.value.showDialog = true;
}

function handleWarehouseAreaModalConfirm(data) {
  console.log(data);
  formData.value.cWareHouseAreaCode = data?.cWareHouseAreaCode;
  formData.value.cWareHouseAreaName = data?.cWareHouseAreaName;
}

function handleClickWarehouseLocationModal() {
  warehouseLocationModalRef.value.showDialog = true;
}

function handleWarehouseLocationModalConfirm(data) {
  console.log(data);
  formData.value.cWareHouseLocationCode = data?.cWareHouseLocationCode;
  formData.value.cWareHouseLocationName = data?.cWareHouseLocationName;
}

function handleClickMaterialModal() {
  materialModalRef.value.showDialog = true;
}

function handleMaterialModalConfirm(data) {
  console.log(data);
  formData.value.cDynamicsParm03 = data?.cDictonaryCode;
  formData.value.cDynamicsParm03Name = data?.cDictonaryName;
}

function closeSelectedTag(view) {
  tagsView.delVisitedView(view);
}

onActivated(() => {
  // fetchTags();
  fetchInOutTypes();
  fetchUnitTypes();
  fetchCMaterialTypes();
  const { rowId } = route.params;
  getMaterial({ cInvCode: rowId }).then(res => {
    const infoData = res.data.iNENTORY_INFO ?? {};
    const extendData = res.data.iNENTORY_EXTEND ?? {};
    const wmsData = res.data.iNENTORY_WMS ?? {};
    formData.value = { ...extendData, ...wmsData, ...infoData };
    unitData.value = res.data.iNENTORY_UNIT ?? [];
    sAPInfos.value = res.data.sAPInfos ?? [];
  });
});
</script>

<template>
  <el-form
    :model="formData"
    label-width="auto"
    style="width: 100%"
    :rules="rules"
    ref="ruleFormRef"
  >
    <div style="padding: 20px; display: flex; flex-direction: column; gap: 8px">
      <el-card>
        <el-tag type="primary" size="large">基本信息</el-tag>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item
              label="物料分类"
              label-width="150"
              prop="cInvClassName"
            >
              <el-input
                v-model="formData.cInvClassName"
                style="width: 100%"
                clearable
              >
                <template #append>
                  <el-icon @click="handleClickcInvClassNameModal">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编号" label-width="150" prop="cInvCode">
              <el-input
                v-model="formData.cInvCode"
                autocomplete="off"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料名称" label-width="150" prop="cInvName">
              <el-input v-model="formData.cInvName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料规格" label-width="150" prop="cInvstd">
              <el-input v-model="formData.cInvstd" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item label="保质期管理" label-width="150" prop="IsPeriod">
              <el-switch
                v-model="formData.IsPeriod"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="质保天数" label-width="150" prop="iPeriodDay">
              <el-input-number v-model="formData.iPeriodDay" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次管理" label-width="150" prop="IsBatch">
              <el-switch
                v-model="formData.IsBatch"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="库存管理" label-width="150" prop="IsStore">
              <el-switch
                v-model="formData.IsStore"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item
              label="供应商名称"
              label-width="150"
              prop="cVendorName"
            >
              <el-input
                v-model="formData.cVendorName"
                style="width: 100%"
                clearable
              >
                <template #append>
                  <el-icon @click="handleClickcVendorNameModal">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="质检" label-width="150" prop="IsQC">
              <el-switch
                v-model="formData.IsQC"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="物料类型"
              label-width="150"
              prop="cMaterialType"
              style="font-weight: 700"
            >
              <el-select-v2
                v-model="formData.cMaterialType"
                placeholder="请选择"
                style="width: 240px"
                :options="cMaterialTypeOptions"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-tag type="primary" size="large">物料规格</el-tag>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item label="物料长" label-width="150" prop="nSafeQuinity">
              <el-input v-model="formData.iDefindParm11" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料宽" label-width="150" prop="nSafeQuinity">
              <el-input v-model="formData.iDefindParm12" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料厚" label-width="150" prop="nMaxQuinity">
              <el-input v-model="formData.iDefindParm13" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="板材等级" label-width="150" prop="nMinQuinity">
              <el-input v-model="formData.cDynamicsParm01" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item
              label="适用品牌"
              label-width="150"
              prop="cWarnRuleCode"
            >
              <el-input v-model="formData.cDynamicsParm02" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="板材材质"
              label-width="150"
              prop="cDynamicsParm03Name"
            >
              <el-input
                v-model="formData.cDynamicsParm03Name"
                style="width: 100%"
                clearable
              >
                <template #append>
                  <el-icon @click="handleClickMaterialModal">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="颜色" label-width="150" prop="cWarnRuleCode">
              <el-input v-model="formData.cDynamicsParm04" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-tag type="primary" size="large">库管信息</el-tag>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item label="是否库存预警" label-width="150" prop="IsWarn">
              <el-switch
                v-model="formData.IsWarn"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="安全库存量"
              label-width="150"
              prop="nSafeQuinity"
            >
              <el-input
                v-model="formData.nSafeQuinity"
                autocomplete="off"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="最高库存量"
              label-width="150"
              prop="nMaxQuinity"
            >
              <el-input
                v-model="formData.nMaxQuinity"
                autocomplete="off"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="最低库存量"
              label-width="150"
              prop="nMinQuinity"
            >
              <el-input
                v-model="formData.nMinQuinity"
                autocomplete="off"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item
              label="预警规则"
              label-width="150"
              prop="cWarnRuleCode"
            >
              <el-input v-model="formData.cWarnRuleCode" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="出入库方式"
              label-width="150"
              prop="cInOutTypeCode"
              style="font-weight: 700"
            >
              <el-select-v2
                v-model="formData.cInOutTypeCode"
                placeholder="请选择"
                style="width: 240px"
                :options="inOutOptions"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="默认仓库"
              label-width="150"
              prop="cWareHouseName"
            >
              <el-input
                v-model="formData.cWareHouseName"
                style="width: 100%"
                clearable
              >
                <template #append>
                  <el-icon @click="handleClickWarehouseModal">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="默认库区"
              label-width="150"
              prop="cWareHouseAreaName"
            >
              <el-input
                v-model="formData.cWareHouseAreaName"
                style="width: 100%"
                clearable
              >
                <template #append>
                  <el-icon @click="handleClickWarehouseAreaModal">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            <el-form-item
              label="默认库位"
              label-width="150"
              prop="cWareHouseLocationName"
            >
              <el-input
                v-model="formData.cWareHouseLocationName"
                style="width: 100%"
                clearable
              >
                <template #append>
                  <el-icon @click="handleClickWarehouseLocationModal">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="最小包装量"
              label-width="150"
              prop="iMinPackage"
            >
              <el-input
                v-model="formData.iMinPackage"
                autocomplete="off"
                type="number"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- <el-card>
        <div style="display: flex; justify-content: space-between">
          <el-tag type="primary" size="large">扩展信息</el-tag>
          <el-button type="primary" @click="onClickAddExtensionBtn"
            >添加</el-button
          >
        </div>
        <el-table :data="sAPInfos" style="width: 100%; margin-top: 20px">
          <el-table-column width="60" fixed>
            <template #header> 序号 </template>
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="cSAPCode" label="SAP 物料编码" />
          <el-table-column prop="cVendorCode" label="供应商编码" />
          <el-table-column prop="cVendorName" label="供应商名称" />
          <el-table-column prop="cPackageNumber" label="每包数量">
            <template #default="scope">
              <el-input-number
                v-model="scope.row['cPackageNumber']"
                placeholder="请输入"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button
                type="primary"
                @click="handleDeleteExtensionItem(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card> -->

      <el-card>
        <div style="display: flex; justify-content: space-between">
          <el-tag type="primary" size="large">单位信息</el-tag>
          <el-button type="primary" @click="onClickAddUnitBtn">添加</el-button>
        </div>
        <el-table :data="unitData" style="width: 100%; margin-top: 20px">
          <el-table-column width="60" fixed>
            <template #header> 序号 </template>
            <template #default="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column prop="cUnitTypeName" label="计量单位应用类型" />
          <el-table-column prop="cUnitName" label="主计量单位名称" />
          <el-table-column prop="cAssUnitName" label="辅计量单位名称" />
          <el-table-column prop="iChangeRate" label="换算率" />
          <el-table-column label="是否默认">
            <template #default="scope">
              {{ scope.row.IsDefault ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button
                type="primary"
                @click="handleDeleteUnitItem(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <div style="display: flex; justify-content: center">
        <el-button type="primary" @click="handleSubmit"> 保存 </el-button>
      </div>
    </div>
  </el-form>

  <el-dialog v-model="showAddExtensionDialog" title="添加" width="600">
    <el-form :model="extensionItemData">
      <el-form-item label="SAP 物料编码" label-width="150">
        <el-input v-model="extensionItemData.cSAPCode" />
      </el-form-item>

      <el-form-item label="供应商名称" label-width="150">
        <el-input
          v-model="extensionItemData.cVendorName"
          style="width: 100%"
          clearable
        >
          <template #append>
            <el-icon @click="handleClickExtensioncVendorNameModal">
              <MoreFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="供应商编码" label-width="150">
        <el-input v-model="extensionItemData.cVendorCode" disabled />
      </el-form-item>

      <el-form-item label="每包数量" label-width="150">
        <el-input-number v-model="extensionItemData.cPackageNumber" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="showAddExtensionDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAddExtensionData">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="showAddUnitDialog" title="添加" width="600">
    <el-form :model="unitItemData">
      <el-form-item label="计量单位应用类型" label-width="150" required>
        <el-select-v2
          v-model="unitItemData.cUnitTypeCode"
          placeholder="请选择"
          :options="unitTypeOptions"
          @change="handleUnitTypeNameChange"
        />
      </el-form-item>

      <el-form-item label="主计量单位名称" label-width="150">
        <el-input
          v-model="unitItemData.cUnitName"
          style="width: 100%"
          clearable
        >
          <template #append>
            <el-icon @click="handleClickMainUnitModal">
              <MoreFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="辅计量单位名称" label-width="150">
        <el-input
          v-model="unitItemData.cAssUnitName"
          style="width: 100%"
          clearable
        >
          <template #append>
            <el-icon @click="handleClickSecondUnitModal">
              <MoreFilled />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="换算率" label-width="150">
        <el-input-number v-model="unitItemData.iChangeRate" />
      </el-form-item>
      <el-form-item label="是否默认" label-width="150">
        <el-switch
          v-model="unitItemData.IsDefault"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="showAddUnitDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSaveAddUnitData">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>

  <CInvClassNameModal
    ref="cInvClassNameModalRef"
    @confirm="handleCInvClassNameModalConfirm"
  />
  <CVendorNameModal
    ref="cVendorNameModalRef"
    @confirm="handleCVendorNameModalConfirm"
  />
  <CVendorNameModal
    ref="extensionCVendorNameModalRef"
    @confirm="handleExtensionCVendorNameModalConfirm"
  />
  <UnitModal ref="mainUnitModalRef" @confirm="handleMainUnitModalConfirm" />
  <UnitModal ref="secondUnitModalRef" @confirm="handleSecondUnitModalConfirm" />
  <WarehouseModal
    ref="warehouseModalRef"
    @confirm="handleWarehouseModalConfirm"
  />
  <WarehouseAreaModal
    ref="warehouseAreaModalRef"
    @confirm="handleWarehouseAreaModalConfirm"
  />
  <WarehouseLocationModal
    ref="warehouseLocationModalRef"
    @confirm="handleWarehouseLocationModalConfirm"
  />
  <MaterialModal ref="materialModalRef" @confirm="handleMaterialModalConfirm" />
</template>
