"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Calculator, TrendingUp } from "lucide-react"

export function ROICalculator() {
  const [mrr, setMrr] = useState(50000)
  const [growthRate, setGrowthRate] = useState([20])
  const [commissionRate, setCommissionRate] = useState([15])

  const [results, setResults] = useState({
    potentialRevenue: 0,
    investment: 588,
    savings: 59412,
    roi: 0,
  })

  useEffect(() => {
    // Calculate potential annual affiliate revenue
    const monthlyAffiliateRevenue = (mrr * growthRate[0]) / 100
    const annualAffiliateRevenue = monthlyAffiliateRevenue * 12

    // Calculate commission costs
    const annualCommissions = (annualAffiliateRevenue * commissionRate[0]) / 100

    // Calculate ROI
    const investment = 588 // $49/month * 12 months
    const partnerStackCost = 60000 // $5000/month * 12 months
    const savings = partnerStackCost - investment
    const roi = investment > 0 ? ((annualAffiliateRevenue - investment) / investment) * 100 : 0

    setResults({
      potentialRevenue: Math.round(annualAffiliateRevenue),
      investment,
      savings,
      roi: Math.round(roi),
    })
  }, [mrr, growthRate, commissionRate])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toLocaleString()}%`
  }

  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Calculator Inputs */}
      <Card className="bg-card border-border">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <Calculator className="w-6 h-6 text-primary mr-3" />
            <h3 className="text-xl font-bold text-foreground">ROI Calculator</h3>
          </div>

          <div className="space-y-8">
            {/* Current MRR Input */}
            <div className="space-y-3">
              <Label htmlFor="mrr" className="text-sm font-medium text-foreground">
                Current Monthly Recurring Revenue (MRR)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="mrr"
                  type="number"
                  value={mrr}
                  onChange={(e) => setMrr(Number(e.target.value))}
                  className="pl-8 bg-background border-border"
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Growth Rate Slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Target Growth Rate through Affiliates: {growthRate[0]}%
              </Label>
              <Slider value={growthRate} onValueChange={setGrowthRate} max={50} min={5} step={1} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Commission Rate Slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-foreground">
                Average Commission Rate: {commissionRate[0]}%
              </Label>
              <Slider
                value={commissionRate}
                onValueChange={setCommissionRate}
                max={30}
                min={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5%</span>
                <span>30%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-8">
          <div className="flex items-center mb-6">
            <TrendingUp className="w-6 h-6 text-primary mr-3" />
            <h3 className="text-xl font-bold text-foreground">Your ROI Projection</h3>
          </div>

          <div className="space-y-6">
            {/* Potential Annual Revenue */}
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Potential Annual Affiliate Revenue</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.potentialRevenue)}</p>
            </div>

            {/* Investment */}
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Your Investment</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(results.investment)}/year</p>
            </div>

            {/* Savings */}
            <div className="bg-background/50 rounded-lg p-4 border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Savings vs PartnerStack</p>
              <p className="text-2xl font-bold text-accent">{formatCurrency(results.savings)}+</p>
            </div>

            {/* ROI */}
            <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Return on Investment</p>
              <p className="text-3xl font-bold text-primary">{formatPercentage(results.roi)}+</p>
            </div>

            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
              Start Your Free Trial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
