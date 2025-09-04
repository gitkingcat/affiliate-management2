'use client';

import React from 'react';
import { StatsCard } from "@/components/stats-card";
import { Users, UserCheck, DollarSign, TrendingUp, Activity } from "lucide-react";

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

interface StatsCardsProps {
    statistics: DashboardStatistics | null;
    loading: boolean;
    selectedPeriod: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
                                                          statistics,
                                                          loading,
                                                          selectedPeriod
                                                      }) => {
    const formatNumber = (num: number | undefined): string => {
        if (num === undefined || num === null) return '0';
        return num.toLocaleString();
    };

    const formatCurrency = (amount: number | undefined): string => {
        if (amount === undefined || amount === null) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateConversionRate = (): string => {
        if (!statistics || statistics.totalClicks === 0) return '0%';
        const rate = (statistics.totalConversions / statistics.totalClicks) * 100;
        return `${rate.toFixed(1)}%`;
    };

    return (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title={`New Affiliates in last ${selectedPeriod} days`}
                    value={loading ? "..." : formatNumber(statistics?.newAffiliatesCount)}
                    subtitle=""
                    icon={<Users className="w-6 h-6 text-blue-600"/>}
                    iconBg="bg-blue-100"
                />
                <StatsCard
                    title="Active Affiliates"
                    value={loading ? "..." : formatNumber(statistics?.activeAffiliatesCount)}
                    subtitle={loading ? "" : `of ${formatNumber(statistics?.totalAffiliatesCount)} total`}
                    icon={<UserCheck className="w-6 h-6 text-purple-600"/>}
                    iconBg="bg-purple-100"
                />
                <StatsCard
                    title="Total Conversions"
                    value={loading ? "..." : formatNumber(statistics?.totalConversions)}
                    subtitle={loading ? "" : `${calculateConversionRate()} conversion rate`}
                    icon={<TrendingUp className="w-6 h-6 text-green-600"/>}
                    iconBg="bg-green-100"
                />
                <StatsCard
                    title="Revenue"
                    value={loading ? "..." : formatCurrency(statistics?.totalRevenue)}
                    subtitle={loading ? "" :
                        statistics?.totalConversions ?
                            formatCurrency(statistics.totalRevenue / statistics.totalConversions)
                            : "$0"}
                    icon={<DollarSign className="w-6 h-6 text-green-600"/>}
                    iconBg="bg-green-100"
                />
            </div>

            {/* Additional Stats Row */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Clicks"
                        value={formatNumber(statistics.totalClicks)}
                        subtitle="Affiliate traffic"
                        icon={<Activity className="w-6 h-6 text-orange-600"/>}
                        iconBg="bg-orange-100"
                    />
                    <StatsCard
                        title="Total Commissions"
                        value={formatCurrency(statistics.totalCommissions)}
                        subtitle="Earned by affiliates"
                        icon={<DollarSign className="w-6 h-6 text-teal-600"/>}
                        iconBg="bg-teal-100"
                    />
                    <StatsCard
                        title="Pending Affiliates"
                        value={formatNumber(statistics.pendingAffiliatesCount)}
                        subtitle="Awaiting approval"
                        icon={<Users className="w-6 h-6 text-yellow-600"/>}
                        iconBg="bg-yellow-100"
                    />
                    <StatsCard
                        title="Avg Revenue per Conversion"
                        value={statistics.totalConversions ?
                            formatCurrency(statistics.totalRevenue / statistics.totalConversions)
                            : "$0"}
                        subtitle="Per conversion"
                        icon={<DollarSign className="w-6 h-6 text-teal-600"/>}
                        iconBg="bg-teal-100"
                    />
                </div>
            )}
        </>
    );
};