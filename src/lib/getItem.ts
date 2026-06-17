export type Item = {
    id: string;
    title: string;
    description?: string;
    image?: string;
    metadata?: Record<string, any>;
};

const FALLBACK_ITEMS: Record<string, Item> = {
    '1': {
        id: '1',
        title: 'Sample Artifact — 1',
        description: 'A sample description for artifact 1.',
        image: 'https://via.placeholder.com/800x400?text=Artifact+1',
        metadata: { origin: 'Unknown', era: 'Contemporary' },
    },
    '8': {
        id: '8',
        title: 'Sample Artifact — 8',
        description: 'A sample description for artifact 8.',
        image: 'https://via.placeholder.com/800x400?text=Artifact+8',
        metadata: { origin: 'Archive', era: 'Historic' },
    },
};

export default async function getItem(id: string): Promise<Item | null> {
    // If you set ITEM_API_URL in .env.local (e.g. ITEM_API_URL=https://api.example.com),
    // this will attempt to fetch /items/:id from that base URL. Otherwise it returns a fallback.
    const base = process.env.ITEM_API_URL;
    if (base) {
        try {
            const url = `${base.replace(/\/$/, '')}/items/${encodeURIComponent(id)}`;
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) return null;
            const data = await res.json();
            // Basic normalization — adapt to your API shape as needed
            return {
                id: data.id?.toString() ?? id,
                title: data.title ?? data.name ?? `Item ${id}`,
                description: data.description ?? '',
                image: data.image ?? data.imageUrl ?? undefined,
                metadata: data.metadata ?? {},
            };
        } catch (e) {
            // network or parsing error -> fallback below
        }
    }

    return FALLBACK_ITEMS[id] ?? null;
}