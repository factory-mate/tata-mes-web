<script lang="ts">
export default { name: 'Dashboard' };
</script>

<script setup lang="ts">
// 组件引用
import SvgIcon from '@/components/SvgIcon/index.vue';
import BarChart from './components/Chart/BarChart.vue';
import PieChart from './components/Chart/PieChart.vue';
import RadarChart from './components/Chart/RadarChart.vue';
import panelMain from './components/Chart/panel.vue';
import BaseChart from './components/Chart/BaseChart.vue';
import TwoBaseChart from './components/Chart/TwoBaseChart.vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import myPopup from '@/components/Popup/index.vue';
import { filterModel, tableSortModel, tableSortInit } from '@/utils';
import {
  ref,
  toRefs,
  reactive,
  nextTick,
  computed,
  watch,
  onMounted
} from 'vue';
import type { TabsPaneContext } from 'element-plus';
import { configApi, ParamsApi, DataApi, delApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
const Route = useRoute();
const router = useRouter();
let Filter = ref([]) as any;
let But = ref([]) as any;
// 表格配置数据
const TabRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const tabType = ref(true);
const tabKey = ref(0);
const activeName = ref('first');
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: ''
});
const { dialogV, dialogTitle, Conditions, OrderByFileds } = toRefs(data);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//总条数
const total = ref(0);
//表格数据
const tableData = ref([] as any);
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};

//调取接口
const getData: any = async (val: string) => {
  try {
    const res = await configApi(val);
    if (res.status == 200) {
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key];
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          But.value = item[import.meta.env.VITE_APP_key];
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(item[import.meta.env.VITE_APP_key]);
        }
      });
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
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
      tableAxios();
    }
  });
};
//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  try {
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
  } catch (error) {
    console.log(error, '程序出错');
  }
};
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  // switch (event.cAttributeCode) {
  //     case "View":
  //         clickView(scope, event)
  //         break;
  //     case "Edit":
  //         clickEditTable(scope, event)
  //         break;
  //     case "Stop":
  //         clickStop(scope, event)
  //         break;
  //     default:
  //         break;
  // }
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
//table多选
const handleSelectionChange = (arr: any) => {
  console.log(arr);
};
// table  排序
const tableHearData = (val: any) => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  tableAxios();
};
// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
    tableAxios();
  });
};
// 恢复
const renew = () => {
  getData(Route.meta.ModelCode);
};
</script>

<template>
  <div class="dashboard-container">
    <!-- 数据 -->
    <el-row :gutter="40" class="card-panel__col">
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <div class="card-panel card_one">
          <div class="card-panel-icon-wrapper icon-user">
            <svg-icon icon-class="uv" size="4em" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">访问数</div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <div class="card-panel card_two">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" size="4em" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">消息数</div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <div class="card-panel card_thr">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" size="4em" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">故障</div>
            <div class="card-panel-num">0</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="6" class="card-panel__col">
        <div class="card-panel card_four">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="shopping" size="4em" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">订单数</div>
            <div class="card-panel-num">1000</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!----------------- 标签页切换 -------------------->
    <el-row :gutter="40">
      <el-col :sm="24" :lg="24" class="card-panel__col">
        <el-tabs
          v-model="activeName"
          type="card"
          class="demo-tabs"
          @tab-click="handleClick"
        >
          <el-tab-pane label="图形统计" name="first">
            <div class="twoChart">
              <BaseChart
                id="BaseChart"
                height="400px"
                width="100%"
                class="chart-container"
              ></BaseChart>
              <TwoBaseChart
                id="twoBaseChart"
                height="400px"
                width="100%"
                class="chart-container"
              ></TwoBaseChart>
            </div>
          </el-tab-pane>
          <el-tab-pane label="库存预警" name="second">
            <!--------- 表格 ----------->
            <MyTable
              ref="TabRef"
              v-if="tabType"
              :tableData="tableData"
              :tableColumns="tableColumns"
              :tableBorder="true"
              :selection="true"
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
            </MyTable>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

    <!-- Echarts 图表 -->
    <el-row :gutter="40" style="margin-top: 20px">
      <el-col :sm="24" :lg="8" class="card-panel__col">
        <BarChart
          id="barChart"
          height="400px"
          width="100%"
          class="chart-container"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="card-panel__col">
        <PieChart
          id="pieChart"
          height="400px"
          width="100%"
          class="chart-container"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="card-panel__col">
        <RadarChart
          id="radarChart"
          height="400px"
          width="100%"
          class="chart-container"
        />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  padding: 24px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
    z-index: 99;
  }

  .box-center {
    margin: 0 auto;
    display: table;
  }

  .user-profile {
    .box-center {
      padding-top: 10px;
    }

    .user-role {
      padding-top: 10px;
      font-weight: 400;
      font-size: 14px;
    }

    .box-social {
      padding-top: 30px;

      .el-table {
        border-top: 1px solid #dfe6ec;
      }
    }

    .user-follow {
      padding-top: 20px;
    }
  }

  .card-panel__col {
    margin-bottom: 12px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    .icon-message {
      color: #36a3f7;
    }

    .icon-user {
      color: #40c9c6;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-user {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px 20px 0;

      .card-panel-text {
        line-height: 18px;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
        text-align: right;
      }
    }
  }

  .card_one {
    background-color: #f4516c;
    color: #fff;
  }

  .card_two {
    background-color: #25d73c;
    color: #fff;
  }

  .card_thr {
    background-color: #40c9c6;
    color: #fff;
  }

  .card_four {
    background-color: #58e4c4;
    color: #fff;
  }

  .chart-container {
    background: #ffffff;
  }
  .twoChart {
    display: flex;
    justify-content: space-between;
  }
}
</style>
