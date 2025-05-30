<script setup>
const { data } = await useAsyncData('pieces', () => queryCollection('pieces').all())
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection('data').path('/data/modulations').first(), {deep: false });
const { data: transitionsData } = await useAsyncData(`transitions`, () => queryCollection('data').path('/data/transitions').first(), {deep: false });
const localePath = useLocalePath();

const { t } = useI18n();

const tabItems = [
    {
        slot: 'minimap',
        label: t('minimap'),
        icon: 'i-heroicons-map',
    },
    {
        slot: 'transitions',
        label: t('transitions'),
        icon: 'i-heroicons-chart-bar-solid',
    },
];

const options = reactive({
    showKeys: false,
});

const openScore = ref(null);
function toggleScore(value) {
    openScore.value = openScore.value === value ? null : value;
}

const separator = ' → ';
const transitionsConfig = computed(() => ({
    type: 'bar',
    data: {
        datasets: [{
            data: transitionsData.value.body.transitions.sort((a, b) => b.count > a.count ? 1 : -1).map(i => ({ x: `${i.currentDeg}${separator}${i.nextDeg}`, y: i.count })),
        }],
    },
    options: {
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                yAlign: 'bottom',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    },
}));
</script>

<template>
    <UContainer>
        <Heading>{{ $t('modulations') }}</Heading>

        <UTabs :items="tabItems">

            <template #minimap>
                <div class="my-4 flex grow-0 flex-wrap gap-6 md:order-1">
                    <UCheckbox v-model="options.showKeys" :label="$t('showKeys')" />
                </div>
                <div class="grid grid-cols-1 gap-4">
                    <UCard v-for="piece in data">
                        <template #header>
                            <NuxtLink :to="localePath({ name: 'piece-id', params: { id: piece.slug } })">
                                <div class="flex">
                                    <div>
                                        {{ `${piece.composer}: ${piece.largerWorkTitle} №${piece.nr}` }}
                                    </div>
                                    <div class="ml-auto">
                                        {{ `Op. ${piece.op} № ${piece.nr}` }}
                                    </div>
                                </div>
                            </NuxtLink>
                        </template>
                        <div class="grid grid-cols-1 gap-4">
                            <div>
                                <div class="flex gap-2 justify-end items-center mb-2">
                                    <div>
                                        <MidiPlayer :url="piece.localRawFile" class="text-2xl"/>
                                    </div>
                                    <UButton @click="toggleScore(piece.slug)" variant="soft">
                                        {{ openScore === piece.slug ? $t('hideScore') : $t('showScore') }}
                                    </UButton>
                                </div>
                                <div>
                                    <VerovioCanvas v-if="openScore === piece.slug" view-mode="horizontal" :url="piece.localRawFile" :scale="35" :page-margin="20" />
                                </div>
                            </div>
                            <PieceMap :modulations="modulationsData.body[piece.slug]" :show-keys="options.showKeys" />
                        </div>
                    </UCard>
                </div>
            </template>

            <template #transitions>
                <div class="h-[300px]">
                    <Chart :config="transitionsConfig" />
                </div>
            </template>

        </UTabs>
    </UContainer>
</template>
