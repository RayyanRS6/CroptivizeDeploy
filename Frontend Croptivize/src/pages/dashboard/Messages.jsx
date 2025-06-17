import { useState, useEffect } from "react"
import { Loader2, Mail } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useGetMessageQuery, useGetAllMessagesQuery } from "../../services/messageApi"

export default function Messages() {
    // State for messages data
    const [messages, setMessages] = useState([])
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

    const { data: response, isLoading: loading } = useGetAllMessagesQuery()
    // Load messages on component mount
    useEffect(() => {
        if (response) {
            setMessages(response.data || [])
        }
    }, [])

    // Handle message click to view details
    const handleMessageClick = (message) => {
        setSelectedMessage(message)
        setIsDetailModalOpen(true)
    }

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
                <p className="text-muted-foreground">View contact form submissions from users</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Messages</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex h-24 items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2">Loading messages...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="text-center py-8">No messages found.</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {messages.map((message) => (
                                    <TableRow
                                        key={message._id}
                                        className="cursor-pointer hover:bg-muted/50"
                                        onClick={() => handleMessageClick(message)}
                                    >
                                        <TableCell className="font-medium">{message.name}</TableCell>
                                        <TableCell>{message.email}</TableCell>
                                        <TableCell>{message.subject}</TableCell>
                                        <TableCell>{formatDate(message.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Message Details
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
                                <p className="text-sm text-muted-foreground">Received on {formatDate(selectedMessage.createdAt)}</p>
                            </div>

                            <div className="space-y-2 border-t border-b py-4">
                                <div>
                                    <span className="font-medium">From:</span> {selectedMessage.name}
                                </div>
                                <div>
                                    <span className="font-medium">Email:</span> {selectedMessage.email}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Message:</h4>
                                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsDetailModalOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
