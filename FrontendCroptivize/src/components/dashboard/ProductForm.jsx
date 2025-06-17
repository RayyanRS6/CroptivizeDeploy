import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import ImageInput from "../ui/ImageInput"

export default function ProductForm({ formData, handleInputChange, handleImageChange, handleSelectChange, handleCheckboxChange, isEditing = false }) {
    return (
        <div className="grid gap-4 py-4 px-3">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor={`${isEditing ? 'edit-' : ''}name`}>Product Name</Label>
                    <Input
                        id={`${isEditing ? 'edit-' : ''}name`}
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={`${isEditing ? 'edit-' : ''}price`}>Price</Label>
                    <Input
                        id={`${isEditing ? 'edit-' : ''}price`}
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor={`${isEditing ? 'edit-' : ''}description`}>Description</Label>
                <Textarea
                    id={`${isEditing ? 'edit-' : ''}description`}
                    name="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor={`${isEditing ? 'edit-' : ''}category`}>Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Fertilizers">Fertilizers</SelectItem>
                            <SelectItem value="Tools">Tools</SelectItem>
                            <SelectItem value="Seeds">Seeds</SelectItem>
                            <SelectItem value="Pesticides">Pesticides</SelectItem>
                            <SelectItem value="Equipment">Equipment</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor={`${isEditing ? 'edit-' : ''}rating`}>Rating</Label>
                    <Input
                        id={`${isEditing ? 'edit-' : ''}rating`}
                        name="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="0.0"
                        value={formData.rating}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor={`${isEditing ? 'edit-' : ''}image`}>Image</Label>
                <ImageInput
                    id={`${isEditing ? 'edit-' : ''}image`}
                    value={formData.image}
                    onChange={(value) => handleImageChange(value)}
                    placeholder="Select an image"
                    allowURL={false}
                    previewSize={150}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor={`${isEditing ? 'edit-' : ''}link`}>Product Link</Label>
                <Input
                    id={`${isEditing ? 'edit-' : ''}link`}
                    name="link"
                    placeholder="https://example.com"
                    value={formData.link}
                    onChange={handleInputChange}
                />
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox
                    id={`${isEditing ? 'edit-' : ''}isFeatured`}
                    checked={formData.isFeatured}
                    onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor={`${isEditing ? 'edit-' : ''}isFeatured`}>Featured Product</Label>
            </div>
        </div>
    )
}