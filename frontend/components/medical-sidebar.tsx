"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"
import {
    Brain,
    Users,
    ShoppingCart,
    Bitcoin,
    TrendingUp,
    GraduationCap,
    Gamepad2,
    Stethoscope,
    BarChart3,
    Package,
    CreditCard,
    Calendar,
    HelpCircle,
    Mic,
    FolderKanban,
    Phone,
    Menu,
    X, Home, Handshake, DollarSign, Settings2, MailIcon, Box, Settings,
} from "lucide-react"
import {ZodEmail} from "zod/v4";

const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard", active: true  },
    { icon: Handshake, label: "Partners", href: "/partners" },
    { icon: ShoppingCart, label: "Customers", href: "/customers" },
    { icon: DollarSign, label: "Payouts", href: "/payouts" },
    { icon: Settings2, label: "Program Settings", href: "/program-settings" },
    { icon: MailIcon, label: "Emails", href: "/emails" },
    { icon: Box, label: "Resources", href: "/resources" },
    { icon: Stethoscope, label: "Reports", href: "/reports",},
    { icon: Settings, label: "Settings", href: "/settings" }
]

interface MedicalSidebarProps {
    className?: string
}

export function MedicalSidebar({ className }: MedicalSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div
            className={cn(
                "flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
                isCollapsed ? "w-16" : "w-64",
                className,
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-lg text-sidebar-foreground">Affiliate Software</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-sidebar-foreground hover:bg-sidebar-accent"
                >
                    {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {navigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Button
                                key={item.label}
                                variant={item.active ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 text-sm font-medium",
                                    item.active
                                        ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                    isCollapsed && "justify-center px-2",
                                )}
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {!isCollapsed && <span>{item.label}</span>}
                            </Button>
                        )
                    })}
                </nav>
            </ScrollArea>

            {/* Application Section */}
            {!isCollapsed && (
                <div className="p-4 border-t border-sidebar-border">
                    <p className="text-xs font-medium text-muted-foreground mb-3">Application</p>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                        <div className="w-4 h-4 bg-primary rounded flex-shrink-0" />
                        <span>Email</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
