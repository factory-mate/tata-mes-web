<template>
  <!--供应商新增页面 -->
  <div class="maintain">
    <el-card>
      <!-- 搜索区域 -->
      <Head-View
        :Head="head"
        :row="row"
        :rowId="rowId"
        ref="headRef"
        :disabled="disabled"
        @RoleBut="RoleBut"
      ></Head-View>
      <!-- 表格区域 -->
      <myTable
        v-if="tabType"
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
              <myPopup :list="tableColumns" @newList="newList"></myPopup>
            </template>
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                v-for="item in tableButton"
                :key="item.Resource.cAttributeName"
                @click="clickTableBut(scope, item)"
                >{{ item.Resource.cAttributeName }}</el-button
              >
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

      <!-- 按钮区域 -->
      <!-- <div class="bot-btn">
            <ButtonViem :ToolBut="But" @SaveAdd="SaveAdd" @SaveEdit="SaveEdit" @clickEdit="clickEdit"></ButtonViem>
        </div> -->
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated } from 'vue';
import myTable from '@/components/MyTable/index.vue';
import { ElLoading } from 'element-plus';
import HeadView from '@/components/ViewFormHeard/index.vue';
import ButtonViem from '@/components/Button/index.vue';
import myPopup from '@/components/Popup/index.vue';
import { ElButton, ElCard, ElTableColumn } from 'element-plus';
import { configApi, DataApi, ParamsApi } from '@/api/configApi/index';
import { useRoute } from 'vue-router';
import { compare } from '@/utils';
import useStore from '@/store';
const { tagsView, permission } = useStore();
const modelCode = ref();
const row = ref();
const rowId = ref();
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
const AxiosData = ref({}) as any;
//分页查询参数
const queryParams = reactive({
  PageIndex: 1,
  PageSize: 10
});
//启用传递的UID
const sendId = ref([]) as any;
const data = reactive({
  isCollapse: false,
  dialogV: false,
  dialogTitle: '编辑',
  Conditions: '',
  OrderByFileds: '',
  disabled: false
});
const { Conditions, OrderByFileds, disabled } = toRefs(data);
let head = ref([]) as any;
const initType = ref(true);
const ProjectCode = ref();
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
  // if(initType.value){
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     getAddUser(Route.meta.ModelCode)
  // }
  if (rowId.value != Route.params.rowId) {
    getAddUser(Route.meta.ModelCode);
  }
  rowId.value = Route.params.rowId;
  initType.value = false;
  if (Route.params.rowId) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rowId.value = Route.params.rowId;
  }
  if (history.state.row) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    row.value = JSON.parse(history.state.row);
    ProjectCode.value = row.value.cProjectCode;
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
    const res = await configApi(code);
    if (res.status == 200) {
      head.value = [];
      tableColumns.value = [];
      total.value = 0;
      tableData.value = [];
      But.value = [];
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
const funTable = (arr: Array<any>) => {
  tableColumns.value = [];
  tableData.value = [];
  tableButton.value = [];
  arr.forEach(item => {
    if (item.Resource.cAttributeTypeCode == 'property' && item.IsShow) {
      let itemData = {
        checkType: item.IsShow,
        label: item.Resource.cAttributeName,
        prop: item.Resource.cAttributeCode,
        headerSlot: true,
        slot: '',
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

//表格数据查询
const tableAxios = async () => {
  let data = {
    method: AxiosData.value.Resource.cHttpTypeCode,
    url: AxiosData.value.Resource.cServerIP + AxiosData.value.Resource.cUrl,
    params: {
      // "PageIndex": queryParams.PageIndex,
      // "PageSize": queryParams.PageSize,
      OrderByFileds: OrderByFileds.value,
      Conditions: `cProjectCode=${ProjectCode.value}`
    }
  };
  try {
    const res = await ParamsApi(data);
    if (res.status == 200) {
      tableData.value = res.data;
      total.value = res.data.dataCount;
    } else {
      console.log('请求出错');
    }
  } catch (error) {
    console.log(error, '程序出错');
  }
};

// table 按钮 集合
const clickTableBut = (scope: any, event: any) => {
  switch (event.cAttributeCode) {
    case 'btnLoad':
      btnLoad(scope, event);
      break;
    default:
      break;
  }
};

// 按钮下载
// const downloadLink = ref()
const btnLoad = (scope: any, obj: any) => {
  console.log(scope.row, '下载--------');
  let url = scope.row.cFileRoteUrl + scope.row.cActName + scope.row.cFileType;
  let name = scope.row.cFileTypeName;
  if (scope.row.cFileType == '.xlsx') {
    window.location.href = url;
  } else {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.click();
    document.body.removeChild(a);

    // downloadPicture(url,name)
  }
};
// 下载图片
// function downloadPicture(imgSrc, name) {
//         const image = new Image()
//         // 解决跨域 Canvas 污染问题
//         image.setAttribute('crossOrigin', 'anonymous')
//         image.onload = () => {
//             const canvas = document.createElement('canvas')
//             canvas.width = image.width
//             canvas.height = image.height
//             const context = canvas.getContext('2d')
//             context.drawImage(image, 0, 0, image.width, image.height)
//             canvas.toBlob((blob) => {
//                 const url = URL.createObjectURL(blob)
//                 const a = document.createElement('a')
//                 a.download = name || 'photo'
//                 a.href = url
//                 a.click()
//                 a.remove()
//                 URL.revokeObjectURL(url)
//             })
//         }
//         image.src = imgSrc
//     }

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
}
.maintain .selectSty {
  width: 233px;
}
:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>
