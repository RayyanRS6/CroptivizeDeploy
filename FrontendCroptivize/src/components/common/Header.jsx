import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "@/services/authApi";
import useLogout from "../../hooks/useLogout";
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";
import ProfileUpdateModal from "../basic/ProfileUpdateModal";

export default function Header() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const [logout] = useLogoutMutation();
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            useLogout();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to logout");
        }
    };

    return (
        <>
            <header className="flex items-center justify-between p-3 bg-white border-b shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="relative ml-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-64 pl-8"
                        />
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <div className="flex size-9 p-2 items-center justify-center rounded-full bg-gray-200 text-sm font-medium">
                                {user ? (
                                    <>
                                        {user?.firstName?.[0]?.toUpperCase()}
                                        {user?.lastName?.[0]?.toUpperCase()}
                                    </>
                                ) : (
                                    "DP"
                                )}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsProfileModalOpen(true)}>
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <ProfileUpdateModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </>
    );
}