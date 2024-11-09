<script setup>
import { getTags } from '@/api/material';
import { ref, onActivated } from 'vue';

const ruleFormRef = ref(null);
const formData = ref({
  cInvClassCode: '',
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

const rules = ref({
  cInvClassCode: [
    { required: true, message: '请输入存货编号', trigger: 'change' }
  ],
  cInvName: [{ required: true, message: '请输入存货名称', trigger: 'change' }],
  IsBatch: [{ required: true, message: '请选择批次管理', trigger: 'blur' }],
  IsStore: [{ required: true, message: '请选择库存管理', trigger: 'blur' }],
  cDefindParm01: [{ required: true, message: '请选择标签', trigger: 'change' }]
});

function fetchTags() {
  getTags().then(res => {
    tagOptions.value = res.data.map(item => ({
      label: item.cDictonaryName,
      value: item.cDictonaryCode
    }));
  });
}

function handleSubmit() {
  console.log(formData);
  console.log(unitData);
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

onActivated(() => {
  fetchTags();
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
              label="存
              货分类"
              label-width="150"
              prop="cInvClassName"
            >
              <el-input v-model="formData.cInvClassName" autocomplete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="存货编号"
              label-width="150"
              prop="cInvClassCode"
            >
              <el-input v-model="formData.cInvClassCode" autocomplete="off" />
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
              <el-switch
                v-model="formData.IsBatch"
                inline-prompt
                active-text="是"
                inactive-text="否"
              />
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
              <el-input v-model="formData.cVendorName" autocomplete="off" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card>
        <el-tag type="primary" size="large">库管信息</el-tag>
        <!-- <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            是否库存预警：{{ wmsData.IsWarn ? '是' : '否' }}
          </el-col>
          <el-col :span="6"> 安全库存量：{{ wmsData.nSafeQuinity }} </el-col>
          <el-col :span="6"> 最高库存量：{{ wmsData.nMaxQuinity }} </el-col>
          <el-col :span="6"> 最低库存量：{{ wmsData.nMinQuinity }} </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6"> 预警规则：{{ wmsData.cWarnRuleCode }} </el-col>
          <el-col :span="6"> 出入库方式：{{ wmsData.cInOutTypeCode }} </el-col>
          <el-col :span="6"> 默认仓库：{{ wmsData.cWareHouseCode }} </el-col>
          <el-col :span="6">
            默认库区：{{ wmsData.cWareHouseAreaCode }}
          </el-col>
        </el-row>
        <el-row :gutter="24" style="margin-top: 12px">
          <el-col :span="6">
            默认库位：{{ wmsData.cWareHouseLocationCode }}
          </el-col>
        </el-row> -->
      </el-card>

      <el-card>
        <el-tag type="primary" size="large">扩展信息</el-tag>
        <el-row :gutter="24" style="margin-top: 12px">
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

          <el-col :span="6">
            <el-form-item
              label="BOM 模型名称"
              label-width="150"
              prop="cDefindParm03"
            >
              <el-input v-model="formData.cDefindParm03" autocomplete="off" />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="SAP 物料编码"
              label-width="150"
              prop="cDefindParm04"
            >
              <el-input v-model="formData.cDefindParm04" autocomplete="off" />
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
          <el-table-column prop="cUnitCode" label="主计量单位名称" />
          <el-table-column prop="cAssUnitCode" label="辅计量单位名称" />
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
        <el-select v-model="unitItemData.cUnitTypeName" placeholder="请选择">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="主计量单位名称" label-width="150">
        <el-input v-model="unitItemData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="辅计量单位名称" label-width="150">
        <el-input v-model="unitItemData.name" autocomplete="off" />
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
</template>
