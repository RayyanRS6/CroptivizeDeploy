import { useState, useRef, useEffect } from "react"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import DiseaseResult from "../../components/basic/DiseaseResult"
import { usePredictDiseaseMutation, useAddDiseaseMutation } from "../../services/diseaseApi"
import useAuth from "../../hooks/useAuth"
import { formatDiseaseName } from "@/lib/utils"

export default function DetectPage() {
    const [selectedImage, setSelectedImage] = useState(null)
    const [diseasePrediction, setDiseasePrediction] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isCameraActive, setIsCameraActive] = useState(false)
    const [cameraStream, setCameraStream] = useState(null)
    const videoRef = useRef(null)
    const fileInputRef = useRef(null)
    const containerRef = useRef(null)
    const { isAuthenticated } = useAuth()

    const handleFileUpload = (event) => {
        event.preventDefault()
        const file = event.target.files?.[0]
        if (file) {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onload = () => {
                    setSelectedImage(reader.result)
                }
                reader.readAsDataURL(file)
            } else {
                toast.error("Please upload an image file")
            }
        }
        event.target.value = ''
    }

    const handleDragOver = (event) => {
        event.preventDefault()
    }

    const handleDrop = (event) => {
        event.preventDefault()
        const file = event.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader()
            reader.onload = () => {
                setSelectedImage(reader.result)
            }
            reader.readAsDataURL(file)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        } else {
            toast.error("Please drop an image file")
        }
    }

    const startCamera = async () => {
        try {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop())
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment"
                }
            })

            setCameraStream(stream)
            setIsCameraActive(true)

        } catch (error) {
            console.error("Camera access error:", error)
            toast.error("Unable to access camera: " + error.message)
            setIsCameraActive(false)
        }
    }

    useEffect(() => {
        if (isCameraActive && cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream

            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play().catch(e => {
                    console.error("Error playing video:", e)
                    toast.error("Error playing video: " + e.message)
                })
            }

            videoRef.current.onerror = (e) => {
                console.error("Video error:", e)
                toast.error("Video error: " + e.target.error.message)
            }
        }
    }, [isCameraActive, cameraStream])

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => {
                track.stop()
            })
            setCameraStream(null)
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
        setIsCameraActive(false)
    }

    const captureImage = () => {
        if (videoRef.current) {
            try {
                const canvas = document.createElement("canvas")
                const video = videoRef.current

                if (video.videoWidth === 0 || video.videoHeight === 0) {
                    toast.error("Cannot capture image - video stream not ready")
                    return
                }

                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                const ctx = canvas.getContext("2d")
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                    const imageDataUrl = canvas.toDataURL("image/jpeg")
                    setSelectedImage(imageDataUrl)
                    stopCamera()
                    scrollIntoView("imgContainer")
                } else {
                    toast.error("Could not get canvas context")
                }
            } catch (error) {
                console.error("Error capturing image:", error)
                toast.error("Error capturing image: " + error.message)
            }
        } else {
            toast.error("Video element not available")
        }
    }

    const [predictDisease] = usePredictDiseaseMutation()
    const [addDisease] = useAddDiseaseMutation()

    const detectDisease = async () => {
        if (!selectedImage) return
        if (!isAuthenticated) {
            toast.error("Please log in to use this feature")
            return
        }

        setIsLoading(true)
        try {
            const response = await predictDisease({ image: selectedImage }).unwrap()
            console.log("API Response:", response);

            // Check if Plant.id API detected a plant
            if (!response?.data?.isPlant) {
                toast.error(response?.data?.message || "No plant or leaf detected in the image")
                setDiseasePrediction(null) // Clear any previous predictions
                setIsLoading(false)
                return
            }

            // Only proceed if we have disease data
            if (!response?.data?.disease) {
                toast.error("Could not detect any disease")
                setDiseasePrediction(null)
                setIsLoading(false)
                return
            }

            const diseaseLabel = response.data.disease;
            const confidence = response.data.confidence || 90;

            // Create the disease data structure based on the result
            const diseaseData = createDiseaseData(diseaseLabel);
            setDiseasePrediction([diseaseData]);

            if (diseaseLabel && !diseaseLabel.includes('Cotton_Healthy')) {
                const formattedName = formatDiseaseName(diseaseLabel);

                try {
                    await addDisease({
                        name: formattedName,
                        risk: confidence,
                    }).unwrap();
                    console.log("Disease saved to database");
                } catch (saveError) {
                    console.error("Error saving disease to database:", saveError);
                    // Don't show error to user as the detection was still successful
                }
            }

            toast.success("Disease detection completed!")
        } catch (error) {
            console.error("Error in disease detection:", error);
            toast.error("Error detecting disease")
            setDiseasePrediction(null)
        } finally {
            setIsLoading(false)
        }
    }

    const createDiseaseData = (diseaseLabel) => {
        // Map of static disease information
        const diseaseInfo = {
            "Cotton__Aphids": {
                id: "aphids",
                name: "Cotton Aphids",
                probability: 0.95,
                details: {
                    description: "Aphids are small sap-sucking insects that can cause significant damage to cotton plants. They cluster on the undersides of leaves and on stems, extracting plant sap and causing leaves to curl, yellow, and die.",
                    cause: "Aphids (Aphis gossypii) reproduce rapidly in warm conditions with high humidity. Overcrowding and excessive nitrogen fertilization can increase susceptibility.",
                    treatment: {
                        chemical: [
                            "Apply insecticidal soaps or neem oil for light infestations",
                            "For severe infestations, use approved insecticides like acetamiprid or flonicamid",
                            "Systemic insecticides can provide longer-term control"
                        ],
                        biological: [
                            "Introduce or encourage natural predators like ladybugs, green lacewings, and parasitic wasps",
                            "Plant companion crops that attract beneficial insects",
                            "Use microbial insecticides with entomopathogenic fungi"
                        ],
                        prevention: [
                            "Monitor fields regularly for early detection",
                            "Use reflective mulches to confuse and repel aphids",
                            "Maintain proper plant spacing to improve air circulation",
                            "Balance nitrogen fertilization to avoid excessive new growth",
                            "Remove heavily infested plants promptly"
                        ]
                    }
                }
            },
            "Cotton_Army_worm": {
                id: "armyworm",
                name: "Cotton Army Worm",
                probability: 0.92,
                details: {
                    description: "Army worms are caterpillars that feed on cotton leaves and bolls, causing extensive defoliation. They typically feed at night and can destroy large areas of cotton fields in a short time.",
                    cause: "Army worms (Spodoptera species) are the larval stage of night-flying moths. Outbreaks often occur after rainy periods followed by drought conditions.",
                    treatment: {
                        chemical: [
                            "Apply specific insecticides like chlorantraniliprole or spinosad",
                            "Use Bacillus thuringiensis (Bt) based products for organic control",
                            "Time applications for early instars when caterpillars are most vulnerable"
                        ],
                        biological: [
                            "Introduce parasitic wasps like Trichogramma that attack army worm eggs",
                            "Use entomopathogenic nematodes for soil-dwelling pupae",
                            "Apply biopesticides containing Beauveria bassiana or Metarhizium anisopliae"
                        ],
                        prevention: [
                            "Implement pheromone traps to monitor moth populations",
                            "Practice crop rotation to break the pest cycle",
                            "Maintain field sanitation by removing crop residues",
                            "Plant trap crops around cotton fields",
                            "Consider using Bt cotton varieties where available"
                        ]
                    }
                }
            },
            "Cotton_Bacterial_blight": {
                id: "bacterial-blight",
                name: "Cotton Bacterial Blight",
                probability: 0.94,
                details: {
                    description: "Bacterial blight is a serious disease causing water-soaked lesions on leaves that later turn brown with yellow halos. It can also affect stems and bolls, leading to significant yield losses.",
                    cause: "The bacterium Xanthomonas citri pv. malvacearum, which can survive in crop debris and seeds. Infection spreads rapidly in warm, humid conditions with frequent rainfall or overhead irrigation.",
                    treatment: {
                        chemical: [
                            "Apply copper-based bactericides as a preventative measure",
                            "Use streptomycin sulfate sprays where approved",
                            "Treat seeds with approved antimicrobial agents before planting"
                        ],
                        biological: [
                            "Apply biological control agents containing antagonistic bacteria",
                            "Use compost teas containing beneficial microorganisms",
                            "Implement biocontrol with phage therapy where available"
                        ],
                        prevention: [
                            "Plant resistant cotton varieties",
                            "Practice crop rotation with non-host plants",
                            "Use certified disease-free seeds",
                            "Avoid overhead irrigation to reduce leaf wetness",
                            "Implement proper field sanitation by removing infected plant material",
                            "Avoid working in fields when plants are wet"
                        ]
                    }
                }
            },
            "Cotton_Healthy": {
                id: "healthy",
                name: "Healthy Cotton Plant",
                probability: 1.0,
                details: {
                    description: "This cotton plant appears healthy with no visible signs of disease or pest infestation. Healthy cotton plants have vibrant green leaves, strong stems, and proper boll development.",
                    cause: "Good agricultural practices, appropriate growing conditions, and effective pest management contribute to plant health.",
                    treatment: {
                        chemical: [],
                        biological: [],
                        prevention: [
                            "Continue regular monitoring for early detection of pests and diseases",
                            "Maintain balanced fertilization based on soil tests",
                            "Ensure adequate but not excessive irrigation",
                            "Practice integrated pest management (IPM)",
                            "Maintain proper plant spacing for good air circulation",
                            "Follow recommended crop rotation schedules"
                        ]
                    }
                }
            },
            "Cotton_Powdery_mildew": {
                id: "powdery-mildew",
                name: "Cotton Powdery Mildew",
                probability: 0.91,
                details: {
                    description: "Powdery mildew appears as white to grayish powdery patches on the upper surface of leaves. Severe infections can cause leaf yellowing, premature defoliation, and reduced photosynthesis leading to yield loss.",
                    cause: "Fungal pathogen Leveillula taurica that thrives in moderate temperatures (60-80°F) with high humidity but dry leaf surfaces. Dense plant canopies create favorable conditions.",
                    treatment: {
                        chemical: [
                            "Apply sulfur-based fungicides at early stages of infection",
                            "Use systemic fungicides like triazoles or strobilurins for established infections",
                            "Alternate fungicide classes to prevent resistance development"
                        ],
                        biological: [
                            "Apply biological fungicides containing Bacillus subtilis",
                            "Use compost teas with beneficial microorganisms",
                            "Spray diluted milk solution (1:10 ratio with water) as an organic control"
                        ],
                        prevention: [
                            "Plant resistant varieties when available",
                            "Ensure proper plant spacing to improve air circulation",
                            "Avoid excessive nitrogen fertilization",
                            "Remove and destroy infected plant parts",
                            "Implement drip irrigation to keep foliage dry",
                            "Practice crop rotation with non-host plants"
                        ]
                    }
                }
            },
            "Cotton__Target_spot": {
                id: "target-spot",
                name: "Cotton Target Spot",
                probability: 0.93,
                details: {
                    description: "Target spot causes circular lesions with concentric rings and dark margins on leaves, resembling targets. Severe infections lead to defoliation, particularly in the lower canopy, affecting yield and quality.",
                    cause: "The fungal pathogen Corynespora cassiicola, which favors warm, humid conditions with prolonged leaf wetness. The disease is more severe in dense canopies with poor air circulation.",
                    treatment: {
                        chemical: [
                            "Apply strobilurin fungicides at first symptom appearance",
                            "Use azoxystrobin, pyraclostrobin, or fluxapyroxad+pyraclostrobin",
                            "Implement fungicide programs with different modes of action"
                        ],
                        biological: [
                            "Apply Trichoderma-based biological fungicides",
                            "Use copper-based products in organic production systems",
                            "Implement biological control agents with antagonistic fungi"
                        ],
                        prevention: [
                            "Plant resistant or tolerant varieties when available",
                            "Practice crop rotation with non-host crops",
                            "Ensure optimal plant spacing for good air circulation",
                            "Manage irrigation to minimize leaf wetness duration",
                            "Remove volunteer cotton and weeds that may harbor the pathogen",
                            "Apply balanced fertilization based on soil tests to avoid excessive vegetative growth"
                        ]
                    }
                }
            }
        };

        // Return the corresponding disease info or a default/error message
        return diseaseInfo[diseaseLabel] || {
            id: "unknown",
            name: "Unknown Condition",
            probability: 0.7,
            details: {
                description: "The condition could not be identified with certainty. Please consult with a local agricultural extension office or plant pathologist for further diagnosis.",
                cause: "Unknown - could be environmental stress, nutrient deficiency, or an early stage of disease.",
                treatment: {
                    chemical: [
                        "No specific treatments recommended without proper diagnosis"
                    ],
                    biological: [
                        "No specific treatments recommended without proper diagnosis"
                    ],
                    prevention: [
                        "Monitor the plant closely for any changes in symptoms",
                        "Ensure proper watering, fertilization, and growing conditions",
                        "Consider submitting a sample to a plant diagnostic laboratory",
                        "Take clear close-up photos from multiple angles for better remote diagnosis"
                    ]
                }
            }
        };
    };

    const scrollIntoView = (elementId) => {
        setTimeout(() => {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop())
            }
        }
    }, [cameraStream])

    useEffect(() => {
        if (selectedImage) {
            // Use setTimeout to ensure the DOM has updated
            setTimeout(() => {
                const element = document.getElementById("imgContainer");
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100); // Short delay to ensure render completes
        }
    }, [selectedImage]);

    return (
        <div className="max-w-4xl mx-auto lg:px-0 px-4 py-8 md:py-12">
            <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold md:text-4xl">Cotton Disease Detection</h1>
                <p className="mt-4 text-lg text-muted-foreground">Upload a photo or use your camera to detect cotton plant diseases</p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Upload Option */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Image</CardTitle>
                        <CardDescription>Drag and drop an image or click to upload</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 hover:bg-muted/50"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Drag and drop your image here or click to browse</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Camera Option */}
                <Card>
                    <CardHeader>
                        <CardTitle>Use Camera</CardTitle>
                        <CardDescription>Take a photo using your device camera</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative min-h-[200px] rounded-lg border-2 border-dashed" ref={containerRef}>
                            {isCameraActive ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="h-[200px] w-full rounded-lg object-cover"
                                        style={{ maxHeight: "200px" }}
                                    />
                                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                        <Button onClick={captureImage}>Capture</Button>
                                        <Button variant="outline" onClick={stopCamera}>
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div
                                    className="flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center p-4"
                                    onClick={startCamera}
                                >
                                    <Camera className="mb-4 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Click to activate camera</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Image Preview and Detection */}
            {selectedImage && (
                <div className="mt-8 md:w-1/2 mx-auto" id="imgContainer">
                    <Card>
                        <CardHeader className="relative">
                            <CardTitle>Selected Image</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-3 sm:-top-3 -top-2"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-hidden rounded-lg">
                                <img
                                    src={selectedImage}
                                    alt="Selected cotton plant"
                                    className="object-cover h-72 w-full"
                                />
                            </div>
                            <Button className="mt-4 w-full" onClick={detectDisease} disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Detecting...
                                    </>
                                ) : (
                                    "Detect Disease"
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Disease Detection Results */}
            {diseasePrediction && (
                <DiseaseResult
                    isOpen={!!diseasePrediction}
                    onClose={() => setDiseasePrediction(null)}
                    diseases={diseasePrediction}
                />
            )}
        </div>
    )
}