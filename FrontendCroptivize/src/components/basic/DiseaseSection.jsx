import { useEffect, useState, useTransition } from "react"
import { Link } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DiseaseDetailDialog from "./DiseaseDetailDialog"

const DiseasePreview = () => {
    const [isLoading, startTransition] = useTransition()
    const [diseases, setDiseases] = useState([])
    const [selectedDisease, setSelectedDisease] = useState(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const fetchDiseases = () => {
        try {
            startTransition(async () => {
                const response = await fetch(`https://perenual.com/api/pest-disease-list?key=sk-KQKo67bb330fb21ff8803`)
                const data = await response.json()
                startTransition(() => {
                    setDiseases(data.data.slice(9, 12))
                })
            })
        } catch (error) {
            console.error("Error fetching diseases:", error)
        }
    }

    useEffect(() => {
        fetchDiseases()
    }, [])

    const handleDiseaseClick = (disease) => {
        setSelectedDisease(disease)
        setDialogOpen(true)
    }

    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-2 py-12 md:py-16">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    Personal plant doctor in your pocket
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Have you ever searched &apos;what&apos;s wrong with my plant&apos;? The results may have been disappointing...
                    No more with Croptivize! Simply snap a photo of the issue to get a diagnosis. We&apos;ll give you detailed
                    info on the disease, what caused it, how to treat it, and how to prevent it.
                </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden border-2 border-dashed">
                    <Link to="/detect" className="block p-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="rounded-full bg-primary/10 p-6">
                                <Search className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Start diagnosing</h3>
                            <p className="text-sm text-muted-foreground">Upload or capture a photo to identify plant diseases</p>
                            <Button variant="secondary">Get Started</Button>
                        </div>
                    </Link>
                </Card>

                {isLoading
                    ? Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="aspect-square animate-pulse bg-muted" />
                                <CardHeader>
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                </CardHeader>
                            </Card>
                        ))
                    : diseases?.map((disease) => (
                        <Card
                            key={disease.id}
                            className="overflow-hidden pt-0 pb-4 cursor-pointer transition-shadow hover:shadow-md"
                            onClick={() => handleDiseaseClick(disease)}
                        >
                            {disease.images?.[0] && (
                                <div className="relative">
                                    <img
                                        src={disease.images[0].regular_url || "/placeholder.jpg"}
                                        alt={disease.common_name}
                                        loading="lazy"
                                        onEmptied={() => (this.src = "/placeholder.jpg")}
                                        className="object-cover max-h-60 w-full"
                                    />
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="line-clamp-1 leading-normal">{disease.common_name}</CardTitle>
                                <CardDescription>{disease.scientific_name}</CardDescription>
                            </CardHeader>
                            {disease.description && (
                                <CardContent>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">{disease.description[0].description}</p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
            </div>

            {/* Disease Detail Dialog */}
            <DiseaseDetailDialog
                disease={selectedDisease}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
        </section>
    )
}

export default DiseasePreview