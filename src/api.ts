import { SearchProduct, SearchResponse, SuggestionResponse } from './types';

const SEARCH_API_URL = import.meta.env.VITE_SEARCH_API_URL || 'https://search-service-fzdcrf2fxq-uc.a.run.app/api/v1/search';

const FALLBACK_PRODUCTS: SearchProduct[] = [
  {
    id: 'prod_breville_barista_touch',
    name: 'Barista Touch Espresso Machine',
    brand: 'Breville',
    sku: 'BES880BSS',
    category: 'espresso_machine',
    price: 999.95,
    width_cm: 32.2,
    height_cm: 40.7,
    depth_cm: 32.2,
    top_clearance_cm: 12.0,
    side_clearance_cm: 5.0,
    rear_clearance_cm: 5.0,
    image_url: 'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=600&auto=format&fit=crop&q=80',
    description: 'Automated touchscreen espresso machine with integrated precision grinder.',
    tags: ['espresso', 'coffee', 'breville', 'premium'],
  },
  {
    id: 'prod_vitamix_5200',
    name: '5200 Professional Blender',
    brand: 'Vitamix',
    sku: 'VM0103',
    category: 'blender',
    price: 499.95,
    width_cm: 22.2,
    height_cm: 52.0,
    depth_cm: 18.5,
    top_clearance_cm: 6.0,
    side_clearance_cm: 3.0,
    rear_clearance_cm: 3.0,
    image_url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&auto=format&fit=crop&q=80',
    description: 'Classic 64-ounce container blender engineered for high performance.',
    tags: ['blender', 'smoothie', 'vitamix', 'tall'],
  },
  {
    id: 'prod_delonghi_dedica',
    name: 'Dedica Deluxe Slim Espresso Machine',
    brand: "De'Longhi",
    sku: 'EC680M',
    category: 'espresso_machine',
    price: 299.95,
    width_cm: 14.9,
    height_cm: 30.5,
    depth_cm: 33.0,
    top_clearance_cm: 5.0,
    side_clearance_cm: 3.0,
    rear_clearance_cm: 4.0,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    description: 'Ultra-slim 6-inch wide manual espresso machine for tight counters.',
    tags: ['espresso', 'compact', 'slim', 'delonghi'],
  },
  {
    id: 'prod_breville_bambino',
    name: 'Bambino Plus Compact Espresso Machine',
    brand: 'Breville',
    sku: 'BES500BSS',
    category: 'espresso_machine',
    price: 499.95,
    width_cm: 19.5,
    height_cm: 31.0,
    depth_cm: 32.0,
    top_clearance_cm: 8.0,
    side_clearance_cm: 4.0,
    rear_clearance_cm: 4.0,
    image_url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80',
    description: 'Compact 3-second heat up espresso machine with auto milk texturing.',
    tags: ['espresso', 'compact', 'breville', 'fast'],
  },
  {
    id: 'prod_kitchenaid_artisan',
    name: 'Artisan Series 5-Quart Stand Mixer',
    brand: 'KitchenAid',
    sku: 'KSM150PSER',
    category: 'stand_mixer',
    price: 449.95,
    width_cm: 22.1,
    height_cm: 35.3,
    depth_cm: 35.8,
    top_clearance_cm: 15.0,
    side_clearance_cm: 5.0,
    rear_clearance_cm: 5.0,
    image_url: 'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=600&auto=format&fit=crop&q=80',
    description: 'Iconic tilt-head stand mixer with 10 speeds and 5-quart stainless steel bowl.',
    tags: ['baking', 'mixer', 'kitchenaid'],
  },
  {
    id: 'prod_ninja_airfryer_pro',
    name: 'Air Fryer Pro 4-in-1',
    brand: 'Ninja',
    sku: 'AF101',
    category: 'air_fryer',
    price: 129.95,
    width_cm: 27.9,
    height_cm: 33.8,
    depth_cm: 34.5,
    top_clearance_cm: 10.0,
    side_clearance_cm: 6.0,
    rear_clearance_cm: 6.0,
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80',
    description: '4-quart air fryer with wide temperature range for crisping and roasting.',
    tags: ['air fryer', 'ninja', 'healthy'],
  },
];

export interface SearchQueryParams {
  q?: string;
  category?: string;
  brand?: string;
  max_height_cm?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  sort?: string;
  page?: number;
  limit?: number;
}

export async function searchProducts(params: SearchQueryParams = {}): Promise<SearchResponse> {
  if (SEARCH_API_URL) {
    try {
      const url = new URL(`${SEARCH_API_URL}/search`);
      if (params.q) url.searchParams.set('q', params.q);
      if (params.category && params.category !== 'all') url.searchParams.set('category', params.category);
      if (params.brand) url.searchParams.set('brand', params.brand);
      if (params.max_height_cm) url.searchParams.set('max_height_cm', params.max_height_cm.toString());
      if (params.min_price) url.searchParams.set('min_price', params.min_price.toString());
      if (params.max_price) url.searchParams.set('max_price', params.max_price.toString());
      if (params.sort) url.searchParams.set('sort', params.sort);
      if (params.page) url.searchParams.set('page', params.page.toString());
      if (params.limit) url.searchParams.set('limit', params.limit.toString());

      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      // Fall through to offline fallback
    }
  }
    // Offline resilient fallback
    let items = [...FALLBACK_PRODUCTS];
    const q = (params.q || '').toLowerCase().trim();

    if (q) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (params.category && params.category !== 'all') {
      items = items.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params.brand) {
      items = items.filter((p) => p.brand.toLowerCase() === params.brand!.toLowerCase());
    }

    if (params.max_height_cm) {
      items = items.filter((p) => p.height_cm <= params.max_height_cm!);
    }

    if (params.min_price) {
      items = items.filter((p) => p.price >= params.min_price!);
    }

    if (params.max_price) {
      items = items.filter((p) => p.price <= params.max_price!);
    }

    if (params.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (params.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (params.sort === 'height_asc') {
      items.sort((a, b) => a.height_cm - b.height_cm);
    }

    const categories = [
      { id: 'espresso_machine', label: 'Espresso Machines', count: 3 },
      { id: 'blender', label: 'Blenders', count: 1 },
      { id: 'stand_mixer', label: 'Stand Mixers', count: 1 },
      { id: 'air_fryer', label: 'Air Fryers', count: 1 },
    ];

    const brands = [
      { id: 'breville', label: 'Breville', count: 2 },
      { id: 'vitamix', label: 'Vitamix', count: 1 },
      { id: "de'longhi", label: "De'Longhi", count: 1 },
      { id: 'kitchenaid', label: 'KitchenAid', count: 1 },
      { id: 'ninja', label: 'Ninja', count: 1 },
    ];

    return {
      total_hits: items.length,
      page: params.page || 1,
      page_size: params.limit || 20,
      items,
      facets: {
        categories,
        brands,
        min_price: 129.95,
        max_price: 999.95,
        min_height_cm: 30.5,
        max_height_cm: 52.0,
      },
    };
}

export async function fetchSuggestions(q: string): Promise<SuggestionResponse> {
  if (SEARCH_API_URL) {
    try {
      const res = await fetch(`${SEARCH_API_URL}/search/suggest?q=${encodeURIComponent(q)}`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      // Fall through
    }
  }
  const cleanQ = (q || '').toLowerCase().trim();
  if (!cleanQ) return { query: '', suggestions: [], categories: [], products: [] };

  const suggestions: string[] = [];
  if ('espresso'.startsWith(cleanQ)) suggestions.push('Espresso Machine');
  if ('breville'.startsWith(cleanQ)) suggestions.push('Breville');
  if ('blender'.startsWith(cleanQ)) suggestions.push('Blender');
  if ('vitamix'.startsWith(cleanQ)) suggestions.push('Vitamix');

  const products = FALLBACK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(cleanQ) ||
      p.brand.toLowerCase().includes(cleanQ) ||
      p.category.toLowerCase().includes(cleanQ)
  ).slice(0, 3);

  return {
    query: q,
    suggestions,
    categories: [{ id: 'espresso_machine', label: 'Espresso Machines', count: 3 }],
    products,
  };
}
