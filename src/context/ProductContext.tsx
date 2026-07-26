import React, { createContext, useContext, useState, useEffect } from "react";
import { products as initialProducts, Product } from "@/lib/products";
import c1 from "@/assets/c1.jpg";
import c2 from "@/assets/c2.jpg";
import c3 from "@/assets/c3.jpg";
import c4 from "@/assets/c4.jpg";
import c5 from "@/assets/c5.jpg";
import c6 from "@/assets/c6.jpg";
import c7 from "@/assets/c7.jpg";
import c8 from "@/assets/c8.jpg";

import hero from "@/assets/hero.jpg";
import heroSlide1 from "@/assets/hero_slide_1.png";
import heroSlide2 from "@/assets/hero_slide_2.png";
import heroSlide3 from "@/assets/hero_slide_3.png";

import {
  getStoreData,
  addProductFn,
  updateProductFn,
  deleteProductFn,
  addCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
  updateHeroImagesFn,
} from "@/lib/api/db.functions";

export interface Category {
  name: string;
  img: string;
  color: string;
}

const initialCategories: Category[] = [];

const initialHeroImages: string[] = [];

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, "id"> & { id?: string }) => void;
  updateProduct: (product: Product) => void;
  addCategory: (category: Category) => void;
  deleteProduct: (id: string) => void;
  deleteCategory: (name: string) => void;
  updateCategory: (oldName: string, updatedCategory: Category) => void;
  heroImages: string[];
  updateHeroImages: (images: string[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from Neon PostgreSQL database on mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getStoreData();
        setProducts(data.products);
        setCategories(data.categories);
        setHeroImages(data.heroImages);
      } catch (error) {
        console.error("Failed to load store data from database, falling back to mock data:", error);
        setProducts(initialProducts);
        setCategories(initialCategories);
        setHeroImages(initialHeroImages);
      }
      setIsInitialized(true);
    }
    loadData();
  }, []);

  const addProduct = async (newProduct: Omit<Product, "id"> & { id?: string }) => {
    const id = newProduct.id || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const productWithId = { ...newProduct, id } as Product;
    
    // Optimistic update
    setProducts((prev) => [...prev, productWithId]);
    
    try {
      await addProductFn({
        ...newProduct,
        id,
        stockStatus: newProduct.stockStatus,
        colors: newProduct.colors,
        details: newProduct.details,
      });
    } catch (err) {
      console.error("Failed to save product to database:", err);
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    try {
      await updateProductFn({
        ...updatedProduct,
        stockStatus: updatedProduct.stockStatus,
      });
    } catch (err) {
      console.error("Failed to update product in database:", err);
    }
  };

  const addCategory = async (newCategory: Category) => {
    // Optimistic update
    setCategories((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
        return prev;
      }
      return [...prev, newCategory];
    });

    try {
      await addCategoryFn(newCategory);
    } catch (err) {
      console.error("Failed to add category to database:", err);
    }
  };

  const deleteProduct = async (id: string) => {
    // Optimistic update
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProductFn({ id });
    } catch (err) {
      console.error("Failed to delete product from database:", err);
    }
  };

  const deleteCategory = async (name: string) => {
    // Optimistic update
    setCategories((prev) => {
      const remaining = prev.filter((c) => c.name !== name);
      const defaultCat = remaining[0]?.name || "Cute Stationery";
      setProducts((productsPrev) =>
        productsPrev.map((p) =>
          p.category.toLowerCase() === name.toLowerCase() ? { ...p, category: defaultCat } : p
        )
      );
      return remaining;
    });

    try {
      await deleteCategoryFn({ name });
    } catch (err) {
      console.error("Failed to delete category from database:", err);
    }
  };

  const updateCategory = async (oldName: string, updatedCategory: Category) => {
    // Optimistic update
    setCategories((prev) =>
      prev.map((c) => (c.name.toLowerCase() === oldName.toLowerCase() ? updatedCategory : c))
    );
    setProducts((prev) =>
      prev.map((p) =>
        p.category.toLowerCase() === oldName.toLowerCase()
          ? { ...p, category: updatedCategory.name }
          : p
      )
    );

    try {
      await updateCategoryFn({ oldName, updatedCategory });
    } catch (err) {
      console.error("Failed to update category in database:", err);
    }
  };

  const updateHeroImages = async (newImages: string[]) => {
    // Optimistic update
    setHeroImages(newImages);

    try {
      await updateHeroImagesFn(newImages);
    } catch (err) {
      console.error("Failed to update hero images in database:", err);
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        updateProduct,
        addCategory,
        deleteProduct,
        deleteCategory,
        updateCategory,
        heroImages,
        updateHeroImages,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    if (typeof window === "undefined") {
      return {
        products: [],
        categories: [],
        heroImages: [],
        addProduct: () => {},
        updateProduct: () => {},
        addCategory: () => {},
        deleteProduct: () => {},
        deleteCategory: () => {},
        updateCategory: () => {},
        updateHeroImages: () => {},
      };
    }
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
