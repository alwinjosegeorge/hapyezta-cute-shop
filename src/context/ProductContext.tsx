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

export interface Category {
  name: string;
  img: string;
  color: string;
}

const initialCategories: Category[] = [
  { name: "Cute Stationery", img: c1, color: "var(--teal)" },
  { name: "Pencil Cases", img: c2, color: "var(--coral)" },
  { name: "Journal Supplies", img: c3, color: "var(--yellow)" },
  { name: "Sling & School Bags", img: c4, color: "var(--purple)" },
  { name: "Bottles & Tumblers", img: c5, color: "var(--orange)" },
  { name: "Lunch Box", img: c6, color: "var(--coral)" },
  { name: "Gift Sets", img: c7, color: "var(--teal)" },
  { name: "Makeup Pouches", img: c8, color: "var(--purple)" },
];

interface ProductContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, "id"> & { id?: string }) => void;
  addCategory: (category: Category) => void;
  deleteProduct: (id: string) => void;
  deleteCategory: (name: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount safely (client-only)
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem("hapyezta-products");
      const storedCategories = localStorage.getItem("hapyezta-categories");

      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts);
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        setCategories(initialCategories);
      }
    } catch (error) {
      console.error("Failed to load products/categories from localStorage:", error);
      setProducts(initialProducts);
      setCategories(initialCategories);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("hapyezta-products", JSON.stringify(products));
      localStorage.setItem("hapyezta-categories", JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save products/categories to localStorage:", error);
    }
  }, [products, categories, isInitialized]);

  const addProduct = (newProduct: Omit<Product, "id"> & { id?: string }) => {
    const id = newProduct.id || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const productWithId = { ...newProduct, id } as Product;
    setProducts((prev) => [...prev, productWithId]);
  };

  const addCategory = (newCategory: Category) => {
    setCategories((prev) => {
      // Prevent duplicates by name
      if (prev.some((c) => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
        return prev;
      }
      return [...prev, newCategory];
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const deleteCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c.name !== name));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addProduct,
        addCategory,
        deleteProduct,
        deleteCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
