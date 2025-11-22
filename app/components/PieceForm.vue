<script setup>
const props = defineProps({
    form: {
        type: Array,
        required: true,
    }
});

const form = props.form || [];

const formsGroupedByName = computed(() => {
    return Object.entries(form.reduce((groups, item) => {
		const name = props.showKeys ? item.key : item.deg;
		if (!groups[name]) {
			groups[name] = [];
		}
		groups[name].push(item);
		return groups;
	}, {}));
});

function getWidth(startBeat, endBeat) {
    return (endBeat - startBeat) / maxBeat * 100;
}
function getLeft(startBeat) {
    return startBeat / maxBeat * 100;
}

</script>

<template>
    <div class="flex gap-4">
        <div v-for="segment in group[1]" class="absolute h-full" :style="{
                width: `${getWidth(segment.startBeat, segment.endBeat)}%`,
                left: `${getLeft(segment.startBeat)}%`,
            }">
                <UTooltip :text="segment.key">
                    <div class="w-full h-full bg-gray-200 rounded px-2 flex items-center hover:bg-primary-400 hover:shadow">
                        {{ group[0] }}
                    </div>
                </UTooltip>
            </div>
            
        <div v-for="part in form" class="p-2 bg-gray-200 rounded">
           
            {{ part.name }}
        </div>
    </div>
</template>
