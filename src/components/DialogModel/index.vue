<template>
  <!-- 新增弹窗  -->
  <div>
    <el-dialog
      v-model="dialogFormVisible"
      :title="title"
      @close="resetForm(ruleFormRef)"
      draggable
      :modal="false"
      :close-on-click-modal="false"
      @open="open"
      @opened="openModel"
      :width="width"
    >
      <el-form
        ref="ruleFormRef"
        v-if="FormDatas.length"
        :model="ruleForm"
        :rules="rules"
        :label-width="getLabelWidth()"
        status-icon
      >
        <template v-for="item in FormDatas" :key="item.UID">
          <el-form-item
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
            v-if="item.IsShow && item.Resource.cAttributeTypeCode != 'binddata'"
          >
            <!-- {{item.Resource.cAttributeCode}} -->
            <el-input
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              :disabled="disabledFun(item)"
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
              :disabled="disabledFun(item)"
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Int'
              "
              :disabled="disabledFun(item)"
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
              :disabled="disabledFun(item)"
            />
            <el-input
              v-if="item.cControlTypeCode == 'PassWord'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabledFun(item)"
            />
            <el-input
              v-if="item.cControlTypeCode == 'TextBoxLink'"
              @change="TextBoxLink"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请选择'"
              :disabled="disabledFun(item)"
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
              :disabled="disabledFun(item)"
              clearable
              @change="(value:any)=>GetSelectData(item,value)"
            >
              <el-option
                v-for="val in item?.selDataList"
                :key="
                  val.cDictonaryCode ||
                  val.cBomClassCode ||
                  val.cDimensionalityCode ||
                  val.cFaultCode ||
                  val.cProcessCode ||
                  val.cPositionCode ||
                  val.cLineCode ||
                  val.cSAPCode
                "
                :label="
                  val.cDictonaryName ||
                  val.cBomClassName ||
                  val.cDimensionalityName ||
                  val.cFaultName ||
                  val.cProcessName ||
                  val.cPositionName ||
                  val.cLineName ||
                  val.cSAPCode
                "
                :value="
                  val.cDictonaryCode ||
                  val.cBomClassCode ||
                  val.cDimensionalityCode ||
                  val.cFaultCode ||
                  val.cProcessCode ||
                  val.cPositionCode ||
                  val.cLineCode ||
                  val.cSAPCode
                "
              />
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
              :disabled="disabledFun(item)"
              @change="e => onDatePicker2Change(e, item)"
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled="disabledFun(item)"
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
              :disabled="disabledFun(item)"
            />
            <el-radio-group
              v-if="item.cControlTypeCode == 'CheckBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              style="width: 220px"
              :disabled="disabledFun(item)"
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <!-- 上传文件 -->
            <div
              v-if="
                Route.name == 'ProjectView' ||
                Route.name == 'ProfessionProgressView' ||
                Route.name == 'DeviceProjectView' ||
                Route.name == 'ProDeviceProjectView'
              "
            >
              <el-upload
                v-if="item.cControlTypeCode == 'ChooseFile'"
                :limit="3"
                :on-change="changeFile"
                multiple
                :auto-upload="false"
                :data="ruleForm.value"
              >
                <template #trigger>
                  <el-button size="small" type="primary">选择文件</el-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip text-red">最多上传3个</div>
                </template>
              </el-upload>
            </div>
            <div v-else>
              <el-upload
                v-if="item.cControlTypeCode == 'ChooseFile'"
                :limit="1"
                :on-change="changeFile"
                :auto-upload="false"
                :data="ruleForm.value"
              >
                <template #trigger>
                  <el-button size="small" type="primary">选择文件</el-button>
                </template>
              </el-upload>
            </div>
            <!-- 树形结构 -->
            <el-cascader
              v-if="item.cControlTypeCode == 'Tree'"
              node-key="cFactoryUnitName"
              ref="cascader"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :options="optionData"
              :props="prop"
              @change="handleChange"
              clearable
              :disabled="disabledFun(item)"
            />
            <!-- <el-tree-select ref="treeRef" node-key="cFactoryUnitCode" v-if="item.cControlTypeCode == 'Tree'"
                            :props="prop" v-model="ruleForm[item.Resource.cAttributeCode]" :default-checked-keys="treeVal"
                            :data="optionData" :render-after-expand="false" show-checkbox
                            @change="treeChange(item.Resource.cAttributeCode)" :disabled="disabledFun(item)"/> -->
          </el-form-item>
        </template>
        <div
          v-if="
            Route.name === 'BomDoorInfo' &&
            modeCodeVal === 'MES.InvBOMSRuleS.M.Edit'
          "
        >
          <BDSWHERE ref="bdsRef" :rule-form="ruleForm" />
        </div>
        <!-- 按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            :disabled="disabled"
            @click="submitForm(ruleFormRef, item)"
            v-for="item in BtnData"
            :key="item.UID"
          >
            {{ item.Resource.cAttributeName }}
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
      <!-- 过滤区域 -->

      <div v-show="Filter.length > 0">
        <FilterForm
          :Filter="Filter"
          @ClickSearch="ClickSearch"
          @resetForm="FilresetForm"
        >
        </FilterForm>
      </div>
      <!-- 表格区域 -->
      <div>
        <myTable
          ref="TabRef"
          v-if="tabType"
          :tableData="tableData"
          :tableColumns="tableColumns"
          :tableBorder="true"
          :selection="true"
          :tableHeight="'250px'"
          @tableHearData="tableHearData"
          @handleSelectionChange="handleSelectionChange"
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
      <template
        #footer
        v-if="
          Route.name == 'testRatingAdd' ||
          Route.name == 'testRatingEdit' ||
          Route.name == 'RawMaterialComparisonAdd' ||
          Route.name == 'RawMaterialComparisonEdit' ||
          Route.name == 'LaboratoryMaterialControlAdd' ||
          Route.name == 'LaboratoryMaterialControlEdit' ||
          Route.name == 'InventoryProductComparisonAdd' ||
          Route.name == 'InventoryProductComparisonEdit'
        "
      >
        <span class="dialog-footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="Tconfirm">确认</el-button>
        </span>
      </template>
      <!-- 按钮区域 -->
      <ButtonViem
        v-if="!FormDatas.length"
        :ToolBut="BtnData"
        @SaveAdd="TSaveAdd"
        @SaveIncludMode="SaveIncludMode"
        @AllOut="handleAllOut"
      ></ButtonViem>
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
  FormInstance
} from 'element-plus';
import { configApi, DataApi, ParamsApi, delApi } from '@/api/configApi/index';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import myTable from '@/components/MyTable/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import FilterForm from '@/components/Filter/index.vue';
import myPopup from '@/components/Popup/index.vue';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import { ElLoading } from 'element-plus';
import BDSWHERE from '@/components/BDS/index_where.vue';

const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const ruleForm: any = ref({});
const dialogFormVisible = ref();
const FormDatas = ref([]) as any;
const Btn = ref([]) as any;
const BtnData = ref([]) as any;
const title = ref();
const disabled = ref(false);
const rowId = ref({}) as any;
const bindData = ref();
const AttributeCode = ref('');
const headRow = ref({}) as any;
//过滤
let Filter = ref([]) as any;
// 表格配置数据
const TabRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const objTreeValue = ref({}) as any;
const viewdataValue = ref({}) as any;
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
const bdsRef = ref(null);
const prop = {
  children: 'Child',
  label: 'cFactoryUnitName',
  value: 'cFactoryUnitCode',
  multiple: false,
  checkStrictly: true
};

//弹窗组件事件
const data = reactive({
  Conditions: '',
  OrderByFileds: '',
  modeCodeVal: '',
  dialogType: false,
  titleName: '标题',
  codeType: '',
  rowVal: {} as any,
  TrowVal: {} as any,
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
  MulitChoose,
  Conditions,
  OrderByFileds,
  modeCodeVal,
  rowVal,
  TrowVal
} = toRefs(data);
const props = defineProps({
  objData: {
    type: Object,
    default: () => {}
  },
  objTree: {
    type: Object,
    default: () => {}
  },
  viewdata: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: () => {
      return '';
    }
  },
  dialogFormVisible: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  disabled: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  row: {
    type: Object
  },
  Trow: {
    type: Object
  },
  headRow: {
    type: Object
  },
  modeCode: {
    type: String,
    default: () => {
      return '';
    }
  },
  FalutCode: {
    type: String,
    default: () => {
      return '';
    }
  },
  treeMethod: {
    type: Function,
    default: null
  },
  width: {
    type: String,
    default: '80%'
  }
});
const { tableAxios } = inject('tableAxios') as {
  tableAxios: () => void;
};
const optionData = ref([]) as any;
const isSubmitting = ref(false);

const getLabelWidth = () => {
  if (Route.name == 'ProductLineStandardCapacity') {
    return '200px';
  }
  if (Route.name == 'DictionaryFile') {
    return '250px';
  }
  return '120px';
};
//form
watch(
  props,
  (newValue, oldValue) => {
    dialogFormVisible.value = newValue.dialogFormVisible;
    title.value = newValue.title;
    objTreeValue.value = newValue.objTree;
    viewdataValue.value = newValue.viewdata;
    //单行row
    rowId.value = newValue.Trow;
    TrowVal.value = newValue.Trow;
    rowVal.value = newValue.row;
    if (newValue.Trow) {
      ruleForm.value = newValue.Trow;
    }
    if (newValue.headRow) {
      headRow.value = newValue.headRow;
    }
    if (
      newValue.title == '新增' ||
      newValue.title == '添加部件' ||
      newValue.title == '添加项目'
    ) {
      ruleForm.value = {};
    }
    //输入框禁用
    if (newValue.title.match(/详情/gi)) {
      disabled.value = true;
    } else {
      disabled.value = newValue.disabled || false;
    }
    if (Route.name === 'WareMangeReportViewiew') {
      disabled.value = false;
    }
    if (Route.name == 'ProjectView' && newValue.title == '转维修') {
      ruleForm.value.cDeviceName = headRow.value.cDeviceName;
      ruleForm.value.cProgramName = rowId.value.cProgramName;
    }
    if (Route.name == 'ProfessionProgressView' && newValue.title == '转维修') {
      ruleForm.value.cDeviceName = headRow.value.cDeviceName;
      ruleForm.value.cProgramName = rowId.value.cProgramName;
    }
    if (Route.name == 'DeviceProjectView' && newValue.title == '转维修') {
      ruleForm.value.cDeviceName = headRow.value.cDeviceName;
      ruleForm.value.cProgramName = rowId.value.cProgramName;
    }
    if (Route.name == 'ProDeviceProjectView' && newValue.title == '转维修') {
      ruleForm.value.cDeviceName = rowId.value.cDeviceName;
      ruleForm.value.cProgramName = rowId.value.cProgramName;
    }
    if (newValue.FalutCode) {
      sendFalutCode.value = newValue.FalutCode;
    }
    modeCodeVal.value = newValue.modeCode;
    // getData(modeCodeVal.value)
    // headVal()
  },
  { deep: true }
);

watch(
  () => ruleForm.value,
  newValue => {
    if (Route.name === 'Price' || Route.name === 'PriceKnife') {
      getSelData();
    }
  },
  { deep: true }
);

const emits = defineEmits(['FmodelClose', 'FmodelTable']);
// 打开前
const open = () => {};
const SearchCode = ref('');
// 打开后
const openModel = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // if(props.title.match(/新增/ig)){
  //     ruleForm.value={}
  // }
  getData(modeCodeVal.value);
  headVal();
  if (Route.name == 'ProjectView' && title.value == '转维修') {
    ruleForm.value.cDeviceName = headRow.value.cDeviceName;
    ruleForm.value.cProgramName = rowId.value.cProgramName;
    ruleForm.value.cDeviceCode = headRow.value.cDeviceCode;
    ruleForm.value.cCode = headRow.value.cCode;
    ruleForm.value.cPARM01 = rowId.value.cProgramCode;
    SearchCode.value = headRow.value.cDeviceCode;
  }
  if (Route.name == 'ProfessionProgressView' && title.value == '转维修') {
    SearchCode.value = headRow.value.cDeviceCode;
    ruleForm.value.cDeviceName = headRow.value.cDeviceName;
    ruleForm.value.cDeviceCode = headRow.value.cDeviceCode;
    ruleForm.value.cCode = headRow.value.cCode;
    ruleForm.value.cPARM01 = rowId.value.cProgramCode;
    ruleForm.value.cProgramName = rowId.value.cProgramName;
  }
  if (Route.name == 'DeviceProjectView' && title.value == '转维修') {
    ruleForm.value.cDeviceName = headRow.value.cDeviceName;
    ruleForm.value.cProgramName = rowId.value.cProgramName;
    ruleForm.value.cDeviceCode = headRow.value.cDeviceCode;
    ruleForm.value.cCode = headRow.value.cCode;
    ruleForm.value.cPARM01 = rowId.value.cProgramCode;
    SearchCode.value = headRow.value.cDeviceCode;
  }
  if (Route.name == 'ProDeviceProjectView' && title.value == '转维修') {
    ruleForm.value.cDeviceName = headRow.value.cDeviceName;
    ruleForm.value.cProgramName = rowId.value.cProgramName;
    ruleForm.value.cDeviceCode = headRow.value.cDeviceCode;
    ruleForm.value.cCode = headRow.value.cCode;
    ruleForm.value.cPARM01 = rowId.value.cProgramCode;
    SearchCode.value = headRow.value.cDeviceCode;
  }

  if (Route.name == 'QualitativeValueile' && title.value == '新增定性值') {
    if (objTreeValue.value) {
      ruleForm.value.cParmValueClassCode =
        objTreeValue.value.cParmValueClassCode;
    }
  }
};

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
// 搜索弹框事件
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
const clickTableBut = (scope: any, item: any) => {
  console.log(scope, item);
  const loading = ElLoading.service({ lock: true });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl
  } as any;
  switch (item.cAttributeCode) {
    case 'DeleteBody':
      data.data = scope.row.UID;
      DataApi(data)
        .then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '操作成功'
            });
            TtableAxios();
          } else {
            ElMessage.error('操作失败');
          }
        })
        .finally(() => {
          loading.close();
        });
      break;
    default:
      break;
  }
};
const TableArr = ref([]) as any;
const ProgramType = ref([]) as any;
const DataClass = ref([]) as any;
const DataTeam = ref([]) as any;
const ProjectName = ref([] as any);
const ProjectType = ref([] as any);
const PeriodType = ref([] as any);
const PeriodUnitType = ref([] as any);
//下拉数据变化
const GetSelectData = (item: any, value: any) => {
  if (Route.name == 'EditDevice' || Route.name == 'AddDevice') {
    if (item.cAttributeName == '项目类型') {
      ProgramType.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
    if (item.cAttributeName == '周期类型') {
      DataClass.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
    if (item.cAttributeName == '周期单位') {
      DataTeam.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
  }
  if (Route.name === 'Project') {
    if (item.cAttributeName == '项目类型') {
      ProjectType.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
    if (item.cAttributeName == '周期单位') {
      PeriodUnitType.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
    if (item.cAttributeName == '周期类型') {
      PeriodType.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
  }
  if (Route.name == 'BomDoorInfoView') {
    ruleForm.value.cDimensionalityCode = value;
  }
  if (Route.name == 'scheme') {
    if (item.cAttributeName == '方案类型') {
      ProjectName.value = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
    }
  }

  if (Route.name == 'FirstAndLastCheck') {
    if (item.cAttributeName == '工位名称') {
      let list = [];
      list = item.selDataList.filter((i: any) => {
        if (i.cPositionCode == value) {
          return i;
        }
      });
      if (list.length) {
        ruleForm.value.cPARM01 = list[0].cPositionCode || '';
        ruleForm.value.cPARM02 = list[0].cPositionName || '';
      }
    }
    if (item.cAttributeName == '工序名称') {
      let list = [];
      list = item.selDataList.filter((i: any) => {
        if (i.cProcessCode == value) {
          return i;
        }
      });
      if (list.length) {
        ruleForm.value.cPARM03 = list[0].cProcessCode;
        ruleForm.value.cPARM04 = list[0].cProcessName;
      }
    }
  }
  if (Route.name == 'InspectionPlanComparison') {
    if (item.cAttributeName == '工位名称') {
      let list = [];
      list = item.selDataList.filter((i: any) => {
        if (i.cPositionCode == value) {
          return i;
        }
      });
      if (list.length) {
        ruleForm.value.cPARM01 = list[0].cPositionCode;
        ruleForm.value.cPARM02 = list[0].cPositionName;
      }
    }
    if (item.cAttributeName == '产线名称') {
      let list = [];
      list = item.selDataList.filter((i: any) => {
        if (i.cLineCode == value) {
          return i;
        }
      });
      if (list.length) {
        ruleForm.value.cResourceCode = list[0].cLineCode;
        ruleForm.value.cResourceName = list[0].cLineName;
      }
    }
  }
  if (Route.name === 'PackagingRuleAssignment') {
    if (item.cAttributeName === '订单类型名称') {
      let list = [];
      list = item.selDataList.filter((i: any) => {
        if (i.cDictonaryCode == value) {
          return i;
        }
      });
      if (list.length) {
        ruleForm.value.cVouchType = list[0].cDictonaryCode;
        ruleForm.value.cVouchTypeName = list[0].cDictonaryName;
      }
    }
  }

  // 处理联动
  if (Route.name === 'InspectionPlanComparison') {
    if (item.cAttributeName == '产线名称') {
      getSelData();
    }
  }
};
const PartCode = ref('');
//搜索弹框数据选择
const selectData = (val: any) => {
  dialogType.value = val.type;
  TableArr.value = val.value;
  FormDatas.value.forEach(
    (item: {
      Resource: { cAttributeName: string };
      cAttributeCodeValue: string;
    }) => {
      if (item.Resource.cAttributeName == titleName.value) {
        ruleForm.value[AttributeCode.value] = val.value[0][AttributeCode.value];
      }
      if (Route.name === 'ProductLinePerson') {
        if (AttributeCode.value == 'cDefindParm04') {
          ruleForm.value.cDefindParm04 = val.value[0].cPersonName;
          ruleForm.value.cDefindParm03 = val.value[0].cPersonCode;
        }
      }
      if (
        Route.name === 'MaterialConfigGroupProcess' ||
        Route.name === 'MaterialConfigRule' ||
        Route.name === 'MaterialConfigAllocate'
      ) {
        if (titleName.value == '物料分组名称') {
          ruleForm.value.cInvMGroupCode = val.value[0].cInvMGroupCode;
        }
        if (titleName.value == '工序名称') {
          ruleForm.value.cProcessCode = val.value[0].cProcessCode;
        }
        if (titleName.value === '维度名称') {
          ruleForm.value.cDimensionalityCode = val.value[0].cDimensionalityCode;
          ruleForm.value.cModelCode = val.value[0].cModelCode;
        }
        if (titleName.value === '物料名称') {
          ruleForm.value.cInvCode = val.value[0].cInvCode;
        }
      }
      //原因分类弹窗上级分类取值
      if (
        Route.name == 'CauseClassification' &&
        item.Resource.cAttributeName == '上级分类名称'
      ) {
        ruleForm.value[AttributeCode.value] = val.value[0].cReasonClassName;
        ruleForm.value.cParentCode = val.value[0].cReasonClassCode;
      }
      //故障分类弹窗上级分类取值
      if (
        Route.name == 'TroubleClassify' &&
        item.Resource.cAttributeName == '上级分类名称'
      ) {
        ruleForm.value.cParentCode = val.value[0].cFaultClassCode;
        ruleForm.value[AttributeCode.value] = val.value[0].cFaultClassName;
      }
      //方案分类弹窗上级分类取值
      if (
        Route.name == 'schemeClassify' &&
        item.Resource.cAttributeName == '上级分类名称'
      ) {
        ruleForm.value.cParentCode = val.value[0].cProjectClassCode;
        ruleForm.value[AttributeCode.value] = val.value[0].cProjectClassName;
      }
      //方案分类弹窗上级分类取值
      if (
        Route.name == 'equipmentError' &&
        item.Resource.cAttributeName == '故障分类名称'
      ) {
        ruleForm.value.cFaultClassCode = val.value[0].cFaultClassCode;
      }
      //文档分类cParentName
      if (
        Route.name == 'FileClassify' &&
        item.Resource.cAttributeName == '上级分类名称'
      ) {
        ruleForm.value.cParentCode = val.value[0].cFileClassCode;
        ruleForm.value[AttributeCode.value] = val.value[0].cFileClassName;
      }
      //文档
      if (
        Route.name == 'File' &&
        item.Resource.cAttributeName == '文件分类名称'
      ) {
        ruleForm.value.cFileClassCode = val.value[0].cFileClassCode;
      }
      //指标分类cParentName
      if (
        Route.name == 'TargetClassify' &&
        item.Resource.cAttributeName == '上级分类名称'
      ) {
        ruleForm.value[AttributeCode.value] =
          val.value[0].cDeviceStandardClassName;
        ruleForm.value.cParentCode = val.value[0].cDeviceStandardClassCode;
      }
      //设备分类cParentName
      if (
        Route.name == 'deviceClassify' &&
        item.Resource.cAttributeName == '上级分类名称'
      ) {
        ruleForm.value[AttributeCode.value] = val.value[0].cDeviceClassName;
        ruleForm.value.cParentCode = val.value[0].cDeviceClassCode;
      }
      //方案  cProjectClassCode
      if (
        Route.name == 'scheme' &&
        item.Resource.cAttributeName == '方案分类'
      ) {
        ruleForm.value.cProjectClassCode = val.value[0].cProjectClassCode;
      }
      if (Route.name == 'BadDispionFile') {
        ruleForm.value.cNoPassClearClassCode =
          val.value[0].cNoPassClearClassCode;
      }
      if (Route.name == 'ToolClassify') {
        ruleForm.value.cParentName = val.value[0].cInvClassName;
        ruleForm.value.cParentCode = val.value[0].cInvClassCode;
      }
      // 设备--维护部件
      if (Route.name == 'protectPart') {
        if (AttributeCode.value == 'cInvName') {
          PartCode.value = val.value[0].cInvCode;
        }
        if (AttributeCode.value == 'cUnityName') {
          ruleForm.value.cUnityCode = val.value[0].cUnitCode;
          ruleForm.value.cUnityName = val.value[0].cUnitName;
        }
      }
      if (Route.name == 'LogisticsCityComparison') {
        if (AttributeCode.value == 'cLogisticsName') {
          ruleForm.value.cLogisticsName = val.value[0].cLogisticsName;
          ruleForm.value.cLogisticsCode = val.value[0].cLogisticsCode;
        }
        if (AttributeCode.value == 'cCityName') {
          ruleForm.value.cCityName = val.value[0].cCityName;
          ruleForm.value.cCityCode = val.value[0].cCityCode;
        }
        if (AttributeCode.value == 'cStoreHouseName') {
          ruleForm.value.cStoreHouseName = val.value[0].cStoreHouseName;
          ruleForm.value.cStoreHouseCode = val.value[0].cStoreHouseCode;
        }
      }
      if (Route.name === 'StdSort') {
        if (AttributeCode.value == 'cKeyName') {
          ruleForm.value.cKeyName = val.value[0].cDictonaryName;
          ruleForm.value.cKeyCode = val.value[0].cDictonaryCode;
        }
      }
      if (Route.name === 'Price' || Route.name === 'PriceKnife') {
        if (
          item.cAttributeCode == AttributeCode.value &&
          AttributeCode.value == 'cInvName'
        ) {
          ruleForm.value.cInvName = val.value[0].cInvName;
          ruleForm.value.cInvCode = val.value[0].cInvCode;
        }
        if (
          item.cAttributeCode == AttributeCode.value &&
          AttributeCode.value == 'cVendorName'
        ) {
          ruleForm.value.cVendorName = val.value[0].cVendorName;
          ruleForm.value.cVendorCode = val.value[0].cVendorCode;
        }
        if (AttributeCode.value === 'cUnitName') {
          ruleForm.value.cUnitCode = val.value[0].cUnitCode;
          ruleForm.value.cUnitName = val.value[0].cUnitName;
        }
      }
      // 设备编辑---添加项目
      if (Route.name == 'EditDevice') {
        // ruleForm.value.cProjectCode=val.value[0].cProjectCode
        ruleForm.value.cProgramName = val.value[0].cProgramName;
        ruleForm.value.cProgramCode = val.value[0].cProgramCode;

        ruleForm.value.IPeriodValue = val.value[0].IPeriodValue;
        ruleForm.value.IPeriodTypeName = val.value[0].IPeriodValue;

        ruleForm.value.cPeriodTypeName = val.value[0].cPeriodTypeCode;
        ruleForm.value.cPeriodTypeCode = val.value[0].cPeriodTypeCode;

        ruleForm.value.cPeriodUnitTypeName = val.value[0].cPeriodUnitTypeCode;
        ruleForm.value.cPeriodUnitTypeCode = val.value[0].cPeriodUnitTypeCode;
        ruleForm.value.iLevel = val.value[0].iLevel;
      }
      if (Route.name == 'CauseFile') {
        ruleForm.value.cReasonClassCode = val.value[0].cReasonClassCode;
        ruleForm.value.cReasonClassName = val.value[0].cReasonClassName;
      }
      //设备编辑---维护指标
      if (Route.name == 'ProtectTarget') {
        ruleForm.value.cDeviceStandardCode = val.value[0].cDeviceStandardCode;
        ruleForm.value.cMaxValue = val.value[0].cMaxValue;
        ruleForm.value.cMinValue = val.value[0].cMinValue;
      }
      if (Route.name == 'ProjectClassify') {
        ruleForm.value.cParentCode = val.value[0].cProgramClassCode;
        ruleForm.value[AttributeCode.value] = val.value[0].cProgramClassName;
      }
      // 设备点检/设备保养
      if (
        Route.name == 'ProjectView' ||
        Route.name == 'ProfessionProgressView' ||
        Route.name == 'DeviceProjectView'
      ) {
        ruleForm.value.cFaultCode = val.value[0].cFaultCode;
      }
      //刀具台账
      if (Route.name == 'ToolBook') {
        if (val.value[0].cInvName) {
          ruleForm.value.cInvName = val.value[0].cInvName;
        }
        if (val.value[0].cWareHouseName) {
          ruleForm.value.cWareHouseName = val.value[0].cWareHouseName;
        }
      }
      if (Route.name == 'ToolRelation') {
        if (val.value[0].cDeviceName) {
          ruleForm.value.cDeviceCode = val.value[0].cDeviceCode;
        }
        if (val.value[0].cInvName) {
          ruleForm.value.cInvCode = val.value[0].cInvCode;
        }
      }
      if (Route.name == 'ProcReleaseCaseCompaire') {
        if (val.value[0].cInvName) {
          ruleForm.value.cResourceName = val.value[0].cInvName;
          ruleForm.value.cResourceCode = val.value[0].cInvCode;
        }
        if (val.value[0].cProjectName) {
          ruleForm.value.cProjectName = val.value[0].cProjectName;
          ruleForm.value.cProjectCode = val.value[0].cProjectCode;
        }
        if (val.value[0].cPositionName) {
          ruleForm.value.cPARM02 = val.value[0].cPositionName;
          ruleForm.value.cPARM01 = val.value[0].cPositionCode;
        }
        if (val.value[0].cProcessName) {
          ruleForm.value.cPARM04 = val.value[0].cProcessName;
          ruleForm.value.cPARM03 = val.value[0].cProcessCode;
        }
      }
      if (Route.name == 'FirstAndLastCheck') {
        if (AttributeCode.value == 'cResourceName') {
          ruleForm.value.cResourceName = val.value[0].cInvName;
          ruleForm.value.cResourceCode = val.value[0].cInvCode;
        }
        if (AttributeCode.value == 'cProjectName') {
          ruleForm.value.cProjectName = val.value[0].cProjectName;
          ruleForm.value.cProjectCode = val.value[0].cProjectCode;
        }
      }
      if (Route.name == 'InspectionPlanComparison') {
        if (AttributeCode.value == 'cProjectName') {
          ruleForm.value.cProjectName = val.value[0].cProjectName;
          ruleForm.value.cProjectCode = val.value[0].cProjectCode;
        }
        if (AttributeCode.value == 'cResourceName') {
          ruleForm.value.cResourceName = val.value[0].cProcessName;
          ruleForm.value.cResourceCode = val.value[0].cProcessCode;
        }
      }
      if (Route.name == 'DictionaryFile') {
        if (AttributeCode.value == 'cDictonaryTypeName') {
          ruleForm.value.cDictonaryTypeName = val.value[0].cTypeName;
          ruleForm.value.cDictonaryTypeCode = val.value[0].cTypeCode;
        }
      }
      if (Route.name == 'PackagingRuleAssignment') {
        if (AttributeCode.value == 'cRName') {
          ruleForm.value.cRName = val.value[0].cRName;
          ruleForm.value.cRCode = val.value[0].cRCode;
        }
        if (AttributeCode.value == 'cStructureName') {
          ruleForm.value.cStructureName = val.value[0].cDictonaryName;
          ruleForm.value.cStructureCode = val.value[0].cDictonaryCode;
        }
        if (AttributeCode.value == 'cProductClassName') {
          ruleForm.value.cProductClassName = val.value[0].cDictonaryName;
          ruleForm.value.cProductClassCode = val.value[0].cDictonaryCode;
        }
        if (AttributeCode.value == 'cProductName') {
          ruleForm.value.cProductName = val.value[0].cInvName;
          ruleForm.value.cProductCode = val.value[0].cInvCode;
        }
      }
      if (Route.name == 'NonSubcontractStructure') {
        if (AttributeCode.value == 'cProductCode') {
          ruleForm.value.cProductName = val.value[0].cInvName;
          ruleForm.value.cProductCode = val.value[0].cInvCode;
        }
        if (AttributeCode.value == 'cStructureCode') {
          ruleForm.value.cStructureName = val.value[0].cDictonaryName;
          ruleForm.value.cStructureCode = val.value[0].cDictonaryCode;
        }
      }
      if (Route.name === 'WareMangeReportViewiew') {
        // #1627 兼容，AttributeCode 配错成 cWareHouseLocationname
        if (
          AttributeCode.value == 'cWareHouseLocationname' ||
          AttributeCode.value == 'cWareHouseLocationName'
        ) {
          ruleForm.value.cWareHouseLocationname =
            val.value[0].cWareHouseLocationName;
          ruleForm.value.cPosCode = val.value[0].cWareHouseLocationCode;
        }
      }
      if (Route.name === 'MaterialSupplier') {
        if (AttributeCode.value == 'cInvName') {
          ruleForm.value.cInvName = val.value[0].cInvName;
          ruleForm.value.cInvCode = val.value[0].cInvCode;
        }
        if (AttributeCode.value == 'cVendorName') {
          ruleForm.value.cVendorName = val.value[0].cVendorName;
          ruleForm.value.cVendorCode = val.value[0].cVendorCode;
        }
      }
      if (Route.name === 'UserLine') {
        if (AttributeCode.value === 'cUserName') {
          ruleForm.value.cLoginName = val.value[0].cLoginName;
        }
      }
      if (Route.name === 'WorkDevice') {
        if (AttributeCode.value === 'cDeviceName') {
          ruleForm.value.cResourceName = val.value[0].cDeviceName;
          ruleForm.value.cResourceCode = val.value[0].cDeviceCode;
        }
        if (AttributeCode.value === 'cPositionName') {
          ruleForm.value.cPositionCode = val.value[0].cPositionCode;
        }
      }
    }
  );
};
//手动输入弹框数据
const TextBoxLink = () => {};

//获取级联树结构数据
const getTreeData = (newValue: any) => {
  newValue.forEach((item: any) => {
    if (item.cControlTypeCode == 'Tree' && item.IsShow == true) {
      let data = {
        method: item.Resource.cHttpTypeCode,
        url: item.Resource.cServerIP + item.Resource.cUrl,
        params: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          cDictonaryTypeCode: item.Resource.cAttributeCode
        }
      };
      ParamsApi(data).then((res: any) => {
        optionData.value = res.data;
        // ruleForm.value = { ...ruleForm.value, ...optionData.value }
      });
    }
  });
};

// FORM数据
const getData = async (obj: any) => {
  FormDatas.value = [];
  Btn.value = [];
  BtnData.value = [];
  tableData.value = [];
  Filter.value = [];
  total.value = 0;
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
          FormDatas.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ruleFormRef.value.resetFields();
          }, 10);
          getViewData(); //form 详情数据
          getSelData(); //下拉框数据
          getTreeData(FormDatas.value);
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          BtnData.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
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
// table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.cShowName ?? item.Resource.cAttributeName,
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
  let PDate = '';
  try {
    PDate = JSON.parse(Route.params.rowId).PDate.split(' ')[0];
  } catch {
    //
  }
  let url = AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl;
  if (Route.name === 'UserLine') {
    url += `?val=` + rowVal.value.cLoginName;
  }
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds:
        Route.name == 'WareMangeReportViewiew'
          ? 'InType,OutType,cCode,PosTypeCode,ProductIndex'
          : OrderByFileds.value,
      Conditions:
        Route.name == 'WareMangeReportViewiew'
          ? `cposcode=${TrowVal.value.cposcode} && PDate=${PDate}`
          : Conditions.value
    }
  };

  const res = await DataApi(data);
  if (res.status == 200) {
    tableData.value = (res.data.data ?? res.data).map(
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
// 获取详情数据
const getViewData = () => {
  //详情数据不匹配，特殊处理
  if (Route.name == 'BomDoorInfoView') {
    ruleForm.value = rowVal.value || {};
    return false;
  }
  let ajaxData = FormDatas.value.filter((item: any) => {
    return item.cAttributeTypeCode == 'binddata';
  });
  let obj = {};
  if (
    Route.name == 'CauseFile' ||
    Route.name == 'CauseClassification' ||
    Route.name == 'equipmentError' ||
    Route.name == 'ProcReleaseCaseCompaire' ||
    Route.name == 'BadDispionFile' ||
    Route.name == 'ToolRelation' ||
    Route.name == 'TroubleClassify' ||
    Route.name == 'schemeClassify' ||
    Route.name == 'scheme' ||
    Route.name == 'FileClassify' ||
    Route.name == 'File' ||
    Route.name == 'ProjectClassify' ||
    Route.name == 'Project' ||
    Route.name == 'TargetClassify' ||
    Route.name == 'Target' ||
    Route.name == 'PersonTeam' ||
    Route.name == 'deviceClassify' ||
    Route.name == 'device' ||
    Route.name == 'EditDevice' ||
    Route.name == 'protectPart' ||
    Route.name == 'ProtectTarget' ||
    Route.name == 'ToolClassify' ||
    Route.name == 'ToolBook' ||
    Route.name == 'incomingInspection' ||
    Route.name == 'projectClassification' ||
    Route.name == 'QualitativeClassification' ||
    Route.name == 'QualitativeValueile' ||
    Route.name == 'inspectionItem' ||
    Route.name == 'BadDispionClassify' ||
    Route.name == 'FirstAndLastCheck' ||
    Route.name == 'InspectionPlanComparison' ||
    Route.name == 'DictionaryFile' ||
    Route.name == 'SpecialParameterSetting' ||
    Route.name == 'LogisticsAgentFile' ||
    Route.name == 'PackagingRuleAssignment' ||
    Route.name == 'NonSubcontractStructure' ||
    Route.name == 'LogisticsCityComparison' ||
    Route.name == 'MaterialSupplier' ||
    Route.name == 'Texture' ||
    Route.name == 'ProductTag' ||
    Route.name == 'ProcessRouteLine' ||
    Route.name == 'PartFiles' ||
    Route.name == 'MaterialConfigGroup' ||
    Route.name == 'MaterialConfigAllocate' ||
    Route.name == 'MaterialConfigRule' ||
    Route.name == 'MaterialConfigGroupProcess' ||
    Route.name == 'WorkshopStatisticsUser' ||
    Route.name == 'Electric' ||
    Route.name == 'NoPush' ||
    Route.name == 'WorkshopStatisticsCoreOrder' ||
    Route.name == 'Price' ||
    Route.name == 'PriceKnife' ||
    Route.name == 'StdSort' ||
    Route.name == 'ProductLinePerson' ||
    Route.name == 'ProductLineStandardCapacity'
  ) {
    obj = {
      val: rowVal.value?.UID || TrowVal.value?.UID || ''
    };
  } else if (Route.name == 'WorkDevice') {
    obj = {
      val: rowVal.value?.ResourceUID || TrowVal.value?.ResourceUID || ''
    };
  } else if (Route.name == 'UserLine') {
    obj = { val: rowVal.value?.cLoginName };
  } else {
    obj = {
      UID: rowVal.value?.UID || TrowVal.value?.UID || ''
    };
  }

  if (ajaxData.length) {
    let data = {
      method: ajaxData[0].Resource.cHttpTypeCode,
      url: ajaxData[0].Resource.cServerIP + ajaxData[0].Resource.cUrl,
      params: obj
    };
    ParamsApi(data).then(res => {
      if (res.status == 200) {
        ruleForm.value = res.data || {};
        console.log('获取详情数据', ruleForm.value);
        if (Route.name == 'FirstAndLastCheck') {
          if (ruleForm.value.cPARM06 == '是') {
            ruleForm.value.cPARM06 = true;
          } else {
            ruleForm.value.cPARM06 = false;
          }
        }

        // ruleForm.value = res.data||rowVal.value

        if (Route.name == 'ProcessRouteLine') {
          ruleForm.value.cResourceName = rowVal.value.cResourceCode;
        }
      } else {
        console.log('失败');
      }
    });
  } else {
    if (props.title.match(/编辑/gi) || props.title.match(/详情/gi)) {
      ruleForm.value = rowVal.value || {};
    }
  }
};
//表格多选
const handleSelectionChange = (arr: any) => {
  CheckTableArr.value = JSON.parse(JSON.stringify(arr));
};
//弹窗确认
const Tconfirm = () => {
  emits('FmodelClose', { type: false });
  emits('FmodelTable', { data: CheckTableArr.value });
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
  console.log(item);
  formEl.validate((valid, fields) => {
    if (valid) {
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
        case 'Save':
          EquipSave(item);
          break;
        // WareMangeReportViewiew 移库
        case 'PosAdjust':
          handlePosAdjust(item);
          break;
        // WareMangeReportViewiew 整货位出库
        case 'AllOut':
          handleAllOut(item);
          break;
        case 'Reject':
          handleReject(item);
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
    emits('FmodelClose', { type: false });
    ruleForm.value = {};
    FormDatas.value = [];
  } else {
    //弹窗是表格和过滤内容(触发弹窗开关)
    dialogFormVisible.value = false;
    emits('FmodelClose', { type: false });
    ruleForm.value = {};
    FormDatas.value = [];
  }
};
const disabledFun = (item: any) => {
  if (props.disabled) {
    return true;
  } else {
    return item.DefinedParm4 == 1 || item.cControlTypeCode == 'TextBoxLink'
      ? true
      : false;
  }
};
//获取下拉框数据
const getSelData = () => {
  FormDatas.value.forEach((item: any) => {
    if (item.cControlTypeCode == 'ComboBox' && item.IsShow == true) {
      item.selDataList = [];
      console.log(item);
      let obj = {};
      if (
        Route.name == 'PurchaseRequest' ||
        Route.name == 'KnifePurchaseRequest'
      ) {
        obj = { Conditions: 'cDictonaryTypeCode=PlanPurchaseVouchIStatus' };
      } else if (
        Route.name == 'workshopMaterial' ||
        Route.name == 'warehouseMaterial'
      ) {
        obj = {
          Conditions:
            'cDictonaryTypeCode=MaterialApplyFor' + item.Resource.cAttributeCode
        };
      } else if (
        Route.name == 'PurchaseNote' ||
        Route.name === 'KnifePurchaseNote'
      ) {
        obj = { Conditions: 'cDictonaryTypeCode=PurchaseVouchIStatus' };
      } else if (Route.name == 'TripartiteOptimize') {
        obj = { Conditions: 'cDictonaryTypeCode=DlOptimizationType' };
      } else if (
        Route.name == 'BomDoorInfo' ||
        Route.name == 'FirstAndLastCheck'
      ) {
        obj = {};
      } else if (Route.name === 'Price' || Route.name === 'PriceKnife') {
        if (!ruleForm.value.cInvCode && !ruleForm.value.cVendorCode) {
          return;
        }
        let conditions = [];
        if (ruleForm.value.cInvCode) {
          conditions.push(`cInvCode=${ruleForm.value.cInvCode}`);
        }
        if (ruleForm.value.cVendorCode) {
          conditions.push(`cVendorCode=${ruleForm.value.cVendorCode}`);
        }
        obj = {
          Conditions: conditions.join(' && ')
        };
      } else if (Route.name == 'InspectionPlanComparison') {
        obj = {
          LineCode: ruleForm.value.cResourceCode
        };
      } else if (
        Route.name == 'ProfessionProgressView' ||
        Route.name == 'ProjectView' ||
        Route.name == 'ProDeviceProjectView' ||
        Route.name == 'DeviceProjectView'
      ) {
        obj = { Conditions: `cDeviceCode=${SearchCode.value}` };
      } else {
        obj = {
          Conditions: 'cDictonaryTypeCode=' + item.Resource.cAttributeCode
        };
      }
      if (item.Resource.cHttpTypeCode == 'get') {
        let data = {
          method: item.Resource.cHttpTypeCode,
          url: item.Resource.cServerIP + item.Resource.cUrl,
          params: obj
        };
        ParamsApi(data)
          .then((res: any) => {
            item.selDataList = res.data;
          })
          .finally(() => {});
      } else {
        let data = {
          method: item.Resource.cHttpTypeCode,
          url: item.Resource.cServerIP + item.Resource.cUrl,
          data: obj
        };
        DataApi(data)
          .then((res: any) => {
            item.selDataList = res.data;
          })
          .finally(() => {});
      }
    }
  });
};
//上传文件
const file = ref();
const fileList = ref([]) as any;
const changeFile = (uploadFile: any, files: any) => {
  file.value = uploadFile;
  fileList.value = files;
};
//设备点检--转维修
const Parmdata = ref('');
const EquipSave = (item: any) => {
  if (Route.name == 'ProjectView') {
    Parmdata.value = '1';
  }
  if (Route.name == 'ProfessionProgressView') {
    Parmdata.value = '2';
  }
  if (Route.name == 'DeviceProjectView') {
    Parmdata.value = '3';
  }
  if (Route.name == 'ProDeviceProjectView') {
    Parmdata.value = '4';
  }
  //上传文件保存
  let fd = new FormData();
  fd.append('cDeviceCode', ruleForm.value.cDeviceCode);
  fd.append('cFaultCode', ruleForm.value.cFaultName);
  fd.append('IsStop', ruleForm.value.IsStop);
  fd.append('cMemo', ruleForm.value.cMemo);
  fd.append('cPARM01', ruleForm.value.cPARM01);
  fd.append('cPARM02', Parmdata.value);
  fd.append('cPARM03', ruleForm.value.cCode);
  fileList.value.forEach((item: any) => {
    fd.append('list_file', item.raw);
  });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: fd
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '转成功'
      });
      tableAxios();
      // TabRef.value.handleRemoveSelectionChange()
      dialogFormVisible.value = false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm();
    } else {
      ElMessage.error('转失败');
    }
  });
};

const handlePosAdjust = (item: any) => {
  if (!ruleForm.value.cPosCode && !ruleForm.value.cWareHouseLocationName) {
    ElMessage.error('请选择或输入货位');
    return;
  }
  if (!CheckTableArr.value.length) {
    ElMessage.error('至少选择一条数据');
    return;
  }
  const data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      // NOTE: #1660 支持输入货位
      cPosCode:
        ruleForm.value.cPosCode ?? ruleForm.value.cWareHouseLocationName,
      list_cPackageCode: CheckTableArr.value.map((i: any) => i.Pbarcode)
    }
  };
  DataApi(data)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '操作成功'
        });
        dialogFormVisible.value = false;
      } else {
        ElMessage.error('操作失败');
      }
    })
    .finally(() => {
      TtableAxios();
    });
};

const SaveAdd = (item: any) => {
  if (Route.name !== 'File') {
    //新增
    if (Route.name === 'WorkDevice') {
      ruleForm.value.cResourceTypeCode = '9';
    }
    if (Route.name === 'PartFiles') {
      ruleForm.value.cMaterialType = 4;
      ruleForm.value.cInvClassCode = 'SBBJ';
    }
    if (Route.name == 'protectPart') {
      ruleForm.value.MID = TrowVal.value.UID;
      ruleForm.value.cInvCode = PartCode.value;
    }
    if (Route.name === 'ProductTag') {
      ruleForm.value.cDictonaryTypeCode = 'InventoryClass';
    }
    if (Route.name == 'ProcReleaseCaseCompaire') {
      ruleForm.value.cConfigTypeCode = '00274';
      ruleForm.value.cResourceTypeCode = '00274';
    }
    if (Route.name === 'scheme') {
      if (ProjectName.value[0]) {
        ruleForm.value.cProjectTypeCode = ProjectName.value[0].cDictonaryCode;
        ruleForm.value.cProjectTypeName = ProjectName.value[0].cDictonaryName;
      }
    }
    //添加项目----------设备编辑
    if (Route.name == 'EditDevice') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let code = JSON.parse(
        window.sessionStorage.getItem('DeviceData')
      )?.cDeviceCode;
      if (TrowVal.value.cDeviceCode) {
        ruleForm.value.cDeviceCode = TrowVal.value.cDeviceCode;
        if (DataClass.value[0] || DataTeam.value[0]) {
          // ruleForm.value['cProgramTypeName'] = ProgramType.value[0]?.cDictonaryName || ''
          // ruleForm.value['cProgramTypeCode'] = ProgramType.value[0]?.cDictonaryCode || ''
          ruleForm.value['cPeriodTypeName'] =
            DataClass.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodTypeCode'] =
            DataClass.value[0]?.cDictonaryCode || '';
          ruleForm.value['cPeriodUnitTypeName'] =
            DataTeam.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodUnitTypeCode'] =
            DataTeam.value[0]?.cDictonaryCode || '';
        }
      } else {
        ruleForm.value.cDeviceCode = code;
        if (DataClass.value[0] || DataTeam.value[0]) {
          ruleForm.value['cProgramTypeName'] =
            ProgramType.value[0]?.cDictonaryName || '';
          ruleForm.value['cProgramTypeCode'] =
            ProgramType.value[0]?.cDictonaryCode || '';
          ruleForm.value['cPeriodTypeName'] =
            DataClass.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodTypeCode'] =
            DataClass.value[0]?.cDictonaryCode || '';
          ruleForm.value['cPeriodUnitTypeName'] =
            DataTeam.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodUnitTypeCode'] =
            DataTeam.value[0]?.cDictonaryCode || '';
        }
      }
    }
    if (Route.name == 'addFile') {
      ruleForm.value.cFaultCode = sendFalutCode.value;
      ruleForm.value.list_project = TableArr.value;
      // "cFaultCode":sendFalutCode.value,
      // "list_project":CheckTableArr.value
    }
    //设备档案--编辑---添加指标
    if (Route.name == 'ProtectTarget') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let code = JSON.parse(window.sessionStorage.getItem('DeviceData'))?.UID;
      if (TrowVal.value) {
        ruleForm.value.MID = TrowVal.value;
      } else {
        ruleForm.value.MID = code;
      }
    }
    if (Route.name == 'BomDoorInfo') {
      if (objTreeValue.value.Level == 12) {
        ruleForm.value.cBomCode = viewdataValue.value.cBomCode;
      }
      if (objTreeValue.value.Level == 13) {
        ruleForm.value.MID = viewdataValue.value.UID;
      }
    }
    if (Route.name == 'BomDoorInfoCLView') {
      ruleForm.value.MID = rowVal.value.BOMSUID;
    }
    if (
      Route.name == 'BomDoorInfoGZView' ||
      Route.name == 'BomDoorInfoBDSView' ||
      Route.name == 'BomDoorInfoView'
    ) {
      ruleForm.value.MID = Route.params.rowId;
    }
    if (Route.name == 'QualitativeClassification') {
      ruleForm.value.cParentCode = objTreeValue.value
        ? objTreeValue.value.cParmValueClassCode
        : '';
    }
    if (Route.name == 'UserLine') {
      ruleForm.value.list_cFactoryUnitCode = ruleForm.value.cFactoryUnitName;
    }
    if (Route.name == 'Project') {
      console.log(ProjectType.value);
      if (ProjectType.value[0]) {
        ruleForm.value.cProgramTypeName = ProjectType.value[0]?.cDictonaryName;
        ruleForm.value.cProgramTypeCode = ProjectType.value[0]?.cDictonaryCode;
      }
      if (PeriodType.value[0]) {
        ruleForm.value.cPeriodTypeCode = PeriodType.value[0]?.cDictonaryCode;
        ruleForm.value.cPeriodTypeName = PeriodType.value[0]?.cDictonaryName;
      }
      if (PeriodUnitType.value[0]) {
        ruleForm.value.cPeriodUnitTypeName =
          PeriodUnitType.value[0]?.cDictonaryName;
        ruleForm.value.cPeriodUnitTypeCode =
          PeriodUnitType.value[0]?.cDictonaryCode;
      }
    }
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: ruleForm.value
    };
    if (isSubmitting.value) {
      ElMessage.warning('加载中，请勿重复提交');
      return;
    }
    isSubmitting.value = true;
    DataApi(data)
      .then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '新增成功'
          });
          tableAxios();
          // TabRef.value.handleRemoveSelectionChange()
          // 再次调用tree
          if (
            Route.name == 'scheme' ||
            Route.name == 'TroubleClassify' ||
            Route.name == 'equipmentError' ||
            Route.name == 'schemeClassify' ||
            Route.name == 'FileClassify' ||
            Route.name == 'File' ||
            Route.name == 'Project' ||
            Route.name == 'TargetClassify' ||
            Route.name == 'deviceClassify'
          ) {
            if (props.treeMethod) {
              props.treeMethod();
            }
          }
          if (Route.name == 'BomDoorInfo') {
            if (objTreeValue.value.Level == 12) {
              if (props.treeMethod) {
                props.treeMethod();
              }
            }
          } else {
            // if(Route.name!=='TroubleClassify'||Route.name!=='equipmentError'||Route.name!=='schemeClassify'||Route.name!=='scheme'||Route.name!=='FileClassify'||Route.name!=='File'||Route.name!=='ProjectClassify'||Route.name!=='Project'||Route.name!=='TargetClassify'||Route.name!=='Target'||Route.name!=='PersonTeam'||Route.name!=='deviceClassify'|| Route.name!=='device'){
            //     if(props.treeMethod){
            //         props.treeMethod()
            //     }
            // }
          }
          dialogFormVisible.value = false;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          resetForm();
          $bus.emit('tableUpData', { name: Route.name });
        } else {
          ElMessage.error('新增失败');
        }
      })
      .catch(() => {})
      .finally(() => {
        isSubmitting.value = false;
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
        // TabRef.value.handleRemoveSelectionChange()
        dialogFormVisible.value = false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm();
      } else {
        ElMessage.error('新增失败');
      }
    });
  }
};
//编辑
const SaveEdit = (item: any) => {
  ruleForm.value.UID = rowVal.value
    ? rowVal.value.UID
    : TrowVal.value.UID || '';
  ruleForm.value.utfs = rowVal.value
    ? rowVal.value.utfs
    : TrowVal.value.utfs || '';

  if (Route.name === 'WorkDevice') {
    ruleForm.value.cResourceTypeCode = '9';
  }
  if (Route.name !== 'File') {
    if (Route.name === 'scheme') {
      ruleForm.value.cProjectTypeCode = ProjectName.value[0]?.cDictonaryCode;
      ruleForm.value.cProjectTypeName = ProjectName.value[0]?.cDictonaryName;
    }
    if (Route.name === 'ProcessRouteLine') {
      ruleForm.value.cResourceName =
        ruleForm.value.cFactoryUnitName || ruleForm.value.cResourceName;
      ruleForm.value.cResourceCode =
        ruleForm.value.cFactoryUnitCode || ruleForm.value.cResourceCode;
    }
    if (Route.name == 'Project') {
      console.log(ProjectType.value);
      if (ProjectType.value[0]) {
        ruleForm.value.cProgramTypeName = ProjectType.value[0]?.cDictonaryName;
        ruleForm.value.cProgramTypeCode = ProjectType.value[0]?.cDictonaryCode;
      }
      if (PeriodType.value[0]) {
        ruleForm.value.cPeriodTypeCode = PeriodType.value[0]?.cDictonaryCode;
        ruleForm.value.cPeriodTypeName = PeriodType.value[0]?.cDictonaryName;
      }
      if (PeriodUnitType.value[0]) {
        ruleForm.value.cPeriodUnitTypeName =
          PeriodUnitType.value[0]?.cDictonaryName;
        ruleForm.value.cPeriodUnitTypeCode =
          PeriodUnitType.value[0]?.cDictonaryCode;
      }
    }
    //添加项目----------设备编辑
    if (Route.name == 'EditDevice') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let code = JSON.parse(
        window.sessionStorage.getItem('DeviceData')
      )?.cDeviceCode;
      if (TrowVal.value.cDeviceCode) {
        ruleForm.value.cDeviceCode = TrowVal.value.cDeviceCode;
        if (DataClass.value[0]) {
          ruleForm.value['cPeriodTypeName'] =
            DataClass.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodTypeCode'] =
            DataClass.value[0]?.cDictonaryCode || '';
        }
        if (DataTeam.value[0]) {
          ruleForm.value['cPeriodUnitTypeName'] =
            DataTeam.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodUnitTypeCode'] =
            DataTeam.value[0]?.cDictonaryCode || '';
        }
      } else {
        ruleForm.value.cDeviceCode = code;
        if (ProgramType.value[0]) {
          ruleForm.value['cProgramTypeName'] =
            ProgramType.value[0]?.cDictonaryName || '';
          ruleForm.value['cProgramTypeCode'] =
            ProgramType.value[0]?.cDictonaryCode || '';
        }
        if (DataClass.value[0]) {
          ruleForm.value['cPeriodTypeName'] =
            DataClass.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodTypeCode'] =
            DataClass.value[0]?.cDictonaryCode || '';
        }
        if (DataTeam.value[0]) {
          ruleForm.value['cPeriodUnitTypeName'] =
            DataTeam.value[0]?.cDictonaryName || '';
          ruleForm.value['cPeriodUnitTypeCode'] =
            DataTeam.value[0]?.cDictonaryCode || '';
        }
      }
    }
    if (Route.name == 'UserLine') {
      ruleForm.value.list_cFactoryUnitCode = [
        ruleForm.value.cFactoryUnitName.at(-1)
      ];
    }
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
        // TabRef.value.handleRemoveSelectionChange()
        // 再次调用tree
        if (Route.name == 'BomDoorInfo') {
          if (objTreeValue.value.Level == 12) {
            if (props.treeMethod) {
              props.treeMethod();
            }
          }
        } else {
          // if(Route.name!=='TroubleClassify'||Route.name!=='equipmentError'||Route.name!=='schemeClassify'||Route.name!=='scheme'||Route.name!=='FileClassify'||Route.name!=='File'||Route.name!=='ProjectClassify'||Route.name!=='Project'||Route.name!=='TargetClassify'||Route.name!=='Target'||Route.name!=='PersonTeam'||Route.name!=='deviceClassify'|| Route.name!=='device'){
          //     if(props.treeMethod){
          //         props.treeMethod()
          //     }
          // }
        }
        dialogFormVisible.value = false;
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
    if (file.value) {
      fd.append('file', file.value.raw);
    }
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
        // TabRef.value.handleRemoveSelectionChange()
        dialogFormVisible.value = false;
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
  if (!ruleForm.value.dProductDate) {
    ElMessage.error('请选择类型清洗时间');
    return false;
  }
  const loading = ElLoading.service({ lock: true });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      dProductDate: ruleForm.value.dProductDate
    }
  };
  DataApi(data)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '类型清洗成功'
        });
        dialogFormVisible.value = false;
        tableAxios();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm(ruleFormRef);
      } else {
        ElMessage.error('类型清洗失败');
      }
    })
    .finally(() => {
      loading.close();
    });
};
const BtnOptimizeOK = (item: any) => {
  if (!ruleForm.value.dProductDate || !ruleForm.value.OptimizeType) {
    ElMessage.error('请选择数据');
    return false;
  }
  const loading = ElLoading.service({ lock: true });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      dProductDate: ruleForm.value.dProductDate,
      OptimizeType: ruleForm.value.OptimizeType,
      S_S_S_cBatch: ruleForm.value.S_S_S_cBatch
    }
  };
  DataApi(data)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '优化成功'
        });
        dialogFormVisible.value = false;
        tableAxios();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm(ruleFormRef);
      } else {
        ElMessage.error('优化失败');
      }
    })
    .finally(() => {
      loading.close();
    });
};
const TreeItem = ref() as any;

function treeToArray(tree: any) {
  return tree.reduce((res: any, item: any) => {
    const { children, ...i } = item;
    return res.concat(
      i,
      children && children.length ? treeToArray(children) : []
    );
  }, []);
}
const cascader = ref() as any;

//级联树结构选项变化
const handleChange = (value: any) => {
  console.log(value, '树结构选中数据');
  console.log(cascader.value[0].getCheckedNodes(), '--pppp');
  // TODO：
  if (
    Route.name == 'ProcessRouteLine' ||
    Route.name == 'WorkshopStatisticsUser' ||
    Route.name == 'ProductLineStandardCapacity'
  ) {
    ruleForm.value['cFactoryUnitCode'] =
      cascader.value[0].getCheckedNodes()[0].value;
    ruleForm.value['cFactoryUnitName'] =
      cascader.value[0].getCheckedNodes()[0].label;
  }
  console.log(cascader.value);

  TreeItem.value = treeToArray(cascader.value[0].getCheckedNodes()).map(
    (i: any) => i.data
  );
  console.log(TreeItem.value, '---TreeItem.value');
};

const BtnCancelOK = (item: any) => {
  if (!ruleForm.value.JobName) {
    ElMessage.error('请输入数据');
    return false;
  }
  const loading = ElLoading.service({ lock: true });
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      JobName: ruleForm.value.JobName
    }
  };
  DataApi(data)
    .then(res => {
      if (res.status === 200) {
        ElMessage({
          type: 'success',
          message: '撤销优化成功'
        });
        dialogFormVisible.value = false;
        tableAxios();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        resetForm(ruleFormRef);
      } else {
        ElMessage.error('撤销优化失败');
      }
    })
    .finally(() => {
      loading.close();
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
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '修改成功'
      });
      dialogFormVisible.value = false;
      tableAxios();
      TabRef.value.handleRemoveSelectionChange();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('修改失败');
    }
  });
};
const SaveIncludMode = (obj: any) => {
  if (!CheckTableArr.value.length) {
    ElMessage({
      type: 'error',
      message: '请勾选数据'
    });
    return false;
  }
  CheckTableArr.value.forEach((item: any) => {
    //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    item.MID = window.sessionStorage.getItem('BomThrObj')
      ? JSON.parse(window.sessionStorage.getItem('BomThrObj') ?? '').UID
      : '';
    item.cIncludModeCode = item.cBomCode;
  });
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // "cFaultCode":sendFalutCode.value,
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
      TabRef.value.handleRemoveSelectionChange();
      dialogFormVisible.value = false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('添加失败');
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
      TabRef.value.handleRemoveSelectionChange();
      dialogFormVisible.value = false;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      resetForm(ruleFormRef);
    } else {
      ElMessage.error('添加失败');
    }
  });
};

const handleAllOut = (item: any) => {
  const data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      cPosCode: TrowVal.value?.cposcode,
      PDate: TrowVal.value?.pdate
    }
  };
  console.log(data);
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({ type: 'success', message: '操作成功' });
      dialogFormVisible.value = false;
    } else {
      ElMessage.error('出库失败');
    }
  });
};

const handleReject = obj => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      KeyVal: [rowVal.value],
      cMemo: ruleForm.value.cMemo
    }
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '驳回成功'
      });
      router.push({
        name: 'PurchaseAudit'
      });
      $bus.emit('tableUpData', { name: 'PurchaseAudit' });
    } else {
      ElMessage.error('驳回失败');
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
  queryParams.PageIndex = 1;
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

const onDatePicker2Change = (e, item) => {
  console.log(e, item);
  if (Route.name === 'NoPush' && item.cAttributeCode === 'dDate') {
    if (e[0]) {
      ruleForm.value['dDateBegin'] = `${e[0]}T00:00:00`;
    }
    if (e[1]) {
      ruleForm.value['dDateEnd'] = `${e[1]}T23:59:59`;
    }
  }
};
</script>

<style scoped lang="scss"></style>
