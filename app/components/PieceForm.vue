<script setup>
const props = defineProps({
    form: {
        type: Array,
        required: true,
    }
});

const form = props.form || [];

//maxbeat: barnumShift + endBeat of last form part
const maxBeat = Math.max(...form.map(piece => (piece.endBeat ?? 0) + (piece.barnumShift ?? 0)));

//startbeat=startbeat+barnumShift
function getWidth(startBeat, endBeat) {
    return (endBeat - startBeat) / maxBeat * 100;
}

//left=startbeat+barnumShift
function getLeft(startBeat, barnumShift) {
    return (startBeat + (barnumShift ?? 0)) / maxBeat * 100;
}

</script>

<template>
    <div class="relative h-12">
        <div v-for="part in form" class="absolute h-full" :style="{
            width: `${getWidth(part.startBeat, part.endBeat, part.barnumShift)}%`,
            left: `${getLeft(part.startBeat, part.barnumShift)}%`,
        }">
            <UTooltip :text="part.name">
                <div class="w-full h-full bg-gray-200 rounded px-2 flex items-center hover:bg-primary-400 hover:shadow">
                    {{part.name}}
                </div>
            </UTooltip>
        </div>
    </div>
</template>
    

