<template>
  <!-- 新增/编辑/详情弹窗  -->
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
            <!-- {{ item.Resource.cAttributeCode }} -->
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
            <el-select
              v-if="item.cControlTypeCode == 'ComboBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :multiple="false"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabledFun(item)"
              clearable
              filterable
              remote
              remote-show-suffix
              :remote-method="(query:any)=>remoteMethod(item,query)"
              @visible-change="(value:any) => selectVisible(value,ruleForm[item.Resource.cAttributeCode + '_Data'],item)"
              @change="(value:any)=>GetTreeRoad(item,value)"
              style="width: 100%"
            >
              <template
                v-for="(val, index) in ruleForm[
                  item.Resource.cAttributeCode + '_Current_Data'
                ]"
                :key="index"
              >
                <!-- v-if="item.Resource.cAttributeCode == val.cDictonaryTypeCode" -->
                <!-- cCode 是寻线运算的 生产批次号 新增  -->
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
import { useRoute } from 'vue-router';
import { MoreFilled } from '@element-plus/icons-vue';
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
const EditData = ref();
const EditBtn = ref();
const selectItem = ref('') as any;
const { tableAxios } = inject('tableAxios') as {
  tableAxios: () => void;
};
const Route = useRoute();

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
const {
  dialogType,
  titleName,
  codeType,
  ButObjData,
  MulitChoose,
  AttributeCode
} = toRefs(data);
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
  if (newValue.title == '库位详情') {
    disabled.value = newValue.disabled;
  } else {
    disabled.value = false;
  }
  //获取单行数据
  if (newValue.title !== '库位新增') {
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
const disabledFun = (item: any) => {
  if (props.disabled) {
    return true;
  } else {
    return item.DefinedParm4 == 1 ? true : false;
  }
};
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
//仓库编码
const WareCode = ref();
//库区编码
const AreaCode = ref();
const selectData = (val: any) => {
  //获取仓库编码
  val.value.forEach((item: { cWareHouseCode: any }) => {
    if (item.cWareHouseCode) {
      WareCode.value = item;
    }
  });
  //库区编码
  val.value.forEach((item: { cWareHouseAreaCode: any }) => {
    if (item.cWareHouseAreaCode) {
      AreaCode.value = item;
    }
  });
  // 单选
  if (val.type === false) {
    ruleForm.value[AttributeCode.value] = val.value[0][AttributeCode.value];
    if (AttributeCode.value == 'cWareHouseName') {
      ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
    }
    if (AttributeCode.value == 'cWareHouseAreaName') {
      ruleForm.value['cWareHouseAreaCode'] =
        val.value[0].cWareHouseAreaCode || '';
    }
  } else {
    ElMessage({
      message: '重新配置',
      type: 'error'
    });
  }
  dialogType.value = false;
};
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

const GetTreeRoad = (item: any, value: any) => {
  if (Route.name === 'cargo') {
    if (item.cAttributeCode === 'cDefindParm01Name') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (ruleForm.value[item.cAttributeCode] == v.cDictonaryCode) {
              return v;
            }
          }
        );
      }
      ruleForm.value.cDefindParm01 = valData[0].cDictonaryCode;
      ruleForm.value.cDefindParm01Name = valData[0].cDictonaryName;
    }
    if (item.cAttributeCode === 'cDefindParm02Name') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (ruleForm.value[item.cAttributeCode] == v.cDictonaryCode) {
              return v;
            }
          }
        );
      }
      ruleForm.value.cDefindParm02 = valData[0].cDictonaryCode;
      ruleForm.value.cDefindParm02Name = valData[0].cDictonaryName;
    }
  }
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

const remoteMethod = (item: any, query: any) => {
  // getData(getDataVal.value)
  let list: any = JSON.parse(
    JSON.stringify(ruleForm.value[item.Resource.cAttributeCode + '_Data'] ?? [])
  );
  if (ruleForm.value[item.Resource.cAttributeCode + '_Data']?.length === 0) {
    if (query) {
      setTimeout(() => {
        ruleForm.value[item.Resource.cAttributeCode + '_Data'] = list.filter(
          (item: any) => {
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
        list.filter((item: any) => {
          return item.cDictonaryName
            .toLowerCase()
            .includes(query.toLowerCase());
        });
    }, 200);
  } else {
    ruleForm.value[item.Resource.cAttributeCode + '_Current_Data'] = list;
  }
};
const selectVisible = (v: any, obj: any, item: any) => {
  selectItem.value = item;
  if (v) {
    let obj = {
      Conditions: 'cDictonaryTypeCode=' + item.Resource.cAttributeCode
    };

    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      params: obj
    };
    ParamsApi(data).then(res => {
      if (res.status == 200) {
        ruleForm.value[item.Resource.cAttributeCode + '_Data'] = res.data;
        ruleForm.value[item.Resource.cAttributeCode + '_Current_Data'] =
          res.data;
      } else {
        console.log('失败');
      }
    });
  }
};
</script>

<style scoped lang="scss"></style>
