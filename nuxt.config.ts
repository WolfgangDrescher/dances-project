import { fileURLToPath } from 'node:url';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    modules: [
        '@nuxt/ui',
        '@nuxt/fonts',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@nuxt/content',
    ],
    css: ['~/assets/main.css'],
    i18n: {
        strategy: 'prefix_except_default',
        locales: [
            { code: 'de', language: 'de-DE', file: 'de.yaml', dir: 'ltr' },
        ],
        defaultLocale: 'de',
        langDir: 'locales/',
    },
    vite: {
        worker: {
            format: 'es',
        },
        optimizeDeps: {
            exclude: ['verovio'],
        },
    },
    nitro: {
        publicAssets: [
            {
                baseURL: 'kern/schubert-dances',
                dir: fileURLToPath(new URL('./schubert-dances/kern', import.meta.url)),
                maxAge: 3600,
            },
        ],
    },
    colorMode: {
        preference: 'light',
    },
});
