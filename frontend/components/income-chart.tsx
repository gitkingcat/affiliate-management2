"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

const data = [
    { name: "Net Income", value: 50000, color: "hsl(var(--chart-2))" },
    { name: "Commission", value: 20000, color: "hsl(var(--chart-3))" },
]

export function IncomeChart() {
    const total = data.reduce((sum, item) => sum + item.value, 0)

    const chartData = {
        labels: data.map((item) => item.name),
        datasets: [
            {
                data: data.map((item) => item.value),
                backgroundColor: data.map((item) => item.color),
                borderWidth: 0,
                cutout: "65%",
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => `${context.label}: $${(context.parsed / 1000).toFixed(0)}k`,
                },
            },
        },
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-card-foreground">Total Income</CardTitle>
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
            <CardContent className="flex items-center justify-between">
                <div className="relative w-32 h-32">
                    <Doughnut data={chartData} options={options} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-xs text-muted-foreground">Income</p>
                        <p className="text-lg font-bold text-card-foreground">${(total / 1000).toFixed(1)}k</p>
                    </div>
                </div>
                <div className="space-y-3">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between min-w-32">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-muted-foreground">{item.name}</span>
                            </div>
                            <span className="text-sm font-semibold text-card-foreground">${(item.value / 1000).toFixed(0)}k</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
