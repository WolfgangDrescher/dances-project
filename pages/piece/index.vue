<script setup>
const UButton = resolveComponent('UButton');

const { data } = await useAsyncData('pieces', () => queryCollection('pieces').all())

const { t } = useI18n();
const localePath = useLocalePath();

const columns = [
    { id: 'audio', cell: ({ row }) => `${row.getValue('localRawFile')}` },
    { id: 'opNr', header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label: t('opNr'),
            icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        });
    }, cell: ({ row }) => `${row.original.meta.body.op} / ${row.original.meta.body.nr}` },
    { accessorKey: 'largerWorkTitle', header: t('title') },
    { accessorKey: 'key', header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label: t('key'),
            icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        });
    } },
    { accessorKey: 'majorMinor', header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return h(UButton, {
            color: 'neutral',
            variant: 'ghost',
            label: t('key'),
            icon: isSorted
            ? isSorted === 'asc'
                ? 'i-lucide-arrow-up-narrow-wide'
                : 'i-lucide-arrow-down-wide-narrow'
            : 'i-lucide-arrow-up-down',
            class: '-mx-2.5',
            onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        });
    }, cell: (row) => t(row.getValue('majorMinor')) },
    { accessorKey: 'composer', header: t('composer') },
    { id: 'actions' },
];

const sorting = ref([
    {
        id: 'opNr',
        desc: false,
    },
]);
</script>

<template>
    <UContainer>
        <div class="flex flex-col gap-8">
            <Heading>Stücke</Heading>
            <UTable v-model:sorting="sorting" :data="data" :columns="columns" class="mt-8">
                <template #audio-cell="{ row, cell, column }">
                    <MidiPlayer :url="row.original.localRawFile" class="text-2xl"/>
                </template>
                <template #actions-cell="{ row }">
                    <div class="flex gap-1 justify-end">
                        <UButton size="sm" color="primary" variant="solid" :label="t('vhv')" :to="`https://verovio.humdrum.org/?file=${encodeURIComponent(`https://github.com/WolfgangDrescher/schubert-dances/blob/master/kern/${row.original.filename}.krn`)}`" target="_blank" />
                        <UButton size="sm" color="primary" variant="solid" :label="t('view')" :to="localePath({ name: 'piece-id', params: { id: row.original.slug } })" />
                    </div>
                </template>
            </UTable>
        </div>
    </UContainer>
</template>
