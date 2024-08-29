<template>
  <!--门套线每日产量表页面 -->
  <div class="maintain">
    <el-card>
        <div class="dataPick">
            生产日期:<el-date-picker
            v-model="dataValue"
            type="date"
            placeholder="Pick a day"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
          <el-button class="buton" @click="GoData" >搜索</el-button>
        </div>
      <el-table
        :data="ComperData"
        style="width: 100%"
        :header-cell-style="{
          backgroundColor: '#a7072b',
          color: '#5a5e66',
          fontSize: '14px',
          textAlign: 'center',
          borderLeft: '0.5px black solid',
          borderBottom: '1px black solid',
        }"
        :cell-style="{
          color: '#000000',
          fontSize: '14px',
          textAlign: 'center',
          borderBottom: '0.5px black solid',
          borderLeft: '0.5px black solid',
        }"
        :row-style="{ color: '#000000', fontSize: '14px', textAlign: 'center' }"
        :span-method="arraySpanMethod"
      >
        <el-table-column prop="name" width="150" />
        <el-table-column prop="iTotalQuantity" label="总数" width="150" />
        <!-- 合并表头 -->
        <el-table-column label="电商">
          <el-table-column prop="iTATAQuantity" label="电商套数" width="120" />
          <el-table-column prop="iTATAFOSBQuantity" label="FOSB" width="120" />
          <el-table-column prop="iTATAMQuantity" label="密度" width="120" />
          <el-table-column prop="iTATADQuantity" label="多层板" width="120" />
          <el-table-column prop="iTATAGCQuantity" label="工程" width="120" />
          <el-table-column
            prop="iTATAGCQuantity"
            label="CPL(烟熏尤加利，原木直纹，梨木直纹路，棒果棕)"
            width="160"
          />
          <el-table-column prop="iTATAOverWidthQuantity" label="超宽" width="120" />
        </el-table-column>
        <el-table-column label="派的">
          <el-table-column prop="iPADCPLQuantity" label="CPL" width="120" />
          <el-table-column prop="iPADPVCQuantity" label="PVC" width="120" />
          <el-table-column prop="iPADFKPVCQuantity" label="反馈PVC" />
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onActivated,
} from 'vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
} from 'element-plus';
import { ParamsApi } from '@/api/configApi/index';
interface SpanMethodProps {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}
const ComperData=ref([]) as any
const dataValue=ref('')
const GoData=()=>{
    if (!dataValue.value) {
        ElMessage({
            type: 'info',
            message: '请选择日期',
        })
        return
    }
    GetData()
}
const stateMap={
    "1":'窗套',
    "2":'垭口',
    "3":'门套',
    '4':'特殊门套',
    "5":'磁吸门套',
    "6":'手工线',
    "7":'手工精裁',
    '8':'大自动',
    "9":'小自动1',
    "10":'小自动2',
    "11":'手工1',
    '12':'手工2'
} as any
const GetData=()=>{
    ComperData.value=[]
    let data = {
            method: 'get',
            url: `${import.meta.env.VITE_APP_DY_100_API}/api/MTTJ_Day/GetData`,
            params:{
                "dPlanDateStart":dataValue.value
            }
        }
        ParamsApi(data).then((res: any) => {
            res.data.forEach((item: any)=>{
                if(item.cType=='1'){
                    Reflect.set(item, 'name', '窗套')
                }else if(item.cType=='2'){
                    Reflect.set(item, 'name', '垭口')
                }else if(item.cType=='3'){
                    Reflect.set(item, 'name', '门套')
                }else if(item.cType=='4'){
                    Reflect.set(item, 'name', '特殊门套')
                }else if(item.cType=='5'){
                    Reflect.set(item, 'name', '磁吸门套')
                }else if(item.cType=='6'){
                    Reflect.set(item, 'name', '手工线')
                }else if(item.cType=='7'){
                    Reflect.set(item, 'name', '手工精裁')
                }else if(item.cType=='8'){
                    Reflect.set(item, 'name', '大自动')
                }else if(item.cType=='9'){
                    Reflect.set(item, 'name', '小自动1')
                }else if(item.cType=='10'){
                    Reflect.set(item, 'name', '小自动2')
                }else if(item.cType=='11'){
                    Reflect.set(item, 'name', '手工1')
                }else{
                    Reflect.set(item, 'name', '手工2')
                }
            })
            ComperData.value=res.data
        })
}
const arraySpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex
}: SpanMethodProps) => {
  if (rowIndex === 3) {
    if (columnIndex === 1) {
      return [1, 5];
    } else if ([2, 3, 4, 5].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 4) {
    if (columnIndex === 1) {
      return [1, 6];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 5) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 6) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 7) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 8) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 9) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 10) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 11) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
  if (rowIndex === 12) {
    if (columnIndex === 1) {
      return [1, 11];
    } else if ([2, 3, 4, 5,6].includes(columnIndex)) {
      return [0, 0];
    }
  }
};
</script>

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;

  .maintain_card {
    width: 100%;
    margin-bottom: 20px;
  }
  .dataPick{
    margin: 20px;
    .buton{
        margin-left: 10px;
    }
  }
}
</style>
