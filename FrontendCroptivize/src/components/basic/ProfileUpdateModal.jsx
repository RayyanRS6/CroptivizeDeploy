import { useForm } from "react-hook-form";
import { DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent, Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUpdateUserMutation } from "@/services/userApi";
import useAuth from "../../hooks/useAuth";
import { toast } from "sonner";

export default function ProfileUpdateModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const [updateUser, { isLoading }] = useUpdateUserMutation();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || ""
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await updateUser(data).unwrap();
            const updatedUser = response?.data
            localStorage.removeItem('user');
            localStorage.setItem('user', JSON.stringify(updatedUser));
            toast.success("Profile updated successfully");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.data?.message || "Failed to update profile");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Update Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal information below
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                className="col-span-3"
                                {...register("firstName", { required: "First name is required" })}
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                className="col-span-3"
                                {...register("lastName", { required: "Last name is required" })}
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                disabled
                                className="col-span-3"
                                {...register("email", {
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Phone
                            </Label>
                            <Input
                                id="phone"
                                className="col-span-3"
                                {...register("phone", { required: "Phone number is required" })}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm col-start-2 col-span-3">
                                    {errors.phone.message}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}