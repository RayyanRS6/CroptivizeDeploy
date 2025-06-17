import { useState } from "react"
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useGetUsersQuery, useUpdateRoleMutation } from "../../services/userApi"
import { toast } from "sonner"

export default function Customers() {
    // State for pagination
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    // Track user being updated
    const [updatingUserId, setUpdatingUserId] = useState(null)

    // Fetch users data using RTK Query
    const {
        data: usersResponse,
        isLoading
    } = useGetUsersQuery({
        page,
        limit
    });

    // Mutation hook for updating user role
    const [updateRole, { isLoading: isRoleUpdating }] = useUpdateRoleMutation();

    // Extract users from response
    const users = usersResponse?.data || [];
    const totalUsers = users.length || 0;

    // Calculate total pages - this should come from API pagination in a real app
    const totalPages = Math.max(1, Math.ceil(totalUsers / limit));

    // Combined loading state
    const loading = isLoading;

    // Handle role change
    const handleRoleChange = async (userId, newRole) => {
        try {
            setUpdatingUserId(userId);

            const result = await updateRole({
                userId,
                role: newRole
            }).unwrap();

            if (result.success) {
                toast.success(`User role updated to ${newRole}`);
            } else {
                toast.error(result.message || "Failed to update role");
            }
        } catch (error) {
            toast.error(error.data?.message || "An error occurred while updating role");
        } finally {
            setUpdatingUserId(null);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get full name
    const getFullName = (user) => {
        return `${user.firstName} ${user.lastName}`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <p className="text-muted-foreground">Manage your users and their roles</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="ml-2">Loading customers...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{getFullName(user)}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phone}</TableCell>
                                        <TableCell>
                                            <div className="w-[110px]">
                                                {updatingUserId === user._id || (isRoleUpdating && updatingUserId === user._id) ? (
                                                    <div className="flex items-center space-x-2">
                                                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                        <span className="text-sm">Updating...</span>
                                                    </div>
                                                ) : (
                                                    <Select
                                                        value={user.role}
                                                        onValueChange={(value) => handleRoleChange(user._id, value)}
                                                    >
                                                        <SelectTrigger className="h-8">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">
                                                                <div className="flex items-center">
                                                                    <span>User</span>
                                                                    {user.role === "user" && <Check className="ml-2 h-4 w-4" />}
                                                                </div>
                                                            </SelectItem>
                                                            <SelectItem value="admin">
                                                                <div className="flex items-center">
                                                                    <span>Admin</span>
                                                                    {user.role === "admin" && <Check className="ml-2 h-4 w-4" />}
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {users.length} of {totalUsers} customers
                    </div>
                    {totalPages > 1 && (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                disabled={page === 1 || loading}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous Page</span>
                            </Button>
                            <div className="text-sm font-medium">
                                Page {page} of {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages || loading}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next Page</span>
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}