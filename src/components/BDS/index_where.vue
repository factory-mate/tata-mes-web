<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';

const props = defineProps({
  Head: {
    required: false,
    type: Array,
    default: () => []
  },
  ruleForm: {
    required: false,
    type: Object,
    default: () => {}
  }
});
const emits = defineEmits(['changeRuleForm']);

const route = useRoute();
const hidden = ref(false);
const wdOptions = ref([]);
const operatorOptions = ref([]);
const rowId = ref('');
const lambdaData = ref([
  {
    cDimensionalityCode: '', // 维度
    cLamdaConditionTypeCode: '', // 条件
    cValueCode: '',
    cValueName: '',
    cConditionType: '1',
    isSelect: true,
    list_Model: []
  }
]);
const metadata = ref({});
const showDialog = ref(false);
const dialogCode = ref('');
const treeRef = ref();
const rootConditionType = ref('1');
const currentModalItem = ref({});

const getWDList = () => {
  let conditions = '';
  if (route.name === 'newProductPlan' || route.name === 'newProductPlanView') {
    conditions = 'cModelCode=TD001';
  }
  const cDataCode = window.sessionStorage.getItem('Where:cDataCode');
  if (
    (route.name === 'AddBusineScen' ||
      route.name === 'RuleAuditEdit' ||
      route.name === 'MaterialConfigDeductEdit') &&
    cDataCode
  ) {
    conditions = 'cModelCode=' + cDataCode;
  }
  const data = {
    method: 'get',
    url:
      import.meta.env.VITE_APP_DY_100_API +
      '/api/DIMENSIONALITY_MODEL_S/GetForList',
    params: {
      OrderByFileds: '',
      Conditions: conditions
    }
  };
  ParamsApi(data).then(res => {
    if (res.success) {
      wdOptions.value = res.data.map(i => ({
        ...i,
        label: i.cDimensionalityName,
        value: i.cDimensionalityCode
      }));
    }
  });
};

const getOperatorList = () => {
  const data = {
    method: 'get',
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetDicType',
    params: {
      cTableCode: 'FM_MES_SetLamda_S_S',
      cAttributeCode: 'cLamdaConditionType',
      where: ''
    }
  };
  ParamsApi(data).then(res => {
    if (res.success) {
      operatorOptions.value = res.data;
    }
  });
};

const getDetail = () => {
  const data = {
    method: 'get',
    url: import.meta.env.VITE_APP_DY_100_API + '/api/SetLamda/GetByMID',
    params: {
      MID: rowId.value
    }
  };
  ParamsApi(data).then(res => {
    if (res.success) {
      lambdaData.value = JSON.parse(res.data.cJsonContent);
    }
  });
};

const generateDefaultItem = isSelect => {
  return {
    cDimensionalityCode: '', // 维度
    cLamdaConditionTypeCode: '', //条件
    cValueCode: '',
    cValueName: '',
    cConditionType: '1',
    isSelect,
    list_Model: []
  };
};

const clickSelectBtn = item => {
  const wdItem = wdOptions.value.find(
    v => v.cDimensionalityCode == item.data.cDimensionalityCode
  );

  if (!wdItem?.cDictonaryTypeCode) {
    ElMessage({
      message: '未配置 cDictonaryTypeCode',
      type: 'error'
    });
    return;
  } else {
    metadata.value = {
      cDictonaryTypeCode: wdItem.cDictonaryTypeCode
    };
  }

  if (!metadata.value.cDictonaryTypeCode) {
    ElMessage({
      message: '请先选择维度',
      type: 'error'
    });
    return;
  }

  showDialog.value = true;
  item.data.isSelect = true;
  item.data.cValueCode = '';
  item.data.cValueName = '';
  currentModalItem.value = item;
  dialogCode.value = 'ManageCenter.SYS_DICTONARY.M.FormList';
};

const selectData = val => {
  showDialog.value = val.type;
  currentModalItem.value.data.cValueCode = val.value[0].cDictonaryCode;
  currentModalItem.value.data.cValueName = val.value[0].cDictonaryName;
};

const handleClickInput = node => {
  node.data.isSelect = false;
  node.data.cValueCode = '';
  node.data.cValueName = '';
};

const handleAddItem = node => {
  treeRef.value.insertAfter(generateDefaultItem(true), node);
};

const handleAddChildItem = node => {
  treeRef.value.append(generateDefaultItem(true), node);
};

const handleRemoveItem = node => {
  if (lambdaData.value.length === 1) {
    ElMessage({
      message: '至少保留一个条件',
      type: 'error'
    });
    return;
  }
  treeRef.value.remove(node);
};

const selectVisible = prop => {
  if (prop) {
    getWDList();
    getOperatorList();
  }
};

const generateLambda = () => {
  // // 递归处理 lambdaData，cDimensionalityCode，cLamdaConditionTypeCode，cValueName 必须有值
  const recursion = data => {
    data.forEach(item => {
      if (
        item.cDimensionalityCode &&
        item.cLamdaConditionTypeCode &&
        item.cValueName
      ) {
        if (item.children && item.children.length > 0) {
          item.list_Model = item.children;
          recursion(item.children);
        }
      }
    });
  };

  recursion(lambdaData.value);

  const data = {
    method: 'post',
    url:
      import.meta.env.VITE_APP_DY_100_API +
      '/api/SetLamda/BuildLamdaOnRecursion',
    data: {
      MID: route.params.rowId,
      list_Model: lambdaData.value
      // cConditionType: rootConditionType.value
    }
  };

  const models = [];

  // 递归获取 cDimensionalityCode，MID
  const recursionData = data => {
    data.forEach(item => {
      if (item.cDimensionalityCode) {
        models.push({
          cDimensionalityCode: item.cDimensionalityCode,
          MID: route.params.rowId
        });
        if (item.children && item.children.length > 0) {
          recursionData(item.children);
        }
      }
    });
  };

  recursionData(lambdaData.value);

  DataApi(data).then(res => {
    if (res.success) {
      props.ruleForm.cLamda = res.data;
      props.ruleForm.models = models;
    } else {
      ElMessage({
        message: res.msg || '生成失败',
        type: 'error'
      });
    }
  });
};

const resetData = () => {
  lambdaData.value = [generateDefaultItem(true)];
};

const closeModal = val => {
  showDialog.value = val.type;
};

onMounted(() => {
  rowId.value = route.params.rowId;
  if (route.meta.title.match(/详情/gi) && route.name !== 'newProductPlanView') {
    hidden.value = true;
  }
  if (route.meta.title.match(/详情/gi) || route.meta.title.match(/编辑/gi)) {
    getDetail();
  }
  getWDList();
  getOperatorList();
});

defineExpose({ resetData });
</script>

<template>
  <div
    style="
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 20px;
    "
    v-if="!hidden"
  >
    <div style="display: flex; width: 100%">
      <el-switch
        style="margin: 5px 10px"
        v-if="false"
        v-model="rootConditionType"
        size="small"
        active-text="且"
        inactive-text="或"
        active-value="1"
        inactive-value="0"
      />
      <el-tree
        style="width: 100%"
        ref="treeRef"
        :data="lambdaData"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node, data }">
          <div>
            <el-switch
              v-if="node.previousSibling"
              style="margin: 0 10px"
              v-model="data.cConditionType"
              size="small"
              active-text="且"
              inactive-text="或"
              active-value="1"
              inactive-value="0"
            />
            <el-select-v2
              v-model="data.cDimensionalityCode"
              clearable
              filterable
              placeholder="选择维度"
              style="width: 220px"
              :options="wdOptions"
              @visible-change="selectVisible"
            />
            <el-select
              v-model="data.cLamdaConditionTypeCode"
              clearable
              placeholder="选择操作符"
              style="width: 220px; margin-left: 10px"
              @visible-change="selectVisible"
            >
              <el-option
                v-for="item in operatorOptions"
                :key="item.cDictonaryCode"
                :label="item.cDictonaryName"
                :value="item.cDictonaryCode"
              />
            </el-select>
            <template v-if="data.isSelect">
              <el-input
                v-model="data.cValueName"
                placeholder="请选择"
                disabled
                style="width: 220px; margin-left: 10px"
                clearable
              />
            </template>
            <template v-else>
              <el-input
                v-model="data.cValueName"
                placeholder="请输入"
                style="width: 220px; margin-left: 10px"
                clearable
              />
            </template>

            <el-button
              type="primary"
              @click="() => clickSelectBtn(node)"
              style="margin-left: 10px"
              :icon="Search"
              circle
            >
            </el-button>
            <el-button
              type="primary"
              @click="() => handleClickInput(node)"
              :icon="Edit"
              circle
            >
            </el-button>
            <el-button
              type="primary"
              @click="() => handleAddItem(node)"
              :icon="Plus"
              circle
            >
            </el-button>
            <el-button
              type="primary"
              @click="() => handleAddChildItem(node)"
              circle
            >
              <el-icon style="vertical-align: middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3z"
                  />
                </svg>
              </el-icon>
            </el-button>
            <el-button
              type="danger"
              style="margin-left: 8px"
              @click="() => handleRemoveItem(node)"
              :icon="Delete"
              circle
            >
            </el-button>
          </div>
        </template>
      </el-tree>
    </div>
    <el-button type="danger" @click="generateLambda"> 生成表达式 </el-button>
    <searchModel
      :dialogType="showDialog"
      titleName="选择"
      :codeType="dialogCode"
      :MulitChoose="false"
      @ModelClose="closeModal"
      @selectData="selectData"
      :metadata="metadata"
    ></searchModel>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-tree) {
  --el-tree-node-content-height: 40px;
}
</style>
