import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, Users } from "lucide-react"

interface Affiliate {
    id: number
    name: string
    email: string
    signupDate: string
    status: string
    revenue: number
    earnings: number
    clicks: number
    leads: number
    customers: number
}

interface PartnersTableProps {
    affiliates: Affiliate[]
    onAddPartner: () => void
}

export function PartnersTable({ affiliates, onAddPartner }: PartnersTableProps) {
    const formatCurrency = (amount: number) => {
        return amount === 0 ?
            '$0' :
            new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
            case 'pending':
                return <Badge variant="secondary" className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
            case 'invited':
                return <Badge variant="outline" className="border-blue-500 text-blue-700">Invited</Badge>
            case 'inactive':
                return <Badge variant="secondary">Inactive</Badge>
            case 'suspended':
                return <Badge variant="destructive">Suspended</Badge>
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Clicks</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Customers</TableHead>
                    <TableHead>Signup Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {affiliates.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={10} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                                <Users className="w-8 h-8 text-muted-foreground"/>
                                <p className="text-muted-foreground">No partners found</p>
                                <Button size="sm" onClick={onAddPartner}>
                                    <Plus className="w-4 h-4 mr-2"/>
                                    Add your first partner
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    affiliates.map((affiliate) => (
                        <TableRow key={affiliate.id}>
                            <TableCell className="font-medium">{affiliate.name}</TableCell>
                            <TableCell>{affiliate.email}</TableCell>
                            <TableCell>{getStatusBadge(affiliate.status)}</TableCell>
                            <TableCell>{formatCurrency(affiliate.revenue)}</TableCell>
                            <TableCell>{formatCurrency(affiliate.earnings)}</TableCell>
                            <TableCell>{affiliate.clicks.toLocaleString()}</TableCell>
                            <TableCell>{affiliate.leads.toLocaleString()}</TableCell>
                            <TableCell>{affiliate.customers.toLocaleString()}</TableCell>
                            <TableCell>{formatDate(affiliate.signupDate)}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>View details</DropdownMenuItem>
                                        <DropdownMenuItem>Edit partner</DropdownMenuItem>
                                        <DropdownMenuItem>Send message</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600">
                                            Suspend partner
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )
}