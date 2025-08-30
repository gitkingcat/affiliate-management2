"use client"

import { useState, useEffect } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Search, Filter, Download, Bell, Mail, X, UserPlus, Loader2 } from "lucide-react"
import { tabConfigs, renderCellContent } from "@/src/config/customers-tab-configs"
import { filterData } from "@/src/utils/customers-utils"

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

interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    size: number
    number: number
    first: boolean
    last: boolean
}

// Mock clientId - in real app, get from auth context or props
const CLIENT_ID = 1

const fetchCustomers = async (
    clientId: number,
    page: number,
    size: number,
    sortBy: string = 'createdAt',
    sortDirection: string = 'DESC',
    search?: string
): Promise<PageResponse<ReferralCustomerDTO>> => {
    const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
        sortBy,
        sortDirection
    })

    if (search && search.trim()) {
        params.append('search', search.trim())
    }
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/referrals/client/${clientId}/customers?${params}`)

    if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`)
    }

    return response.json()
}

export default function CustomersPage() {
    const [currentPage, setCurrentPage] = useState(0) // Backend uses 0-based pagination
    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [activeTab, setActiveTab] = useState("customers")
    const [showInfoBanner, setShowInfoBanner] = useState(true)
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortDirection, setSortDirection] = useState("DESC")

    // API state
    const [customers, setCustomers] = useState<ReferralCustomerDTO[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Search debounce
    const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(null)

    const loadCustomers = async () => {
        if (activeTab !== "customers") return

        try {
            setLoading(true)
            setError(null)

            const response = await fetchCustomers(
                CLIENT_ID,
                currentPage,
                rowsPerPage,
                sortBy,
                sortDirection,
                searchQuery
            )

            setCustomers(response.content)
            setTotalElements(response.totalElements)
            setTotalPages(response.totalPages)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load customers')
            setCustomers([])
        } finally {
            setLoading(false)
        }
    }

    // Load customers on component mount and when dependencies change
    useEffect(() => {
        loadCustomers()
    }, [currentPage, rowsPerPage, sortBy, sortDirection, activeTab])

    // Debounced search
    useEffect(() => {
        if (searchDebounce) {
            clearTimeout(searchDebounce)
        }

        const timeout = setTimeout(() => {
            if (activeTab === "customers") {
                setCurrentPage(0) // Reset to first page on search
                loadCustomers()
            }
        }, 500) // 500ms debounce

        setSearchDebounce(timeout)

        return () => {
            if (timeout) clearTimeout(timeout)
        }
    }, [searchQuery])

    const getCurrentTabConfig = () => {
        if (activeTab === "customers") {
            return {
                ...tabConfigs[0],
                data: customers,
                label: `Customers (${totalElements})`
            }
        }
        return tabConfigs.find(tab => tab.id === activeTab) || tabConfigs[0]
    }

    const currentTabConfig = getCurrentTabConfig()

    // For non-customers tabs, use local filtering
    const filteredData = activeTab === "customers"
        ? customers
        : filterData(currentTabConfig.data, searchQuery, currentTabConfig.searchFields)

    const currentData = activeTab === "customers"
        ? customers
        : filteredData.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage)

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? currentData.map(item => item.id) : [])
    }

    const handleSelectItem = (itemId: number) => {
        setSelectedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        )
    }

    const handleTabChange = (tabName: string) => {
        setActiveTab(tabName)
        setCurrentPage(0)
        setSearchQuery("")
        setSelectedItems([])
        setSortBy("createdAt")
        setSortDirection("DESC")
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    const handleSortChange = (column: string) => {
        if (activeTab !== "customers") return

        if (sortBy === column) {
            setSortDirection(prev => prev === "ASC" ? "DESC" : "ASC")
        } else {
            setSortBy(column)
            setSortDirection("DESC")
        }
        setCurrentPage(0)
    }

    const renderTableContent = () => (
        <div className="bg-background rounded-lg shadow-sm border border-border">
            <div className="px-6 py-4 border-b border-border">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input
                            placeholder={currentTabConfig.searchPlaceholder}
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={loading}>
                            <Filter className="h-4 w-4 mr-2"/>
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" disabled={loading}>
                            <Download className="h-4 w-4 mr-2"/>
                            Export
                        </Button>
                        {currentTabConfig.actions}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2"/>
                    <span>Loading customers...</span>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center py-8">
                    <div className="text-red-600 text-center">
                        <p className="font-medium">Error loading customers</p>
                        <p className="text-sm">{error}</p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={loadCustomers}
                            className="mt-2"
                        >
                            Retry
                        </Button>
                    </div>
                </div>
            )}

            {!loading && !error && (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {activeTab === "customers" && (
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={selectedItems.length === currentData.length && currentData.length > 0}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                )}
                                {currentTabConfig.columns.map(column => (
                                    <TableHead
                                        key={column.key}
                                        className={`${column.width || ''} ${
                                            activeTab === "customers" && ['customerName', 'totalPaid', 'createdAt'].includes(column.key)
                                                ? 'cursor-pointer hover:bg-muted/50'
                                                : ''
                                        }`}
                                        onClick={() => {
                                            if (activeTab === "customers") {
                                                const sortableColumns = {
                                                    'customer': 'customerName',
                                                    'totalPaid': 'totalPaid',
                                                    'totalCommission': 'totalCommission',
                                                    'createdAt': 'createdAt'
                                                }
                                                const sortColumn = sortableColumns[column.key as keyof typeof sortableColumns]
                                                if (sortColumn) handleSortChange(sortColumn)
                                            }
                                        }}
                                    >
                                        <div className="flex items-center gap-1">
                                            {column.header}
                                            {activeTab === "customers" && (
                                                <>
                                                    {(column.key === 'customer' && sortBy === 'customerName') ||
                                                    (column.key === 'totalPaid' && sortBy === 'totalPaid') ||
                                                    (column.key === 'totalCommission' && sortBy === 'totalCommission') ||
                                                    (column.key === 'createdAt' && sortBy === 'createdAt') ? (
                                                        <span className="text-xs">
                                                            {sortDirection === 'ASC' ? '↑' : '↓'}
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={currentTabConfig.columns.length + (activeTab === "customers" ? 1 : 0)}
                                        className="text-center py-8 text-muted-foreground"
                                    >
                                        No customers found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentData.map((item) => (
                                    <TableRow key={item.id}>
                                        {activeTab === "customers" && (
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.includes(item.id)}
                                                    onCheckedChange={() => handleSelectItem(item.id)}
                                                />
                                            </TableCell>
                                        )}
                                        {currentTabConfig.columns.map(column => (
                                            <TableCell key={column.key} className={column.key === "actions" ? "text-right" : ""}>
                                                {column.render ? column.render(item) : renderCellContent(item, column.key)}
                                                {column.key === "status" && item.cancellationReason && (
                                                    <div className="text-xs text-red-600 mt-1 max-w-32 truncate" title={item.cancellationReason}>
                                                        {item.cancellationReason}
                                                    </div>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    <div className="px-6 py-4 border-t border-border">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {currentPage * rowsPerPage + 1} to {Math.min((currentPage + 1) * rowsPerPage, activeTab === "customers" ? totalElements : filteredData.length)} of {activeTab === "customers" ? totalElements : filteredData.length} results
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={rowsPerPage.toString()}
                                    onValueChange={(value) => {
                                        setRowsPerPage(Number(value))
                                        setCurrentPage(0)
                                    }}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-20 h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5</SelectItem>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="20">20</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4"/>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(Math.min((activeTab === "customers" ? totalPages : Math.ceil(filteredData.length / rowsPerPage)) - 1, currentPage + 1))}
                                    disabled={currentPage >= (activeTab === "customers" ? totalPages - 1 : Math.ceil(filteredData.length / rowsPerPage) - 1) || loading}
                                >
                                    <ChevronRight className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )

    return (
        <div className="flex h-screen bg-background">
            <MedicalSidebar/>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                    </div>

                </header>
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                                <p className="text-muted-foreground">
                                    Manage your customers, commissions, and transactions
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                    <Bell className="h-4 w-4 mr-2"/>
                                    Notifications
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Mail className="h-4 w-4 mr-2"/>
                                    Email
                                </Button>
                            </div>
                        </div>

                        {showInfoBanner && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <p className="text-blue-800 text-sm">
                                        <strong>New:</strong> Track commissions and transactions across all your
                                        affiliate programs.
                                        <a href="#" className="text-blue-600 hover:underline ml-1">Learn more.</a>
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowInfoBanner(false)}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-1 border-b">
                                {tabConfigs.map(tab => (
                                    <Button
                                        key={tab.id}
                                        variant={activeTab === tab.id ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => handleTabChange(tab.id)}
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                                    >
                                        {tab.id === "customers" ? `Customers (${totalElements})` : tab.label}
                                    </Button>
                                ))}
                            </div>

                            {renderTableContent()}
                        </div>
                    </div>
                </main>
            </div>
            </div>
            )
            }