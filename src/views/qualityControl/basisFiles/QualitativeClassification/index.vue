<template>
  <!-- 故障档案页面 -->
  <div class="maintain">
    <el-card style="margin-right: 10px">
      <div class="treeSty" style="width: 300px">
        <leftTree
          ref="treeRef"
          :treeData="treeData"
          :treeFormDatas="treeFormDatas"
          :nodeKey="'cParmValueClassCode'"
          :label="'cParmValueClassName'"
          :childType="'Child'"
          @clickTree="clickTree"
          @clickTreeTwo="clickTreeTwo"
          @ClickSearch="treeClickSearch"
          @resetForm="treeresetForm"
        ></leftTree>
      </div>
    </el-card>
    <div style="flex: 1" class="m_main">
      <!-- 多包一层，解决窗口缩放时无法自适应的问题 -->
      <div class="m_con">
        <!-- 搜索区域3 -->
        <FilterForm
          :Filter="Filter"
          @ClickSearch="ClickSearch"
          @resetForm="resetForm"
        >
        </FilterForm>
        <el-card style="min-height: 500px">
          <Head-View
            :Head="head"
            :row="row"
            :rowId="rowId"
            ref="headRef"
            :disabled="true"
            :dialogFormVisible="dialogFormVisible"
          ></Head-View>
          <!-- 按钮区域 -->
          <div v-show="But.length">
            <ButtonViem
              :ToolBut="But"
              @clickAdd="clickAdd"
              @clickStart="Start"
              @clickDelete="clickDel"
              @AddIncludMode="AddIncludMode"
            ></ButtonViem>
          </div>
          <!-- 表格区域 -->
          <myTable
            ref="TabRef"
            v-if="tabType"
            :tableData="tableData"
            :tableColumns="tableColumns"
            :tableBorder="true"
            :selection="true"
            :tableHeight="'590px'"
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
                    v-for="(item, int) in tableButton"
                    :key="item.Resource.cAttributeName"
                  >
                    <el-button
                      v-if="int == 0 || int == 1"
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
                          v-for="item in tableButton.slice(2)"
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
          </myTable>
          <pagination
            v-if="total > 0"
            :total="total"
            v-model:page="queryParams.PageIndex"
            v-model:limit="queryParams.PageSize"
            @pagination="changPage"
          />
        </el-card>
      </div>
    </div>
    <!-- 弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :objData="objData"
      :objTree="treeNodeValue"
      :modeCode="objModeCode"
      :disabled="disabled"
      :row="Trow"
      :viewdata="viewdata"
      :treeMethod="treeAxios"
      @FmodelClose="modelClose"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, provide } from 'vue';
import leftTree from '@/components/left_tree/index.vue';
import HeadView from '@/components/ViewFormHeard/index.vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import Odialog from '@/components/DialogModel/index.vue';
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import { configApi, DataApi, delApi, ParamsApi } from '@/api/configApi/index';
import { sessionStorage } from '@/utils/storage';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const Route = useRoute();
const router = useRouter();
let Filter = ref([]) as any;
let But = ref([]) as any;
const loading = ref(false);
const zhezhaoType = ref(false);
// 表格配置数据
const TabRef = ref();
const headRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const viewdata = ref({}) as any;
const tabType = ref(true);
const treeData = ref([]);
const treeFormDatas = ref([]) as any;
const treeChangeData = ref([]) as any;
const ClickSearchVal = ref([]) as any;
//弹窗数据
const ZZdialogFormVisible = ref(false);
const title = ref('优化');
const ZZBut = ref([]) as any;
const head = ref([]) as any;
const rowId = ref('') as any;
const dialogFormVisible = ref(false);
const ZZFormData = ref([]) as any;
const ruleForm = ref();
const disabled = ref(false);
const row = ref({}) as any;
const Trow = ref({});
const Tworow = ref({});
const objData = ref({});
const Level = ref('') as any;
const TreeAxiosData = ref({}) as any;
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//总条数
const total = ref(0);
//表格数据
const tableData = ref([] as any);
//树配置数据
const defaultProps = {
  children: 'Items',
  label: 'cValue'
};
const treeRef = ref();
const treeRef22 = ref();
const checkedData = ref([]) as any;
//启用传递的UID
const sendId = ref([]) as any;
const ModelCode = ref();
const sendMID = ref('');
const sendUID = ref('');
const initType = ref(true);
const TreeType = ref(false);
const objModeCode = ref('');
const cValue = ref('');
const funHeight = () => {
  return window.innerHeight - 210 + 'px';
};
onActivated(() => {
  //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let val = window.sessionStorage.getItem('clickSider')
    ? JSON.parse(window.sessionStorage.getItem('clickSider'))
    : '';

  if (val == Route.name) {
    initType.value = false;
    BothDelay();
  }
  if (initType.value) {
    BothDelay();
  }
  initType.value = false;
});
const BothDelay = async () => {
  await getData(Route.meta.ModelCode);
};
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'BomDoorInfo') {
      tableAxios();
    }
  }, 300);
});
// tree的加载
const treeNodeValue = ref('') as any;
const TwotreeNodeValue = ref() as any;

const clickTree = (node: any) => {
  console.log(node, '--==node');
  row.value = node;

  treeNodeValue.value = node;
  Level.value = node.Level; //级别
  Conditions.value = '';
  OrderByFileds.value = '';
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  TreeType.value = false;
  // code有数据才显示
  if (treeNodeValue.value.cModelCode) {
    if (tableData.value.length) {
      TabRef.value.handleRemoveSelectionChange();
    }
    getData(treeNodeValue.value.cModelCode);
  } else {
    // Filter.value = [];
    // But.value = [];
    // head.value=[]
    // tableColumns.value = [];
    // tableButton.value = [];
    // tableData.value = [];
    // total.value=0
    // 定性质分类档案的特殊逻辑处理
    tableAxios();
  }
};
const clickTreeTwo = (node: any) => {
  // rowId.value=node.UID
  // TwotreeNodeValue.value=node
  // Level.value=66
  // row.value=node
  // row.value.Level=66
  // // Level.value=node.Level //级别
  // // code有数据才显示
  // if(TwotreeNodeValue.value.cModelCode){
  //     if(tableData.value.length){
  //         TabRef.value.handleRemoveSelectionChange();
  //     }
  //     getData(TwotreeNodeValue.value.cModelCode)
  // }
};
const treeClickSearch = async (v: any) => {
  console.log(v.value, '===tree');

  if (v.value.cParmValueClassName) {
    TreeType.value = false;
    cValue.value = v.value.cParmValueClassName;
    treeRef.value.clearTree();
    Level.value = '';
    Conditions.value = '';
    OrderByFileds.value = '';
    queryParams.PageIndex = 1;
    queryParams.PageSize = 20;
    treeAxios();
    BothDelay();
  }
};
const treeresetForm = async (v: any) => {
  TreeType.value = false;
  cValue.value = '';
  treeRef.value.clearTree();
  Level.value = '';
  Conditions.value = '';
  OrderByFileds.value = '';
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  ClickSearchVal.value = [];
  treeNodeValue.value = '';
  treeAxios();
  BothDelay();
};
//调取接口
const getData: any = async (val: string) => {
  try {
    if (!val) {
      return false;
    }
    ElLoading.service({ lock: true, text: '加载中.....' });

    head.value = [];
    Filter.value = [];
    But.value = [];

    const res = await configApi(val);
    if (res.status == 200) {
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      tableColumns.value = [];
      tableData.value = [];
      total.value = 0;
      console.log(Level.value, '--- Level.value');

      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Filter') {
          Filter.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          head.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          But.value = item[import.meta.env.VITE_APP_key].sort(
            compare('iIndex', true)
          );
        }

        if (item.cPropertyClassTypeCode == 'Tree') {
          TreeType.value = false;
          treeFormDatas.value = item[import.meta.env.VITE_APP_key].filter(
            (item: any) => {
              return item.Resource.cAttributeTypeCode !== 'binddata';
            }
          );
          item[import.meta.env.VITE_APP_key].forEach((item: any) => {
            if (item.Resource.cAttributeCode == 'TreeData') {
              TreeAxiosData.value = item;
              treeAxios();
            }
          });
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
        }
      });
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
    ElLoading.service().close();
  }
};

//获取树结构数据
const treeAxios = () => {
  let data = {
    method: TreeAxiosData.value.Resource.cHttpTypeCode,
    url:
      TreeAxiosData.value.Resource.cServerIP +
      TreeAxiosData.value.Resource.cUrl,
    params: { cValue: cValue.value }
  };
  ParamsApi(data).then(res => {
    if (res.status == 200) {
      treeData.value = res.data || [];
    } else {
      console.log('请求出错');
    }
  });
};

// provide('treeAxios', { treeAxios })

let checkedD = ref(null as any);
// 树变化
const ParentCode = ref('');
const treeChange = (datas: any, checked: any, indeterminate: any) => {
  //树结构单选处理
  if (checked && checkedD.value !== datas.UID) {
    checkedD.value = datas.UID;
    treeRef.value.setCheckedNodes([datas]);
    //拿取code,调接口，表格数据
    let data = treeRef.value.getCheckedNodes();
    console.log(data[0], 'data0000');

    ParentCode.value = data[0].cFaultClassCode;
    if (ParentCode.value) {
      tableAxios();
    }
  } else {
    //取消选中
    checkedD.value = null;
    treeRef.value.setCheckedNodes([]);
    ParentCode.value = '';
    checkedData.value = [];
    //取消选中，不再重新获取右侧表格数据---修改--
    BothDelay();
  }
};

// table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      if (item.IsShow) {
        let itemData = {
          checkType: true,
          label: item.cShowName ?? item.Resource.cAttributeName,
          prop: item.Resource.cAttributeCode,
          headerSlot: true,
          slot: '',
          lock: false,
          filters: []
        };
        tableColumns.value.push(itemData);
      }
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
  loading.value = true;
  console.log(treeNodeValue.value, '---treeNodeValue.value');
  // let tt={
  //     cAttributeCode:"cParentCode",
  //     cAttributeCodeValue:treeNodeValue.value.cParmValueClassCode?treeNodeValue.value.cParmValueClassCode:'',
  //     cConditions:"="
  // }
  // ClickSearchVal.value.push(tt)
  Conditions.value = filterModel(ClickSearchVal.value);
  let conditions = [];
  if (Conditions.value) {
    conditions.push(Conditions.value);
  }
  if (treeNodeValue.value.cParmValueClassCode) {
    conditions.push('cParentCode = ' + treeNodeValue.value.cParmValueClassCode);
  }
  let obj: any = {
    OrderByFileds: OrderByFileds.value,
    Conditions: conditions.join(' && ')
  };
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: obj
  };

  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      loading.value = false;
      tableData.value = res.data.data;

      tablefilter();
      TabRef.value.handleRemoveSelectionChange();
      ElLoading.service().close();
      treeAxios();
    } else {
      loading.value = false;
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
};
provide('tableAxios', { tableAxios });
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
// table  排序
const tableHearData = (val: any) => {
  OrderByFileds.value = tableSortModel(val.value);
  tableColumns.value = val.value;
  tableAxios();
};
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  console.log(event.cAttributeCode, '--event.cAttributeCode');

  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'Edit':
      clickEditTable(scope, event);
      break;
    case 'Stop':
      clickStop(scope, event);
      break;
    case 'SetProject':
      SetProject(scope, event);
      break;
    case 'Delete':
      clickDelete(scope, event);
      break;
    case 'Copy':
      clickCopy(scope, event);
      break;
    default:
      break;
  }
};
//多选获取UID
const SElectdATA = ref([]) as any;
const handleSelectionChange = (arr: any) => {
  SElectdATA.value = arr;
};
//按钮删除
const clickDel = (obj: any) => {
  console.log(2323);

  sendId.value = [];
  SElectdATA.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
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
          tableAxios();
          sendId.value = [];
          TabRef.value.handleRemoveSelectionChange();
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
//新增/编辑/详情弹窗
const modelClose = (v: any) => {
  ZZdialogFormVisible.value = v.type;
  BothDelay();
};
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'BomDoorInfoCLView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'BomDoorInfo',
      title: '策略详情'
    }
  });
};
//表格按钮编辑
const clickEditTable = (scope: any, obj: any) => {
  disabled.value = false;
  Trow.value = scope.row;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  title.value = '编辑';
  objModeCode.value = obj.cIncludeModelCode;
};
//表格按钮停用
const clickStop = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  DataApi(data).then(res => {
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '停用成功'
      });
      tableAxios();
    } else {
      ElMessage.error('停用失败');
    }
  });
};
// 删除
const clickDelete = (scope: any, obj: any) => {
  ElMessageBox.confirm('确认删除？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const senid = scope.row.UID;
      let data = {
        method: obj.Resource.cHttpTypeCode,
        url: obj.Resource.cServerIP + obj.Resource.cUrl,
        data: [senid]
      };
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '删除成功'
          });
          tableAxios();
        } else {
          ElMessage.error(res.msg || '删除失败');
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      });
    });
};
// 复制
const clickCopy = (scope: any, obj: any) => {
  if (!obj.Resource.cUrl) return false;
  ElMessageBox.confirm('确认复制？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const senid = scope.row.UID;

      let data = {
        method: obj.Resource.cHttpTypeCode,
        url: obj.Resource.cServerIP + obj.Resource.cUrl,
        data: [senid]
      };
      DataApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '复制成功'
          });
          tableAxios();
        } else {
          ElMessage.error(res.msg || '复制失败');
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消'
      });
    });
};
//维护方案
const SetProject = (scope: any, obj: any) => {
  router.push({
    name: 'addFile',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'equipmentError',
      title: '维护方案'
    }
  });
};

//按钮新增
const clickAdd = (obj: { cIncludeModelCode: any }) => {
  //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  viewdata.value = headRef.value.ruleForm;
  disabled.value = false;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  title.value = '新增分类';
  objModeCode.value = obj.cIncludeModelCode;
};
//按钮新增
const AddIncludMode = (obj: any) => {
  //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.sessionStorage.setItem(
    'BomThrObj',
    JSON.stringify(headRef.value.ruleForm)
  );
  disabled.value = false;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  title.value = '新增引用类型';
  objModeCode.value = obj.cIncludeModelCode;
};

//启用按钮
const Start = (obj: any) => {
  sendId.value = [];
  SElectdATA.value.forEach((item: { UID: any }) => sendId.value.push(item.UID));
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
  DataApi(data).then(res => {
    if (res.status == 200) {
      tableAxios();
      TabRef.value.handleRemoveSelectionChange();
      ElMessage({
        type: 'success',
        message: '启用成功'
      });
      sendId.value = [];
    } else {
      console.log('启用出错了');
    }
  });
};

const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: ''
});
const { Conditions, OrderByFileds } = toRefs(data);
// 搜索
const ClickSearch = (val: any) => {
  queryParams.PageIndex = 1;
  ClickSearchVal.value = val.value;
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
  ClickSearchVal.value = [];
  treeNodeValue.value = '';
  treeRef.value.clearTree();
  tableAxios();
  TabRef.value.clearFilter();
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

<style scoped lang="scss">
.maintain {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;
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
}

.maintain .selectSty {
  width: 233px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
.m_main {
  position: relative;
  .m_con {
    position: absolute;
    width: 100%;
  }
}
.treeSty {
  display: flex;
}
</style>
