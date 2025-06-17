import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"

export default function CtaSection() {
    const { isAuthenticated } = useAuth()
    return (
        <section className="max-w-7xl mx-auto px-4 xl:px-2 py-12 md:py-16">
            <div className="relative rounded-lg bg-primary sm:px-6 px-3 py-6 sm:py-12 md:px-12 md:py-16 lg:px-16 lg:py-20">
                <div className="relative mx-auto max-w-3xl text-center text-primary-foreground">
                    <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Ready to Transform Your Farming?</h2>
                    <p className="mt-4 text-lg opacity-90">
                        Join thousands of farmers who are already using Croptivize to improve their crop yield and farming
                        efficiency.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link to={isAuthenticated ? "/detect" : "/signup"}>
                                Get Started Free
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-primary" asChild>
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

