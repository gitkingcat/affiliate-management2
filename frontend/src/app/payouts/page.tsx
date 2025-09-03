"use client"

import { useState, useEffect } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import Header from "@/src/headers/header"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, MoreHorizontal, X } from "lucide-react"

interface PayoutDto {
  id: number
  createdAt: string
  partnerName: string
  email: string
  method: string
  commissionStart: string
  commissionEnd: string
  amount: number
  status: "PENDING" | "PAID"
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

interface FilterState {
  partnerName: string
  email: string
  status: string
  commissionStart: string
  commissionEnd: string
}

const CLIENT_ID = 1
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

export default function PayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState("createdAt")
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [showInfoBanner, setShowInfoBanner] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [filters, setFilters] = useState<FilterState>({
    partnerName: "",
    email: "",
    status: "",
    commissionStart: "",
    commissionEnd: ""
  })

  const fetchPayouts = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString(),
        sort: sortField
      })

      if (filters.partnerName) params.append('partnerName', filters.partnerName)
      if (filters.email) params.append('email', filters.email)
      if (filters.status) params.append('status', filters.status)
      if (filters.commissionStart) params.append('commissionStart', filters.commissionStart)
      if (filters.commissionEnd) params.append('commissionEnd', filters.commissionEnd)

      const response = await fetch(
          `${API_BASE_URL}/api/v1/clients/${CLIENT_ID}/payouts?${params}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: PageResponse<PayoutDto> = await response.json()

      setPayouts(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      setCurrentPage(data.number)
    } catch (error) {
      console.error('Error fetching payouts:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch payouts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayouts()
  }, [currentPage, pageSize, sortField, filters])

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(0)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.includes('@')) {
      handleFilterChange('email', query)
    } else {
      handleFilterChange('partnerName', query)
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "pending") {
      handleFilterChange('status', 'PENDING')
    } else if (tab === "paid") {
      handleFilterChange('status', 'PAID')
    } else {
      handleFilterChange('status', '')
    }
    setCurrentPage(0)
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCommissionPeriod = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const endDate = new Date(end).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    return `${startDate} - ${endDate}`
  }

  const getStatusBadge = (status: string) => {
    return (
        <Badge
            variant={status === "PENDING" ? "default" : "secondary"}
            className={status === "PENDING" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-100 text-green-800"}
        >
          {status === "PENDING" ? "Pending" : "Paid"}
        </Badge>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayouts(payouts.map(p => p.id))
    } else {
      setSelectedPayouts([])
    }
  }

  const handleSelectPayout = (payoutId: number) => {
    setSelectedPayouts(prev =>
        prev.includes(payoutId)
            ? prev.filter(id => id !== payoutId)
            : [...prev, payoutId]
    )
  }

  const pendingCount = payouts.filter(p => p.status === "PENDING").length
  const paidCount = payouts.filter(p => p.status === "PAID").length

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar/>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
              searchQuery={searchQuery}
              filters={filters}
              onSearchChange={handleSearch}
              onFilterChange={handleFilterChange}
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
                <div className="text-sm text-muted-foreground">
                  {loading ? 'Loading...' : `${totalElements} total payouts`}
                </div>
              </div>

              {showInfoBanner && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
                    <button
                        onClick={() => setShowInfoBanner(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4"/>
                    </button>
                    <h3 className="font-semibold mb-2">What are Payouts?</h3>
                    <p className="text-sm text-gray-700">
                      Payouts are automatically generated on a NET-15 basis, meaning 15 days after the end of each
                      month.
                      For example, commissions earned in September will have payouts generated on October 15th.
                      You can also manually generate payouts at any time using the 'Generate Payouts' button.
                    </p>
                  </div>
              )}

              <div className="flex gap-2 mb-6">
                <Button
                    variant={activeTab === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("all")}
                >
                  All ({totalElements})
                </Button>
                <Button
                    variant={activeTab === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("pending")}
                >
                  Pending ({pendingCount})
                </Button>
                <Button
                    variant={activeTab === "paid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTabChange("paid")}
                >
                  Paid ({paidCount})
                </Button>
              </div>

              {error && (
                  <div className="text-red-600 mb-4 p-4 bg-red-50 rounded-lg">
                    Error: {error}
                  </div>
              )}

              <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                            checked={selectedPayouts.length === payouts.length && payouts.length > 0}
                            onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Partner</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Commission Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            Loading payouts...
                          </TableCell>
                        </TableRow>
                    ) : payouts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No payouts found
                          </TableCell>
                        </TableRow>
                    ) : (
                        payouts.map((payout) => (
                            <TableRow key={payout.id}>
                              <TableCell>
                                <Checkbox
                                    checked={selectedPayouts.includes(payout.id)}
                                    onCheckedChange={() => handleSelectPayout(payout.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">{payout.partnerName}</div>
                                <div className="text-sm text-muted-foreground">{payout.email}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {payout.method}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {formatCommissionPeriod(payout.commissionStart, payout.commissionEnd)}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(payout.amount)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(payout.status)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                              </TableCell>
                            </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Show</span>
                  <Select
                      value={pageSize.toString()}
                      onValueChange={(value) => {
                        setPageSize(parseInt(value))
                        setCurrentPage(0)
                      }}
                  >
                    <SelectTrigger className="w-20">
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
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
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
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}