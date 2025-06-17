import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"

const DiseaseDetailDialog = ({ disease, open, onOpenChange }) => {
    if (!disease) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-3xl max-h-[96vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold">{disease.common_name}</DialogTitle>
                            <DialogDescription className="mt-1 italic">{disease.scientific_name}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {disease.images?.[0] && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                        <img
                            src={disease.images[0].regular_url || "/placeholder.jpg"}
                            alt={disease.common_name}
                            className="w-full object-cover max-h-80"
                        />
                    </div>
                )}

                <div className="mt-6 space-y-6">
                    {disease.description?.map((section, index) => (
                        <div key={`desc-${index}`} className="space-y-2">
                            <h3 className="text-lg font-semibold">{section.subtitle}</h3>
                            <p className="text-muted-foreground whitespace-pre-line">{section.description}</p>
                        </div>
                    ))}

                    {disease.solution?.length > 0 && (
                        <div className="space-y-4 mt-6">
                            <h2 className="text-xl font-bold">Solutions</h2>
                            {disease.solution.map((solution, index) => (
                                <div key={`solution-${index}`} className="space-y-2">
                                    <h3 className="text-lg font-semibold">{solution.subtitle}</h3>
                                    <p className="text-muted-foreground whitespace-pre-line">{solution.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {disease.host?.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Affects these plants:</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {disease.host.map((host, index) => (
                                    <span
                                        key={`host-${index}`}
                                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                                    >
                                        {host}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DiseaseDetailDialog