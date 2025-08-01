"use client";
import React from "react";
import { ProductDisplayItem } from "@/lib/assistant";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import ProductCard from "./product-card";

interface ProductCarouselProps {
  item: ProductDisplayItem;
}

export default function ProductCarousel({ item }: ProductCarouselProps) {
  // Limit to maximum 3 products
  const displayProducts = item.products.slice(0, 3);
  
  return (
    <div className="w-full max-w-6xl mx-auto min-h-[600px] px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-800">Product Results</h3>
        <p className="text-sm text-zinc-600">
          Showing {displayProducts.length} products
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
          slidesToScroll: 1,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {displayProducts.map((product) => (
            <CarouselItem 
              key={product.product_id} 
              className="pl-4 basis-full sm:basis-1/2 flex-shrink-0"
            >
              <div className="h-full">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-12" />
        <CarouselNext className="hidden sm:flex -right-12" />
      </Carousel>

      {/* Mobile navigation hint */}
      <p className="text-xs text-gray-500 text-center mt-4 sm:hidden">
        Swipe to see more products
      </p>
    </div>
  );
}