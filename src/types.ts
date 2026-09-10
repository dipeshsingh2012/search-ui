export interface SearchProduct {
  id: string;
  name: string;
  brand: string;
  sku: string;
  category: string;
  price: number;
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  top_clearance_cm?: number;
  side_clearance_cm?: number;
  rear_clearance_cm?: number;
  image_url?: string;
  description?: string;
  tags?: string[];
}

export interface FacetValue {
  id: string;
  label: string;
  count: number;
}

export interface FacetsResponse {
  categories: FacetValue[];
  brands: FacetValue[];
  min_price: number;
  max_price: number;
  min_height_cm: number;
  max_height_cm: number;
}

export interface SearchResponse {
  total_hits: number;
  page: number;
  page_size: number;
  items: SearchProduct[];
  facets: FacetsResponse;
}

export interface SuggestionResponse {
  query: string;
  suggestions: string[];
  categories: FacetValue[];
  products: SearchProduct[];
}
