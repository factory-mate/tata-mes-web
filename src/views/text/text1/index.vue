<template>
  <div class="box">
    <div>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span class="sp1">欢迎您使用初始化引导</span>
            <el-button class="button" text>数据导入</el-button>
          </div>
        </template>
        <div class="text item">初始化引导是帮助您快速进行系统配置，导入初始化数据，
          请您按照模块和节点的先后顺序进行配置，配置完成之后请手动点击完成。</div>
      </el-card>
    </div> 

    <div class="demo-collapse content">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item  name="1" style="padding-left: 20px;">
          <template #title>
            人力组织管理初始化
           <span class="sp2" style="color: #58a8f1; background-color: #eef3fc;">进行中</span>
        </template>
          <div style="margin-top: 3px;">
            <el-card class="box-card">
              <div  class="text item" style="font-size: 16px;margin-bottom: 15px;">1.组织管理</div>
              <div class="btns" >
              <el-button class="button" text>业务单元</el-button>
              <el-button class="button" text>部门</el-button>
              <el-button class="button" text>岗位</el-button>
              <el-button class="button" text>职务</el-button>
              <el-button class="button" text>职务类别</el-button>
              <el-button class="button" text>职等</el-button>
              <el-button class="button" text>职级</el-button>
              <el-button class="button" text>职位</el-button>
            </div>
            </el-card>
          </div>
          <div style="margin-top: 3px;">
            <el-card class="box-card">
              <div  class="text item" style="font-size: 16px;margin-bottom: 15px;">1.权限管理</div>
              <div class="btns">
              <el-button class="button" text>用户管理</el-button>
              <el-button class="button" text>角色管理</el-button>
              <el-button class="button" text>授权</el-button>
            </div>
            </el-card>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="demo-collapse content">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item  name="2" style="padding-left: 20px;">
          <template #title>
            员工管理初始化
           <span class="sp2" >待处理</span>
        </template>
          <div style="margin-top: 3px;">
            <el-card class="box-card">
              <div  class="text item" style="font-size: 16px;margin-bottom: 15px;">1.人员设置</div>
              <div class="btns" >
              <el-button class="button" text>在岗状态</el-button>
              <el-button class="button" text>远类别</el-button>
              <el-button class="button" text>变动原因</el-button>
              <el-button class="button" text>学历</el-button>
              <el-button class="button" text>学位</el-button>
              <el-button class="button" text>用工形式</el-button>
              <el-button class="button" text>入离职细项</el-button>
              <el-button class="button" text>入离职交接项配置</el-button>
              <el-button class="button" text>卡片设置</el-button>
              <el-button class="button" text>花名册设置</el-button>
              <el-button class="button" text>个人信息授权</el-button>
              <el-button class="button" text>头像导入</el-button>
            </div>
            </el-card>
          </div>
          <div style="margin-top: 3px;">
            <el-card class="box-card">
              <div  class="text item" style="font-size: 16px;margin-bottom: 15px;">1.通用设置</div>
              <div class="btns">
              <el-button class="button" text>移动表单模板</el-button>
              <el-button class="button" text>人力个性化设置</el-button>
              <el-button class="button" text>工作地点</el-button>
              <el-button class="button" text>人力预警设置</el-button>
            </div>
            </el-card>
          </div>
         
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'


const activeNames = ref(['1','2'])
const handleChange = (val: string[]) => {
  console.log(val)
}

</script>

<style lang="scss" scoped>
.box {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.text {
  font-size: 12px;
  // line-height: 0px;
}
.box-card {
  width: 100%;
  .btns:hover{
   background-color: #d7e0f1;
  }
  .btns{
    // height: 50px;
    // line-height: 50px;
    padding-left: 10px;
    button{
      width:150px;
      margin-left: 10px;
      margin: 10px;
    }
  }
}
.button {
  border: 1px solid rgb(204, 199, 199);
}
.content {
  box-sizing: border-box;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 10px 5px 10px #ddd;
  border: 1px solid #ddd;
  .sp2{
    margin-left: 30px;
    width: 60px; height: 20px;
    background-color: #fff6e5;
    text-align: center; line-height: 20px; 
    border-radius: 8px; 
    color: #ffb800;
  }
}
</style>