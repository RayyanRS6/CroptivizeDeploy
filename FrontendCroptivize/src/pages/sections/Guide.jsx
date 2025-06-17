import { useEffect, useState } from "react"
import { Cloud, Droplets, ThermometerSun, Wind, MapPin, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { useLocation } from "react-router-dom"

export default function Guide() {
    const location = useLocation()
    const [weather, setWeather] = useState(null)
    const [loading, setLoading] = useState(true)

    const getUserLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject)
            })
            const { latitude, longitude } = position.coords
            return { latitude, longitude }
        } catch (error) {
            console.error("Error getting user location:", error)
            return null
        }
    }

    // Fetch weather data
    const fetchWeather = async () => {
        try {
            const { latitude, longitude } = await getUserLocation()
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6eb9fbcaf4b9961369fd3435c742e98a&units=metric`)
            const data = await res.json()

            setWeather({
                temp: data.main.temp,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                rainChance: data.clouds.all,
                location: data.name
            })
        } catch (error) {
            console.error("Error fetching weather:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        fetchWeather()
        // Refresh weather data every 30 minutes
        const interval = setInterval(fetchWeather, 1800000)
        return () => clearInterval(interval)
    }, [])

    const getSprayingCondition = (windSpeed, rainChance) => {
        if (windSpeed > 15 || rainChance > 60) {
            return {
                status: "Unfavorable",
                description: "High wind speeds or rain probability. Avoid spraying.",
                color: "destructive",
            }
        } else if (windSpeed > 10 || rainChance > 30) {
            return {
                status: "Moderate",
                description: "Proceed with caution. Monitor conditions closely.",
                color: "warning",
            }
        } else {
            return {
                status: "Optimal",
                description: "Ideal conditions for spraying.",
                color: "success",
            }
        }
    }

    useEffect(() => {
        if (location.hash) {
            const elementId = location.hash.substring(1)
            const element = document.getElementById(elementId)
            if (element) {
                element.scrollIntoView({ behavior: "smooth" })
            }
        }
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 xl:px-2 py-8">
            <h1 className="text-3xl font-bold mb-6">Farming Guide</h1>
            <div className="grid gap-6 md:grid-cols-[1fr_300px]">
                {/* Main Content */}
                <div className="space-y-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
                            <TabsTrigger value="pests">Pest Control</TabsTrigger>
                            <TabsTrigger value="fertilizer">Fertilizers</TabsTrigger>
                        </TabsList>
                        <TabsContent value="general" className="space-y-4">
                            {plantCareGuides.general.map((tip, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{tip.title}</CardTitle>
                                        <CardDescription>{tip.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-6 space-y-2">
                                            {tip.tips.map((item, i) => (
                                                <li key={i} className="text-sm">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                        <TabsContent value="seasonal" className="space-y-4">
                            {plantCareGuides.seasonal.map((tip, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{tip.title}</CardTitle>
                                        <CardDescription>{tip.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-6 space-y-2">
                                            {tip.tips.map((item, i) => (
                                                <li key={i} className="text-sm">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                        <TabsContent value="pests" className="space-y-4">
                            {plantCareGuides.pestControl.map((tip, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{tip.title}</CardTitle>
                                        <CardDescription>{tip.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-6 space-y-2">
                                            {tip.tips.map((item, i) => (
                                                <li key={i} className="text-sm">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                        <TabsContent value="fertilizer" className="space-y-4">
                            {plantCareGuides.fertilizer.map((tip, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle>{tip.title}</CardTitle>
                                        <CardDescription>{tip.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc pl-6 space-y-2">
                                            {tip.tips.map((item, i) => (
                                                <li key={i} className="text-sm">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Weather Sidebar */}
                <div className="space-y-4">
                    <Card id="weather">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ThermometerSun className="h-5 w-5" />
                                Current Weather
                            </CardTitle>
                            {weather && (
                                <CardDescription className="flex items-center gap-1 text-xs text-muted-foreground ml-3 mt-1">
                                    <MapPin className="h-3 w-3" />
                                    {weather.location}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2 p-2 rounded-lg bg-muted/50">
                                                <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
                                                <div className="h-5 w-12 bg-muted rounded animate-pulse" />
                                                <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t space-y-2">
                                        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                                        <div className="space-y-2 mt-3">
                                            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                            <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ) : weather ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                                            <ThermometerSun className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{Math.round(weather.temp)}°C</span>
                                            <span className="text-xs text-muted-foreground">Temp</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                                            <Droplets className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{weather.humidity}%</span>
                                            <span className="text-xs text-muted-foreground">Humidity</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                                            <Wind className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{Math.round(weather.windSpeed * 3.6)} km/h</span>
                                            <span className="text-xs text-muted-foreground">Wind</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-muted/50">
                                            <Cloud className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">{weather.rainChance}%</span>
                                            <span className="text-xs text-muted-foreground">Rain</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h4 className="text-sm font-medium mb-2">Spraying Conditions</h4>
                                        {(() => {
                                            const condition = getSprayingCondition(weather.windSpeed, weather.rainChance)
                                            return (
                                                <Alert>
                                                    <AlertTitle className="flex items-center gap-2">
                                                        <Badge variant={condition.color}>{condition.status}</Badge>
                                                    </AlertTitle>
                                                    <AlertDescription className="mt-2 text-sm">{condition.description}</AlertDescription>
                                                </Alert>
                                            )
                                        })()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col justify-center gap-3 items-center">
                                    <p className="text-sm text-muted-foreground">Unable to load weather data</p>
                                    <Button
                                        onClick={fetchWeather}
                                        variant="outline"
                                        className="w-fit"
                                        disabled={loading}
                                    >
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Retry"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {quickTips.map((tip, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="font-medium">{tip.title}</p>
                                            <p className="text-muted-foreground">{tip.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

const plantCareGuides = {
    general: [
        {
            title: "Soil Management",
            description: "Essential practices for maintaining healthy soil",
            tips: [
                "Test soil pH regularly and adjust as needed",
                "Add organic matter to improve soil structure",
                "Practice crop rotation to maintain soil fertility",
                "Implement proper drainage systems",
                "Use mulch to retain moisture and suppress weeds",
            ],
        },
        {
            title: "Water Management",
            description: "Efficient irrigation practices",
            tips: [
                "Water deeply but less frequently to encourage deep root growth",
                "Water early in the morning to reduce evaporation",
                "Use drip irrigation when possible",
                "Monitor soil moisture levels regularly",
                "Adjust watering based on weather conditions",
            ],
        },
    ],
    seasonal: [
        {
            title: "Spring Preparation",
            description: "Getting ready for the growing season",
            tips: [
                "Clean and prepare garden tools",
                "Plan crop rotation",
                "Start seeds indoors",
                "Prepare soil beds",
                "Install irrigation systems",
            ],
        },
        {
            title: "Summer Care",
            description: "Managing crops during peak growing season",
            tips: [
                "Monitor for pest infestations",
                "Maintain regular watering schedule",
                "Apply mulch to retain moisture",
                "Harvest crops regularly",
                "Provide shade for sensitive plants",
            ],
        },
    ],
    pestControl: [
        {
            title: "Prevention Strategies",
            description: "Proactive approaches to avoid pest problems",
            tips: [
                "Choose pest-resistant plant varieties",
                "Practice good garden sanitation by removing debris",
                "Encourage beneficial insects like ladybugs and lacewings",
                "Use physical barriers like row covers",
                "Implement companion planting to repel pests naturally",
            ],
        },
        {
            title: "Organic Solutions",
            description: "Eco-friendly pest management techniques",
            tips: [
                "Use neem oil for fungal diseases and soft-bodied insects",
                "Apply diatomaceous earth for crawling insects",
                "Create homemade garlic or hot pepper sprays",
                "Introduce beneficial nematodes for soil pest control",
                "Use insecticidal soaps for aphids, mites, and whiteflies",
            ],
        },
        {
            title: "Integrated Pest Management",
            description: "Systematic approach to sustainable pest control",
            tips: [
                "Monitor plants regularly for early detection",
                "Identify pests correctly before treatment",
                "Use the least toxic method first",
                "Apply targeted treatments rather than broad-spectrum pesticides",
                "Rotate pest control methods to prevent resistance",
            ],
        },
    ],
    fertilizer: [
        {
            title: "Organic Fertilizers",
            description: "Natural nutrient sources for plants",
            tips: [
                "Use compost as a balanced soil amendment",
                "Apply well-rotted manure before planting",
                "Incorporate bone meal for phosphorus",
                "Use fish emulsion for quick-release nitrogen",
                "Try seaweed extract for micronutrients and growth stimulation",
            ],
        },
        {
            title: "Application Timing",
            description: "When to fertilize for maximum effectiveness",
            tips: [
                "Apply balanced fertilizer at planting time",
                "Side-dress heavy feeders when plants begin fruiting",
                "Avoid fertilizing during dormant periods",
                "Reduce nitrogen in late season for most crops",
                "Apply slow-release fertilizers less frequently",
            ],
        },
        {
            title: "Nutrient Deficiency Management",
            description: "Identifying and addressing plant nutrient needs",
            tips: [
                "Recognize yellow leaves as potential nitrogen deficiency",
                "Address purplish leaves with phosphorus supplements",
                "Treat leaf edge browning with potassium",
                "Use calcium supplements to prevent blossom end rot",
                "Apply magnesium (Epsom salts) for yellowing between leaf veins",
            ],
        },
    ],
}

const quickTips = [
    {
        title: "Daily Inspection",
        content:
            "Walk through your garden daily to catch problems early. Look for signs of pests, disease, or nutrient deficiencies.",
    },
    {
        title: "Water Wisely",
        content:
            "Water deeply and less frequently to encourage deep root growth. Water early in the morning to reduce evaporation.",
    },
    {
        title: "Mulching Benefits",
        content: "Apply organic mulch to conserve moisture, suppress weeds, and regulate soil temperature.",
    },
    {
        title: "Companion Planting",
        content: "Plant compatible crops together to maximize space and deter pests naturally.",
    },
    {
        title: "Natural Pest Control",
        content: "Encourage beneficial insects by planting flowers and herbs throughout your garden.",
    },
    {
        title: "Pruning",
        content: "Regular pruning improves air circulation and removes diseased or damaged plant parts.",
    },
    {
        title: "Soil Health",
        content: "Add compost regularly to improve soil structure and provide nutrients.",
    },
    {
        title: "Record Keeping",
        content: "Maintain a garden journal to track planting dates, varieties, and crop performance.",
    },
]

