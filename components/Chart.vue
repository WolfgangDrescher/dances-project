<script setup>
import Chart from 'chart.js/auto';

const defaultColors = [
    '#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
    '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92',
];

const props = defineProps(['config']);
const emit = defineEmits(['chartClick']);

const { config } = toRefs(props);

let chart = null;
const chartElem = ref(null);
let chartTimeout = null;

const colorizedConfig = computed(() => {
    const datasets = config.value.data.datasets.map((dataset, index) => {
        return {
            ...dataset,
            backgroundColor: dataset.backgroundColor || defaultColors[index % 9],
        };
    });
    return {
        ...config.value,
        data: {
            ...config.value.data,
            datasets,
        },
    };
});

watch(colorizedConfig, value => {
    clearTimeout(chartTimeout);
    chartTimeout = setTimeout(() => {
        chart.data.datasets = value.data.datasets;
        chart.options = value.options;
        chart.update();
    }, 200);
});

onMounted(() => {
    chart = new Chart(chartElem.value, colorizedConfig.value);
});

function onClick(event) {
    emit('chartClick', chart, event);
}

</script>

<template>
    <div class="h-full w-full">
        <canvas ref="chartElem" @click="onClick"></canvas>
    </div>
</template>
