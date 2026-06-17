import { CulturalItem, FilterState, ApiResponse, PaginationState } from "@/types";

export const itemsService = {
  async getItems(
    filters: Partial<FilterState> = {},
    page = 1
  ): Promise<ApiResponse<CulturalItem[]>> {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category && filters.category !== "All") params.append("category", filters.category);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      params.append("page", page.toString());
      
      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch items.");
      
      const json = await res.json();
      return { 
        data: json.data, 
        pagination: json.pagination 
      };
    } catch (error) {
      return { data: [], error: "Failed to fetch items. Please try again." };
    }
  },

  async getItemById(id: string): Promise<ApiResponse<CulturalItem | null>> {
    try {
      const res = await fetch(`/api/items/${id}`);
      if (!res.ok) throw new Error("Item not found.");
      
      const json = await res.json();
      return { data: json.data };
    } catch (error) {
      return { data: null, error: "Failed to fetch item details." };
    }
  },

  async getFeaturedItems(): Promise<ApiResponse<CulturalItem[]>> {
    try {
      const res = await fetch(`/api/featured`);
      if (!res.ok) throw new Error("Failed to fetch featured items.");
      
      const json = await res.json();
      return { data: json.data };
    } catch (error) {
      return { data: [], error: "Failed to fetch featured items." };
    }
  },

  async getRelatedItems(id: string, category: string): Promise<ApiResponse<CulturalItem[]>> {
    try {
      const params = new URLSearchParams({ id, category });
      const res = await fetch(`/api/related?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch related items.");
      
      const json = await res.json();
      return { data: json.data };
    } catch (error) {
      return { data: [], error: "Failed to fetch related items." };
    }
  },
};
