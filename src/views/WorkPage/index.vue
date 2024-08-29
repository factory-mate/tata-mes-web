<template>
    <div class="work-page">
        <!-- 上部 -->
        <div class="top-page">
            <el-row :gutter="12">
                <!-- 上部左侧 -->
                <el-col :span="12">
                    <el-card shadow="always" class="body-card">
                        <span>消息通知处</span>
                        <div class="photo">
                            <el-avatar :icon="UserFilled" />
                            <p>某某某</p>
                            <div class="three-card">
                                <el-row :gutter="12">
                                    <el-col :span="8">
                                        <el-card shadow="always" style="background-color:palegoldenrod"> 通知一 </el-card>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-card shadow="always" style="background-color:skyblue"> 测试一 </el-card>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-card shadow="always" style="background-color:orange"> 完成一 </el-card>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </el-card>
                </el-col>
                <!-- 上部右侧 -->
                <el-col :span="12">
                    <el-card shadow="always" class="body-card">
                        <span>展示图标</span>
                        <div class="icon">
                            <el-row :gutter="12">
                                <el-col :span="8">
                                    <el-card shadow="always" style="color:palegoldenrod">
                                        <el-icon>
                                            <Sunrise />
                                        </el-icon>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card shadow="always" style="color:skyblue">
                                        <el-icon>
                                            <Sunny />
                                        </el-icon>
                                    </el-card>
                                </el-col>
                                <el-col :span="8">
                                    <el-card shadow="always" style="color:orange">
                                        <el-icon>
                                            <Moon />
                                        </el-icon>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 下部 -->
        <div class="botton-page">
            <el-row :gutter="12">
                <el-col :span="12">
                    <el-card shadow="always" class="body-cards"> 审批中心
                        <p>暂无内容</p>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="always" class="body-cards">
                        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                            <el-tab-pane label="User" name="first">User</el-tab-pane>
                            <el-tab-pane label="Config" name="second">Config</el-tab-pane>
                            <el-tab-pane label="Role" name="third">Role</el-tab-pane>
                            <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import { UserFilled, Sunrise, Sunny, Moon, PartlyCloudy } from '@element-plus/icons-vue'
import type { TabsPaneContext } from 'element-plus'
const activeName = ref('first')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>

<style lang="scss" scoped>
.work-page {
    margin: 5%;

    // background-color: aquamarine;


    .top-page {
        margin-bottom: 5%;

        span {
            color: rgb(232, 133, 13);
        }

        p {
            margin-left: 10px;
        }

        .three-card {
            margin-left: 20px;
        }

        .photo {
            display: flex;
            align-items: center;
            margin-top: 10px;
            box-sizing: border-box;
        }

        .icon {
            margin-top: 10px;
            box-sizing: border-box;
            font-size: 20px;
        }
    }
}
</style>

<style scoped lang="scss">
.body-card {
    height: 200px;
}

.body-cards {
    height: 300px;

    p {
        text-align: center;
        color: gray;
    }
}
</style>