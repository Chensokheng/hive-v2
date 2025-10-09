"use client";

import { useEffect, useState } from "react";
import { BannerResponse } from "@/types-v2";
import { AsyncImage } from "loadable-image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Blur } from "transitions-kit";

import { cn } from "@/lib/utils";

export interface CarouselItem {
  id: string | number;
  image: string;
  alt: string;
  title?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
  ctaButtonTitle?: string;
  ctaButtonTitleColor?: string;
  ctaButtonUrl?: string;
  merchants: BannerResponse["data"][0]["merchants"];
}

export interface CarouselProps {
  items: CarouselItem[];
  height?: string;
  autoAdvance?: boolean;
  autoAdvanceInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  imageClassName?: string;
  arrowClassName?: string;
  dotClassName?: string;
  activeDotClassName?: string;
  onSlideChange?: (index: number) => void;
  renderSlide?: (item: CarouselItem, index: number) => React.ReactNode;
}

export function Carousel({
  items,
  height = "h-[200px] md:h-[500px]",
  autoAdvance = true,
  autoAdvanceInterval = 5000,
  showArrows = true,
  showDots = true,
  className,
  imageClassName,
  arrowClassName,
  dotClassName,
  activeDotClassName,
  onSlideChange,
  renderSlide,
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    const newIndex = (currentSlide + 1) % items.length;
    setCurrentSlide(newIndex);
    onSlideChange?.(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentSlide - 1 + items.length) % items.length;
    setCurrentSlide(newIndex);
    onSlideChange?.(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!autoAdvance || items.length <= 1) return;

    const timer = setInterval(nextSlide, autoAdvanceInterval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoAdvance, autoAdvanceInterval, items.length, currentSlide]);

  if (!items || items.length === 0) {
    return null;
  }

  const defaultRenderSlide = (item: CarouselItem) => (
    <div key={item.id} className="w-full h-full flex-shrink-0 relative">
      <AsyncImage
        src={item.image}
        Transition={Blur}
        style={{ width: "100%", height: "100%" }}
        className={imageClassName}
        loader={<div className="bg-gray-300" />}
      />

      {(item.title || item.description) && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-4 left-4 text-white">
            {item.title && (
              <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
            )}
            {item.description && (
              <p className="text-sm opacity-90">{item.description}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("relative w-full overflow-hidden", height, className)}>
      {/* Carousel Items */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {items.map((item, index) =>
          renderSlide ? renderSlide(item, index) : defaultRenderSlide(item)
        )}
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 rounded-full p-2 shadow-lg transition-all duration-200 z-10 backdrop-blur-sm",
              arrowClassName
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 rounded-full p-2 shadow-lg transition-all duration-200 z-10 backdrop-blur-sm",
              arrowClassName
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? cn("bg-white shadow-sm w-5", activeDotClassName)
                  : cn("bg-white/40 hover:bg-white/60", dotClassName)
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
