export interface Restaurant {
  id: number;
  image: string;
  name: string;
  rating: number;
  category: string;
  location: string;
}

export interface CarouselItem {
  id: string | number;
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

export interface MerchantData {
  name: string;
  category: string;
  rating: number;
  address: string;
  heroImage: string;
  logo: string;
  status: "Open" | "Closed";
  closingTime: string;
}

export interface Category {
  id: string;
  label: string;
  count: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}
