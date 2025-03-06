<template>
  <!-- 添加弹窗 -->
  <div>
    <el-dialog
      class="disSty"
      v-model="dialogFormVisible"
      :title="title"
      center
      @opened="open"
      @close="resetForm(ruleFormRef)"
      draggable
      :modal="false"
      :close-on-click-modal="false"
      :width="
        Route.name === 'newProductPlan' || Route.name === 'newProductPlanView'
          ? '90%'
          : undefined
      "
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :disabled="disabled"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
      >
        <template v-for="item in FormData" :key="item.UID">
          <el-form-item
            v-if="item.Resource.cAttributeTypeCode == 'property' && item.IsShow"
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
          >
            <!-- {{ item.Resource.cAttributeCode }} -->
            <el-input
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
            />
            <el-input
              v-if="
                item.cControlTypeCode == 'RichText' &&
                item.cDataTypeCode == 'Nvarchar'
              "
              :rows="2"
              type="textarea"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
              style="min-width: 200px"
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Int'
              "
              v-model="ruleForm[item.cAttributeCode]"
              placeholder=""
              style="width: 220px"
            />
            <el-input-number
              v-if="
                item.cControlTypeCode == 'TextBox' &&
                item.cDataTypeCode == 'Decimal'
              "
              v-model="ruleForm[item.cAttributeCode]"
              placeholder=""
              style="width: 220px"
            />
            <el-input
              v-model="ruleForm[item.cAttributeCode]"
              v-if="item.cControlTypeCode == 'PassWord'"
              placeholder="请输入"
            />
            <el-input-number
              v-model="ruleForm[item.cAttributeCode]"
              v-if="item.cControlTypeCode == 'Int'"
              :precision="2"
            />
            <el-input
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
            <el-select
              v-if="item.cControlTypeCode == 'ComboBox'"
              @visible-change="(val: any) => clickSelect(val, item)"
              @change="(value:any)=>GetSelectData(item,value)"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
            >
              <el-option
                v-for="(o, i) in optionData"
                :key="i"
                :label="o.cDictonaryName"
                :value="o.cDictonaryCode"
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
            />
            <el-date-picker
              v-if="item.cControlTypeCode == 'DateTimePicker'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              type="datetime"
              placeholder="请选择"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DDTHH:mm:ss"
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
            />
            <el-radio-group
              v-if="item.cControlTypeCode == 'CheckBox'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              style="width: 220px"
            >
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
            <el-input
              v-if="item.cControlTypeCode == 'TextBoxText'"
              v-model="ruleForm[item.Resource.cAttributeCode]"
              placeholder="请输入"
              class="textSty"
            >
              <template #append
                ><span @click="clickTextBoxText(item)">+</span></template
              >
            </el-input>
            <!-- :multiple="funAllTyppe(item)"  :show-checkbox='funAllTyppe(item)'  -->
            <template v-if="Route.name == 'newOutputPlanView'">
              <el-cascader
                ref="cascader"
                v-model="item.cAttributeCodeValue"
                :options="optionData"
                :props="prop2"
                @change="handleChange"
                @visible-change="getTreeDAata"
                clearable
              />
            </template>

            <template v-if="Route.name == 'ViewPatrolPlan'">
              <el-cascader
                ref="cascader"
                v-model="item.cAttributeCodeValue"
                :options="optionData"
                :props="prop2"
                @change="handleChange"
                @visible-change="getTreeDAata"
                clearable
              />
            </template>

            <template v-else>
              <el-tree-select
                ref="treeRef"
                node-key="cFactoryUnitCode"
                v-if="item.cControlTypeCode == 'Tree'"
                :props="prop"
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :multiple="funAllTyppe(item)"
                show-checkbox
                :multiple-limit="funAllTyppeNum(item)"
                :default-checked-keys="treeVal"
                :data="optionData"
                :render-after-expand="false"
                @change="treeChange(item.Resource.cAttributeCode)"
                :disabled="disabledFun(item)"
                clearable
              />
            </template>
          </el-form-item>
        </template>

        <div
          v-if="
            Route.name === 'newProductPlan' ||
            Route.name === 'newProductPlanView'
          "
        >
          <BDSWHERE ref="bdsRef" :rule-form="ruleForm" />
        </div>
      </el-form>
      <template #footer>
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button
          v-if="modelGridType && title == '新增'"
          @click="clickHandAdd(ruleFormRef)"
          type="primary"
          >添加</el-button
        >
        <el-button
          v-else-if="modelGridType && title == '编辑'"
          @click="clickHandEdit(ruleFormRef)"
          type="primary"
          >修改</el-button
        >
        <template v-else>
          <el-button
            type="primary"
            @click="submitForm(ruleFormRef, item)"
            v-for="item in BtnData"
            :key="item.UID"
          >
            {{ item.Resource.cAttributeName }}
          </el-button>
        </template>
      </template>
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
    <PopModelTDX
      :dialogType="textDialogType"
      :TDXdATA="TDXdata"
      :WDdata="props.modelGrid"
      @modelCloseText="modelCloseText"
      @modelAddText="modelAddText"
      @clickHandAddText="clickHandAddText"
    ></PopModelTDX>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  defineProps,
  computed,
  defineExpose,
  watch,
  inject,
  onMounted,
  defineEmits,
  nextTick
} from 'vue';
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
  FormRules,
  ElTree
} from 'element-plus';
import { MoreFilled, Search } from '@element-plus/icons-vue';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import PopModelTDX from '@/components/PopModelTDX/index.vue';
import { sessionStorage } from '@/utils/storage';
import { getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import BDSWHERE from '@/components/BDS/index_where.vue';
const bdsRef = ref(null);
const Route = useRoute();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const treeRef = ref<InstanceType<typeof ElTree>>();
const ruleForm: any = ref({});
const dialogFormVisible = ref();
const FormData = ref([]) as any;
const title = ref();
const cascader = ref() as any;
const multipleLimit = ref(1);
const disabled = ref();
const rowId = ref();
const rowVal = ref({});
const bindData = ref();
const TDXdata = ref();
const BtnData = ref([]) as any;
const dialogType = ref(false);
const textDialogType = ref(false);
const MulitChoose = ref(false);
const titleName = ref('标题');
const codeType = ref('');
const AttributeCode = ref('');
const optionData = ref([]) as any;
//生产单元级联选中数据
const treeVal = ref([]);
const selectVal = ref([]);
const joinnameData = ref();
const joincodeData = ref();
const IDval = ref();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
let { ctx: that, proxy } = getCurrentInstance();
// const { tableAxios } = inject('tableAxios') as {
//     tableAxios: () => void
// }
const prop = {
  children: 'Child',
  label: 'cFactoryUnitName'
};
const prop2 = {
  children: 'Child',
  label: 'cFactoryUnitName',
  value: 'cFactoryUnitCode',
  multiple: false,
  checkStrictly: true
};
const props = defineProps({
  modelGridType: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  modelGrid: {
    type: Array as any,
    default: () => []
  },
  selectData: {
    type: Array as any,
    default: () => []
  },
  title: {
    type: String,
    default: () => {
      return '';
    }
  },
  // Btn: {
  //     type: Array as any,
  // },
  dialogFormVisible: {
    type: Boolean,
    default: () => {
      return false;
    }
  },
  modelCIncludeModelCode: {
    //code 必传
    type: String,
    required: true
  },
  disabled: {
    type: Boolean
  },
  rowId: {
    type: String
  },
  row: {
    type: Object,
    default: () => {}
  },
  currentEditRowData: {
    type: Object,
    default: () => {}
  }
});
//form
watch(props, (newValue, oldValue) => {
  if (newValue.modelGridType) {
    FormData.value = newValue.modelGrid;
    rowVal.value = newValue.row ? JSON.parse(JSON.stringify(newValue.row)) : {};
  } else {
    getConfig(newValue.modelCIncludeModelCode);
  }

  // setTimeout(()=>{
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     ruleFormRef.value?ruleFormRef.value.resetFields():''
  // },10)

  // if (newValue.FormData) {
  //     FormData.value = newValue.FormData
  //     headVal()
  // }
  selectVal.value = newValue.selectData;
  dialogFormVisible.value = newValue.dialogFormVisible;
  title.value = newValue.title;
  // Btn.value = newValue.Btn
  //单行数据获取的UID
  rowId.value = newValue.row;
  IDval.value = newValue.rowId;
  //输入框禁用
  if (newValue.title == '组织管理详情') {
    disabled.value = newValue.disabled;
  } else {
    disabled.value = false;
  }
  //获取单行数据
  // if (newValue.title !== '组织管理新增') {
  //     FormData.value.forEach((item: { Resource: { cAttributeTypeCode: string; }; }) => {
  //         if (item.Resource.cAttributeTypeCode == 'binddata') {
  //             bindData.value = item
  //             sendRow()
  //         }
  //     })
  // }
  if (title.value == '编辑') {
    // ruleForm.value = rowId.value;
    ruleForm.value = { ...props.currentEditRowData };
  }
});

watch(
  () => dialogFormVisible.value,
  newVal => {
    if (!newVal) {
      bdsRef.value?.resetExpMian();
    }
  }
);
const emits = defineEmits(['modelClose', 'clickHandAdd', 'clickHandEdit']);
const getConfig = async (code: string) => {
  try {
    const res = await configApi(code);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          FormData.value = item[import.meta.env.VITE_APP_key];
          getTreeData(FormData.value);
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          BtnData.value = item[import.meta.env.VITE_APP_key];
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          // funTable(item[import.meta.env.VITE_APP_key])
        }
      });
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
};
const open = () => {
  if (Route.name == 'newProductPlanEdit') {
    ruleForm.value = rowVal.value;
  }
};
const funAllTyppe = (obj: any) => {
  if (Route.name == 'ViewPatrolPlan') {
    return true;
  } else {
    return false;
  }
};
const funAllTyppeNum = (obj: any) => {
  // 0 多选 1 单选
  if (Route.name == 'ViewPatrolPlan') {
    return 0;
  } else {
    return 1;
  }
};

//下拉框数据出现
const getTreeDAata = (v: any) => {
  // if(v){
  //     FilterData.value.forEach((item: any) => {
  //         if (item.cControlTypeCode == 'ComboBox') {
  //             if(Route.name=='originalOrder' && item.Resource.cAttributeCode=='cDefindParm11' &&checkname.value){
  //                 let data = {
  //                     method: item.Resource.cHttpTypeCode,
  //                     url: item.Resource.cServerIP + item.Resource.cUrl+"&where=cDictonaryCode like '"+checkname.value+"%'",
  //                     params: {}
  //                 }
  //                 ParamsApi(data).then((res: any) => {
  //                     item.selDataList=res.data
  //                 })
  //                 // getSelectData()
  //             }
  //             if(Route.name=='File'){
  //                 let data = {
  //                         method: item.Resource.cHttpTypeCode,
  //                         url: item.Resource.cServerIP + item.Resource.cUrl,
  //                         params: {}
  //                     }
  //                     ParamsApi(data).then((res: any) => {
  //                         item.selDataList=res.data
  //                 })
  //             }
  //             if(Route.name=='BomDoorInfo'){
  //                 let obj={"Conditions": "isdelete=false"}
  //                 if(item.Resource.cHttpTypeCode=='post'){
  //                     let data = {
  //                         method: item.Resource.cHttpTypeCode,
  //                         url: item.Resource.cServerIP + item.Resource.cUrl,
  //                         data: obj
  //                     }
  //                     DataApi(data).then((res: any) => {
  //                         item.selDataList=res.data
  //                     })
  //                 }else{
  //                     let data = {
  //                         method: item.Resource.cHttpTypeCode,
  //                         url: item.Resource.cServerIP + item.Resource.cUrl,
  //                         params: obj
  //                     }
  //                     ParamsApi(data).then((res: any) => {
  //                         item.selDataList=res.data
  //                     })
  //                 }
  //             }
  //             if(Route.name=='newOutputPlanView'){
  //                 let data = {
  //                         method: item.Resource.cHttpTypeCode,
  //                         url: item.Resource.cServerIP + item.Resource.cUrl,
  //                         params: {}
  //                     }
  //                     ParamsApi(data).then((res: any) => {
  //                         item.selDataList=res.data
  //                 })
  //             }
  //         }
  //     })
  // }
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
//下拉数据变化
const RoleName = ref([]) as any;
const GetSelectData = (item: any, value: any) => {
  if (Route.name == 'AddPersonTeam' || Route.name == 'EditPersonTeam') {
    if (item.cAttributeName == '角色类型名称') {
      RoleName.value = optionData.value.filter(
        (i: any) => i.cDictonaryCode == value
      );
    }
  }
  console.log(item, value);
  if (Route.name === 'materialEdit') {
    if (item.cAttributeCode == 'cUnitTypeName') {
      const data = optionData.value.filter(
        (i: any) => i.cDictonaryCode == value
      )[0];
      console.log(data);
      ruleForm.value.cUnitTypeCode = data.cDictonaryCode;
      ruleForm.value.cUnitTypeName = data.cDictonaryName;
    }
  }
};
const clickSelect = (val: any, d: any) => {
  if (val) {
    let data = {
      method: d.Resource.cHttpTypeCode,
      url: d.Resource.cServerIP + d.Resource.cUrl,
      params: {
        Conditions: 'cDictonaryTypeCode=' + d.cAttributeCode
      }
    };
    ParamsApi(data).then(res => {
      if (res.status == 200) {
        optionData.value = res.data;
      } else {
        console.log('失败');
      }
    });
  }
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

//级联树结构选项变化
const handleChange = (value: any) => {
  console.log(value, '树结构选中数据');
  console.log(cascader.value[0].getCheckedNodes(), '--pppp');
  // TODO：
  if (Route.name == 'newOutputPlanView') {
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
const treeChange = (valKey: any) => {
  // console.log(valKey,"--valKey");

  // console.log(treeRef.value,"--===treeRef.value");
  // console.log(ruleForm.value,"----ffgf");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let fatherName = treeRef.value[0].getHalfCheckedNodes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let childrenName = treeRef.value[0].getCheckedNodes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  TreeItem.value = treeRef.value[0].getCheckedNodes();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  treeVal.value = treeRef.value[0].getCheckedKeys(); //选中的数据
  // console.log(fatherName,"---fatherName");
  // console.log(childrenName,"---childrenName");
  // console.log(TreeItem.value,"---TreeItem.value");
  // console.log(treeVal.value,"---treeVal.value");

  let AllData = [...fatherName, ...childrenName];
  let code = ref([]) as any;
  let name = ref([]) as any;
  AllData.forEach((item: any) => {
    code.value.push(item.cFactoryUnitCode);
    name.value.push(item.cFactoryUnitName);
  });

  joinnameData.value = name.value.join('.');
  joincodeData.value = code.value.join('.');
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
const disabledFun = (item: any) => {
  if (
    Route.name == 'newApplication' ||
    Route.name == 'newWorkshopMaterialEdit' ||
    Route.name == 'newWarehouseMaterialEdit' ||
    Route.name == 'newPurchaseAuditEdit'
  ) {
    return item.DefinedParm4 == 1 ? false : true;
  } else if (
    Route.name == 'addFactory' ||
    Route.name == 'workSectionFileAdd' ||
    Route.name == 'newProductPlan' ||
    Route.name == 'newProductPlanEdit' ||
    Route.name == 'EditTarget' ||
    Route.name == 'EditPersonTeam'
  ) {
    return item.DefinedParm4 == 1 ? true : false;
  } else {
    return false;
  }
};
// 手动提交
const clickHandAdd = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  //人员组档案--表格编辑
  if (Route.name == 'AddPersonTeam' || Route.name == 'EditPersonTeam') {
    ruleForm.value['cRoleTypeName'] = RoleName.value[0]?.cDictonaryName || '';
    ruleForm.value['cRoleTypeCode'] = RoleName.value[0]?.cDictonaryCode || '';
    // ruleForm.value['cPersonCode'] = RoleName.value[0]?.cPersonCode || '';
  }
  ruleForm.value.state = 'added';
  await formEl.validate((valid, fields) => {
    if (valid) {
      // if(Route.name=='AddPersonTeam'||Route.name=='EditPersonTeam'){
      //     ruleForm.value.cDictonaryName=1
      // }
      emits('clickHandAdd', { val: ruleForm.value, type: false });
    }
  });
};

const clickHandEdit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  //人员组档案--表格编辑
  if (Route.name == 'AddPersonTeam' || Route.name == 'EditPersonTeam') {
    ruleForm.value['cRoleTypeName'] = RoleName.value[0]?.cDictonaryName || '';
    ruleForm.value['cRoleTypeCode'] = RoleName.value[0]?.cDictonaryCode || '';
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      emits('clickHandEdit', { val: ruleForm.value, type: false });
    }
  });
};
//提交
const submitForm = async (formEl: FormInstance | undefined, item: any) => {
  if (!formEl) return;
  if (item.cAttributeCode == 'SaveAdd') {
    //新增
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: {
        cOrganizationCode: ruleForm.value.cOrganizationCode,
        cOrganizationName: ruleForm.value.cOrganizationName
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
            // tableAxios()
          } else {
            ElMessage.error('新增失败');
          }
        });
        dialogFormVisible.value = false;
      } else {
        console.log('error submit!', fields);
      }
    });
  }
  if (item.cAttributeCode == 'SaveEdit') {
    //编辑
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: {
        UID: rowId.value.UID,
        utfs: rowId.value.utfs,
        cOrganizationName: ruleForm.value.cOrganizationName
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
            // tableAxios()
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
  }

  // 添加
  if (item.cAttributeCode == 'SaveConvert') {
    console.log(ruleForm.value, '---ruleForm');
    //新增
    let data = {
      method: item.Resource.cHttpTypeCode,
      url: item.Resource.cServerIP + item.Resource.cUrl,
      data: ruleForm.value
    };
    console.log(data, '--==');

    await formEl.validate((valid, fields) => {
      if (valid) {
        DataApi(data).then(res => {
          if (res.status === 200) {
            ElMessage({
              type: 'success',
              message: '新增成功'
            });
            // tableAxios()
          } else {
            ElMessage.error('新增失败');
          }
        });
        dialogFormVisible.value = false;
      } else {
        console.log('error submit!', fields);
      }
    });
  }
  if (
    item.cAttributeCode == 'SetLineOK' ||
    item.cAttributeCode == 'AdjustLineOK'
  ) {
    if (Route.name == 'ViewPatrolPlan') {
      SetLineAll(item);
    } else {
      SetLineOK(item);
    }
  }
};
const SetLineOK = (obj: any) => {
  // console.log(obj,IDval.value,"----obj");
  console.log(TreeItem.value, '---TreeItem.value');
  console.log(selectVal.value, '---selectVal.value');
  let arr: any = [];
  selectVal.value.forEach((item: any) => {
    if (Route.name == 'ViewPatrolPlan') {
      arr.push(item.UID);
    }
    if (Route.name == 'newOutputPlanView') {
      arr.push(item.S_S_S_uid);
    }
  });

  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // list_uid:treeVal.value,
      list_uid: arr,
      // "cFactoryUnitCode": TreeItem.value.length>1? TreeItem.value[TreeItem.value.length-1].cFactoryUnitCode:TreeItem.value[0].cFactoryUnitCode||'',
      // "cFactoryUnitName": TreeItem.value.length>1? TreeItem.value[TreeItem.value.length-1].cFactoryUnitName:TreeItem.value[0].cFactoryUnitName||''
      cFactoryUnitCode: ruleForm.value.cFactoryUnitCode,
      cFactoryUnitName: ruleForm.value.cFactoryUnitName
    }
  };
  // ElLoading.service({lock: true,text: '加载中.....'})
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '成功'
      });
      emits('modelClose', { type: false });
    } else {
      ElMessage.error('失败');
    }
    // ElLoading.service().close()
  });
};
const SetLineAll = (obj: any) => {
  let arr: any = [];
  selectVal.value.forEach((item: any) => {
    if (Route.name == 'ViewPatrolPlan') {
      arr.push(item.UID);
    }
    if (Route.name == 'newOutputPlanView') {
      arr.push(item.item_sss_UID);
    }
  });
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      // list_uid:treeVal.value,
      list_uid: arr,
      list_unit: TreeItem.value
    }
  };
  console.log(data, '--data');
  console.log(TreeItem.value, '--arr');

  // ElLoading.service({lock: true,text: '加载中.....'})
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '成功'
      });
      emits('modelClose', { type: false });
    } else {
      ElMessage.error('失败');
    }
    // ElLoading.service().close()
  });
};
//取消
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  ruleForm.value = {};
  dialogFormVisible.value = false;
  emits('modelClose', { type: false });
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
const selectData = (val: any) => {
  console.log(val, '---val');
  // console.log(titleName.value, '--titleName.value ');
  // console.log(AttributeCode.value, '-AttributeCode.value');

  FormData.value[AttributeCode.value] = '11';
  // 单选
  if (val.type === false) {
    if (
      titleName.value == '换算单位编码' ||
      titleName.value == '辅计量单位编码'
    ) {
      ruleForm.value[AttributeCode.value] = val.value[0].cUnitCode;
    } else if (['addProductLine', 'addProductLineEdit'].includes(Route.name)) {
      if (AttributeCode.value == 'cProcessName') {
        ruleForm.value[AttributeCode.value] = val.value[0].cProcessName;
      }
    } else if (
      titleName.value == '换算单位名称' ||
      titleName.value == '辅计量单位名称'
    ) {
      ruleForm.value[AttributeCode.value] = val.value[0].cUnitName;
    } else if (titleName.value == '主计量单位名称') {
      ruleForm.value['cUnitCode'] = val.value[0].cUnitCode;
      ruleForm.value['cUnitName'] = val.value[0].cUnitName;
      //人员组档案
    } else if (
      Route.name == 'AddPersonTeam' ||
      Route.name == 'EditPersonTeam'
    ) {
      ruleForm.value.cPersonName = val.value[0].cEmployeeName;
      ruleForm.value.cPersonCode = val.value[0].cEmployeeCode;
    } else if (
      Route.name == 'addOperalPathEdit' ||
      Route.name == 'addOperalPath'
    ) {
      if (AttributeCode.value == 'cCraftName') {
        ruleForm.value.cCraftCode = val.value[0].cCraftCode;
        ruleForm.value.cCraftName = val.value[0].cCraftName;
      }
      if (AttributeCode.value == 'cProcessName') {
        ruleForm.value.cProcessCode = val.value[0].cCraftCode;
        ruleForm.value.cProcessName = val.value[0].cCraftName;
      }
    } else if (
      Route.name == 'addProductLineEdit' ||
      Route.name == 'addProductLine' ||
      Route.name == 'addProductLineView'
    ) {
      if (AttributeCode.value == 'cPositionName') {
        ruleForm.value.cPositionName = val.value[0].cPositionName;
        ruleForm.value.cPositionCode = val.value[0].cPositionCode;
      }
      if (AttributeCode.value == 'cCraftName') {
        ruleForm.value.cCraftName = val.value[0].cCraftName;
        ruleForm.value.cCraftCode = val.value[0].cCraftCode;
      }
    } else {
      ruleForm.value[AttributeCode.value] = val.value[0][AttributeCode.value];
    }
  } else {
    ElMessage({
      message: '重新配置',
      type: 'error'
    });
  }
  dialogType.value = false;
};
//+号   公式调取接口
const clickTextBoxText = (obj: any) => {
  titleName.value = obj.Resource.cAttributeName;
  AttributeCode.value = obj.Resource.cAttributeCode;
  textDialogType.value = true;
  TDXdata.value = obj;
};
const modelCloseText = (val: any) => {
  textDialogType.value = val.type;
};
const modelAddText = (val: any) => {
  ruleForm.value[AttributeCode.value] = val.val;
  textDialogType.value = val.type;
};

const clickHandAddText = (val: any) => {
  textDialogType.value = val.type;
};
</script>

<style scoped lang="scss">
:deep(.el-select) {
  max-height: 300px;
  overflow-y: auto;
}
:deep(.textSty .el-input-group__append) {
  padding: 0;
}

.textSty {
  span {
    padding: 0 13px;
  }
}
</style>
