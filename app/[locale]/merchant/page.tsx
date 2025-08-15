"use client";

import React, { use, useState } from "react";

import Breadcrumb from "@/components/hive/merchant/breadcrumb";
import CategorySidebar from "@/components/hive/merchant/category-sidebar";
import MerchantHeader from "@/components/hive/merchant/merchant-header";

export default function MerchantPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  // Mock data - in real app this would come from API
  const merchantData = {
    name: "Burger King BKK",
    category: "Fastfood",
    rating: 4.9,
    address: "257 Rue Pasteur No. 51, Phnom Penh, Cambodia",
    heroImage: "/fake/merchant-cover.png",
    logo: "/fake/merchant-logo.png",
    status: "Open" as const,
    closingTime: "11 PM",
  };

  const categories = [
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Burger King", href: "/restaurants" },
    { label: "Burger King BKK", active: true },
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-screen bg-primary-bg">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <CategorySidebar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />
            {/* Merchant Header */}
            <MerchantHeader {...merchantData} />

            {/* Mobile Category Sidebar - Only shown on mobile */}
            <div className="lg:hidden mb-6">
              <CategorySidebar
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                className="w-full"
              />
            </div>

            {/* Menu Content */}
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Menu -{" "}
                {categories.find((c) => c.id === activeCategory)?.label ||
                  "All"}
              </h2>

              {/* Placeholder for menu items */}
              <div className="text-center py-12 text-gray-500">
                <p>Menu items will be displayed here</p>
                <p className="text-sm mt-2">
                  Selected category: {activeCategory}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
