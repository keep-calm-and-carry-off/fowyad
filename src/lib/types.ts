export type Product = {
  sku: string;
  title: string;
  price: number | null;
  oldPrice: number | null;
  rating: number | null;
  reviews: number | null;
  image: string;
  images: string[];
  url: string;
  inStock: boolean;
};

export type Shop = {
  name: string;
  url: string;
  rating: number | null;
  reviews: number | null;
};

export type CatalogSource = "seed" | "ozon-public" | "seller-api";

export type CatalogSnapshot = {
  updatedAt: string;
  attemptedAt: string;
  source: CatalogSource;
  shop: Shop;
  products: Product[];
  error: string | null;
};
