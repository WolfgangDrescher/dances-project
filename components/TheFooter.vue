<script setup>
const localePath = useLocalePath();
</script>

<template>
    <footer class="py-6 md:py-12 bg-primary-500 text-white bg-pattern">
        <UContainer>
            <div class="grid md:grid-cols-3 gap-4">
                <div>
                    <h4 class="text-lg font-bold mb-2">Sitemap</h4>
                    <ul class="grid grid-cols-2 gap-x-2">
                        <li><NuxtLink :href="localePath('index')">{{ $t('home') }}</NuxtLink></li>
                    </ul>
                </div>
                <div></div>
                <div>
                    <h4 class="text-lg font-bold mb-2">Sitemap</h4>
                    <ul class="grid grid-cols-2 gap-x-2">
                        <li>
                            <NuxtLink :href="localePath('legal-notice')">{{ $t('legalNotice') }}</NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>
        </UContainer>
    </footer>
</template>
