import { Camera, Scan, Leaf, Sprout } from "lucide-react"

export default function HowItWorks() {
    return (
        <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 xl:px-2">
            <div className="mx-auto max-w-[58rem] text-center">
                <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">How Disease Detection Works</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Get accurate plant disease diagnosis in just few simple steps
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, index) => (
                    <div key={step.title} className="relative flex flex-col items-center text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                            <step.icon className="h-10 w-10 text-primary" />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold">{step.title}</h3>
                            <p className="mt-2 text-muted-foreground">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="absolute hidden lg:block right-0 top-10 h-0.5 w-full max-w-[80px] translate-x-[calc(100%+1.5rem)] bg-border" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

const steps = [
    {
        title: "Capture Image",
        description: "Take or upload a photo of the affected plant leaf",
        icon: Camera,
    },
    {
        title: "AI Analysis",
        description: "Our AI system analyzes the image for disease patterns",
        icon: Scan,
    },
    {
        title: "Get Diagnosis",
        description: "Receive accurate disease identification results",
        icon: Leaf,
    },
    {
        title: "Treatment Plan",
        description: "Get personalized treatment recommendations",
        icon: Sprout,
    },
]

