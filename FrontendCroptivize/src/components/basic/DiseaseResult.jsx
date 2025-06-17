import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, Leaf, Amphora, Droplets, Bug, Shield, Languages, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Translation API function
const MYMEMORY_API = "https://api.mymemory.translated.net/get";

async function translateText(text, targetLang = "ur") {
    if (!text || text?.trim() === "") return "";

    try {
        // Build the API URL with query parameters
        const url = new URL(MYMEMORY_API);
        url.searchParams.append("q", text);
        url.searchParams.append("langpair", `en|${targetLang}`);

        // Optional: Add your email for higher usage limits
        // url.searchParams.append("de", "your.email@example.com");

        const response = await fetch(url.toString());

        if (!response.ok) {
            throw new Error("Translation failed");
        }

        const data = await response.json();

        // Check if we got a valid translation
        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            console.warn("Translation warning:", data.responseMessage || "Unknown issue");
            return text; // Return original text as fallback
        }
    } catch (error) {
        console.error("Translation error:", error);
        return text; // Return original text on error
    }
}

export default function DiseaseResult({ isOpen, onClose, diseases }) {
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedDiseases, setTranslatedDiseases] = useState(null);

    // Filter out any redundant diseases (if needed in future)
    const uniqueDiseases = diseases?.filter((disease) => !disease.redundant);

    // Handle translation
    const handleTranslate = async () => {
        setIsTranslating(true);
        try {
            const translated = await Promise.all(
                uniqueDiseases.map(async (disease) => {
                    // Translate name and description
                    const translatedName = await translateText(disease.name);
                    const translatedDescription = await translateText(disease.details.description);
                    const translatedCause = await translateText(disease.details.cause);

                    // Translate treatments
                    const translatedChemical = disease.details.treatment.chemical && disease.details.treatment.chemical.length > 0
                        ? await Promise.all(disease.details.treatment.chemical.map(item => translateText(item)))
                        : [];

                    const translatedBiological = disease.details.treatment.biological && disease.details.treatment.biological.length > 0
                        ? await Promise.all(disease.details.treatment.biological.map(item => translateText(item)))
                        : [];

                    const translatedPrevention = disease.details.treatment.prevention && disease.details.treatment.prevention.length > 0
                        ? await Promise.all(disease.details.treatment.prevention.map(item => translateText(item)))
                        : [];

                    return {
                        ...disease,
                        name: translatedName,
                        details: {
                            ...disease.details,
                            description: translatedDescription,
                            cause: translatedCause,
                            treatment: {
                                chemical: translatedChemical,
                                biological: translatedBiological,
                                prevention: translatedPrevention
                            }
                        }
                    };
                })
            );

            setTranslatedDiseases(translated);
        } catch (error) {
            console.error("Translation error:", error);
        } finally {
            setIsTranslating(false);
        }
    };

    const diseasesToShow = translatedDiseases || uniqueDiseases;

    const getDiseaseIcon = (diseaseName) => {
        const name = diseaseName.toLowerCase();
        if (name.includes("aphid") || name.includes("army") || name.includes("worm")) {
            return <Bug className="h-5 w-5" />;
        } else if (name.includes("bacter") || name.includes("target") || name.includes("powdery") || name.includes("mildew")) {
            return <Amphora className="h-5 w-5" />;
        } else if (name.includes("healthy")) {
            return <Shield className="h-5 w-5" />;
        } else {
            return <Leaf className="h-5 w-5" />;
        }
    };

    // Get the appropriate badge color based on disease type
    const getDiseaseBadgeVariant = (diseaseName) => {
        const name = diseaseName.toLowerCase();
        if (name.includes("healthy")) {
            return "success";
        } else if (name.includes("aphid") || name.includes("army") || name.includes("worm")) {
            return "destructive";
        } else {
            return "destructive";
        }
    };

    // Get badge text based on probability
    const getBadgeText = (probability, diseaseName) => {
        const name = diseaseName.toLowerCase();
        if (name.includes("healthy")) {
            return "Healthy Plant";
        } else if (probability > 0.9) {
            return "High Confidence";
        } else if (probability > 0.7) {
            return "Medium Confidence";
        } else {
            return "Low Confidence";
        }
    };

    // Loading skeleton for translation
    const TranslationLoadingSkeleton = () => (
        <div className="space-y-6 animate-pulse">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-32 bg-muted rounded" />
                            <div className="h-6 w-24 bg-muted rounded" />
                        </div>
                    </div>
                    <div className="h-20 bg-muted rounded" />
                    <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="h-4 bg-muted rounded w-full" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="flex h-full max-h-[90vh] flex-col overflow-hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
            >
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        Results
                    </DialogTitle>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTranslate}
                        disabled={isTranslating || !!translatedDiseases}
                        className="flex items-center gap-2"
                    >
                        {isTranslating ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Translating...
                            </>
                        ) : translatedDiseases ? (
                            <>
                                <Languages className="h-4 w-4" />
                                Translated
                            </>
                        ) : (
                            <>
                                <Languages className="h-4 w-4" />
                                Translate to Urdu
                            </>
                        )}
                    </Button>
                </DialogHeader>
                <ScrollArea className="pr-4 h-full pb-8">
                    {isTranslating ? (
                        <TranslationLoadingSkeleton />
                    ) : (
                        <div className="space-y-6">
                            {diseasesToShow?.map((disease) => (
                                <div key={disease.id} className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {getDiseaseIcon(disease.name)}
                                                <h3 className="text-lg font-semibold">{disease.name}</h3>
                                            </div>
                                            <Badge variant={getDiseaseBadgeVariant(disease.name)}>
                                                {getBadgeText(disease.probability, disease.name)}
                                            </Badge>
                                        </div>
                                    </div>

                                    <p className="text-sm">{disease.details.description}</p>

                                    {!disease.name.toLowerCase().includes("healthy") && disease.probability > 0.8 && (
                                        <Alert variant="destructive">
                                            <AlertTriangle className="h-4 w-4 !text-black" />
                                            <AlertTitle className="text-red-600">Action Required</AlertTitle>
                                            <AlertDescription className="text-sm !text-gray-500">
                                                This disease has been detected with high confidence. Immediate treatment is recommended.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {disease.name.toLowerCase().includes("healthy") && (
                                        <Alert variant="default" className="border-green-500 bg-green-50 dark:bg-green-900/20">
                                            <Shield className="h-4 w-4 text-green-500" />
                                            <AlertTitle className="text-green-600 dark:text-green-400">Healthy Plant</AlertTitle>
                                            <AlertDescription>
                                                Your cotton plant appears healthy. Continue with recommended care practices.
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    <Tabs defaultValue="cause" className="w-full">
                                        <TabsList className="grid grid-cols-3">
                                            <TabsTrigger value="cause">Cause</TabsTrigger>
                                            <TabsTrigger value="treatment">Treatment</TabsTrigger>
                                            <TabsTrigger value="prevention">Prevention</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="cause" className="p-4 bg-muted/30 rounded-md mt-2">
                                            <h4 className="font-medium mb-2">Cause</h4>
                                            <p className="text-sm">{disease.details.cause}</p>
                                        </TabsContent>
                                        <TabsContent value="treatment" className="mt-2">
                                            <Accordion type="single" collapsible className="w-full">
                                                {disease.details.treatment.chemical && disease.details.treatment.chemical.length > 0 && (
                                                    <AccordionItem value="chemical">
                                                        <AccordionTrigger>
                                                            <div className="flex items-center gap-2">
                                                                <Droplets className="h-4 w-4" />
                                                                Chemical Treatment
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <ul className="ml-4 space-y-2 list-disc">
                                                                {disease.details.treatment.chemical.map((treatment, index) => (
                                                                    <li key={index} className="text-sm">
                                                                        {treatment}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )}

                                                {disease.details.treatment.biological && disease.details.treatment.biological.length > 0 && (
                                                    <AccordionItem value="biological">
                                                        <AccordionTrigger>
                                                            <div className="flex items-center gap-2">
                                                                <Leaf className="h-4 w-4" />
                                                                Biological Treatment
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <ul className="ml-4 space-y-2 list-disc">
                                                                {disease.details.treatment.biological.map((treatment, index) => (
                                                                    <li key={index} className="text-sm">
                                                                        {treatment}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )}
                                            </Accordion>
                                        </TabsContent>
                                        <TabsContent value="prevention" className="p-4 bg-muted/30 rounded-md mt-2">
                                            <h4 className="font-medium mb-2">Prevention Methods</h4>
                                            <ul className="ml-4 space-y-2 list-disc">
                                                {disease.details.treatment.prevention.map((treatment, index) => (
                                                    <li key={index} className="text-sm">
                                                        {treatment}
                                                    </li>
                                                ))}
                                            </ul>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}