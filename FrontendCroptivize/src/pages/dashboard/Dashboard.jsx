import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowDown, ArrowUp, Bug, Users, Package, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRecentDiseasesQuery, useAnalyticsQuery } from "@/services/diseaseApi"
import { useGetUserCountQuery } from "../../services/userApi"
import { useGetAnalyticsQuery } from "../../services/productApi"
import { Link } from "react-router-dom"

const COLORS = ["#0C6837", "#2E8B57", "#3CB371", "#66CDAA", "#8FBC8F"]

export default function Dashboard() {
    const [diseaseData, setDiseaseData] = useState([])
    const [totalDiseaseCount, setTotalDiseaseCount] = useState(0)
    const [recentDetections, setRecentDetections] = useState([])
    const [totalUsers, setTotalUsers] = useState(0)
    const [totalOrders, setTotalOrders] = useState(0)
    const [totalProducts, setTotalProducts] = useState(0)
    const [recentOrders, setRecentOrders] = useState([])
    const [salesData, setSalesData] = useState([])

    const { data: userCountData } = useGetUserCountQuery()
    const { data: analyticsData } = useAnalyticsQuery()
    const { data: recentDiseasesData } = useRecentDiseasesQuery()
    const { data: analytics } = useGetAnalyticsQuery()

    useEffect(() => {
        if (analyticsData) {
            const formattedData = analyticsData.data.map((item) => ({
                name: item.name,
                value: item.count,
            }))
            setDiseaseData(formattedData)
            setTotalDiseaseCount(analyticsData.data.length)
        }
    }, [analyticsData])

    useEffect(() => {
        if (recentDiseasesData) {
            setRecentDetections(recentDiseasesData.data)
        }
    }, [recentDiseasesData])

    useEffect(() => {
        if (userCountData) {
            setTotalUsers(userCountData.data)
        }
    }, [userCountData])

    useEffect(() => {
        if (analytics) {
            setTotalOrders(analytics.data?.totalOrders || 0)
            setTotalProducts(analytics.data?.totalProducts || 0)
            setRecentOrders(analytics.data?.recentOrders || [])
            setSalesData(analytics.data?.salesData || [])
        }
    }, [analytics])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of your agricultural business</p>
                </div>
                <div>
                    <Link to="/" className="px-3 rounded py-1 font-medium border md:me-3">Home</Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+12.5%</span> from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+8.2%</span> from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                            <span className="text-red-500">-3.1%</span> from last month
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Disease Detections</CardTitle>
                        <Bug className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDiseaseCount}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                            <span className="text-green-500">+18.7%</span> from last month
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                    <CardHeader className="flex flex-row items-center">
                        <div>
                            <CardTitle>Sales Overview</CardTitle>
                            <CardDescription>Monthly revenue for the current year</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value) => [`Rs.${value}`, "Revenue"]}
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "0.5rem",
                                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                    <Bar dataKey="total" fill="#0C6837" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Common Diseases</CardTitle>
                        <CardDescription>Distribution of detected plant diseases</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={diseaseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {diseaseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`${value}%`, "Percentage"]}
                                        contentStyle={{
                                            backgroundColor: "white",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "0.5rem",
                                            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Disease Detections</CardTitle>
                        <CardDescription>Latest plant disease detections by users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentDetections.length === 0 ? (
                                <div className="flex items-center justify-center p-4">
                                    <p className="text-center text-muted-foreground">No recent diseases found</p>
                                </div>
                            ) : (
                                recentDetections.map((detection) => (
                                    <div key={detection._id} className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <Bug className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{detection.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    • {new Date(detection.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm">{detection.risk}%</span>
                                            <Badge
                                                variant={
                                                    Math.round(detection.risk) > 70
                                                        ? "destructive"
                                                        : Math.round(detection.risk) > 40
                                                            ? "warning"
                                                            : Math.round(detection.risk) > 20
                                                                ? "default"
                                                                : "outline"
                                                }
                                            >
                                                {Math.round(detection.risk) > 70
                                                    ? "High Risk"
                                                    : Math.round(detection.risk) > 40
                                                        ? "Medium Risk"
                                                        : Math.round(detection.risk) > 20
                                                            ? "Low Risk"
                                                            : "No Risk"}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Latest customer orders and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-primary/10 p-2">
                                            <ShoppingCart className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium line-clamp-2">{order.product?.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.order_no}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">Rs.{order.product?.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

