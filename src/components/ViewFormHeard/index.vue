<!--cControlTypeCode： DateTimePicker 日期； TextBox 文本 ；TextBoxLink 参照（弹出框）； ComboBox 下拉  CheckBox:单选 -->
<!-- cDataTypeCode：Decimal 数值；Bit 布尔；Nvarchar 文本；Int 整数 -->
<!-- head组件 -->
<template>
  <div class="HeadMain">
    <!-- <el-card class="maintain_card" v-if="HeadData"> -->
    <div class="search_main" v-if="HeadData.length">
      <el-form
        :inline="true"
        :disabled="props.disabled"
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="130px"
      >
        <template v-for="item in HeadData" :key="item.cAppCode">
          <el-form-item
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
            v-if="item.IsShow && item.Resource.cAttributeTypeCode != 'binddata'"
            :style="{
              width:
                item.DefinedParm0 ||
                ((Route.name == 'AddBusineScen' ||
                  Route.name == 'AddBusineScenEdit' ||
                  Route.name == 'AddBusineScenView') &&
                  (item.cAttributeName === '条件表达式' ||
                    item.cAttributeName === '描述'))
                  ? '100%'
                  : '340px'
            }"
          >
            <!-- {{ item.Resource.cAttributeCode }} -->
            <!-- <el-input
                            v-if="item.cControlTypeCode == 'TextBoxInt' && item.cDataTypeCode == 'Nvarchar' " :maxlength="" :disabled="disabledFun(item)"
                            v-model="ruleForm[item.Resource.cAttributeCode]" :placeholder="disabled ? '' : '请输入'" /> -->
            <div
              v-if="item.cControlTypeCode == 'File'"
              @click="PriveImg(ruleForm[item.Resource.cAttributeCode])"
            >
              <div v-if="ruleForm[item.Resource.cAttributeCode] || ImgName">
                {{ ruleForm[item.Resource.cAttributeCode] || ImgName }}
              </div>
              <div v-else>暂无图片</div>
            </div>

            <el-input
              v-if="
                item.cControlTypeCode == 'TextBoxText' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              :minlength="item.DefinedParm5 || ''"
              :maxlength="item.DefinedParm6 || ''"
              show-word-limit
              :disabled="disabledFun(item)"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              type="textarea"
              style="width: 100%"
              clearable
              :rows="
                (Route.name == 'AddBusineScen' ||
                  Route.name == 'AddBusineScenEdit' ||
                  Route.name == 'AddBusineScenView') &&
                ['条件表达式', '描述'].includes(item.cAttributeName) &&
                6
              "
            />
            <el-input
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              :minlength="item.DefinedParm5 || ''"
              :maxlength="item.DefinedParm6 || ''"
              show-word-limit
              :disabled="disabledFun(item)"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              clearable
              style="width: 100%"
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
              clearable
              style="width: 100%"
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Int'
              "
              :disabled="disabledFun(item)"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              style="width: 100%"
              clearable
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Decimal'
              "
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              style="width: 100%"
              :disabled="disabledFun(item)"
              clearable
            />
            <el-input
              v-if="item.cControlTypeCode == 'PassWord'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabledFun(item)"
              clearable
              style="width: 100%"
            />
            <el-input
              v-if="item.cControlTypeCode == 'TextBoxLink'"
              @change="TextBoxLink"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabledFun(item)"
              style="width: 100%"
              clearable
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
              :multiple="funMultiple(item)"
              :placeholder="disabled ? '' : '请输入'"
              :disabled="disabledFun(item)"
              clearable
              filterable
              remote
              remote-show-suffix
              :remote-method="(query:any)=>remoteMethod(item,query)"
              @change="(value:any)=>GetTreeRoad(item,value)"
              @visible-change="(value:any) => selectVisible(value,ruleForm[item.Resource.cAttributeCode + '_Data'],item)"
              @clear="(value:any)=>clearSelect(item,value)"
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
              clearable
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
              clearable
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :disabled="disabledFun(item)"
              clearable
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
              clearable
            />
            <el-radio-group
              v-if="item.cControlTypeCode == 'CheckBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              style=""
              :disabled="disabledFun(item)"
              clearable
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <!-- 树形结构 -->
            <!-- <el-cascader v-if="item.cControlTypeCode == 'Tree'" v-model="ruleForm[item.Resource.cAttributeCode]"
                            :options="optionData" :props="prop" @change="getCheckedNodes" /> -->
            <el-tree-select
              ref="treeRef"
              node-key="cFactoryUnitCode"
              v-if="item.cControlTypeCode == 'Tree'"
              :props="prop"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              :default-checked-keys="treeVal"
              :data="optionData"
              :render-after-expand="false"
              show-checkbox
              @change="treeChange(item.Resource.cAttributeCode)"
              :disabled="disabledFun(item)"
              clearable
            />
          </el-form-item>
        </template>
      </el-form>
    </div>
    <!-- </el-card> -->
    <!-- 显示预览图片 -->
    <ImgPreview v-model="imgIshow" :imgs="srcList" />
    <!-- 搜索弹框 -->
    <searchModel
      :dialogType="dialogType"
      :titleName="titleName"
      :codeType="codeType"
      :MulitChoose="MulitChoose"
      :filterVal="filterVal"
      :filterData="filterData"
      @ModelClose="ModelClose"
      @selectData="selectData"
      :ruleForm="ruleForm"
    ></searchModel>
  </div>
  <div v-if="Route.name === 'AddBusineScen'">
    <!-- <div style="margin-top: 10px" v-if="ruleForm.cLamdaTypeCode === 'Where'">
      <BDS
        :Head="props.Head"
        :ruleForm="ruleForm"
        @change-rule-form="handleChangeRuleForm"
      ></BDS>
    </div> -->
    <div style="margin-top: 10px" v-if="ruleForm.cLamdaTypeCode === 'Where'">
      <BDSWHERE
        :Head="props.Head"
        :ruleForm="ruleForm"
        @change-rule-form="handleChangeRuleForm"
      ></BDSWHERE>
    </div>
    <div style="margin-top: 10px" v-if="ruleForm.cLamdaTypeCode === 'Set'">
      <BDSSET
        :Head="props.Head"
        @change-rule-form="handleChangeRuleForm"
      ></BDSSET>
    </div>
  </div>
</template>

<script setup lang="ts">
import BDS from '@/components/BDS/index.vue';
import BDSSET from '@/components/BDS/index_set.vue';
import BDSWHERE from '@/components/BDS/index_where.vue';
import {
  ref,
  toRefs,
  defineProps,
  reactive,
  onMounted,
  computed,
  defineExpose,
  watch,
  onActivated,
  defineEmits,
  inject
} from 'vue';
import { MoreFilled } from '@element-plus/icons-vue';
import {
  ElCard,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElMessage,
  ElIcon,
  ElInput,
  ElOption,
  ElSelect,
  FormInstance,
  ElTree,
  ElLoading
} from 'element-plus';
import useStore from '@/store';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import ImgPreview from '@/components/ImgPrive/index.vue'; //图片预览
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import router from '@/router';
import { useRoute } from 'vue-router';
import { localStorage, sessionStorage } from '@/utils/storage';
import { getCurrentInstance, nextTick } from '@vue/runtime-core'; // 引入getCurrentInstance
import dayjs from 'dayjs';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const emits = defineEmits([
  'tabValType',
  'clickView',
  'BtnDAel',
  'clickGetDataUser',
  'RoleBut',
  'GetTreeRoad'
]);
const Route = useRoute();
const imgIshow = ref(false); //预览图片
const props = defineProps({
  Head: {
    required: true,
    type: Array as any,
    default: () => []
  },
  row: {
    type: Object
  },
  rowId: {
    type: String
  },
  tabVal: {
    type: String,
    default: () => ''
  },
  showCode: {
    type: String,
    default: () => ''
  },
  showVal: {
    type: String,
    default: () => ''
  },
  disabled: {
    type: Boolean,
    default: () => false
  },
  treeSelData: {
    type: Array as any,
    default: () => []
  },
  MID: {
    type: String
  },
  formObj: {
    type: Object
  }
});
//级联树结构绑定值
const optionData = ref([]) as any;
const prop = {
  children: 'Child',
  label: 'cFactoryUnitName'
};
// eslint-disable-next-line vue/no-setup-props-destructure
// const rowVal = props.row

let HeadData = ref([]) as any;
let HeadViewData = ref([]) as any;
let pathName = ref('');
let filterVal = ref('');
let filterData = ref([]) as any;
let ButObjTableData = ref([]) as any;
const row = ref();
const MID = ref();
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
const ruleFormRef = ref<FormInstance>();
const ruleForm: any = ref({});
const ruleFormData: any = ref({});
const treeRef = ref<InstanceType<typeof ElTree>>();
const propsTreeSelData = ref([]);
const showCodeVal = ref('');
const showValData = ref();
const HeadFormvalue = ref([]) as any;
const ImgName = ref('');

watch(
  () => props.row,
  (newValue, oldValue) => {
    ruleForm.value = newValue;
    ImgName.value = '';
    //设备点检的图片预览
    if (
      (Route.name == 'ProjectView' || Route.name === 'DeviceProgram') &&
      ruleForm.value.VouchFileName
    ) {
      let arr = ruleForm.value.VouchFileName.split('&');
      ImgName.value = arr[0];
    }

    //单行数据获取的UID
    row.value = newValue;
  }
);
watch(
  () => props.MID,
  (newValue, oldValue) => {
    ruleForm.value = newValue;
    MID.value = newValue;
  }
);

watch(
  () => props.Head,
  (newValue, oldValue) => {
    HeadFormvalue.value = newValue;
    // HeadData.value = newValue.filter((item: any) => item.cAttributeCode != 'Data')
    HeadViewData.value = newValue.filter(
      (item: any) =>
        item.Resource.cAttributeTypeCode == 'binddata' &&
        item.cAttributeCode != 'Tool'
    );
    headVal();
    funHeadview();
    funHeadData(newValue);
  }
);
watch(
  () => props.treeSelData,
  newVal => {
    propsTreeSelData.value = newVal;
  }
);
watch(
  () => props.showCode,
  newVal => {
    showCodeVal.value = newVal;
    if (
      showCodeVal.value == 'ManageCenter.Inentory.M.Add.Base' ||
      showCodeVal.value == 'ManageCenter.Inentory.M.Add.WMS' ||
      showCodeVal.value == 'ManageCenter.Inentory.M.Add.Extend'
    ) {
      setTimeout(() => {
        ruleForm.value = { ...showValData.value, ...ruleForm.value };
      }, 100);
    }
  },
  { deep: true }
);
watch(
  () => props.showVal,
  newVal => {
    showValData.value = newVal;
  }
);
watch(
  () => props.formObj,
  (newValue, oldValue) => {
    setTimeout(() => {
      ruleForm.value = newValue;
    }, 1000);
  },
  { deep: true }
);
onActivated(() => {
  // 新增时候，至为空
  if (history.state.type) {
    if (history.state.type == 'add') {
      ruleForm.value = {};
    }
  }
});
onMounted(() => {
  if (Route.query.pathName) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pathName.value = Route.query.pathName;
  }
});
$bus.on('BDSGET', (val: any) => {
  if (Route.name == 'AddBusineScen') {
    funHeadview();
  }
});
$bus.on('SETBDS', (val: any) => {
  if (Route.name == 'AddBusineScen') {
    ruleForm.value.cLamda = val;
  }
});
const rules = computed(() => {
  let obj: any = {};
  HeadData.value
    .filter((item: { IsRequest: boolean }) => {
      if (Route.name === 'AddBusineScen' && Route.meta.title.match(/新增/gi)) {
        if (item.cAttributeName === '条件表达式') {
          return false;
        }
      }
      return item.IsRequest;
    })
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
        if (item.Resource.cAttributeCode == 'cLoginName') {
          obj[item.Resource.cAttributeCode] = [
            {
              required: true,
              trigger: 'blur',
              message: `请输入${item.Resource.cAttributeName}`
            },
            { min: 3, max: 10, message: '长度必须在3-10', trigger: 'blur' }
          ];
        }
      }
    );
  return obj;
});
const validateObj = ref();
//预览图片
let url = ref('');
const srcList = ref([]) as any;
const PriveImg = (obj: any) => {
  if (!obj) return;
  if (Route.name === 'CheckOderView') {
    srcList.value.push(ruleForm.value.cFilePath);
    imgIshow.value = true;
    return;
  }
  let arr = obj.split('&');
  ImgName.value = arr[0];
  let url = arr[1];
  srcList.value.push(url);
  imgIshow.value = true;
};
//生产单元级联选中数据
const treeVal = ref([]);
const getDataVal = ref([]) as any;
const joinnameData = ref();
const joincodeData = ref();
const funHeadData = (newValue: any) => {
  HeadData.value = newValue.filter(
    (item: any) => item.cAttributeCode != 'Data'
  );
  getDataVal.value = newValue;
  setTimeout(() => {
    getData(newValue);
    getTreeData(newValue);
  }, 300);
};
const disabledFun = (item: any) => {
  if (
    Route.name === 'DeviceProgram' ||
    Route.name == 'RawMaterialComparisonEdit' ||
    Route.name == 'LaboratoryMaterialControlEdit' ||
    Route.name == 'InventoryProductComparisonEdit'
  ) {
    return true;
  } else {
    return item.DefinedParm4 == 1 ? true : false;
  }
};
const funMultiple = (item: any) => {
  if (
    Route.name == 'material' ||
    Route.name == 'materialEdit' ||
    Route.name == 'materialView'
  ) {
    if (item.cAttributeName == '标签') {
      return true;
    }
  } else {
    return false;
  }
};
const selectItem = ref('') as any;
const clearSelect = (v: any, item: any) => {
  // if(Route.name=='AddPartolPlan' || Route.name=='EditPatrolPlan' ||Route.name=='ViewPatrolPlan'){
  //     ruleForm.value.dProductDate=''
  //     getData(HeadFormvalue.value)
  //         // if(ruleForm.value.dProductDate){
  //         // }
  //     }
};
// 解决保存成功后，再次打开，下拉数据没有加载
const selectVisible = (v: any, obj: any, item: any) => {
  selectItem.value = item;
  if (v) {
    if (!obj) {
      getData(HeadFormvalue.value);
    }
    if (Route.name == 'materialEdit') {
      getData(HeadFormvalue.value);
    }
    //两个下拉关联状态
    if (
      Route.name == 'inspectionNormeAdd' ||
      Route.name == 'inspectionNormeEdit' ||
      Route.name == 'inspectionNormeView'
    ) {
      getData(HeadFormvalue.value);
    }
    if (
      Route.name == 'AddPartolPlan' ||
      Route.name == 'EditPatrolPlan' ||
      Route.name == 'ViewPatrolPlan'
    ) {
      if (ruleForm.value.dProductDate) {
        getData(HeadFormvalue.value);
      }
    }
    if (
      Route.name == 'CityWarehouseArchivesAdd' ||
      Route.name == 'CityWarehouseArchivesEdit' ||
      Route.name == 'CityWarehouseArchivesView'
    ) {
      if (item.cAttributeName == '地级市名称') {
        ruleForm.value.cPrefectureCityName_Data = [];
        if (ruleForm.value.cProvinceName) {
          getData(HeadFormvalue.value);
        }
      }
      if (item.cAttributeName == '省名称') {
        ruleForm.value.cProvinceName = '';
        getData(HeadFormvalue.value);
      }
    }
  }
};
//获取下拉框数据
const getData = (newValue: any) => {
  newValue
    .filter(
      (item: any) => item.cControlTypeCode == 'ComboBox' && item.IsShow == true
    )
    .forEach((item: any) => {
      let keyVal = item.Resource.cAttributeCode + '_Data';
      let extraKey = item.Resource.cAttributeCode + '_Current_Data';
      let obj = {};
      //采购申请状态下拉数据
      if (
        Route.name == 'otherInNotifyAdd' ||
        Route.name == 'otherInNotifyDetail' ||
        Route.name == 'otherInNotifyEdit' ||
        Route.name == 'otherOutNotifyAdd' ||
        Route.name == 'otherOutNotifyDetail' ||
        Route.name == 'otherOutNotifyEdit'
      ) {
        obj = {};
      } else if (
        Route.name == 'PurchaseRequest' ||
        Route.name == 'PurchaseAudit'
      ) {
        obj = { Conditions: 'cDictonaryTypeCode=PlanPurchaseVouchIStatus' };
      } else if (
        Route.name == 'testRatingAdd' ||
        Route.name == 'testRatingEdit' ||
        Route.name == 'testRatingView'
      ) {
        obj = { Conditions: '' };
      } else if (
        Route.name == 'AddPartolPlan' ||
        Route.name == 'EditPatrolPlan' ||
        Route.name == 'ViewPatrolPlan'
      ) {
        obj = { Date: ruleForm.value.dProductDate || '' };
      } else if (
        Route.name == 'inspectionNormeAdd' ||
        Route.name == 'inspectionNormeEdit' ||
        Route.name == 'inspectionNormeView'
      ) {
        if (selectItem.value.cAttributeName == '指标名称') {
          if (ruleForm.value.cProgramName) {
            obj = { Conditions: 'cProgramCode=' + ruleForm.value.cProgramCode };
          } else {
            obj = { Conditions: 'cProgramCode=' + '' };
          }
        } else {
          obj = { Conditions: '' };
        }
      } else if (
        Route.name == 'CityWarehouseArchivesAdd' ||
        Route.name == 'CityWarehouseArchivesEdit' ||
        Route.name == 'CityWarehouseArchivesView'
      ) {
        if (ruleForm.value.cProvinceName) {
          //二级
          obj = { Conditions: 'cParentCode=' + ruleForm.value.cProvince };
        } else {
          //一级
          obj = { Conditions: '' };
        }
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
        //     // Conditions:"cDictonaryTypeCode="+item.Resource.cAttributeCode+"&&cAuthCode="+item.Resource.cAuthCode
        //     // cDictonaryTypeCode: item.Resource.cAttributeCode
        //     Conditions:"cDictonaryTypeCode="+item.Resource.cAttributeCode
        // }
      };
      // 巡线计划新增 特殊处理
      if (
        Route.name == 'AddPartolPlan' ||
        Route.name == 'EditPatrolPlan' ||
        Route.name == 'ViewPatrolPlan'
      ) {
        if (!ruleForm.value.dProductDate) return false;
      }

      ParamsApi(data).then((res: any) => {
        ruleFormData.value[keyVal] = res.data;
        ruleFormData.value[extraKey] = res.data;
        ruleForm.value = { ...ruleForm.value, ...ruleFormData.value };
      });
    });
};

const ChooseCode = ref('');
const Idata = ref({}) as any;
const cDeviceTypeData = ref({}) as any;
const cDeviceSourceData = ref({}) as any;
const remoteMethod = (item: any, query: any) => {
  // getData(getDataVal.value)
  let list: any = JSON.parse(
    JSON.stringify(ruleForm.value[item.Resource.cAttributeCode + '_Data'])
  );
  if (ruleForm.value[item.Resource.cAttributeCode + '_Data'].length === 0) {
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
//下拉框变化时(策略管理新增的添加获取策略类型选中值)
const GetTreeRoad = (item: any, value: any) => {
  if (Route.name == 'policMangmentAdd' || Route.name == 'policMangmentEdit') {
    ChooseCode.value = value;
    Idata.value = ruleFormData.value.cPolicyTypeName_Data.filter((i: any) => {
      if (i.cDictonaryCode == value) {
        return i;
      }
    });
    window.sessionStorage.setItem('policyCode', value);
    emits('GetTreeRoad', value);
  }
  // WMS 调拨单
  if (
    Route.name === 'TransferRecordAdd' ||
    Route.name === 'TransferRecordEdit'
  ) {
    let valData: any = [];
    valData =
      ruleForm.value[item.cAttributeCode + '_Data']?.filter(
        (v: any) => v.cWareHouseName == value
      ) ?? [];

    if (item.cAttributeName == '调出仓库') {
      ruleForm.value.cOutWareHouseName = valData[0].cWareHouseCode;
      ruleForm.value.cOutWareHouseCode = valData[0].cWareHouseName;
    }
    if (item.cAttributeName == '调入仓库') {
      ruleForm.value.cInWareHouseName = valData[0].cWareHouseCode;
      ruleForm.value.cInWareHouseCode = valData[0].cWareHouseName;
    }
  }
  if (Route.name == 'EditDevice' || Route.name == 'AddDevice') {
    if (
      ruleFormData.value.cDeviceTypeName_Data.length > 0 &&
      item.cAttributeName == '设备类型'
    ) {
      cDeviceTypeData.value = ruleFormData.value.cDeviceTypeName_Data.filter(
        (i: any) => {
          if (i.cDictonaryCode == value) {
            return i;
          }
        }
      );
      window.sessionStorage.setItem(
        'cDeviceTypeData',
        JSON.stringify(cDeviceTypeData.value)
      );
    }
    if (
      ruleFormData.value.cDeviceSourceName_Data.length > 0 &&
      item.cAttributeName == '设备来源'
    ) {
      cDeviceSourceData.value =
        ruleFormData.value.cDeviceSourceName_Data.filter((i: any) => {
          if (i.cDictonaryCode == value) {
            return i;
          }
        });
      window.sessionStorage.setItem(
        'cDeviceSourceData',
        JSON.stringify(cDeviceSourceData.value)
      );
    }
  }
  if (Route.name == 'AddTarget' || Route.name == 'EditTarget') {
    if (
      ruleFormData.value.cStandardTypeName_Data.length > 0 &&
      item.cAttributeName == '指标类型'
    ) {
      cDeviceTypeData.value = ruleFormData.value.cStandardTypeName_Data.filter(
        (i: any) => {
          if (i.cDictonaryCode == value) {
            return i;
          }
        }
      );
    }
  }
  if (Route.name == 'newApplication') {
    let valData: any = [];
    if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
      valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
        (v: any) => {
          if (item.cAttributeCode == 'iCheckResultName') {
            return v.cDictonaryCode == value;
          }
        }
      );
    }
    ruleForm.value.iCheckResultName = valData[0].cDictonaryName;
    ruleForm.value.iCheckResultCode = valData[0].cDictonaryCode;
    ruleForm.value.iCheckResult = valData[0].cDictonaryCode;
  }
  if (
    Route.name == 'CityWarehouseArchivesAdd' ||
    Route.name == 'CityWarehouseArchivesEdit' ||
    Route.name == 'CityWarehouseArchivesView'
  ) {
    if (item.cAttributeName == '省名称') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (ruleForm.value[item.cAttributeCode] == v.cAreaCode) {
              return v;
            }
          }
        );
      }
      ruleForm.value.cProvinceName = valData[0].cAreaName;
      ruleForm.value.cProvince = valData[0].cAreaCode;
    }
    if (item.cAttributeName == '地级市名称') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (ruleForm.value[item.cAttributeCode] == v.cAreaCode) {
              return v;
            }
          }
        );
      }
      ruleForm.value.cPrefectureCityName = valData[0].cAreaName;
      ruleForm.value.cPrefectureCity = valData[0].cAreaCode;
    }
  }
  if (
    Route.name == 'testRatingAdd' ||
    Route.name == 'testRatingEdit' ||
    Route.name == 'testRatingView'
  ) {
    if (item.cAttributeCode == 'cProgramName') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (item.cAttributeCode == 'cProgramName') {
              return v.cProgramCode == value;
            }
          }
        );
      }
      ruleForm.value.cProgramCode = valData[0].cProgramCode;
    }
    if (item.cAttributeCode == 'cAnalysisTypeName') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (item.cAttributeCode == 'cAnalysisTypeName') {
              return v.cDictonaryCode == value;
            }
          }
        );
      }
      ruleForm.value.cAnalysisTypeCode = valData[0].cDictonaryCode;
    }
    if (item.cAttributeCode == 'cCheckTypeName') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (item.cAttributeCode == 'cCheckTypeName') {
              return v.cDictonaryCode == value;
            }
          }
        );
      }
      ruleForm.value.cCheckTypeCode = valData[0].cDictonaryCode;
    }
  }
  if (
    Route.name == 'inspectionNormeAdd' ||
    Route.name == 'inspectionNormeEdit' ||
    Route.name == 'inspectionNormeView'
  ) {
    if (item.cAttributeName == '项目名称') {
      ruleForm.value.cStandardName = '';
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (item.cAttributeCode == 'cProgramName') {
              return v.cProgramCode == value;
            }
          }
        );
      }
      ruleForm.value.cProgramCode = valData[0].cProgramCode;
      ruleForm.value.cProgramName = valData[0].cProgramName;
    }
    if (item.cAttributeName == '指标名称') {
      let valData: any = [];
      if (ruleForm.value[item.cAttributeCode + '_Data'].length) {
        valData = ruleForm.value[item.cAttributeCode + '_Data'].filter(
          (v: any) => {
            if (item.cAttributeCode == 'cStandardName') {
              return v.cStandardCode == value;
            }
          }
        );
      }
      ruleForm.value.cStandardCode = valData[0].cStandardCode;
      ruleForm.value.cStandardName = valData[0].cStandardName;
      ruleForm.value.cCheckTypeName = valData[0].cCheckTypeName;
      ruleForm.value.cCheckTypeCode = valData[0].cCheckTypeCode;
      ruleForm.value.cAnalysisTypeName = valData[0].cAnalysisTypeName;
      ruleForm.value.cAnalysisTypeCode = valData[0].cAnalysisTypeCode;
      ruleForm.value.nSore = valData[0].nSore;
      // ruleForm.value.cCheckQuantity=valData[0].x
      ruleForm.value.cGuideMemo = valData[0].cGuideMemo;
      ruleForm.value.nStandValue = valData[0].nStandValue;
      ruleForm.value.nMaxValue = valData[0].nMaxValue;
      ruleForm.value.nMinValue = valData[0].nMinValue;
      ruleForm.value.nNoQualificationRate = valData[0].nNoQualificationRate;
      ruleForm.value.cMemo = valData[0].cMemo;
      ruleForm.value.cPARM01 = valData[0].cPARM01;
    }
  }
};
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

//级联树结构选项变化
const treeChange = (valKey: any) => {
  // console.log(treeRef.value[0],"--===treeRef.value");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let fatherName = treeRef.value[0].getHalfCheckedNodes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let childrenName = treeRef.value[0].getCheckedNodes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  treeVal.value = treeRef.value[0].getCheckedKeys(); //选中的数据
  let AllData = [...fatherName, ...childrenName];
  let code = ref([]) as any;
  let name = ref([]) as any;
  AllData.forEach((item: any) => {
    code.value.push(item.cFactoryUnitCode);
    name.value.push(item.cFactoryUnitName);
  });

  joinnameData.value = name.value.join('.');
  joincodeData.value = code.value.join('.');
  // TODO：
  if (
    Route.name == 'addProductLine' ||
    Route.name == 'addProductLineEdit' ||
    Route.name == 'addProductLineView'
  ) {
    ruleForm.value['cFactoryUnitCode'] = joincodeData.value;
  }
  //班组,处理树形名称的传递形式
  if (
    Route.name == 'AddTeamJob' ||
    Route.name == 'AddTeamJobEdit' ||
    Route.name == 'AddTeamJobView'
  ) {
    ruleForm.value['cFactoryUnitName'] = joinnameData.value;
    ruleForm.value['cFactoryUnitCode'] = joincodeData.value;
  }
  //日历编辑
  if (
    Route.name == 'AddCalendlerWork' ||
    Route.name == 'AddCalendlerWorkEdit' ||
    Route.name == 'AddCalendlerWorkView'
  ) {
    ruleForm.value['cFactoryUnitName'] = joinnameData.value;
    ruleForm.value['cFactoryUnitCode'] = joincodeData.value;
  }
};

// 编辑/详情的数据
const funHeadview = () => {
  if (HeadViewData.value.length > 0) {
    let AxiosData = HeadViewData.value[0];
    let paramsData = {};
    if (
      props.tabVal == 'ManageCenter.Inentory.M.Edit.WMS' ||
      props.tabVal == 'ManageCenter.Inentory.M.Edit.Extend' ||
      props.tabVal == 'ManageCenter.Inentory.M.View.WMS' ||
      props.tabVal == 'ManageCenter.Inentory.M.View.Extend'
    ) {
      paramsData = {
        cInvCode: window.sessionStorage.getItem('cInvCode') || ''
      };
      //到货单详情页面form数据获取时传的UID（新增之后，自动跳转，UID通过组件传过来）
    } else if (
      Route.name == 'newPurchasedGoodsView' ||
      Route.name == 'newPurchasedGoods' ||
      Route.name == 'newPurchasedGoodsEdit'
    ) {
      paramsData = { val: props.rowId };
    } else if (window.sessionStorage.getItem('RepairUID')) {
      paramsData = { val: window.sessionStorage.getItem('RepairUID') };
      //设备编辑----
    } else if (
      Route.name == 'EditDevice' &&
      props.tabVal == 'Device.device.M.Edit.Base' &&
      !row.value
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let uid = JSON.parse(window.sessionStorage.getItem('DeviceData'))?.UID;
      paramsData = { val: uid };
    } else if (Route.name == 'BomDoorInfo') {
      if (row.value.Level == 13) {
        paramsData = { UID: row.value.cKey };
      } else if (row.value.Level == 66) {
        paramsData = { UID: row.value.UID };
      } else {
        paramsData = { cBomCode: row.value.cKey };
      }
    } else if (
      Route.name == 'BomDoorInfoCLView' ||
      Route.name == 'BomDoorInfoGZView' ||
      Route.name == 'BomDoorInfoBDSView' ||
      Route.name == 'BomDoorInfoView'
    ) {
      paramsData = { UID: Route.params.rowId };
    } else if (Route.name == 'ToolGringView') {
      paramsData = { UID: Route.params.rowId };
    } else if (Route.name == 'InWareView') {
      paramsData = { UID: Route.params.rowId };
    } else if (Route.name == 'inspectionSchemeEdit') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      paramsData = {
        val: JSON.parse(window.sessionStorage.getItem('inspectionScheme'))
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // paramsData = { val: props.rowId || props.row.UID ||Route.params.rowId}
      paramsData = { val: Route.params.rowId };
    }
    let dataVal = {
      method: AxiosData.Resource.cHttpTypeCode,
      url: AxiosData.Resource.cServerIP + AxiosData.Resource.cUrl,
      params: paramsData
    };
    ParamsApi(dataVal).then((res: any) => {
      ruleForm.value = { ...res.data, ...ruleFormData.value };
      // ruleForm.value.dProductDate='2024-04-11'
      if (
        Route.name == 'AddPartolPlan' ||
        Route.name == 'EditPatrolPlan' ||
        Route.name == 'ViewPatrolPlan'
      ) {
        if (ruleForm.value.dProductDate) {
          let vv = convertToDate(ruleForm.value.dProductDate);
          ruleForm.value.dProductDate = vv;
        }
      }
      emits('RoleBut', ruleForm.value);
      if (ruleForm.value.cPolicyTypeCode) {
        window.sessionStorage.setItem(
          'policyCode',
          ruleForm.value.cPolicyTypeCode
        );
        let dataArr = ruleFormData.value.cPolicyTypeName_Data;
        if (dataArr) {
          Idata.value = dataArr.filter((i: any) => {
            if (i.cDictonaryCode == ruleForm.value.cPolicyTypeCode) {
              return i;
            }
          });
        }
      }
      if (Route.name == 'neworiginalOrder') {
        ruleForm.value.cDefindParm02 = formatDate(ruleForm.value.cDefindParm02);
        ruleForm.value.cDefindParm03 = formatDate(ruleForm.value.cDefindParm03);
      }
      if (
        props.tabVal == 'ManageCenter.Inentory.M.Edit.Base' ||
        props.tabVal == 'ManageCenter.Inentory.M.View.Base'
      ) {
        window.sessionStorage.setItem('cInvCode', ruleForm.value.cInvCode);
        window.sessionStorage.setItem(
          'cInvClassCode',
          ruleForm.value.cInvClassCode
        );
      }
      if (
        Route.name == 'addProductLine' ||
        Route.name == 'addProductLineEdit' ||
        Route.name == 'addProductLineView'
      ) {
        treeVal.value = res.data.cFactoryUnitCode.length
          ? res.data.cFactoryUnitCode.split('.').slice(-1)
          : [];
        ruleForm.value.cFactoryUnitName = treeVal.value.toString();
      }
      if (
        Route.name == 'AddCalendlerWork' ||
        Route.name == 'AddCalendlerWorkEdit' ||
        Route.name == 'AddCalendlerWorkView'
      ) {
        treeVal.value = res.data.cFactoryUnitCode.length
          ? res.data.cFactoryUnitCode.split('.').slice(-1)
          : [];
        ruleForm.value.cFactoryUnitName = treeVal.value.toString();
      }
      if (
        Route.name == 'AddTeamJob' ||
        Route.name == 'AddTeamJobEdit' ||
        Route.name == 'AddTeamJobView'
      ) {
        treeVal.value = res.data.cFactoryUnitCode.length
          ? res.data.cFactoryUnitCode.split('.').slice(-1)
          : [];
        ruleForm.value.cFactoryUnitName = treeVal.value.toString();
      }
      if (Route.name == 'materialEdit' || Route.name == 'materialView') {
        if (
          ruleForm.value.cDefindParm01List &&
          ruleForm.value.cDefindParm01List.length
        ) {
          let list = [] as any;
          ruleForm.value.cDefindParm01List.map((aa: any) => {
            list.push(aa.cDictonaryCode);
          });
          ruleForm.value.cDefindParm01 = list;
        }
      }
      //到货单
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (
        (Route.name == 'newPurchasedGoodsView' &&
          Route.meta.title.match(/详情/gi)) ||
        (Route.name == 'newPurchasedGoodsEdit' &&
          Route.meta.title.match(/详情/gi))
      ) {
        emits('BtnDAel', res.data.iStatus);
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ruleFormRef.value.resetFields();
      clearValidate();
    });
  }
};
const convertToDate = (datetime: any) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatDate = (date: any) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

// 处理数据默认值
const headVal = () => {
  let obj = {};
  HeadData.value.map((item: any) => {
    if (item.IsShow) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      obj[item.cAttributeCode] = '';
    }
  });
  ruleForm.value = obj;
  if (
    (Route.name == 'addProductLine' && propsTreeSelData.value.length) ||
    (Route.name == 'addProductLineEdit' && propsTreeSelData.value.length) ||
    (Route.name == 'addProductLineView' && propsTreeSelData.value.length)
  ) {
    treeVal.value = propsTreeSelData.value.length
      ? propsTreeSelData.value.slice(-1)
      : [];
    ruleForm.value.cFactoryUnitCode = propsTreeSelData.value.join('.');
    ruleForm.value.cFactoryUnitName = treeVal.value.toString();
  }

  if (Route.name === 'material') {
    ruleForm.value.IsStore = false;
    ruleForm.value.IsBatch = false;
    ruleForm.value.IsAuth = false;
  }

  if (
    Route.name === 'AddPurchaseNote' ||
    Route.name === 'ScrapToolInfoAdd' ||
    Route.name === 'resizeDialAdd' ||
    Route.name === 'AddGrindOrder' ||
    Route.name === 'TooolInfo'
  ) {
    ruleForm.value.dDate = dayjs(new Date()).format('YYYY-MM-DD');
  }
  if (Route.name === 'newPurchasedGoods') {
    ruleForm.value.dArriveDate = dayjs(new Date()).format('YYYY-MM-DD');
  }
};

// 搜索弹框事件
const clickModel = (obj: any, type: any) => {
  if (
    Route.name == 'newOutputPlan' ||
    Route.name == 'newOutputPlanEdit' ||
    Route.name == 'newOutputPlanView'
  ) {
    if (
      obj.Resource.cAttributeCode == 'cVersion' &&
      !ruleForm.value.cProjectName
    ) {
      ElMessage({
        message: '请先选择方案名称',
        type: 'error'
      });
      return false;
    }

    if (
      obj.Resource.cAttributeCode === 'cPreBatch' &&
      !ruleForm.value.dProductDate
    ) {
      ElMessage({
        message: '请先选择生产日期',
        type: 'error'
      });
      return false;
    }
  }

  filterData.value = [
    {
      cAttributeCode: obj.Resource.cAttributeCode,
      cAttributeCodeValue: ruleForm.value[obj.Resource.cAttributeCode] || '',
      cConditions: 'like'
    }
  ];
  MulitChoose.value = type;
  titleName.value = obj.Resource.cAttributeName;
  AttributeCode.value = obj.Resource.cAttributeCode;
  dialogType.value = true;
  codeType.value = obj.cIncludeModelCode || '';
  filterVal.value = ruleForm.value.cType;
};
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
//上级部门编码
const DepClassCode = ref();
//部门编码
const DepCode = ref();
//供应商分类编码
const cVenCode = ref({}) as any;
//工厂编码
const FactoryCode = ref();
//车间编码
const WorkCode = ref();
//库位编码
const WareHouseLocationCode = ref();
//生产单元编码
const OrganizationCode = ref();
//父项目
const ParentName = ref();
//排产MID
const planMID = ref();
//弹框勾选数据
const selectData = (val: any) => {
  //排产新增MID
  val.value.forEach((item: { MID: any }) => {
    if (item.MID) {
      planMID.value = item.MID;
    }
  });
  //获取部门编码
  val.value.forEach((item: { cDepCode: any }) => {
    if (item.cDepCode) {
      DepCode.value = item;
    }
  });
  //上级部门编码cDepClassCode
  val.value.forEach((item: { cDepClassCode: any }) => {
    if (item.cDepClassCode) {
      DepClassCode.value = item;
    }
  });
  //供应商/分类编码
  val.value.forEach((item: { cVendorClassCode: any }) => {
    if (item.cVendorClassCode) {
      cVenCode.value = item;
    }
  });
  //获取工厂编码
  val.value.forEach((item: { cFactoryCode: any }) => {
    if (item.cFactoryCode) {
      FactoryCode.value = item;
    }
  });
  //车间编码
  val.value.forEach((item: { cWorkCode: any }) => {
    if (item.cWorkCode) {
      WorkCode.value = item;
    }
  });
  //物料盒库位编码cWareHouseLocationCode
  val.value.forEach((item: { cWareHouseLocationCode: any }) => {
    if (item.cWareHouseLocationCode) {
      WareHouseLocationCode.value = item;
    }
  });
  //生产单元编码OrganizationCode
  val.value.forEach((item: { cOrganizationCode: any }) => {
    if (item.cOrganizationCode) {
      OrganizationCode.value = item;
    }
  });
  // 单选
  if (val.type === false) {
    ruleForm.value[AttributeCode.value] = val.value[0][AttributeCode.value];
    if (
      Route.name === 'YL-RecipeFilesAdd' ||
      Route.name === 'YL-RecipeFilesEdit'
    ) {
      if (AttributeCode.value == 'cInvName') {
        ruleForm.value['cInvCode'] = val.value[0]['cInvCode'] || '';
      }
    }
    if (
      Route.name == 'addSupplierClass' ||
      Route.name == 'addSupplierClassEdit' ||
      Route.name == 'addSupplierClassView'
    ) {
      //供应商增页面，获取供应商/分类编码
      if (AttributeCode.value == 'cParentCode') {
        ruleForm.value['cParentCode'] =
          cVenCode.value['cVendorClassCode'] || '';
      }
      //供应商增页面，获取供应商/分类编码
      if (AttributeCode.value == 'cParentName') {
        ruleForm.value['cParentName'] =
          cVenCode.value['cVendorClassName'] || '';
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
    }
    // 用户管理
    if (Route.name == 'UserAdd' || Route.name == 'UserAddEdit') {
      ruleForm.value['PersonUID'] = val.value[0]['cEmployeeCode'];
    }
    // 班次
    if (
      Route.name == 'addWorkingShift' ||
      Route.name == 'addWorkingShiftEdit' ||
      Route.name == 'addWorkingShiftView'
    ) {
      ruleForm.value['cOrganizationCode'] =
        val.value[0].cOrganizationCode || '';
    }
    // 物料的新增/编辑
    if (
      Route.name == 'material' ||
      Route.name == 'materialEdit' ||
      Route.name == 'materialView'
    ) {
      if (AttributeCode.value == 'cWareHouseName') {
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
      if (AttributeCode.value == 'cWareHouseAreaName') {
        ruleForm.value['cWareHouseAreaCode'] =
          val.value[0].cWareHouseAreaCode || '';
      }
      if (AttributeCode.value == 'cWareHouseLocationName') {
        ruleForm.value['cWareHouseLocationCode'] =
          val.value[0].cWareHouseLocationCode || '';
      }
      if (AttributeCode.value == 'cInvClassName') {
        ruleForm.value['cInvClassCode'] = val.value[0].cInvClassCode || '';
      }
      if (AttributeCode.value == 'cDefaultWareHouseCode') {
        ruleForm.value['cDefaultWareHouseCode'] =
          val.value[0].cWareHouseCode || '';
        ruleForm.value['cDefaultWareHouseName'] =
          val.value[0].cWareHouseName || '';
      }
      if (AttributeCode.value == 'cVendorName') {
        ruleForm.value['cVendorCode'] = val.value[0].cVendorCode || '';
        ruleForm.value['cVendorName'] = val.value[0].cVendorName || '';
      }
      if (AttributeCode.value == 'cDefindParm03') {
        ruleForm.value['cDefindParm03'] = val.value[0].cBomName || '';
        ruleForm.value['cDefindParm02'] = val.value[0].cBomCode || '';
      }
    }
    // addFactory
    //工段
    if (Route.name == 'workSectionFileAdd') {
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonName'] = val.value[0].cEmployeeName || '';
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
    }
    //车间档案新增/编辑
    if (Route.name == 'addWorkShop') {
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonName'] = val.value[0].cEmployeeName || '';
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
      //车间档案，获取工厂编码
      if (AttributeCode.value == 'cFactoryName') {
        ruleForm.value['cFactoryCode'] =
          FactoryCode.value['cFactoryCode'] || '';
      }
    }
    if (
      Route.name == 'AddPartolPlan' ||
      Route.name == 'newOutputPlanEdit' ||
      Route.name === 'RawMaterialComparisonAdd' ||
      Route.name === 'RawMaterialComparisonEdit'
    ) {
      if (AttributeCode.value == 'cProjectName') {
        ruleForm.value['cProjectName'] = val.value[0].cProjectName || '';
        ruleForm.value['cProjectCode'] = val.value[0].cProjectCode || '';
      }
    }
    //部门档案新增/编辑
    if (
      Route.name == 'adddepartment' ||
      Route.name == 'adddepartmentEdit' ||
      Route.name == 'adddepartmentView'
    ) {
      //上级部门名称
      if (AttributeCode.value == 'cDepClassName') {
        ruleForm.value['cDepClassName'] = val.value[0].cDepName || '';
        ruleForm.value['cDepClassCode'] = val.value[0].cDepCode || '';
      }
    }
    //生产单元新增/编辑
    if (
      Route.name == 'AddproductionCell' ||
      Route.name == 'AddproductionCellEdit' ||
      Route.name == 'AddproductionCellView'
    ) {
      //上级单元名称
      if (AttributeCode.value == 'cParentName') {
        ruleForm.value['cParentName'] = val.value[0].cFactoryUnitName || '';
      }
      if (AttributeCode.value == 'cParentCode') {
        ruleForm.value['cParentCode'] = val.value[0].cFactoryUnitCode || '';
      }
      //生产单元，获取单元编码
      if (AttributeCode.value == 'cOrganizationName') {
        ruleForm.value['cOrganizationCode'] =
          OrganizationCode.value['cOrganizationCode'] || '';
      }
      //负责人字段匹配
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonName'] = val.value[0].cEmployeeName || '';
      }
      if (AttributeCode.value == 'cNodeResourceCode') {
        ruleForm.value['cNodeResourceCode'] = val.value[0].Code || '';
        ruleForm.value['cNodeResourceName'] = val.value[0].Name || '';
      }
    }
    //工厂档案新增/编辑
    if (Route.name == 'addFactory') {
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonName'] = val.value[0].cEmployeeName || '';
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
    }
    //产线新增/编辑
    if (
      Route.name == 'addProductLine' ||
      Route.name == 'addProductLineEdit' ||
      Route.name == 'addProductLineView'
    ) {
      // if (AttributeCode.value == 'cPersonCode') {
      //     ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || ''
      // }
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonName'] = val.value[0].cEmployeeName || '';
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
      if (AttributeCode.value == 'cWorkName') {
        ruleForm.value['cWorkCode'] = WorkCode.value['cWorkCode'] || '';
      }
    }
    //班组新增/编辑
    if (
      Route.name == 'AddTeamJob' ||
      Route.name == 'AddTeamJobEdit' ||
      Route.name == 'AddTeamJobView'
    ) {
      if (AttributeCode.value == 'cPersonCode') {
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
      if (AttributeCode.value == 'cPersonName') {
        ruleForm.value['cPersonName'] = val.value[0].cEmployeeName || '';
        ruleForm.value['cPersonCode'] = val.value[0].cEmployeeCode || '';
      }
      if (AttributeCode.value == 'cOrganizationName') {
        ruleForm.value['cOrganizationCode'] =
          val.value[0].cOrganizationCode || '';
        ruleForm.value['cOrganizationName'] =
          val.value[0].cOrganizationName || '';
      }
      //车间档案，获取工厂编码
      if (AttributeCode.value == 'cWorkName') {
        ruleForm.value['cWorkCode'] = WorkCode.value['cWorkCode'] || '';
      }
      //班组，获取组织编码
      if (AttributeCode.value == 'cOrganizationName') {
        ruleForm.value['cOrganizationCode'] =
          OrganizationCode.value['cOrganizationCode'] || '';
      }
    }
    if (Route.name == 'addunit' || Route.name === 'addunitEdit') {
      if (AttributeCode.value == 'cUnitClassName') {
        ruleForm.value['cUnitClassName'] = val.value[0].cUnitClassName || '';
        ruleForm.value['cUnitClassCode'] = val.value[0].cUnitClassCode || '';
      }
    }
    //业务档案新增/编辑
    if (
      Route.name == 'AddBusineScen' ||
      Route.name == 'AddBusineScenEdit' ||
      Route.name == 'AddBusineScenView'
    ) {
      if (AttributeCode.value == 'cParentName') {
        ruleForm.value['cParentName'] =
          val.value[0].cProjectName || val.value[0].cProgramName || '';
        ruleForm.value['cParentCode'] =
          val.value[0].cProjectCode || val.value[0].cProgramCode || '';
      }
      if (AttributeCode.value == 'cDimensionalityName') {
        ruleForm.value['cDimensionalityName'] =
          val.value[0].cDimensionalityName || '';
        ruleForm.value['cDimensionalityCode'] =
          val.value[0].cDimensionalityCode || '';
      }
    }
    //日历新增/编辑
    if (
      Route.name == 'AddCalendlerWork' ||
      Route.name == 'AddCalendlerWorkEdit' ||
      Route.name == 'AddCalendlerWorkView'
    ) {
      //日历，获取组织编码
      if (AttributeCode.value == 'cOrganizationName') {
        ruleForm.value['cOrganizationCode'] =
          OrganizationCode.value['cOrganizationCode'] || '';
      }
    }
    //采购申请
    if (
      Route.name == 'AddPurchaseRequest' ||
      Route.name == 'AddPurchaseRequestEdit' ||
      Route.name == 'AddPurchaseRequestView'
    ) {
      //部门编码
      ruleForm.value['cDepCode'] = DepCode.value['cDepCode'] || '';
    }
    //规则集新增/编辑
    if (
      Route.name == 'AddRuleCalendar' ||
      Route.name == 'AddRuleCalendarEdit' ||
      Route.name == 'AddRuleCalendarView'
    ) {
      //获取组织编码
      if (AttributeCode.value == 'cOrganizationName') {
        ruleForm.value['cOrganizationCode'] =
          OrganizationCode.value['cOrganizationCode'] || '';
      }
    }
    //物料盒新增/编辑
    if (
      Route.name == 'materialBoxRecordAdd' ||
      Route.name == 'materialBoxRecordAddEdit' ||
      Route.name == 'materialBoxRecordAddView'
    ) {
      //物料盒档案，获取库位编码
      if (AttributeCode.value == 'cWareHouseLocationName') {
        ruleForm.value['cWareHouseLocationCode'] =
          WareHouseLocationCode.value['cWareHouseLocationCode'] || '';
      }
    }
    //规则配置新增/编辑
    if (
      Route.name == 'AddConfigSpec' ||
      Route.name == 'AddConfigSpecEdit' ||
      Route.name == 'AddConfigSpecView'
    ) {
      ruleForm.value['cRuleGroupName'] = val.value[0].cRuleGroupName || '';
      ruleForm.value['cRuleGroupCode'] = val.value[0].cRuleGroupCode || '';
    }
    //基础档案对照新增/编辑
    if (
      Route.name == 'newFileContrast' ||
      Route.name == 'newFileContrastEdit' ||
      Route.name == 'newFileContrastView'
    ) {
      ruleForm.value['cMesName'] = val.value[0].cDictonaryName || '';
      ruleForm.value['cMesCode'] = val.value[0].cDictonaryCode || '';
    }
    //排产计划
    if (
      Route.name == 'newOutputPlan' ||
      Route.name == 'newOutputPlanEdit' ||
      Route.name == 'newOutputPlanView'
    ) {
      if (AttributeCode.value == 'cProjectName') {
        ruleForm.value['cProjectCode'] = val.value[0].cProjectCode || '';
      }
    }
    //内返（返修原因）
    if (
      Route.name == 'newinLindReturn' ||
      Route.name == 'newinLindReturnEdit' ||
      Route.name == 'newinLindReturnView'
    ) {
      ruleForm.value['cRepairReasonTypeName'] = val.value[0].cReasonName || '';
      ruleForm.value['cRepairReasonTypeCode'] = val.value[0].cReasonCode || '';
    }
    //到货单  供应商编码
    if (
      Route.name == 'newPurchasedGoods' ||
      Route.name == 'newPurchasedGoodsEdit'
    ) {
      ruleForm.value['cVendorCode'] = val.value[0].cVendorCode || '';
    }
    if (
      Route.name == 'AddPurchaseNoteEdit' ||
      Route.name == 'AddPurchaseNoteView' ||
      Route.name == 'AddPurchaseNote'
    ) {
      ruleForm.value['cPhone'] = val.value[0].cPhone || '';
      ruleForm.value['cPerson'] = val.value[0].cPerson || '';
      ruleForm.value['cVendorCode'] = val.value[0].cVendorCode || '';
    }
    //设备档案
    if (Route.name == 'EditDevice' || Route.name == 'AddDevice') {
      ruleForm.value['cDeviceClassCode'] = val.value[0].cDeviceClassCode || '';
    }
    if (
      Route.name == 'AddClientClassify' ||
      Route.name == 'AddClientClassifyEdit' ||
      Route.name == 'AddClientClassifyView'
    ) {
      if (AttributeCode.value == 'cParentName') {
        ruleForm.value['cParentName'] = val.value[0].cParentName || '';
        ruleForm.value['cParentCode'] = val.value[0].cParentCode || '';
      }
    }
    if (
      Route.name == 'AddClientFile' ||
      Route.name == 'AddClientFileEdit' ||
      Route.name == 'AddClientFileView'
    ) {
      if (AttributeCode.value == 'cCustomerClassName') {
        ruleForm.value['cCustomerClassName'] =
          val.value[0].cCustomerClassName || '';
        ruleForm.value['cCustomerClassCode'] =
          val.value[0].cCustomerClassCode || '';
      }
    }
    if (
      Route.name == 'warehouseBillsAdd' ||
      Route.name == 'warehouseBillsEdit' ||
      Route.name == 'warehouseBillsView'
    ) {
      if (AttributeCode.value == 'cWareHouseCode') {
        ruleForm.value['cWareHouseName'] = val.value[0].cWareHouseName || '';
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
      if (AttributeCode.value == 'cWareHouseName') {
        ruleForm.value['cWareHouseName'] = val.value[0].cWareHouseName || '';
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
    }
    if (Route.name == 'AddTarget' || Route.name == 'EditTarget') {
      ruleForm.value['cDeviceStandardClassCode'] =
        val.value[0].cDeviceStandardClassCode || '';
    }
    if (
      Route.name == 'checkBillsAdd' ||
      Route.name == 'checkBillsEdit' ||
      Route.name == 'checkBillsView'
    ) {
      if (AttributeCode.value == 'cWareHouseCode') {
        ruleForm.value['cWareHouseName'] = val.value[0].cWareHouseName || '';
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
      if (AttributeCode.value == 'cWareHouseName') {
        ruleForm.value['cWareHouseName'] = val.value[0].cWareHouseName || '';
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
    }
    if (
      Route.name == 'processFileGYAdd' ||
      Route.name == 'processFileGYEdit' ||
      Route.name == 'processFileGYView' ||
      Route.name == 'processFileGXAdd' ||
      Route.name == 'processFileGXEdit' ||
      Route.name == 'processFileGXView'
    ) {
      if (AttributeCode.value == 'cCraftName') {
        ruleForm.value['cCraftName'] = val.value[0].cCraftName || '';
        ruleForm.value['cCraftCode'] = val.value[0].cCraftCode || '';
      }
    }
    if (
      Route.name == 'InventoryProductComparisonAdd' ||
      Route.name == 'InventoryProductComparisonEdit'
    ) {
      if (AttributeCode.value == 'cProjectName') {
        ruleForm.value['cProjectName'] = val.value[0].cProjectName || '';
        ruleForm.value['cProjectCode'] = val.value[0].cProjectCode || '';
      }
    }
    //刀具档案
    if (Route.name == 'AddToolFile' || Route.name == 'EditToolFile') {
      ruleForm.value['cInvClassCode'] = val.value[0].cInvClassCode || '';
    }
    // 调拨单
    if (
      Route.name == 'resizeDialAdd' ||
      Route.name == 'resizeDialEdit' ||
      Route.name == 'resizeDialInfo'
    ) {
      if (AttributeCode.value == 'cOutWareHouseName') {
        ruleForm.value['cOutWareHouseCode'] = val.value[0].cWareHouseCode || '';
        ruleForm.value['cOutWareHouseName'] = val.value[0].cWareHouseName || '';
      }
      if (AttributeCode.value == 'cInWareHouseName') {
        ruleForm.value['cInWareHouseCode'] = val.value[0].cWareHouseCode || '';
        ruleForm.value['cInWareHouseName'] = val.value[0].cWareHouseName || '';
      }
    }
    if (Route.name == 'AddGrindOrder' || Route.name == 'EditGrindOrder') {
      if (val.value[0].cVendorCode) {
        ruleForm.value['cVendorCode'] = val.value[0].cVendorCode || '';
      }
      if (val.value[0].cWareHouseCode) {
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
    }
    if (Route.name == 'ScrapToolInfoAdd' || Route.name == 'ScrapToolInfoEdit') {
      if (AttributeCode.value == 'cWareHouseName') {
        ruleForm.value['cWareHouseName'] = val.value[0].cWareHouseName || '';
        ruleForm.value['cWareHouseCode'] = val.value[0].cWareHouseCode || '';
      }
    }
    if (
      Route.name == 'PackageProgramAdd' ||
      Route.name == 'PackageProgramEdit' ||
      Route.name == 'PackageProgramView'
    ) {
      if (AttributeCode.value == 'cMergeType') {
        ruleForm.value['cMergeType'] = val.value[0].cDictonaryCode || '';
      }
    }
    if (
      Route.name == 'LabelUsageConfigurationAdd' ||
      Route.name == 'LabelUsageConfigurationEdit' ||
      Route.name == 'LabelUsageConfigurationView'
    ) {
      if (AttributeCode.value == 'STATIONNAME') {
        ruleForm.value['STATIONNAME'] = val.value[0].cPositionName || '';
        ruleForm.value['STATIONCODE'] = val.value[0].cPositionCode || '';
      }
    }
    if (
      Route.name == 'FinishedSubPartComparisonAdd' ||
      Route.name == 'FinishedSubPartComparisonEdit' ||
      Route.name == 'FinishedSubPartComparisonView'
    ) {
      if (AttributeCode.value == 'cInvName') {
        ruleForm.value['cInvName'] = val.value[0].cInvName || '';
        ruleForm.value['cInvCode'] = val.value[0].cInvCode || '';
      }
    }
    if (
      Route.name === 'YL-ProductionOrderAdd' ||
      Route.name === 'YL-ProductionOrderEdit'
    ) {
      if (AttributeCode.value == 'cInvName') {
        ruleForm.value['cInvName'] = val.value[0].cInvName || '';
        ruleForm.value['cInvCode'] = val.value[0].cInvCode || '';
      }
    }
    if (
      Route.name === 'InventoryListAdd' ||
      Route.name === 'InventoryListEdit'
    ) {
      if (AttributeCode.value === 'cDefindParm02') {
        ruleForm.value.cDefindParm02 = val.value[0].cWareHouseAreaCode || '';
        ruleForm.value.cWareHouseCode = val.value[0].cWareHouseCode || '';
        ruleForm.value.cWareHouseName = val.value[0].cWareHouseName || '';
      }
    }
  } else {
    if (Route.name == 'newOutputPlan' || Route.name == 'newOutputPlanEdit') {
      if (AttributeCode.value === 'cPreBatch') {
        ruleForm.value['cPreBatch'] = val.value
          .map((i: any) => i.cBatch)
          .join();
      }
    } else {
      ElMessage({
        message: '多选需要重新配置',
        type: 'error'
      });
    }
  }
  dialogType.value = false;
};
//手动输入弹框数据
const TextBoxLink = () => {
  if (
    Route.name == 'UserAdd' ||
    Route.name == 'UserAddEdit' ||
    Route.name == 'UserAddView'
  ) {
    ruleForm.value.PersonUID = ruleForm.value.cEmployeeName;
  }
  if (
    Route.name == 'addWorkingShift' ||
    Route.name == 'addWorkingShiftEdit' ||
    Route.name == 'addWorkingShiftView'
  ) {
    //班次
    ruleForm.value['cOrganizationCode'] = ruleForm.value.cOrganizationName;
    ruleForm.value.PersonUID = ruleForm.value.cEmployeeName;
  }
  if (
    Route.name == 'material' ||
    Route.name == 'materialEdit' ||
    Route.name == 'materialView'
  ) {
    ruleForm.value.cInvClassCode = ruleForm.value.cInvClassName;
  }
  if (
    Route.name == 'AddConfigSpec' ||
    Route.name == 'AddConfigSpecEdit' ||
    Route.name == 'AddConfigSpecView'
  ) {
    ruleForm.value.cRuleGroupCode = ruleForm.value.cRuleGroupName || '';
  }
  //生产线，手动输入车间
  if (
    Route.name == 'addProductLine' ||
    Route.name == 'addProductLineEdit' ||
    Route.name == 'addProductLineView'
  ) {
    ruleForm.value.cWorkCode = ruleForm.value.cWorkName;
  }
  if (
    Route.name == 'newFileContrast' ||
    Route.name == 'newFileContrastEdit' ||
    Route.name == 'newFileContrastView'
  ) {
    ruleForm.value.cMesCode = ruleForm.value.cMesName;
  }
  if (
    Route.name == 'adddepartment' ||
    Route.name == 'adddepartmentEdit' ||
    Route.name == 'adddepartmentView'
  ) {
    ruleForm.value['cDepClassCode'] = ruleForm.value.cDepClassName;
  }
};

const clearValidate = () => {
  if (
    props.tabVal == 'ManageCenter.Inentory.M.Add.Base' ||
    props.tabVal == 'ManageCenter.Inentory.M.Edit.Base' ||
    props.tabVal == 'ManageCenter.Inentory.M.View.Base'
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ruleFormRef.value.resetFields();
  }
};
const validate = (obj: any) => {
  pathName.value = obj.pathName;
  ButObjData.value = obj.Resource;
  ButObjTableData.value = obj.tableData ? obj.tableData : [];
  validateObj.value = obj;
  submitForm(ruleFormRef.value);
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      newAdd();
    } else {
      console.log('error submit!', fields);
    }
  });
};

// 新增保存
const newAdd = () => {
  if (Route.name == 'resizeDialAdd') {
    if (ruleForm.value.cOutWareHouseCode === ruleForm.value.cInWareHouseCode) {
      ElMessage({
        message: '出库仓库和入库仓库不能相同',
        type: 'error'
      });
      return;
    }
  }
  if (Route.name == 'AddPartolPlan') {
    ruleForm.value.cVouchTypeCode = '01';
  }
  if (Route.name == 'newOutputPlan') {
    ruleForm.value.cVouchTypeCode = '02';
  }
  //职员新增页面，获取部门编码
  // eslint-disable-next-line no-prototype-builtins
  if (ruleForm.value.hasOwnProperty('cEmployeeCode')) {
    ruleForm.value['cDepCode'] = DepCode.value
      ? DepCode.value['cDepCode']
      : ruleForm.value['cDepCode'];
  }
  //策略管理
  if (Route.name == 'policMangmentAdd' || Route.name == 'policMangmentEdit') {
    ruleForm.value['cPolicyTypeName'] = Idata.value[0].cDictonaryName;
    ruleForm.value['cPolicyTypeCode'] = Idata.value[0].cDictonaryCode;
  }
  //设备档案编辑(下拉框数据)-----------------------------
  if (Route.name == 'EditDevice' || Route.name == 'AddDevice') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let type = JSON.parse(window.sessionStorage.getItem('cDeviceTypeData'));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let source = JSON.parse(window.sessionStorage.getItem('cDeviceSourceData'));
    if (type) {
      ruleForm.value['cDeviceTypeCode'] = type[0]?.cDictonaryCode || '';
      ruleForm.value['cDeviceTypeName'] = type[0]?.cDictonaryName || '';
    }
    if (source) {
      ruleForm.value['cDeviceSourceName'] = source[0]?.cDictonaryName || '';
      ruleForm.value['cDeviceSourceType'] = source[0]?.cDictonaryCode || '';
    }
  }
  // 物料
  // if (Route.name == 'material'||Route.name == 'materialEdit'||Route.name == 'materialView') {
  //     materialFun()
  // }
  if (
    Route.name == 'addSupplier' ||
    Route.name == 'addSupplierEdit' ||
    Route.name == 'addSupplierView'
  ) {
    // eslint-disable-next-line no-prototype-builtins
    if (ruleForm.value.hasOwnProperty('cVendorClassName')) {
      ruleForm.value['cVendorClassCode'] =
        cVenCode.value['cVendorClassCode'] || '';
    }
  }

  // WMS 调拨单
  if (Route.name == 'TransferRecordAdd' || Route.name == 'TransferRecordEdit') {
    const [code1, name1] = [
      ruleForm.value['cInWareHouseName'],
      ruleForm.value['cInWareHouseCode']
    ];
    ruleForm.value['cInWareHouseCode'] = code1;
    ruleForm.value['cInWareHouseName'] = name1;

    const [code2, name2] = [
      ruleForm.value['cOutWareHouseName'],
      ruleForm.value['cOutWareHouseCode']
    ];
    ruleForm.value['cOutWareHouseCode'] = code2;
    ruleForm.value['cOutWareHouseName'] = name2;
  }

  let dataValue = {};
  //产线档案新增
  if (
    Route.name == 'addProductLine' ||
    Route.name == 'addProductLineEdit' ||
    Route.name == 'addProductLineView' ||
    Route.name == 'addWorkingShift' ||
    Route.name == 'addWorkingShiftEdit' ||
    Route.name == 'addWorkingShiftView' ||
    Route.name == 'AddTeamJob' ||
    Route.name == 'AddTeamJobEdit' ||
    Route.name == 'AddTeamJobView' ||
    Route.name == 'addOperalPath' ||
    Route.name == 'addOperalPathEdit' ||
    Route.name == 'addOperalPathView' ||
    Route.name == 'AddFormulaDefint' ||
    Route.name == 'AddFormulaDefintEdit' ||
    Route.name == 'AddFormulaDefintView' ||
    Route.name == 'AddConfigSpec' ||
    Route.name == 'AddConfigSpecEdit' ||
    Route.name == 'AddConfigSpecView' ||
    Route.name == 'TooolInfo' ||
    Route.name == 'EditTooolInfo'
  ) {
    ruleForm.value.IsAuth = true;
    ButObjTableData.value.forEach((item: any) => {
      item.IsAuth = true;
    });
    dataValue = { models: ButObjTableData.value };
    if (ButObjTableData.value.length == 0) {
      ElMessage({
        message: '请添加节点数据',
        type: 'info'
      });
      return;
    }
  } else if (
    Route.name == 'AddCalendlerWork' ||
    Route.name == 'AddCalendlerWorkEdit' ||
    Route.name == 'AddCalendlerWorkView' ||
    Route.name == 'policMangmentAdd' ||
    Route.name == 'policMangmentEdit' ||
    Route.name == 'AddToolFile' ||
    Route.name == 'EditToolFile'
  ) {
    //日历编辑
    ruleForm.value.IsAuth = true;
    ButObjTableData.value.forEach((item: any) => {
      item.IsAuth = true;
    });
    dataValue = { models: ButObjTableData.value };
  } else if (
    Route.name == 'materialBoxRecordAdd' ||
    Route.name == 'materialBoxRecordAddEdit' ||
    Route.name == 'materialBoxRecordAddView'
  ) {
    ruleForm.value.IsAuth = true;
    ButObjTableData.value.forEach((item: any) => {
      item.IsAuth = true;
    });
    dataValue = { tRAY_INVENTORYModels: ButObjTableData.value };
  } else if (
    Route.name == 'newProductPlan' ||
    Route.name == 'newProductPlanEdit' ||
    Route.name == 'newProductPlanView'
  ) {
    ruleForm.value.IsAuth = true;
    ButObjTableData.value.forEach((item: any) => {
      item.IsAuth = true;
    });
    dataValue = { BodyModels: ButObjTableData.value };
  } else if (
    Route.name == 'AddPurchaseNote' ||
    Route.name == 'AddPurchaseNoteEdit' ||
    Route.name == 'AddPurchaseNoteView' ||
    Route.name == 'newPurchasedGoods' ||
    Route.name == 'newPurchasedGoodsEdit' ||
    Route.name == 'newPurchasedGoodsView' ||
    Route.name == 'newWorkshopMaterial' ||
    Route.name == 'newWorkshopMaterialView' ||
    Route.name == 'newWarehouseMaterial' ||
    Route.name == 'newWarehouseMaterialView' ||
    Route.name == 'AddPurchaseRequest' ||
    Route.name == 'AddPurchaseRequestEdit' ||
    Route.name == 'AddPurchaseRequestView' ||
    Route.name == 'newPurchaseAuditEdit'
  ) {
    ruleForm.value.IsAuth = true;
    ButObjTableData.value.forEach((item: any) => {
      item.IsAuth = true;
    });
    // #1799
    dataValue = {
      Items: ButObjTableData.value.map(i => ({
        ...i,
        nQuantity: i.nQuantity2 ?? i.nQuantity
      }))
    };
  } else if (
    Route.name == 'AddBusineScen' ||
    Route.name == 'AddBusineScenEdit' ||
    Route.name == 'AddBusineScenView'
  ) {
    dataValue = { Mid: MID.value, models: ruleForm.value.models };
    //指标档案
  } else if (Route.name == 'AddTarget' || Route.name == 'EditTarget') {
    // 下拉数据------------------------
    if (cDeviceTypeData.value) {
      ruleForm.value['cStandardTypeName'] =
        cDeviceTypeData.value[0]?.cDictonaryName || '';
      ruleForm.value['cStandardTypeCode'] =
        cDeviceTypeData.value[0]?.cDictonaryCode || '';
    }
    if (
      ButObjTableData.value.length == 0 &&
      ruleForm.value['cStandardTypeName'] == '定性'
    ) {
      ElMessage({
        message: '请添加节点数据',
        type: 'info'
      });
      return;
    }
    dataValue = { list_s: ButObjTableData.value };
  } else if (Route.name == 'materialEdit') {
    let list = [] as any;
    if (ruleForm.value.cDefindParm01 && ruleForm.value.cDefindParm01.length) {
      ruleForm.value.cDefindParm01.forEach((aa: any) => {
        ruleForm.value.cDefindParm01_Data.forEach((bb: any) => {
          if (aa == bb.cDictonaryCode) {
            list.push(bb);
          }
        });
      });
      ruleForm.value.cDefindParm01 = '';
      ruleForm.value.cDefindParm01List = list;
    }

    ruleForm.value.cInvCode = window.sessionStorage.getItem('cInvCode');
  } else if (Route.name == 'material' || Route.name == 'materialView') {
    let list = [] as any;
    if (ruleForm.value.cDefindParm01 && ruleForm.value.cDefindParm01.length) {
      ruleForm.value.cDefindParm01.forEach((aa: any) => {
        ruleForm.value.cDefindParm01_Data.forEach((bb: any) => {
          if (aa == bb.cDictonaryCode) {
            list.push(bb);
          }
        });
      });
      ruleForm.value.cDefindParm01 = '';
      ruleForm.value.cDefindParm01List = list;
    }
  } else if (
    Route.name == 'warehouseBillsAdd' ||
    Route.name == 'warehouseBillsEdit' ||
    Route.name == 'warehouseBillsView'
  ) {
    dataValue = { models: [] };
    // 研磨单
  } else if (
    Route.name == 'resizeDialAdd' ||
    Route.name == 'resizeDialEdit' ||
    Route.name == 'resizeDialInfo' ||
    Route.name == 'AddGrindOrder' ||
    Route.name == 'EditGrindOrder' ||
    Route.name == 'otherInNotifyAdd' ||
    Route.name == 'otherInNotifyDetail' ||
    Route.name == 'otherInNotifyEdit' ||
    Route.name == 'otherOutNotifyAdd' ||
    Route.name == 'otherOutNotifyDetail' ||
    Route.name == 'otherOutNotifyEdit' ||
    Route.name == 'TransferRecordAdd' ||
    Route.name == 'TransferRecordEdit'
  ) {
    dataValue = { list_body: ButObjTableData.value };
  } else if (Route.name == 'ReturnQualityInfo') {
    dataValue = { ms: ButObjTableData.value };
  } else if (Route.name == 'AddPersonTeam' || Route.name == 'EditPersonTeam') {
    dataValue = { list_s: ButObjTableData.value };
  } else if (Route.name == 'PurchaseReturnRequestEdit') {
    dataValue = { list: validateObj.value.tableData };
  } else if (
    Route.name == 'ScrapToolInfoAdd' ||
    Route.name == 'ScrapToolInfoEdit' ||
    Route.name == 'testRatingAdd' ||
    Route.name == 'testRatingEdit' ||
    Route.name == 'RawMaterialComparisonAdd' ||
    Route.name == 'RawMaterialComparisonEdit' ||
    Route.name == 'LaboratoryMaterialControlAdd' ||
    Route.name == 'LaboratoryMaterialControlEdit' ||
    Route.name == 'InventoryProductComparisonAdd' ||
    Route.name == 'InventoryProductComparisonEdit' ||
    Route.name == 'LabelUsageConfigurationAdd' ||
    Route.name == 'LabelUsageConfigurationEdit' ||
    Route.name == 'LabelUsageConfigurationView' ||
    Route.name == 'FinishedSubPartComparisonAdd' ||
    Route.name == 'FinishedSubPartComparisonEdit' ||
    Route.name == 'CityWarehouseArchivesAdd' ||
    Route.name == 'CityWarehouseArchivesEdit' ||
    Route.name == 'CityWarehouseArchivesView' ||
    Route.name == 'newWorkshopMaterialEdit' ||
    Route.name == 'warehouseMaterialEdit'
  ) {
    dataValue = { list_body: validateObj.value.tableData };
  } else if (
    Route.name == 'inspectionNormeAdd' ||
    Route.name == 'inspectionNormeEdit' ||
    Route.name == 'inspectionNormeView'
  ) {
    ruleForm.value.MID = validateObj.value.MID;
    dataValue = { list_file: validateObj.value.tableData };
  } else if (Route.name == 'memAdminAdd' || Route.name == 'memAdminEdit') {
    let arr = [] as any;
    validateObj.value.tableData.map((item: any) => {
      arr.push(item.cLableCode);
    });
    dataValue = { cLableCodes: arr };
  } else if (Route.name == 'InventoryListAdd') {
    dataValue = {
      body: validateObj.value.tableData,
      cVouchTypeCode: '1'
    };
  } else {
    dataValue = { uNITCONVERTs: ButObjTableData.value };
  }

  if (Route.name === 'otherInNotifyAdd') {
    ruleForm.value.cVouchTypeCode = '03';
    ruleForm.value.dDate = ruleForm.value.dInWareHouseDate;
    ruleForm.value.cInWareHouseCode = ruleForm.value.cInWareHouseName_Data.find(
      (i: any) => i.cWareHouseName === ruleForm.value.cInWareHouseName
    )?.cWareHouseCode;
  }

  if (Route.name === 'otherOutNotifyAdd') {
    ruleForm.value.cVouchTypeCode = '04';
    ruleForm.value.dDate = ruleForm.value.dOutWareHouseDate;
    ruleForm.value.cOutWareHouseCode =
      ruleForm.value.cOutWareHouseName_Data.find(
        (i: any) => i.cWareHouseName === ruleForm.value.cOutWareHouseName
      )?.cWareHouseCode;
  }

  let data = {
    method: ButObjData.value.cHttpTypeCode,
    url: ButObjData.value.cServerIP + ButObjData.value.cUrl,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    data: {
      ...ruleForm.value,
      ...dataValue
    }
  };
  //（用户管理模块）用户策略/角色新增需要登录名
  // eslint-disable-next-line no-prototype-builtins
  if (ruleForm.value.hasOwnProperty('cLoginName')) {
    localStorage.set('LoginName', data.data?.cLoginName);
  }
  const loading = ElLoading.service({ lock: true, text: '加载中.....' });
  // return false
  DataApi(data)
    .then((res: any) => {
      if (res.success) {
        ElMessage({
          message: res.msg,
          type: 'success'
        });
        if (ChooseCode.value) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          window.sessionStorage.clear('policyCode');
        }
        if (Route.name == 'material') {
          materialFunData(data);
          // closeSelectedTag(Route)
          // window.sessionStorage.setItem('BaseUID', res.data.UID)
          // emits('clickGetDataUser',{UID:res.data.UID})
          router.push({
            name: 'materialEdit',
            params: {
              t: Date.now(),
              rowId: res.data.UID
            },
            state: {
              modelCode: validateObj.value.cIncludeModelCode,
              pageType: 'edit',
              // row: JSON.stringify(scope.row),
              pathName: 'materiallist',
              title: '物料编辑'
            }
          });
          closeSelectedTag(Route);
        }
        if (Route.name == 'materialEdit' || Route.name == 'materialView') {
          materialFunData(data);
          // closeSelectedTag(Route)
          // window.sessionStorage.setItem('BaseUID', res.data.UID)
          // emits('clickGetDataUser',{UID:res.data.UID})
          router.push({
            name: 'materiallist',
            params: {
              t: Date.now(),
              rowId: Route.params.rowId
            },
            state: {
              modelCode: validateObj.value.cIncludeModelCode,
              pageType: 'edit',
              // row: JSON.stringify(scope.row),
              pathName: 'materiallist',
              title: '物料档案'
            }
          });
          closeSelectedTag(Route);
        }

        if (
          Route.name == 'newPurchasedGoodsEdit' ||
          Route.name == 'newPurchasedGoodsView'
        ) {
          emits('clickView', { val: res.data.UID });
        }

        if (Route.name == 'AddDevice') {
          // 设备新增后，拿到返回的UID，跳转到编辑页面，获取刚新增的数据
          window.sessionStorage.setItem('DeviceData', JSON.stringify(res.data));
          // router.push({ name: pathName.value })
          router.push({
            name: 'EditDevice',
            params: {
              t: Date.now(),
              rowId: res.data.UID
            },
            state: {
              modelCode: validateObj.value.cIncludeModelCode,
              pageType: 'edit'
              // row: JSON.stringify(res.data),
              // pathName: 'materiallist',
              // title: '物料编辑',
            }
          });
        }
        // 物料保存成功后返回列表页面
        if (
          Route.name == 'material' ||
          Route.name == 'materialEdit' ||
          Route.name == 'materialView'
        ) {
          if (validateObj.value.tabVal == 'ManageCenter.Inentory.M.Add.Base') {
            // window.sessionStorage.setItem('基本信息', JSON.stringify(res.data))
            window.sessionStorage.setItem(
              '基本信息',
              JSON.stringify(ruleForm.value)
            );
          }

          if (validateObj.value.tabVal == 'ManageCenter.Inentory.M.Add.WMS') {
            // window.sessionStorage.setItem('库管信息', JSON.stringify(res.data))
            window.sessionStorage.setItem(
              '库管信息',
              JSON.stringify(ruleForm.value)
            );
          }
          if (
            validateObj.value.tabVal == 'ManageCenter.Inentory.M.Add.Extend'
          ) {
            // window.sessionStorage.setItem('扩展信息', JSON.stringify(res.data))
            window.sessionStorage.setItem(
              '扩展信息',
              JSON.stringify(ruleForm.value)
            );
          }

          if (
            validateObj.value.tabVal == 'ManageCenter.Inentory.M.Edit.Extend' ||
            validateObj.value.tabVal == 'ManageCenter.Inentory.M.Add.Extend' ||
            validateObj.value.tabVal == 'ManageCenter.Inentory.M.View.Extend'
          ) {
            router.push({ name: pathName.value });
            // 新增/编辑后的刷新
            $bus.emit('tableUpData', { name: pathName.value });
            closeSelectedTag(Route);
          }
        } else {
          router.push({ name: pathName.value });
          // 新增/编辑后的刷新
          $bus.emit('tableUpData', { name: pathName.value });
          closeSelectedTag(Route);
        }

        $bus.emit('clickTableUp', true);
        // 更新列表数据
        $bus.emit('tableUpData', { name: pathName.value });
      } else {
        ElMessage({
          message: res.msg,
          type: 'error'
        });
      }
      ruleForm.value = {};
    })
    .finally(() => loading.close());
};
const closeSelectedTag = (view: any) => {
  tagsView.delVisitedView(view).then((res: any) => {
    console.log(res, '--res');
    // if (isActive(view)) {
    //     toLastView(res.visitedViews, view);
    // }
  });
};
function isActive(tag: any) {
  console.log(tag.path, Route.path);

  return tag.path === Route.path;
}
function toLastView(visitedViews: any, view?: any) {
  const latestView = visitedViews.slice(-1)[0];
  if (latestView && latestView.fullPath) {
    router.push(latestView.fullPath);
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath });
    } else {
      router.push('/');
    }
  }
}
const materialFun = () => {
  ruleForm.value['cVendorClassCode'] = cVenCode.value['cVendorClassCode'] || '';
  if (
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.Add.WMS' ||
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.View.WMS' ||
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.Edit.WMS' ||
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.Edit.Extend'
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ruleForm.value.cInvCode = window.sessionStorage.getItem('cInvCode');
  }
  if (
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.Add.Extend' ||
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.View.Extend' ||
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.Edit.WMS' ||
    validateObj.value.tabVal == 'ManageCenter.Inentory.M.Edit.Extend'
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    ruleForm.value.cInvCode = window.sessionStorage.getItem('cInvCode');
  }
};
const materialFunData = (data: any) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (data.data?.cInvCode) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.sessionStorage.setItem('cInvCode', data.data.cInvCode);
  }
  if (data.data?.cInvClassCode) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.sessionStorage.setItem('cInvClassCode', data.data.cInvClassCode);
  }
  // if (validateObj.value.tabVal == "ManageCenter.Inentory.M.Add.Base") {
  //     emits('tabValType', { val: '1' })
  // }
  // if (validateObj.value.tabVal == "ManageCenter.Inentory.M.Add.WMS") {
  //     emits('tabValType', { val: '3' })
  // }

  // if (validateObj.value.tabVal == "ManageCenter.Inentory.M.Edit.Base" || validateObj.value.tabVal == "ManageCenter.Inentory.M.View.Base") {
  //     emits('tabValType', { val: '11' })
  // }
  // if (validateObj.value.tabVal == "ManageCenter.Inentory.M.Edit.WMS" || validateObj.value.tabVal == "ManageCenter.Inentory.M.View.WMS") {
  //     emits('tabValType', { val: '33' })
  // }
};
const downFile = (v: any) => {
  if (ruleForm.value[v]) {
    window.location.href = ruleForm.value[v];
  } else {
    ElMessage({
      message: '没有下载的文件',
      type: 'error'
    });
  }
};

const handleChangeRuleForm = (value: any) => {
  ruleForm.value = { ...ruleForm.value, ...value };
};
defineExpose({
  ruleForm,
  ruleFormRef,
  validate,
  clearValidate,
  downFile,
  handleChangeRuleForm
});
</script>

<style scoped lang="scss">
.maintain_card {
  width: 100%;
  margin-bottom: 20px;

  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;

    .search_main {
      flex: 1;

      :deep(.el-form) {
        width: 100%;
      }
    }
  }
}
</style>
