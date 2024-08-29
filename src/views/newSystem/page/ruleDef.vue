<template>
    <div class="ruleDef">
        <el-form :model="form" label-width="120px">
            <el-form-item label="编码预览：">
              <el-input v-model="form.name"  
                maxlength="30"
                placeholder="请输入"
                show-word-limit/>
                <p class="hintSty">数字流水</p>
            </el-form-item>
            <el-form-item label="编码方式：">
                <el-radio-group v-model="form.radio2" class="ml-4">
                    <el-radio label="1">自动编号</el-radio>
                    <el-radio label="2">手工编号</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="编码时机：">
                <el-radio-group v-model="form.radio2" class="ml-4">
                    <el-radio label="1">保存后</el-radio>
                    <el-radio label="2">保持前</el-radio>
                </el-radio-group>
            </el-form-item>
            <div class="butSty">
                <el-button type="primary" @click="onSubmit">保持</el-button>
                <el-button>取消</el-button>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive,toRefs } from 'vue'

// do not use same name with ref
const data = reactive({
    form:{
        name: '',
        radio2:''
    },
})
const {form}=toRefs(data)

const onSubmit = () => {
  console.log('submit!')
}

</script>

<style scoped lang="scss">
.ruleDef{
    height: 100%;
    .hintSty{
        font-size: 12px;
        color: var(--el-color-primary);
    }
    .butSty{
        width: 100%;
        display: flex;
        justify-content: center;
    }
}
</style>