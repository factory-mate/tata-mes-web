<template>
    <!-- 指标详情页面 -->
    <div class="maintain">
        <el-card>
            <!-- 按钮区域 -->
            <div class="bot-btn1" >
                <ButtonViem   ButtonViem :ToolBut="But" @SaveAdd="SaveAdd" @SaveEdit="SaveEdit" @clickEdit="clickEdit" @clickAddConvert="clickAddConvert"></ButtonViem>
            </div>
            <Head-View :Head="head" :row="row" :rowId="rowId" ref="headRef" :disabled="disabled" :dialogFormVisible="dialogFormVisible" @RoleBut="RoleBut"></Head-View>
            <!-- 表格区域 -->
            <!-- <div style="float:right;margin:10px 0"  v-if="tableColumns.length">
                <el-button type="primary" size="small" :disabled="disabled"  @click="clickTableAdd()">添加</el-button>
            </div> -->
            <myTable :tableData="tableData" :tableColumns="tableColumns" :tableBorder="true"
                :selection="true">
                <template #button>
                    <el-table-column label="操作" fixed="right" width="200px" align="center">
                        <template #header>
                            <span>操作</span>
                        </template>
                        <template #default="scope">
                            <el-button type="primary" :disabled="disabled" size="small" @click="clickTableEdit(scope)">编辑</el-button>
                            <el-button type="primary" :disabled="disabled" size="small" @click="clickTableHandDel(scope)">删除</el-button>
                        </template>
                    </el-table-column>
                </template> 
            </myTable>
            <pagination v-if="total > 0" :total="total" v-model:page="queryParams.PageIndex"
                v-model:limit="queryParams.PageSize" />
            <pop-model :dialogFormVisible="dialogFormVisible"  :title="modelTitle" :row="rowVal" :modelCIncludeModelCode="modelCIncludeModelCode" :modelGridType="modelGridType" :modelGrid="modelGrid" @modelClose="modelClose" @clickHandAdd="clickHandAdd" @clickHandEdit="clickHandEdit"></pop-model >
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, toRefs, reactive, nextTick, onActivated, provide } from "vue";
import myTable from '@/components/MyFormTable/index.vue'
import { ElLoading } from 'element-plus'
import HeadView from '@/components/ViewFormHeard/index.vue'
import ButtonViem from '@/components/Button/index.vue'
import myPopup from '@/components/Popup/index.vue'
import { ElButton, ElCard, ElTableColumn,ElMessage ,ElMessageBox } from 'element-plus'
import PopModel from '@/components/PopModel/model.vue'
import { configApi, DataApi, ParamsApi } from '@/api/configApi/index'
import { useRoute } from 'vue-router'
import useStore from '@/store';
import { compare } from "@/utils";
const { tagsView, permission } = useStore();
const modelCode = ref() 
const row = ref()
const rowId = ref('') as any
const Route = useRoute();
const headRef = ref(null)
let But = ref([]) as any
//表格数据
const tableData = ref([] as any)
//总条数
const total = ref(0)
const tableIndex = ref(null)
// 表格配置数据
let dataVal = ref([] as any[])
const tableColumns = ref(dataVal)
const tableButton = ref([]) as any
const tabType = ref(true)
const AxiosData = ref({}) as any
const rowVal = ref({}) as any
const modelGrid = ref([]) as any
const modelGridType = ref(true)
//分页查询参数
const queryParams = reactive({
    PageIndex: 1,
    PageSize: 10,
})
//启用传递的UID
const sendId = ref([]) as any
const data = reactive({
    isCollapse: false,
    dialogV: false,
    dialogTitle: '编辑',
    Conditions: '',
    OrderByFileds: '',
    disabled:false,
    dialogFormVisible:false,
    modelTitle: '标题',
    modelCIncludeModelCode:''
})
const { disabled,dialogFormVisible,modelTitle, modelCIncludeModelCode} = toRefs(data)
let head = ref([]) as any
const initType=ref(true)
onActivated(() => {
    console.log(history.state,"roter 数据");
    modelCode.value = history.state.modelCode?history.state.modelCode:Route.meta.ModelCode
    Route.meta.ModelCode = history.state.modelCode?history.state.modelCode:Route.meta.ModelCode
    Route.meta.title = history.state.title?history.state.title:Route.meta.title
    tagsView.updateVisitedView(Route)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // getAddUser(Route.meta.ModelCode)
    // if(initType.value){
    //     getAddUser(Route.meta.ModelCode)
    // }
    if( rowId.value != Route.params.rowId){     
        getAddUser(Route.meta.ModelCode)
    }
    rowId.value = Route.params.rowId
    initType.value=false
    if(Route.params.rowId){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rowId.value = Route.params.rowId
    }
    if(history.state.row){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        row.value=JSON.parse(history.state.row)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rowId.value=JSON.parse(history.state.row).UID
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-ignore
    if(Route.meta.title.match(/详情/ig)){
        disabled.value=true
    }

});
// 权限按钮
const RoleBut=(v:any)=>{
    
    let ToolData=head.value.filter((BItem:any)=>{
        return BItem.cAttributeCode=='Tool'
    })
    if(ToolData.length){
        let dataVal = {
            method: ToolData[0].Resource.cHttpTypeCode,
            url: ToolData[0].Resource.cServerIP + ToolData[0].Resource.cUrl,
            data:v
        }
        DataApi(dataVal).then((res: any) => {
                if (res.data.cPropertyClassTypeCode == 'ToolBut') {
                    But.value = res.data[import.meta.env.VITE_APP_key].sort(compare('iIndex', true))    
                }
        })
    }
                    
}
const getAddUser = async (code:any) => {
    try {
        const res = await configApi(code)
        if (res.status == 200) {
            res.data.forEach((item:any) => {
                if (item.cPropertyClassTypeCode == 'Head') {
                    item[import.meta.env.VITE_APP_key].map((item:any) => {
                        item.Resource[item.Resource.cAttributeCode] = ''
                    })
                    head.value = item[import.meta.env.VITE_APP_key]
                }
                if (item.cPropertyClassTypeCode == 'ToolBut') {
                    But.value = item[import.meta.env.VITE_APP_key]
                }
                if (item.cPropertyClassTypeCode == 'Grid') {
                    funTable(item[import.meta.env.VITE_APP_key])
                }
            })
        } else {
            console.log('请求出错');
        }
    } catch (error) {
        console.log(error, '程序出错了');

    }

}

// table 数据整合
const funTable = (arr: Array<any>) => {
    modelGrid.value=arr
    arr.forEach(item => {
        if (item.Resource.cAttributeTypeCode == 'property'  && item.IsShow==true) {
            let itemData = { checkType: true, label: item.Resource.cAttributeName, prop: item.Resource.cAttributeCode, headerSlot: false, slot: '' }
            tableColumns.value.push(itemData)
            tableColumns.value.push({ checkType: true, label: '操作', slotName: 'button' })
            tableColumns.value = tableColumns.value.filter((item: { label: any; }, index: any, self: any[]) => {
                // 利用findIndex方法找到第一个与当前元素id相等的元素索引
                const i = self.findIndex((t: { label: any; }) => t.label === item.label);
                // 如果当前索引等于当前元素在self中的最初出现位置索引，则表示元素符合要求，不是重复元素，保留
                return i === index;
            })
        }
        if (item.Resource.cAttributeTypeCode == 'binddata') {
            AxiosData.value = item
            tableAxios()
        }
    });
}

//表格数据查询
const tableAxios = async () => {
    let data = {
        method: AxiosData.value.Resource.cHttpTypeCode,
        url: AxiosData.value.Resource.cServerIP+AxiosData.value.Resource.cUrl,
        params: {
         "val":rowId.value
        }
    }
    console.log(data,"--==data");
    // return false
    try {
        const res = await ParamsApi(data)
        if (res.status == 200) {
            tableData.value=res.data
            // total.value = res.data.dataCount
            console.log(res,'888888888');
            
        } else {
            console.log('请求出错');

        }
    } catch (error) {
        console.log(error, '程序出错');
    }
}

// table 按钮 集合
const clickTableHandDel=(val:any)=>{
    tableData.value.splice(val.$index, 1); 
    // total.value=total.value-1
}
const clickTableAdd=()=>{
    dialogFormVisible.value=true
    modelTitle.value='新增'
    rowVal.value={}
}
const clickTableEdit=(val:any)=>{    
    console.log(val,"--===");
    
    dialogFormVisible.value=true
    modelTitle.value='编辑'
    rowVal.value=val.row
    tableIndex.value=val.$index
    
}
const clickHandAdd=(data:any)=>{
    let itemData=JSON.parse(JSON.stringify(data.val))
    dialogFormVisible.value=data.type
    tableData.value.push(itemData)
  // total.value=total.value+1  
}
const clickHandEdit=(data:any)=>{
    let itemData=JSON.parse(JSON.stringify(data.val))
    dialogFormVisible.value=data.type
    tableData.value.splice(tableIndex.value,1,itemData)

}
const clickTableBut = (val: string) => {
    switch (val) {
        case "View":
            clickView()
            break;
        default:
            break;
    }
}

// 按钮详情
const clickView = () => {
    console.log('详情')
}
// 添加
const clickAddConvert=(val:any)=>{
    dialogFormVisible.value=true
    modelTitle.value='新增'
    modelCIncludeModelCode.value=val.cIncludeModelCode
    
}
const modelClose=(val:any)=>{
    dialogFormVisible.value=val.type
}
//新增保存
const SaveAdd = (obj: any) => {
    obj.pathName="ProductPlan"
    obj.tableData=tableData.value
    console.log(obj,'--000');
    console.log(tableData.value,"--===cvvv");
    if(tableData.value.length<=0){
        ElMessage({
            message: '请添加list数据',
            type: 'error'
        })
        return false
    }
    
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj)
}

//修改保存
const SaveEdit=(obj:any)=>{
    obj.pathName="ProductPlan"
    obj.tableData=tableData.value
    if(tableData.value.length<=0){
        ElMessage({
            message: '请添加list数据',
            type: 'error'
        })
        return false
    }
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    headRef.value.validate(obj)
    
}
// 编辑
const clickEdit = (obj: any) => {
    console.log(obj, '修改编辑');
    getAddUser(obj.cIncludeModelCode)
    disabled.value=false
}

// 列表排序
const newList = (val: any) => {
    tabType.value = false
    nextTick(() => {
        tableColumns.value = val.list
        tabType.value = true
    })
}
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
