export interface CulturalItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: Category;
  tags: string[];
  imageUrl: string;
  location: string;
  era: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
  artifacts: Artifact[];
  curator: Curator;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  date: string;
}

export interface Curator {
  name: string;
  avatar: string;
  title: string;
}

export type Category =
  | "Architecture"
  | "Art"
  | "Music"
  | "Literature"
  | "Cuisine"
  | "Traditions"
  | "Crafts"
  | "Dance";

export interface FilterState {
  search: string;
  category: Category | "All";
  sortBy: SortOption;
  era: string;
}

export type SortOption = "newest" | "oldest" | "rating" | "title";

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationState;
  error?: string;
}
