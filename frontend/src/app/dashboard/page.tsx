'use client';

import React, { useEffect, useState } from 'react';
import { MedicalSidebar } from "@/components/medical-sidebar";
import { DashboardHeader } from "@/src/headers/dashboardHeader";
import { StatsCards } from "./statsCards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {EarningChart} from "@/components/chart-area";
import {TopAffiliates} from "@/src/app/dashboard/topAffiliates";

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
            setError(err instanceof Error ?
                err.message : 'An error occurred while fetching statistics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <MedicalSidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={setSelectedPeriod}
                />

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
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

                    <StatsCards
                        statistics={statistics}
                        loading={loading}
                        selectedPeriod={selectedPeriod}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <EarningChart/>
                        <TopAffiliates/>
                    </div>
                </main>
            </div>
        </div>
    );
}