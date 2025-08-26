"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface EarningsData {
    month: string
    desktop: number
    mobile: number
}

interface EarningChartProps {
    affiliateId?: number
    startDate?: string
    endDate?: string
    title?: string
    description?: string
    period?: 'daily' | 'weekly' | 'monthly'
}

type DatePeriod = 'this-month' | 'last-month' | 'this-year'

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "oklch(0.769 0.188 70.08)",
    },
    mobile: {
        label: "Mobile",
        color: "oklch(0.627 0.265 303.9)",
    },
} satisfies ChartConfig

function getDateRangeForPeriod(period: DatePeriod): { startDate: string; endDate: string; chartPeriod: 'daily' | 'weekly' | 'monthly' } {
    const now = new Date()

    switch (period) {
        case 'this-month':
            return {
                startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
                endDate: now.toISOString(),
                chartPeriod: 'daily'
            }

        case 'last-month':
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
            return {
                startDate: lastMonthStart.toISOString(),
                endDate: lastMonthEnd.toISOString(),
                chartPeriod: 'daily'
            }

        case 'this-year':
            return {
                startDate: new Date(now.getFullYear(), 0, 1).toISOString(),
                endDate: now.toISOString(),
                chartPeriod: 'monthly'
            }
    }
}

async function fetchEarningsData(
    affiliateId?: number,
    startDate?: string,
    endDate?: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
): Promise<EarningsData[]> {
    try {
        const params = new URLSearchParams()

        if (affiliateId) params.append('affiliateId', affiliateId.toString())
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        params.append('period', period)
        params.append('size', period === 'monthly' ? '12' : '31')
        params.append('page', '0')

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/earnings/trends?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
                },
            }
        )

        if (!response.ok) {
            console.error('HTTP error!', response.json())
        }

        const data = await response.json()
        return transformDataForChart(data.content || data, period)
    } catch (error) {
        console.error('Error fetching earnings data:', error)
        return getFallbackData(period)
    }
}

function transformDataForChart(apiData: any, period: 'daily' | 'weekly' | 'monthly'): EarningsData[] {
    if (!apiData || (!Array.isArray(apiData) && !apiData.content)) {
        return getFallbackData(period)
    }

    const dataArray = Array.isArray(apiData) ? apiData : apiData.content || []

    return dataArray.map((item: any, index: number) => {
        let monthLabel = item.period

        if (!monthLabel) {
            if (period === 'daily') {
                monthLabel = `Day ${index + 1}`
            } else if (period === 'monthly') {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                monthLabel = monthNames[index] || `Month ${index + 1}`
            } else {
                monthLabel = `Week ${index + 1}`
            }
        }

        return {
            month: monthLabel,
            desktop: Number(item.desktop || 0),
            mobile: Number(item.mobile || 0),
        }
    })
}

function getFallbackData(period: 'daily' | 'weekly' | 'monthly'): EarningsData[] {
    if (period === 'monthly') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return monthNames.map((month) => ({
            month,
            desktop: Math.floor(Math.random() * 5000) + 1000,
            mobile: Math.floor(Math.random() * 3000) + 800,
        }))
    } else {
        const dataLength = period === 'daily' ? 30 : 4
        const data = []
        for (let i = 1; i <= dataLength; i++) {
            data.push({
                month: period === 'daily' ? `Day ${i}` : `Week ${i}`,
                desktop: Math.floor(Math.random() * 500) + 100,
                mobile: Math.floor(Math.random() * 300) + 50,
            })
        }
        return data
    }
}

export function EarningChart({
                                 affiliateId,
                                 startDate: propStartDate,
                                 endDate: propEndDate,
                                 title = "Earning Statistic",
                                 description,
                                 period: propPeriod = 'daily'
                             }: EarningChartProps) {
    const [chartData, setChartData] = useState<EarningsData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState<DatePeriod>('this-month')

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError(null)

            try {
                let startDate = propStartDate
                let endDate = propEndDate
                let chartPeriod = propPeriod

                if (!propStartDate || !propEndDate) {
                    const dateRange = getDateRangeForPeriod(selectedPeriod)
                    startDate = dateRange.startDate
                    endDate = dateRange.endDate
                    chartPeriod = dateRange.chartPeriod
                }

                const data = await fetchEarningsData(affiliateId, startDate, endDate, chartPeriod)
                setChartData(data)
            } catch (err) {
                setError('Failed to load earnings data')
                const dateRange = getDateRangeForPeriod(selectedPeriod)
                setChartData(getFallbackData(dateRange.chartPeriod))
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [affiliateId, propStartDate, propEndDate, propPeriod, selectedPeriod])

    const totalEarnings = chartData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)
    const growthRate = chartData.length > 1
        ? (((chartData[chartData.length - 1].desktop + chartData[chartData.length - 1].mobile) -
            (chartData[0].desktop + chartData[0].mobile)) /
        (chartData[0].desktop + chartData[0].mobile)) * 100
        : 0

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case 'this-month': return 'this month'
            case 'last-month': return 'last month'
            case 'this-year': return 'this year'
        }
    }

    const formatXAxisTick = (value: string) => {
        if (selectedPeriod === 'this-year') {
            return value
        }

        const dayNumber = parseInt(value.replace('Day ', '')) || 0
        return dayNumber % 5 === 0 ? value : ''
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-muted-foreground">Counting your earnings...</div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground">Affiliate Earning Statistic</CardTitle>
                <Select value={selectedPeriod} onValueChange={(value: DatePeriod) => setSelectedPeriod(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="this-month">This Month</SelectItem>
                        <SelectItem value="last-month">Last Month</SelectItem>
                        <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={formatXAxisTick}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent
                                indicator="dot"
                                formatter={(value, name) => [
                                    `$${Number(value).toLocaleString()}`,
                                    name
                                ]}
                            />}
                        />
                        <Area
                            dataKey="mobile"
                            type="natural"
                            fill="var(--color-mobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="desktop"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="b"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            {growthRate >= 0 ? (
                                <>
                                    Trending up by {Math.abs(growthRate).toFixed(1)}% this period
                                    <TrendingUp className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    Trending down by {Math.abs(growthRate).toFixed(1)}% this period
                                    <TrendingUp className="h-4 w-4 rotate-180" />
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Total {getPeriodLabel()}: ${totalEarnings.toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}