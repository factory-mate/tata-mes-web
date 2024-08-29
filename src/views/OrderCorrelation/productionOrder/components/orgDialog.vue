<template>
  <!-- 新增弹窗  -->
  <div>
    <el-dialog
      v-model="RdialogFormVisible"
      :title="title"
      :close-on-click-modal="false"
      @open="clickOpen"
      aligin="center"
      width="500px"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <template v-for="item in formData" :key="item.UID">
          <el-form-item
            v-if="item.Resource.cAttributeCode !== 'Data'"
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
          >
            <!-- {{ item.cAttributeCode }} -->
            <!-- <el-input v-model="ruleForm[item.cAttributeCode]" :disabled="disabled" /> -->
            <el-date-picker
              v-if="item.cControlTypeCode == 'DatePicker'"
              v-model="ruleForm[item.cAttributeCode]"
              type="date"
              placeholder="请选择"
              clearable
              @change="clickchange"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :default-value="new Date()"
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DatePicker2'"
              v-model="ruleForm[item.cAttributeCode]"
              type="daterange"
              placeholder="请选择"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :default-value="new Date()"
              :disabled="disabled"
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker'"
              v-model="ruleForm[item.cAttributeCode]"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled="disabled"
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker4'"
              v-model="ruleForm[item.cAttributeCode]"
              type="datetimerange"
              placeholder="请选择"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled="disabled"
            />
            <!-- 下拉选择 -->
            <el-select
              v-if="
                item.cControlTypeCode == 'ComboBox' ||
                item.cControlTypeCode == 'CheckBox'
              "
              v-model="ruleForm[item.cAttributeCode]"
              placeholder="请输入"
              @change="(value:any)=>GetTreeRoad(item,value)"
              @visible-change="getTreeDAata"
              clearable
              @clear="clickclear"
            >
              <template v-for="(val, index) in selDataList" :key="index">
                <el-option :label="val.cCode" :value="val.cCode" />
              </template>
            </el-select>

            <div v-if="item.cAttributeCode === 'ImportData'">
              <el-upload
                ref="uploadRef"
                v-model:file-list="fileList"
                :limit="1"
                :auto-upload="false"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              >
                <el-button type="primary">上传文件</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef, item)"
            v-for="item in Btn"
            :key="item.UID"
            :disabled="isLoading"
          >
            {{ item.Resource.cAttributeName }}
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, computed, watch, inject, defineExpose } from 'vue';
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElInput,
  FormInstance
} from 'element-plus';
import { ParamsApi, DataApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
const ruleFormRef = ref<FormInstance>();
const ruleForm: any = ref({});
const RdialogFormVisible = ref(false);
const formData = ref([]) as any;
const title = ref();
const disabled = ref();
const rowId = ref();
const bindData = ref();
const Btn = ref();
const isLoading = ref(false);
const selDataList = ref([]) as any;
const uploadRef = ref<any>();
const fileList = ref<any>([]);
const { tableAxios } = inject('tableAxios') as {
  tableAxios: () => void;
};
const props = defineProps({
  formData: {
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
  disabled: {
    type: Boolean
  },
  sendIdArr: {
    type: Array as any
  },
  ids: {
    type: Array as any
  }
});
const id = ref('');
//form
watch(
  props,
  (newValue, oldValue) => {
    if (newValue.formData) {
      // setTimeout(()=>{
      //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //     // @ts-ignore
      //     ruleFormRef.value.resetFields()
      // },10)
      formData.value = JSON.parse(JSON.stringify(newValue.formData));
      console.log(formData.value, '--== formData.value');

      headVal();
    }
    title.value = newValue.title;
    Btn.value = newValue.Btn;
    id.value = newValue.ids;
  },
  { deep: true }
);
// watch(()=>ruleForm.value.dPlanDateStart,(val)=>{
//     console.log(ruleForm,"-ruleForm=1111");
//     console.log(val,"--vvvv");

//     if(!ruleForm.value.dPlanDateStart){
//         console.log(formData.value,"--===formData.value");

//         selDataList.value=[]
//         ruleForm.value.PlanCode=''
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     ruleFormRef.value?.resetFields()

//     }

// },{deep: true})
//处理form
const headVal = () => {
  let obj = {};
  formData.value.map((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[item.cAttributeCode] = '';
  });
  ruleForm.value = obj;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ruleFormRef.value?.resetFields();
};

//规则
const rules = computed(() => {
  let obj: any = {};
  formData.value
    .filter((item: { IsRequest: boolean }) => item.IsRequest === false)
    .map(
      (item: {
        Resource: { cAttributeCode: string | number; cAttributeName: any };
      }) => {
        if (item.Resource.cAttributeCode == 'ImportData') {
          //
        } else {
          obj[item.Resource.cAttributeCode] = [
            {
              required: true,
              trigger: 'blur',
              message: `请输入${item.Resource.cAttributeName}`
            }
          ];
        }
      }
    );
  return obj;
});
const KeyVal = ref([]) as any;
const utfs = ref([]) as any;
const Open = () => {
  RdialogFormVisible.value = true;
};
const close = () => {
  RdialogFormVisible.value = false;
};
defineExpose({ Open });
//提交
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
  if (!formEl) return;
  if (!ruleForm.value.dPlanDateStart) {
    ElMessage({
      type: 'info',
      message: '请选择日期'
    });
    return false;
  }

  isLoading.value = true;

  try {
    await formEl.validate();
    if (item.cAttributeCode == 'SaveEdit') {
      SaveEdit(item);
    }
    if (item.cAttributeCode == 'SaveEditPick') {
      SaveEditPick(item);
    }
    if (item.cAttributeCode == 'ImportPickOK') {
      SaveImportPick(item);
    }
  } catch (e) {
    console.log(e);
  }
  isLoading.value = false;
};
const time = ref();
//下拉框数据出现
const getTreeDAata = (v: any) => {
  if (v) {
    formData.value.forEach((item: any) => {
      if (
        item.cControlTypeCode == 'CheckBox' &&
        ruleForm.value.dPlanDateStart
      ) {
        let val = {};
        val = { Conditions: `dProductDate=${ruleForm.value.dPlanDateStart}` };
        let data = {
          method: item.Resource.cHttpTypeCode,
          url: item.Resource.cServerIP + item.Resource.cUrl,
          params: val
        };
        ParamsApi(data).then((res: any) => {
          selDataList.value = res.data;
        });
      } else {
        if (item.cControlTypeCode == 'ComboBox') {
          let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP + item.Resource.cUrl,
            params: {
              Conditions: `dProductDate=${ruleForm.value.dPlanDateStart}`
            }
          };
          ParamsApi(data).then((res: any) => {
            selDataList.value = res.data;
          });
        }
      }
    });
  }
};
const clickchange = () => {
  selDataList.value = [];
  ruleForm.value.PlanCode = '';
};
const clickclear = () => {
  console.log(formData, '--formData');
};
const clickOpen = (v: any) => {
  console.log(v, '-===');
};
const checkname = ref('') as any;
//下拉框变化时(原始订单的获取一级渠道的选中值)
const GetTreeRoad = (item: any, value: any) => {
  ruleForm.value.PlanCode = value;
  // if(item.cAttributeCode=="cDefindParm29"){
  //     checkname.value=value
  // }
};
const SaveEdit = (item: any) => {
  if (props.sendIdArr) {
    KeyVal.value = [];
    utfs.value = [];
  }
  props.sendIdArr.forEach((item: any) => {
    KeyVal.value.push(item.UID);
    utfs.value.push(item.utfs);
  });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      KeyVal: KeyVal.value,
      utfs: utfs.value,
      dDate: ruleForm.value.dPlanDateStart
    }
  };
  DataApi(data)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: res.msg || '成功'
        });
        close();
        tableAxios();
      } else {
        ElMessage.error('修改失败');
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};
const SaveEditPick = (item: any) => {
  if (props.sendIdArr) {
    KeyVal.value = [];
    utfs.value = [];
  }
  props.sendIdArr.forEach((item: any) => {
    KeyVal.value.push(item.UID);
    utfs.value.push(item.utfs);
  });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      // cProjectCode:'',
      PlanDate: ruleForm.value.dPlanDateStart,
      PlanCode: ruleForm.value.PlanCode,
      Ids: id.value
    }
  };

  DataApi(data)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: res.msg || '成功'
        });
        close();
        tableAxios();
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const SaveImportPick = item => {
  if (fileList.value.length === 0) {
    ElMessage({
      type: 'info',
      message: '请选择文件'
    });
    return;
  }
  const formData = new FormData();
  formData.append('file', fileList.value[0].raw);
  formData.append('planDate', ruleForm.value.dPlanDateStart);
  formData.append('planCode', ruleForm.value.PlanCode);

  let url = item.Resource.cServerIP + item.Resource.cUrl;

  url += `?planDate=${ruleForm.value.dPlanDateStart}&planCode=${ruleForm.value.PlanCode}`;

  let data = {
    method: item.Resource.cHttpTypeCode,
    url,
    data: formData
  };

  DataApi(data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: res.msg || '操作成功'
        });
        close();
        tableAxios();
      } else {
        ElMessage({
          message: res.msg || '操作失败',
          type: 'error'
        });
      }
    })
    .catch(err => {
      ElMessage({
        message: '操作失败',
        type: 'error'
      });
    })
    .finally(() => {
      isLoading.value = false;
    });
};
//取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  RdialogFormVisible.value = false;
};
</script>

<style scoped lang="scss"></style>
