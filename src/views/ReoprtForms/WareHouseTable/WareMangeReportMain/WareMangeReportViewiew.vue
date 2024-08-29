<template>
  <!-- 货管报表详情 -->
  <div class="maintain">
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="left-name">
            <p>未完全入库订单数：{{ DataObj?.wwqrkdds }}</p>
            <p>生产日期：{{ DataObj?.pdate }}</p>
          </div>
          <div class="righr-name">
            <p>已入齐货位数：{{ DataObj?.yrqhws }}</p>
            <p>已入库包数：{{ DataObj?.yrkbs }}</p>
            <p>总包数：{{ DataObj?.zbs }}</p>
          </div>
        </el-col>
        <el-col :span="6" :offset="10">
          <div class="four-color">
            <div class="in-one">待入库</div>
            <div class="in-two">部分入库</div>
            <div class="in-three">全部入库</div>
            <div class="in-four">已出库</div>
          </div>
          <div class="button-colo">
            <el-button type="success" size="large" @click="RestData"
              >刷新</el-button
            >
          </div>
        </el-col>
      </el-row>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="门扇" name="first">
          <div class="master" v-for="(item, index) in ComperData" :key="index">
            <div class="Item">
              <div class="name">{{ item.name }}</div>
              <div class="master-item">
                <div
                  class="i-color"
                  v-for="(i, index) in item.data"
                  :key="index"
                >
                  <div
                    @click="ClickDialog(i)"
                    :style="{
                      background: getColorByState(i.ctype),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }"
                  >
                    <span style="font-weight: bolder">{{
                      processName(i.posname)[0]
                    }}</span>
                    <span>{{ processName(i.posname)[1] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="套/线" name="second">
          <div class="master" v-for="(item, index) in ComperData" :key="index">
            <div class="Item">
              <div class="name">{{ item.name }}</div>
              <div class="master-item">
                <div
                  class="i-color"
                  v-for="(i, index) in item.data"
                  :key="index"
                >
                  <div
                    @click="ClickDialog(i)"
                    :style="{
                      background: getColorByState(i.ctype),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }"
                  >
                    <span style="font-weight: bolder">{{
                      processName(i.posname)[0]
                    }}</span>
                    <span>{{ processName(i.posname)[1] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="挂板" name="three">
          <div class="master" v-for="(item, index) in ComperData" :key="index">
            <div class="Item">
              <div class="name">{{ item.name }}</div>
              <div class="master-item">
                <div
                  class="i-color"
                  v-for="(i, index) in item.data"
                  :key="index"
                >
                  <div
                    @click="ClickDialog(i)"
                    :style="{
                      background: getColorByState(i.ctype),
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'column'
                    }"
                  >
                    <span style="font-weight: bolder">{{
                      processName(i.posname)[0]
                    }}</span>
                    <span>{{ processName(i.posname)[1] }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :objData="objData"
      :modeCode="objModeCode"
      :disabled="disabled"
      :Trow="Trow"
      @FmodelClose="modelClose"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  reactive,
  nextTick,
  computed,
  watch,
  onActivated,
  provide
} from 'vue';
import { ElLoading } from 'element-plus';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { configApi, DataApi, delApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { useRoute, useRouter } from 'vue-router';
import Odialog from '@/components/DialogModel/index.vue';
import type { TabsPaneContext } from 'element-plus';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import useStore from '@/store';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const router = useRouter();
const { tagsView, permission } = useStore();
const initType = ref(true);
const row = ref();
const rowId = ref('') as any;
onActivated(() => {
  // modelCode.value = history.state.modelCode?history.state.modelCode:Route.meta.ModelCode
  Route.meta.ModelCode = history.state.modelCode
    ? history.state.modelCode
    : Route.meta.ModelCode;
  Route.meta.title = history.state.title
    ? history.state.title
    : Route.meta.title;
  tagsView.updateVisitedView(Route);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // if( rowId.value != Route.params.rowId){
  //     getAddUser(Route.meta.ModelCode)
  // }
  rowId.value = JSON.parse(Route.params.rowId as any).UID;
  row.value = JSON.parse(Route.params.rowId as any);
  GetData();
  initType.value = false;
});
//弹窗数据
const ZZdialogFormVisible = ref(false);
const title = ref('优化');
const disabled = ref(false);
const Trow = ref({});
const objData = ref({});
const objModeCode = ref('');
//新增/编辑/详情弹窗
const modelClose = (v: any) => {
  ZZdialogFormVisible.value = v.type;
};
const dataTypeParam = ref(1);
//标签页切换
const activeName = ref('first');
const processName = name => {
  if (!name) return ['', ''];
  if (!name.includes('(')) {
    return [name, ''];
  }
  const [first, second] = name.split('(');
  return [first, '(' + second];
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.props.label == '门扇') {
    dataTypeParam.value = 1;
    GetData();
  }
  if (tab.props.label == '套/线') {
    dataTypeParam.value = 2;
    GetData();
  }
  if (tab.props.label == '挂板') {
    dataTypeParam.value = 3;
    GetData();
  }
};

const getColorByState = (state: string) => {
  switch (state) {
    case '待入库':
      return '#f55a5a';
    case '部分入库':
      return '#ecba78';
    case '全部入库':
      return '#89f389';
    case '已出库':
      return '#87ceeb';
    default:
      return 'yellow';
  }
};
const ComperData = ref([]) as any;
const DataObj = ref({}) as any;
const loading = ref(false);
const GetData = () => {
  if (loading.value) return;
  loading.value = true;
  ComperData.value = [];
  let data = {
    method: 'POST',
    url: import.meta.env.VITE_APP_DY_100_API + `/api/Package/GetPosReport_S`,
    data: {
      pdate: row.value.PDate,
      cProductType: dataTypeParam.value
    }
  };
  DataApi(data)
    .then((res: any) => {
      DataObj.value = res.data;
      res.data.list_Body.forEach((item: any) => {
        let index = ComperData.value.findIndex(
          (i: any) => i.name === item.cLogisticsName
        );
        if (index === -1) {
          ComperData.value.push({
            name: item.cLogisticsName,
            data: [item]
          });
        } else {
          ComperData.value[index].data.push(item);
        }
      });
    })
    .finally(() => (loading.value = false));
};

const RestData = () => {
  ComperData.value = [];
  GetData();
};

const tableAxios = () => {};

provide('tableAxios', { tableAxios });

const ClickDialog = (i: any) => {
  disabled.value = false;
  ZZdialogFormVisible.value = true;
  Trow.value = i;
  title.value = '详情';
  objModeCode.value = 'MES.PosReport_S_S.M.List';
};
</script>
<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  .left-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .righr-name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .four-color {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    .in-one {
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgb(245, 90, 90);
    }
    .in-two {
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgb(236, 186, 120);
    }
    .in-three {
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: rgb(137, 243, 137);
    }
    .in-four {
      width: 80px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: skyblue;
    }
  }
  .button-colo {
    float: right;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .master {
    border: 1px solid black;
    width: 100%;
    height: 100%;
    .Item {
      display: flex;
      justify-content: start;
      .name {
        width: 7%;
        margin-top: 10px;
        word-wrap: break-word;
      }
      .master-item {
        display: flex;
        flex-wrap: wrap;
        .i-color {
          width: 100px;
          height: 50px;
          text-align: center;
          margin-bottom: 1%;
          margin: 5px;
          transition: transform 500ms ease 0s;
        }
        .i-color:hover {
          transform: scale(1.08);
          color: #fff;
        }
      }
    }
  }
}
</style>
