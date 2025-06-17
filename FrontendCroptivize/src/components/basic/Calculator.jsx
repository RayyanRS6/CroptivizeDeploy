import { useState } from "react"
import { Calculator, Leaf, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import useAuth from "@/hooks/useAuth"

// Fertilizer data for different crops (kg/ha)
const fertilizerData = [
    {
        crop: "Potato",
        N: 150,
        P2O5: 100,
        K2O: 150,
    },
    {
        crop: "Wheat",
        N: 120,
        P2O5: 60,
        K2O: 40,
    },
    {
        crop: "Cotton",
        N: 90,
        P2O5: 60,
        K2O: 60,
    },
    {
        crop: "Maize",
        N: 160,
        P2O5: 70,
        K2O: 80,
    },
    {
        crop: "Rice",
        N: 100,
        P2O5: 50,
        K2O: 50,
    },
    {
        crop: "Sugarcane",
        N: 200,
        P2O5: 80,
        K2O: 160,
    },
    {
        crop: "Soybean",
        N: 20,
        P2O5: 60,
        K2O: 80,
    },
    {
        crop: "Barley",
        N: 80,
        P2O5: 40,
        K2O: 40,
    },
    {
        crop: "Sunflower",
        N: 60,
        P2O5: 60,
        K2O: 80,
    },
    {
        crop: "Canola",
        N: 90,
        P2O5: 40,
        K2O: 40,
    },
]

// Maximum values for progress bars
const maxValues = {
    N: 200,
    P2O5: 100,
    K2O: 160,
}

export default function CalculatorComp() {
    const { isAuthenticated } = useAuth()
    const [selectedCrop, setSelectedCrop] = useState("")
    const [area, setArea] = useState("")
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleCalculate = () => {
        if (!isAuthenticated) {
            setError("Please login to use this feature")
            return
        }
        // Reset error
        setError(null)

        // Validate inputs
        if (!selectedCrop) {
            setError("Please select a crop")
            return
        }

        const areaValue = Number.parseFloat(area)
        if (isNaN(areaValue) || areaValue <= 0) {
            setError("Please enter a valid area (greater than 0)")
            return
        }

        // Find the selected crop data
        const cropData = fertilizerData.find((crop) => crop.crop === selectedCrop)
        if (!cropData) {
            setError("Crop data not found")
            return
        }

        // Calculate fertilizer requirements
        const calculatedResult = {
            crop: selectedCrop,
            area: areaValue,
            N: cropData.N * areaValue,
            P2O5: cropData.P2O5 * areaValue,
            K2O: cropData.K2O * areaValue,
        }

        setResult(calculatedResult)
    }

    const handleReset = () => {
        setSelectedCrop("")
        setArea("")
        setResult(null)
        setError(null)
    }

    return (
        <Card className="w-full max-w-3xl mx-auto pt-0">
            <CardHeader className="border-b bg-primary/5 py-4 rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    <CardTitle>Fertilizer Calculator</CardTitle>
                </div>
                <CardDescription>Calculate the required NPK fertilizer amounts for your crops</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="crop">
                                Select Crop
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 inline-block ml-1 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">Choose the crop you are planning to grow</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                                <SelectTrigger id="crop">
                                    <SelectValue placeholder="Select a crop" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fertilizerData.map((crop) => (
                                        <SelectItem key={crop.crop} value={crop.crop}>
                                            {crop.crop}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="area">
                                Area (hectares)
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="h-4 w-4 inline-block ml-1 text-muted-foreground cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="max-w-xs">
                                                Enter the size of your field in hectares (1 hectare = 10,000 square meters)
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Input
                                id="area"
                                type="number"
                                min="0.01"
                                step="0.01"
                                placeholder="Enter area in hectares"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="text-sm text-destructive">{error}</div>}

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleCalculate}>Calculate</Button>
                        <Button variant="outline" onClick={handleReset}>
                            Reset
                        </Button>
                    </div>

                    {result && (
                        <div className="mt-4 space-y-6">
                            <div className="rounded-lg border p-4 bg-muted/30">
                                <h3 className="sm:text-lg font-medium mb-2 flex items-center gap-2">
                                    <Leaf className="h-6 w-6 text-primary" />
                                    Fertilizer Requirements for {result.crop}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    For an area of {result.area} hectare{result.area !== 1 ? "s" : ""}, you will need:
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium">Nitrogen (N)</div>
                                            <div className="text-primary font-bold">{result.N.toFixed(2)} kg</div>
                                        </div>
                                        <Progress value={(result.N / result.area / maxValues.N) * 100} className="h-2" />
                                        <p className="text-xs text-muted-foreground">
                                            {(result.N / result.area).toFixed(2)} kg/ha - Essential for leaf growth and green vegetation
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium">Phosphorus (P₂O₅)</div>
                                            <div className="text-primary font-bold">{result.P2O5.toFixed(2)} kg</div>
                                        </div>
                                        <Progress value={(result.P2O5 / result.area / maxValues.P2O5) * 100} className="h-2" />
                                        <p className="text-xs text-muted-foreground">
                                            {(result.P2O5 / result.area).toFixed(2)} kg/ha - Important for root development and flowering
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="font-medium">Potassium (K₂O)</div>
                                            <div className="text-primary font-bold">{result.K2O.toFixed(2)} kg</div>
                                        </div>
                                        <Progress value={(result.K2O / result.area / maxValues.K2O) * 100} className="h-2" />
                                        <p className="text-xs text-muted-foreground">
                                            {(result.K2O / result.area).toFixed(2)} kg/ha - Enhances overall plant health and disease
                                            resistance
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm">
                                <h4 className="font-medium mb-2">Application Tips:</h4>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li>Apply nitrogen in multiple doses throughout the growing season for best results.</li>
                                    <li>Phosphorus is best applied before planting or during early growth stages.</li>
                                    <li>Potassium can be applied before planting or split with nitrogen applications.</li>
                                    <li>Consider soil testing to fine-tune these recommendations for your specific field conditions.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className={cn("flex justify-between text-xs text-muted-foreground border-t pt-2", !result && "hidden")}>
                <div>Values based on standard agricultural recommendations</div>
                <div>Last updated: March 2025</div>
            </CardFooter>
        </Card>
    )
}

