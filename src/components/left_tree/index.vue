<template>
  <div class="leftTreeSty">
    <div class="treeMain">
      <div class="formSty" v-if="FormDatas.length">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          status-icon
        >
          <template v-for="item in FormDatas" :key="item.UID">
            <el-form-item
              :label="item.Resource.cAttributeName + '：'"
              :prop="item.Resource.cAttributeCode"
              v-if="
                item.IsShow && item.Resource.cAttributeTypeCode != 'binddata'
              "
            >
              <!-- {{item.Resource.cAttributeCode}} -->
              <el-input
                v-if="item.cDataTypeCode == 'Nvarchar'"
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
                style="width: 100px"
              />
              <el-input
                v-if="
                  item.cControlTypeCode == 'RichText' &&
                  item.cDataTypeCode == 'Nvarchar'
                "
                :rows="2"
                type="textarea"
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
                style=""
              />
              <el-input-number
                v-if="
                  item.cControlTypeCode == 'TextBox' &&
                  item.cDataTypeCode == 'Int'
                "
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
                style=""
              />
              <el-input-number
                v-if="
                  item.cControlTypeCode == 'TextBox' &&
                  item.cDataTypeCode == 'Decimal'
                "
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
                style=""
              />
              <el-input
                v-if="item.cControlTypeCode == 'PassWord'"
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
              />
              <el-input
                v-if="item.cControlTypeCode == 'TextBoxLink'"
                @change="TextBoxLink"
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
              >
                <template #append>
                  <el-icon
                    v-if="!props.disabled"
                    @click="clickModel(item, item.IsMulitChoose)"
                  >
                    <MoreFilled />
                  </el-icon>
                  <el-icon v-else>
                    <MoreFilled />
                  </el-icon>
                </template>
              </el-input>
              <el-select
                v-if="item.cControlTypeCode == 'ComboBox'"
                v-model="ruleForm[item.Resource.cAttributeCode]"
                :placeholder="disabled ? '' : '请输入'"
                clearable
                @change="(value:any)=>GetSelectData(item,value)"
              >
                <template v-for="(val, index) in item.selDataList" :key="index">
                  <!-- v-if="item.Resource.cAttributeCode == val.cDictonaryTypeCode" -->
                  <el-option
                    :label="val.cDictonaryName || val.cBomClassName"
                    :value="val.cDictonaryCode || val.cBomClassCode"
                  />
                </template>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
        <el-button type="primary" @click="ClickSearch" style="margin-left: 10px"
          >搜索</el-button
        >
        <el-button type="info" @click="resetForm">重置</el-button>
      </div>
      <div class="treeSty">
        <el-tree
          :style="{ height: funHeight() }"
          class="treeItem"
          ref="treeRef"
          :data="data"
          :node-key="props.nodeKey"
          :check-strictly="true"
          :highlight-current="true"
          :show-checkbox="true"
          :check-on-click-node="true"
          :props="defaultProps"
          :default-expanded-keys="checkedData"
          :default-checked-keys="checkedData"
          @check="treeChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  watch,
  reactive,
  nextTick,
  defineExpose,
  computed,
  onActivated,
  provide
} from 'vue';
const props = defineProps({
  treeFormDatas: {
    //搜索数据
    type: Array as any,
    default: () => {
      return [];
    }
  },
  treeData: {
    //tree数据
    type: Array as any,
    default: () => {
      return [];
    }
  },
  nodeKey: {
    //字段  key
    type: String,
    default: () => {
      return '';
    }
  },
  label: {
    //显示的字段
    type: String,
    default: () => {
      return '';
    }
  },
  childType: {
    //显示的child
    type: String,
    default: () => {
      return '';
    }
  },
  disabled: {
    type: Boolean,
    default: () => {
      return false;
    }
  }
});
const emit = defineEmits([
  'clickTree',
  'clickTreeTwo',
  'ClickSearch',
  'resetForm'
]);
const checkedData = ref([]) as any; //选中的数据
const treeRef = ref(); //dom
const data = ref([]); //data
const FormDatas = ref([]) as any; //data
const ruleForm = ref({}) as any; //data
const checkedD = ref(null) as any;
const defaultProps = {
  children: props.childType,
  label: props.label
};
watch(
  () => props.treeData,
  (val: any) => {
    data.value = filterList(val, null);
  },
  { deep: true }
);
watch(
  () => props.treeFormDatas,
  (val: any) => {
    FormDatas.value = val;
  },
  { deep: true }
);
const filterList = (myList: any, Code: any) => {
  return myList
    .filter((item: any) => {
      return item[props.label] != Code; //过滤条件
    })
    .map((item: any) => {
      item = Object.assign({}, item);
      if (item[props.childType]) {
        item[props.childType] = filterList(item[props.childType], Code);
      }
      return item;
    });
};

const clickModel = (obj: any, item: any) => {
  console.log(obj, '---obj');
};
//手动输入弹框数据
const TextBoxLink = () => {};
//下拉数据变化
const GetSelectData = (item: any, value: any) => {
  console.log(item, value);
};
const treeChange = (node: any, key: any) => {
  // console.log(node,"---node");
  // console.log(key,"---key");
  checkedData.value = [node[props.nodeKey]];
  //选中事件在选中后执行，当lis中有两个选中时，使用setCheckedKeys方法，选中一个节点
  if (key.checkedKeys.length == 2) {
    //单选实现
    setTimeout(() => {
      treeRef.value!.setCheckedKeys(checkedData.value);
    }, 100);
  }
  emit('clickTree', node);
};

const clearTree = () => {
  checkedData.value = [];
  treeRef.value.setCheckedKeys([]);
};
// 搜索
const ClickSearch = () => {
  console.log(ruleForm.value, '--uleForm.value ');

  emit('ClickSearch', { value: ruleForm.value });
};

// 重置
const resetForm = () => {
  ruleForm.value = {};
  emit('resetForm', { value: ruleForm.value });
};
const funHeight = () => {
  return window.innerHeight - 210 + 'px';
};
defineExpose({ clearTree });
</script>

<style lang="scss" scoped>
.leftTreeSty {
  box-sizing: content-box;
  // width: 100%;
  // border: 1px solid red;
  // overflow-y: auto;
  .treeMain {
    width: 100%;
    // border: 1px solid ;
    .treeSty {
      display: flex;
      .treeItem {
        width: 340px;
        // border: 1px solid red;
        overflow-y: auto;
      }
    }
  }
}
.formSty {
  width: 100%;
  display: flex;
}
</style>
