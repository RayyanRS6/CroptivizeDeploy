import { Edit, Loader2, Star } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import ProductForm from "./ProductForm"

// Format price for display
const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
    }).format(price)
}

// Format date for display
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-PK", {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

export default function ProductModals({
    isAddModalOpen,
    setIsAddModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    selectedProduct,
    formData,
    handleInputChange,
    handleImageChange,
    handleSelectChange,
    handleCheckboxChange,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    resetForm,
    openEditModal,
    isAddingProduct,
    isUpdatingProduct,
    isDeletingProduct
}) {
    return (
        <>
            {/* Add Product Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                setIsAddModalOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[600px] max-h-[92vh]">
                    <DialogHeader>
                        <DialogTitle>Add New Product</DialogTitle>
                        <DialogDescription>Fill in the details to add a new product to your inventory.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 max-h-[calc(92vh-9.5rem)] px-2">
                        <div className="py-2">
                            <ProductForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                                handleCheckboxChange={handleCheckboxChange}
                                handleImageChange={handleImageChange}
                            />
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddProduct} disabled={isAddingProduct}>
                            {isAddingProduct && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Product Modal */}
            {selectedProduct && (
                <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Product Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-6">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="md:w-1/3">
                                    <img
                                        src={selectedProduct.image || "/placeholder.jpg"}
                                        alt={selectedProduct.name}
                                        className="w-full h-auto rounded-md border object-cover aspect-square"
                                    />
                                </div>
                                <div className="md:w-2/3 space-y-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline">{selectedProduct.category}</Badge>
                                            {selectedProduct.isFeatured && (
                                                <Badge variant="default" className="bg-primary">
                                                    Featured
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-primary text-primary" />
                                        <span className="font-medium">{selectedProduct.rating.toFixed(1)}</span>
                                    </div>
                                    <div className="text-2xl font-bold text-primary mb-1">{formatPrice(selectedProduct.price)}</div>
                                    <div className="mb-1">
                                        <a href={selectedProduct.link} className="underline text-blue-500" target="_blank">Link</a>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-1">Description</h4>
                                        <p className="text-sm text-muted-foreground line-clamp-3">{selectedProduct.description}</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground">Added on {formatDate(selectedProduct.createdAt)}</div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                                Close
                            </Button>
                            <Button
                                onClick={() => {
                                    setIsViewModalOpen(false)
                                    openEditModal(selectedProduct)
                                }}
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Product
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Edit Product Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) resetForm();
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                        <DialogDescription>Update the product details.</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-1 max-h-[calc(92vh-9.5rem)] px-2">
                        <div className="py-2">
                            <ProductForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSelectChange={handleSelectChange}
                                handleCheckboxChange={handleCheckboxChange}
                                handleImageChange={handleImageChange}
                                isEditing={true}
                            />
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEditProduct} disabled={isUpdatingProduct}>
                            {isUpdatingProduct && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 py-4">
                        {selectedProduct && (
                            <div className="flex items-center space-x-4">
                                <img
                                    src={selectedProduct.image || "/placeholder.svg?height=50&width=50"}
                                    alt={selectedProduct.name}
                                    className="w-12 h-12 rounded-md border object-cover"
                                />
                                <div>
                                    <p className="font-medium">{selectedProduct.name}</p>
                                    <p className="text-sm text-muted-foreground">{formatPrice(selectedProduct.price)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeletingProduct}>
                            {isDeletingProduct && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}