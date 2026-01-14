export interface Phone {
  id: number;
  name?: string;
  nom?: string;
  memory?: string;
  image?: string;
  img?: string;
  image_url?: string;
  prixCash?: number;
  price?: number;
  prix?: number;
  prixLeasing?: number;
  price_leasing?: number;
  isCustom?: boolean;
}
export interface Product {
  id: number;
  name: string;
  image_url?: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  amount: number;
  product: Product;
}

export interface Order {
  id: number;
  reference_id: string | null;
  amount: number;
  amount_rest: number;
  status: "pending" | "waiting" | "confirmed" | "failed";
  created_at: string;
  items: OrderItem[];
  meta: any
}
