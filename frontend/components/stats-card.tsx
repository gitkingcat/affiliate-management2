import type React from "react"
import { Card, CardContent } from "./ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    title: string
    value: string
    subtitle: string
    icon: React.ReactNode
    iconBg: string
    className?: string
}

export function StatsCard({ title, value, subtitle, icon, iconBg, className }: StatsCardProps) {
    return (
        <Card className={cn("bg-card border-border", className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBg)}>{icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-card-foreground">{value}</p>
                            <p className="text-sm font-medium text-card-foreground">{title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
