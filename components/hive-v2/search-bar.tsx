"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import SearchIcon from "@/components/icon/search";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: () => void;
}

export default function SearchBar({
  placeholder = "What do you want today?",
  value,
  onChange,
  onSearch,
}: SearchBarProps) {
  return (
    <div className="mx-4 sm:mx-5 relative z-10">
      <Input
        className="bg-white rounded-full border-none shadow-none h-10 sm:h-12 px-4 sm:px-6 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <div
        className="absolute top-2 sm:top-3 right-4 sm:right-6 cursor-pointer"
        onClick={onSearch}
      >
        <SearchIcon />
      </div>
    </div>
  );
}
