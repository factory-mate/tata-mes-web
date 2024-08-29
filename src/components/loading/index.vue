<template>
    <div class="loading" v-show="msg.show">
        <div class="bg_main">
            <div class="zzBg"></div>
            <div class="jiazai">
                <img src="@/assets/loading-1.gif" alt="" srcset="">
                <span>加载中...</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        msg: Object,
        aaa: Number
    }
}
</script>

<style scoped lang="scss">
.loading {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .bg_main{
        width: 100%;
        height: 100%;
        position: relative;
        .zzBg{
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0,0.3);
            position: absolute;
            top: 0;
            left: 0;
        }
        .jiazai {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -71px;
            margin-left: -50px;
            // color: #fff;
            padding: 6px 15px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img{
                display: inline-block;
                width: 100px;
            }
            span{
                display: inline-block;
                font-size: 30px;
                color: #333;
            }
        }
    }
}
</style>
