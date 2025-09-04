import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
    Plus,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Users,
    UserPlus,
    Calendar,
    X
} from "lucide-react"
import InfoBanner from "@/src/utils/infoBanner";
import { useState } from "react";
import {PartnersTable} from "@/src/app/partners/partnersTable";

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
                        description="Track partner performance, manage commissions, and grow your affiliate network. Use filters to find specific partners and monitor their success metrics."
                        onClose={() => setShowInfoBanner(false)}
                    />
                )}

                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Partners ({totalElements} total)</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2"/>
                                    Advanced Filters
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-2"/>
                                    Export
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4">
                            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Status"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Partners</SelectItem>
                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="INVITED">Invited</SelectItem>
                                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {showAdvancedFilters && (
                            <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                                placeholder="Start Date"
                                                value={advancedFilters.signupStartDate}
                                                onChange={(e) => handleAdvancedFilterChange('signupStartDate', e.target.value)}
                                                className="w-full"
                                            />
                                            <span className="text-muted-foreground">to</span>
                                            <Input
                                                type="date"
                                                placeholder="End Date"
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
                            <PartnersTable
                                affiliates={displayedAffiliates}
                                onAddPartner={onAddPartner}
                            />
                        )}
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between px-2 mt-6">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Show</span>
                            <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
                                <SelectTrigger className="w-16">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                            <span>entries</span>
                        </div>
                        <span>
                            Showing {Math.min((currentPage * pageSize) + 1, totalElements)} to{' '}
                            {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        >
                            <ChevronLeft className="h-4 w-4"/>
                        </Button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                    pageNum = i;
                                } else if (currentPage < 2) {
                                    pageNum = i;
                                } else if (currentPage >= totalPages - 3) {
                                    pageNum = totalPages - 5 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={pageNum === currentPage ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => onPageChange(pageNum)}
                                        className="w-8 h-8 p-0"
                                    >
                                        {pageNum + 1}
                                    </Button>
                                );
                            })}
                        </div>

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
            </div>
    )
}