// Tab configurations for Customers page
// Path: frontend/src/config/customers-tab-configs.tsx

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, CreditCard, Calendar, MoreHorizontal, Eye, UserPlus } from "lucide-react"
import { customers, commissions, transactions } from "@/src/data/customers-mock-data"
import { TabConfig, formatCurrency, formatDateTime, getStatusBadge } from "@/src/utils/customers-utils"

export const customersTabConfig: TabConfig = {
    id: "customers",
    label: `Customers (${customers.length})`,
    data: customers,
    searchFields: ["customerName", "customerEmail", "partnerName", "partnerEmail"],
    searchPlaceholder: "Search by customer name, email or ID...",
    columns: [
        { key: "customer", header: "Customer" },
        { key: "partner", header: "Partner" },
        { key: "totalPaid", header: "Total Paid" },
        { key: "totalCommission", header: "Commission" },
        { key: "status", header: "Status" },
        { key: "lastPurchase", header: "Last Purchase" },
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
    label: `Commissions (${commissions.length})`,
    data: commissions,
    searchFields: ["affiliateName", "affiliateEmail", "description", "referralId"],
    searchPlaceholder: "Search by affiliate, referral ID, or description...",
    columns: [
        { key: "affiliate", header: "Affiliate" },
        { key: "amount", header: "Amount" },
        { key: "percentage", header: "Rate" },
        { key: "type", header: "Type" },
        { key: "status", header: "Status" },
        { key: "earnedAt", header: "Earned At" },
        { key: "paidAt", header: "Paid At" },
        { key: "referralId", header: "Referral" },
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
        case "affiliate":
            const nameKey = columnKey === "customer" ? "customerName" : "affiliateName"
            const emailKey = columnKey === "customer" ? "customerEmail" : "affiliateEmail"
            return (
                <div>
                    <div className="font-medium">{item[nameKey]}</div>
                    <div className="text-sm text-muted-foreground">{item[emailKey]}</div>
                </div>
            )

        case "partner":
            return (
                <div>
                    <div className="font-medium">{item.partnerName}</div>
                    <div className="text-sm text-muted-foreground">{item.partnerEmail}</div>
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

        case "referralId":
        case "transactionId":
            return (
                <Badge variant="secondary" className="font-mono text-xs">
                    {item[columnKey]}
                </Badge>
            )

        case "lastPurchase":
            return item[columnKey] || "N/A"

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

export const tabConfigs = [customersTabConfig, commissionsTabConfig, transactionsTabConfig]