<template>
  <!-- 内返详情页面 -->
  <div class="maintain">
    <el-card>
      <!-- Head区域 -->
      <div>
        <!-- <el-divider content-position="left">单据信息</el-divider> -->
        <Head-View
          :Head="head"
          :row="row"
          :rowId="rowId"
          ref="headRef"
          :disabled="disabled"
          :dialogFormVisible="dialogFormVisible"
          :treeSelData="treeSelData"
          @RoleBut="RoleBut"
        ></Head-View>
        <!-- <el-divider content-position="left">产品信息</el-divider> -->
        <Head-View
          v-if="false"
          :Head="headss"
          :row="row"
          :rowId="rowId"
          ref="headRef"
          :disabled="disabled"
          :dialogFormVisible="dialogFormVisible"
          :treeSelData="treeSelData"
          @RoleBut="RoleBut"
        ></Head-View>
      </div>
      <!-- 表格区域 -->
      <div>
        <el-divider content-position="left">申报异常照片列表</el-divider>
        <myTable
          ref="TABRef"
          :tableData="tableDatass"
          :tableColumns="tableColumnss"
          :tableBorder="true"
          :selection="false"
          :indexTable="false"
        >
          <template #button>
            <el-table-column
              label="操作"
              fixed="right"
              width="400px"
              align="center"
            >
              <template #header>
                <span>操作</span>
                <myPopup
                  :list="tableColumnss"
                  @newList="newList"
                  @renew="renew"
                ></myPopup>
              </template>
              <template #default="scope">
                <template
                  v-for="item in tableButtonss"
                  :key="item.Resource.cAttributeName"
                >
                  <template v-if="item.iIndex == 2 || item.iIndex == 1">
                    <el-button
                      type="primary"
                      size="small"
                      @click="clickTableBut(scope, item)"
                    >
                      {{ item.Resource.cAttributeName }}
                    </el-button>
                  </template>
                </template>
                <el-dropdown
                  style="margin-left: 10px"
                  v-if="tableButtonss.length > 2"
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
                        v-for="(item) in tableButtonss.filter((v: any) => [0, 1].indexOf(v.iIndex) == -1)"
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
        <el-divider content-position="left">内返工艺、产线列表</el-divider>
        <div style="margin: 20px 0">
          <myTable
            ref="TABRef"
            :tableData="tableData"
            :tableColumns="tableColumns"
            :tableBorder="true"
            :selection="false"
            :indexTable="false"
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
                    <template v-if="item.iIndex < 3">
                      <el-button
                        type="primary"
                        size="small"
                        @click="clickTableBut(scope, item)"
                      >
                        {{ item.Resource.cAttributeName }}
                      </el-button>
                    </template>
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
                          v-for="(item) in tableButton.filter((v: any) => [0, 1].indexOf(v.iIndex) == -1)"
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
        </div>
      </div>
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
  <!-- 显示预览图片 -->
  <ImgPreview v-model="imgIshow" :imgs="srcList" />
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, onActivated, nextTick } from 'vue';
import myTable from '@/components/MyFormTable/index.vue';
import { ElLoading } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import myPopup from '@/components/Popup/index.vue';
import { compare } from '@/utils';
import ImgPreview from '@/components/ImgPrive/index.vue'; //图片预览
import { ElButton, ElCard, ElTableColumn } from 'element-plus';
import PopModel from '@/components/PopModel/model.vue';
import { filterModel, tableSortModel, tableSortInit } from '@/utils';
import { configApi, ParamsApi, DataApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { getCurrentInstance } from '@vue/runtime-core'; // 引入getCurrentInstance
import useStore from '@/store';
const { tagsView, permission } = useStore();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const $bus: any =
  getCurrentInstance()?.appContext.config.globalProperties.mittBus; // 声明$bus
const modelCode = ref();
const row = ref();
const rowId = ref('') as any;
const Route = useRoute();
const headRef = ref(null);
let But = ref([]) as any;
const tabVal = ref();
const tabValBol = ref(true);
const tabType = ref(true);
let TabPageVal = ref([]) as any;
const TABRef = ref();
const head = ref([]) as any;
const headss = ref([]) as any;
//表格数据
const tableData = ref([] as any);
const tableDatass = ref([] as any);
//总条数
const total = ref(0);
// 表格配置数据
const tableColumns = ref([]) as any;
const tableColumnss = ref([]) as any;
const AxiosData = ref({}) as any;
const modelGrid = ref([]) as any;
const tableButton = ref([]) as any;
const tableButtonss = ref([]) as any;
const modelGridType = ref(true);
const imgIshow = ref(false);
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
  modelCIncludeModelCode: '',
  treeSelData: [] as any
});
const {
  disabled,
  dialogFormVisible,
  modelTitle,
  modelCIncludeModelCode,
  treeSelData,
  OrderByFileds
} = toRefs(data);
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
  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = JSON.parse(history.state.row).UID;
  }
  if (history.state.title == '内返详情') {
    disabled.value = true;
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
      let arr: any = [];
      let arr2: any = [];
      res.data.forEach((item: any) => {
        if (item.cPropertyClassTypeCode == 'Head') {
          item[import.meta.env.VITE_APP_key].map((item: any) => {
            item.Resource[item.Resource.cAttributeCode] = '';
          });

          item[import.meta.env.VITE_APP_key].forEach((item: any) => {
            if (item.cFormPropertyCode === 'MES.REPAIR_VOUCH.M.View.Head') {
              arr.push(item);
              head.value = arr.sort(compare('iIndex', true));
            }
            if (item.cFormPropertyCode === 'MES.REPAIR_VOUCH.M.View.Head2') {
              arr2.push(item);
              headss.value = arr2.sort(compare('iIndex', true));
            }
          });
          head.value = arr
            .sort(compare('iIndex', true))
            .concat(arr2.sort(compare('iIndex', true)));
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
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错了');
  }
};
// table 数据整合
const funTable = (arr: Array<any>) => {
  modelGrid.value = arr;
  arr.forEach(item => {
    if (
      item.Resource.cAttributeTypeCode == 'property' &&
      item.cFormPropertyCode == 'MES.REPAIR_VOUCH.M.View.Grid'
    ) {
      let itemData = {
        checkType: true,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: false,
        slot: '',
        edit: item.DefinedParm4,
        cControlTypeCode: item.cControlTypeCode,
        cIncludeModelCode: item.cIncludeModelCode,
        cHttpTypeCode: item.Resource.cHttpTypeCode,
        cServerIP: item.Resource.cServerIP,
        cUrl: item.Resource.cUrl,
        cAttributeCode: item.Resource.cAttributeCode
      };
      tableColumns.value.push(itemData);
    }
    if (
      item.Resource.cAttributeTypeCode == 'property' &&
      item.cFormPropertyCode == 'MES.REPAIR_VOUCH.M.View.Grid2' &&
      item.IsShow === true
    ) {
      let itemData = {
        checkType: true,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: false,
        slot: '',
        edit: item.DefinedParm4,
        cControlTypeCode: item.cControlTypeCode,
        cIncludeModelCode: item.cIncludeModelCode,
        cHttpTypeCode: item.Resource.cHttpTypeCode,
        cServerIP: item.Resource.cServerIP,
        cUrl: item.Resource.cUrl,
        cAttributeCode: item.Resource.cAttributeCode
      };
      tableColumnss.value.push(itemData);
    }
    if (
      item.Resource.cAttributeTypeCode == 'method' &&
      item.cFormPropertyCode == 'MES.REPAIR_VOUCH.M.View.Grid2'
    ) {
      let itemData = { checkType: true, label: '操作', slotName: 'button' };
      tableButtonss.value.push(item);
      tableColumnss.value.push(itemData);
      tableColumnss.value = tableColumnss.value.filter(
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
    if (
      item.Resource.cAttributeTypeCode == 'method' &&
      item.cFormPropertyCode == 'MES.REPAIR_VOUCH.M.View.Grid'
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
    if (
      item.Resource.cAttributeTypeCode == 'binddata' &&
      item.cFormPropertyCode == 'MES.REPAIR_VOUCH.M.View.Grid2'
    ) {
      AxiosData.value = item;
      tableAxioss();
    }
    if (
      item.Resource.cAttributeTypeCode == 'binddata' &&
      item.cFormPropertyCode == 'MES.REPAIR_VOUCH.M.View.Grid'
    ) {
      AxiosData.value = item;
      tableAxios();
    }
  });
  // 获取下拉框数据
  getComboBoxFun();
};
//图片表格数据查询
const tableAxioss = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      UID: rowId.value
    }
  };
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await ParamsApi(data);
    if (res.status == 200) {
      tableDatass.value = res.data;
      ElLoading.service().close();
    } else {
      console.log('请求出错');
      ElLoading.service().close();
    }
  } catch (error) {
    console.log(error, '程序出错');
    ElLoading.service().close();
  }
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
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'btnViewPicture':
      btnViewPicture(scope, event);
      break;
    default:
      break;
  }
};
//图片预览
const url = ref('');
const srcList = ref([]) as any;
const previewImg = ref(null);
const btnViewPicture = (scope: any, event: any) => {
  imgIshow.value = true;
  url.value =
    scope.row.cFilePath + scope.row.cFileReName + scope.row.cFileSuffix;
  srcList.value.push(url.value);
};
//获取下拉框数据
const getComboBoxFun = async () => {
  await tableColumns.value.forEach(async (item: any, i: any) => {
    if (item.cControlTypeCode == 'ComboBox') {
      let obj = {};
      if (item.label == '单位') {
        obj = { Conditions: 'cDictonaryTypeCode=ArriveVouchcAccUnitCode' };
      } else {
        obj = { Conditions: 'cDictonaryTypeCode=' + item.cAttributeCode };
      }
      let data = {
        method: item.cHttpTypeCode,
        url: item.cServerIP + item.cUrl,
        params: obj
      };
      await ParamsApi(data).then((res: any) => {
        item.PullData = res.data || [];
      });
    }
  });
};
//排序
const sortArr = (property: any) => {
  return function (a: any, b: any) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2; //正序
    // return value2 - value1; //倒叙
  };
};

// table 按钮删除
const clickTableHandDel = (val: any) => {
  //调用子组件的 DelBtn方法
  TABRef.value.DelBtn();
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
  getAddUser(Route.meta.ModelCode);
};
const clickHandAdd = (data: any) => {
  let itemData = JSON.parse(JSON.stringify(data.val));
  dialogFormVisible.value = data.type;
  tableData.value.push(itemData);
  // total.value=total.value+1
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
  obj.pathName = 'inLindReturn';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};

//修改保存
const SaveEdit = (obj: any) => {
  obj.pathName = 'inLindReturn';
  obj.tableData = TABRef.value.tableDataVal;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  headRef.value.validate(obj);
};
// 编辑
const clickEdit = (obj: any) => {
  getAddUser(obj.cIncludeModelCode);
  disabled.value = false;
  $bus.emit('TabTitleVal', { name: Route.name, title: '内返编辑' });
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

.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}

:deep(.el-table .cell) {
  // padding: 5px;
  .el-input-number .el-input__inner {
    width: 30px;
  }
}
</style>
