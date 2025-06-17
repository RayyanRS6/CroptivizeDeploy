import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImageInput({
    id,
    label,
    value = "",
    onChange,
    placeholder = "Select an image or enter URL",
    className = "",
    imageClassName = "",
    allowURL = true,
    required = false,
    disabled = false,
    previewSize = 100,
}) {
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef(null);

    // Set initial preview if value exists
    useEffect(() => {
        if (value) {
            let imageUrl;
            if (value instanceof File) {
                imageUrl = URL.createObjectURL(value);
            } else {
                imageUrl = value;
            }
            setPreview(imageUrl);
        } else {
            setPreview("");
        }
    }, [value]);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please select an image file");
            return;
        }

        // Create a preview URL and pass the file to parent
        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);
        setError("");

        // Convert to base64 or handle as needed by your application
        onChange(file);
    };

    // Handle URL input change
    const handleUrlChange = (e) => {
        const url = e.target.value;
        onChange(url);
    };

    // Handle removing the image
    const handleRemoveImage = () => {
        setPreview("");
        setError("");
        onChange("");

        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handle browse click
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <Label htmlFor={id}>
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
            )}

            <div className="space-y-4">
                {/* Image preview area */}
                {preview ? (
                    <div
                        className="relative"
                        style={{ width: previewSize, height: previewSize }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <img
                            src={preview}
                            alt="Preview"
                            className={`rounded-md object-cover border ${imageClassName}`}
                            style={{ width: previewSize, height: previewSize }}
                            onError={() => setError("Invalid image URL")}
                        />

                        {/* Clear button overlay */}
                        {(isHovered || error) && !disabled && (
                            <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={handleRemoveImage}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <p className="text-destructive text-sm mt-1">{error}</p>
                        )}
                    </div>
                ) : (
                    <div
                        className={`flex flex-col items-center justify-center border border-dashed rounded-md bg-muted/40 cursor-pointer ${disabled ? 'opacity-60' : 'hover:bg-muted/60'}`}
                        style={{ width: previewSize, height: previewSize }}
                        onClick={disabled ? undefined : handleBrowseClick}
                    >
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">No image</span>
                    </div>
                )}

                <div className="flex flex-col space-y-2">
                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        id={`${id}-file`}
                        accept="image/*"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={disabled}
                    />

                    {/* File select button */}
                    {/* <Button
                        type="button"
                        variant="outline"
                        onClick={handleBrowseClick}
                        disabled={disabled}
                        className="w-full"
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        Browse...
                    </Button> */}

                    {/* URL input option */}
                    {allowURL && (
                        <div className="relative">
                            <Input
                                id={id}
                                type="text"
                                placeholder={placeholder}
                                value={value || ""}
                                onChange={handleUrlChange}
                                className="w-full"
                                disabled={disabled}
                            />
                            {value && !disabled && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleRemoveImage}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    )}

                    {error && !preview && (
                        <p className="text-destructive text-sm">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}