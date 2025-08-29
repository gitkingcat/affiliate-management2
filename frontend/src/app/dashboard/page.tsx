'use client';

import React, { useEffect, useState } from 'react';
import { MedicalSidebar } from "@/components/medical-sidebar"
import { StatsCard } from "@/components/stats-card"
import { EarningChart } from "@/components/earning-chart"
import { TopAffiliates } from "@/components/top-affiliates"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserCheck, DollarSign, Search, Bell, Mail, TrendingUp, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardStatistics {
    newAffiliatesCount: number;
    totalAffiliatesCount: number;
    activeAffiliatesCount: number;
    pendingAffiliatesCount: number;
    totalClicks: number;
    totalConversions: number;
    totalRevenue: number;
    totalCommissions: number;
    periodDays: number;
    startDate: string;
    endDate: string;
}

export default function Dashboard() {
    const [statistics, setStatistics] = useState<DashboardStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState(30);

    // TODO: Get clientId from auth context or user session
    const clientId = 1;

    useEffect(() => {
        fetchDashboardStatistics();
    }, [selectedPeriod]);

    const fetchDashboardStatistics = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `http://localhost:8080/api/v1/statistics/dashboard/client/${clientId}?days=${selectedPeriod}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch statistics: ${response.statusText}`);
            }

            const data = await response.json();
            setStatistics(data);
        } catch (err) {
            console.error('Error fetching dashboard statistics:', err);
            setError(err instanceof Error ? err.message : 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number | undefined): string => {
        if (num === undefined || num === null) return '0';
        return new Intl.NumberFormat('en-US').format(num);
    };

    const formatCurrency = (amount: number | undefined): string => {
        if (amount === undefined || amount === null) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const calculateConversionRate = (): string => {
        if (!statistics || statistics.totalClicks === 0) return '0%';
        const rate = (statistics.totalConversions / statistics.totalClicks) * 100;
        return `${rate.toFixed(1)}%`;
    };

    return (
        <div className="flex min-h-screen bg-background">
            <MedicalSidebar />

            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-card border-b border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Period:</span>
                                <Select
                                    value={selectedPeriod.toString()}
                                    onValueChange={(value) => setSelectedPeriod(parseInt(value))}
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">Last 7 days</SelectItem>
                                        <SelectItem value="30">Last 30 days</SelectItem>
                                        <SelectItem value="90">Last 90 days</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 space-y-6">
                    {/* Error Message */}
                    {error && (
                        <Card className="border-red-200 bg-red-50">
                            <CardContent className="p-4">
                                <p className="text-red-600">Error: {error}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={fetchDashboardStatistics}
                                    className="mt-2"
                                >
                                    Retry
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title={`New Affiliates in last ${selectedPeriod} days`}
                            value={loading ? "..." : formatNumber(statistics?.newAffiliatesCount)}
                            subtitle=""
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                            iconBg="bg-blue-100"
                        />
                        <StatsCard
                            title="Active Affiliates"
                            value={loading ? "..." : formatNumber(statistics?.activeAffiliatesCount)}
                            subtitle={loading ? "" : `of ${formatNumber(statistics?.totalAffiliatesCount)} total`}
                            icon={<UserCheck className="w-6 h-6 text-purple-600" />}
                            iconBg="bg-purple-100"
                        />
                        <StatsCard
                            title="Total Conversions"
                            value={loading ? "..." : formatNumber(statistics?.totalConversions)}
                            subtitle={loading ? "" : `${calculateConversionRate()} conversion rate`}
                            icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                            iconBg="bg-green-100"
                        />
                        <StatsCard
                            title="Revenue"
                            value={loading ? "..." : formatCurrency(statistics?.totalRevenue)}
                            subtitle={`Last ${selectedPeriod} days`}
                            icon={<DollarSign className="w-6 h-6 text-green-600" />}
                            iconBg="bg-green-100"
                        />
                    </div>

                    {/* Additional Stats Row */}
                    {statistics && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Pending Affiliates"
                                value={formatNumber(statistics.pendingAffiliatesCount)}
                                subtitle="Awaiting approval"
                                icon={<Activity className="w-6 h-6 text-yellow-600" />}
                                iconBg="bg-yellow-100"
                            />
                            <StatsCard
                                title="Total Clicks"
                                value={formatNumber(statistics.totalClicks)}
                                subtitle={`Last ${selectedPeriod} days`}
                                icon={<Activity className="w-6 h-6 text-indigo-600" />}
                                iconBg="bg-indigo-100"
                            />
                            <StatsCard
                                title="Commissions"
                                value={formatCurrency(statistics.totalCommissions)}
                                subtitle="Total earned"
                                icon={<DollarSign className="w-6 h-6 text-pink-600" />}
                                iconBg="bg-pink-100"
                            />
                            <StatsCard
                                title="Avg Order Value"
                                value={statistics.totalConversions > 0
                                    ? formatCurrency(statistics.totalRevenue / statistics.totalConversions)
                                    : "$0"}
                                subtitle="Per conversion"
                                icon={<DollarSign className="w-6 h-6 text-teal-600" />}
                                iconBg="bg-teal-100"
                            />
                        </div>
                    )}

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EarningChart />
                        <TopAffiliates />
                    </div>
                </main>
            </div>
        </div>
    );
}