<template>
  <el-dialog v-model="dialogVisibleType" @close="resetForm()" @open="openDialog()" title="新增公式" width="800px" center
    append-to-body>
    <div style="height:30px">
      <span v-if='TDXStrVal'>公式：{{ TDXStrVal }}</span>
    </div>
    <div class="TDX_main">
      <div class="item_con" v-for="(item, i) in formulaVal" :key="i">
        <el-select v-model="item.leftVal" placeholder=" " clearable style="width:50px;margin-right:14px"
          @clear="clickKuohao(i, 'leftVal')">
          <el-option v-for="item in leftRound" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="item.termsVal" remote reserve-keyword multiple filterable placeholder="请选择/搜索"
          :remote-method="DataSearch" clearable style="width:160px">
          <el-option v-for="item in PageWDData" :key="item.cDimensionalityCode" :label="item.cDimensionalityName"
            :value="item.cDimensionalityCode" />
        </el-select>
        <el-select v-model="item.symbolVal" placeholder="请选择" class="symbolSty" clearable style="width:100px"
          @focus="getData(cRelationalSymbol)">
          <el-option v-for="item in termsData" :key="item.cDictonaryCode" :label="item.cDictonaryName"
            :value="item.cDictonaryCode" />
        </el-select>
        <el-input v-model="item.inputVal" placeholder="请输入" clearable style="width:160px" />
        <div>
          <el-select v-model="item.contactVal" placeholder="请选择" clearable style="width:100px;margin-right:14px"
            v-if="formulaVal.length - i > 1" @focus="getData(cLogicSymbol)">
            <el-option v-for="item in termsData" :key="item.cDictonaryCode" :label="item.cDictonaryName"
              :value="item.cDictonaryCode" />
          </el-select>
          <p v-else style="width: 100px;margin-right:14px"></p>
        </div>
        <el-select v-model="item.rightVal" placeholder=" " clearable style="width:50px;"
          @clear="clickKuohao(i, 'rightVal')">
          <el-option v-for="item in RightRound" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <template v-if="formulaVal.length == 1 ? true : formulaVal.length - i > 1">
          <el-button type="primary" :icon="Plus" plain circle style="margin: 0 10px;" @click="clickPlus(i)" />
          <el-button type="primary" :icon="Minus" plain circle style="margin: 0 10px;" @click="clickDelete(i)" />
        </template>
      </div>
    </div>
    <template #footer>
      <el-button @click="resetForm()">取消</el-button>
      <el-button @click="clickHandAdd(true)" type="primary">添加</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, toRefs, computed, watch, inject, onMounted } from "vue";
import { MoreFilled, Search, Plus, Minus } from '@element-plus/icons-vue'
import { ElMessage, ElIcon, ElInput, ElOption, ElSelect } from 'element-plus'
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index'
import { ElMessageBox } from 'element-plus'
const emits = defineEmits(['modelCloseText', 'modelAddText', 'clickHandAddText'])
const props = defineProps({
  dialogType: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  TDXdATA: {
    type: Object,
  },
  WDdata: {
    type: Array,
    default: () => []
  }
})
const leftRound = [
  {
    value: '(',
    label: '(',
  },
]
const RightRound = [
  {
    value: ')',
    label: ')',
  },
]
const termsData = ref([]) as any
const WDDdata = ref([]) as any
const TDXdata = ref()
const TDXvalue = ref('')
const TDXStrVal = ref('')
// 算术运算符(暂时不用)
const cArithmeticSymbol = ref('cArithmeticSymbol')
// 逻辑运算符()
const cLogicSymbol = ref('cLogicSymbol')
// 关系运算符()
const cRelationalSymbol = ref('cRelationalSymbol')
//维度数据
const PageWDData = ref()
const formulaVal = ref([
  {
    leftVal: '-',
    termsVal: '',
    symbolVal: '',
    inputVal: '',
    contactVal: '-',
    rightVal: '-'
  }
])
const dialogVisibleType = ref(false)
watch(() => props.dialogType, (newValue, oldValue) => {
  dialogVisibleType.value = newValue
})
// //公式接口数据
watch(() => props.TDXdATA, (newValue, oldValue) => {
  TDXdata.value = newValue
}, { deep: true })
//维度数据
watch(() => props.WDdata, (newValue, oldValue) => {
  WDDdata.value = newValue
  getWDData()
}, { deep: true })
watch(formulaVal, (newValue, oldValue) => {
  ArrStrData()
}, { deep: true })


onMounted(() => {
})
const queryParams = ref({
  PageIndex: 1,
  PageSize: 10
}) as any
//调取公式接口
const getData = (val: any) => {
  console.log(val, '909090');

  let data = {
    method: TDXdata.value.Resource.cHttpTypeCode,
    url: TDXdata.value.Resource.cServerIP + TDXdata.value.Resource.cUrl,
    params: {
      "OrderByFileds": "",
      "Conditions": `cDictonaryTypeCode=${val}`,
    }
  }
  ParamsApi(data).then((res: any) => {
    termsData.value = res.data
  })
}
const PageData = ref()
//初始数据   调取维度接口数据（长宽高）
const getWDData = async () => {
  WDDdata.value.forEach((item: { cAttributeCode: string; cIncludeModelCode: string; }) => {
    if (item.cAttributeCode == 'cDimensionalityName') {
      configApi(item.cIncludeModelCode).then(res => {
        res.data[0].Parms.forEach((item: { cAttributeCode: string; }) => {
          if (item.cAttributeCode == 'PageData') {
            PageData.value = item
            FunTable(item)
          }
        })
      })
    }
  })
}
const FunTable = (item: any) => {
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      "PageIndex": queryParams.value.PageIndex,
      "PageSize": 50,
      "OrderByFileds": "",
      "Conditions": ""
    }
  }
  DataApi(data).then(res => {
    PageWDData.value = res.data.data
  })
}
//搜索数据   维度（长宽高）
const DataSearch = (v: any) => {
  let data = {
    method: PageData.value.Resource.cHttpTypeCode,
    url: PageData.value.Resource.cServerIP + PageData.value.Resource.cUrl,
    data: {
      "PageIndex": queryParams.value.PageIndex,
      "PageSize": 50,
      "OrderByFileds": "",
      "Conditions": `cDimensionalityName like ${v} || cDimensionalityCode like ${v}`
    }
  }
  DataApi(data).then(res => {
    if (res.status == 200) {
      PageWDData.value = res.data.data
    } else {
      console.log('请求出错');
    }
  })
}
const openDialog = () => {
  formulaVal.value = [
    {
      leftVal: '-',
      termsVal: '',
      symbolVal: '',
      inputVal: '',
      contactVal: '-',
      rightVal: '-'
    }
  ]
}
const clickPlus = (i: any) => {
  let obj = {
    leftVal: '-',
    termsVal: '',
    symbolVal: '',
    inputVal: '',
    contactVal: '',
    rightVal: '-'
  }
  formulaVal.value.splice(i + 1, 0, obj)
  formulaVal.value[formulaVal.value.length - 1].contactVal = '-'
  if (formulaVal.value.length > 1 && formulaVal.value[0].contactVal == '-') {
    formulaVal.value[0].contactVal = ''
  }

}
const clickDelete = (i: any) => {
  formulaVal.value.splice(i, 1)
}
const clickKuohao = (i: any, val: any) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formulaVal.value[i][val] = '-'

}
//取消
const resetForm = () => {
  // dialogVisibleType.value = false
  emits('modelCloseText', { type: false })

}
// 手动提交
const clickHandAdd = async (type: boolean) => {
  console.log(formulaVal.value, "---提交");
  TDXvalue.value = ''
  let empty = formulaVal.value.filter((item: any) => {
    if (!item.leftVal || !item.termsVal || !item.symbolVal || !item.inputVal || !item.contactVal || !item.rightVal) {
      return item
    }
  })
  if (empty.length > 0) {
    ElMessage({
      message: '公式不能为空！',
      type: 'error'
    })
    return false
  }
  ArrStrData()
  console.log(TDXStrVal.value);

  emits('modelAddText', { type: false, val: TDXStrVal.value })

}
const ArrStrData = () => {
  TDXStrVal.value = ''
  formulaVal.value.forEach((item: any) => {
    let itemVal = `${item.leftVal == '(' ? item.leftVal : ''}` + item.termsVal + item.symbolVal + item.inputVal + `${item.rightVal == ')' ? item.rightVal : ''}` + `${item.contactVal != '-' ? item.contactVal : ''}`
    TDXStrVal.value = TDXStrVal.value.concat(itemVal)
  })
}
</script>

<style scoped lang="scss">
.TDX_main {
  width: 100%;
  max-height: 600px;
  overflow-y: auto;

  .item_con {
    width: 100%;
    display: flex;
    margin-bottom: 20px;

    .symbolSty {
      :deep(.el-input__inner) {
        text-align: center;
      }
    }

  }
}
</style>