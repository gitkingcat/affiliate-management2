import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bell, Mail } from "lucide-react"

interface DashboardHeaderProps {
    selectedPeriod: number
    onPeriodChange: (period: number) => void
}

export function DashboardHeader({
                                    selectedPeriod,
                                    onPeriodChange
                                }: DashboardHeaderProps) {
    return (
        <header className="border-b p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search affiliates, customers, payouts..."
                            className="pl-10 w-80"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Select
                        value={selectedPeriod.toString()}
                        onValueChange={(value) => onPeriodChange(parseInt(value))}
                    >
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
                    <Button variant="ghost" size="sm">
                        <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Mail className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </header>
    )
}