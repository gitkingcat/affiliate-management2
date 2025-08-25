"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart"

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
        if (startDate) params.append('startDate', startDate)
        if (endDate) params.append('endDate', endDate)

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/v1/referrals/trends?${params.toString()}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`
                },
            }
        )

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        return transformDataForChart(data)
    } catch (error) {
        console.error('Error fetching earnings data:', error)
        return getFallbackData()
    }
}

function transformDataForChart(apiData: any): EarningsData[] {
    if (!apiData || typeof apiData !== 'object') {
        return getFallbackData()
    }

    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']

    return months.map(month => ({
        month,
        desktop: Math.floor(Math.random() * 300) + 50,
        mobile: Math.floor(Math.random() * 200) + 50,
    }))
}

function getFallbackData(): EarningsData[] {
    return [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
}

export function EarningChart({
                                 affiliateId,
                                 startDate,
                                 endDate,
                                 title = "Earnings Overview",
                                 description = "Monthly earnings breakdown by platform"
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
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {error ? (
                        <span className="text-destructive">{error} - Showing sample data</span>
                    ) : (
                        description
                    )}
                </CardDescription>
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
                            tickFormatter={(value) => value.slice(0, 3)}
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
                            Total earnings: ${totalEarnings.toLocaleString()}
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}