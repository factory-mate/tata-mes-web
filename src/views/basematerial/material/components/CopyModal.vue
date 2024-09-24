<script setup>
import { ref, computed, watch } from 'vue';
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElInput,
  ElLoading
} from 'element-plus';
import { MoreFilled } from '@element-plus/icons-vue';
import { DataApi, configApi } from '@/api/configApi/index';
import { compare } from '@/utils';
import SearchModel from '@/components/MultiSelect/searchModel.vue';

const props = defineProps({
  modalResource: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['refetchList']);

const show = ref(false);
const rules = ref({});
const formData = ref([]);
const btns = ref([]);
const ruleForm = ref({});
const ruleFormRef = ref(null);

const searchModalOptions = ref({
  show: false,
  title: '',
  code: '',
  modelCode: '',
  multiple: false
});

watch(
  () => show.value,
  async val => {
    if (!val) {
      return;
    }
    getConfig(props.modalResource.cIncludeModelCode);
  }
);

const getConfig = async code => {
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  const { data, success } = await configApi(code);
  if (success) {
    data.forEach(i => {
      const list = i.Parms.sort(compare('iIndex', true));
      switch (i.cPropertyClassTypeCode) {
        case 'Head':
          formData.value = list.filter(i => i.IsShow);
          rules.value = formData.value
            .filter(i => i.IsRequest)
            .reduce((acc, cur) => {
              acc[cur.Resource.cAttributeCode] = [
                {
                  required: true,
                  message: '请输入' + cur.Resource.cAttributeName,
                  trigger: 'blur'
                }
              ];
              return acc;
            }, {});
          ruleFormRef.value.resetFields();
          break;
        case 'ToolBut':
          btns.value = list;
          break;
      }
    });
  }
  getDetail();
  loading.close();
};

const getDetail = async () => {
  formData.value
    .filter(i => i.cAttributeTypeCode === 'binddata')
    .forEach(i => {
      const data = {
        method: i.Resource.cHttpTypeCode,
        url: i.Resource.cServerIP + i.Resource.cUrl,
        params: {
          cInvCode: window.sessionStorage.getItem('cInvCode')
        }
      };
      DataApi(data).then(res => {
        if (res.success) {
          ruleForm.value = res.data;
        } else {
          ElMessage.error('获取数据失败');
        }
      });
    });
};

const submitForm = async item => {
  if (!ruleFormRef.value) return;
  switch (item.cAttributeCode) {
    // 保存
    case 'SaveCopy':
      await handleSaveCopy(item);
      break;
    default:
      console.log(item.cAttributeCode);
      break;
  }
};

// 新增保存
const handleSaveCopy = async item => {
  const data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: ruleForm.value
  };
  try {
    await ruleFormRef.value.validate();
  } catch (e) {
    console.error(e);
    return;
  }
  const { success } = await DataApi(data);
  if (success) {
    ElMessage.success('新增成功');
    emit('refetchList');
    closeModal();
  } else {
    ElMessage.error('新增失败');
  }
};

const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
  closeModal();
};

const showModal = () => {
  show.value = true;
};

const closeModal = () => {
  show.value = false;
};

// 打开选择器弹窗
const openSearchModal = i => {
  searchModalOptions.value = {
    ...searchModalOptions.value,
    show: true,
    title: i.Resource.cAttributeName,
    code: i.Resource.cAttributeCode,
    multiple: i.IsMulitChoose,
    modelCode: i.cIncludeModelCode
  };
};

// 关闭选择器弹窗
const closeSearchModal = v => {
  searchModalOptions.value.show = false;
};

// 选择器选择数据
const handleSelectData = v => {
  const currentCode = searchModalOptions.value.code;
  // 单选
  if (!v.type) {
    const selectedData = v.value[0];
    switch (currentCode) {
      // 工位名称
      case 'cStationName':
        ruleForm.value['cStationName'] = selectedData.cPositionName;
        ruleForm.value['cStationCode'] = selectedData.cPositionCode;
        break;
      default:
        console.log(currentCode, selectedData);
        break;
    }
  } else {
    // 多选
  }
  searchModalOptions.value.show = false;
};

const GetTreeRoad = (item, value) => {};

const remoteMethod = (item, query) => {
  // getData(getDataVal.value)
  let list = JSON.parse(
    JSON.stringify(ruleForm.value[item.Resource.cAttributeCode + '_Data'])
  );
  if (ruleForm.value[item.Resource.cAttributeCode + '_Data'].length === 0) {
    if (query) {
      setTimeout(() => {
        ruleForm.value[item.Resource.cAttributeCode + '_Data'] = list.filter(
          item => {
            return item.cDictonaryName
              .toLowerCase()
              .includes(query.toLowerCase());
          }
        );
      }, 200);
    } else {
      ruleForm.value[item.Resource.cAttributeCode + '_Data'] = list;
    }
  }

  if (query) {
    setTimeout(() => {
      ruleForm.value[item.Resource.cAttributeCode + '_Current_Data'] =
        list.filter(item => {
          return item.cDictonaryName
            .toLowerCase()
            .includes(query.toLowerCase());
        });
    }, 200);
  } else {
    ruleForm.value[item.Resource.cAttributeCode + '_Current_Data'] = list;
  }
};

const selectVisible = (v, obj, item) => {};

const clearSelect = (v, item) => {};

const disabledFun = item => {
  return true;
};
defineExpose({ showModal, closeModal });
</script>

<template>
  <el-dialog
    v-model="show"
    title="复制"
    draggable
    width="60%"
    @closed="resetForm"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="150px"
      status-icon
    >
      <el-row>
        <template v-for="i in formData" :key="i.UID">
          <el-col :span="24">
            <el-form-item
              v-if="i.Resource.cAttributeCode !== 'ExtendData'"
              :label="i.Resource.cAttributeName + '：'"
              :prop="i.Resource.cAttributeCode"
            >
              <el-input
                v-if="i.cControlTypeCode == 'TextBoxLink'"
                v-model="ruleForm[i.cAttributeCode]"
                placeholder="请选择"
                disabled
              >
                <template #append>
                  <el-icon @click="openSearchModal(i)">
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>

              <el-select
                v-else-if="i.cControlTypeCode == 'ComboBox'"
                v-model="ruleForm[i.Resource.cAttributeCode]"
                :multiple="true"
                :placeholder="disabled ? '' : '请输入'"
                :disabled="disabledFun(i)"
                clearable
                filterable
                remote
                remote-show-suffix
                :remote-method="query => remoteMethod(i, query)"
                @change="value => GetTreeRoad(i, value)"
                @visible-change="
                  value =>
                    selectVisible(
                      value,
                      ruleForm[i.Resource.cAttributeCode + '_Data'],
                      i
                    )
                "
                @clear="value => clearSelect(i, value)"
                style="width: 100%"
              >
                <template
                  v-for="(val, index) in ruleForm[
                    i.Resource.cAttributeCode + '_Current_Data'
                  ]"
                  :key="index"
                >
                  <el-option
                    :label="
                      val.cDictonaryName ||
                      val.cStandardName ||
                      val.cAreaName ||
                      val.cProgramName ||
                      val.cWareHouseName ||
                      val.cCode
                    "
                    :value="
                      val.cDictonaryCode ||
                      val.cStandardCode ||
                      val.cAreaCode ||
                      val.cProgramCode ||
                      val.cWareHouseName ||
                      val.cCode
                    "
                  />
                </template>
              </el-select>

              <el-input
                v-else-if="i.cDataTypeCode == 'Nvarchar'"
                v-model="ruleForm[i.cAttributeCode]"
                clearable
              />
              <el-input v-else v-model="ruleForm[i.cAttributeCode]" disabled />
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24" style="text-align: center; margin-top: 20px">
          <el-button
            type="primary"
            @click="submitForm(btn)"
            v-for="btn in btns"
            :key="btn.UID"
          >
            {{ btn.Resource.cAttributeName }}
          </el-button>
          <el-button @click="resetForm">取消</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <SearchModel
    :dialog-type="searchModalOptions.show"
    :title-name="searchModalOptions.title"
    :code-type="searchModalOptions.modelCode"
    :mulit-choose="searchModalOptions.multiple"
    @model-close="closeSearchModal"
    @select-data="handleSelectData"
  />
</template>

<style lang="scss" scoped></style>
