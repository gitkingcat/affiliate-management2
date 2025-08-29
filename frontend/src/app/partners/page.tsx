"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal, Plus, UserPlus, Bell, Mail } from "lucide-react"

const partners = [
  {
    id: 1,
    name: "Robert California",
    email: "robert@email.com",
    signupDate: "February 26, 2025",
    signupTime: "11:29 AM",
    revenue: 0,
    earnings: 0,
    clicks: 0,
    leads: 0,
    customers: 0,
    status: "Active",
  },
  {
    id: 2,
    name: "Adrian Monk",
    email: "monk@email.com",
    signupDate: "February 26, 2025",
    signupTime: "11:28 AM",
    revenue: 0,
    earnings: 0,
    clicks: 0,
    leads: 0,
    customers: 0,
    status: "Active",
  },
  {
    id: 3,
    name: "Dale Mike",
    email: "dalemike@email.com",
    signupDate: "February 25, 2025",
    signupTime: "04:41 PM",
    revenue: 0,
    earnings: 0,
    clicks: 0,
    leads: 0,
    customers: 0,
    status: "Active",
  },
  {
    id: 4,
    name: "Richard Hendricks",
    email: "richard@piedpiper.com",
    signupDate: "February 25, 2025",
    signupTime: "03:55 PM",
    revenue: 0,
    earnings: 0,
    clicks: 0,
    leads: 0,
    customers: 0,
    status: "Active",
  },
  {
    id: 5,
    name: "Creed Bratton",
    email: "creed@dundermifflin.com",
    signupDate: "February 25, 2025",
    signupTime: "03:54 PM",
    revenue: 0,
    earnings: 0,
    clicks: 0,
    leads: 2,
    customers: 3,
    status: "Active",
  },
  {
    id: 6,
    name: "Toby Flenderson",
    email: "toby@dundermifflin.com",
    signupDate: "February 25, 2025",
    signupTime: "03:54 PM",
    revenue: 0,
    earnings: 0,
    clicks: 0,
    leads: 0,
    customers: 0,
    status: "Active",
  },
  {
    id: 7,
    name: "Jim Halpert",
    email: "jim@dundermifflin.com",
    signupDate: "February 25, 2025",
    signupTime: "03:54 PM",
    revenue: 1028.0,
    earnings: 565.4,
    clicks: 0,
    leads: 2,
    customers: 2,
    status: "Active",
  },
  {
    id: 8,
    name: "Kevin Malone",
    email: "kevin@dundermifflin.com",
    signupDate: "February 25, 2025",
    signupTime: "03:53 PM",
    revenue: 499.83,
    earnings: 274.9,
    clicks: 0,
    leads: 2,
    customers: 2,
    status: "Active",
  },
  {
    id: 9,
    name: "Andy Bernard",
    email: "andy@dundermifflin.com",
    signupDate: "February 25, 2025",
    signupTime: "03:53 PM",
    revenue: 198.0,
    earnings: 108.9,
    clicks: 0,
    leads: 2,
    customers: 2,
    status: "Active",
  },
  {
    id: 10,
    name: "Dwight Schrute",
    email: "dwight@dundermifflin.com",
    signupDate: "February 25, 2025",
    signupTime: "03:52 PM",
    revenue: 99.0,
    earnings: 54.45,
    clicks: 0,
    leads: 2,
    customers: 1,
    status: "Active",
  },
  {
    id: 11,
    name: "Michael Scott",
    email: "michael@dundermifflin.com",
    signupDate: "February 24, 2025",
    signupTime: "02:15 PM",
    revenue: 250.0,
    earnings: 137.5,
    clicks: 0,
    leads: 1,
    customers: 1,
    status: "Pending",
  },
]

export default function PartnersPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("Active")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredPartners = partners.filter((partner) => {
    const matchesStatus = statusFilter === "All" || partner.status === statusFilter
    const matchesSearch =
        searchQuery === "" ||
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.email.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredPartners.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentPartners = filteredPartners.slice(startIndex, endIndex)

  const activeCount = partners.filter((p) => p.status === "Active").length
  const pendingCount = partners.filter((p) => p.status === "Pending").length
  const invitedCount = partners.filter((p) => p.status === "Invited").length
  const otherCount = partners.filter((p) => !["Active", "Pending", "Invited"].includes(p.status)).length

  const formatCurrency = (amount: number) => {
    return amount === 0 ? "$0.00" : `$${amount.toFixed(2)}`
  }

  return (
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <MedicalSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-background border-b border-border">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 max-w-2xl gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search affiliates, customers, payouts..."
                        className="pl-10 bg-muted/50"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Mail className="h-5 w-5" />
                  </Button>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                      <SelectItem value="365">Last 365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Partners</h1>
                  </div>
                  <div className="flex gap-2">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create partner
                    </Button>
                    <Button variant="outline">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite partner
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex gap-1 border-b">
                    <Button
                        variant={statusFilter === "Active" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setStatusFilter("Active")
                          setCurrentPage(1)
                        }}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Active ({activeCount})
                    </Button>
                    <Button
                        variant={statusFilter === "Pending" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setStatusFilter("Pending")
                          setCurrentPage(1)
                        }}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Pending ({pendingCount})
                    </Button>
                    <Button
                        variant={statusFilter === "Invited" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setStatusFilter("Invited")
                          setCurrentPage(1)
                        }}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Invited ({invitedCount})
                    </Button>
                    <Button
                        variant={statusFilter === "Other" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => {
                          setStatusFilter("Other")
                          setCurrentPage(1)
                        }}
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Other ({otherCount})
                    </Button>
                  </div>

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder="Search by partner name, email or link parameter..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                      <Button variant="outline" size="sm">
                        Actions
                        <MoreHorizontal className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Active partners</h2>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input type="checkbox" className="rounded" />
                          </TableHead>
                          <TableHead>Signed up at</TableHead>
                          <TableHead>Partner</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Earnings</TableHead>
                          <TableHead>Clicks</TableHead>
                          <TableHead>Leads</TableHead>
                          <TableHead>Customers</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPartners.map((partner) => (
                            <TableRow key={partner.id}>
                              <TableCell>
                                <input type="checkbox" className="rounded" />
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                <div>{partner.signupDate}</div>
                                <div>{partner.signupTime}</div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-primary hover:underline cursor-pointer">{partner.name}</div>
                                  <div className="text-sm text-muted-foreground">{partner.email}</div>
                                </div>
                              </TableCell>
                              <TableCell>{formatCurrency(partner.revenue)}</TableCell>
                              <TableCell>{formatCurrency(partner.earnings)}</TableCell>
                              <TableCell>{partner.clicks}</TableCell>
                              <TableCell>{partner.leads}</TableCell>
                              <TableCell>{partner.customers}</TableCell>
                            </TableRow>
                        ))}
                        {currentPartners.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No partners found
                              </TableCell>
                            </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                      <ChevronLeft className="h-4 w-4" />
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground px-2">
                    {currentPage} of {totalPages}
                  </span>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                      <SelectTrigger className="w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-background border-t border-border">
            <div className="container mx-auto px-6 py-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>© 2024 AffiliateFlow. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
  )
}