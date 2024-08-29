<!--  线 + 柱混合图 -->
<template>
    <div :id="id" :class="className" :style="{ height, width }" />
</template>
  
<script setup lang="ts">
import {
    nextTick,
    onActivated,
    onBeforeUnmount,
    onDeactivated,
    onMounted
} from 'vue';
import { init, EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import resize from '@/utils/resize';

const props = defineProps({
    id: {
        type: String,
        default: 'BaseChart'
    },
    className: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '200px',
        required: true
    },
    height: {
        type: String,
        default: '200px',
        required: true
    }
});

const { mounted, chart, beforeDestroy, activated, deactivated } = resize();

function initChart() {
    const BaseChart = init(document.getElementById(props.id) as HTMLDivElement);

    BaseChart.setOption({
        //标题
        title: {
            text: '当日缺料统计',
            subtext: '单位 PSC',
        },
        //上方提示
        legend: [{
            data: ['缺货'],
            left: '80%',
            top: '5%'
        }],
        //鼠标进入显示数据
        tooltip: {},
        //X轴
        xAxis: [{
            type: 'category',
            data: ['物料A', '物料B', '物料C', '物料D', '物料E', '物料F', '物料H']
        }],
        //Y轴
        yAxis: [{
            type: 'value'
        }],
        series: [
            {
                name: '缺货',
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                color: 'pink'
            }
        ]

    } as EChartsOption);
    chart.value = BaseChart;
}

onBeforeUnmount(() => {
    beforeDestroy();
});

onActivated(() => {
    activated();
});

onDeactivated(() => {
    deactivated();
});

onMounted(() => {
    mounted();
    nextTick(() => {
        initChart();
    });
});
</script>