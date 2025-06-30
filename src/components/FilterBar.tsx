import { PopMartItem } from "@/types/collection";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FilterBarProps {
  filter: string;
  setFilter: (filter: string) => void;
  items: PopMartItem[];
}

export const FilterBar = ({ filter, setFilter, items }: FilterBarProps) => {
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
      </div>
    </div>
  );
};
