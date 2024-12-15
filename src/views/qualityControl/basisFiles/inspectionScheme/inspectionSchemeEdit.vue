<template>
  <!-- /编辑新增页面 -->
  <div class="maintain">
    <el-card>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @AddBody="AddBody"
        ></ButtonViem>
      </div>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="disabled"
        :dialogFormVisible="dialogFormVisible"
        @RoleBut="RoleBut"
      ></Head-View>
      <myTable
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
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
            </template>
            <template #default="scope">
              <template
                v-for="(item, i) in tableBut"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  type="primary"
                  size="small"
                  @click="clickTableBut(scope, item)"
                >
                  {{ item.Resource.cAttributeName }}
                </el-button>
                <el-dropdown style="margin-left: 10px" v-if="i > 2">
                  <el-button type="primary" size="small">
                    <el-icon>
                      <MoreFilled />
                    </el-icon>
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(item, i) in tableBut.slice(2)"
                        :key="i"
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
            </template>
          </el-table-column>
        </template>
      </myTable>
      <pagination
        v-if="total > 0"
        :total="total"
        v-model:page="queryParams.PageIndex"
        v-model:limit="queryParams.PageSize"
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
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated } from 'vue';
import myTable from '@/components/MyFormTable/index.vue';
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import { compare } from '@/utils';
import { ElButton, ElCard, ElTableColumn } from 'element-plus';
import PopModel from '@/components/PopModel/model.vue';
import { configApi, DataApi, delApi, ParamsApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import useStore from '@/store';
import router from '@/router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const rowId = ref('') as any;
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
//表格数据
const tableData = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
let dataVal = ref([] as any[]);
const tableColumns = ref(dataVal);
const tabType = ref(true);
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
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
const { disabled, dialogFormVisible, modelTitle, modelCIncludeModelCode } =
  toRefs(data);
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
  // if(initType.value){
  //     getAddUser(Route.meta.ModelCode)
  // }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let ID = JSON.parse(window.sessionStorage.getItem('inspectionScheme')) || '';
  // if (rowId.value != ID) {
  //   getAddUser(Route.meta.ModelCode);
  // }
  getAddUser(Route.meta.ModelCode);

  rowId.value = ID;
  initType.value = false;
  if (ID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = ID;
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
  // 新增/编辑后的刷新
  $bus.on('tableUpData', (v: any) => {
    setTimeout(() => {
      if (v.name == 'inspectionSchemeEdit') {
        tableAxios();
      }
    }, 300);
  });
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
  try {
    const res = await configApi(code);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
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
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(
            item[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))
          );
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
const tableBut = ref([]) as any;
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  tableBut.value = [];
  arr.forEach((item: any) => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: false,
        slot: ''
      };
      tableColumns.value.push(itemData);
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
    if (item.Resource.cAttributeTypeCode == 'method') {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      tableBut.value.push(item);
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
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      UID: rowId.value
    }
  };
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

// table 按钮 集合
const clickTableHandDel = (val: any) => {
  tableData.value.splice(val.$index, 1);
  // total.value=total.value-1
};
const clickTableAdd = () => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
};
const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  // total.value=total.value+1
};
const clickTableBut = (scope: any, val: any) => {
  console.log(val.cAttributeCode, 'bb');

  switch (val.cAttributeCode) {
    case 'ViewBody':
      clickView(scope, val);
      break;
    case 'EditBody':
      EditBody(scope, val);
      break;
    case 'DeleteBody':
      DeleteBody(scope, val);
      break;
    default:
      break;
  }
};

// 按钮详情
const clickView = (scope: any, obj: any) => {
  router.push({
    name: 'inspectionNormeView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'inspectionSchemeEdit',
      title: '检验指标详情'
    }
  });
};
// 编辑
const EditBody = (scope: any, obj: any) => {
  router.push({
    name: 'inspectionNormeEdit',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'inspectionSchemeEdit',
      title: '检验指标编辑'
    }
  });
};
const DeleteBody = (scope: any, obj: any) => {
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [scope.row.UID]
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
// 添加
const clickAddConvert = (val: any) => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
  modelCIncludeModelCode.value = val.cIncludeModelCode;
};
const modelClose = (val: any) => {
  dialogFormVisible.value = val.type;
};
const AddBody = (obj: any) => {
  router.push({
    name: 'inspectionNormeAdd',
    params: {
      t: Date.now(),
      rowId: rowId.value
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(row.value),
      pathName: 'inspectionSchemeEdit',
      title: '检验指标新增',
      type: 'add'
    }
  });
};
//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'inspectionScheme';
  obj.tableData = tableData.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  // if(!tableData.value.length){
  //     ElMessage({
  //         type: 'error',
  //         message: '请添加数据',
  //     })
  //     return false
  // }
  obj.pathName = 'inspectionScheme';
  obj.tableData = tableData.value;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  console.log(obj, '修改编辑');
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
};

// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
  });
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
