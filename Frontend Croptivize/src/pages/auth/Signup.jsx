import { useState } from "react"
import { Link, useNavigate, Navigate } from "react-router-dom"
import { Eye, EyeOff, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useRegisterMutation } from "../../services/authApi"
import useAuth from "@/hooks/useAuth"
import { baseURL } from "../../utils/baseURL"

export default function Signup() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })

    const [register, { isLoading }] = useRegisterMutation()

    async function onSubmit(event) {
        event.preventDefault()
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match")
            return
        }
        if (form.password.length < 6) {
            toast.error("Password should be at least 6 characters")
            return
        }
        if (form.phone.length < 10) {
            toast.error("Phone number should be at least 10 characters")
            return
        }
        if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password || !form.confirmPassword) {
            toast.error("Please fill all fields")
            return
        }

        try {
            await register(form).unwrap()
            toast.success("Account created successfully")
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",
            })
            navigate("/login")
        } catch (error) {
            const err = error.data.message || 'Something went wrong! Try Again'
            toast.error(err)
        }

    }

    const handleGoogleSignup = () => {
        setDisabled(true);
        localStorage.setItem('pendingGoogleAuth', 'true');
        window.location.href = `${baseURL}/user/auth/google`;
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="bg-gray-50 flex min-h-screen flex-col items-center justify-center sm:px-0 px-4">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:max-w-md bg-card shadow-lg sm:p-6 p-4 rounded-lg my-7">
                <div className="flex flex-col space-y-2 text-center">
                    <Leaf className="mx-auto h-6 w-6" />
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Enter your details to create your account</p>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="grid gap-4">
                        <div className="grid md:grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="fname">First Name</Label>
                                <Input
                                    id="fname"
                                    placeholder="John"
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lname">Last Name</Label>
                                <Input
                                    id="lname"
                                    placeholder="Doe"
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="Enter your phone number"
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                autoCapitalize="none"
                                disabled={isLoading}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoCapitalize="none"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    autoComplete="new-password"
                                    disabled={isLoading}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                    disabled={isLoading}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                </Button>
                            </div>
                        </div>
                        <Button disabled={isLoading}>
                            {isLoading && (
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            )}
                            Create Account
                        </Button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                </div>
                <div className="grid gap-4">
                    <Button variant="outline" type="button" disabled={disabled} onClick={handleGoogleSignup}>
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    )
}

