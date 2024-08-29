<template>
    <div class="panelMain">
        <div class="item  lanelLft">
            <p>审批</p>
            <ul class="shiMain">
                <li class="shiMainItem">今天完成XXXXXXXX,流程一起处理完毕!</li>
                <li class="shiMainItem">今天完成XXXXXXXX,流程一起处理完毕!</li>
                <li class="shiMainItem">今天完成XXXXXXXX,流程一起处理完毕!</li>
                <li class="shiMainItem">今天完成XXXXXXXX,流程一起处理完毕!</li>
                <li class="shiMainItem">今天完成XXXXXXXX,流程一起处理完毕!</li>
                <li class="shiMainItem">今天完成XXXXXXXX,流程一起处理完毕!</li>
            </ul>
        </div>
        <div class="item lanelRight">
            <p>日历</p>
            <el-calendar v-model="value" />
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    const value = ref(new Date())
</script>

<style lang="scss" scoped>
.panelMain{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .item{
        min-height: 300px;
        background-color: #fff;
        p{
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
            font-weight: bold;
            text-align: center;
            line-height: 30px;
        }
        .shiMain{
            li{
                line-height: 30px;
            }
        }
    }
    .lanelLft{
        flex: 2;
        margin-right: 40px;
    }
    .lanelRight{
        flex: 1;
    }
}
</style>