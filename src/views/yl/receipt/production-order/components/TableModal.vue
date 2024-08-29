<script setup>
import { ref, computed, watch } from 'vue';
import { ElLoading, ElMessage } from 'element-plus';
import { MoreFilled } from '@element-plus/icons-vue';
import { DataApi, configApi } from '@/api/configApi/index';
import { compare } from '@/utils';
import HeadArea from '@/components/ViewFormHeard/index.vue';
import TableArea from '@/components/MyFormTable/index_Edit.vue';
import ButtonArea from '@/components/Button/index.vue';
import SearchModel from '@/components/MultiSelect/searchModel.vue';

const props = defineProps({
  modelCode: {
    type: String,
    default: ''
  },
  modalResource: {
    type: Object,
    default: () => {}
  }
});

const emit = defineEmits(['submit']);

const show = ref(false);
const modalType = ref('');

const heads = ref([]);
const toolButtons = ref([]);
const tableColumns = ref([]);
const tableData = ref([]);
const headRef = ref(null);
const tableRef = ref(null);

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
    getConfig();
  }
);

const getConfig = async () => {
  if (!props.modalResource) return;
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });

  const { data, success } = await configApi(props.modelCode);

  if (success) {
    data.forEach(i => {
      const list = i.Parms.sort(compare('iIndex', true));
      switch (i.cPropertyClassTypeCode) {
        case 'Head':
          heads.value = list;
          break;
        case 'ToolBut':
          toolButtons.value = list;
          break;
        case 'Grid':
          tableColumns.value = list
            .filter(
              i => i.Resource.cAttributeTypeCode == 'property' && i.IsShow
            )
            .map(i => ({
              checkType: true,
              label: i.cShowName ?? i.Resource.cAttributeName,
              prop: i.Resource.cAttributeCode,
              headerSlot: true,
              slot: '',
              edit: i.DefinedParm4,
              lock: false,
              filters: [],
              cControlTypeCode: i.cControlTypeCode,
              cIncludeModelCode: i.cIncludeModelCode,
              cHttpTypeCode: i.Resource.cHttpTypeCode,
              cServerIP: i.Resource.cServerIP,
              cUrl: i.Resource.cUrl,
              cAttributeCode: i.Resource.cAttributeCode,
              DefinedParm4: i.DefinedParm4
            }));
          break;
        default:
          break;
      }
    });
  }

  tableColumns.value.push({
    checkType: true,
    label: '操作',
    slotName: 'button'
  });

  loading.close();
};

const getDetail = () => {};

const submitForm = () => {
  if (!tableRef.value.tableDataVal.length) {
    ElMessage.error('请添加销售订单');
    return;
  }
  switch (modalType.value) {
    case 'add':
      handleSaveAdd();
      break;
    case 'edit':
      handleSaveEdit();
      break;
    case 'view':
      break;
    default:
      break;
  }
};

// 添加销售订单
const handleAddOrder = val => {
  if (!headRef.value.ruleForm.cInvName) {
    ElMessage.error('请先选择产品');
    return;
  }
  if (!headRef.value.ruleForm.cInvCode) {
    ElMessage.error('缺少产品编码');
    return;
  }
  openSearchModal(val);
};

// 新增保存
const handleSaveAdd = () => {
  emit('submit', {
    data: {
      ...headRef.value.ruleForm,
      nQuantity: tableRef.value.tableDataVal.reduce(
        (acc, cur) => acc + Number(cur.nQuantity) ?? 0,
        0
      ),
      bodyss: [...tableRef.value.tableDataVal]
    },
    type: 'add'
  });
};

// 编辑保存
const handleSaveEdit = () => {
  emit('submit', {
    data: {
      ...headRef.value.ruleForm,
      bodyss: [...tableRef.value.tableDataVal]
    },
    type: 'edit'
  });
};

const resetForm = () => {
  headRef.value.ruleFormRef?.resetFields();
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

const deleteTableRow = scope => {
  tableRef.value.DelBtn(scope.$index);
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
const closeSearchModal = () => {
  searchModalOptions.value.show = false;
};

const handleSelectData = v => {
  const currentCode = searchModalOptions.value.code;
  // 单选
  if (!v.type) {
    const selectedData = v.value;
    switch (currentCode) {
      // 添加销售订单
      case 'AddOrder':
        tableRef.value.tableDataVal = selectedData;
        break;
      default:
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
    width="90%"
    @closed="resetForm"
  >
    <el-row>
      <ButtonArea :ToolBut="toolButtons" @add-order="handleAddOrder" />
      <HeadArea ref="headRef" :Head="heads" />
      <TableArea
        ref="tableRef"
        :table-columns="tableColumns"
        :table-data="tableData"
        table-border
        :disabled-hide="false"
      >
        <template #button>
          <el-table-column
            label="操作"
            fixed="right"
            width="160px"
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
                @click="deleteTableRow(scope)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </template>
      </TableArea>
      <el-col :span="24" style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="submitForm">
          {{ modalType === 'add' ? '添加' : '保存' }}
        </el-button>
        <el-button @click="resetForm">取消</el-button>
      </el-col>
    </el-row>
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
