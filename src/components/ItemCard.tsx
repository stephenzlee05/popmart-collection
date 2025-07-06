import { PopMartItem } from "@/types/collection";
import { Edit, Trash2, DollarSign, Package, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generatePopMartURL, generateStockXURL } from "@/utils/linkUtils";

interface ItemCardProps {
  item: PopMartItem;
  onEdit: () => void;
  onDelete: () => void;
}

export const ItemCard = ({ item, onEdit, onDelete }: ItemCardProps) => {
  const statusColors = {
    "Owned": "bg-green-100 text-green-800 border-green-200",
    "Wishlist": "bg-blue-100 text-blue-800 border-blue-200", 
    "For Sale": "bg-orange-100 text-orange-800 border-orange-200",
    "Sold": "bg-gray-100 text-gray-800 border-gray-200"
  };

  const calculateProfit = () => {
    if (item.sellPrice && item.status === "Sold") {
      // Round to two decimal places
      return Math.round((item.sellPrice - item.purchasePrice) * 100) / 100;
    }
    return null;
  };

  const profit = calculateProfit();
  const popMartURL = generatePopMartURL(item.character, item.series);
  const stockXURL = generateStockXURL(item.character, item.series, item.item);
  
  // Get image URL - use only image field
  const imageUrl = item.image

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
      {/* Image */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-pink-100 to-purple-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${item.character} ${item.item}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-gray-400" />
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onEdit}
            className="rounded-full bg-white/90 hover:bg-white shadow-lg"
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            className="rounded-full shadow-lg"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge className={statusColors[item.status]} variant="outline">
            {item.status}
          </Badge>
        </div>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.character} - {item.item}</h3>
        <p className="text-sm text-gray-600 mb-3">{item.series}</p>

        {/* External Links */}
        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => window.open(popMartURL, '_blank')}
          >
            <ExternalLink size={12} className="mr-1" />
            PopMart
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs"
            onClick={() => window.open(stockXURL, '_blank')}
          >
            <ExternalLink size={12} className="mr-1" />
            StockX
          </Button>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Paid:</span>
            <span className="font-medium text-gray-900">
              {Number.isInteger(item.purchasePrice) ? `$${item.purchasePrice}` : `$${item.purchasePrice.toFixed(2)}`}
            </span>
          </div>
          
          {item.sellPrice && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Sold:</span>
              <span className="font-medium text-gray-900">
                {Number.isInteger(item.sellPrice) ? `$${item.sellPrice}` : `$${item.sellPrice.toFixed(2)}`}
              </span>
            </div>
          )}
          
          {profit !== null && (
            <div className="flex items-center justify-between text-sm pt-2 border-t">
              <span className="text-gray-600">Profit:</span>
              <span className={`font-medium flex items-center ${
                profit >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {profit > 0 && "+"}
                {profit < 0 && "-"}
                ${Number.isInteger(Math.abs(profit)) ? Math.abs(profit) : Math.abs(profit).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {item.notes && (
          <p className="text-xs text-gray-500 mt-3 line-clamp-2">{item.notes}</p>
        )}
      </div>
    </div>
  );
};
