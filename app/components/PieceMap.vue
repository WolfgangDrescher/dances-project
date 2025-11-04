<script setup>
const props = defineProps({
    modulations: {
        type: Array,
        required: true,
    },
    showKeys: Boolean,
});

const mods = props.modulations || [];

const modulationsGroupedByKey = computed(() => {
    return Object.entries(mods.reduce((groups, item) => {
		const key = props.showKeys ? item.key : item.deg;
		if (!groups[key]) {
			groups[key] = [];
		}
		groups[key].push(item);
		return groups;
	}, {}));
});

const maxBeat = mods[mods.length - 1]?.endBeat ?? 0;

function getWidth(startBeat, endBeat) {
    return (endBeat - startBeat) / maxBeat * 100;
}
function getLeft(startBeat) {
    return startBeat / maxBeat * 100;
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <div v-for="group in modulationsGroupedByKey" class="h-[1.5rem] relative">
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
        </div>
    </div>
</template>
