<script setup>
const props = defineProps({
    form: {
        type: Array,
        required: true,
    }
});

const form = props.form || [];

const maxBeat = form[form.length - 1]?.endBeat ?? 0;

function getWidth(startBeat, endBeat) {
    return (endBeat - startBeat) / maxBeat * 100;
}
function getLeft(startBeat) {
    return startBeat / maxBeat * 100;
}

</script>

<template>
    <div class="relative h-24">
        <div v-for="part in form" class="absolute h-full p-4 bg-gray-300 rounded flex items-center" :style="{
                width: `${getWidth(part.startBeat, part.endBeat)}%`,
                left: `${getLeft(part.startBeat)}%`,
        }">
            {{ part.name }}
        </div>
    </div>
</template>
