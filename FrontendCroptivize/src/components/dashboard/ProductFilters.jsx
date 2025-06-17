import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Search } from "lucide-react"

// Format price for display
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(price)
}

export default function ProductFilters({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    isFeatured,
    setIsFeatured,
    setPage,
    resetFilters,
}) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={(value) => {
                    setSelectedCategory(value);
                    setPage(1);
                }}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                        <SelectItem value="Tools">Tools</SelectItem>
                        <SelectItem value="Seeds">Seeds</SelectItem>
                        <SelectItem value="Pesticides">Pesticides</SelectItem>
                        <SelectItem value="Equipment">Equipment</SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Options */}
                <Select value={sortOption} onValueChange={(value) => {
                    setSortOption(value);
                    setPage(1);
                }}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="rating_desc">Highest Rated</SelectItem>
                    </SelectContent>
                </Select>

                {/* Advanced Filters */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div>
                                <h4 className="font-medium mb-2">Price Range</h4>
                                <div className="px-2">
                                    <Slider
                                        value={priceRange}
                                        min={0}
                                        max={1000}
                                        step={10}
                                        onValueChange={setPriceRange}
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-2 text-sm">
                                    <div>{formatPrice(priceRange[0])}</div>
                                    <div>{formatPrice(priceRange[1])}</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Minimum Rating</h4>
                                <Select value={String(minRating)} onValueChange={(value) => setMinRating(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Any Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Any Rating</SelectItem>
                                        <SelectItem value="1">1+ Star</SelectItem>
                                        <SelectItem value="2">2+ Stars</SelectItem>
                                        <SelectItem value="3">3+ Stars</SelectItem>
                                        <SelectItem value="4">4+ Stars</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured-filter"
                                    checked={isFeatured}
                                    onCheckedChange={setIsFeatured}
                                />
                                <Label htmlFor="featured-filter">Featured Products Only</Label>
                            </div>

                            <div className="flex justify-between">
                                <Button variant="outline" size="sm" onClick={resetFilters}>
                                    Reset Filters
                                </Button>
                                <Button size="sm" onClick={() => setPage(1)}>
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}