export interface PopMartItem {
  id: string;
  userId?: string;
  character: string;
  series: string;
  item: string;
  purchasePrice: number;
  sellPrice?: number;
  image?: string;
  status: "Owned" | "Wishlist" | "For Sale" | "Sold";
  notes?: string;
  dateAdded: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id: string;
  username?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}
