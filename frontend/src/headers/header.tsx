import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, Upload } from "lucide-react"

interface FilterState {
    partnerName: string
    email: string
    status: string
    commissionStart: string
    commissionEnd: string
}

interface PayoutsHeaderProps {
    searchQuery: string
    filters: FilterState
    onSearchChange: (query: string) => void
    onFilterChange: (key: keyof FilterState, value: string) => void
}

export default function Header({
                                  searchQuery,
                                  filters,
                                  onSearchChange,
                                  onFilterChange
                              }: PayoutsHeaderProps) {

    return (
        <header className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search partners or emails..."
                        className="pl-10 w-64"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Select
                    value={filters.status || "all"}
                    onValueChange={(value) => onFilterChange('status', value === "all" ? "" : value)}
                >
                    <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                        type="date"
                        placeholder="Commission Start"
                        value={filters.commissionStart}
                        onChange={(e) => onFilterChange('commissionStart', e.target.value)}
                        className="w-40"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                        type="date"
                        placeholder="Commission End"
                        value={filters.commissionEnd}
                        onChange={(e) => onFilterChange('commissionEnd', e.target.value)}
                        className="w-40"
                    />
                </div>
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
    )
}