import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Leaf, Package, ShoppingCart, Users, ChevronLeft, ChevronRight, LayoutDashboard, Bug, Menu, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import useAuth from "@/hooks/useAuth"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        href: "/dashboard/products",
        icon: Package,
    },
    {
        title: "Orders",
        href: "/dashboard/orders",
        icon: ShoppingCart,
    },
    {
        title: "Customers",
        href: "/dashboard/customers",
        icon: Users,
    },
    {
        title: "Disease Detection",
        href: "/dashboard/diseases",
        icon: Bug,
    },
    {
        title: "Messages",
        href: "/dashboard/messages",
        icon: MessageCircle,
    }
]

export default function Sidebar() {
    const { user, isAuthenticated } = useAuth()
    const location = useLocation()
    const pathname = location.pathname
    const [collapsed, setCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    // Check if mobile on mount and when window resizes
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768) {
                setCollapsed(true)
            }
        }

        // Initial check
        checkIfMobile()

        // Add event listener
        window.addEventListener("resize", checkIfMobile)

        // Cleanup
        return () => window.removeEventListener("resize", checkIfMobile)
    }, [])

    // Desktop sidebar content
    const DesktopSidebarContent = () => (
        <>
            <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    {!collapsed && <span className="font-bold">Croptivize Admin</span>}
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(collapsed && "absolute -right-4 top-6 z-10 rounded-full border bg-white")}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>
            <ScrollArea className="flex-1 py-2">
                <nav className="grid gap-x-1 gap-y-3 px-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
                                pathname === item.href ? "bg-gray-100 text-primary font-medium" : "text-gray-500",
                                collapsed && "justify-center px-0",
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", collapsed ? "h-6 w-6" : "")} />
                            {!collapsed && <span>{item.title}</span>}
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
            <div className="mt-auto border-t p-4">
                <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                            {Array.from(user.firstName)[0]}
                            {Array.from(user.lastName)[0]}
                        </span>
                    </div>
                    {!collapsed && (
                        <div>
                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    )

    // Mobile sidebar content - always showing labels
    const MobileSidebarContent = () => (
        <>
            <div className="flex h-16 items-center border-b px-4 justify-between">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="font-bold">Croptivize Admin</span>
                </Link>
            </div>
            <ScrollArea className="flex-1 py-2">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-100",
                                pathname === item.href ? "bg-gray-100 text-primary font-medium" : "text-gray-500",
                            )}
                            onClick={() => setIsOpen(false)}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
            </ScrollArea>
            <div className="mt-auto border-t p-4">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                            {Array.from(user.firstName)[0]}
                            {Array.from(user.lastName)[0]}
                        </span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                </div>
            </div>
        </>
    )

    // For desktop view
    if (!isMobile) {
        return (
            <div
                className={cn(
                    "relative hidden md:flex flex-col border-r bg-white transition-all duration-300",
                    collapsed ? "w-16" : "w-64",
                )}
            >
                <DesktopSidebarContent />
            </div>
        )
    }

    // For mobile view
    return (
        <>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[250px]">
                    <div className="flex flex-col h-full">
                        <MobileSidebarContent />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    )
}