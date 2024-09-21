<template>
  <div class="bdsSty">
    <!-- 一级 主题-->
    <div
      class="b_con"
      :class="{ borSty: one.twoList.length > 1 }"
      v-for="(one, one_i) in expMian"
      :key="one_i"
    >
      <!-- 一级 左 -->
      <div class="b_one_left">
        <span class="one_tt" v-show="one.twoList.length > 1"></span>
        <span class="one_bb" v-show="one.twoList.length > 1"></span>
        <el-switch
          v-show="one.twoList.length > 1"
          style="margin: 0 10px"
          v-model="one.cConditionTypeFirst"
          :disabled="disabledType"
          @change="funMaxS"
          size="small"
          active-text="且"
          inactive-text="或"
          active-value="1"
          inactive-value="0"
        />
      </div>
      <!-- 二级 主题-->
      <div class="b_one_main">
        <div
          class="b_one_main_con"
          :class="{ borSty2: two.thrList.length > 1 }"
          v-for="(two, two_i) in one.twoList"
          :key="two_i"
        >
          <span class="one_tt" v-show="two.thrList.length > 1"></span>
          <span class="one_bb" v-show="two.thrList.length > 1"></span>
          <div class="b_two_left">
            <el-switch
              :disabled="disabledType"
              v-show="two.thrList.length > 1"
              style="margin: 0 10px"
              v-model="two.cConditionTypeSecond"
              @change="funMinS"
              size="small"
              active-text="且"
              inactive-text="或"
              active-value="1"
              inactive-value="0"
            />
          </div>
          <!--二级 每一项 -->
          <div class="b_two_mian">
            <div
              class="b_two_mian_item"
              v-for="(thr, thr_i) in two.thrList"
              :key="thr_i"
            >
              <!-- 维度 -->
              <el-select-v2
                :disabled="disabledType"
                v-model="thr.cDimensionalityCode"
                clearable
                filterable
                placeholder="选择维度"
                style="width: 240px"
                @visible-change="selectVisible"
                :options="WDoptions"
              />
              <!-- 操作符 -->
              <el-select
                v-model="thr.cLamdaConditionTypeCode"
                :disabled="disabledType"
                clearable
                placeholder="选择操作符"
                @change="funSelect(thr, thr_i)"
                style="width: 240px"
                @visible-change="selectVisible"
              >
                <el-option
                  v-for="item in BJoptions"
                  :key="item.cDictonaryCode"
                  :label="item.cDictonaryName"
                  :value="item.cDictonaryCode"
                />
              </el-select>
              <!-- 数据   cTextureCode   cTextureName-->
              <el-input
                @change="TextBoxLink"
                v-if="thr.typeVal == 'x'"
                v-model="thr.cTextureName"
                placeholder="请选择"
                :disabled="true"
                style="width: 200px"
                clearable
              >
                <!-- <template #append>
                                    <el-icon v-if="!props.disabled" @click="clickModel()">
                                        <MoreFilled />
                                    </el-icon>
                                    <el-icon v-else>
                                        <MoreFilled />
                                    </el-icon>
                                </template> -->
              </el-input>
              <el-input
                :disabled="disabledType"
                v-if="thr.typeVal == 's'"
                v-model="thr.cTextureName"
                placeholder="请输入"
                style="width: 200px"
                clearable
              ></el-input>
              <!-- <button @click="clickThrDel(two,thr_i)">移除</button> -->
              <el-button
                :disabled="disabledType"
                type="primary"
                @click="clickXuan(thr, thr_i, two_i)"
                style="margin-left: 10px"
                >选择</el-button
              >
              <el-button
                :disabled="disabledType"
                type="primary"
                @click="clickShu(thr, thr_i)"
                >输入</el-button
              >
              <el-button
                :disabled="disabledType"
                @click="clickThrDel(two, thr_i)"
                type="danger"
                :icon="Delete"
                circle
              />
            </div>
            <div class="but_sty">
              <el-button
                :disabled="disabledType"
                @click="clickThr(two)"
                type="success"
                plain
                >添加条件</el-button
              >
            </div>
          </div>
          <el-button
            :disabled="disabledType"
            @click="clickOneDel(one, two_i)"
            type="danger"
            :icon="Delete"
            circle
            style="width: 80px"
            >删除</el-button
          >
        </div>
      </div>
    </div>
    <div class="but_sty">
      <el-button
        @click="clickOne()"
        :disabled="disabledType"
        type="success"
        plain
        style="margin-left: 100px"
        >添加条件</el-button
      >
    </div>
    <div class="buttSty">
      <el-button type="danger" :disabled="disabledType" @click="generateLambda">
        生成表达式
      </el-button>
      <!-- <el-button
        v-else
        type="danger"
        :disabled="disabledType"
        @click="clickAdd"
      >
        保存
      </el-button> -->
    </div>

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
      :metadata="metadata"
    ></searchModel>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  defineProps,
  reactive,
  onMounted,
  defineEmits,
  inject,
  watch
} from 'vue';
import { MoreFilled, Delete } from '@element-plus/icons-vue';
import {
  ElMessage,
  ElIcon,
  ElInput,
  ElOption,
  ElSelect,
  ElSelectV2
} from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import searchModel from '@/components/MultiSelect/searchModel.vue';
import useStore from '@/store';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import { onUnmounted } from 'vue';
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const emits = defineEmits(['changeRuleForm']);
const props = defineProps({
  Head: {
    required: false,
    type: Array as any,
    default: () => []
  },
  ruleForm: {
    required: false,
    type: Object as any,
    default: () => {}
  }
});
const { tagsView } = useStore();
const router = useRouter();
const BJoptions = ref([]) as any;
const WDoptions = ref([]) as any;

const codeType = ref('');
const MulitChoose = ref(false);
const filterVal = ref('');
const filterData = ref() as any;
const titleName = ref('选择');
const HeadFormvalue = ref([]) as any;
const TiaoJian = ref([]) as any;
const maxSwitch = ref(false);
const dialogType = ref(false);
const minSwitch = ref(false);
const cDimensionalityCode = ref('');
const cLamdaConditionTypeCode = ref('');
const cTextureName = ref('');
const disabledType = ref(false);
const rowId = ref('');
const oneList = ref([{}, {}]) as any;
const twoList = ref([{}]) as any;
const thrList = ref([{}, {}]) as any;
const oneListtwoList = ref([{}]) as any;
const two_index = ref('');
const thr_index = ref('');
const metadata = ref<any>({});
const expMian = ref([
  {
    cConditionTypeFirst: 0,
    twoList: [
      {
        cConditionTypeSecond: '1',
        thrList: [
          {
            cDimensionalityCode: '', //唯独
            cLamdaConditionTypeCode: '', //条件
            cTextureCode: '', //数据code
            cTextureName: '', //数据Name
            typeVal: 'x'
          }
        ]
      }
    ]
  }
]) as any;

onMounted(() => {
  rowId.value = Route.params.rowId;

  if (Route.meta.title.match(/详情/gi) && Route.name !== 'newProductPlanView') {
    disabledType.value = true;
  }

  if (Route.meta.title.match(/详情/gi) || Route.meta.title.match(/编辑/gi)) {
    getObj();
  }
  getListWD();
  getListJS();
});

const selectVisible = prop => {
  if (prop) {
    getListWD();
    getListJS();
  }
};
const getListWD = () => {
  let conditions = '';
  if (Route.name === 'newProductPlan' || Route.name === 'newProductPlanView') {
    conditions = 'cModelCode=TD001';
  }
  if (Route.name === 'AddBusineScen') {
    conditions = 'cModelCode=' + Route.query.cDataCode;
  }
  let data = {
    method: 'get',
    url:
      import.meta.env.VITE_APP_DY_100_API +
      '/api/DIMENSIONALITY_MODEL_S/GetForList',
    params: {
      OrderByFileds: '',
      Conditions: conditions
      // Conditions: 'MID=' + rowId.value
    }
  };
  // return false
  try {
    ParamsApi(data).then(res => {
      if (res.status == 200) {
        WDoptions.value = res.data.map((i: any) => ({
          ...i,
          label: i.cDimensionalityName,
          value: i.cDimensionalityCode
        }));
      } else {
        console.log('请求出错');
      }
    });
  } catch (error) {
    console.log(error, '程序出错');
  }
};
const getListJS = () => {
  let data = {
    method: 'get',
    url: import.meta.env.VITE_APP_BASE_API + '/api/Dictonary/GetDicType',
    params: {
      cTableCode: 'FM_MES_SetLamda_S_S',
      cAttributeCode: 'cLamdaConditionType',
      where: ''
    }
  };
  // return false
  try {
    ParamsApi(data).then(res => {
      if (res.status == 200) {
        BJoptions.value = res.data;
      } else {
        console.log('请求出错');
      }
    });
  } catch (error) {
    console.log(error, '程序出错');
  }
};
const getObj = () => {
  let data = {
    method: 'get',
    url: import.meta.env.VITE_APP_DY_100_API + '/api/SetLamda/GetByMID',
    params: {
      // MID:'C7B1FB94-762B-48A1-AB73-0008E2930846'
      MID: rowId.value
    }
  };
  // return false
  try {
    ParamsApi(data).then(res => {
      if (res.status == 200) {
        if (res.data) {
          expMian.value = JSON.parse(res.data.cJsonContent);
        }
      } else {
        console.log('请求出错');
      }
    });
  } catch (error) {
    console.log(error, '程序出错');
  }
};
const funMaxS = (v: any) => {
  console.log(v, '---mainSS');
};
const funMinS = (v: any) => {
  console.log(v, '---mainSS');
};
const TextBoxLink = () => {
  console.log('input');
};
// 一级添加
const clickOne = () => {
  let obj = {
    cConditionTypeSecond: '1',
    thrList: [
      {
        cDimensionalityCode: '', //唯独
        cLamdaConditionTypeCode: '', //条件
        cTextureCode: '', //数据code
        cTextureName: '', //数据Name
        typeVal: 'x'
      }
    ]
  };
  expMian.value[0].twoList.push(obj);
};
// 一级删除
const clickOneDel = (one: any, i: any) => {
  // oneList.value.splice(i,1)
  one.twoList.splice(i, 1);
};
// 二级添加
const clickThr = (two: any) => {
  let obj = {
    cDimensionalityCode: '', //唯独
    cLamdaConditionTypeCode: '', //条件
    cTextureCode: '', //数据code
    cTextureName: '', //数据Name
    typeVal: 'x'
  };
  two.thrList.push(obj);
  console.log(two.thrList);
};
// 二级删除
const clickThrDel = (two: any, i: any) => {
  // thrList.value.splice(i,1)
  two.thrList.splice(i, 1);
};
const clickModel = () => {
  // MulitChoose.value = type
  // AttributeCode.value = obj.Resource.cAttributeCode
  // AttributeCode.value = ''
  dialogType.value = true;
  codeType.value = 'ManageCenter.SYS_DICTONARY_Texture.M.FormList';
  // filterVal.value = ruleForm.value.cType
};
const funSelect = (v: any, i: any) => {
  console.log(v, '--=3');
  console.log(i, '--=444');
};

// 选择
const clickXuan = (item: any, thr_i: any, two_i: any) => {
  console.log(item, thr_i, two_i);

  // 获取维度item
  const wdItem: any = WDoptions.value.find(
    (v: any) => v.cDimensionalityCode == item.cDimensionalityCode
  );

  if (!wdItem?.cDictonaryTypeCode) {
    ElMessage({
      message: '未配置 cDictonaryTypeCode',
      type: 'error'
    });
    return;
  } else {
    metadata.value = {
      cDictonaryTypeCode: wdItem.cDictonaryTypeCode
    };
  }

  if (!metadata.value.cDictonaryTypeCode) {
    ElMessage({
      message: '请先选择维度',
      type: 'error'
    });
    return;
  }
  two_index.value = two_i;
  thr_index.value = thr_i;
  item.type = 'x';
  item.cTextureCode = '';
  item.cTextureName = '';
  dialogType.value = true;
  codeType.value = 'ManageCenter.SYS_DICTONARY.M.FormList';
};

//搜索弹框数据选择
const selectData = (val: any) => {
  console.log(val, '--val');
  dialogType.value = val.type;
  // cTextureCode:''
  // cTextureName:''
  expMian.value[0].twoList[two_index.value].thrList[
    thr_index.value
  ].cTextureCode = val.value[0].cDictonaryCode;
  expMian.value[0].twoList[two_index.value].thrList[
    thr_index.value
  ].cTextureName = val.value[0].cDictonaryName;
};
// 输入
const clickShu = (item: any, i: any) => {
  item.typeVal = 's';
  item.cTextureCode = '';
  item.cTextureName = '';
};
const generateLambda = async () => {
  const dimensionCodes = [];
  expMian.value.forEach((item: any) => {
    item.twoList.forEach((two: any) => {
      two.thrList.forEach((thr: any) => {
        if (
          !dimensionCodes.some(
            i => i.cDimensionalityCode == thr.cDimensionalityCode
          )
        ) {
          dimensionCodes.push({
            cDimensionalityCode: thr.cDimensionalityCode,
            MID: Route.params.rowId
          });
        }
      });
    });
  });

  emits('changeRuleForm', { models: dimensionCodes });

  const data = {
    method: 'post',
    url:
      import.meta.env.VITE_APP_DY_100_API +
      '/api/SetLamda/BuildLamdaOnRecursion',
    data: expMian.value
  };
  DataApi(data).then(res => {
    const { status, data } = res;
    if (status === 200 && data) {
      const lambda = data;
      props.ruleForm.cLamda = lambda;
    } else {
      ElMessage({
        message: res.msg || '生成失败',
        type: 'error'
      });
    }
  });
};

const clickAdd = async () => {
  let createId = '';
  const dimensionCodes = [];
  expMian.value.forEach((item: any) => {
    item.twoList.forEach((two: any) => {
      two.thrList.forEach((thr: any) => {
        if (
          !dimensionCodes.some(
            i => i.cDimensionalityCode == thr.cDimensionalityCode
          )
        ) {
          dimensionCodes.push({
            cDimensionalityCode: thr.cDimensionalityCode,
            MID: Route.params.rowId
          });
        }
      });
    });
  });

  emits('changeRuleForm', { models: dimensionCodes });

  if (Route.name === 'AddBusineScen') {
    if (Route.meta.title.match(/新增/gi)) {
      const { UID } = (
        await DataApi({
          method: 'post',
          url:
            import.meta.env.VITE_APP_DY_100_API +
            '/api/PROJECT_S_S_POLICY_S_S/Add',
          data: {
            MID: Route.params.rowId,
            ...props.ruleForm,
            models: dimensionCodes,
            cLamda: '1=1'
          }
        })
      ).data;
      createId = UID;
    }
    if (Route.meta.title.match(/编辑/gi)) {
      (
        await DataApi({
          method: 'post',
          url:
            import.meta.env.VITE_APP_DY_100_API +
            '/api/PROJECT_S_S_POLICY_S_S/Edit',
          data: {
            MID: Route.params.rowId,
            ...props.ruleForm,
            models: dimensionCodes
          }
        })
      ).data;
    }
  }
  let data = {
    method: 'post',
    url: import.meta.env.VITE_APP_DY_100_API + '/api/SetLamda/SetLamda',
    data: {
      MID: Route.meta.title.match(/新增/gi) ? createId : Route.params.rowId,
      cJsonContent: JSON.stringify(expMian.value),
      list_First: expMian.value
    }
  };
  // return false
  try {
    DataApi(data).then(res => {
      if (res.status == 200) {
        BJoptions.value = res.data;
        ElMessage({
          message: res.msg || '成功',
          type: 'success'
        });
        $bus.emit('BDSGET', true);
        if (Route.meta.title.match(/新增/gi)) {
          router.push({ name: 'BusineScen' });
          $bus.emit('tableUpData', { name: 'BusineScen' });
          tagsView.delVisitedView(Route);
        }
      } else {
        ElMessage({
          message: res.msg || '失败',
          type: 'error'
        });
        console.log('请求出错');
      }
    });
  } catch (error) {
    console.log(error, '程序出错');
  }
};

// 搜索弹框事件
const ModelClose = (val: any) => {
  dialogType.value = val.type;
};

const resetExpMian = () => {
  expMian.value = [
    {
      cConditionTypeFirst: 0,
      twoList: [
        {
          cConditionTypeSecond: '1',
          thrList: [
            {
              cDimensionalityCode: '', //唯独
              cLamdaConditionTypeCode: '', //条件
              cTextureCode: '', //数据code
              cTextureName: '', //数据Name
              typeVal: 'x'
            }
          ]
        }
      ]
    }
  ];
};

defineExpose({ resetExpMian });
</script>

<style scoped lang="scss">
.bdsSty {
  // border: 1px solid red;
  .b_con {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    // border: 1px solid red;
    // border-left-style: ;

    .b_one_left {
      width: 100px;
      height: 100%;
      // border: 1px solid red;
      // border-right: 1px solid red;
      // border:1px solid red
    }
  }
}
.b_one_main {
  // border-left: 1px solid red;
  //    border: 1px solid red;
  flex: 1;
  .b_one_main_con {
    padding: 10px;
    margin: 6px 0;
    // border: 1px solid red;
    background: #f7f7f7;
    display: flex;
    align-items: center;
    .b_two_left {
      margin-top: -30px;
      width: 120px;
      // border: 1px solid red;
    }
    .b_two_mian {
      width: 100%;

      // border: 1px solid red;
      .b_two_mian_item {
        width: 100%;
        margin: 4px;
        display: flex;
        align-items: center;
      }
    }
  }
}
.but_sty {
  margin-top: 10px;
}
.buttSty {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.borSty {
  width: 100%;
  height: 100%;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    top: 20px;
    left: 50px;
    height: calc(100% - 40px);
    border-left: 1px solid var(--el-color-primary);
  }
  .one_tt {
    position: absolute;
    top: 20px;
    left: 50px;
    display: inline-block;
    width: 50px;
    height: 1px;
    border-bottom: 1px solid var(--el-color-primary);
  }
  .one_bb {
    position: absolute;
    bottom: 20px;
    left: 50px;
    display: inline-block;
    width: 50px;
    height: 1px;
    border-bottom: 1px solid var(--el-color-primary);
  }
}
.borSty2 {
  width: 100%;
  height: 100%;
  position: relative;
  &::before {
    position: absolute;
    content: '';
    top: 20px;
    left: 50px;
    height: calc(100% - 70px);
    border-left: 1px solid var(--el-color-primary);
  }
  .one_tt {
    position: absolute;
    top: 20px;
    left: 50px;
    display: inline-block;
    width: 50px;
    height: 1px;
    border-bottom: 1px solid var(--el-color-primary);
  }
  .one_bb {
    position: absolute;
    bottom: 50px;
    left: 50px;
    display: inline-block;
    width: 50px;
    height: 1px;
    border-bottom: 1px solid var(--el-color-primary);
  }
}
</style>
