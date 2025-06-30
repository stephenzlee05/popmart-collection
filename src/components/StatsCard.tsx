import { PopMartItem } from "@/types/collection";
import { TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  items: PopMartItem[];
}

export const StatsCard = ({ items }: StatsCardProps) => {
  const totalSpent = items.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalEarned = items
    .filter(item => item.status === "Sold" && item.sellPrice)
    .reduce((sum, item) => sum + (item.sellPrice || 0), 0);
  const totalProfit = totalEarned - items
    .filter(item => item.status === "Sold")
    .reduce((sum, item) => sum + item.purchasePrice, 0);
  
  const ownedItems = items.filter(item => item.status === "Owned").length;
  const wishlistItems = items.filter(item => item.status === "Wishlist").length;
  const forSaleItems = items.filter(item => item.status === "For Sale").length;
  const soldItems = items.filter(item => item.status === "Sold").length;

  const stats = [
    {
      title: "Total Items",
      value: items.length,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Spent",
      value: `$${totalSpent.toFixed(2)}`,
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Total Earned",
      value: `$${totalEarned.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Net Profit",
      value: `$${totalProfit.toFixed(2)}`,
      icon: totalProfit >= 0 ? TrendingUp : TrendingDown,
      color: totalProfit >= 0 ? "text-green-600" : "text-red-600",
      bgColor: totalProfit >= 0 ? "bg-green-100" : "bg-red-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="rounded-2xl shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card className="rounded-2xl shadow-lg border-0 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Collection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-green-50">
              <div className="text-2xl font-bold text-green-600">{ownedItems}</div>
              <div className="text-sm text-green-600">Owned</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{wishlistItems}</div>
              <div className="text-sm text-blue-600">Wishlist</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">{forSaleItems}</div>
              <div className="text-sm text-orange-600">For Sale</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gray-50">
              <div className="text-2xl font-bold text-gray-600">{soldItems}</div>
              <div className="text-sm text-gray-600">Sold</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
