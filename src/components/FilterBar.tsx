import { PopMartItem } from "@/types/collection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, ArrowUpDown } from "lucide-react";

interface FilterBarProps {
  filter: string;
  setFilter: (filter: string) => void;
  seriesFilter: string;
  setSeriesFilter: (series: string) => void;
  items: PopMartItem[];
  sort: string;
  setSort: (sort: string) => void;
}

export const FilterBar = ({ filter, setFilter, seriesFilter, setSeriesFilter, items, sort, setSort }: FilterBarProps) => {
  // Get unique series from items
  const uniqueSeries = Array.from(new Set(items.map(item => item.series)));
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 p-4 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 flex-wrap">
        <Filter size={20} className="text-gray-600" />
        <span className="font-medium text-gray-600">Filter by:</span>
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
      <div className="flex items-center gap-2 min-w-[200px] justify-end flex-nowrap whitespace-nowrap">
        <ArrowUpDown size={20} className="text-gray-500" />
        <span className="text-gray-600 font-medium">Sort by:</span>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="rounded-xl border-purple-200">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="set">Set</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="profit">Profit</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
