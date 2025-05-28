<template>
  <!-- /编辑新增页面 -->
  <div class="maintain">
    <el-card>
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="'true'"
        :dialogFormVisible="dialogFormVisible"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 按钮区域 -->
      <div class="bot-btn1">
        <ButtonViem
          ButtonViem
          :ToolBut="But"
          @SaveAdd="SaveAdd"
          @clickAdd="clickAdd"
          @SaveEdit="SaveEdit"
          @clickEdit="clickEdit"
          @clickAddConvert="clickAddConvert"
          @clickDelete="clickDelete"
        ></ButtonViem>
      </div>
      <!-- 表格区域 -->
      <!-- <div style="float:right;margin:10px 0"  v-if="tableColumns.length">
                <el-button type="primary" size="small" :disabled="disabled"  @click="clickTableAdd()">添加</el-button>
            </div> -->
      <myTable
        ref="mytable"
        :tableData="tableData"
        :tableColumns="tableColumns"
        :tableBorder="true"
        :selection="true"
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
    <!-- 弹窗 -->
    <Odialog
      :dialogFormVisible="ZZdialogFormVisible"
      :title="title"
      :objData="objData"
      :modeCode="objModeCode"
      :disabled="Mdisabled"
      :row="Mrow"
      @FmodelClose="modelClose"
    ></Odialog>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, provide } from 'vue';
import myTable from '@/components/MyFormTable/index.vue';
import { ElLoading } from 'element-plus';
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
import PopModel from '@/components/PopModel/model.vue';
import { configApi, DataApi, delApi, ParamsApi } from '@/api/configApi/index';
import Odialog from '@/components/DialogModel/index.vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import useStore from '@/store';
import { compare } from '@/utils';
const router = useRouter();
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const mytable = ref();
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
const tableButton = ref([]) as any;
const tabType = ref(true);
const ZZdialogFormVisible = ref(false);
const Mdisabled = ref(false);
const title = ref('');
const objData = ref({}) as any;
const Mrow = ref({}) as any;
const objModeCode = ref('') as any;
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const modelGridType = ref(true);
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//启用传递的UID
const sendId = ref([]) as any;
const SElectdATA = ref([]) as any;
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
  console.log(history.state, 'roter 数据');
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
  // initType.value=false
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }
  rowId.value = Route.params.rowId;
  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
  }
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
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(code);
    if (res.status == 200) {
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });
          head.value = item[import.meta.env.VITE_APP_key];
        }
        if (item.cPropertyClassTypeCode == 'ToolBut') {
          But.value = item[import.meta.env.VITE_APP_key];
        }
        if (item.cPropertyClassTypeCode == 'Grid') {
          funTable(item[import.meta.env.VITE_APP_key]);
        }
      });
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
    ElLoading.service().close();
  }
};

// table 数据整合
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: true,
        label: item.cShowName ?? item.Resource.cAttributeName,
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
      tableButton.value = tableButton.value.filter(
        (item: any, index: any, self: any[]) => {
          // 利用findIndex方法找到第一个与当前元素id相等的元素索引
          const i = self.findIndex(
            (t: any) => t.cAttributeName === item.cAttributeName
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
    data: {
      OrderByFileds: '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Conditions: 'mid = ' + headRef.value.ruleForm.UID
    }
  };
  console.log(data, '--==data');
  // return false
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await DataApi(data);
    if (res.status == 200) {
      tableData.value = res.data;
      // total.value = res.data.dataCount
      console.log(res, '888888888');
      ElLoading.service().close();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mytable.value!.handleRemoveSelectionChange();
      SElectdATA.value = [];
    } else {
      console.log('请求出错');
      ElLoading.service().close();
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
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'Edit':
      clickEditTable(scope, event);
      break;
    default:
      break;
  }
};

// 按钮详情
const clickView = (scope: any, obj: any) => {
  console.log('详情');
  router.push({
    name: 'BomDoorInfoView',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      row: JSON.stringify(scope.row),
      pathName: 'BomDoorInfo',
      title: '维度详情'
    }
  });
};
//多选获取UID

const handleSelectionChange = (arr: any) => {
  SElectdATA.value = arr;
};
// 添加
const clickAddConvert = (val: any) => {
  dialogFormVisible.value = true;
  modelTitle.value = '新增';
  modelCIncludeModelCode.value = val.cIncludeModelCode;
};
const modelClose = (val: any) => {
  dialogFormVisible.value = val.type;
  ZZdialogFormVisible.value = val.type;
};
//新增保存
const SaveAdd = (obj: any) => {
  obj.pathName = 'ProductPlan';
  obj.tableData = tableData.value;
  if (tableData.value.length <= 0) {
    ElMessage({
      message: '请添加规则',
      type: 'error'
    });
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
//按钮新增
const clickAdd = (obj: { cIncludeModelCode: any }) => {
  console.log(12333333);
  Mdisabled.value = false;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Mrow.value = headRef.value.ruleForm;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  title.value = '新增';
  objModeCode.value = obj.cIncludeModelCode;
};
//表格按钮编辑
const clickEditTable = (scope: any, obj: any) => {
  Mdisabled.value = false;
  Mrow.value = scope.row;
  ZZdialogFormVisible.value = true;
  objData.value = obj;
  title.value = '编辑';
  objModeCode.value = obj.cIncludeModelCode;
};
//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'ProductPlan';
  obj.tableData = tableData.value;
  if (tableData.value.length <= 0) {
    ElMessage({
      message: '请添加规则',
      type: 'error'
    });
    return false;
  }
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
// 删除
const clickDelete = (obj: any) => {
  if (!SElectdATA.value.length) {
    ElMessage({
      type: 'error',
      message: '请选择数据！'
    });
    return false;
  }
  let idList: any = [];
  SElectdATA.value.forEach((item: any) => {
    idList.push(item.UID);
  });
  ElMessageBox.confirm('确认删除？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      console.log(12);
      console.log(obj, '-==');
      // const senid = scope.row.UID;
      let data = {
        method: obj.Resource.cHttpTypeCode,
        url: obj.Resource.cServerIP + obj.Resource.cUrl,
        data: idList
      };

      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: res.msg || '删除成功'
          });
          SElectdATA.value = [];
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          mytable.value!.handleRemoveSelectionChange();
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

// 列表排序
const newList = (val: any) => {
  tabType.value = false;
  nextTick(() => {
    tableColumns.value = val.list;
    tabType.value = true;
  });
};
provide('tableAxios', { tableAxios });
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
