import { BreadcrumbItem, CarouselItem, Category, MerchantData } from "@/types";

import { CouponData } from "@/components/hive/merchant/coupon";

export const nearbyRestaurants = [
  {
    id: 1,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.9,
    category: "Category",
    location: "Location",
  },
  {
    id: 2,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.9,
    category: "Category",
    location: "Location",
  },
  {
    id: 3,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.9,
    category: "Category",
    location: "Location",
  },
  {
    id: 4,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.9,
    category: "Category",
    location: "Location",
  },
  {
    id: 5,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.9,
    category: "Category",
    location: "Location",
  },
];

export const bestDealRestaurants = [
  {
    id: 6,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.8,
    category: "Deals",
    location: "Location",
  },
  {
    id: 7,
    image: "/assets/food.png",
    name: "Special Offers",
    rating: 4.7,
    category: "Discounts",
    location: "Location",
  },
  {
    id: 8,
    image: "/assets/food.png",
    name: "Value Meals",
    rating: 4.9,
    category: "Budget",
    location: "Location",
  },
  {
    id: 9,
    image: "/assets/food.png",
    name: "Happy Hour",
    rating: 4.6,
    category: "Drinks",
    location: "Location",
  },
  {
    id: 20,
    image: "/assets/food.png",
    name: "Happy Hour",
    rating: 4.6,
    category: "Drinks",
    location: "Location",
  },
  {
    id: 22,
    image: "/assets/food.png",
    name: "Happy Hour",
    rating: 4.6,
    category: "Drinks",
    location: "Location",
  },
  {
    id: 23,
    image: "/assets/food.png",
    name: "Happy Hour",
    rating: 4.6,
    category: "Drinks",
    location: "Location",
  },
];

export const forYouRestaurants = [
  {
    id: 10,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.9,
    category: "Popular",
    location: "Location",
  },
  {
    id: 11,
    image: "/assets/food.png",
    name: "Merchant Name",
    rating: 4.8,
    category: "Cuisine",
    location: "Location",
  },
  {
    id: 12,
    image: "/assets/food.png",
    name: "Trending Now",
    rating: 4.7,
    category: "Trending",
    location: "Location",
  },
  {
    id: 13,
    image: "/assets/food.png",
    name: "Must Try",
    rating: 4.9,
    category: "Featured",
    location: "Location",
  },
  {
    id: 14,
    image: "/assets/food.png",
    name: "Must Try",
    rating: 4.9,
    category: "Featured",
    location: "Location",
  },
  {
    id: 15,
    image: "/assets/food.png",
    name: "Must Try",
    rating: 4.9,
    category: "Featured",
    location: "Location",
  },
  {
    id: 16,
    image: "/assets/food.png",
    name: "Must Try",
    rating: 4.9,
    category: "Featured",
    location: "Location",
  },
];

// Hero-specific carousel with default data
export const heroCarouselImages: CarouselItem[] = [
  {
    id: 1,
    image: "/fake/merchant-slide.png",
    alt: "Asian cuisine selection",
  },
  {
    id: 3,
    image: "/fake/merchant-slide.png",
    alt: "Traditional Cambodian dishes",
  },
  {
    id: 4,
    image: "/fake/merchant-slide.png",
    alt: "Cocktails and appetizers",
  },
];

// Sample coupon data
export const merchantCoupons: CouponData[] = [
  {
    id: "coup1",
    discount: "$5",
    minSpend: "$50",
    title: "Buy from $50, apply code to WIN $5",
    description: "Get $5 off when you spend $50 or more",
    expiryDate: "2025-07-01",
    code: "SAVE5",
    type: "discount",
    isExpired: false,
    isUsed: false,
  },
  {
    id: "coup2",
    discount: "$10",
    minSpend: "$100",
    title: "Big Savings on Large Orders",
    description: "Save $10 when you order $100 or more",
    expiryDate: "2025-06-15",
    code: "BIG10",
    type: "discount",
    isExpired: false,
    isUsed: false,
  },
  {
    id: "coup3",
    discount: "20%",
    minSpend: "$25",
    title: "Weekend Special Discount",
    description: "20% off on weekend orders",
    expiryDate: "2025-05-30",
    code: "WEEKEND20",
    type: "discount",
    isExpired: false,
    isUsed: false,
  },
  {
    id: "coup4",
    discount: "$3",
    minSpend: "$30",
    title: "First Time Customer Bonus",
    description: "Welcome offer for new customers",
    expiryDate: "2024-12-31",
    code: "WELCOME3",
    type: "discount",
    isExpired: true,
    isUsed: false,
  },
  {
    id: "coup5",
    discount: "$15",
    minSpend: "$150",
    title: "Family Feast Deal",
    description: "Perfect for family orders",
    expiryDate: "2025-08-01",
    code: "FAMILY15",
    type: "discount",
    isExpired: false,
    isUsed: true,
  },
];

// Mock merchant data
export const merchantData: MerchantData = {
  name: "Burger King BKK",
  category: "Fastfood",
  rating: 4.9,
  address: "257 Rue Pasteur No. 51, Phnom Penh, Cambodia",
  heroImage: "/fake/merchant-cover.png",
  logo: "/fake/merchant-logo.png",
  status: "Open",
  closingTime: "11 PM",
};

// Menu categories
export const categories: Category[] = [
  { id: "All", label: "All", count: 45 },
  { id: "Recommended", label: "Recommended", count: 12 },
  { id: "Beef Burger", label: "Beef Burger", count: 8 },
  { id: "Chicken Burger", label: "Chicken Burger", count: 6 },
  { id: "Family Combo", label: "Family Combo", count: 4 },
  { id: "Fried Chicken", label: "Fried Chicken", count: 7 },
  { id: "Happy Meals", label: "Happy Meals", count: 3 },
  { id: "Ice-Blended", label: "Ice-Blended", count: 5 },
  { id: "Snacks", label: "Snacks", count: 8 },
  { id: "Tea", label: "Tea", count: 2 },
];

// Breadcrumb navigation items
export const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Burger King", href: "/restaurants" },
  { label: "Burger King BKK", active: true },
];
