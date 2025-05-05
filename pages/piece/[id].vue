<script setup>
const localePath = useLocalePath();
const { params: { id } } = useRoute();
const { data: piece } = await useAsyncData(`pieces/${id}`, () => queryCollection('pieces').where('stem', '=', `pieces/${id}`).first());

if (!piece.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
    });
}

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

        </div>
    </UContainer>
</template>
