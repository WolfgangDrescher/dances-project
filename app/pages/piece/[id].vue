<script setup>
const localePath = useLocalePath();
const { params: { id } } = useRoute();
const { data: piece } = await useAsyncData(`pieces/${id}`, () => queryCollection('pieces').where('stem', '=', `pieces/${id}`).first());
const { data: modulationsData } = await useAsyncData(`modulations`, () => queryCollection('data').path('/data/modulations').first(), {deep: false });

const modulations = modulationsData.value.body[id] ?? [];

// Music theory helper to calculate actual key from scale degree
function calculateKeyFromDegree(degree, pieceKey) {
    const keyMap = {
        // Major keys
        'C': ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        'G': ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
        'D': ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
        'A': ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
        'E': ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        'B': ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#'],
        'F#': ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#'],
        'C#': ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
        'F': ['F', 'G', 'A', 'B♭', 'C', 'D', 'E'],
        'B♭': ['B♭', 'C', 'D', 'E♭', 'F', 'G', 'A'],
        'E♭': ['E♭', 'F', 'G', 'A♭', 'B♭', 'C', 'D'],
        'A♭': ['A♭', 'B♭', 'C', 'D♭', 'E♭', 'F', 'G'],
        'D♭': ['D♭', 'E♭', 'F', 'G♭', 'A♭', 'B♭', 'C'],
        'G♭': ['G♭', 'A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F'],
        'C♭': ['C♭', 'D♭', 'E♭', 'F♭', 'G♭', 'A♭', 'B♭'],
        
        // Natural minor keys
        'a': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        'e': ['E', 'F#', 'G', 'A', 'B', 'C', 'D'],
        'b': ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'],
        'f#': ['F#', 'G#', 'A', 'B', 'C#', 'D', 'E'],
        'c#': ['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B'],
        'g#': ['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#'],
        'd#': ['D#', 'E#', 'F#', 'G#', 'A#', 'B', 'C#'],
        'a#': ['A#', 'B#', 'C#', 'D#', 'E#', 'F#', 'G#'],
        'd': ['D', 'E', 'F', 'G', 'A', 'B♭', 'C'],
        'g': ['G', 'A', 'B♭', 'C', 'D', 'E♭', 'F'],
        'c': ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭'],
        'f': ['F', 'G', 'A♭', 'B♭', 'C', 'D♭', 'E♭'],
        'b♭': ['B♭', 'C', 'D♭', 'E♭', 'F', 'G♭', 'A♭'],
        'e♭': ['E♭', 'F', 'G♭', 'A♭', 'B♭', 'C♭', 'D♭'],
        'a♭': ['A♭', 'B♭', 'C♭', 'D♭', 'E♭', 'F♭', 'G♭']
    };
    
    // Convert roman numeral to index (1-based)
    const degreeNum = degree.replace(/[♯♭]/g, '').toUpperCase();
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
    const index = romanNumerals.indexOf(degreeNum);
    
    if (index === -1 || !keyMap[pieceKey]) return degree; // fallback if we can't calculate
    
    // Get the base note for this scale degree
    let actualKey = keyMap[pieceKey][index];
    
    // Apply any modifications (sharp/flat)
    if (degree.includes('♭')) actualKey = actualKey.replace(/[♯]/, '') + '♭';
    if (degree.includes('♯')) actualKey += '♯';
    
    // Preserve case (uppercase = major, lowercase = minor)
    if (degree === degree.toLowerCase()) actualKey = actualKey.toLowerCase();
    
    return actualKey;
}

const modulationsWithKeys = computed(() => {
    return modulations.map(m => ({
        ...m,
        calculatedKey: calculateKeyFromDegree(m.deg, piece.value?.key)
    }));
});

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

const { localScoreUrlGenerator, githubScoreUrlGenerator, vhvScoreUrlGenerator } = useScoreUrlGenerator();

const scoreOptions = useScoreOptions();

useScoreKeyboardShortcuts({
    prevPiece,
    nextPiece,
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
                <div>
                    <ScoreOptionsPalette />
                </div>
                <div class="shrink-0 flex gap-2 ml-auto md:order-2">
                    <MidiPlayer :url="localScoreUrlGenerator(piece.slug)" class="text-2xl"/>
                    <UButton :to="githubScoreUrlGenerator(piece.slug)" target="_blank">
                        {{ $t('github') }}
                    </UButton>
                    <UButton :to="vhvScoreUrlGenerator(piece.slug)" target="_blank">
                        {{ $t('vhv') }}
                    </UButton>
                </div>
            </div>

            <HighlightedScore
                :piece-id="piece.slug"
                :verovio-options="{
                    ...scoreOptions.verovioOptions,
                    header: true,
                    spacingSystem: 15,
                    pageMarginLeft: 50,
                    pageMarginRight: 0,
                    pageMarginTop: 10,
                    pageMarginBottom: 10,
                }"
                :lines="scoreOptions.showModulations ? [{
                    items: modulationsWithKeys.value.map(m => ({
                        lineNumber: m.startLine,
                        label: {
                            value: `${m.deg} (${m.calculatedKey})`,
                            position: 'bottom',
                        },
                    })),
                    color: 'rgb(34 197 94 / 0.4)',
                }] : []"
                :filters="scoreOptions.humdrumFilters"
            />

        </div>
    </UContainer>
</template>
