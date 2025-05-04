import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List, Search, BookmarkCheck } from "lucide-react";
interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  filter: "all" | "positive" | "neutral" | "negative" | "saved";
  setFilter: (filter: "all" | "positive" | "neutral" | "negative" | "saved") => void;
}
const SearchFilter = ({
  searchTerm,
  setSearchTerm,
  view,
  setView,
  filter,
  setFilter
}: SearchFilterProps) => {
  return <div className="mb-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input placeholder="Search stories..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
        </div>
        <div className="flex gap-2">
          <Button variant={view === "grid" ? "default" : "outline"} size="icon" onClick={() => setView("grid")} aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "list" ? "default" : "outline"} size="icon" onClick={() => setView("list")} aria-label="List view">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant={filter === "all" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("all")}>
          All
        </Badge>
        <Badge variant={filter === "positive" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("positive")}>
          Positive
        </Badge>
        <Badge variant={filter === "neutral" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("neutral")}>
          Neutral
        </Badge>
        <Badge variant={filter === "negative" ? "default" : "outline"} className="cursor-pointer" onClick={() => setFilter("negative")}>
          Negative
        </Badge>
        <Badge variant={filter === "saved" ? "default" : "outline"} className="cursor-pointer flex items-center gap-1" onClick={() => setFilter("saved")}>
          <BookmarkCheck className="h-3 w-3" />
          Saved
        </Badge>
      </div>
    </div>;
};
export default SearchFilter;