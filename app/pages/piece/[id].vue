<script setup>
const localePath = useLocalePath();
const { params: { id } } = useRoute();
const { data: piece } = await useAsyncData(`pieces/${id}`, () => queryCollection('pieces').where('stem', '=', `pieces/${id}`).first());
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection('data').path('/data/modulations').first(), {deep: false });

if (!piece.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

const { data: surroundData } = await useAsyncData(`pieces/${piece.value.path}/surroundings`, () => queryCollectionItemSurroundings('pieces', piece.value.path, {
    fields: ['slug'],
}));
const [prevPiece, nextPiece] = surroundData.value;

const score = ref();

onMounted(async () => {
    const response = await fetch(piece.value.localRawFile);
    const kern = await response.text();
    score.value = kern;
});

const formattedData = computed(() => {
    const lines = score.value?.trim().split('\n') ?? [];
    return score.value ? `${lines.join('\n')}` : null;
});

const options = reactive({
    showKeys: false,
});
</script>

<template>
    <UContainer>
        <div class="flex flex-col gap-8">
            <div>
                <Heading>
                    {{ `${piece.largerWorkTitle} №${piece.nr}` }}
                    <div class="text-base font-normal">
                        {{ piece.composer }}, Op. {{ piece.op }}
                    </div>
                </Heading>
                <div class="flex gap-2 items-center">
                    <div v-if="prevPiece">
                        <UButton :to="localePath({ name: 'piece-id', params: { id: prevPiece.slug }, hash: $route.hash })">
                            <Icon name="heroicons:arrow-left-circle" class="text-xl" />
                            {{ $t('previous') }}
                        </UButton>
                    </div>
                    <div v-if="nextPiece">
                        <UButton :to="localePath({ name: 'piece-id', params: { id: nextPiece.slug }, hash: $route.hash })">
                            {{ $t('next') }}
                            <Icon name="heroicons:arrow-right-circle" class="text-xl" />
                        </UButton>
                    </div>
                </div>
            </div>

            <div class="flex flex-col md:flex-row items-center gap-4">
                <div class="shrink-0 flex gap-2 ml-auto md:order-2">
                    <MidiPlayer :url="piece.localRawFile" class="text-2xl"/>
                    <UButton :to="`https://github.com/WolfgangDrescher/schubert-dances/blob/master/kern/${piece.filename}.krn`" target="_blank">
                        {{ $t('github') }}
                    </UButton>
                    <UButton :to="`https://verovio.humdrum.org/?file=${encodeURIComponent(`https://github.com/WolfgangDrescher/schubert-dances/blob/master/kern/${piece.filename}.krn`)}`" target="_blank">
                        {{ $t('vhv') }}
                    </UButton>
                </div>
            </div>

            <VerovioCanvas
                v-if="formattedData"
                :data="formattedData"
                :options="{
                    spacingSystem: 15,
                    pageMarginLeft: 30,
                    pageMarginRight: 30,
                    pageMarginTop: 10,
                    pageMarginBottom: 10,
                }"
            />

            <div>
                <div class="my-4 flex grow-0 flex-wrap gap-6">
                    <UCheckbox v-model="options.showKeys" :label="$t('showKeys')" />
                </div>
                <PieceMap :modulations="modulationsData.body[piece.slug]" :show-keys="options.showKeys" />
            </div>

        </div>
    </UContainer>
</template>
