<template>
  <!-- 新增弹窗  -->
  <div>
    <el-dialog
      v-model="dialogFormVisible"
      :title="title"
      draggable
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <template v-for="item in FormData" :key="item.UID">
          <el-form-item
            v-if="
              item.Resource.cAttributeCode !== 'Data' && item.IsShow == true
            "
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
          >
            <el-input
              :disabled="disabled"
              v-if="item.cControlTypeCode == 'TextBoxLink'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
            >
              <template #append>
                <el-icon @click="clickModel(item, item.IsMulitChoose)">
                  <MoreFilled />
                </el-icon>
              </template>
            </el-input>
            <el-input-number
              :disabled="disabled"
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Int'
              "
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
              style="width: 220px"
            />
          </el-form-item>
        </template>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef, item)"
            v-for="item in Btn"
            :key="item.UID"
          >
            {{ item.Resource.cAttributeName }}
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 搜索弹框 -->
    <searchModel
      :dialogType="dialogType"
      :titleName="titleName"
      :codeType="codeType"
      :MulitChoose="MulitChoose"
      @ModelClose="ModelClose"
      @selectData="selectData"
    ></searchModel>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  defineProps,
  computed,
  watch,
  inject,
  reactive,
  toRefs
} from 'vue';
import { MoreFilled } from '@element-plus/icons-vue';
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElInput,
  FormInstance
} from 'element-plus';
import { ParamsApi, DataApi } from '@/api/configApi/index';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import { sessionStorage } from '@/utils/storage';
const ruleFormRef = ref<FormInstance>();
const ruleForm: any = ref({});
const dialogFormVisible = ref();
const FormData = ref([]) as any;
const title = ref();
const disabled = ref();
const rowId = ref();
const bindData = ref();
const Btn = ref();
const { tableDataAxios } = inject('tableDataAxios') as {
  tableDataAxios: () => void;
};
//弹窗组件事件
const data = reactive({
  dialogType: false,
  titleName: '标题',
  AttributeCode: '',
  MulitChoose: false, //判断弹框组件单选或多选
  codeType: '',
  ButObjData: {} as any, //按钮配置数据
  form: {
    name: '',
    date: null,
    optVal: '',
    project: ''
  },
  options: [
    {
      value: '1',
      label: '是'
    },
    {
      value: '2',
      label: '否'
    }
  ]
});
const {
  dialogType,
  titleName,
  codeType,
  ButObjData,
  MulitChoose,
  AttributeCode
} = toRefs(data);
const props = defineProps({
  FormData: {
    required: true,
    type: Array as any,
    default: () => []
  },
  title: {
    type: String,
    default: () => {
      return '';
    }
  },
  Btn: {
    type: Array as any
  },
  dialogFormVisible: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  disabled: {
    type: Boolean
  },
  row: {
    type: Object
  }
});
const Mid = ref();
//form
watch(props, (newValue, oldValue) => {
  if (newValue.FormData) {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ruleFormRef.value.resetFields();
    }, 10);
    FormData.value = newValue.FormData;
    headVal();
  }
  dialogFormVisible.value = newValue.dialogFormVisible;
  title.value = newValue.title;
  Btn.value = newValue.Btn;
  //单行数据获取的UID
  rowId.value = newValue.row;
  //输入框禁用
  if (newValue.title == '关联详情') {
    disabled.value = newValue.disabled;
  } else {
    disabled.value = false;
  }
  //获取单行数据
  if (newValue.title !== '关联新增') {
    FormData.value.forEach(
      (item: { Resource: { cAttributeTypeCode: string } }) => {
        if (item.Resource.cAttributeTypeCode == 'binddata') {
          bindData.value = item;
          sendRow();
        }
      }
    );
  }
});
//获取单行数据
const sendRow = () => {
  let data = {
    method: bindData.value.Resource.cHttpTypeCode,
    url: bindData.value.Resource.cServerIP + bindData.value.Resource.cUrl,
    params: {
      val: rowId.value.UID
    }
  };
  ParamsApi(data).then(res => {
    if (res.status == 200) {
      ruleForm.value = res.data;
    } else {
      console.log('失败');
    }
  });
};
//处理form
const headVal = () => {
  let obj = {};
  FormData.value.map((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[item.cAttributeCode] = '';
  });
  ruleForm.value = obj;
};

//规则
const rules = computed(() => {
  let obj: any = {};
  FormData.value
    .filter((item: { IsRequest: boolean }) => item.IsRequest === true)
    .map(
      (item: {
        Resource: { cAttributeCode: string | number; cAttributeName: any };
      }) => {
        obj[item.Resource.cAttributeCode] = [
          {
            required: true,
            trigger: 'blur',
            message: `请输入${item.Resource.cAttributeName}`
          }
        ];
      }
    );
  return obj;
});

// 搜索弹框事件
const clickModel = (obj: any, type: any) => {
  MulitChoose.value = type;
  titleName.value = obj.Resource.cAttributeName;
  AttributeCode.value = obj.Resource.cAttributeCode;
  dialogType.value = true;
  codeType.value = obj.cIncludeModelCode || '';
};
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
const ProgCode = ref();
//弹框勾选数据
const selectData = (val: any) => {
  console.log(val, '弹框勾选数据');
  //获取项目编码
  val.value.forEach((item: { cProgramCode: any }) => {
    if (item.cProgramCode) {
      ProgCode.value = item;
    }
  });
  // 单选
  if (val.type === false) {
    ruleForm.value[AttributeCode.value] = val.value[0][AttributeCode.value];
    if (AttributeCode.value == 'cProgramName') {
      ruleForm.value['cProgramCode'] = ProgCode.value['cProgramCode'] || '';
    }
  } else {
    ElMessage({
      message: '重新配置',
      type: 'error'
    });
  }
  dialogType.value = false;
};
//提交
const mid = sessionStorage.get('MId');
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
  if (!formEl) return;
  if (item.cAttributeCode == 'SaveAdd') {
    //新增
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: {
        cProgramName: ruleForm.value.cProgramName,
        cProgramCode: ruleForm.value.cProgramCode,
        iIndex: ruleForm.value.iIndex,
        Mid: mid
      }
    };
    await formEl.validate((valid, fields) => {
      if (valid) {
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '新增成功'
            });
            tableDataAxios();
          } else {
            ElMessage.error('新增失败');
          }
        });
        dialogFormVisible.value = false;
      } else {
        console.log('error submit!', fields);
      }
    });
  } else if (item.cAttributeCode == 'SaveEdit') {
    //编辑
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: {
        cProgramName: ruleForm.value.cProgramName,
        cProgramCode: ruleForm.value.cProgramCode,
        iIndex: ruleForm.value.iIndex,
        Mid: rowId.value.MID,
        UID: rowId.value.UID,
        utfs: rowId.value.utfs
      }
    };
    await formEl.validate((valid, fields) => {
      if (valid) {
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            });
            tableDataAxios();
            sessionStorage.remove('EditData');
            sessionStorage.remove('EditBtn');
          } else {
            ElMessage.error('修改失败');
          }
        });
        dialogFormVisible.value = false;
      } else {
        ElMessage.info('验证不通过');
      }
    });
  } else {
    dialogFormVisible.value = false;
    ElMessage.info('请打开编辑弹窗');
  }
};

//取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogFormVisible.value = false;
};
</script>

<style scoped lang="scss"></style>
