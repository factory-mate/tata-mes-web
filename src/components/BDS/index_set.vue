<template>
  <div class="bdsSty">
    <!-- set -->
    <div style="display: flex">
      <el-input
        v-model="textarea"
        style="width: 80%; height: 80px; display: inline-block"
        type="textarea"
        placeholder=""
        disabled
      />
      <div>
        <div>
          <el-select-v2
            v-model="wdvalue"
            value-key="UID"
            placeholder="选择维度"
            style="width: 100px"
            clearable
            filterable
            :options="WDoptions"
          >
          </el-select-v2>
          <el-button type="" @click="clickWD">添加维度</el-button>
        </div>
        <div style="margin-top: 10px">
          <el-input v-model="clvalue" style="width: 100px" placeholder="" />
          <el-button type="" @click="clickCL">添加常量</el-button>
        </div>
      </div>
    </div>
    <div style="display: flex; margin-top: 20px">
      <el-button type="" @click="clickstr('+')">加+</el-button>
      <el-button type="" @click="clickstr('-')">减-</el-button>
      <el-button type="" @click="clickstr('*')">乘*</el-button>
      <el-button type="" @click="clickstr('/')">除/</el-button>
      <el-button type="" @click="clickstr('%')">余%</el-button>
      <el-button type="" @click="clickstr('(')">括号(</el-button>
      <el-button type="" @click="clickstr(')')">括号)</el-button>
      <el-button type="" @click="clickstr('=')">等于号=</el-button>

      <el-button type="" @click="clickdel()" style="margin-left: 30px"
        >删除</el-button
      >
    </div>

    <div class="buttSty">
      <el-button type="danger" @click="clickEnd">添加</el-button>
      <el-button type="danger" @click="clickRest">重置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted, defineEmits } from 'vue';
import { MoreFilled, Delete } from '@element-plus/icons-vue';
import { ElSelectV2, ElInput, ElOption, ElSelect } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import searchModel from '@/components/MultiSelect/searchModel.vue';
const emits = defineEmits(['changeRuleForm']);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const props = defineProps({
  Head: {
    required: true,
    type: Array as any,
    default: () => []
  }
});

const wdCodeList = ref<any>([]);

const rowId = ref();
const textarea = ref('');
const wdvalue = ref(null);
const clvalue = ref();
const WDoptions = ref<any>([]);
const disabledType = ref(false);
const autosize = {
  minRows: 2,
  maxRows: 6
};
const options = [
  {
    value: 'Option1',
    label: 'Option1'
  }
];
const currentSelectWd = ref({});

onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  rowId.value = Route.params.rowId;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Route.meta.title.match(/详情/gi)) {
    disabledType.value = true;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // if(Route.meta.title.match(/详情/ig)||Route.meta.title.match(/编辑/ig)){

  // }
  getListWD();
  // getListJS()
});
// onActivated(()=>{

// })
const clickdel = () => {
  textarea.value = textarea.value.slice(0, -1);
};
const clickstr = (v: any) => {
  textarea.value = textarea.value + v;
};
const clickWD = () => {
  if (!wdvalue.value) {
    return;
  }

  const data = WDoptions.value.find((i: any) => i.UID == wdvalue.value);

  textarea.value = textarea.value + (data.cLamdaSymbol ?? '');
  wdCodeList.value.push(data.cDimensionalityCode);
  wdvalue.value = null;
};
const clickCL = () => {
  textarea.value = textarea.value + (clvalue.value ?? '');
  clvalue.value = '';
};
const clickRest = () => {
  textarea.value = '';
  wdCodeList.value = [];
};
const clickEnd = () => {
  $bus.emit('SETBDS', textarea.value);
  emits('changeRuleForm', {
    models: wdCodeList.value.map((i: any) => ({
      MID: rowId.value,
      cDimensionalityCode: i
    }))
  });
};
const getListWD = () => {
  let data = {
    method: 'get',
    url:
      import.meta.env.VITE_APP_DY_100_API +
      '/api/DIMENSIONALITY_MODEL_S/GetForList',
    params: {
      OrderByFileds: ''
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
          value: i
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
</script>

<style scoped>
:deep(.el-textarea__inner) {
  max-height: 80px;
  height: 80px;
  min-height: 80px;
}
.buttSty {
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
