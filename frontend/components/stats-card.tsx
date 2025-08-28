import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    iconBg: string;
    loading?: boolean;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
                                                        title,
                                                        value,
                                                        subtitle,
                                                        icon,
                                                        iconBg,
                                                        loading = false,
                                                        trend,
                                                        className
                                                    }) => {
    return (
        <Card className={cn("hover:shadow-md transition-shadow", className)}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            {title}
                        </p>

                        {loading ? (
                            <Skeleton className="h-7 w-24 mt-1" />
                        ) : (
                            <>
                                <p className="text-xl font-bold text-foreground mt-1">
                                    {value}
                                </p>

                                {trend && (
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className={cn(
                                            "text-sm font-medium",
                                            trend.isPositive ? "text-green-600" : "text-red-600"
                                        )}>
                                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                                        </span>
                                        <span className="text-xs text-muted-foreground">vs last period</span>
                                    </div>
                                )}

                                {subtitle && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {subtitle}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    <div className={cn("p-2.5 rounded-lg", iconBg)}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};