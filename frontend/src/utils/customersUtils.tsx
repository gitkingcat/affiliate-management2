// Utility functions and configurations for Customers page
// Path: frontend/src/utils/customers-utils.ts

export interface TableColumn {
    key: string
    header: string
    width?: string
    render?: (item: any) => React.ReactNode
}

export interface TabConfig {
    id: string
    label: string
    data: any[]
    columns: TableColumn[]
    searchFields: string[]
    searchPlaceholder: string
    actions?: React.ReactNode[]
}

export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`

export const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "N/A"
    return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export const getStatusBadge = (status: string) => {
    const statusConfig = {
        "Active": "bg-green-100 text-green-800 border-green-200",
        "Suspended": "bg-red-100 text-red-800 border-red-200",
        "Lead": "bg-blue-100 text-blue-800 border-blue-200",
        "PAID": "bg-green-100 text-green-800 border-green-200",
        "PENDING": "bg-yellow-100 text-yellow-800 border-yellow-200",
        "COMPLETED": "bg-green-100 text-green-800 border-green-200",
        "FAILED": "bg-red-100 text-red-800 border-red-200",
        "PROCESSING": "bg-blue-100 text-blue-800 border-blue-200"
    }
    return statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800 border-gray-200"
}
