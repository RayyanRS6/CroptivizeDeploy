import CalculatorComp from "../../components/basic/Calculator"

export default function FertilizerCalculator() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold sm:mb-6 mb-4 text-center">Fertilizer Calculator</h1>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto sm:text-base text-sm text-center">
                Our fertilizer calculator helps you determine the optimal amount of nutrients needed for your crops. Simply
                select your crop type and enter your field area to get personalized NPK recommendations.
            </p>

            <CalculatorComp />

            <div className="mt-12 max-w-3xl">
                <h2 className="text-xl font-semibold mb-4">About NPK Fertilizers</h2>
                <p className="text-muted-foreground mb-4">
                    NPK fertilizers contain three main nutrients that are essential for plant growth:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                        <span className="font-medium text-foreground">Nitrogen (N):</span> Promotes leaf growth and forms proteins
                        and chlorophyll.
                    </li>
                    <li>
                        <span className="font-medium text-foreground">Phosphorus (P):</span> Contributes to root development,
                        flowering, and fruiting.
                    </li>
                    <li>
                        <span className="font-medium text-foreground">Potassium (K):</span> Enhances overall plant health, disease
                        resistance, and water regulation.
                    </li>
                </ul>
                <p className="mt-4 text-muted-foreground">
                    The right balance of these nutrients is crucial for optimal crop growth and yield. Our calculator provides
                    recommendations based on standard agricultural practices, but soil testing is always recommended for the most
                    accurate results.
                </p>
            </div>
        </div>
    )
}

