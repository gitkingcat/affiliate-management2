// Tab configurations for Customers page
// Path: frontend/src/config/customers-tab-configs.tsx

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, CreditCard, Calendar, MoreHorizontal, Eye, UserPlus } from "lucide-react"
import { transactions } from "@/src/data/customersMockData" // Only transactions still use mock data
import { TabConfig, formatCurrency, formatDateTime, getStatusBadge } from "@/src/utils/customersUtils"

export const customersTabConfig: TabConfig = {
    id: "customers",
    label: "Customers", // Dynamic count will be set in component
    data: [], // Data will be populated from API
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
        { key: "actions", header: "Actions", width: "w-16" }
    ],
    actions: [
        <Button key="add" size="sm">
            <UserPlus className="h-4 w-4 mr-2"/>
            Add Customer
        </Button>
    ]
}

export const commissionsTabConfig: TabConfig = {
    id: "commissions",
    label: "Commissions", // Dynamic count will be set in component
    data: [], // Data will be populated from API
    searchFields: ["customerName", "customerEmail", "clientName", "referralCode"],
    searchPlaceholder: "Search by customer, client, or referral code...",
    columns: [
        { key: "customer", header: "Customer" },
        { key: "client", header: "Client" },
        { key: "totalCommission", header: "Commission Amount" },
        { key: "status", header: "Status" },
        { key: "referralCode", header: "Referral Code" },
        { key: "source", header: "Source" },
        { key: "createdAt", header: "Date" },
        { key: "lastPurchase", header: "Last Purchase" },
        { key: "actions", header: "Actions", width: "w-16" }
    ]
}

export const transactionsTabConfig: TabConfig = {
    id: "transactions",
    label: `Transactions (${transactions.length})`,
    data: transactions,
    searchFields: ["affiliateName", "affiliateEmail", "transactionId", "description"],
    searchPlaceholder: "Search by affiliate, transaction ID, or description...",
    columns: [
        { key: "affiliate", header: "Affiliate" },
        { key: "amount", header: "Amount" },
        { key: "paymentMethod", header: "Payment Method" },
        { key: "status", header: "Status" },
        { key: "transactionId", header: "Transaction ID" },
        { key: "processedAt", header: "Processed At" },
        { key: "createdAt", header: "Created At" },
        { key: "actions", header: "Actions", width: "w-16" }
    ]
}

export const renderCellContent = (item: any, columnKey: string) => {
    switch (columnKey) {
        case "customer":
            return (
                <div>
                    <div className="font-medium">{item.customerName}</div>
                    <div className="text-sm text-muted-foreground">{item.customerEmail}</div>
                </div>
            )

        case "client":
        case "partner":
            const nameKey = columnKey === "client" ? "clientName" : "partnerName"
            const emailKey = columnKey === "client" ? "clientEmail" : "partnerEmail"
            return (
                <div>
                    <div className="font-medium">{item[nameKey] || "N/A"}</div>
                    <div className="text-sm text-muted-foreground">{item[emailKey] || ""}</div>
                </div>
            )

        case "affiliate":
            return (
                <div>
                    <div className="font-medium">{item.affiliateName}</div>
                    <div className="text-sm text-muted-foreground">{item.affiliateEmail}</div>
                </div>
            )

        case "totalPaid":
        case "totalCommission":
        case "amount":
            return (
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-600"/>
                    <span className="font-medium">{formatCurrency(item[columnKey])}</span>
                </div>
            )

        case "percentage":
            return <span className="font-medium">{item[columnKey]}%</span>

        case "type":
            return (
                <Badge variant="outline" className="font-medium">
                    {item[columnKey]}
                </Badge>
            )

        case "status":
            return (
                <Badge className={getStatusBadge(item[columnKey])}>
                    {item[columnKey]}
                </Badge>
            )

        case "paymentMethod":
            return (
                <div className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3 text-muted-foreground"/>
                    <span className="font-medium">{item[columnKey]}</span>
                </div>
            )

        case "earnedAt":
        case "paidAt":
        case "processedAt":
        case "createdAt":
            return (
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground"/>
                    <span className="text-sm">{formatDateTime(item[columnKey])}</span>
                </div>
            )

        case "lastPurchase":
        case "lastPurchaseDate":
            const purchaseDate = item.lastPurchaseDate || item.lastPurchase
            return purchaseDate ? formatDateTime(purchaseDate) : "Never"

        case "purchaseCount":
            return (
                <Badge variant="secondary" className="font-medium">
                    {item[columnKey] || 0}
                </Badge>
            )

        case "source":
            return item[columnKey] ? (
                <Badge variant="outline" className="text-xs">
                    {item[columnKey]}
                </Badge>
            ) : "N/A"

        case "referralId":
        case "transactionId":
            return (
                <Badge variant="secondary" className="font-mono text-xs">
                    {item[columnKey]}
                </Badge>
            )

        case "referralCode":
            return item[columnKey] ? (
                <Badge variant="outline" className="font-mono text-xs">
                    {item[columnKey]}
                </Badge>
            ) : "N/A"

        case "actions":
            return (
                <Button variant="ghost" size="sm">
                    {columnKey === "actions" && item.status ? <Eye className="h-4 w-4"/> : <MoreHorizontal className="h-4 w-4"/>}
                </Button>
            )

        default:
            return item[columnKey] || "N/A"
    }
}
