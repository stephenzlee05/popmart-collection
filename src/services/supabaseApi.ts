import { supabase } from '@/integrations/supabase/client';
import { PopMartItem } from '@/types/collection';
import { getCatalog } from './catalogService';

export class SupabaseCollectionAPI {
  async getCollection(): Promise<PopMartItem[]> {
    const { data, error } = await supabase
      .from('collection_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      character: item.character,
      series: item.series,
      item: item.item,
      purchasePrice: item.purchase_price,
      sellPrice: item.sell_price,
      image: item.image,
      status: item.status as "Owned" | "Wishlist" | "For Sale" | "Sold",
      notes: item.notes,
      dateAdded: item.date_added,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  }

  async addItem(item: Omit<PopMartItem, "id" | "userId" | "dateAdded" | "createdAt" | "updatedAt">): Promise<PopMartItem> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('collection_items')
      .insert({
        user_id: user.id,
        character: item.character,
        series: item.series,
        item: item.item,
        purchase_price: item.purchasePrice,
        sell_price: item.sellPrice,
        image: item.image,
        status: item.status,
        notes: item.notes
      })
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      userId: data.user_id,
      character: data.character,
      series: data.series,
      item: data.item,
      purchasePrice: data.purchase_price,
      sellPrice: data.sell_price,
      image: data.image,
      status: data.status as "Owned" | "Wishlist" | "For Sale" | "Sold",
      notes: data.notes,
      dateAdded: data.date_added,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  }

  async updateItem(id: string, updates: Partial<PopMartItem>): Promise<void> {
    const updateData: any = {};
    
    if (updates.character !== undefined) updateData.character = updates.character;
    if (updates.series !== undefined) updateData.series = updates.series;
    if (updates.item !== undefined) updateData.item = updates.item;
    if (updates.purchasePrice !== undefined) updateData.purchase_price = updates.purchasePrice;
    if (updates.sellPrice !== undefined) updateData.sell_price = updates.sellPrice;
    if (updates.image !== undefined) updateData.image = updates.image;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { error } = await supabase
      .from('collection_items')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
  }

  async deleteItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('collection_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getCatalog() {
    // Use local catalog service instead of backend
    return getCatalog();
  }
}

export const supabaseApi = new SupabaseCollectionAPI();
