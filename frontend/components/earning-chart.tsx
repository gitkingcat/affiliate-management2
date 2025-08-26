"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

interface EarningsData {
    month: string // Will represent day for daily view
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

async function fetchEarningsData(
    affiliateId?: number,
    startDate?: string,
    endDate?: string
): Promise<EarningsData[]> {
    try {
        const params = new URLSearchParams()

        if (affiliateId) params.append('affiliateId', affiliateId.toString())

        // Default to last month if no dates provided
        if (!startDate && !endDate) {
            const now = new Date()
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

            startDate = lastMonth.toISOString()
            endDate = endOfLastMonth.toISOString()
        }

        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)
        params.append('period', 'daily') // Change to daily for last month view
        params.append('size', '31') // Max days in a month
        params.append('page', '0')

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/earnings/trends?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
                },
            }
        )

        if (!response.ok) {
            console.error('HTTP error!')
        }

        const data = await response.json()

        return transformDataForChart(data.content || data)
    } catch (error) {
        console.error('Error fetching earnings data:', error)
        return getFallbackData()
    }
}

function transformDataForChart(apiData: any): EarningsData[] {
    if (!apiData || (!Array.isArray(apiData) && !apiData.content)) {
        return getFallbackData()
    }

    const dataArray = Array.isArray(apiData) ? apiData : apiData.content || []

    return dataArray.map((item: any, index: number) => ({
        month: item.period || `Day ${index + 1}`, // For daily data, show as "Day X"
        desktop: Number(item.desktop || 0),
        mobile: Number(item.mobile || 0),
    }))
}

function getFallbackData(): EarningsData[] {
    // Generate last month's daily data (30 days)
    const lastMonthData = []
    for (let day = 1; day <= 30; day++) {
        lastMonthData.push({
            month: `Day ${day}`,
            desktop: Math.floor(Math.random() * 100) + 20,
            mobile: Math.floor(Math.random() * 80) + 15,
        })
    }
    return lastMonthData
}

export function EarningChart({
                                 affiliateId,
                                 startDate,
                                 endDate,
                                 title = "Last Month Earnings",
                                 description = "Daily earnings breakdown for the last month",
                                 period = 'daily'
                             }: EarningChartProps) {
    const [chartData, setChartData] = useState<EarningsData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await fetchEarningsData(affiliateId, startDate, endDate)
                setChartData(data)
            } catch (err) {
                setError('Failed to load earnings data')
                setChartData(getFallbackData())
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [affiliateId, startDate, endDate])

    const totalEarnings = chartData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)
    const growthRate = chartData.length > 1
        ? (((chartData[chartData.length - 1].desktop + chartData[chartData.length - 1].mobile) -
            (chartData[0].desktop + chartData[0].mobile)) /
        (chartData[0].desktop + chartData[0].mobile)) * 100
        : 0

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px]">
                        <div className="text-muted-foreground">Loading earnings data...</div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground">Earning Statistic</CardTitle>
                <Select defaultValue="this-month">
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
                            dataKey="this-month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                // For daily data, show every 5th day to avoid crowding
                                const dayNumber = parseInt(value.replace('Day ', '')) || 0
                                return dayNumber % 5 === 0 ? value : ''
                            }}
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
                            Total last month: ${totalEarnings.toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}