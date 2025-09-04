import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Plus,
    Filter,
    Download,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    Users,
    UserPlus,
    Calendar,
    X
} from "lucide-react"
import InfoBanner from "@/src/utils/infoBanner";
import { useState } from "react";

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

interface AdvancedFilters {
    minRevenue: string
    maxRevenue: string
    minEarnings: string
    maxEarnings: string
    signupStartDate: string
    signupEndDate: string
    minClicks: string
    maxClicks: string
    minLeads: string
    maxLeads: string
    minCustomers: string
    maxCustomers: string
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
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
        minRevenue: '',
        maxRevenue: '',
        minEarnings: '',
        maxEarnings: '',
        signupStartDate: '',
        signupEndDate: '',
        minClicks: '',
        maxClicks: '',
        minLeads: '',
        maxLeads: '',
        minCustomers: '',
        maxCustomers: ''
    })

    const formatCurrency = (amount: number) => {
        return amount === 0 ?
            '$0' :
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
            case 'invited':
                return <Badge variant="outline" className="border-blue-500 text-blue-700">Invited</Badge>
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>
            case 'suspended':
                return <Badge variant="destructive">Suspended</Badge>
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const handleAdvancedFilterChange = (key: keyof AdvancedFilters, value: string) => {
        setAdvancedFilters(prev => ({ ...prev, [key]: value }))
    }

    const clearAdvancedFilters = () => {
        setAdvancedFilters({
            minRevenue: '',
            maxRevenue: '',
            minEarnings: '',
            maxEarnings: '',
            signupStartDate: '',
            signupEndDate: '',
            minClicks: '',
            maxClicks: '',
            minLeads: '',
            maxLeads: '',
            minCustomers: '',
            maxCustomers: ''
        })
    }

    const applyAdvancedFilters = () => {
        setShowAdvancedFilters(false)
    }

    const getFilteredAffiliates = () => {
        return affiliates.filter(affiliate => {
            const { minRevenue, maxRevenue, minEarnings, maxEarnings,
                signupStartDate, signupEndDate, minClicks, maxClicks,
                minLeads, maxLeads, minCustomers, maxCustomers } = advancedFilters

            if (minRevenue && affiliate.revenue < parseFloat(minRevenue)) return false
            if (maxRevenue && affiliate.revenue > parseFloat(maxRevenue)) return false
            if (minEarnings && affiliate.earnings < parseFloat(minEarnings)) return false
            if (maxEarnings && affiliate.earnings > parseFloat(maxEarnings)) return false
            if (minClicks && affiliate.clicks < parseInt(minClicks)) return false
            if (maxClicks && affiliate.clicks > parseInt(maxClicks)) return false
            if (minLeads && affiliate.leads < parseInt(minLeads)) return false
            if (maxLeads && affiliate.leads > parseInt(maxLeads)) return false
            if (minCustomers && affiliate.customers < parseInt(minCustomers)) return false
            if (maxCustomers && affiliate.customers > parseInt(maxCustomers)) return false

            if (signupStartDate) {
                const signupDate = new Date(affiliate.signupDate)
                const startDate = new Date(signupStartDate)
                if (signupDate < startDate) return false
            }

            if (signupEndDate) {
                const signupDate = new Date(affiliate.signupDate)
                const endDate = new Date(signupEndDate)
                if (signupDate > endDate) return false
            }

            return true
        })
    }

    const displayedAffiliates = getFilteredAffiliates()

    if (error) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">{error}</p>
                            <Button onClick={onRetry}>Try Again</Button>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Partners</h1>
                        <p className="text-gray-600 mt-1">Manage your affiliate partners and track their performance</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4"/>
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

                {showInfoBanner && (
                    <InfoBanner
                        description="Some text about partners"
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
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                >
                                    <Filter className="w-4 h-4 mr-2"/>
                                    More Filters
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="w-4 h-4 mr-2"/>
                                    Export
                                </Button>
                            </div>
                        </div>

                        {showAdvancedFilters && (
                            <div className="border-t pt-4 mt-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">Advanced Filters</h3>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearAdvancedFilters}
                                        >
                                            Clear All
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAdvancedFilters(false)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Revenue Range</h4>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min Revenue"
                                                value={advancedFilters.minRevenue}
                                                onChange={(e) => handleAdvancedFilterChange('minRevenue', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="number"
                                                placeholder="Max Revenue"
                                                value={advancedFilters.maxRevenue}
                                                onChange={(e) => handleAdvancedFilterChange('maxRevenue', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Earnings Range</h4>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min Earnings"
                                                value={advancedFilters.minEarnings}
                                                onChange={(e) => handleAdvancedFilterChange('minEarnings', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="number"
                                                placeholder="Max Earnings"
                                                value={advancedFilters.maxEarnings}
                                                onChange={(e) => handleAdvancedFilterChange('maxEarnings', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Signup Date Range</h4>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="date"
                                                value={advancedFilters.signupStartDate}
                                                onChange={(e) => handleAdvancedFilterChange('signupStartDate', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="date"
                                                value={advancedFilters.signupEndDate}
                                                onChange={(e) => handleAdvancedFilterChange('signupEndDate', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Clicks Range</h4>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min Clicks"
                                                value={advancedFilters.minClicks}
                                                onChange={(e) => handleAdvancedFilterChange('minClicks', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="number"
                                                placeholder="Max Clicks"
                                                value={advancedFilters.maxClicks}
                                                onChange={(e) => handleAdvancedFilterChange('maxClicks', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Leads Range</h4>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min Leads"
                                                value={advancedFilters.minLeads}
                                                onChange={(e) => handleAdvancedFilterChange('minLeads', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="number"
                                                placeholder="Max Leads"
                                                value={advancedFilters.maxLeads}
                                                onChange={(e) => handleAdvancedFilterChange('maxLeads', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-medium text-gray-900">Customers Range</h4>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min Customers"
                                                value={advancedFilters.minCustomers}
                                                onChange={(e) => handleAdvancedFilterChange('minCustomers', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="number"
                                                placeholder="Max Customers"
                                                value={advancedFilters.maxCustomers}
                                                onChange={(e) => handleAdvancedFilterChange('maxCustomers', e.target.value)}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        onClick={clearAdvancedFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                    <Button onClick={applyAdvancedFilters}>
                                        Apply Filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading partners...</p>
                                </div>
                            </div>
                        ) : (
                            <>
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
                                            <TableHead>Signup Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {displayedAffiliates.length === 0 ? (
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
                                            displayedAffiliates.map((affiliate) => (
                                                <TableRow key={affiliate.id}>
                                                    <TableCell className="font-medium">{affiliate.name}</TableCell>
                                                    <TableCell>{affiliate.email}</TableCell>
                                                    <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                                                    <TableCell>{formatCurrency(affiliate.revenue)}</TableCell>
                                                    <TableCell>{formatCurrency(affiliate.earnings)}</TableCell>
                                                    <TableCell>{affiliate.clicks.toLocaleString()}</TableCell>
                                                    <TableCell>{affiliate.leads.toLocaleString()}</TableCell>
                                                    <TableCell>{affiliate.customers.toLocaleString()}</TableCell>
                                                    <TableCell>{formatDate(affiliate.signupDate)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4"/>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                                <DropdownMenuItem>Edit partner</DropdownMenuItem>
                                                                <DropdownMenuItem>Send message</DropdownMenuItem>
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

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            Showing {((currentPage) * pageSize) + 1} to{" "}
                                            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                                            {totalElements} partners
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Select
                                            value={pageSize.toString()}
                                            onValueChange={(value) => onPageSizeChange(parseInt(value))}
                                        >
                                            <SelectTrigger className="w-20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="5">5</SelectItem>
                                                <SelectItem value="10">10</SelectItem>
                                                <SelectItem value="20">20</SelectItem>
                                                <SelectItem value="50">50</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className="text-sm text-muted-foreground">per page</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                        >
                                            <ChevronLeft className="h-4 w-4"/>
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Page {currentPage + 1} of {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onPageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                        >
                                            <ChevronRight className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
    )
}