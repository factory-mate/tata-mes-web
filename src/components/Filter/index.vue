<!--cControlTypeCode： DateTimePicker 日期； TextBox 文本 ；TextBoxLink 参照； ComboBox 下拉  -->
<!-- cDataTypeCode：Decimal 数值；Bit 布尔；Nvarchar 文本；Int 整数 -->
<template>
  <div class="filterMain">
    <p class="iconSty" v-if="filHide">
      <el-icon v-if="fileType" @click="clickFil('show')"
        ><ArrowDownBold
      /></el-icon>
      <el-icon v-else @click="clickFil('hide')"><ArrowUpBold /></el-icon>
    </p>
    <el-card
      class="maintain_card"
      v-if="FilterData"
      :style="{ height: fileType && filHide ? '160px' : null }"
    >
      <div class="search_main">
        <el-form :inline="true" label-width="120px">
          <el-form-item
            :label="
              item.cShowName?.toString().trim()
                ? item.cShowName + '：'
                : item.Resource.cAttributeName + '：'
            "
            v-for="item in FilterData"
            style="font-weight: 700"
            :key="item.cAppCode"
          >
            <!-- {{item.Resource.cAttributeCode}} -->
            <!-- input 文本 -->
            <el-input
              v-if="item.cControlTypeCode == 'TextBox'"
              v-model="item.cAttributeCodeValue"
              placeholder="请输入"
              clearable
            />
            <!-- 弹框多选 -->
            <el-input
              v-if="item.cControlTypeCode == 'TextBoxLink'"
              v-model="item.cAttributeCodeValue"
              placeholder="请输入"
              clearable
            >
              <template #append>
                <el-icon @click="clickModel(item, item.IsMulitChoose)">
                  <MoreFilled />
                </el-icon>
              </template>
            </el-input>
            <!-- 下拉选择 -->
            <el-select
              v-if="item.cControlTypeCode == 'ComboBox'"
              v-model="item.cAttributeCodeValue"
              placeholder="请输入"
              clearable
              @change="(value:any)=>GetTreeRoad(item,value)"
              @visible-change="getTreeDAata"
            >
              <template v-for="(val, index) in item.selDataList" :key="index">
                <el-option
                  :label="
                    val.cDictonaryName ||
                    val.cWareHouseName ||
                    val.cBomClassName ||
                    val.cNoPassClearName ||
                    val.cAreaName
                  "
                  :value="
                    val.cDictonaryCode ||
                    val.cWareHouseCode ||
                    val.cBomClassCode ||
                    val.cNoPassClearCode ||
                    val.cAreaCode
                  "
                />
              </template>
            </el-select>
            <!-- 日期 -->
            <el-date-picker
              v-if="item.cControlTypeCode == 'DatePicker'"
              v-model="item.cAttributeCodeValue"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :default-value="new Date()"
              clearable
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DatePicker2'"
              class="DatePicker2"
              v-model="item.cAttributeCodeValue"
              type="daterange"
              placeholder="请选择"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :default-value="new Date()"
              clearable
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker'"
              v-model="item.cAttributeCodeValue"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              clearable
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker4'"
              v-model="item.cAttributeCodeValue"
              type="datetimerange"
              placeholder="请选择"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
              clearable
            />
            <el-radio-group
              v-if="item.cControlTypeCode == 'CheckBox'"
              v-model="item.cAttributeCodeValue"
              clearable
            >
              <el-radio :label="'true'">是</el-radio>
              <el-radio :label="'false'">否</el-radio>
            </el-radio-group>
            <!-- 树形结构 -->
            <el-cascader
              v-if="item.cControlTypeCode == 'Tree'"
              v-model="item.cAttributeCodeValue"
              :options="options"
              :props="getTreeProps()"
              @change="(value:any) => handleChange(item, value)"
              @visible-change="getTreeDAata"
              clearable
              :ref="el => bindRef(el, item)"
              :show-all-levels="getShowAllLevels()"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="search_but">
        <el-button type="primary" :icon="Search" @click="ClickSearch"
          >搜索</el-button
        >
        <el-button type="info" @click="resetForm">重置</el-button>
      </div>
    </el-card>
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
  toRefs,
  watch,
  defineProps,
  defineEmits,
  reactive,
  onDeactivated,
  onActivated,
  getCurrentInstance
} from 'vue';
import {
  ArrowDownBold,
  ArrowUpBold,
  MoreFilled,
  Search
} from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElOption,
  ElSelect
} from 'element-plus';
import { DataApi, ParamsApi } from '@/api/configApi/index';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import { useRoute } from 'vue-router';
import useStore from '@/store';
import dayjs from 'dayjs';

const Route = useRoute();
const props = defineProps({
  Filter: {
    required: true,
    type: Array as any,
    default: () => []
  }
});
const { tagsView } = useStore();
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const cascaderRefs = ref([]);
const bindRef = (el, item) => {
  if (cascaderRefs.value.find(i => i.code === item.cAttributeCode)) {
    return;
  } else {
    cascaderRefs.value.push({
      code: item.cAttributeCode,
      el
    });
  }
};
//弹窗组件事件
const data = reactive({
  dialogType: false,
  fileType: true,
  filHide: false,
  titleName: '标题',
  AttributeCode: '',
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
  AttributeCode,
  codeType,
  FilterData,
  MulitChoose,
  fileType,
  filHide
} = toRefs(data);
const emits = defineEmits(['ClickSearch', 'resetForm']);
// eslint-disable-next-line vue/no-setup-props-destructure
watch(
  () => props.Filter,
  newValue => {
    if (newValue.length <= 6) {
      filHide.value = false;
    } else {
      filHide.value = true;
    }
    FilterData.value = JSON.parse(JSON.stringify(newValue));
    funHeadData();
  }
);
//级联树结构与绑定值
const prop = {
  label: 'cFactoryUnitName',
  value: 'cFactoryUnitCode',
  children: 'Child',
  checkStrictly: true,
  expandTrigger: 'hover'
};

const wmsMaterialProp = {
  label: 'cInvClassName',
  value: 'cInvClassCode',
  children: 'Child',
  checkStrictly: true,
  expandTrigger: 'hover'
};

const deviceProp = {
  label: 'cDeviceClassName',
  value: 'cDeviceClassCode',
  children: 'Child',
  checkStrictly: true,
  expandTrigger: 'hover'
};
const inLindReturnProp = {
  label: 'cFactoryUnitName',
  value: 'cReName',
  children: 'Child',
  checkStrictly: true,
  expandTrigger: 'hover'
};

const getTreeProps = () => {
  switch (Route.name) {
    case 'WMSMaterial':
    case 'AddPurchaseRequest':
    case 'RawMaterialComparisonAdd':
    case 'RawMaterialComparisonEdit':
    case 'AddPurchaseNoteNoOrigin':
    case 'AddPurchaseNoteEditNoOrigin':
      return wmsMaterialProp;
    case 'EquipmentCheckTask':
    case 'DeviceMaintenanceTask':
    case 'ProfessionEquipCheckTask':
    case 'ProDeviceMaintenanceTask':
    case 'DeviceCheckMaintainFinish':
      return deviceProp;
    case 'inLindReturn':
      return inLindReturnProp;
    default:
      return prop;
  }
};

const getShowAllLevels = () => {
  if (Route.name === 'inLindReturn') {
    return false;
  }
  return true;
};

const clickFil = (val: any) => {
  fileType.value = !fileType.value;
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
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};
// filter  弹框数据
const selectData = (val: any) => {
  dialogType.value = val.type;
  FilterData.value.forEach(
    (item: {
      Resource: { cAttributeName: string };
      cAttributeCodeValue: string;
    }) => {
      if (item.Resource.cAttributeName == titleName.value) {
        item.cAttributeCodeValue = val.value[0][AttributeCode.value];
      }
      if (
        Route.name == 'inLindReturn' &&
        item.Resource.cAttributeName == titleName.value
      ) {
        item.cAttributeCodeValue = val.value[0].cReasonName;
      }
      if (
        Route.name == 'TroubleClassify' &&
        item.Resource.cAttributeName == titleName.value
      ) {
        item.cAttributeCodeValue = val.value[0].cFaultClassName;
      }
      //文档分类cParentName
      if (
        Route.name == 'FileClassify' &&
        item.Resource.cAttributeName == titleName.value
      ) {
        item.cAttributeCodeValue = val.value[0].cFileClassName;
      }
      //指标分类cParentName
      if (
        Route.name == 'TargetClassify' &&
        item.Resource.cAttributeName == titleName.value
      ) {
        item.cAttributeCodeValue = val.value[0].cDeviceStandardClassName;
      }
      //设备维修--报修记录--报修人
      if (
        Route.name == 'RepairRecord' &&
        item.Resource.cAttributeName === '报修人' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        item.cAttributeCodeValue = val.value[0].cPersonName;
      }
      if (
        Route.name == 'RepairRecord' &&
        item.Resource.cAttributeName === '指派人名称' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        item.cAttributeCodeValue = val.value[0].cPersonName;
      }
      if (
        Route.name == 'ProcReleaseCaseCompaire' &&
        item.Resource.cAttributeName == '产品名称' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        item.cAttributeCodeValue = val.value[0]?.cInvName;
      }
      if (
        Route.name == 'ProcReleaseCaseCompaire' &&
        item.Resource.cAttributeName == '产品编码' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        item.cAttributeCodeValue = val.value[0]?.cInvCode;
      }
      if (
        Route.name == 'PackageProgram' &&
        item.Resource.cAttributeName == '合包类型编码' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        item.cAttributeCodeValue = val.value[0]?.cDictonaryCode;
      }
      if (
        Route.name == 'LabelUsageConfiguration' &&
        item.Resource.cAttributeName == '工位名称' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        item.cAttributeCodeValue = val.value[0]?.cPositionName;
      }

      if (
        Route.name == 'resizeDial' &&
        titleName.value === item.Resource.cAttributeName
      ) {
        if (item.Resource.cAttributeCode == 'cCreateUserName') {
          item.cAttributeCodeValue = val.value[0]?.cEmployeeName;
        }
        if (item.Resource.cAttributeCode == 'cOutWareHouseName') {
          item.cAttributeCodeValue = val.value[0]?.cWareHouseName;
        }
        if (item.Resource.cAttributeCode == 'cInWareHouseName') {
          item.cAttributeCodeValue = val.value[0]?.cWareHouseName;
        }
      }

      if (Route.name == 'PackagingRuleAssignment') {
        if (
          item.Resource.cAttributeName == '结构名称' &&
          titleName.value === item.Resource.cAttributeName
        ) {
          item.cAttributeCodeValue = val.value[0]?.cDictonaryName;
        }
        if (
          item.Resource.cAttributeName == '产品名称' &&
          titleName.value === item.Resource.cAttributeName
        ) {
          item.cAttributeCodeValue = val.value[0]?.cInvName;
        }
      }
      if (Route.name == 'DictionaryFile') {
        if (
          item.Resource.cAttributeName == '类型' &&
          titleName.value === item.Resource.cAttributeName
        ) {
          item.cAttributeCodeValue = val.value[0]?.cTypeName;
        }
      }
      if (Route.name === 'DeviceRepairTask') {
        if (
          item.Resource.cAttributeName === '设备编码' &&
          titleName.value === item.Resource.cAttributeName
        ) {
          item.cAttributeCodeValue = val.value[0]?.cDeviceCode;
        }
        if (
          item.Resource.cAttributeName === '维修人' &&
          titleName.value === item.Resource.cAttributeName
        ) {
          item.cAttributeCodeValue = val.value[0]?.cEmployeeName;
        }
        if (
          item.Resource.cAttributeName === '指派人' &&
          titleName.value === item.Resource.cAttributeName
        ) {
          item.cAttributeCodeValue = val.value[0].cPersonName;
        }
      }

      if (titleName.value === item.Resource.cAttributeName) {
        if (Route.name === 'EquipmentCheckTask') {
          if (item.Resource.cAttributeName === '实际点检人名称') {
            item.cAttributeCodeValue = val.value[0]?.cEmployeeName;
          }
        }
      }

      if (titleName.value === item.Resource.cAttributeName) {
        if (Route.name === 'LinePicking') {
          if (item.Resource.cAttributeName === '产线') {
            item.cAttributeCodeValue = val.value[0]?.cLineName;
          }
        }
      }
      if (titleName.value === item.Resource.cAttributeName) {
        if (Route.name === 'InventoryList') {
          if (item.Resource.cAttributeCode === 'cDefindParm02') {
            item.cAttributeCodeValue = val.value[0].cWareHouseAreaName;
          }
        }

        if (Route.name === 'InventoryListResult') {
          if (item.Resource.cAttributeCode === 'cDefindParm02') {
            item.cAttributeCodeValue = val.value[0].cWareHouseAreaCode;
          }
        }

        if (Route.name === 'ToolFile') {
          if (item.Resource.cAttributeCode === 'cInvClassCode') {
            item.cAttributeCodeValue = val.value[0].cInvClassName;
          }
        }
      }
    }
  );
};
const funHeadData = () => {
  getSelectData();
  FilterData.value = FilterData.value.filter(
    (item: any) => item.cAttributeCode != 'Data' && item.IsShow
  );
  FilterData.value.forEach(item => {
    if (
      item.cAttributeCode === 'dPlanDateStart' &&
      [
        'ScheduleMaterialSeq',
        'SpecialLine',
        'StaticTable',
        'SpecialWorkshop'
      ].includes(Route.name)
    ) {
      item.cAttributeCodeValue = [
        dayjs(new Date()).format('YYYY-MM-DD'),
        dayjs(new Date()).format('YYYY-MM-DD')
      ];
    }
    if (
      item.cAttributeCode === 'dPlanDateStart' &&
      ['AutoUnloading', 'GlassReduction'].includes(Route.name)
    ) {
      item.cAttributeCodeValue = dayjs(new Date()).format('YYYY-MM-DD');
    }
  });
  getTreeData(FilterData.value);
};
const checkname = ref('') as any;
//下拉框变化时(原始订单的获取一级渠道的选中值)
const GetTreeRoad = (item: any, value: any) => {
  if (item.cAttributeCode == 'cDefindParm29') {
    checkname.value = value;
  }
  if (
    Route.name == 'UnqualifiedOrderProcessing' ||
    Route.name == 'UnqualifiedPacketProcessing'
  ) {
    item.selDataList.forEach((bb: any) => {
      if (value == bb.cNoPassClearCode) {
        item.cAttributeCodeValue = bb.cNoPassClearName;
      }
    });
  }
  if (item.cAttributeCode == 'Project') {
    checkname.value = value;
  }

  if (Route.name === 'LogisticsCityComparison') {
    if (
      item.Resource.cAttributeCode === 'cPrefectureCityName' ||
      item.Resource.cAttributeCode === 'cProvinceName'
    ) {
      item.selDataList.forEach((v: any) => {
        if (value == v.cAreaCode) {
          item.cAttributeCodeValue = v.cAreaName;
        }
      });
    }
  }
  if (Route.name === 'otherInNotify' || Route.name === 'otherOutNotify') {
    if (
      item.cAttributeCode === 'cInWareHouseName' ||
      item.cAttributeCode === 'cOutWareHouseName'
    ) {
      item.selDataList.forEach((v: any) => {
        if (value == v.cWareHouseCode) {
          item.cAttributeCodeValue = v.cWareHouseName;
        }
      });
    }
  }
  // if(Route.name=='Project'){
  //     // FilterData.value.cAttributeCodeValue
  //     if(item.cAttributeCode=="cProgramTypeName"){
  //         // checkname.value=value
  //         item.selDataList.forEach((cc:any)=>{
  //             if(cc.cDictonaryCode==item.cAttributeCodeValue){
  //                 item.cAttributeCodeValue=cc.cDictonaryName
  //             }
  //         })
  //     }
  //     // if(item.cAttributeCode=="cPeriodTypeName"){
  //     //     checkname.value=value
  //     // }
  // }
};
//下拉框数据出现
const getTreeDAata = (v: any) => {
  if (v) {
    FilterData.value.forEach((item: any) => {
      if (item.cControlTypeCode == 'ComboBox') {
        if (
          Route.name == 'originalOrder' &&
          item.Resource.cAttributeCode == 'cDefindParm11' &&
          checkname.value
        ) {
          let data = {
            method: item.Resource.cHttpTypeCode,
            url:
              item.Resource.cServerIP +
              item.Resource.cUrl +
              "&where=cDictonaryCode like '" +
              checkname.value +
              "%'",
            params: {}
          };
          ParamsApi(data).then((res: any) => {
            item.selDataList = res.data;
          });
          // getSelectData()
        }
        if (Route.name == 'File') {
          let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP + item.Resource.cUrl,
            params: {}
          };
          ParamsApi(data).then((res: any) => {
            item.selDataList = res.data;
          });
        }
        if (Route.name == 'BomDoorInfo') {
          let obj = { Conditions: 'isdelete=false' };
          if (item.Resource.cHttpTypeCode == 'post') {
            let data = {
              method: item.Resource.cHttpTypeCode,
              url: item.Resource.cServerIP + item.Resource.cUrl,
              data: obj
            };
            DataApi(data).then((res: any) => {
              item.selDataList = res.data;
            });
          } else {
            let data = {
              method: item.Resource.cHttpTypeCode,
              url: item.Resource.cServerIP + item.Resource.cUrl,
              params: obj
            };
            ParamsApi(data).then((res: any) => {
              item.selDataList = res.data;
            });
          }
        }
        if (Route.name == 'newOutputPlanView') {
          let data = {
            method: item.Resource.cHttpTypeCode,
            url: item.Resource.cServerIP + item.Resource.cUrl,
            params: {}
          };
          ParamsApi(data).then((res: any) => {
            item.selDataList = res.data;
          });
        }
      }
    });
  }
};
//获取下拉框数据
const getSelectData = () => {
  FilterData.value.forEach((item: any) => {
    if (item.cControlTypeCode == 'ComboBox') {
      if (!item.Resource.cUrl) return false;
      let obj = {};
      if (Route.name == 'PurchaseRequest') {
        obj = {
          Conditions: 'cDictonaryTypeCode=PlanPurchaseVouchIStatus',
          OrderByFileds: 'cDictonaryCode'
        };
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
      } else if (
        Route.name == 'inLindReturn' ||
        Route.name == 'MinMaterielStorage' ||
        Route.name == 'MaterielStorage' ||
        Route.name == 'PurchaseAudit' ||
        Route.name == 'otherInNotify' ||
        (Route.name == 'originalOrder' &&
          item.Resource.cAttributeCode == 'cVouchTypeCode') ||
        (Route.name == 'originalOrder' &&
          item.Resource.cAttributeCode == 'iStatus') ||
        (Route.name == 'originalOrder' &&
          item.Resource.cAttributeCode == 'cDefindParm11') ||
        (Route.name == 'ProductProcessCheck' &&
          item.Resource.cAttributeCode == 'IsOk') ||
        (Route.name == 'UnqualifiedOrderProcessing' &&
          item.Resource.cAttributeCode == 'cCheckResultTypeName') ||
        (Route.name == 'UnqualifiedPacketProcessing' &&
          item.Resource.cAttributeCode == 'cCheckResultTypeName') ||
        (Route.name == 'PackagingRuleAssignment' &&
          item.Resource.cAttributeCode == 'cVouchTypeName')
      ) {
        obj = {};
      } else if (Route.name == 'BomDoorInfo') {
        obj = { Conditions: 'isdelete=false' };
      } else if (Route.name === 'LogisticsCityComparison') {
        if (item.Resource.cAttributeCode === 'cProvinceName') {
          obj = {
            Conditions: 'iLevel=0'
          };
        }
        if (item.Resource.cAttributeCode === 'cPrefectureCityName') {
          obj = {
            Conditions: 'iLevel=1'
          };
        }
      } else {
        obj = {
          Conditions: 'cDictonaryTypeCode=' + item.Resource.cAttributeCode,
          OrderByFileds: 'cDictonaryCode'
        };
      }
      if (item.Resource.cHttpTypeCode == 'post') {
        let data = {
          method: item.Resource.cHttpTypeCode,
          url: item.Resource.cServerIP + item.Resource.cUrl,
          data: obj
        };
        DataApi(data).then((res: any) => {
          if (res?.success) {
            item.selDataList = res.data;
          }
        });
      } else {
        let data = {
          method: item.Resource.cHttpTypeCode,
          url: item.Resource.cServerIP + item.Resource.cUrl,
          params: obj
        };
        ParamsApi(data).then((res: any) => {
          if (res?.success) {
            item.selDataList = res.data;
          }
        });
      }
    }
  });
};
const options = ref([]) as any;
//获取级联树结构数据
const getTreeData = (newValue: any) => {
  newValue.forEach((item: any) => {
    if (item.cControlTypeCode == 'Tree' && item.Resource.cHttpTypeCode) {
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
        options.value = res.data.map(i => ({
          ...i,
          label: i.cInvClassName,
          value: i.cInvClassCode
        }));
        item.optionsDataList = res.data;
      });
    }
  });
};

//级联树结构选项变化
const handleChange = (item: any, value: any) => {
  console.log(value, '树结构选中数据');
  console.log(item.optionsDataList);
  const refValue = cascaderRefs.value.find(
    i => i.code === item.cAttributeCode
  )?.el;
  console.log(refValue);

  const currentNode = refValue.getCheckedNodes();
  const selectedNodeValue = [];
  getSelectedNodeValue(currentNode, selectedNodeValue);

  console.log(selectedNodeValue);
  item.cAttributeCodeValue =
    value.length > 1 ? value[value.length - 1] : value[0];
  console.log(item.cAttributeCodeValue);
  item.treeSelectedValues = selectedNodeValue;
  refValue.togglePopperVisible();
};

// 递归将节点的value值存入数组
const getSelectedNodeValue = (nodes: any, arr: any) => {
  nodes.forEach((node: any) => {
    arr.push(node.value);
    if (node.children) {
      getSelectedNodeValue(node.children, arr);
    }
  });
};

// 搜索
const ClickSearch = () => emits('ClickSearch', { value: FilterData.value });

// 重置
const resetForm = () => {
  FilterData.value.forEach((item: any) => {
    item.cAttributeCodeValue = '';
  });
  emits('resetForm', { value: FilterData.value });
};
defineExpose({ FilterData });
</script>

<style scoped lang="scss">
.filterMain {
  margin-bottom: 20px;
  position: relative;
}
.iconSty {
  position: absolute;
  bottom: -34px;
  left: 50%;
  margin-left: -25px;
  z-index: 0;
  width: 50px;
  height: 20px;
  text-align: center;
  background: #fff;
  cursor: pointer;
}
.maintain_card {
  width: 100%;

  overflow: hidden;

  :deep(.el-card__body) {
    display: flex;
    justify-content: space-between;

    .search_main {
      flex: 1;

      :deep(.el-form) {
        width: 100%;
      }
      .DatePicker2 {
        width: 220px;
      }
    }

    .search_but {
      width: 180px;
    }
  }
}
</style>
