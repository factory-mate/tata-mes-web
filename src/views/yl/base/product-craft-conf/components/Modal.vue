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
  },
  rowData: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['refetchList']);

const show = ref(false);
const modalType = ref('');
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

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'add':
      return '新增';
    case 'edit':
      return '编辑';
    case 'view':
      return '详情';
    default:
      return '';
  }
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
  if (modalType.value === 'add') {
    return;
  }
  formData.value
    .filter(i => i.cAttributeTypeCode === 'binddata')
    .forEach(i => {
      const data = {
        method: i.Resource.cHttpTypeCode,
        url: i.Resource.cServerIP + i.Resource.cUrl,
        params: {
          val: props.rowData.UID
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
    // 新增保存
    case 'SaveAdd':
      await handleSaveAdd(item);
      break;
    // 编辑保存
    case 'SaveEdit':
      await handleSaveEdit(item);
      break;
    case 'Edit':
      closeModal();
      ElMessage.info('请打开编辑弹窗');
      break;
    default:
      console.log(item.cAttributeCode);
      break;
  }
};

// 新增保存
const handleSaveAdd = async item => {
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

// 编辑保存
const handleSaveEdit = async item => {
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
    ElMessage.success('保存成功');
    emit('refetchList');
    closeModal();
  } else {
    ElMessage.error('保存失败');
  }
};

const resetForm = () => {
  if (!ruleFormRef.value) return;
  ruleFormRef.value.resetFields();
  closeModal();
};

const showModal = type => {
  show.value = true;
  modalType.value = type;
};

const closeModal = () => {
  show.value = false;
  modalType.value = '';
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
      // 工艺路线名称
      case 'cCraftRouteName':
        ruleForm.value['cCraftRouteName'] = selectedData.cCraftRouteName;
        ruleForm.value['cCraftRouteCode'] = selectedData.cCraftRouteCode;
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

defineExpose({ showModal, closeModal });
</script>

<template>
  <el-dialog
    v-model="show"
    :title="modalTitle"
    draggable
    width="500px"
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
              v-if="i.Resource.cAttributeCode !== 'Data'"
              :label="i.Resource.cAttributeName + '：'"
              :prop="i.Resource.cAttributeCode"
            >
              <template v-if="modalType === 'view'">
                <el-input v-model="ruleForm[i.cAttributeCode]" disabled />
              </template>

              <template v-else>
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

                <el-input
                  v-else-if="i.cDataTypeCode == 'Nvarchar'"
                  v-model="ruleForm[i.cAttributeCode]"
                  clearable
                />
              </template>
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
