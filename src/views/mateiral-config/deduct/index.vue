<template>
  <!-- 业务方案档案页面 -->
  <div class="maintain">
    <el-card
      style="
        min-width: 220px;
        width: 20%;
        margin-right: 10px;
        max-height: calc(100vh - 125px);
        overflow-y: auto;
      "
    >
      <el-tree
        :data="treeData"
        show-checkbox
        ref="treeRef"
        node-key="UID"
        check-strictly
        :highlight-current="true"
        :props="defaultProps"
        :default-expanded-keys="checkedData"
        :default-checked-keys="checkedData"
        @check="treeChange"
        :check-on-click-node="true"
      />
    </el-card>
    <div style="width: 80%">
      <!-- 搜索区域 -->
      <FilterForm
        :Filter="Filter"
        @ClickSearch="ClickSearch"
        @resetForm="resetForm"
      >
      </FilterForm>
      <el-card>
        <!-- 按钮区域 -->
        <ButtonViem
          :ToolBut="But"
          @clickAdd="clickAdd"
          @ExportAll="ExportAll"
          @ExportOne="ExportOne"
          @clickStart="Start"
          @clickDelete="clickDel"
        ></ButtonViem>
        <!-- 表格区域 -->
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
                <template
                  v-for="(item, idx) in tableButton"
                  :key="item.Resource.cAttributeName"
                >
                  <el-button
                    v-if="idx < (tableButton.length > 3 ? 2 : 3)"
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
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, onMounted } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
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
// 表格配置数据
const TabRef = ref();
const tableColumns = ref([]) as any;
const tableButton = ref([]) as any;
const AxiosData = ref({}) as any;
const treeAxiosData = ref({}) as any;
const tabType = ref(true);
const treeData = ref([]);
const treeChangeData = ref([]);
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
  children: 'Child',
  label: 'PNAME'
};
const treeRef = ref();
const checkedData = ref([]) as any;
//启用传递的UID
const sendId = ref([]) as any;
const ModelCode = ref();
const sendMID = ref('');
const sendUID = ref('');

onMounted(() => {
  BothDelay();
});

onActivated(() => {});

// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'RuleAudit') {
      tableAxios();
      treeAxios(treeAxiosData.value);
    }
  }, 1000);
});
const BothDelay = async () => {
  //第一次进入页面，调取页面总数据(调取树数据)
  await getData(Route.meta.ModelCode);
  //调取本地存储的（选中的树结构）,树数据回显
  if (sessionStorage.get('ModelCode')) {
    let code = sessionStorage.get('ModelCode');
    if (code.Child.length) {
      sendMID.value = code.Child[0].MID;
      //新增时需要UID
      sendUID.value = code.UID;
    } else {
      sendMID.value = code.UID;
      sendUID.value = code.UID;
    }
    checkedData.value.push(code.UID);
    await getData(code.cModelCode);
  }
};
//调取接口
const getData: any = async (val: string) => {
  if (!val) return false;
  // try {
  await configApi(val).then((res: any) => {
    if (res.status == 200) {
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      if (res.data.length == 0) {
        ElMessageBox.confirm('无数据', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            sendMID.value = '';
            getData(Route.meta.ModelCode);
            ElMessage({
              type: 'success',
              message: '成功加载初始数据'
            });
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消'
            });
          });
      } else {
        res.data.forEach((item: any) => {
          if (item.cPropertyClassTypeCode == 'Filter') {
            Filter.value = item[import.meta.env.VITE_APP_key].sort(
              compare('iIndex', true)
            );
          }
          if (item.cPropertyClassTypeCode == 'ToolBut') {
            But.value = item[import.meta.env.VITE_APP_key].sort(
              compare('iIndex', true)
            );
          }
          if (item.cPropertyClassTypeCode == 'Tree') {
            treeData.value = item[import.meta.env.VITE_APP_key];
            treeAxiosData.value = treeData.value[0];
            treeAxios(treeData.value[0]);
          }
          if (item.cPropertyClassTypeCode == 'Grid') {
            funTable(
              item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
            );
          }
        });
      }
    } else {
      console.log('请求出错');
    }
  });
  // } catch (error) {
  //     console.log(error, '程序出错了');
  // }
};

//获取树结构数据
const treeAxios = (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    params: {}
  };
  ParamsApi(data).then(res => {
    if (res.status == 200) {
      treeData.value = res.data;
    } else {
      console.log('请求出错');
    }
  });
};
let checkedD = ref(null as any);
const treeObj = ref({});
// 树变化
const treeChange = (datas: any, checked: any, indeterminate: any) => {
  const data = treeRef.value.store.nodesMap[datas.UID];
  let rootParent = data.parent;
  while (rootParent.parent) {
    if (rootParent.parent?.level === 0) {
      break;
    }
    rootParent = rootParent.parent;
  }
  console.log(rootParent);
  if (rootParent.data.cDataCode) {
    window.sessionStorage.setItem(
      'Where:cDataCode',
      rootParent.data.cDataCode ?? ''
    );
    router.replace({
      name: 'RuleAudit'
    });
  }
  treeObj.value = datas;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.sessionStorage.setItem('RuleAudit', JSON.stringify(treeObj.value));
  //树结构单选处理
  if (checked && checkedD.value !== datas.UID) {
    checkedD.value = datas.UID;
    treeRef.value.setCheckedNodes([datas]);

    //拿取code,调接口，表格数据
    let data = treeRef.value.getCheckedNodes();
    //调取表格数据，需要的MID
    if (data[0].Child.length) {
      sendMID.value = data[0].Child[0].MID;
      //新增时需要UID
      sendUID.value = data[0].UID;
    } else {
      sendMID.value = data[0].UID;
      sendUID.value = data[0].UID;
    }
    //将选中的数据进行本地存储，保存修改返回时，保证树任然选中
    sessionStorage.set('ModelCode', data[0]);
    //选中单个树数据，调取相关数据
    ModelCode.value = data[0].cModelCode;

    if (ModelCode.value) {
      console.log(22);

      getData(ModelCode.value);
    } else {
      console.log(33);

      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
      total.value = 0;
    }
  } else {
    //取消选中
    checkedD.value = null;
    treeRef.value.setCheckedNodes([]);
    sessionStorage.remove('ModelCode');
    sendMID.value = '';
    checkedData.value = [];
    //取消选中，不再重新获取右侧表格数据---修改--
    // BothDelay()
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
  const conditions = [];
  if (Conditions.value) {
    conditions.push(Conditions.value);
  }
  if (AxiosData.value.Resource.cUrl === '/api/MES_PROJECT/GetForPage') {
    sendMID.value = '';
  }
  if (AxiosData.value.Resource.cUrl === '/api/MES_PROJECT/GetForPage') {
    conditions.push('cProjectCode=VERIFY_VOUCH');
  }
  if (sendMID.value) {
    conditions.push(`Mid=${sendMID.value}`);
  }
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: conditions.join(' && ')
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data.data.map(
        (item: { IsDefault: string | boolean }) => {
          return {
            ...item,
            IsDefault: item.IsDefault ? '是' : '否'
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
    case 'Association':
      clickAssionable(scope, event);
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
          BothDelay();
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
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'RuleAuditEdit',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'RuleAudit',
      title: '业务方案档案详情'
    },
    query: {
      ...Route.query
    }
  });
};
//表格按钮编辑
const clickEditTable = (scope: any, obj: any) => {
  router.push({
    name: 'RuleAuditEdit',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'RuleAudit',
      title: '业务方案档案编辑'
    },
    query: {
      ...Route.query
    }
  });
};
//表格按钮关联
const clickAssionable = (scope: any, obj: any) => {
  let mid = scope.row.UID;
  sessionStorage.set('MId', mid);
  router.push({
    name: 'RuleAuditEdit',
    query: {
      modelCode: obj.cIncludeModelCode,
      // row: JSON.stringify(scope.row),
      pathName: 'RuleAudit',
      title: '业务方案档案关联',
      ...Route.query
    }
  });
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
//按钮新增
const clickAdd = (obj: { cIncludeModelCode: any }) => {
  console.log(treeData.value);
  router.push({
    name: 'RuleAuditEdit',
    params: {
      t: Date.now(),
      rowId: sendUID.value
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      title: '业务方案档案新增',
      treeVal: JSON.stringify(treeChangeData.value),
      MID: JSON.stringify(sendUID.value),
      type: 'add'
    },
    query: {
      ...Route.query
    }
  });
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

//按钮导出所有
const ExportAll = async (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: '',
      Conditions: ''
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      console.log(res, '导出所有-----');
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};
//按钮导出当前页
const ExportOne = async (obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: '',
      Conditions: ''
    }
  };
  try {
    const res = await DataApi(data);
    if (res.status == 200) {
      console.log(res, '导出当前页-----');
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
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
  Conditions.value = filterModel(val.value);
  tableAxios();
};
// 重置
const resetForm = (val: any) => {
  Conditions.value = '';
  OrderByFileds.value = '';
  tableColumns.value = tableSortInit(tableColumns.value);
  queryParams.PageIndex = 1;
  queryParams.PageSize = 20;
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
</style>
