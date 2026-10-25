export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}
export interface ProductResponse {
  id: number;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

export interface ProductCreate {
  title: string;
  price: number;
  image: string;
  description?: string | null;
  category?: string | null;
}

export interface FastAPIError {
  detail?: string | { msg: string; loc: (string | number)[] }[];
}
