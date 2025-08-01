"use client";
import React, { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Truck } from "lucide-react";
import usePromptStore from "@/stores/usePromptStore";
import Image from "next/image";

interface ProductCardProps {
  product: {
    product_id: string;
    title: string;
    description: string;
    url: string;
    image_url: string;
    price_range?: {
      min: string;
      max: string;
      currency: string;
    };
    product_type?: string;
    tags?: string[];
    options?: Array<{
      name: string;
      values: string[];
    } | {
      [key: string]: string[];
    }>;
    variants?: Array<{
      variant_id: string;
      title: string;
      price: string;
      currency: string;
      image_url?: string;
      available: boolean;
      option1?: string;
      option2?: string;
    }>;
    availabilityMatrix?: string[];
    // Additional property for color-specific images
    colorImages?: {
      [colorName: string]: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { themeColor, accentColor } = usePromptStore();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Clean description by removing HTML tags and CSS
  const cleanDescription = (desc: string) => {
    if (!desc) return '';
    // Remove HTML tags and CSS rules
    return desc
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/@[^{]*{[^}]*}/g, '') // Remove CSS rules
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .substring(0, 150); // Limit length
  };
  
  const formatPrice = (price: string, currency: string) => {
    const symbol = currency === "CAD" ? "$" : currency;
    return `${symbol}${price}`;
  };

  const priceDisplay = product.price_range 
    ? (product.price_range.min === product.price_range.max
        ? formatPrice(product.price_range.min, product.price_range.currency)
        : `${formatPrice(product.price_range.min, product.price_range.currency)} - ${formatPrice(product.price_range.max, product.price_range.currency)}`)
    : 'Price not available';

  // Get available colors from options (handle both data structures)
  const colorOptions = product.options?.find(opt => {
    // New structure: { name: "Colours", values: [...] }
    if ('name' in opt && typeof opt.name === 'string' && (opt.name.toLowerCase() === 'colours' || opt.name.toLowerCase() === 'colors')) {
      return true;
    }
    // Legacy structure: { "Colours": [...] } or { "Colors": [...] }
    if ('Colours' in opt || 'Colors' in opt) {
      return true;
    }
    return false;
  });
  
  const colors: string[] = colorOptions 
    ? ('values' in colorOptions ? colorOptions.values : (colorOptions as any).Colours || (colorOptions as any).Colors || [])
    : (product.variants ? 
        // Extract unique colors from variant titles, prioritizing those with images
        [...new Set(product.variants
          .filter(v => v.image_url) // Prioritize variants with images
          .map(v => v.title?.split(' / ')[0])
          .filter(Boolean)
          .concat(
            // Add any remaining colors without images
            product.variants
              .filter(v => !v.image_url)
              .map(v => v.title?.split(' / ')[0])
              .filter(Boolean)
          )
        )]
        : []);
  
  // Initialize selected color with first available color
  const initialColor = colors.length > 0 && !selectedColor ? colors[0] : selectedColor;
  
  // Determine which image to show based on selected color
  const currentImage = useMemo(() => {
    if (!initialColor) return product.image_url;
    
    // First check if there's a specific color image mapping
    if (product.colorImages && product.colorImages[initialColor]) {
      return product.colorImages[initialColor];
    }
    
    // Then check variants for matching color
    if (product.variants) {
      const matchingVariant = product.variants.find(v => {
        if (v.option1?.toLowerCase() === initialColor.toLowerCase() && v.image_url) {
          return true;
        }
        // Also check if variant title starts with the color (for "BLACK / X LARGE" format)
        if (v.title?.toLowerCase().startsWith(initialColor.toLowerCase()) && v.image_url) {
          return true;
        }
        return false;
      });
      if (matchingVariant?.image_url) {
        return matchingVariant.image_url;
      }
    }
    
    // Fallback to default image
    return product.image_url;
  }, [initialColor, product.image_url, product.colorImages, product.variants]);

  // Get available sizes from options (handle both data structures)
  const sizeOptions = product.options?.find(opt => {
    // New structure: { name: "Sizes", values: [...] }
    if ('name' in opt && typeof opt.name === 'string' && opt.name.toLowerCase() === 'sizes') {
      return true;
    }
    // Legacy structure: { "Sizes": [...] }
    if ('Sizes' in opt) {
      return true;
    }
    return false;
  });
  
  const sizes: string[] = sizeOptions 
    ? ('values' in sizeOptions ? sizeOptions.values : (sizeOptions as any).Sizes || [])
    : [];

  // Check if product is in stock
  const hasStock = product.variants 
    ? product.variants.some(v => v.available)
    : (product.availabilityMatrix && product.availabilityMatrix.length > 0);

  // Check for sale tag
  const isOnSale = product.tags?.some(tag => tag.toLowerCase().includes('sale')) || false;

  return (
    <div className="group relative flex w-full max-w-sm min-h-[550px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 mx-auto">
      {/* Image section with gradient background */}
      <div 
        className="relative h-[200px] overflow-hidden p-4 flex-shrink-0"
        style={{ 
          background: `linear-gradient(to bottom right, ${themeColor}40, ${themeColor}20)` 
        }}
      >
        {isOnSale && (
          <div className="absolute top-3 left-3 z-10">
            <span 
              className="relative inline-block rounded-full px-3 py-1.5 text-xs font-bold text-white"
              style={{ backgroundColor: themeColor }}
            >
              SALE
            </span>
          </div>
        )}

        {/* Glow effect */}
        <div 
          className="absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 transform rounded-full blur-3xl"
          style={{ backgroundColor: `${themeColor}30` }}
        ></div>

        <div className="absolute inset-0 flex items-center justify-center p-5">
          <Image
            src={currentImage}
            alt={product.title}
            width={150}
            height={150}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 200px, 150px"
          />
        </div>
        
        {!hasStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
            <span className="text-white font-semibold text-lg bg-black/70 px-4 py-2 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-4 overflow-hidden">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold tracking-tight line-clamp-2 leading-tight" style={{ color: accentColor }}>
            {product.title}
          </h3>

          {product.product_type && (
            <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {product.product_type}
            </p>
          )}

          <p className="line-clamp-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {cleanDescription(product.description)}
          </p>
        </div>

        {/* Options display - compact */}
        <div className="flex flex-col gap-2">
          {colors.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Colors:</span>
              {colors.slice(0, 3).map((color, idx) => (
                <button
                  key={idx} 
                  onClick={() => setSelectedColor(color)}
                  className={`text-xs px-2 py-1 rounded-full transition-all cursor-pointer ${
                    (initialColor === color) ? 'ring-1 ring-offset-1' : ''
                  }`}
                  style={{ 
                    backgroundColor: (initialColor === color) ? accentColor : `${themeColor}20`,
                    color: (initialColor === color) ? 'white' : accentColor,
                    ...(initialColor === color ? { boxShadow: `0 0 0 1px ${accentColor}` } : {})
                  }}
                >
                  {color}
                </button>
              ))}
              {colors.length > 3 && (
                <span className="text-xs text-gray-400">+{colors.length - 3}</span>
              )}
            </div>
          )}

          {sizes.length > 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Sizes: {sizes.length > 3 ? `${sizes[0]} - ${sizes[sizes.length - 1]}` : sizes.slice(0, 3).join(", ")}
            </div>
          )}
        </div>

        {/* Price, shipping, and action button */}
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex flex-col gap-1">
            <div className="text-xl font-bold" style={{ color: accentColor }}>
              {priceDisplay}
            </div>
            <p className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
              <Truck className="mr-1 h-3 w-3" />
              Free Shipping
            </p>
          </div>

          <Button
            asChild
            className="w-full text-white transition-all"
            style={{ 
              backgroundColor: accentColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}