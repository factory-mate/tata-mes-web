<template>
  <!-- 用户管理页面 -->
  <div class="maintain">
    <!-- 搜索区域 -->
    <FilterForm
      :Filter="Filter"
      @ClickSearch="ClickSearch"
      @resetForm="resetForm"
    ></FilterForm>
    <el-card>
      <!-- 按钮区域 -->
      <ButtonViem
        :ToolBut="But"
        @clickAdd="clickAdd"
        @clickStart="Start"
        @ExportAll="ExportAll"
        @ExportOne="ExportOne"
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
            width="240px"
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
              <!-- <el-button type="primary" size="small" v-for="item in tableButton"
                                :key="item.Resource.cAttributeName" @click="clickTableBut(scope, item)">{{
                                    item.Resource.cAttributeName }}</el-button> -->
              <template
                v-for="item in tableButton"
                :key="item.Resource.cAttributeName"
              >
                <el-button
                  v-if="item.iIndex < 2"
                  type="primary"
                  size="small"
                  @click="clickTableBut(scope, item)"
                >
                  {{ item.Resource.cAttributeName }}
                </el-button>
              </template>
              <el-dropdown
                style="margin-left: 10px"
                v-if="tableButton.length > 2"
              >
                <el-button type="primary" size="small">
                  <el-icon><MoreFilled /></el-icon>
                  <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      v-for="item in tableButton.filter((v:any) => [0,1].indexOf(v.iIndex) == -1)"
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
        :page-sizes="[20, 50, 100]"
      />
    </el-card>
    <!-- 编辑 -->
    <model :dialogV="dialogV" :dialogTitle="dialogTitle"></model>

    <!-- 修改密码弹窗 -->
    <div>
      <el-dialog v-model="MAdialogFormVisible" title="重置密码">
        <el-form
          ref="MAruleFormRef"
          :model="MAruleForm"
          :rules="MArules"
          label-width="120px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item
            :label="item.Resource.cAttributeName + '：'"
            :prop="item.Resource.cAttributeCode"
            v-for="item in MaFormData"
            :key="item.UID"
          >
            <el-input
              v-model="MAruleForm[item.cAttributeCode]"
              type="password"
              show-password
            />
          </el-form-item>
          <p style="padding-bottom: 6px; margin-left: 120px; color: red">
            <span v-if="pwaSty">密码不一致！</span>
          </p>
          <el-form-item>
            <el-button
              type="primary"
              @click="MAsubmitForm(MAruleFormRef, item)"
              v-for="item in MaBut"
              :key="item.UID"
            >
              {{ item.Resource.cAttributeName }}
            </el-button>
            <el-button @click="MAresetForm(MAruleFormRef)">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
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
  onDeactivated
} from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import FilterForm from '@/components/Filter/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import exportAnalysisHooks from '@/utils/exportAnalysisHooks'; //导出
import { filterModel, tableSortModel, tableSortInit, compare } from '@/utils';
import {
  ElButton,
  ElCard,
  ElTableColumn,
  ElMessage,
  ElMessageBox
} from 'element-plus';
import { ArrowDown, MoreFilled } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import model from './components/userGModel.vue';
import { configApi, DataApi, delApi } from '@/api/configApi/index';
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
const tabType = ref(true);
const tabKey = ref(0);
//启用传递的UID
const sendId = ref([]) as any;
//修改密码弹框数据
const MAdialogFormVisible = ref(false);
const MAruleFormRef = ref<FormInstance>();
const MaFormData = ref([]) as any;
const MaBut = ref([]) as any;
const pwaSty = ref(false);
const initType = ref(true);
const loading = ref(false);
onActivated(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let val = window.sessionStorage.getItem('clickSider')
    ? JSON.parse(window.sessionStorage.getItem('clickSider'))
    : '';
  if (val == Route.name) {
    initType.value = false;
    getData(Route.meta.ModelCode);
  }
  if (initType.value) {
    getData(Route.meta.ModelCode);
  }
  initType.value = false;
});
// 缓存的问题
onDeactivated(() => {
  // console.log('onDeactivated');
  // console.log(Route.name,"--mm");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let tagS = JSON.parse(window.localStorage.getItem('tagsViewList'));
  let arr = tagS.filter((item: any) => {
    return item.name == 'usersG';
  });
  if (!arr.length) {
    initType.value = true;
  }
});
// 新增/编辑后的刷新
$bus.on('tableUpData', (v: any) => {
  setTimeout(() => {
    if (v.name == 'usersG') {
      tableAxios();
    }
  }, 300);
});
//重置密码
const clickRest = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  console.log(obj, '重置密码---');

  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  ElMessageBox.confirm('确定重置密码?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '重置成功'
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
        message: '取消重置'
      });
    });
};
//表格按钮修改密码
let MAuid = ref(); //确认修改密码的UID
// const clickModifyPasswork = async (scope: any, obj: any) => {
//     console.log(obj,'密码-----------');

//     MAuid.value = scope.row.UID
//     MAdialogFormVisible.value = true
//     const res = await configApi(obj.cIncludeModelCode)
//     if (res.status == 200) {
//         res.data.forEach((item:any) => {
//             if (item.cPropertyClassTypeCode == 'Head') {
//                 item[import.meta.env.VITE_APP_key].map((item: any) => {
//                     item.Resource[item.Resource.cAttributeCode] = ''
//                 })
//                 MaFormData.value = item[import.meta.env.VITE_APP_key]
//             }
//             if (item.cPropertyClassTypeCode == 'ToolBut') {
//                 MaBut.value = item[import.meta.env.VITE_APP_key]
//             }
//         })
//     }

// }
//修改密码form
const MAruleForm = ref({}) as any;
watch(MaFormData, (newValue, oldValue) => {
  if (newValue.MaFormData) {
    MaFormData.value = newValue.MaFormData.value;
    headVal();
  }
});
const headVal = () => {
  let obj = {};
  MaFormData.value.map((item: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    obj[item.cAttributeCode] = '';
  });
  MAruleForm.value = obj;
};
// 密码验证规则
const MArules = computed(() => {
  let obj: any = {};
  MaFormData.value
    .filter((item: { IsRequest: boolean }) => item.IsRequest === false)
    .map(
      (item: {
        Resource: { cAttributeCode: string | number; cAttributeName: any };
      }) => {
        obj[item.Resource.cAttributeCode] = [
          {
            required: true,
            trigger: 'blur',
            message: `${item.Resource.cAttributeName}不能为空`
          }
        ];
      }
    );
  return obj;
});

//修改密码确认提交
const MAsubmitForm = async (formEl: FormInstance | undefined, item: any) => {
  if (!formEl) return;
  let data = {
    method: item.Resource.cHttpTypeCode,
    url: item.Resource.cServerIP + item.Resource.cUrl,
    data: {
      UID: MAuid.value,
      cPassWordOld: MAruleForm.value.OldPass,
      cPassWordNew: MAruleForm.value.NewPass
    }
  };
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (MAruleForm.value.NewPass != MAruleForm.value.NewPassAgin) {
        pwaSty.value = true;
        return false;
      } else {
        pwaSty.value = false;
      }

      DataApi(data).then(res => {
        if (res.status === 200) {
          ElMessage({
            type: 'success',
            message: '修改成功'
          });
          MAdialogFormVisible.value = false;
        } else {
          ElMessage.error('修改失败');
        }
      });
    } else {
      ElMessage.info('验证不通过');
    }
  });
};
//密码取消
const MAresetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  MAdialogFormVisible.value = false;
};

//调取用户管理接口
const getData: any = async (val: string) => {
  try {
    ElLoading.service({ lock: true, text: '加载中.....' });
    const res = await configApi(val);
    if (res.status == 200) {
      Filter.value = [];
      But.value = [];
      tableColumns.value = [];
      tableButton.value = [];
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
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 20
});
//总条数
const total = ref(0);
//表格数据
const tableData = ref([] as any);
// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  console.log(event.cAttributeCode, '---event.cAttributeCode');

  switch (event.cAttributeCode) {
    case 'View':
      clickView(scope, event);
      break;
    case 'ReSetPass':
      clickRest(scope, event);
      break;
    case 'Edit':
      clickEditTable(scope, event);
      break;
    case 'Delete':
      clickDelete(scope, event);
      break;
    case 'Stop':
      clickStop(scope, event);
      break;
    default:
      break;
  }
};
//表格数据查询
const tableAxios = async () => {
  loading.value = true;
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
      loading.value = false;
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
// table 数据整合
const funTable = (arr: Array<any>) => {
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
        lock: false,
        filters: [],
        cFormPropertyCode: item.cFormPropertyCode
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
//页码变化
const changPage = (val: any) => {
  queryParams.PageIndex = val.page;
  queryParams.PageSize = val.limit;
  tableAxios();
};
// 表格按钮详情
const clickView = (scope: any, obj: any) => {
  console.log('详情');
};
//表格按钮编辑
const clickEditTable = (scope: any, obj: any) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.sessionStorage.setItem('userRow', JSON.stringify(scope.row));
  router.push({
    name: 'UserAddEdit',
    params: {
      t: Date.now(),
      rowId: scope.row.UID
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      scope: JSON.stringify(scope.row),
      title: '用户编辑',
      row: JSON.stringify(scope.row),
      pathName: 'UserG'
    }
  });
};
//表格按钮删除
const clickDelete = (scope: any, obj: any) => {
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  ElMessageBox.confirm('确定删除这条数据?', '提示', {
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
//表格按钮停用
const clickStop = (scope: any, obj: any) => {
  if (scope.row.IsValid == '否') return;
  const senid = scope.row.UID;
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: [senid]
  };
  DataApi(data).then(res => {
    ElLoading.service({ lock: true, text: '加载中.....' });
    if (res.status === 200) {
      ElMessage({
        type: 'success',
        message: '停用成功'
      });
      ElLoading.service().close();
      tableAxios();
    } else {
      ElMessage.error('停用失败');
      ElLoading.service().close();
    }
  });
};

//按钮新增
const clickAdd = (obj: { cIncludeModelCode: any }) => {
  router.push({
    name: 'UserAdd',
    params: {
      t: Date.now(),
      rowId: ' '
    },
    state: {
      modelCode: obj.cIncludeModelCode,
      title: '用户新增',
      pathName: 'UserG',
      row: '',
      type: 'add'
    }
  });
};
//多选获取启用UID
const SelectData = ref([]) as any;
const handleSelectionChange = (arr: any) => {
  // arr.forEach((item: { IsValid: string; UID: any; }) => {
  //     if (item.IsValid === '否') {
  //         sendId.value.push(item.UID)
  //     }
  // })
  SelectData.value = arr;
};
//启用按钮
const Start = (obj: any) => {
  sendId.value = [];
  let typeList = SelectData.value.filter((item: any) => {
    return item.IsValid == '是';
  });
  if (typeList.length) {
    ElMessage({
      type: 'info',
      message: '部分数据已启用'
    });
    return false;
  }
  SelectData.value.forEach((item: { IsValid: string; UID: any }) => {
    if (item.IsValid == '否') {
      sendId.value.push(item.UID);
    }
  });

  if (sendId.value.length <= 0) {
    ElMessage({
      type: 'info',
      message: '请勾选可启用数据'
    });
    return false;
  }
  let data = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: sendId.value
  };
  DataApi(data).then(res => {
    ElLoading.service({ lock: true, text: '加载中.....' });
    if (res.status == 200) {
      tableAxios();
      ElMessage({
        type: 'success',
        message: '启用成功'
      });
      TabRef.value.handleRemoveSelectionChange();
      ElLoading.service().close();
    } else {
      console.log('启用出错了');
      ElLoading.service().close();
    }
  });
};

//按钮导出所有
const ExportAll = async (obj: any) => {
  let ExcelData = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: 0,
      PageSize: 0,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(ExcelData, '用户管理-所有');
  ElLoading.service().close();
};
//按钮导出当前页
const ExportOne = async (obj: any) => {
  let ExcelData = {
    method: obj.Resource.cHttpTypeCode,
    url: obj.Resource.cServerIP + obj.Resource.cUrl,
    data: {
      PageIndex: queryParams.PageIndex,
      PageSize: queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: Conditions.value
    }
  };
  ElLoading.service({ lock: true, text: '加载中.....' });
  exportAnalysisHooks(ExcelData, '用户管理');
  ElLoading.service().close();
};
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: ''
});
const { dialogV, dialogTitle, Conditions, OrderByFileds } = toRefs(data);
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
