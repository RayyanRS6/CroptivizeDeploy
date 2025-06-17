import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { Leaf, Menu, X, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useAuth from "@/hooks/useAuth"
import useLogout from "@/hooks/useLogout"
import { useLogoutMutation } from "../../services/authApi"
import { toast } from "sonner"
import ProfileUpdateModal from "../basic/ProfileUpdateModal";

const NAVIGATION_ITEMS = [
    { name: "Home", path: "/" },
    { name: "Disease Detection", path: "/detect" },
    { name: "Fertilizer Calculator", path: "/fertilizer-calculator" },
    { name: "Shop", path: "/shop" },
    { name: "Guide", path: "/guide" },
    { name: "Contact", path: "/contact" },
]

export default function Navbar() {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const NavItems = ({ mobile = false }) => (
        <>
            {NAVIGATION_ITEMS.map((item) => (
                <NavigationMenuItem key={item.path}>
                    <NavLink
                        to={item.path}
                        onClick={() => mobile && setIsOpen(false)}
                        className={({ isActive }) =>
                            isActive
                                ? mobile
                                    ? "block w-full rounded-md text-primary"
                                    : "text-primary"
                                : mobile
                                    ? "block w-full rounded-md"
                                    : undefined
                        }
                    >
                        <NavigationMenuLink className={`${mobile ? undefined : navigationMenuTriggerStyle()} bg-transparent`}>
                            {item.name}
                        </NavigationMenuLink>
                    </NavLink>
                </NavigationMenuItem>
            ))}
        </>
    )

    const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()
    const handleLogout = async () => {
        try {
            await logout().unwrap()
        } catch (error) {
            const err = error.data.message || 'Error logging out! Please try again.'
            toast.error(err)
        } finally {
            useLogout()
            toast.success("Logged out successfully")
            navigate("/login")
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between xl:px-2 md:px-5 px-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <Leaf className="h-6 w-6" />
                        <span className="font-bold">Croptivize</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavItems />
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="flex items-center space-x-2">
                        {isAuthenticated ? (
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                            <div className="h-9 w-9 p-3 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {Array.from(user.firstName)[0]}
                                                    {Array.from(user.lastName)[0]}
                                                </span>
                                            </div>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                                            Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                {user?.role === "admin" && (
                                    <Button variant="ghost" asChild>
                                        <Link to="/dashboard">
                                            <LayoutDashboard className="h-5 w-5" />
                                        </Link>
                                    </Button>
                                )}
                            </>
                        ) : (
                            <div className="hidden lg:flex items-center gap-4">
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Login</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/signup">Sign Up</Link>
                                </Button>
                            </div>
                        )}
                        {/* Mobile Navigation */}
                        <div className="lg:hidden">
                            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        {isOpen ? (
                                            <X className="h-6 w-6" />
                                        ) : (
                                            <Menu className="h-6 w-6" />
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-64 px-3">
                                    <div className="flex flex-col mt-8">
                                        <NavigationMenu className="block">
                                            <NavigationMenuList className="flex-col items-start">
                                                <NavItems mobile />
                                            </NavigationMenuList>
                                        </NavigationMenu>
                                        {!isAuthenticated && (
                                            <div className="mt-7 flex flex-col gap-3">
                                                <Button variant="outline" asChild>
                                                    <Link to="/login">Login</Link>
                                                </Button>
                                                <Button asChild>
                                                    <Link to="/signup">Sign Up</Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                </div>
            </header>
            <ProfileUpdateModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </>
    )
}