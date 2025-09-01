"use client"

import { useState, useEffect, useCallback } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Search, Filter, Download, Bell, Mail, X, UserPlus, Loader2, RefreshCw, Plus, MoreHorizontal, Users } from "lucide-react"
import { renderCellContent } from "@/src/config/customers-tab-configs"

interface ReferralCustomerDTO {
    id: number
    customerName: string
    customerEmail: string
    clientId: number
    clientName: string
    clientEmail: string
    totalPaid: number
    totalCommission: number
    status: string
    createdAt: string
    lastPurchaseDate?: string
    purchaseCount: number
    referralCode: string
    source: string
}

interface CommissionDTO {
    id: number
    affiliateName: string
    affiliateEmail: string
    customerName?: string
    customerEmail?: string
    amount: number
    percentage: number
    currency: string
    status: string
    type: string
    description: string
    createdAt: string
    earnedAt: string
    paidAt: string | null
    referralId: string
}

interface TransactionDTO {
    id: number
    affiliateName: string
    affiliateEmail: string
    customerName: string
    customerEmail: string
    amount: number
    currency: string
    paymentMethod: string
    status: string
    transactionId: string
    description: string
    processedAt: string | null
    createdAt: string
}

interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
    first: boolean
    last: boolean
}

interface TabData<T = any> {
    data: T[]
    totalElements: number
    totalPages: number
    loading: boolean
    error: string | null
    loaded: boolean
}

interface StatusCounts {
    active: number
    pending: number
    completed: number
    failed: number
    total: number
}

type TabType = 'customers' | 'commissions' | 'transactions'

const CLIENT_ID = 1

const API_ENDPOINTS = {
    customers: (clientId: number) => `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/referrals/client/${clientId}/customers`,
    commissions: (clientId: number) => `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/commissions/client/${clientId}/tab-data`,
    transactions: (clientId: number) => `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/referrals/client/${clientId}/transactions`
}

const TAB_CONFIGS = {
    customers: {
        id: 'customers',
        label: 'Customers',
        searchFields: ["customerName", "customerEmail", "clientName", "clientEmail"],
        searchPlaceholder: "Search by customer name, email, or client...",
        columns: [
            { key: "customer", header: "Customer" },
            { key: "client", header: "Client/Partner" },
            { key: "totalPaid", header: "Total Paid" },
            { key: "totalCommission", header: "Commission" },
            { key: "status", header: "Status" },
            { key: "lastPurchase", header: "Last Purchase" },
            { key: "purchaseCount", header: "Purchases" },
            { key: "source", header: "Source" },
            { key: "actions", header: "Actions" }
        ]
    },
    commissions: {
        id: 'commissions',
        label: 'Commissions',
        searchFields: ["affiliateName", "affiliateEmail", "customerName", "description", "type"],
        searchPlaceholder: "Search by affiliate, customer, type, or description...",
        columns: [
            { key: "affiliate", header: "Affiliate" },
            { key: "customer", header: "Customer" },
            { key: "amount", header: "Amount" },
            { key: "percentage", header: "Rate %" },
            { key: "status", header: "Status" },
            { key: "type", header: "Type" },
            { key: "createdAt", header: "Created" },
            { key: "earnedAt", header: "Earned" },
            { key: "paidAt", header: "Paid" },
            { key: "actions", header: "Actions" }
        ]
    },
    transactions: {
        id: 'transactions',
        label: 'Transactions',
        searchFields: ["affiliateName", "affiliateEmail", "customerName", "transactionId"],
        searchPlaceholder: "Search by affiliate, customer, or transaction ID...",
        columns: [
            { key: "affiliate", header: "Affiliate" },
            { key: "customer", header: "Customer" },
            { key: "amount", header: "Amount" },
            { key: "paymentMethod", header: "Payment Method" },
            { key: "status", header: "Status" },
            { key: "transactionId", header: "Transaction ID" },
            { key: "processedAt", header: "Processed" },
            { key: "createdAt", header: "Created" },
            { key: "actions", header: "Actions" }
        ]
    }
}

export default function CustomersPage() {
    const [currentPage, setCurrentPage] = useState(0)
    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [activeTab, setActiveTab] = useState<TabType>("customers")
    const [showInfoBanner, setShowInfoBanner] = useState(true)
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortDirection, setSortDirection] = useState("DESC")

    const [tabsData, setTabsData] = useState<Record<TabType, TabData>>({
        customers: { data: [], totalElements: 0, totalPages: 0, loading: false, error: null, loaded: false },
        commissions: { data: [], totalElements: 0, totalPages: 0, loading: false, error: null, loaded: false },
        transactions: { data: [], totalElements: 0, totalPages: 0, loading: false, error: null, loaded: false }
    })

    const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null)
    const [statusCounts, setStatusCounts] = useState<StatusCounts | null>(null)
    const [totalAcrossAllTabs, setTotalAcrossAllTabs] = useState(0)

    const fetchTabData = useCallback(async (
        tab: TabType,
        clientId: number,
        page: number = 0,
        size: number = 10,
        sortBy: string = 'createdAt',
        sortDirection: string = 'DESC',
        search?: string
    ) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDirection: sortDirection.toLowerCase()
        })

        if (search && search.trim()) {
            params.append('search', search.trim())
        }

        const endpoint = API_ENDPOINTS[tab](clientId)
        const response = await fetch(`${endpoint}?${params}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch ${tab}: ${response.statusText}`)
        }

        return response.json()
    }, [])

    const loadTabData = useCallback(async (tab: TabType, forceReload: boolean = false) => {
        if (tabsData[tab].loaded && !forceReload) {
            return
        }

        setTabsData(prev => ({
            ...prev,
            [tab]: { ...prev[tab], loading: true, error: null }
        }))

        try {
            const response: PageResponse<any> = await fetchTabData(
                tab,
                CLIENT_ID,
                currentPage,
                rowsPerPage,
                sortBy,
                sortDirection,
                searchQuery
            )

            setTabsData(prev => ({
                ...prev,
                [tab]: {
                    data: response.content,
                    totalElements: response.totalElements,
                    totalPages: response.totalPages,
                    loading: false,
                    error: null,
                    loaded: true
                }
            }))

            // Update status counts and total across all tabs (mock calculation)
            if (tab === 'customers') {
                const mockStatusCounts = {
                    active: Math.floor(response.totalElements * 0.7),
                    pending: Math.floor(response.totalElements * 0.2),
                    completed: Math.floor(response.totalElements * 0.08),
                    failed: Math.floor(response.totalElements * 0.02),
                    total: response.totalElements
                }
                setStatusCounts(mockStatusCounts)
                setTotalAcrossAllTabs(response.totalElements + 150) // Mock total across all tabs
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Failed to load ${tab}`
            setTabsData(prev => ({
                ...prev,
                [tab]: {
                    ...prev[tab],
                    loading: false,
                    error: errorMessage,
                    data: [],
                    totalElements: 0,
                    totalPages: 0
                }
            }))
        }
    }, [currentPage, rowsPerPage, sortBy, sortDirection, searchQuery])

    useEffect(() => {
        if (!tabsData[activeTab].loaded && !tabsData[activeTab].loading) {
            loadTabData(activeTab)
        }
    }, [activeTab])

    useEffect(() => {
        if (tabsData[activeTab].loaded) {
            loadTabData(activeTab, true)
        }
    }, [currentPage, rowsPerPage, sortBy, sortDirection])

    useEffect(() => {
        if (searchDebounce) {
            clearTimeout(searchDebounce)
        }

        const timeout = setTimeout(() => {
            if (tabsData[activeTab].loaded) {
                setCurrentPage(0)
                loadTabData(activeTab, true)
            }
        }, 500)

        setSearchDebounce(timeout)

        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [searchQuery])

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        setCurrentPage(0)
        setSearchQuery("")
        setSelectedItems([])
        setSortBy("createdAt")
        setSortDirection("DESC")
    }

    const handleRetry = () => {
        loadTabData(activeTab, true)
    }

    const handleSelectAll = (checked: boolean) => {
        const currentData = tabsData[activeTab].data
        setSelectedItems(checked ? currentData.map(item => item.id) : [])
    }

    const handleSelectItem = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    const handleSortChange = (column: string) => {
        if (sortBy === column) {
            setSortDirection(prev => prev === "ASC" ? "DESC" : "ASC")
        } else {
            setSortBy(column)
            setSortDirection("DESC")
        }
        setCurrentPage(0)
    }

    const handleSearch = () => {
        setCurrentPage(0)
        loadTabData(activeTab, true)
    }

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount)
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string): string => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800'
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800'
            case 'INACTIVE':
                return 'bg-gray-100 text-gray-800'
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800'
            case 'COMPLETED':
                return 'bg-blue-100 text-blue-800'
            case 'FAILED':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const currentTabData = tabsData[activeTab]
    const currentTabConfig = TAB_CONFIGS[activeTab]

    return (
        <div className="flex min-h-screen bg-background">
            <MedicalSidebar />

            <div className="flex-1 flex flex-col">
                <header className="bg-card border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder={currentTabConfig.searchPlaceholder}
                                    className="pl-10 w-64"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    disabled={currentTabData.loading}
                                />
                            </div>
                            <Button onClick={handleSearch} variant="secondary" disabled={currentTabData.loading}>
                                Search
                            </Button>
                            {activeTab === 'customers' && (
                                <Button>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Customer
                                </Button>
                            )}
                            <Button variant="ghost" size="sm">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                    <div className="container mx-auto px-6 py-8">
                        <div className="space-y-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                                </div>
                                <div className="flex gap-2">
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
                            <div className="container mx-auto px-6 py-8">
                                {showInfoBanner && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
                                        <button
                                            onClick={() => setShowInfoBanner(false)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4"/>
                                        </button>
                                        <h3 className="font-semibold mb-2">Customer Management Dashboard</h3>
                                        <p className="text-sm text-gray-700">
                                            Track your affiliate customers, commissions, and transactions all in one
                                            place.
                                            Switch between tabs to view different aspects of your affiliate program
                                            performance.
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <div className="flex gap-1 border-b">
                                        {Object.values(TAB_CONFIGS).map((tab) => {
                                            const tabData = tabsData[tab.id as TabType]
                                            const count = tabData.loaded ? tabData.totalElements : ''
                                            const label = count ? `${tab.label} (${count})` : tab.label

                                            return (
                                                <Button
                                                    key={tab.id}
                                                    variant={activeTab === tab.id ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={() => handleTabChange(tab.id as TabType)}
                                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                                                    disabled={tabData.loading}
                                                >
                                                    {label}
                                                    {tabData.loading && (
                                                        <Loader2 className="inline h-3 w-3 ml-2 animate-spin"/>
                                                    )}
                                                </Button>
                                            )
                                        })}
                                    </div>

                                    <Card>
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-medium">
                                                </CardTitle>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="sm"
                                                            disabled={currentTabData.loading}>
                                                        <Filter className="w-4 h-4 mr-2"/>
                                                        More Filters
                                                    </Button>
                                                    <Button variant="outline" size="sm"
                                                            disabled={currentTabData.loading}>
                                                        <Download className="w-4 w-4 mr-2"/>
                                                        Export
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent>
                                            {currentTabData.error && (
                                                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-red-600">Error: {currentTabData.error}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleRetry}
                                                        className="mt-2"
                                                    >
                                                        <RefreshCw className="h-4 w-4 mr-2"/>
                                                        Retry
                                                    </Button>
                                                </div>
                                            )}

                                            <div className="rounded-md border bg-background">
                                                <Table className="bg-transparent">
                                                    <TableHeader className="bg-transparent">
                                                        <TableRow className="bg-transparent hover:bg-transparent">
                                                            <TableHead className="w-12">
                                                                <Checkbox
                                                                    checked={selectedItems.length === currentTabData.data.length && currentTabData.data.length > 0}
                                                                    onCheckedChange={handleSelectAll}
                                                                    disabled={currentTabData.loading || currentTabData.data.length === 0}
                                                                />
                                                            </TableHead>
                                                            {currentTabConfig.columns.map((column) => (
                                                                <TableHead
                                                                    key={column.key}
                                                                    className={`cursor-pointer hover:text-foreground ${column.key === sortBy ? 'text-foreground' : 'text-muted-foreground'}`}
                                                                    onClick={() => handleSortChange(column.key)}
                                                                >
                                                                    {column.header}
                                                                    {column.key === sortBy && (
                                                                        <span className="ml-1">
                                                                {sortDirection === 'ASC' ? '↑' : '↓'}
                                                            </span>
                                                                    )}
                                                                </TableHead>
                                                            ))}
                                                            <TableHead></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="bg-transparent">
                                                        {currentTabData.loading ? (
                                                            <TableRow className="bg-transparent hover:bg-transparent">
                                                                <TableCell colSpan={currentTabConfig.columns.length + 2}
                                                                           className="text-center py-8 bg-transparent">
                                                                    <div className="flex items-center justify-center">
                                                                        <div
                                                                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
                                                                        <span>Loading {currentTabConfig.label.toLowerCase()}...</span>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : !currentTabData.data || currentTabData.data.length === 0 ? (
                                                            <TableRow className="bg-transparent hover:bg-transparent">
                                                                <TableCell colSpan={currentTabConfig.columns.length + 2}
                                                                           className="text-center py-8 bg-transparent">
                                                                    <div className="flex flex-col items-center">
                                                                        <Users
                                                                            className="w-12 h-12 text-muted-foreground mb-2"/>
                                                                        <p className="text-muted-foreground">
                                                                            {searchQuery ? 'No results found for your search.' : `No ${currentTabConfig.label.toLowerCase()} found`}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ) : (
                                                            currentTabData.data.map((item: any) => (
                                                                <TableRow key={item.id}
                                                                          className="bg-transparent hover:bg-muted/20">
                                                                    <TableCell className="bg-transparent">
                                                                        <Checkbox
                                                                            checked={selectedItems.includes(item.id)}
                                                                            onCheckedChange={() => handleSelectItem(item.id)}
                                                                        />
                                                                    </TableCell>
                                                                    {currentTabConfig.columns.map((column) => (
                                                                        <TableCell key={column.key}
                                                                                   className="bg-transparent">
                                                                            {renderCellContent(item, column.key)}
                                                                        </TableCell>
                                                                    ))}
                                                                    <TableCell className="bg-transparent">
                                                                        <MoreHorizontal className="h-4 w-4"/>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {currentTabData.data.length > 0 && (
                                                <div className="flex items-center justify-between space-x-2 py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <p className="text-sm font-medium">Rows per page</p>
                                                        <Select
                                                            value={`${rowsPerPage}`}
                                                            onValueChange={(value) => {
                                                                setRowsPerPage(Number(value))
                                                                setCurrentPage(0)
                                                            }}
                                                        >
                                                            <SelectTrigger className="h-8 w-[70px]">
                                                                <SelectValue placeholder={rowsPerPage}/>
                                                            </SelectTrigger>
                                                            <SelectContent side="top">
                                                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                                                        {pageSize}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex items-center space-x-6 lg:space-x-8">
                                                        <div className="flex items-center space-x-2">
                                                            <p className="text-sm font-medium">
                                                                Page {currentPage + 1} of {currentTabData.totalPages || 1}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handlePageChange(currentPage - 1)}
                                                                disabled={currentPage === 0 || currentTabData.loading}
                                                            >
                                                                <ChevronLeft className="h-4 w-4"/>
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                className="h-8 w-8 p-0"
                                                                onClick={() => handlePageChange(currentPage + 1)}
                                                                disabled={currentPage >= (currentTabData.totalPages - 1) || currentTabData.loading}
                                                            >
                                                                <ChevronRight className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        </div>
                        </main>
            </div>
        </div>
)
}