<script setup>
const props = defineProps({
    form: Array,
});
</script>

<template>
    <div class="flex gap-4">
        <div v-for="part in form" class="p-2 bg-gray-200 rounded">
            {{ part.name }}
        </div>
    </div>
</template>
