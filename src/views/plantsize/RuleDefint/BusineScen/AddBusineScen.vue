<template>
  <!-- 业务方案档案编辑新增页面 -->
  <div class="maintain">
    <!-- <FilterForm v-if="Route.query.title == '业务方案档案关联'" :Filter="Filter" @ClickSearch="ClickSearch"
            @resetForm="resetForm"></FilterForm> -->
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          :ToolBut="But"
          @clickAdd="clickAdd"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @clickStart="Start"
          @clickDelete="clickDel"
        ></ButtonViem>
      </div>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        :MID="MID"
        ref="headRef"
        :disabled="disabled"
        :dialogFormVisible="dialogFormVisible"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 表格区域 -->
      <!-- <div style="float:right;margin:10px 0"  >
                <el-button type="primary" size="small" :disabled="disabled"  @click="clickTableAdd()">添加</el-button>
            </div> -->
      <myTable
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
              <!-- <el-button v-if="Route.query.title !== '业务方案档案关联'" type="primary" :disabled="disabled"
                                size="small" @click="clickTableHandDel(scope)">删除</el-button> -->
              <template
                v-for="(item, idx) in tableButton"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  v-if="idx < (tableButton.length > 3 ? 2 : 3)"
                  type="primary"
                  size="small"
                  @click="clickBtn(scope, item)"
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
                        @click="clickBtn(scope, item)"
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
      <pop-model
        :dialogFormVisible="dialogFormVisible"
        :title="modelTitle"
        :modelCIncludeModelCode="modelCIncludeModelCode"
        :modelGridType="modelGridType"
        :modelGrid="modelGrid"
        @modelClose="modelClose"
        @clickHandAdd="clickHandAdd"
      ></pop-model>
    </el-card>
    <!-- 关联新增/编辑/详情弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :Btn="ZZBut"
      :FormData="ZZFormData"
      :ruleForm="ruleForm"
      :disabled="disabled"
      :row="row"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  reactive,
  nextTick,
  onActivated,
  provide,
  onMounted
} from 'vue';
import myTable from '@/components/MyFormTable/index.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import PopModel from '@/components/PopModel/model.vue';
import { configApi, ParamsApi, DataApi, delApi } from '@/api/configApi/index';
import { useRoute, useRouter } from 'vue-router';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import Odialog from './components/orgDialog.vue';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import useStore from '@/store';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const modelCode = ref();
const router = useRouter();
let Filter = ref([]) as any;
const row = ref();
const rowId = ref('') as any;
const MID = ref();
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
const tabType = ref(true);
const tableColumns = ref([]) as any;
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
const TabRef = ref();
const tableButton = ref([]) as any;
//新增/编辑/详情弹框数据
const ZZdialogFormVisible = ref(false);
const ZZFormData = ref([]) as any;
const ZZBut = ref([]) as any;
const TiaoJian = ref([]) as any;
const title = ref('');
const ruleForm = ref();
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  disabled: false,
  dialogFormVisible: false,
  modelTitle: '标题',
  modelCIncludeModelCode: ''
});
const {
  disabled,
  dialogFormVisible,
  modelTitle,
  modelCIncludeModelCode,
  Conditions,
  OrderByFileds
} = toRefs(data);
let head = ref([]) as any;
const initType = ref(true);
onActivated(() => {
  modelCode.value = history.state.modelCode
    ? history.state.modelCode
    : Route.meta.ModelCode;
  Route.meta.ModelCode = history.state.modelCode
    ? history.state.modelCode
    : Route.meta.ModelCode;
  Route.meta.title = history.state.title
    ? history.state.title
    : Route.meta.title;
  tagsView.updateVisitedView(Route);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // getAddUser(Route.meta.ModelCode)
  // if(initType.value){
  //     getAddUser(Route.meta.ModelCode)
  // }
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }

  rowId.value = Route.params.rowId;
  initType.value = false;
  if (history.state.MID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    MID.value = JSON.parse(history.state.MID);
  }
  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (Route.meta.title.match(/详情/gi)) {
    disabled.value = true;
  }
});
const treeObj = ref({});
onMounted(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  treeObj.value = JSON.parse(window.sessionStorage.getItem('BusineScen'));
});
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'AddBusineScen') {
      tableAxios();
    }
  }, 300);
});
// 权限按钮
const RoleBut = (v: any) => {
  let ToolData = head.value.filter((BItem: any) => {
    return BItem.cAttributeCode == 'Tool';
  });
  if (ToolData.length) {
    let dataVal = {
      method: ToolData[0].Resource.cHttpTypeCode,
      url: ToolData[0].Resource.cServerIP + ToolData[0].Resource.cUrl,
      data: v
    };
    DataApi(dataVal).then((res: any) => {
      if (res.data.cPropertyClassTypeCode == 'ToolBut') {
        But.value = res.data[import.meta.env.VITE_APP_key].sort(
          compare('iIndex', true)
        );
      }
    });
  }
};
const getAddUser = async (code: any) => {
  TiaoJian.value = [];
  try {
    const res = await configApi(code);
    if (res.status == 200) {
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          head.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
          TiaoJian.value = head.value
            .filter((item: any) => item.cAttributeName == '条件表达式')
            .sort(compare('iIndex', true));
        }
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
  if (history.state.title !== '业务方案档案关联') {
    modelGrid.value = arr;
  }
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
      if (history.state.title !== '业务方案档案关联') {
        tableColumns.value.push({
          checkType: true,
          label: '操作',
          slotName: 'button'
        });
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
    }
    if (
      item.Resource.cAttributeTypeCode == 'method' &&
      Route.query.title == '业务方案档案关联'
    ) {
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
      if (Route.query.title == '业务方案档案关联') {
        tableDataAxios();
      } else {
        tableAxios();
      }
    }
  });
};
//表格数据查询
const tableDataAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
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
provide('tableDataAxios', { tableDataAxios });
//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      val: rowId.value
    }
  };
  // return false
  try {
    const res = await ParamsApi(data);
    if (res.status == 200) {
      tableData.value = res.data;
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
const sendId = ref([]) as any;
//多选获取UID
const handleSelectionChange = (arr: any) => {
  arr.forEach((item: { UID: any }) => sendId.value.push(item.UID));
};
//按钮删除
const clickDel = (obj: any) => {
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要删除的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  ElMessageBox.confirm('确定删除数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '删除数据成功'
          });
          tableDataAxios();
          TabRef.value.handleRemoveSelectionChange();
          sendId.value = [];
        } else {
          console.log('删除失败');
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      });
    });
};
//关联新增按钮，弹窗
const clickAdd = async (obj: { cIncludeModelCode: any }) => {
  ZZdialogFormVisible.value = true;
  title.value = '关联新增';
  const res = await configApi(obj.cIncludeModelCode);
  if (res.status === 200) {
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'Head') {
        item[import.meta.env.VITE_APP_key].map((item: any) => {
          item.Resource[item.Resource.cAttributeCode] = '';
        });
        ZZFormData.value = item[import.meta.env.VITE_APP_key];
      }
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        ZZBut.value = item[import.meta.env.VITE_APP_key];
      }
    });
  }
};
//表格按钮编辑
const clickEditTable = async (scope: any, obj: any) => {
  row.value = scope.row;
  ZZdialogFormVisible.value = true;
  title.value = '关联编辑';
  disabled.value = false;
  const res = await configApi(obj.cIncludeModelCode);
  if (res.status === 200) {
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'Head') {
        item[import.meta.env.VITE_APP_key].map((item: any) => {
          item.Resource[item.Resource.cAttributeCode] = '';
        });
        ZZFormData.value = item[import.meta.env.VITE_APP_key];
      }
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        ZZBut.value = item[import.meta.env.VITE_APP_key];
      }
    });
  }
};
//表格按钮详情
const clickViews = async (scope: any, obj: any) => {
  row.value = scope.row;
  ZZdialogFormVisible.value = true;
  title.value = '关联详情';
  disabled.value = true;
  const res = await configApi(obj.cIncludeModelCode);
  if (res.status === 200) {
    res.data.forEach((item: any) => {
      if (item.cPropertyClassTypeCode == 'Head') {
        item[import.meta.env.VITE_APP_key].map((item: any) => {
          item.Resource[item.Resource.cAttributeCode] = '';
        });
        ZZFormData.value = item[import.meta.env.VITE_APP_key];
      }
      if (item.cPropertyClassTypeCode == 'ToolBut') {
        ZZBut.value = item[import.meta.env.VITE_APP_key];
      }
    });
  }
};
//表格按钮停用
const clickStops = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      console.log('成功');
      tableDataAxios();
    } else {
      console.log('失败');
    }
  });
};
// table 按钮 集合
const clickTableHandDel = (val: any) => {
  tableData.value.splice(val.$index, 1);
  // total.value=total.value-1
};

const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  // total.value=total.value+1
};

const clickBtn = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'View':
      clickViews(scope, event);
      break;
    case 'Edit':
      clickEditTable(scope, event);
      break;
    case 'Stop':
      clickStops(scope, event);
      break;
    default:
      break;
  }
};
// 添加
const clickAddConvert = (val: any) => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
  modelCIncludeModelCode.value = val.cIncludeModelCode;
};
const modelClose = (val: any) => {
  dialogFormVisible.value = val.type;
};
//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'BusineScen';
  obj.tableData = tableData.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'BusineScen';
  obj.tableData = tableData.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;

  $bus.emit('TabTitleVal', { name: Route.name, title: '业务档案编辑' });
};
//启用按钮
const Start = (obj: any) => {
  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选要启用的数据'
    });
    return;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  // DataApi(data).then(res => {
  //     if (res.status == 200) {
  //         tableDataAxios()
  //         TabRef.value.handleRemoveSelectionChange()
  //         ElMessage({
  //             type: 'success',
  //             message: '启用成功',
  //         })
  //         sendId.value=[]
  //     } else {
  //         console.log('启用出错了');
  //     }
  // })
};
// table  排序
const tableHearData = (val: any) => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  tableDataAxios();
};
// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
    tableDataAxios();
  });
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
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableDataAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  tableDataAxios();
  TabRef.value.clearFilter();
};
// 恢复
const renew = () => {
  // getData(Route.meta.ModelCode)
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

    :deep(.el-card__body) {
      display: flex;
      justify-content: space-between;

      .search_main {
        flex: 1;

        :deep(.el-form) {
          width: 100%;
        }
      }

      .search_but {
        width: 180px;
      }
    }
  }

  .bot-btn {
    margin: 20px 0;
  }
}

.maintain .selectSty {
  width: 233px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
