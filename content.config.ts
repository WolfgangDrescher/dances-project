import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
    collections: {
        pieces: defineCollection({
            source: 'pieces/**/*.yaml',
            type: 'data',
            schema: z.object({
                composer: z.string(),
                id: z.string(),
                filename: z.string(),
                key: z.string(),
                largerWorkTitle: z.string(),
                localRawFile: z.string(),
                majorMinor: z.string(),
                meter: z.string(),
                nr: z.number(),
                op: z.number(),
            }),
        }),
    },
});
