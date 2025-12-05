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
    HELLOOOOO
    <div class="flex flex-col gap-2">
         <div v-for="row in props" class="h-[1.5rem] relative">
            <div v-for="segment in group[1]" class="absolute h-full" :style="{
                width: `${getWidth(segment.startBeat, segment.endBeat)}%`,
                left: `${getLeft(segment.startBeat)}%`,
            }">
                <UTooltip :text="segment.key">
                    <div class="w-full h-full bg-gray-200 rounded px-2 flex items-center hover:bg-primary-400 hover:shadow">
                        {{ part.name }}
                    </div>
                </UTooltip>
            </div>
        </div>
  </div>
</template>
    

