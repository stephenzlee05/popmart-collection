import { PopMartItem } from "@/types/collection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FilterBarProps {
  filter: string;
  setFilter: (filter: string) => void;
  seriesFilter: string;
  setSeriesFilter: (series: string) => void;
  items: PopMartItem[];
}

export const FilterBar = ({ filter, setFilter, seriesFilter, setSeriesFilter, items }: FilterBarProps) => {
  // Get unique series from items
  const uniqueSeries = Array.from(new Set(items.map(item => item.series)));
  return (
    <div className="flex flex-wrap gap-4 mb-8 p-4 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-2 text-gray-600">
        <Filter size={20} />
        <span className="font-medium">Filter by:</span>
      </div>
      
      <div className="flex flex-wrap gap-4 flex-1">
        <div className="min-w-[140px]">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="rounded-xl border-purple-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Owned">Owned</SelectItem>
              <SelectItem value="Wishlist">Wishlist</SelectItem>
              <SelectItem value="For Sale">For Sale</SelectItem>
              <SelectItem value="Sold">Sold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-[180px]">
          <Select value={seriesFilter} onValueChange={setSeriesFilter}>
            <SelectTrigger className="rounded-xl border-purple-200">
              <SelectValue placeholder="Set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Sets</SelectItem>
              {uniqueSeries.map(series => (
                <SelectItem key={series} value={series}>{series}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
