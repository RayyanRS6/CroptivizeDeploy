import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/ui/ProductCard"
import { useGetProductsQuery } from '@/services/productApi'

// Format price for display
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
    }).format(price)
}

export default function Shop() {
    // State for filters and pagination
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [sortOption, setSortOption] = useState("newest")
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [minRating, setMinRating] = useState(0)
    const [isFeatured, setIsFeatured] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(6) // More products per page for shop view

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on new search
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    // RTK Query hook for fetching products
    const { data, isLoading, isFetching } = useGetProductsQuery({
        page,
        limit,
        search: debouncedSearch,
        category: selectedCategory === "all" ? "" : selectedCategory,
        sort: sortOption,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 1000 ? priceRange[1] : undefined,
        minRating: minRating > 0 ? minRating : undefined,
        featured: isFeatured ? true : undefined
    });

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("all");
        setSortOption("newest");
        setPriceRange([0, 1000]);
        setMinRating(0);
        setIsFeatured(false);
        setPage(1);
    };

    // Extract data from the query response
    const products = data?.data?.products || [];
    const pagination = data?.data?.pagination || {
        totalDocs: 0,
        limit: 6,
        totalPages: 0,
        page: 1,
        hasPrevPage: false,
        hasNextPage: false,
    };

    const loading = isLoading || isFetching;

    // Desktop Filter Component
    const DesktopFilters = ({ className = "" }) => {
        return (
            <div className={`space-y-6 ${className}`}>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Checkbox
                                id="all-category"
                                checked={selectedCategory === "all"}
                                onCheckedChange={() => {
                                    setSelectedCategory("all");
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="all-category" className="ml-2">All Categories</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="fertilizers"
                                checked={selectedCategory === "Fertilizers"}
                                onCheckedChange={() => {
                                    setSelectedCategory("Fertilizers");
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="fertilizers" className="ml-2">Fertilizers</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="tools"
                                checked={selectedCategory === "Tools"}
                                onCheckedChange={() => {
                                    setSelectedCategory("Tools");
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="tools" className="ml-2">Tools</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="seeds"
                                checked={selectedCategory === "Seeds"}
                                onCheckedChange={() => {
                                    setSelectedCategory("Seeds");
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="seeds" className="ml-2">Seeds</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="pesticides"
                                checked={selectedCategory === "Pesticides"}
                                onCheckedChange={() => {
                                    setSelectedCategory("Pesticides");
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="pesticides" className="ml-2">Pesticides</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="equipment"
                                checked={selectedCategory === "Equipment"}
                                onCheckedChange={() => {
                                    setSelectedCategory("Equipment");
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="equipment" className="ml-2">Equipment</Label>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Rating</h3>
                    <div className="space-y-3">
                        <div className="flex items-center">
                            <Checkbox
                                id="any-rating"
                                checked={minRating === 0}
                                onCheckedChange={() => {
                                    setMinRating(0);
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="any-rating" className="ml-2">Any Rating</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="4-stars"
                                checked={minRating === 4}
                                onCheckedChange={() => {
                                    setMinRating(minRating === 4 ? 0 : 4);
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="4-stars" className="ml-2">4+ Stars</Label>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                id="3-stars"
                                checked={minRating === 3}
                                onCheckedChange={() => {
                                    setMinRating(minRating === 3 ? 0 : 3);
                                    setPage(1);
                                }}
                            />
                            <Label htmlFor="3-stars" className="ml-2">3+ Stars</Label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="featured-products"
                        checked={isFeatured}
                        onCheckedChange={(checked) => {
                            setIsFeatured(checked);
                            setPage(1);
                        }}
                    />
                    <Label htmlFor="featured-products">Featured Products Only</Label>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={resetFilters}
                >
                    Reset Filters
                </Button>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 xl:px-2 py-8 md:py-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Shop</h1>
                    <p className="mt-2 text-muted-foreground">Browse our collection of agricultural products</p>
                </div>

                {/* Search and Filter - Mobile */}
                <div className="flex gap-2 md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Filters</SheetTitle>
                                <SheetDescription>Narrow down your product search</SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 px-1">
                                <DesktopFilters />
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="flex-1">
                        <Input
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Search and Sort - Desktop */}
                <div className="hidden gap-4 md:flex">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="w-[300px] pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={sortOption} onValueChange={(value) => {
                        setSortOption(value);
                        setPage(1);
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price_asc">Price: Low to High</SelectItem>
                            <SelectItem value="price_desc">Price: High to Low</SelectItem>
                            <SelectItem value="rating_desc">Highest Rated</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active filters display */}
            {(selectedCategory !== "all" || priceRange[0] > 0 || priceRange[1] < 1000 || minRating > 0 || isFeatured) && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCategory !== "all" && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Category: {selectedCategory}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setSelectedCategory("all")}
                            >
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setPriceRange([0, 1000])}
                            >
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {minRating > 0 && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Rating: {minRating}+ Stars
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setMinRating(0)}
                            >
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {isFeatured && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            Featured Only
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setIsFeatured(false)}
                            >
                                <ChevronDown className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={resetFilters}
                    >
                        Clear All
                    </Button>
                </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-[220px_1fr]">
                {/* Filters - Desktop */}
                <div className="hidden md:block">
                    <DesktopFilters />
                </div>

                {/* Product Grid with Loading State */}
                <div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-96">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading products...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 text-center">
                            <h3 className="text-xl font-bold mb-2">No products found</h3>
                            <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                            <Button onClick={resetFilters}>Reset All Filters</Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="mt-8 flex items-center justify-center gap-6">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={!pagination.hasPrevPage}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <span className="text-sm font-medium">
                                    Page {pagination.page} of {pagination.totalPages || 1}
                                </span>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                                    disabled={!pagination.hasNextPage}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Product count and page info */}
            {!loading && products.length > 0 && (
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Showing {products.length} of {pagination.totalDocs} products
                </div>
            )}
        </div>
    );
}