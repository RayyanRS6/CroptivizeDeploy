import { useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useGetOrdersQuery } from "../../services/productApi"

export default function Orders() {
    // State for pagination
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)

    // Fetch orders data using RTK Query
    const { data, isLoading, isFetching } = useGetOrdersQuery({
        page,
        limit
    });

    // Extract data from API response
    const orders = data?.data?.orders || [];
    const pagination = data?.data?.pagination || {
        totalDocs: 0,
        limit: 10,
        totalPages: 1,
        page: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
    };

    const loading = isLoading || isFetching;

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-PK", {
            style: "currency",
            currency: "PKR",
        }).format(price)
    }

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-PK", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Get customer full name
    const getCustomerName = (user) => {
        if (user?.firstName) {
            return `${user.firstName} ${user.lastName || ""}`
        } else {
            return "Not Found"
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                <p className="text-muted-foreground">View all customer orders</p>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Order Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="ml-2">Loading orders...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-medium">{order._id.substring(order._id.length - 8)}</TableCell>
                                        <TableCell>{getCustomerName(order.user)}</TableCell>
                                        <TableCell>{order.product.name}</TableCell>
                                        <TableCell>{formatPrice(order.product.price)}</TableCell>
                                        <TableCell>{formatDate(order.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                        Showing {orders.length} of {pagination.totalDocs} orders
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={!pagination.hasPrevPage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous Page</span>
                        </Button>
                        <div className="text-sm font-medium">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.totalPages))}
                            disabled={!pagination.hasNextPage}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Next Page</span>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}