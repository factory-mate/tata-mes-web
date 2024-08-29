<template>
  <!-- 进度弹窗 -->
  <div>
    <el-dialog
      v-model="processdialog"
      title="进度显示"
      center
      draggable
      @close="DiaClose"
      @open="DiaOpen"
      :modal="false"
      :close-on-click-modal="false"
    >
      <div class="Process">
        <div class="protext">
          <p>总步数：{{ ProcDta.iTotalStep }}</p>
          <p>已用时：{{ ProcDta.iActUseTime }}</p>
        </div>
        <div class="protexts">
          <p>已完成：{{ ProcDta.iNewStep }}</p>
          <p>预计剩余时间：{{ ProcDta.iPlanUseTime - ProcDta.iActUseTime }}</p>
        </div>
      </div>
      <div class="demo-progress">
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="ProcDta.iProccess || ProcDta.iRate"
        />
      </div>
      <div>
        <p style="max-height: 500px; overflow-y: scroll">
          {{
            ProcDta.iStatusValue == 0
              ? '进行中'
              : ProcDta.iStatusValue == 1
              ? '中止'
              : '挂起'
          }}
          :{{ ProcDta.Memo || ProcDta.cMemo }}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineExpose, watch, defineEmits } from 'vue';
const processdialog = ref(false);
const ProcDta = ref({}) as any;
const props = defineProps({
  obj: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: () => {
      return '';
    }
  }
});
watch(
  props,
  (newValue, oldValue) => {
    if (newValue.obj) {
      ProcDta.value = newValue.obj;
    }
  },
  { deep: true }
);
const emits = defineEmits(['CloseTC']);
const DiaClose = () => {
  processdialog.value = false;
  emits('CloseTC', processdialog.value);
};
const DiaOpen = () => {
  processdialog.value = true;
};
const isDialogOpen = () => {
  return processdialog.value;
};
defineExpose({ DiaOpen, isDialogOpen });
</script>

<style scoped lang="scss">
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.Process {
  .protext {
    display: flex;
    justify-content: space-between;
  }
  .protexts {
    display: flex;
    justify-content: space-between;
  }
}
// :deep(.textSty .el-input-group__append) {
//     padding: 0;
// }

// .textSty {
//     span {
//         padding: 0 13px;
//     }
// }
</style>
