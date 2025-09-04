import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
                                   onSearchChange
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
            </div>
        </header>
    )
}