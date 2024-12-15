<!-- eslint-disable vue/no-unused-vars -->
<template>
  <!-- 导入确认弹窗  -->
  <div class="Export">
    <el-dialog
      v-model="dialogFormVisible"
      :title="title"
      @close="resetForm(ruleFormRef)"
      width="85%"
      draggable
      :before-close="BeforeClose"
      :modal="false"
      :close-on-click-modal="false"
      @open="clickOpen"
      top="5vh"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <span :id="titleId" :class="titleClass">{{ title }}</span>
          <span class="IconSty" @click="BeforeClose"
            ><el-icon><Close /></el-icon
          ></span>
        </div>
      </template>
      <el-form
        ref="ruleFormRef"
        v-if="FormDatas.length"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        status-icon
      >
        <template v-for="item in FormDatas" :key="item.UID">
          <el-form-item
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
            v-if="item.IsShow && item.Resource.cAttributeTypeCode != 'binddata'"
          >
            <el-input
              class="input-item"
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              :disabled="disabled"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
            />
            <el-input
              v-if="
                item.cControlTypeCode == 'RichText' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              :rows="2"
              type="textarea"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              style="min-width: 220px"
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Int'
              "
              :disabled="disabled"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              style="width: 220px"
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Decimal'
              "
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              style="width: 220px"
              :disabled="disabled"
            />
            <el-input
              v-if="item.cControlTypeCode == 'PassWord'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabled"
            />
            <el-input
              v-if="item.cControlTypeCode == 'TextBoxLink'"
              @change="TextBoxLink"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabled"
            >
              <template #append>
                <el-icon
                  v-if="!props.disabled"
                  @click="clickModel(item, item.IsMulitChoose)"
                >
                  <MoreFilled />
                </el-icon>
                <el-icon v-else>
                  <MoreFilled />
                </el-icon>
              </template>
            </el-input>
            <el-select
              v-if="item.cControlTypeCode == 'ComboBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabled"
            >
              <template v-for="(val, index) in item.selDataList" :key="index">
                <!-- v-if="item.Resource.cAttributeCode == val.cDictonaryTypeCode" -->
                <el-option
                  :label="val.cDictonaryName"
                  :value="val.cDictonaryCode"
                />
              </template>
            </el-select>
            <!-- 日期 -->
            <el-date-picker
              v-if="item.cControlTypeCode == 'DatePicker'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :default-value="new Date()"
              :disabled="disabledFun(item)"
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DatePicker2'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
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
              v-model="ruleForm[item.Resource.cAttributeCode]"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled="disabled"
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker4'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              type="datetimerange"
              placeholder="请选择"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled="disabled"
            />
            <el-radio-group
              v-if="item.cControlTypeCode == 'CheckBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              style="width: 220px"
              :disabled="disabled"
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
      </el-form>
      <!-- 过滤区域 -->
      <!-- <div>
                <FilterForm  :Filter="FormDatas" @ClickSearch="ClickSearch" @resetForm="FilresetForm">
            </FilterForm>
            </div> -->
      <!-- 按钮区域 -->
      <ButtonViem
        :ToolBut="Btn"
        @ClickExportSave="ClickExportSave"
        @ExpotrTableData="GetData"
      ></ButtonViem>
      <!-- 表格区域 -->
      <div>
        <myTable
          ref="TabRef"
          v-if="tabType"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="true"
          @tableHearData="tableHearData"
          @handleSelectionChange="handleSelectionChange"
          :tableHeight="'300px'"
        >
          <template #button>
            <el-table-column
              label="操作"
              fixed="right"
              width="200px"
              align="center"
            >
              <template #header>
                <span>操作</span>
                <myPopup
                  :list="tableColumns"
                  @newList="newList"
                  @renew="renew"
                ></myPopup>
              </template>
              <template #default="scope">
                <template
                  v-for="item in tableButton"
                  :key="item.Resource.cAttributeName"
                >
                  <el-button
                    v-if="item.iIndex < 3"
                    type="primary"
                    size="small"
                    @click="clickTableBut(scope, item)"
                  >
                    {{ item.Resource.cAttributeName }}
                  </el-button>
                </template>
                <el-dropdown
                  style="margin-left: 10px"
                  v-if="tableButton.length > 3"
                >
                  <el-button type="primary" size="small">
                    <el-icon>
                      <MoreFilled />
                    </el-icon>
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="item in tableButton.filter((v: any) => [0, 1].indexOf(v.iIndex) == -1)"
                        :key="item.Resource.cAttributeName"
                      >
                        <el-button
                          type="primary"
                          size="small"
                          @click="clickTableBut(scope, item)"
                        >
                          {{ item.Resource.cAttributeName }}
                        </el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </template>
        </myTable>
        <pagination
          v-if="total > 0"
          :total="total"
          v-model:page="queryParams.PageIndex"
          v-model:limit="queryParams.PageSize"
          @pagination="changPage"
        />
      </div>
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
  defineProps,
  computed,
  watch,
  inject,
  defineEmits,
  reactive,
  toRefs,
  nextTick
} from 'vue';
import {
  ElForm,
  ElFormItem,
  ElMessage,
  ElInput,
  FormInstance,
  ElMessageBox
} from 'element-plus';
import { configApi, DataApi, ParamsApi, delApi } from '@/api/configApi/index';
import { ArrowDown, MoreFilled, Close } from '@element-plus/icons-vue';
import { localStorage, sessionStorage } from '@/utils/storage';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import router from '@/router';
import { useRoute } from 'vue-router';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import ButtonViem from '@/components/Button/index.vue';
import FilterForm from '@/components/Filter/index.vue';
import myPopup from '@/components/Popup/index.vue';
const Route = useRoute();
const ruleFormRef = ref<FormInstance>();
const ruleForm: any = ref({});
const dialogFormVisible = ref();
const FormDatas = ref([]) as any;
const Btn = ref([]) as any;
const title = ref();
const disabled = ref(false);
const rowId = ref();
const bindData = ref();
const AttributeCode = ref('');
//过滤
let Filter = ref([]) as any;
// 表格配置数据
const TabRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const tabType = ref(true);
const CheckTableArr = ref([]) as any;
//故障档案保存时的编码
const sendFalutCode = ref();
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//总条数
const total = ref(0);
//表格数据
const tableData = ref([] as any);

//弹窗组件事件
const data = reactive({
  Conditions: '',
  OrderByFileds: '',
  dialogType: false,
  titleName: '标题',
  codeType: '',
  FilterData: [] as any,
  MulitChoose: false, //判断弹框组件单选或多选
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
  FilterData,
  MulitChoose,
  Conditions,
  OrderByFileds
} = toRefs(data);
const props = defineProps({
  objData: {
    type: Object,
    required: true,
    default: () => {}
  },
  row: {
    type: Object,
    required: true,
    default: () => {}
  },
  title: {
    type: String,
    default: () => {
      return '';
    }
  },
  disabled: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  dialogFormVisible: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  modeCode: {
    type: String,
    default: () => {
      return '';
    }
  }
});
const { tableAxios } = inject('tableAxios') as {
  tableAxios: () => void;
};
//form
watch(props, (newValue, oldValue) => {
  dialogFormVisible.value = newValue.dialogFormVisible;
  title.value = newValue.title;

  //单行row
  rowId.value = newValue.row;
  if (newValue.row) {
    ruleForm.value = newValue.row;
  }
});
watch(
  () => props.dialogFormVisible,
  newValue => {
    dialogFormVisible.value = newValue;
  }
);
watch(
  () => props.modeCode,
  (newValue, oldValue) => {
    headVal();
    getData(newValue);
  }
);
watch(
  () => Btn.value,
  (newValue, oldValue) => {
    GetData('');
  }
);
const emits = defineEmits(['FmodelClose']);
// 搜索弹框事件
const clickModel = (
  obj: {
    Resource: { cAttributeName: string; cAttributeCode: string };
    cIncludeModelCode: string;
  },
  type: any
) => {
  MulitChoose.value = type;
  titleName.value = obj.Resource.cAttributeName;
  AttributeCode.value = obj.Resource.cAttributeCode;
  dialogType.value = true;
  codeType.value = obj.cIncludeModelCode;
};
const clickOpen = () => {};
// 搜索弹框事件
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
const clickTableBut = (scope: any, item: any) => {
  console.log(scope, item);
};
//搜索弹框数据选择
const selectData = (val: any) => {
  dialogType.value = val.type;
};
//获取表格的数据
const sendData = ref({}) as any;
const GetData = (data: any) => {
  tableData.value = data?.bodysssDtos;
  sendData.value = data;
  let obj = {};
  FormDatas.value.map((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[item.cAttributeCode] = '';
  });
  ruleForm.value = obj;
  if (data?.headDto) {
    ruleForm.value = data?.headDto;
  }
};
const TitleMes = ref(false);
//导入二次确认保存
const ClickExportSave = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendData.value
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '保存成功'
      });
      TitleMes.value = true;
      tableData.value = [];
      ruleForm.value = {};
      tableAxios();
    } else {
      ElMessage.error('保存失败');
    }
  });
};
//弹窗关闭前的确认信息
const BeforeClose = (done: any) => {
  if (TitleMes.value == false) {
    ElMessageBox.confirm('数据还未保存，确定放弃保存?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        tableData.value = [];
        dialogFormVisible.value = false;
      })
      .catch(() => {
        console.log('取消');
      });
  } else {
    dialogFormVisible.value = false;
  }
};

//手动输入弹框数据
const TextBoxLink = () => {};
// FORM数据
const getData = (obj: any) => {
  FormDatas.value = [];
  Btn.value = [];
  configApi(obj).then(res => {
    if (res.status === 200) {
      Filter.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          FormDatas.value = item[import.meta.env.VITE_APP_key];
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // ruleFormRef.value.resetFields()
          }, 10);
          getSelData();
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          Btn.value = item[import.meta.env.VITE_APP_key];
        }
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
      });
    }
  });
};
//处理form
const headVal = () => {
  let obj = {};
  FormDatas.value.map((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[item.cAttributeCode] = '';
  });
  ruleForm.value = obj;
};
// table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: []
      };
      tableColumns.value.push(itemData);
    }
    if (item.Resource.cAttributeTypeCode == 'method') {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      tableButton.value.push(item);
      tableColumns.value.push(itemData);
      tableColumns.value = tableColumns.value.filter(
        (item: { label: any }, index: any, self: any[]) => {
          // 利用findIndex方法找到第一个与当前元素id相等的元素索引
          const i = self.findIndex(
            (t: { label: any }) => t.label === item.label
          );
          // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
          return i === index;
        }
      );
    }
    if (item.Resource.cAttributeTypeCode == 'binddata') {
      AxiosData.value = item;
      TtableAxios();
    }
  });
};

//表格数据查询
const TtableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };

  const res = await DataApi(data);
  if (res.status == 200) {
    tableData.value = res.data.data.map(
      (item: { IsValid: string | boolean }) => {
        return {
          ...item,
          IsValid: item.IsValid ? '是' : '否'
        };
      }
    );
    total.value = res.data.dataCount;
    tablefilter();
    TabRef.value.handleRemoveSelectionChange();
  } else {
    console.log('请求出错');
  }
};
//表格多选
const handleSelectionChange = (arr: any) => {
  CheckTableArr.value = arr;
};
// table filters
const tablefilter = () => {
  tableColumns.value.forEach((aItem: any) => {
    let filData = [] as any;
    tableData.value.forEach((bItem: any) => {
      if (bItem[aItem.prop]) {
        filData.push({ text: bItem[aItem.prop], value: bItem[aItem.prop] });
        aItem.filters = filData;
      }
    });
    if (aItem.filters && aItem.filters.length) {
      aItem.filters = aItem.filters.filter(
        (item: { text: any }, index: any, self: any[]) => {
          const i = self.findIndex((t: { text: any }) => t.text === item.text);
          return i === index;
        }
      );
    }
  });
};
// table  排序
const tableHearData = (val: any) => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  TtableAxios();
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

//规则
const rules = computed(() => {
  let obj: any = {};
  FormDatas.value
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

//提交
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
  if (!formEl) return;
  formEl.validate((valid, fields) => {
    if (valid) {
      console.log(item.cAttributeCode, 'but');

      switch (item.cAttributeCode) {
        case 'SaveAdd':
          SaveAdd(item);
          break;
        case 'SaveEdit':
          SaveEdit(item);
          break;
        case 'BtnOK':
          BtnOK(item);
          break;
        case 'BtnClearTypeOK':
          BtnClearTypeOK(item);
          break;
        case 'BtnOptimizeOK':
          BtnOptimizeOK(item);
          break;
        case 'BtnCancelOK':
          BtnCancelOK(item);
          break;
        default:
          break;
      }
    } else {
      console.log('error submit!', fields);
    }
  });
};
//取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (FormDatas.value.length) {
    //弹窗是form内容
    if (!formEl) return;
    formEl.resetFields();
    dialogFormVisible.value = false;
    ruleForm.value = {};
    emits('FmodelClose', { type: false });
  } else {
    //弹窗是表格和过滤内容(触发弹窗开关)
    dialogFormVisible.value = false;
    emits('FmodelClose', { type: false });
  }
};
const disabledFun = (item: any) => {
  // if(Route.name=='newApplication' ||Route.name=='newWorkshopMaterial' ||Route.name =='newWarehouseMaterial'){
  //     return item.DefinedParm4 ==1?false:true
  // }else{
  //     return false
  // }
};
//获取下拉框数据
const getSelData = () => {
  FormDatas.value.forEach((item: any) => {
    if (item.cControlTypeCode == 'ComboBox') {
      let obj = {};
      if (Route.name == 'PurchaseRequest') {
        obj = { Conditions: 'cDictonaryTypeCode=PlanPurchaseVouchIStatus' };
      } else if (
        Route.name == 'workshopMaterial' ||
        Route.name == 'warehouseMaterial'
      ) {
        obj = {
          Conditions:
            'cDictonaryTypeCode=MaterialApplyFor' + item.Resource.cAttributeCode
        };
      } else if (Route.name == 'PurchaseNote') {
        obj = { Conditions: 'cDictonaryTypeCode=PurchaseVouchIStatus' };
      } else if (Route.name == 'TripartiteOptimize') {
        obj = { Conditions: 'cDictonaryTypeCode=DlOptimizationType' };
      } else {
        obj = {
          Conditions: 'cDictonaryTypeCode=' + item.Resource.cAttributeCode
        };
      }

      let data = {
        method: item.Resource.cHttpTypeCode,
        url: item.Resource.cServerIP + item.Resource.cUrl,
        params: obj
        // {
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     // @ts-ignore
        //     // cDictonaryTypeCode: item.Resource.cAttributeCode
        //     Conditions:"cDictonaryTypeCode="+item.Resource.cAttributeCode
        // }
      };
      ParamsApi(data).then((res: any) => {
        item.selDataList = res.data;
      });
    }
  });
};
//上传文件
const file = ref();
const changeFile = (uploadFile: any) => {
  file.value = uploadFile;
};
const SaveAdd = (item: any) => {
  if (Route.name !== 'File') {
    //新增
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: ruleForm.value
    };
    DataApi(data).then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '新增成功'
        });
        tableAxios();
        if (Route.path.split('/')[1] == 'deviceManagement') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-undef
          treeAxios();
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm();
      } else {
        ElMessage.error('新增失败');
      }
    });
  } else {
    //上传文件保存
    let fd = new FormData();
    // fd.append("obj",JSON.stringify(ruleForm.value))
    fd.append('cFileClassCode', ruleForm.value.cFileClassCode);
    fd.append('cFileTypeCode', ruleForm.value.cFileTypeCode);
    fd.append('cMemo', ruleForm.value.cMemo);
    fd.append('file', file.value.raw);
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: fd
    };
    DataApi(data).then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '新增成功'
        });
        tableAxios();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm();
      } else {
        ElMessage.error('新增失败');
      }
    });
  }
};
const SaveEdit = (item: any) => {
  //编辑
  ruleForm.value.UID = rowId.value.UID;
  ruleForm.value.utfs = rowId.value.utfs;
  if (Route.name !== 'File') {
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: ruleForm.value
    };
    DataApi(data).then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '修改成功'
        });
        tableAxios();
        if (Route.path.split('/')[1] == 'deviceManagement') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-undef
          treeAxios();
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm();
      } else {
        ElMessage.error('修改失败');
      }
    });
  } else {
    let fd = new FormData();
    // fd.append("obj",JSON.stringify(ruleForm.value))
    fd.append('utfs', ruleForm.value.utfs);
    fd.append('UID', ruleForm.value.UID);
    fd.append('file', file.value.raw);
    fd.append('cFileClassCode', ruleForm.value.cFileClassCode);
    fd.append('cFileTypeCode', ruleForm.value.cFileTypeCode);
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: fd
    };
    DataApi(data).then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '修改成功'
        });
        tableAxios();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm();
      } else {
        ElMessage.error('修改失败');
      }
    });
  }
};
const BtnClearTypeOK = (item: any) => {
  console.log(ruleForm.value, '--===vvvv');
  if (!ruleForm.value.dProductDate) {
    ElMessage.error('请选择类型清洗时间');
    return false;
  }
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      dProductDate: ruleForm.value.dProductDate
    }
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '类型清洗成功'
      });
      tableAxios();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('类型清洗失败');
    }
  });
};
const BtnOptimizeOK = (item: any) => {
  console.log(ruleForm.value, '--===vvvv');
  if (!ruleForm.value.dProductDate || !ruleForm.value.OptimizeType) {
    ElMessage.error('请选择数据');
    return false;
  }
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      dProductDate: ruleForm.value.dProductDate,
      OptimizeType: ruleForm.value.OptimizeType
    }
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '优化成功'
      });
      tableAxios();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('优化失败');
    }
  });
};
const BtnCancelOK = (item: any) => {
  console.log(ruleForm.value, '--===vvvv');
  if (!ruleForm.value.JobName) {
    ElMessage.error('请输入数据');
    return false;
  }
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      JobName: ruleForm.value.JobName
    }
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '撤销优化成功'
      });
      tableAxios();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('撤销优化失败');
    }
  });
};
const BtnOK = (item: any) => {
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    params: {
      Sign: '',
      date: ruleForm.value.PDATE,
      type: ruleForm.value.TYPE
    }
  };
  ParamsApi(data).then(res => {
    console.log(res, '----ssss');

    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      });
      tableAxios();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('修改失败');
    }
  });
};
//保存（故障档案的维护文档的保存）
const TSaveAdd = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      cFaultCode: sendFalutCode.value,
      list_project: CheckTableArr.value
    }
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '添加成功'
      });
      tableAxios();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('添加失败');
    }
  });
};

//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  TtableAxios();
};

// 搜索
const ClickSearch = (val: any) => {
  Conditions.value = filterModel(val.value);
  TtableAxios();
};
// 重置
const FilresetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  TtableAxios();
  TabRef.value.clearFilter();
};
// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
    TtableAxios();
  });
};
// 恢复
const renew = () => {
  getData(Route.meta.ModelCode);
};
</script>

<style scoped lang="scss">
.Export {
  .demo-ruleForm {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }
  :deep(.el-form-item__label) {
    padding: 0px;
  }
  .el-input {
    margin: 0 10px 0;
    .input-item {
      flex: 1;
      // height: 120px;
      width: 80%;
      // background-color: green;

      /* 每个div设置右、下间隔为5px */
      margin: 0 5px 5px 0;

      /* 这里的10px = (分布个数3-1)*间隙5px, 可以根据实际的分布个数和间隙区调整 */
      /* 目的:计算每个div的宽度，10px为每一行的总间隔 */
      width: calc((100% - 10px) / 3);

      /* 加入这两个后每个item的宽度就生效了 */
      min-width: calc((100% - 10px) / 3);
      max-width: calc((100% - 10px) / 3);
    }
  }

  .input-item:nth-child(3n) {
    /* 去除第3n个的margin-right */
    /* 实现两端对齐 */
    margin-right: 0;
  }
  .my-header {
    width: 100%;
    position: relative;
    .IconSty {
      color: #fff;
      position: absolute;
      top: -3px;
      right: -3px;
      z-index: 1;
      cursor: pointer;
    }
  }
  :deep(.el-dialog__close) {
    display: none;
  }
}
</style>
