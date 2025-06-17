import { Link } from "react-router-dom"
import { Leaf } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="max-w-7xl mx-auto px-4 xl:px-2 flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 md:gap-2">
                    <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                        <Leaf className="h-6 w-6" />
                        Croptivize
                    </Link>
                    <p className="text-sm text-muted-foreground">Empowering farmers with smart agriculture solutions</p>
                </div>
                <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-4">
                    <Link to="/#" className="hover:underline">
                        Privacy Policy
                    </Link>
                    <Link to="/#" className="hover:underline">
                        Terms of Service
                    </Link>
                    <Link to="/contact" className="hover:underline">
                        Contact Us
                    </Link>
                </div>
            </div>
        </footer>
    )
}

