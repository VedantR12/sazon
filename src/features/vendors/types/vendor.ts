export type Vendor = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    category: string | null;
    best_item?: string;
    rating?: number;
    review_count?: number;
    price_range?: string;
    phone?: string;
    address?: string;
    image_url?: string;
};