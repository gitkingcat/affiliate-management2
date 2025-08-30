"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight, Search, Filter, Download, Bell, Mail, X } from "lucide-react"
import { tabConfigs, renderCellContent } from "@/src/config/customers-tab-configs"
import { filterData } from "@/src/utils/customers-utils"

export default function CustomersPage() {
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const [activeTab, setActiveTab] = useState("customers")
    const [showInfoBanner, setShowInfoBanner] = useState(true)

    const currentTabConfig = tabConfigs.find(tab => tab.id === activeTab) || tabConfigs[0]
    const filteredData = filterData(currentTabConfig.data, searchQuery, currentTabConfig.searchFields)
    const totalPages = Math.ceil(filteredData.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    const currentData = filteredData.slice(startIndex, endIndex)

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
        setCurrentPage(1)
        setSearchQuery("")
        setSelectedItems([])
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
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2"/>
                            Filter
                        </Button>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2"/>
                            Export
                        </Button>
                        {currentTabConfig.actions}
                    </div>
                </div>
            </div>

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
                            <TableHead key={column.key} className={column.width}>
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentData.map((item) => (
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
                    ))}
                </TableBody>
            </Table>

            <div className="px-6 py-4 border-t border-border">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-muted-foreground">
                        Showing {Math.min(startIndex + 1, filteredData.length)} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
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
    )

    return (
        <div className="flex h-screen bg-background">
            <MedicalSidebar/>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-4">
                    </div>

                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
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
                                    Send email to customer
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
                                        {tab.label}
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