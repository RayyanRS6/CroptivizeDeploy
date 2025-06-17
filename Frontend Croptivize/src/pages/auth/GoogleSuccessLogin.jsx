import React from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GoogleSuccessLogin = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');
        const userData = urlParams.get('user');

        if (accessToken && refreshToken && userData) {
            try {
                const user = JSON.parse(decodeURIComponent(userData));

                // Store in localStorage
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);

                localStorage.setItem('googleAuthSuccess', 'true');

                setTimeout(() => {
                    // Redirect based on role
                    if (user.role === 'admin') {
                        navigate("/dashboard", { replace: true });
                    } else {
                        navigate("/", { replace: true });
                    }
                }, 1000);

            } catch (error) {
                console.error("Error parsing user data:", error);
                toast.error("Authentication failed");
                navigate("/login", { replace: true });
            }
        } else {
            toast.error("Authentication failed");
            navigate("/login", { replace: true });
        }
    }, [navigate]);
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
                <h2 className="text-xl font-semibold">Completing authentication...</h2>
                <p className="text-muted-foreground">Please wait while we log you in.</p>
            </div>
        </div>
    )
}

export default GoogleSuccessLogin