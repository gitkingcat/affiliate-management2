import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Plus,
    Filter,
    Download,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Users,
    UserPlus,
    Calendar
} from "lucide-react"
import InfoBanner from "@/src/utils/InfoBanner";
import {useState} from "react";
import {Input} from "@/components/ui/input";

interface Affiliate {
    id: number
    name: string
    email: string
    signupDate: string
    status: string
    revenue: number
    earnings: number
    clicks: number
    leads: number
    customers: number
}

interface StatusCounts {
    active: number
    pending: number
    invited: number
    inactive: number
    rejected: number
    total: number
}

interface PartnersMainContentProps {
    affiliates: Affiliate[]
    loading: boolean
    error: string | null
    searchQuery: string
    statusFilter: string
    currentPage: number
    totalPages: number
    totalElements: number
    pageSize: number
    statusCounts: StatusCounts | null
    onSearchChange: (query: string) => void
    onStatusFilterChange: (status: string) => void
    onPageChange: (page: number) => void
    onPageSizeChange: (size: number) => void
    onRetry: () => void
    onAddPartner: () => void
}

export function PartnersMainContent({
                                        affiliates,
                                        loading,
                                        error,
                                        statusFilter,
                                        currentPage,
                                        totalPages,
                                        totalElements,
                                        pageSize,
                                        onStatusFilterChange,
                                        onPageChange,
                                        onPageSizeChange,
                                        onRetry,
                                        onAddPartner
                                    }: PartnersMainContentProps) {

    const [showInfoBanner, setShowInfoBanner] = useState(true)

    const formatCurrency = (amount: number) => {
        return amount === 0 ? "$0.00" : `$${amount.toFixed(2)}`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: any; className: string }> = {
            'ACTIVE': { variant: 'default', className: 'bg-green-100 text-green-800' },
            'PENDING': { variant: 'secondary', className: 'bg-yellow-100 text-yellow-800' },
            'INVITED': { variant: 'outline', className: 'bg-blue-100 text-blue-800' },
            'INACTIVE': { variant: 'secondary', className: 'bg-gray-100 text-gray-800' },
            'SUSPENDED': { variant: 'destructive', className: 'bg-red-100 text-red-800' },
            'REJECTED': { variant: 'destructive', className: 'bg-red-100 text-red-800' }
        }

        const statusConfig = variants[status] || variants['INACTIVE']
        return (
            <Badge variant={statusConfig.variant} className={statusConfig.className}>
                {status}
            </Badge>
        )
    }

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
                    <div>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground"/>
                                <Input
                                    type="date"
                                    placeholder="Commission Start"
                                    className="w-40"
                                />
                                <span className="text-muted-foreground">to</span>
                                <Input
                                    type="date"
                                    placeholder="Commission End"
                                    className="w-40"
                                />
                            </div>
                            <Button>
                                <Plus className="h-4 w-4 mr-2"/>
                                Create partner
                            </Button>
                            <Button variant="outline">
                                <UserPlus className="h-4 w-4 mr-2"/>
                                Invite partner
                            </Button>
                        </div>
                    </div>
                </div>
                {showInfoBanner && (
                    <InfoBanner
                        description="Some text about partnerssadasda asdasd asda sda sd asd "
                        show={showInfoBanner}
                        onClose={() => setShowInfoBanner(false)}
                    />
                )}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle></CardTitle>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={statusFilter}
                                    onValueChange={onStatusFilterChange}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Filter by status"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Status</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="INVITED">Invited</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                        <SelectItem value="REJECTED">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" size="sm">
                                    <Filter className="w-4 h-4 mr-2"/>
                                    More Filters
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2"/>
                                    Export
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600">Error: {error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onRetry}
                                    className="mt-2"
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Revenue</TableHead>
                                        <TableHead>Earnings</TableHead>
                                        <TableHead>Clicks</TableHead>
                                        <TableHead>Leads</TableHead>
                                        <TableHead>Customers</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-8">
                                                <div className="flex items-center justify-center">
                                                    <div
                                                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : !affiliates || affiliates.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={10} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="w-8 h-8 text-muted-foreground"/>
                                                    <p className="text-muted-foreground">No partners found</p>
                                                    <Button size="sm" onClick={onAddPartner}>
                                                        <Plus className="w-4 h-4 mr-2"/>
                                                        Add your first partner
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        affiliates.map((affiliate) => (
                                            <TableRow key={affiliate.id}>
                                                <TableCell className="font-medium">{affiliate.name}</TableCell>
                                                <TableCell>{affiliate.email}</TableCell>
                                                <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                                                <TableCell>{formatCurrency(affiliate.revenue)}</TableCell>
                                                <TableCell>{formatCurrency(affiliate.earnings)}</TableCell>
                                                <TableCell>{affiliate.clicks}</TableCell>
                                                <TableCell>{affiliate.leads}</TableCell>
                                                <TableCell>{affiliate.customers}</TableCell>
                                                <TableCell>{formatDate(affiliate.signupDate)}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4"/>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>View details</DropdownMenuItem>
                                                            <DropdownMenuItem>Edit partner</DropdownMenuItem>
                                                            <DropdownMenuItem>Send email</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">
                                                                Suspend partner
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between pt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Show</span>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => onPageSizeChange(parseInt(value))}
                                >
                                    <SelectTrigger className="w-16">
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <span>of {totalElements} results</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                >
                                    <ChevronLeft className="h-4 w-4"/>
                                    Previous
                                </Button>
                                <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
)
}