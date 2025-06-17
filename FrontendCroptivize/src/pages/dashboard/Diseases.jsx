import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGetAllQuery } from "../../services/diseaseApi"

export default function DiseasesPage() {
    const [detections, setDetections] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [itemsPerPage] = useState(10)

    const { data: diseaseData, isLoading: loading } = useGetAllQuery()

    useEffect(() => {
        if (diseaseData?.data) {
            const formattedData = diseaseData.data.map((detection) => ({
                ...detection,
                risk: Number(detection.risk),
            }))
            setDetections(formattedData);
            setTotalPages(Math.max(1, Math.ceil(diseaseData.data.length / itemsPerPage)));

            if (currentPage > Math.ceil(diseaseData.data.length / itemsPerPage)) {
                setCurrentPage(1);
            }
        }
    }, [diseaseData, itemsPerPage]);



    // Get current detections for pagination
    const getCurrentDetections = () => {
        if (!detections.length) return [];

        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return detections.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Get risk badge variant
    const getRiskBadgeVariant = (risk) => {
        const roundedRisk = Math.round(risk)
        if (roundedRisk > 70) {
            return "destructive"
        } else if (roundedRisk > 40) {
            return "warning"
        }
        return "default"
    }

    // Get high, medium, and low risk counts
    const getHighRiskCount = () => {
        return detections.filter((d) => Math.round(d?.risk || 0) > 70).length;
    };

    const getMediumRiskCount = () => {
        return detections.filter((d) => {
            const risk = Math.round(d?.risk || 0);
            return risk > 40 && risk <= 70;
        }).length;
    };

    const getLowRiskCount = () => {
        return detections.filter((d) => Math.round(d?.risk || 0) <= 40).length;
    };

    // Pagination handlers
    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Calculate pagination info
    const getPaginationInfo = () => {
        if (detections.length === 0) return "No detections";

        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, detections.length);

        return `Showing ${start}-${end} of ${detections.length} detections`;
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Disease Detections</h2>
                <p className="text-muted-foreground">Monitor plant disease detections across your farms</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">High Risk Detections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : getHighRiskCount()}
                        </div>
                        <p className="text-xs text-muted-foreground">Require immediate attention</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Medium Risk Detections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : getMediumRiskCount()}
                        </div>
                        <p className="text-xs text-muted-foreground">Monitor closely</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Low Risk Detections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-foreground">
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : getLowRiskCount()}
                        </div>
                        <p className="text-xs text-muted-foreground">Standard treatment recommended</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Disease Name</TableHead>
                                <TableHead>Risk</TableHead>
                                <TableHead>Detected By</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                            <span className="ml-2">Loading disease detections...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : getCurrentDetections().length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No disease detections found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                getCurrentDetections().map((detection) => (
                                    <TableRow
                                        key={detection._id}
                                    >
                                        <TableCell className="font-medium">{detection.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={getRiskBadgeVariant(detection.risk)}>{Math.round(detection.risk)}% Risk</Badge>
                                        </TableCell>
                                        <TableCell>{detection.detectBy?.firstName} {detection.detectBy?.lastName}</TableCell>
                                        <TableCell>{formatDate(detection.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                        {getPaginationInfo()}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1 || loading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Previous Page</span>
                        </Button>
                        <div className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || loading}
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