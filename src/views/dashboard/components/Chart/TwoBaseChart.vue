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
    const twoBaseChart = init(document.getElementById(props.id) as HTMLDivElement);

    twoBaseChart.setOption({
        //标题
        title: {
            text: '本周供应商补货统计',
            subtext: '单位 PSC',
        },
        //上方提示
        legend: [{
            data: ['补货', '缺货'],
            left:'80%',
            top:'5%'
        }],
         //鼠标进入显示数据
        tooltip: {},
        //X轴
        xAxis: [{
            type: 'category',
            data: ['供应商A', '供应商B', '供应商C', '供应商D', '供应商E', '供应商F', '供应商H']
        }],
        //Y轴
        yAxis: [{
            type: 'value'
        }],
        series: [
            {
                name: '补货',
                data: [100, 160, 250, 180, 90, 60, 90],
                type: 'bar',
                color: 'skyBlue'
            },
            {
                name: '缺货',
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar',
                color: 'pink'
            }
        ]

    } as EChartsOption);
    chart.value = twoBaseChart;
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