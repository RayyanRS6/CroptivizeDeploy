import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

export default function ProductFilters({ className }) {
    return (
        <div className={className}>
            <Accordion type="single" collapsible defaultValue="category">
                <AccordionItem value="category">
                    <AccordionTrigger>Category</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="fertilizers" />
                                <label htmlFor="fertilizers" className="text-sm">
                                    Fertilizers
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="tools" />
                                <label htmlFor="tools" className="text-sm">
                                    Tools
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="seeds" />
                                <label htmlFor="seeds" className="text-sm">
                                    Seeds
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="pesticides" />
                                <label htmlFor="pesticides" className="text-sm">
                                    Pesticides
                                </label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="equipment" />
                                <label htmlFor="equipment" className="text-sm">
                                    Equipment
                                </label>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="px-2">
                            <Slider defaultValue={[0, 100]} max={500} step={10} className="my-4" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm">$0</span>
                                <span className="text-sm">$500</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="rating">
                    <AccordionTrigger>Rating</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            {[4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-2">
                                    <Checkbox id={`rating-${rating}`} />
                                    <label htmlFor={`rating-${rating}`} className="text-sm">
                                        {rating}+ Stars
                                    </label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

