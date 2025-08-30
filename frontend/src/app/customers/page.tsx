"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal, Plus, Bell, Mail, X, Upload} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const customers = [
    {
        id: 1,
        createdAt: "February 25, 2025 04:04 PM",
        customerName: "Pam Beesly",
        customerEmail: "pam@email.com",
        partnerName: "Jim Halpert",
        partnerEmail: "jim@dundermifflin.com",
        totalPaid: 29.00,
        totalCommission: 15.95,
        status: "Active"
    },
    {
        id: 2,
        createdAt: "February 25, 2025 04:02 PM",
        customerName: "Gabe Lewis",
        customerEmail: "gabe@email.com",
        partnerName: "Davanit Schriute",
        partnerEmail: "davanit@dundermifflin.com",
        totalPaid: 99.00,
        totalCommission: 54.45,
        status: "Active"
    },
    {
        id: 3,
        createdAt: "February 25, 2025 03:59 PM",
        customerName: "Meredith Palmer",
        customerEmail: "meredith@email.com",
        partnerName: "Davanit Schriute",
        partnerEmail: "davanit@dundermifflin.com",
        totalPaid: 0.00,
        totalCommission: 0.00,
        status: "Lead"
    },
    {
        id: 4,
        createdAt: "February 25, 2025 12:00 AM",
        customerName: "Mose",
        customerEmail: "mose@email.com",
        partnerName: "Creed Bratton",
        partnerEmail: "creed@dundermifflin.com",
        totalPaid: 0.00,
        totalCommission: 0.00,
        status: "Suspended"
    },
    {
        id: 5,
        createdAt: "February 1, 2025 12:00 AM",
        customerName: "Oscar Martinez",
        customerEmail: "oscar@email.com",
        partnerName: "Andy Bernard",
        partnerEmail: "andy@dundermifflin.com",
        totalPaid: 99.00,
        totalCommission: 54.45,
        status: "Active"
    },
    {
        id: 6,
        createdAt: "February 1, 2025 12:00 AM",
        customerName: "Prison Mike",
        customerEmail: "prisonmike@email.com",
        partnerName: "Kevin Malone",
        partnerEmail: "kevin@dundermifflin.com",
        totalPaid: 99.89,
        totalCommission: 54.99,
        status: "Active"
    },
    {
        id: 7,
        createdAt: "February 1, 2025 12:00 AM",
        customerName: "Nard Dog",
        customerEmail: "nard-dog@email.com",
        partnerName: "Kevin Malone",
        partnerEmail: "kevin@dundermifflin.com",
        totalPaid: 399.84,
        totalCommission: 219.91,
        status: "Active"
    },
    {
        id: 8,
        createdAt: "January 1, 2025 12:00 AM",
        customerName: "Big Tuna",
        customerEmail: "bigtuna@email.com",
        partnerName: "Jim Halpert",
        partnerEmail: "jim@dundermifflin.com",
        totalPaid: 999.00,
        totalCommission: 549.45,
        status: "Active"
    },
    {
        id: 9,
        createdAt: "January 1, 2025 12:00 AM",
        customerName: "Darryl Philbin",
        customerEmail: "darryl@email.com",
        partnerName: "Creed Bratton",
        partnerEmail: "creed@dundermifflin.com",
        totalPaid: 0.00,
        totalCommission: 0.00,
        status: "Lead"
    },
    {
        id: 10,
        createdAt: "June 1, 2024 12:00 AM",
        customerName: "Stanley Hudson",
        customerEmail: "stanley@email.com",
        partnerName: "Andy Bernard",
        partnerEmail: "andy@dundermifflin.com",
        totalPaid: 99.00,
        totalCommission: 54.45,
        status: "Active"
    }
]

export default function CustomersPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([])
    const [activeTab, setActiveTab] = useState("customers")
    const [showInfoBanner, setShowInfoBanner] = useState(true)

    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            searchQuery === "" ||
            customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.partnerEmail.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const currentCustomers = filteredCustomers.slice(startIndex, endIndex)

    const formatCurrency = (amount: number) => {
        return `$${amount.toFixed(2)}`
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedCustomers(currentCustomers.map(c => c.id))
        } else {
            setSelectedCustomers([])
        }
    }

    const handleSelectCustomer = (customerId: number) => {
        setSelectedCustomers(prev =>
            prev.includes(customerId)
                ? prev.filter(id => id !== customerId)
                : [...prev, customerId]
        )
    }

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            Active: { className: "bg-green-500 text-white hover:bg-green-600", label: "Active" },
            Lead: { className: "bg-yellow-500 text-white hover:bg-yellow-600", label: "Lead" },
            Suspended: { className: "bg-red-500 text-white hover:bg-red-600", label: "Suspended" }
        }

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Active

        return (
            <Badge className={config.className}>
                {config.label}
            </Badge>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            <MedicalSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
                        </div>

                        {showInfoBanner && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
                                <button
                                    onClick={() => setShowInfoBanner(false)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4"/>
                                </button>
                                <h3 className="font-semibold mb-2">What are Customers?</h3>
                                <p className="text-sm text-gray-700">
                                    Customers represent individuals referred by affiliates and can be Active/Paid,
                                    Leads, or Trial. Cancelled customers have discontinued their plan or product, while
                                    Suspended ones have been suspended by you, preventing further commission generation.
                                    <a href="#" className="text-blue-600 hover:underline ml-1">Learn more.</a>
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="flex gap-1 border-b">
                                <Button
                                    variant={activeTab === "customers" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveTab("customers")
                                        setCurrentPage(1)
                                    }}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                                >
                                    Customers ({customers.length})
                                </Button>
                                <Button
                                    variant={activeTab === "commissions" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveTab("commissions")
                                        setCurrentPage(1)
                                    }}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                                >
                                    Commissions (7)
                                </Button>
                                <Button
                                    variant={activeTab === "transactions" ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveTab("transactions")
                                        setCurrentPage(1)
                                    }}
                                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                                >
                                    Transactions (7)
                                </Button>
                            </div>

                            {activeTab === "customers" && (
                                <div className="bg-background rounded-lg shadow-sm border border-border">
                                    <div className="px-6 py-4 border-b border-border">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="relative flex-1 max-w-md">
                                                <Search
                                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                                <Input
                                                    placeholder="Search by customer name, email or ID..."
                                                    className="pl-10"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Filter className="h-4 w-4 mr-2"/>
                                                    Filters
                                                </Button>
                                                <Select value="actions">
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue placeholder="Actions"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="actions">Actions</SelectItem>
                                                        <SelectItem value="export">Export</SelectItem>
                                                        <SelectItem value="delete">Delete</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12">
                                                        <Checkbox
                                                            checked={selectedCustomers.length === currentCustomers.length && currentCustomers.length > 0}
                                                            onCheckedChange={handleSelectAll}
                                                        />
                                                    </TableHead>
                                                    <TableHead>Created at ↓</TableHead>
                                                    <TableHead>Customer ↑</TableHead>
                                                    <TableHead>Partner ↑</TableHead>
                                                    <TableHead>Total paid ↑</TableHead>
                                                    <TableHead>Total commission ↑</TableHead>
                                                    <TableHead>Status ↑</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {currentCustomers.map((customer) => (
                                                    <TableRow key={customer.id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={selectedCustomers.includes(customer.id)}
                                                                onCheckedChange={() => handleSelectCustomer(customer.id)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {customer.createdAt}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <a href="#"
                                                                   className="text-blue-600 hover:underline font-medium">
                                                                    {customer.customerName}
                                                                </a>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {customer.customerEmail}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div>
                                                                <a href="#"
                                                                   className="text-blue-600 hover:underline font-medium">
                                                                    {customer.partnerName}
                                                                </a>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {customer.partnerEmail}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatCurrency(customer.totalPaid)}</TableCell>
                                                        <TableCell>{formatCurrency(customer.totalCommission)}</TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(customer.status)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="px-6 py-4 border-t border-border">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">Rows per page:</span>
                                                <Select value={rowsPerPage.toString()}
                                                        onValueChange={(value) => setRowsPerPage(Number(value))}>
                                                    <SelectTrigger className="w-[70px] h-8">
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

                                            <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} of {filteredCustomers.length}
                        </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                                    disabled={currentPage === 1}
                                                >
                                                    <ChevronLeft className="h-4 w-4"/>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    <ChevronRight className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "commissions" && (
                                <div className="bg-background rounded-lg shadow-sm border border-border p-6">
                                    <p className="text-muted-foreground">Commissions content goes here...</p>
                                </div>
                            )}

                            {activeTab === "transactions" && (
                                <div className="bg-background rounded-lg shadow-sm border border-border p-6">
                                    <p className="text-muted-foreground">Transactions content goes here...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}