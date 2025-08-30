"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal, Plus, Upload, X } from "lucide-react"

interface Payout {
  id: number
  createdAt: string
  partnerName: string
  partnerEmail: string
  method: string
  commissionPeriod: string
  amount: number
  status: "Pending" | "Paid"
}

const payouts: Payout[] = [
  {
    id: 1,
    createdAt: "February 25, 2025 04:24 PM",
    partnerName: "Kevin Malone",
    partnerEmail: "kevin@email.com",
    method: "PayPal",
    commissionPeriod: "2024-09-30 - 2025-02-25",
    amount: 274.90,
    status: "Pending"
  },
  {
    id: 2,
    createdAt: "February 25, 2025 04:24 PM",
    partnerName: "Jim Halpert",
    partnerEmail: "jim@email.com",
    method: "PayPal",
    commissionPeriod: "2024-09-30 - 2025-02-25",
    amount: 585.40,
    status: "Pending"
  },
  {
    id: 3,
    createdAt: "February 24, 2025 02:15 PM",
    partnerName: "Pam Beesly",
    partnerEmail: "pam@email.com",
    method: "Bank Transfer",
    commissionPeriod: "2024-08-30 - 2025-01-25",
    amount: 423.75,
    status: "Paid"
  },
  {
    id: 4,
    createdAt: "February 23, 2025 10:30 AM",
    partnerName: "Dwight Schrute",
    partnerEmail: "dwight@email.com",
    method: "PayPal",
    commissionPeriod: "2024-08-15 - 2025-01-15",
    amount: 892.30,
    status: "Paid"
  }
]

export default function PayoutsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedPayouts, setSelectedPayouts] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("pending")
  const [showInfoBanner, setShowInfoBanner] = useState(true)

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
        searchQuery === "" ||
        payout.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payout.partnerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payout.id.toString().includes(searchQuery)

    const matchesTab =
        activeTab === "pending" ? payout.status === "Pending" :
            activeTab === "paid" ? payout.status === "Paid" : true

    return matchesSearch && matchesTab
  })

  const pendingPayouts = payouts.filter(p => p.status === "Pending")
  const paidPayouts = payouts.filter(p => p.status === "Paid")

  const totalPages = Math.ceil(filteredPayouts.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPayouts = filteredPayouts.slice(startIndex, endIndex)

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`
  }

  const getStatusBadge = (status: string) => {
    return (
        <Badge
            variant={status === "Pending" ? "default" : "secondary"}
            className={status === "Pending" ? "bg-blue-500 hover:bg-blue-600" : "bg-green-100 text-green-800"}
        >
          {status}
        </Badge>
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayouts(currentPayouts.map(p => p.id))
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

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2"/>
                Upload payouts
              </Button>
              <Button size="sm">
                Generate payouts
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Payouts</h1>
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
                      month. For example, commissions earned in September will have payouts generated on October 15th.
                      You can also manually generate payouts at any time using the 'Generate Payouts' button.
                      <a href="#" className="text-blue-600 hover:underline ml-1">Learn more.</a>
                    </p>
                  </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex gap-1 border-b">
                  <Button
                      variant={activeTab === "pending" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setActiveTab("pending")
                        setCurrentPage(1)
                      }}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Pending ({pendingPayouts.length})
                  </Button>
                  <Button
                      variant={activeTab === "paid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => {
                        setActiveTab("paid")
                        setCurrentPage(1)
                      }}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Paid ({paidPayouts.length})
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                      <Input
                          placeholder="Search by partner name, email, or payout ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-80"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2"/>
                      Filters
                    </Button>
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark as paid
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                                checked={selectedPayouts.length === currentPayouts.length && currentPayouts.length > 0}
                                onCheckedChange={handleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Created at</TableHead>
                          <TableHead>Partner</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Commission period</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPayouts.map((payout) => (
                            <TableRow key={payout.id}>
                              <TableCell>
                                <Checkbox
                                    checked={selectedPayouts.includes(payout.id)}
                                    onCheckedChange={() => handleSelectPayout(payout.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {payout.createdAt}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <a href="#" className="text-blue-600 hover:underline font-medium">
                                    {payout.partnerName}
                                  </a>
                                  <div className="text-sm text-muted-foreground">
                                    {payout.partnerEmail}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span>{payout.method}</span>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground"/>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm">
                                  {payout.commissionPeriod}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(payout.amount)}
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(payout.status)}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                              </TableCell>
                            </TableRow>
                        ))}
                        {currentPayouts.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No payouts found
                              </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="px-6 py-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4"/>
                          <ChevronLeft className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4"/>
                        </Button>

                        <span className="text-sm text-muted-foreground px-2">
                                                {startIndex + 1} of {filteredPayouts.length}
                                            </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4"/>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4"/>
                          <ChevronRight className="h-4 w-4"/>
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page</span>
                        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                          <SelectTrigger className="w-16">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}