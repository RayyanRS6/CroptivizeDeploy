import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import pic from '/hangplant.png'

export default function HeroSection() {

    return (
        <div className="relative">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-7 text-center md:gap-10 py-12 md:py-16 xl:px-0 px-4 relative z-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                        Smart Agriculture Solutions
                    </div>
                    <h1 className="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
                        Grow Smarter, <br />
                        Harvest Better
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-gray-500 sm:text-xl sm:leading-8">
                        Revolutionize your farming with AI-powered disease detection, smart recommendations, and precision
                        agriculture tools. Your complete farming companion.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link to="/detect">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link to="/contact">Learn More</Link>
                    </Button>
                </div>

            </div>
            <div className="absolute top-0 right-0 2xl:right-14 z-[-1] xl:opacity-100 opacity-50 md:block hidden">
                <img src={pic} className="" />
            </div>
            <div className="absolute top-0 2xl:left-14 md:left-0 sm:left-1/4 left-1/2 sm:-translate-x-0 -translate-x-1/2 z-[-1] xl:opacity-100 sm:opacity-50 opacity-35">
                <img src={pic} className="sm:h-auto h-[300px] sm:w-auto w-[400px]" />
            </div>
        </div>
    )
}

