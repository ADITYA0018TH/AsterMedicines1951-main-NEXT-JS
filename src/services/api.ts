import { Product } from "@/data/products";

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // Browser should use relative path
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL; // Use env var if set
  return 'http://localhost:3000'; // Default to localhost for SSR
};

const API_URL = `${getBaseUrl()}/api`;

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
};

export const fetchCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export const submitContactForm = async (data: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to send message');
      }
      return responseData;
    } else {
      // Handle non-JSON responses (like 404 HTML pages)
      const text = await response.text();
      console.error("Server returned non-JSON response:", text);
      throw new Error(`Server error: ${response.status} ${response.statusText}. Please check if the server is running and the endpoint exists.`);
    }
  } catch (error) {
    console.error("Submit contact form error:", error);
    throw error;
  }
};
