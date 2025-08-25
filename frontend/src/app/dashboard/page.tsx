import { MedicalSidebar } from "@/components/medical-sidebar"
import { StatsCard } from "@/components/stats-card"
import { EarningChart } from "@/components/earning-chart"
import { IncomeChart } from "@/components/income-chart"
import { TreatmentsSection } from "@/components/treatments-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserCheck, Heart, DollarSign, Search, Bell, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
    return (
        <div className="flex min-h-screen bg-background">
            <MedicalSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-card border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input placeholder="Search" className="pl-10 w-64" />
                            </div>
                            <Button variant="ghost" size="sm">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                                <Mail className="w-4 h-4" />
                            </Button>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Dashboard - Medical</span>
                                <Select defaultValue="this-month">
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="this-month">This Month</SelectItem>
                                        <SelectItem value="last-month">Last Month</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="Doctors"
                            value="650"
                            subtitle="4 Doctors joined this week"
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                            iconBg="bg-blue-100"
                        />
                        <StatsCard
                            title="Staffs"
                            value="570"
                            subtitle="8 Staffs on vacation"
                            icon={<UserCheck className="w-6 h-6 text-purple-600" />}
                            iconBg="bg-purple-100"
                        />
                        <StatsCard
                            title="Patients"
                            value="15,750"
                            subtitle="170 New patients admitted"
                            icon={<Heart className="w-6 h-6 text-blue-600" />}
                            iconBg="bg-blue-100"
                        />
                        <StatsCard
                            title="Pharmacies"
                            value="$42,400"
                            subtitle="60,000 Medicine on reserve"
                            icon={<DollarSign className="w-6 h-6 text-green-600" />}
                            iconBg="bg-green-100"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <EarningChart />
                        </div>
                        <div className="space-y-6">
                            <IncomeChart />
                            <TreatmentsSection />
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-card-foreground">
                                    Patient Visited by Department
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Cardiology</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full">
                                                <div className="w-3/4 h-full bg-chart-1 rounded-full"></div>
                                            </div>
                                            <span className="text-sm font-medium">75%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Neurology</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full">
                                                <div className="w-1/2 h-full bg-chart-2 rounded-full"></div>
                                            </div>
                                            <span className="text-sm font-medium">50%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Orthopedic</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-muted rounded-full">
                                                <div className="w-2/3 h-full bg-chart-3 rounded-full"></div>
                                            </div>
                                            <span className="text-sm font-medium">65%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg font-semibold text-card-foreground">Patient Visit By Gender</CardTitle>
                                <Select defaultValue="this-month">
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="this-month">This Month</SelectItem>
                                        <SelectItem value="last-month">Last Month</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
                                            <span className="font-medium text-card-foreground">Male</span>
                                        </div>
                                        <span className="text-lg font-bold text-card-foreground">320</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
                                            <span className="font-medium text-card-foreground">Female</span>
                                        </div>
                                        <span className="text-lg font-bold text-card-foreground">450</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}