import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DollarSign, Users, Target, Medal, Award, Trophy } from "lucide-react"
import { useEffect, useState } from "react"

interface TopAffiliate {
    id: number;
    name: string;
    email: string;
    status: string;
    totalRevenue: number;
    totalCommissions: number;
    totalReferrals: number;
    totalConversions: number;
    conversionRate: number;
    joinDate: string;
}

interface TopAffiliatesProps {
    clientId?: number;
    limit?: number;
}

export function TopAffiliates({ clientId = 1, limit = 10 }: TopAffiliatesProps) {
    const [affiliates, setAffiliates] = useState<TopAffiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTopAffiliates();
    }, [clientId, limit]);

    const fetchTopAffiliates = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `http://localhost:8080/api/v1/statistics/affiliates/top/${clientId}?limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to fetch top affiliates: ${response.statusText}`);
            }

            const data = await response.json();
            setAffiliates(data);
        } catch (err) {
            console.error('Error fetching top affiliates:', err);
            setError(err instanceof Error ? err.message : 'Failed to load top affiliates');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-600';
            case 'pending':
                return 'bg-yellow-100 text-yellow-600';
            case 'inactive':
                return 'bg-gray-100 text-gray-600';
            case 'rejected':
                return 'bg-red-100 text-red-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getMedalIcon = (position: number) => {
        switch (position) {
            case 0: // 1st place
                return <Trophy className="w-4 h-4 text-yellow-500" />;
            case 1: // 2nd place
                return <Award className="w-4 h-4 text-gray-400" />;
            case 2: // 3rd place
                return <Medal className="w-4 h-4 text-amber-600" />;
            default:
                return null;
        }
    };'use client';

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                        Top-{limit} Affiliates by Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div>
                                    <div className="h-3 w-20 bg-gray-200 rounded mb-1"></div>
                                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                        Top-{limit} Affiliates by Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button
                            onClick={fetchTopAffiliates}
                            variant="outline"
                            size="sm"
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground">
                    Top-{limit} Affiliates by Revenue
                </CardTitle>
                <Button variant="link" className="text-primary hover:text-primary/80 p-0">
                    View All →
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {affiliates.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No affiliates found</p>
                    </div>
                ) : (
                    affiliates.map((affiliate, index) => (
                        <div key={affiliate.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground w-4">
                                        #{index + 1}
                                    </span>
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                                            {getInitials(affiliate.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-card-foreground truncate text-sm">
                                            {affiliate.name}
                                        </p>
                                        {getMedalIcon(index)}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>{affiliate.totalReferrals}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            <span>{affiliate.conversionRate.toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center gap-1 text-sm font-semibold text-card-foreground">
                                    <DollarSign className="w-3 h-3 text-primary" />
                                    <span>{formatCurrency(affiliate.totalRevenue)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}