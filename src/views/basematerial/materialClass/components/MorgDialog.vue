<template>
  <!-- 物料分类新增弹窗  -->
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
              v-if="item.cControlTypeCode == 'TextBox'"
              v-model="ruleForm[item.cAttributeCode]"
              :disabled="disabledFun(item)"
            />
            <el-input
              v-if="item.cControlTypeCode == 'TextBoxLink'"
              :disabled="disabledFun(item)"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
            >
              <template #append>
                <el-icon @click="clickModel(item, item.IsMulitChoose)">
                  <MoreFilled />
                </el-icon>
              </template>
            </el-input>
            <el-radio-group
              v-if="item.cControlTypeCode == 'CheckBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="title == '物料分类详情' ? true : false"
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
  </div>
  <!-- 搜索弹框 -->
  <searchModel
    :dialogType="dialogType"
    :titleName="titleName"
    :codeType="codeType"
    :MulitChoose="MulitChoose"
    @ModelClose="ModelClose"
    @selectData="selectData"
  ></searchModel>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  defineProps,
  computed,
  watch,
  inject,
  reactive
} from 'vue';
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElIcon,
  ElInput,
  FormInstance
} from 'element-plus';
import { ParamsApi, DataApi } from '@/api/configApi/index';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import { MoreFilled } from '@element-plus/icons-vue';
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
const { tableAxios } = inject('tableAxios') as {
  tableAxios: () => void;
};
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
const { dialogType, titleName, codeType, MulitChoose, AttributeCode } =
  toRefs(data);
// 搜索弹框事件
const clickModel = (obj: any, type: any) => {
  MulitChoose.value = type;
  titleName.value = obj.Resource.cAttributeName;
  AttributeCode.value = obj.Resource.cAttributeCode;
  dialogType.value = true;
  codeType.value = obj.cIncludeModelCode;
};
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
const selectData = (val: any) => {
  console.log(val, 'val选中数据-------');

  // 单选
  if (val.type === false) {
    ruleForm.value[AttributeCode.value] = val.value[0][AttributeCode.value];
    ruleForm.value['cParentName'] = val.value[0].cInvClassName || '';
    ruleForm.value['cParentCode'] = val.value[0].cInvClassCode || '';
  } else {
    ElMessage({
      message: '重新配置',
      type: 'error'
    });
  }
  dialogType.value = false;
};
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

  //获取单行数据
  if (newValue.title !== '物料分类新增') {
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
const disabledFun = (item: any) => {
  //输入框禁用
  if (title.value == '物料分类详情') {
    return true;
  } else {
    return item.DefinedParm4 == 1 ? true : false;
  }
  // if(Route.name=='newApplication' ||Route.name=='newWorkshopMaterial' ||Route.name =='newWarehouseMaterial' ){
  //     return item.DefinedParm4 ==1?false:true
  // } else if(Route.name =='addFactory' || Route.name=='workSectionFileAdd'){
  //     return item.DefinedParm4 ==1?true:false
  // }else{
  //     return false
  // }
};

//提交
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
  if (!formEl) return;
  if (item.cAttributeCode == 'SaveAdd') {
    //新增
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: ruleForm.value
    };
    await formEl.validate((valid, fields) => {
      if (valid) {
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '新增成功'
            });
            dialogFormVisible.value = false;
            tableAxios();
          } else {
            ElMessage.error('新增失败');
          }
        });
      } else {
        console.log('error submit!', fields);
      }
    });
  } else if (item.cAttributeCode == 'SaveEdit') {
    ruleForm.value.UID = rowId.value.UID;
    ruleForm.value.utfs = rowId.value.utfs;
    //编辑
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: ruleForm.value
    };
    await formEl.validate((valid, fields) => {
      if (valid) {
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '修改成功'
            });
            dialogFormVisible.value = false;
            tableAxios();
            sessionStorage.remove('EditData');
            sessionStorage.remove('EditBtn');
          } else {
            ElMessage.error('修改失败');
          }
        });
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
