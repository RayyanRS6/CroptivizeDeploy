import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddOrderMutation } from "../../services/productApi";
import { Loader } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

// Helper function to format price
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
    }).format(price);
};

const ProductCard = ({ product }) => {
    const {
        _id,
        name,
        price,
        description,
        image,
        category,
        rating,
        isFeatured,
        link
    } = product;

    const { isAuthenticated } = useAuth();

    const [addOrder, { isLoading }] = useAddOrderMutation();
    const handleBuyNow = async () => {
        if (!isAuthenticated) {
            return toast.error("Please login to continue");
        }
        try {
            await addOrder(_id);
            window.open(link, "_blank");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md">
            {/* Featured badge */}
            {isFeatured && (
                <Badge className="absolute left-2 top-2 z-10 bg-primary text-white">
                    Featured
                </Badge>
            )}

            {/* Product image */}
            <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                    src={image || "/placeholder.jpg"}
                    alt={name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
            </div>

            {/* Product details */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                        {category}
                    </Badge>
                    <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                    </div>
                </div>

                <h3 className="mb-1 text-lg font-semibold tracking-tight hover:underline line-clamp-1">
                    {name}
                </h3>

                <p className="mb-3 line-clamp-2 text-sm text-gray-500">
                    {description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                        {formatPrice(price)}
                    </span>
                    <Button size="sm" onClick={handleBuyNow} disabled={isLoading}>
                        {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : "Buy Now"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;