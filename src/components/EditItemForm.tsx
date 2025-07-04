import { useState, useEffect } from "react";
import { PopMartItem } from "@/types/collection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { supabaseApi } from "@/services/supabaseApi";
import { CatalogData } from "@/services/catalogService";

interface EditItemFormProps {
  item: PopMartItem;
  onSubmit: (updatedItem: Partial<PopMartItem>) => void;
  onCancel: () => void;
}

export const EditItemForm = ({ item, onSubmit, onCancel }: EditItemFormProps) => {
  const [formData, setFormData] = useState({
    character: item.character,
    series: item.series,
    item: item.item,
    purchasePrice: item.purchasePrice.toString(),
    sellPrice: item.sellPrice?.toString() || "",
    status: item.status,
    notes: item.notes || "",
    image: item.image || ""
  });

  const [catalogData, setCatalogData] = useState<CatalogData>({
    characters: [],
    seriesByCharacter: {},
    itemsBySeries: {},
    seriesData: {}
  });

  const [loading, setLoading] = useState(true);

  // Load catalog data on component mount
  useEffect(() => {
    loadCatalogData();
  }, []);

  const loadCatalogData = async () => {
    try {
      setLoading(true);
      const data = await supabaseApi.getCatalog();
      setCatalogData(data);
    } catch (err) {
      console.error('Error loading catalog data:', err);
    } finally {
      setLoading(false);
    }
  };

  const availableSeries = formData.character ? catalogData.seriesByCharacter[formData.character] || [] : [];
  const availableItems: any[] = formData.series ? catalogData.itemsBySeries[formData.series] || [] : [];

  const handleCharacterChange = (character: string) => {
    setFormData({
      ...formData,
      character,
      series: "",
      item: "",
      image: ""
    });
  };

  const handleSeriesChange = (series: string) => {
    setFormData({
      ...formData,
      series,
      item: "",
      image: ""
    });
  };

  const handleItemChange = (item: string) => {
    let autoImage = "";
    
    if (formData.series && catalogData.itemsBySeries[formData.series]) {
      const found = (catalogData.itemsBySeries[formData.series] as any[]).find(i => i.name === item);
      if (found) {
        autoImage = found.image || "";
      }
    }
    
    setFormData({
      ...formData,
      item,
      image: autoImage
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...formData,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : undefined,
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Edit Item
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="character">Character *</Label>
          <Select value={formData.character || ""} onValueChange={handleCharacterChange}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select character" />
            </SelectTrigger>
            <SelectContent>
              {catalogData.characters.map((character) => (
                <SelectItem key={character} value={character}>{character}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="series">Series *</Label>
          <Select value={formData.series || ""} onValueChange={handleSeriesChange} disabled={!formData.character}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select series" />
            </SelectTrigger>
            <SelectContent>
              {availableSeries.map((series) => (
                <SelectItem key={series} value={series}>{series}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="item">Item *</Label>
          <Select value={formData.item || ""} onValueChange={handleItemChange} disabled={!formData.series}>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {availableItems.map((item) => (
                <SelectItem key={item.name} value={item.name}>{item.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Show image preview */}
        {formData.image && (
          <div className="space-y-2">
            <Label>Image Preview</Label>
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={formData.image}
                alt="Image preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price *</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              required
              value={formData.purchasePrice}
              onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})}
              placeholder="0.00"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellPrice">Sell Price</Label>
            <Input
              id="sellPrice"
              type="number"
              step="0.01"
              value={formData.sellPrice}
              onChange={(e) => setFormData({...formData, sellPrice: e.target.value})}
              placeholder="0.00"
              className="rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owned">Owned</SelectItem>
              <SelectItem value="Wishlist">Wishlist</SelectItem>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Add any notes about this item..."
            className="rounded-xl"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-xl"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
