import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductByIdQuery,
    useGetProductsQuery
} from "../../services/productApi"
import { toast } from "sonner"

// Import our modular components
import ProductFilters from "../../components/dashboard/ProductFilters"
import ProductList from "../../components/dashboard/ProductList"
import ProductModals from "../../components/dashboard/ProductModals"

export default function Products() {
    // State for filters and pagination
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all") // Changed from empty string to "all"
    const [sortOption, setSortOption] = useState("newest")
    const [priceRange, setPriceRange] = useState([0, 1000])
    const [minRating, setMinRating] = useState(0)
    const [isFeatured, setIsFeatured] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(5)
    const [debouncedSearch, setDebouncedSearch] = useState("")

    // State for modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [selectedProductId, setSelectedProductId] = useState(null)

    // State for form data
    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        description: "",
        image: "",
        rating: 0,
        category: "Fertilizers",
        isFeatured: false,
        link: ""
    })

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [searchTerm]);

    // RTK Query hooks
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

    const { data: productDetails } = useGetProductByIdQuery(selectedProductId, {
        skip: !selectedProductId
    });

    const [addProduct, { isLoading: isAddingProduct }] = useAddProductMutation();
    const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: isDeletingProduct }] = useDeleteProductMutation();

    // Update selected product when productDetails changes
    useEffect(() => {
        if (productDetails && productDetails.product) {
            setSelectedProduct(productDetails.product);
        }
    }, [productDetails]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "price" || name === "rating" ? Number.parseFloat(value) : value,
        }));
    };

    // Handle Image change
    const handleImageChange = (value) => {

        setFormData((prev) => ({
            ...prev,
            image: value,
        }));
    };

    // Handle select changes
    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle checkbox changes
    const handleCheckboxChange = (checked) => {
        setFormData((prev) => ({
            ...prev,
            isFeatured: checked,
        }));
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory("all");
        setSortOption("newest");
        setPriceRange([0, 1000]);
        setMinRating(0);
        setIsFeatured(false);
        setPage(1);
    };

    const handleModalOpen = () => {
        resetForm();
        setSelectedProduct(null);
        setSelectedProductId(null);
        setIsAddModalOpen(true);
    };

    // Handle add product
    const handleAddProduct = async () => {
        try {
            const result = await addProduct(formData).unwrap();
            if (result.success) {
                toast.success(result.message || "Product added successfully");
                setIsAddModalOpen(false);
                resetForm();
            } else {
                toast.error(result.message || "Failed to add product");
            }
        } catch (error) {
            toast.error(error.data?.message || "An error occurred while adding the product");
        }
    };

    // Handle edit product
    const handleEditProduct = async () => {
        if (!selectedProduct) return;

        try {
            const result = await updateProduct({
                id: selectedProduct._id,
                body: formData
            }).unwrap();

            if (result.success) {
                toast.success(result.message || "Product updated successfully");
                setIsEditModalOpen(false);
                resetForm();
            } else {
                toast.error(result.message || "Failed to update product");
            }
        } catch (error) {
            toast.error(error.data?.message || "An error occurred while updating the product");
        }
    };

    // Handle delete product
    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;

        try {
            const result = await deleteProduct(selectedProduct._id).unwrap();

            if (result.success) {
                toast.success(result.message || "Product deleted successfully");
                setIsDeleteModalOpen(false);
                setSelectedProduct(null);
            } else {
                toast.error(result.message || "Failed to delete product");
            }
        } catch (error) {
            toast.error(error.data?.message || "An error occurred while deleting the product");
        }
    };

    // Reset form data
    const resetForm = () => {
        setFormData({
            name: "",
            price: 0,
            description: "",
            image: "",
            rating: 0,
            category: "Fertilizers",
            isFeatured: false,
        });
        setSelectedProduct(null);
        setSelectedProductId(null);
    };

    // Open view modal with product data
    const openViewModal = (product) => {
        setSelectedProductId(product._id);
        setSelectedProduct(product);
        setIsViewModalOpen(true);
    };

    // Open edit modal with product data
    const openEditModal = (product) => {
        setSelectedProductId(product._id);
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            image: product.image || "",
            rating: product.rating,
            category: product.category,
            isFeatured: product.isFeatured,
            link: product.link
        });
        setIsEditModalOpen(true);
    };

    // Handle delete click
    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setIsDeleteModalOpen(true);
    };

    // Get pagination information from API response
    const pagination = data?.data?.pagination || {
        totalDocs: 0,
        limit: 10,
        totalPages: 0,
        page: 1,
        hasPrevPage: false,
        hasNextPage: false,
    };

    const products = data?.data?.products || [];
    const loading = isLoading || isFetching;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Button onClick={handleModalOpen}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            {/* Filter Component */}
            <ProductFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                isFeatured={isFeatured}
                setIsFeatured={setIsFeatured}
                setPage={setPage}
                resetFilters={resetFilters}
            />

            {/* Product List Component */}
            <ProductList
                products={products}
                loading={loading}
                pagination={pagination}
                setPage={setPage}
                openViewModal={openViewModal}
                openEditModal={openEditModal}
                handleDeleteClick={handleDeleteClick}
            />

            {/* Modal Components */}
            <ProductModals
                isAddModalOpen={isAddModalOpen}
                setIsAddModalOpen={setIsAddModalOpen}
                isViewModalOpen={isViewModalOpen}
                setIsViewModalOpen={setIsViewModalOpen}
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                selectedProduct={selectedProduct}
                formData={formData}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                handleImageChange={handleImageChange}
                handleCheckboxChange={handleCheckboxChange}
                handleAddProduct={handleAddProduct}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
                resetForm={resetForm}
                openEditModal={openEditModal}
                isAddingProduct={isAddingProduct}
                isUpdatingProduct={isUpdatingProduct}
                isDeletingProduct={isDeletingProduct}
            />
            {/* <div>
                <input type="file" accept="image/*" onChange={(e) => console.log(e.target.files)
                } />
            </div> */}
        </div>
    );
}