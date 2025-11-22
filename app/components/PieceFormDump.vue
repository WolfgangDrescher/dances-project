<script setup>
const { data: formData } = await useAsyncData('raw-form', () =>
  queryCollection('rawData').path('/raw-data/form').first(),
  { deep: false }
)

const props = defineProps({ form: Array });

</script>

<template>
    <PieceForm :form="formData" />
            <div v-for="part in form" class="p-2 bg-gray-200 rounded">
           
                {{ part.name }}
             </div>

</template>


<script>
  const { data: formData } = await useAsyncData(`form`, () => queryCollection('data').path('/data/form').first(), {deep: false });
</script>



