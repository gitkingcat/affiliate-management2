import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Calendar, Download, Filter, TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import {Input} from "@/components/ui/input";

interface AffiliateGroup {
    id: string;
    name: string;
    color: string;
    revenue: number[];
    clicks: number[];
    conversions: number[];
    partners: number;
    conversionRate: number;
    totalRevenue: number;
}

interface ReportMetrics {
    totalRevenue: number;
    totalClicks: number;
    totalConversions: number;
    averageConversionRate: number;
    activePartners: number;
    growth: number;
}

const Reports = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [selectedMetric, setSelectedMetric] = useState('revenue');
    const [selectedGroup, setSelectedGroup] = useState('all');

    // Generate realistic data for the past 30 days
    const generateData = (baseValue: number, variance: number = 0.3) => {
        return Array.from({ length: 30 }, (_, i) => {
            const trend = Math.sin((i / 30) * Math.PI * 2) * 0.2;
            const random = (Math.random() - 0.5) * variance;
            return Math.max(0, Math.round(baseValue * (1 + trend + random)));
        });
    };

    const affiliateGroups: AffiliateGroup[] = [
        {
            id: 'email-marketing',
            name: 'Email Marketing',
            color: '#ef4444',
            revenue: generateData(12000, 0.4),
            clicks: generateData(1500, 0.5),
            conversions: generateData(45, 0.6),
            partners: 12,
            conversionRate: 3.2,
            totalRevenue: 358400
        },
        {
            id: 'social-media',
            name: 'Social Media',
            color: '#f97316',
            revenue: generateData(8000, 0.3),
            clicks: generateData(2200, 0.4),
            conversions: generateData(38, 0.5),
            partners: 25,
            conversionRate: 1.8,
            totalRevenue: 240000
        },
        {
            id: 'content-marketing',
            name: 'Content Marketing',
            color: '#eab308',
            revenue: generateData(15000, 0.2),
            clicks: generateData(1800, 0.3),
            conversions: generateData(62, 0.4),
            partners: 15,
            conversionRate: 3.8,
            totalRevenue: 450000
        },
        {
            id: 'ppc-advertising',
            name: 'PPC Advertising',
            color: '#22c55e',
            revenue: generateData(18000, 0.3),
            clicks: generateData(3200, 0.4),
            conversions: generateData(85, 0.3),
            partners: 8,
            conversionRate: 2.9,
            totalRevenue: 540000
        },
        {
            id: 'influencer-marketing',
            name: 'Influencer Marketing',
            color: '#3b82f6',
            revenue: generateData(22000, 0.4),
            clicks: generateData(2800, 0.5),
            conversions: generateData(95, 0.4),
            partners: 18,
            conversionRate: 3.7,
            totalRevenue: 660000
        },
        {
            id: 'webinar-partners',
            name: 'Webinar Partners',
            color: '#8b5cf6',
            revenue: generateData(10000, 0.3),
            clicks: generateData(1200, 0.4),
            conversions: generateData(35, 0.5),
            partners: 6,
            conversionRate: 3.1,
            totalRevenue: 300000
        }
    ];

    const dates = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    // Prepare chart data
    const chartData = useMemo(() => {
        return dates.map((date, index) => {
            const dataPoint: any = { date };
            affiliateGroups.forEach(group => {
                if (selectedMetric === 'revenue') {
                    dataPoint[group.name] = group.revenue[index];
                } else if (selectedMetric === 'clicks') {
                    dataPoint[group.name] = group.clicks[index];
                } else if (selectedMetric === 'conversions') {
                    dataPoint[group.name] = group.conversions[index];
                }
            });
            return dataPoint;
        });
    }, [selectedMetric, affiliateGroups, dates]);

    // Calculate summary metrics
    const metrics: ReportMetrics = useMemo(() => {
        const totalRevenue = affiliateGroups.reduce((sum, group) => sum + group.totalRevenue, 0);
        const totalClicks = affiliateGroups.reduce((sum, group) =>
            sum + group.clicks.reduce((a, b) => a + b, 0), 0);
        const totalConversions = affiliateGroups.reduce((sum, group) =>
            sum + group.conversions.reduce((a, b) => a + b, 0), 0);
        const averageConversionRate = affiliateGroups.reduce((sum, group) =>
            sum + group.conversionRate, 0) / affiliateGroups.length;
        const activePartners = affiliateGroups.reduce((sum, group) => sum + group.partners, 0);

        return {
            totalRevenue,
            totalClicks,
            totalConversions,
            averageConversionRate,
            activePartners,
            growth: 12.4
        };
    }, [affiliateGroups]);

    const pieData = affiliateGroups.map(group => ({
        name: group.name,
        value: group.totalRevenue,
        color: group.color
    }));

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Affiliate Reports</h1>
                    <p className="text-gray-600 mt-2">Comprehensive analytics across all affiliate groups and marketing
                        channels</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center gap-2">
                        <Input
                            type="date"
                            placeholder="Commission Start"
                            className="w-40"
                        />
                        <span className="text-muted-foreground">to</span>
                        <Input
                            type="date"
                            placeholder="Commission End"
                            className="w-40"
                        />
                    </div>

                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center space-x-2">
                        <Download className="w-4 h-4"/>
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalRevenue)}</p>
                            <div className="flex items-center mt-1">
                                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1"/>
                                <span className="text-sm text-green-600">{metrics.growth}%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-green-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Clicks</p>
                            <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalClicks)}</p>
                            <div className="flex items-center mt-1">
                                <ArrowUpRight className="w-4 h-4 text-blue-500 mr-1"/>
                                <span className="text-sm text-blue-600">8.2%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Activity className="w-6 h-6 text-blue-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Conversions</p>
                            <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.totalConversions)}</p>
                            <div className="flex items-center mt-1">
                                <ArrowUpRight className="w-4 h-4 text-purple-500 mr-1"/>
                                <span className="text-sm text-purple-600">15.3%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-purple-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Conversion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.averageConversionRate.toFixed(1)}%</p>
                            <div className="flex items-center mt-1">
                                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1"/>
                                <span className="text-sm text-red-600">2.1%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-orange-600"/>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Active Partners</p>
                            <p className="text-2xl font-bold text-gray-900">{formatNumber(metrics.activePartners)}</p>
                            <div className="flex items-center mt-1">
                                <ArrowUpRight className="w-4 h-4 text-indigo-500 mr-1"/>
                                <span className="text-sm text-indigo-600">5.7%</span>
                            </div>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <Users className="w-6 h-6 text-indigo-600"/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Metric:</label>
                        <select
                            value={selectedMetric}
                            onChange={(e) => setSelectedMetric(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="revenue">Revenue</option>
                            <option value="clicks">Clicks</option>
                            <option value="conversions">Conversions</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Groups:</span>
                        {affiliateGroups.map(group => (
                            <div key={group.id} className="flex items-center space-x-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{backgroundColor: group.color}}
                                />
                                <span className="text-sm text-gray-600">{group.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Chart */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {selectedMetric === 'revenue' ? 'Revenue' :
                            selectedMetric === 'clicks' ? 'Clicks' : 'Conversions'} by Group
                    </h2>
                    <p className="text-gray-600">Performance trends over the last 30 days</p>
                </div>

                <div style={{width: '100%', height: '400px'}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) =>
                                    selectedMetric === 'revenue' ? `$${(value / 1000).toFixed(0)}k` :
                                        value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
                                }
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: any) => [
                                    selectedMetric === 'revenue' ? formatCurrency(value) : formatNumber(value),
                                    ''
                                ]}
                            />
                            {affiliateGroups.map(group => (
                                <Bar
                                    key={group.id}
                                    dataKey={group.name}
                                    fill={group.color}
                                    radius={[2, 2, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Distribution</h3>
                        <p className="text-gray-600">Share of total revenue by affiliate group</p>
                    </div>

                    <div style={{width: '100%', height: '300px'}}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color}/>
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 space-y-2">
                        {pieData.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{backgroundColor: entry.color}}
                                    />
                                    <span className="text-gray-700">{entry.name}</span>
                                </div>
                                <span className="font-medium text-gray-900">
                  {((entry.value / metrics.totalRevenue) * 100).toFixed(1)}%
                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Performance</h3>
                        <p className="text-gray-600">Key metrics by affiliate group</p>
                    </div>

                    <div className="space-y-4">
                        {affiliateGroups.map(group => (
                            <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{backgroundColor: group.color}}
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">{group.name}</div>
                                        <div className="text-sm text-gray-500">{group.partners} partners</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div
                                        className="font-medium text-gray-900">{formatCurrency(group.totalRevenue)}</div>
                                    <div className="text-sm text-gray-500">{group.conversionRate}% conversion rate</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;