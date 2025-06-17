import Sidebar from "@/components/common/Sidebar"
import Header from "@/components/common/Header"
import { Outlet, Navigate } from "react-router-dom"
import useAuth from "@/hooks/useAuth"

export default function AdminLayout() {
    const { user, isAuthenticated } = useAuth()
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" />
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

