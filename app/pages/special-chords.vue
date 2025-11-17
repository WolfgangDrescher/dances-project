<script setup>
const { data } = await useAsyncData('pieces', () => queryCollection('pieces').all())
const { data: specialchordsData } = await useAsyncData(`specialchords`, () => queryCollection('data').path('/data/specialchords').first(), {deep: false });
const localePath = useLocalePath();

const { t } = useI18n();

const options = reactive({
    showKeys: false,
});

const openScore = ref(null);
function toggleScore(value) {
    openScore.value = openScore.value === value ? null : value;
}

// Only show pieces that have entries in specialchords.yaml
const filteredPieces = computed(() => {
    if (!specialchordsData || !specialchordsData.body) return [];
    const slugs = Object.keys(specialchordsData.body).filter(k => specialchordsData.body[k] && specialchordsData.body[k].length);
    return (data || []).filter(p => slugs.includes(p.slug));
});

</script>

<template>
    <UContainer>
        <Heading>{{ $t('specialChords') }}</Heading>

        <div class="grid grid-cols-1 gap-4">
            <UCard v-for="piece in filteredPieces" :key="piece.slug">
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

                    <div>
                        <div v-if="specialchordsData && specialchordsData.body && specialchordsData.body[piece.slug] && specialchordsData.body[piece.slug].length">
                            <table class="w-full table-auto text-left">
                                <thead>
                                    <tr>
                                        <th class="px-2 py-1">{{ $t('deg') }}</th>
                                        <th class="px-2 py-1">{{ $t('key') }}</th>
                                        <th class="px-2 py-1">{{ $t('startLine') }}</th>
                                        <th class="px-2 py-1">{{ $t('startBeat') }}</th>
                                        <th class="px-2 py-1">{{ $t('endLine') }}</th>
                                        <th class="px-2 py-1">{{ $t('endBeat') }}</th>
                                        <th class="px-2 py-1">{{ $t('comments') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, idx) in specialchordsData.body[piece.slug]" :key="idx">
                                        <td class="px-2 py-1">{{ item.deg }}</td>
                                        <td class="px-2 py-1">{{ item.key }}</td>
                                        <td class="px-2 py-1">{{ item.startLine }}</td>
                                        <td class="px-2 py-1">{{ item.startBeat }}</td>
                                        <td class="px-2 py-1">{{ item.endLine }}</td>
                                        <td class="px-2 py-1">{{ item.endBeat }}</td>
                                        <td class="px-2 py-1">{{ item.comments }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="text-muted">
                            {{ $t('noData') }}
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
    </UContainer>
</template>

