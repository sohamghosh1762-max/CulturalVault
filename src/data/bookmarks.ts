export type Bookmark = {
  id: number;
  title: string;
  image?: string;
  description?: string;
};

export const bookmarks: Bookmark[] = [
  {
    id: 1,
    title: "Nature — Forest",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80", // replaced broken URL
    description: "Lush forest scene",
  },
  {
    id: 2,
    title: "City — Night",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80", // replaced broken URL
    description: "City skyline at night",
  },
  {
    id: 8,
    title: "Archive Artifact",
    image:
      "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?auto=format&fit=crop&w=800&q=80",
    description: "Sample artifact image",
  },
];