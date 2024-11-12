<script setup>
import {
  getTags,
  getInOutTypes,
  addMaterial,
  getUnitTypes
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
import useStore from '@/store';

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
  IsStore: false
});
const unitData = ref([]);
const unitItemData = ref({});
const showAddUnitDialog = ref(false);
const tagOptions = ref([]);
const inOutOptions = ref([]);
const unitTypeOptions = ref([]);

const cInvClassNameModalRef = ref();
const cVendorNameModalRef = ref();
const mainUnitModalRef = ref();
const secondUnitModalRef = ref();
const warehouseModalRef = ref();
const warehouseAreaModalRef = ref();
const warehouseLocationModalRef = ref();

const rules = ref({
  cInvCode: [{ required: true, message: '请输入存货编号', trigger: 'change' }],
  cInvName: [{ required: true, message: '请输入存货名称', trigger: 'change' }],
  IsBatch: [{ required: true, message: '请选择批次管理', trigger: 'blur' }],
  IsStore: [{ required: true, message: '请选择库存管理', trigger: 'blur' }]
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
    singerModels: unitData.value
  };
  try {
    const res = await addMaterial(data);
    if (res.success) {
      closeSelectedTag(route);
      router.push('/basematerial/WMSMaterial');
    }
  } catch {
    //
  }
}

function onClickAddBtn() {
  showAddUnitDialog.value = true;
  unitItemData.value = {};
}

function handleDeleteUnitItem(index) {
  unitData.value.splice(index, 1);
}

function handleSaveAddData() {
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

function closeSelectedTag(view) {
  tagsView.delVisitedView(view);
}

onActivated(() => {
  // fetchTags();
  fetchInOutTypes();
  fetchUnitTypes();
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
              label="存货分类"
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
            <el-form-item label="存货编号" label-width="150" prop="cInvCode">
              <el-input
                v-model="formData.cInvCode"
                autocomplete="off"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="存货名称" label-width="150" prop="cInvName">
              <el-input v-model="formData.cInvName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="存货规格" label-width="150" prop="cInvstd">
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
        </el-row>
      </el-card>

      <el-card>
        <el-tag type="primary" size="large">扩展信息</el-tag>
        <el-row :gutter="24" style="margin-top: 12px">
          <!--
          <el-col :span="6">
            <el-form-item label="标签" label-width="150" prop="cDefindParm01">
              <el-select-v2
                v-model="formData.cDefindParm01"
                multiple
                placeholder="请选择标签"
                style="width: 240px"
                :options="tagOptions"
              />
            </el-form-item>
          </el-col>
          -->

          <!--
          <el-col :span="6">
            <el-form-item
              label="BOM 模型名称"
              label-width="150"
              prop="cDefindParm03"
            >
              <el-input v-model="formData.cDefindParm03" autocomplete="off" />
            </el-form-item>
          </el-col>
          -->

          <el-col :span="6">
            <el-form-item
              label="SAP 物料编码"
              label-width="150"
              prop="cDefindParm04"
            >
              <el-input v-model="formData.cDefindParm04" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="每包数量"
              label-width="150"
              prop="iDefindParm12"
            >
              <el-input-number v-model="formData.iDefindParm12" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <div style="display: flex; justify-content: space-between">
          <el-tag type="primary" size="large">单位信息</el-tag>
          <el-button type="primary" @click="onClickAddBtn">添加</el-button>
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

  <el-dialog v-model="showAddUnitDialog" title="添加" width="600">
    <el-form :model="unitItemData">
      <el-form-item label="计量单位应用类型" label-width="150">
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
        <el-button type="primary" @click="handleSaveAddData"> 确定 </el-button>
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
</template>
