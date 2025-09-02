
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ROICalculator } from "@/components/roi-calculator"
import {
  Play,
  Star,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  Zap,
  X,
  Check,
  BarChart3,
  Store,
  CreditCard,
  Plug,
  Crown,
  Phone,
  Shield,
  Quote,
  Award,
  Lock,
  Globe,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react"

export default function LandingPage() {

  const router = useRouter()

  const handleSignIn = () => {
    router.push("/register")
  }

  const handleStartFreeTrial = () => {
    router.push("/dashboard")
  }
  return (
      <div className="min-h-screen bg-background">
        {/* Header/Navigation */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">AP</span>
                  </div>
                </div>
                <span className="ml-2 text-xl font-bold text-foreground">AffiliateFlow</span>
              </div>

              <nav className="hidden md:flex space-x-8">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
                <a href="#customers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Customers
                </a>
                <a href="#resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </a>
                <a href="#login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </a>
              </nav>

              <div className="flex items-center space-x-3">
                <Button
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handleStartFreeTrial}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background py-20 sm:py-32">
          <div className="absolute inset-0 w-full h-full z-0">
            <iframe
                src="https://my.spline.design/celestialflowabstractdigitalform-yRce0qFP4C3ut7GiPUI2sWTB/"
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full object-cover"
                style={{ transform: "translateY(-20%)" }}
            />
          </div>

          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-1"></div>

          <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30 z-2"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 bg-muted text-muted-foreground border-border">
                <Star className="w-4 h-4 mr-1 text-accent" />
                Trusted by 500+ SaaS companies
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Enterprise Affiliate Management for <span className="text-primary">Growing SaaS Companies</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Get PartnerStack-level features at Tolt-level pricing. Launch your affiliate program in 15 minutes, not 15
                days.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Free 14-Day Trial
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg border-border hover:bg-muted bg-transparent"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch 2-Min Demo
                </Button>
              </div>

              {/* Trust badge */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Trusted by 500+ SaaS companies to manage $50M+ in affiliate revenue
                </p>

                {/* Dashboard preview placeholder */}
                <div className="relative max-w-4xl mx-auto">
                  <div className="rounded-lg border border-border bg-card shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-1">
                      <img
                          src="affiliate-dashboard.png"
                          alt="AffiliateFlow Dashboard Preview"
                          className="w-full h-auto rounded-md"
                      />
                    </div>
                  </div>

                  {/* Floating stats cards */}
                  <Card className="absolute -left-4 top-1/4 w-48 bg-card/95 backdrop-blur border-border shadow-lg hidden lg:block">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Active Affiliates</p>
                          <p className="text-2xl font-bold text-primary">2,847</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="absolute -right-4 top-1/3 w-48 bg-card/95 backdrop-blur border-border shadow-lg hidden lg:block">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Monthly Revenue</p>
                          <p className="text-2xl font-bold text-accent">$847K</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Bar */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-sm text-muted-foreground mb-6">Trusted by leading SaaS companies</p>

              {/* Customer logos */}
              <div className="flex flex-wrap justify-center items-center gap-8 mb-8 opacity-60">
                <div className="text-lg font-semibold text-foreground">TechFlow</div>
                <div className="text-lg font-semibold text-foreground">DataVault</div>
                <div className="text-lg font-semibold text-foreground">CloudSync</div>
                <div className="text-lg font-semibold text-foreground">SaaSify</div>
                <div className="text-lg font-semibold text-foreground">GrowthLab</div>
              </div>

              {/* Metrics */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-center">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">500+ Companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">$50M+ Revenue Processed</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">10K+ Affiliates Managed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Affiliate platforms are either too expensive or too limited
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Finally, enterprise features without enterprise complexity
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Too Expensive */}
              <Card className="relative border-destructive/20 bg-destructive/5">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                    <X className="w-6 h-6 text-destructive" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Too Expensive</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-medium text-destructive">PartnerStack: $5,000+/month</p>
                    <p>Enterprise complexity</p>
                    <p>2-4 week setup</p>
                    <p>Transaction fees</p>
                    <p>Requires dedicated team</p>
                  </div>
                </CardContent>
              </Card>

              {/* Too Limited */}
              <Card className="relative border-muted-foreground/20 bg-muted/30">
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Too Limited</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-medium">Tolt/Rewardful: $50-99/month</p>
                    <p>Basic analytics only</p>
                    <p>No affiliate marketplace</p>
                    <p>Manual processes</p>
                    <p>Limited integrations</p>
                  </div>
                </CardContent>
              </Card>

              {/* Just Right */}
              <Card className="relative border-primary/20 bg-primary/5 ring-2 ring-primary/20">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Best Choice</Badge>
                </div>
                <CardContent className="p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Just Right</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-medium text-primary">Our Platform: $49/month</p>
                    <p>Enterprise features</p>
                    <p>15-minute setup</p>
                    <p>No transaction fees</p>
                    <p>Built-in marketplace</p>
                  </div>
                  <Button className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Value proposition highlight */}
            <div className="text-center mt-12">
              <Card className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-lg font-semibold text-foreground">
                    Save <span className="text-primary">$50,000+ annually</span> vs enterprise solutions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything you need to launch and scale your affiliate program
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Enterprise-grade features designed specifically for growing SaaS companies
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {/* Advanced Analytics Dashboard */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <BarChart3 className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Advanced Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    Enterprise reporting without enterprise pricing. Track performance, conversions, and revenue with
                    detailed insights.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Real-time performance metrics
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Custom attribution windows
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Revenue forecasting
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Built-in Affiliate Marketplace */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Store className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Built-in Affiliate Marketplace</h3>
                  <p className="text-muted-foreground mb-4">
                    Recruit high-performing affiliates automatically. Connect with vetted partners who match your target
                    audience.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Vetted affiliate network
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Auto-matching algorithm
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Performance-based recommendations
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Automatic Payouts */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Automatic Payouts</h3>
                  <p className="text-muted-foreground mb-4">
                    Hands-off payment processing saves 20+ hours monthly. Set it once and let the system handle
                    everything.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Scheduled automatic payments
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Multi-currency support
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Tax document generation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* SaaS-Native Integrations */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Plug className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">SaaS-Native Integrations</h3>
                  <p className="text-muted-foreground mb-4">
                    Deep Stripe, Paddle, Chargebee integration. Works seamlessly with your existing SaaS stack.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      One-click payment processor sync
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      CRM and marketing tool APIs
                    </li>
                    <li className="flex items-center">
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Webhook support
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
                Limited Time Launch Pricing
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Simple, transparent pricing that scales with you
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                No transaction fees. No revenue sharing. No surprises.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Save 20% with annual billing</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Starter Plan */}
              <Card className="relative border-border bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Starter</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-foreground">$0</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Perfect for testing the waters</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Up to $5K monthly affiliate revenue</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">10 affiliates maximum</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Basic analytics dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Standard email support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">15-minute setup</span>
                    </li>
                  </ul>

                  <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
                    Start Free Forever
                  </Button>
                </CardContent>
              </Card>

              {/* Professional Plan - Most Popular */}
              <Card className="relative border-primary/50 bg-gradient-to-b from-primary/5 to-background shadow-xl scale-105">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Crown className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Professional</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-primary">$49</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground line-through">was $89</span>
                      <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                        Limited Time
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">For growing SaaS companies</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Unlimited affiliates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Advanced analytics & reporting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Built-in affiliate marketplace access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">White-label affiliate portal</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Automated payouts</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Priority support</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                        Save $600/year vs Rewardful
                      </Badge>
                    </li>
                  </ul>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Zap className="w-4 h-4 mr-2" />
                    Start 14-Day Free Trial
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative border-border bg-card hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Enterprise</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-foreground">$149</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span className="text-sm text-muted-foreground line-through">was $249</span>
                      <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                        Limited Time
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">For scaling enterprises</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Everything in Professional</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Full API access</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Custom integrations</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Multi-team collaboration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Dedicated success manager</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">Custom onboarding</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                        Save $50,000+/year vs PartnerStack
                      </Badge>
                    </li>
                  </ul>

                  <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Book Demo Call
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Additional pricing info */}
            <div className="text-center mt-16">
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">30-Day Guarantee</p>
                    <p className="text-sm text-muted-foreground">Full money-back guarantee</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Annual Savings</p>
                    <p className="text-sm text-muted-foreground">Save 20% with yearly billing</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-6 h-6 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-foreground">Quick Setup</p>
                    <p className="text-sm text-muted-foreground">Launch in 15 minutes</p>
                  </div>
                </div>
              </div>

              <Card className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-lg font-semibold text-foreground mb-2">Questions about pricing?</p>
                  <p className="text-muted-foreground mb-4">
                    Our team is here to help you choose the right plan for your business.
                  </p>
                  <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Talk to Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Competitive Comparison Table */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                See how we stack up against the competition
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get enterprise features without the enterprise price tag
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <Card className="overflow-hidden border-border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                      <th className="text-center p-4 font-semibold text-primary bg-primary/5">Our Platform</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Tolt</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">Rewardful</th>
                      <th className="text-center p-4 font-semibold text-muted-foreground">PartnerStack</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">Pricing</td>
                      <td className="p-4 text-center bg-primary/5">
                        <span className="font-bold text-primary">$49/month</span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">$50/month</td>
                      <td className="p-4 text-center text-muted-foreground">$99/month</td>
                      <td className="p-4 text-center text-muted-foreground">$5,000+/month</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">Setup Time</td>
                      <td className="p-4 text-center bg-primary/5">
                        <span className="font-bold text-primary">15 minutes</span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">15 minutes</td>
                      <td className="p-4 text-center text-muted-foreground">30 minutes</td>
                      <td className="p-4 text-center text-muted-foreground">2-4 weeks</td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">Advanced Analytics</td>
                      <td className="p-4 text-center bg-primary/5">
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">Affiliate Marketplace</td>
                      <td className="p-4 text-center bg-primary/5">
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">API Access</td>
                      <td className="p-4 text-center bg-primary/5">
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20">
                      <td className="p-4 font-medium text-foreground">No Transaction Fees</td>
                      <td className="p-4 text-center bg-primary/5">
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <Check className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                      <td className="p-4 text-center">
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Savings highlight */}
              <div className="text-center mt-12">
                <Card className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Save <span className="text-primary">$50,000+ annually</span> vs enterprise solutions
                    </h3>
                    <p className="text-muted-foreground">Get all the features you need without breaking the bank</p>
                    <Button className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Start Saving Today
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Calculate your affiliate program ROI
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how much revenue you could generate and money you could save with our platform
              </p>
            </div>

            <ROICalculator />
          </div>
        </section>

        {/* Customer Success Stories */}
        <section id="customers" className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Join SaaS companies growing with affiliate marketing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See how our customers are scaling their businesses and saving money
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* DevTools SaaS Testimonial */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Quote className="w-8 h-8 text-primary/30 mr-3" />
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "Saved $95,400 annually and grew affiliate revenue 400% in 6 months. The built-in marketplace
                    connected us with high-quality affiliates we never would have found otherwise."
                  </blockquote>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-sm">DT</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sarah Chen</p>
                      <p className="text-sm text-muted-foreground">Head of Growth, DevTools SaaS</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Revenue Growth</span>
                      <span className="font-bold text-primary">+400%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Annual Savings</span>
                      <span className="font-bold text-accent">$95,400</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marketing SaaS Testimonial */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Quote className="w-8 h-8 text-primary/30 mr-3" />
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "Doubled conversions while saving $600/year vs Rewardful. The advanced analytics helped us optimize
                    our affiliate program like never before."
                  </blockquote>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4">
                      <span className="text-accent font-bold text-sm">MS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Marcus Rodriguez</p>
                      <p className="text-sm text-muted-foreground">CMO, Marketing SaaS</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-bold text-primary">+200%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Cost Savings</span>
                      <span className="font-bold text-accent">$600/year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* B2B SaaS Testimonial */}
              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Quote className="w-8 h-8 text-primary/30 mr-3" />
                    <div className="flex text-primary">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-foreground mb-6 leading-relaxed">
                    "Scaled from 10 to 500 affiliates, $2M+ in tracked revenue. The automated payouts alone save us 20+
                    hours monthly."
                  </blockquote>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-sm">BS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Emily Watson</p>
                      <p className="text-sm text-muted-foreground">VP Revenue, B2B SaaS</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Affiliate Growth</span>
                      <span className="font-bold text-primary">10 → 500</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Revenue Tracked</span>
                      <span className="font-bold text-accent">$2M+</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Overall stats */}
            <div className="text-center mt-16">
              <Card className="inline-block bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                      <p className="text-3xl font-bold text-primary mb-2">500+</p>
                      <p className="text-sm text-muted-foreground">Happy Customers</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-accent mb-2">$50M+</p>
                      <p className="text-sm text-muted-foreground">Revenue Processed</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary mb-2">4.9/5</p>
                      <p className="text-sm text-muted-foreground">Customer Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trust & Security Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Enterprise-grade security you can trust
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Your data and your customers' data are protected by industry-leading security standards
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
              {/* Security Compliance */}
              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">SOC 2 Compliant</h3>
                  <p className="text-sm text-muted-foreground">Independently audited security controls</p>
                </CardContent>
              </Card>

              {/* GDPR Compliance */}
              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">GDPR Ready</h3>
                  <p className="text-sm text-muted-foreground">Full compliance with EU data protection</p>
                </CardContent>
              </Card>

              {/* ISO Certification */}
              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">ISO 27001</h3>
                  <p className="text-sm text-muted-foreground">International security management standard</p>
                </CardContent>
              </Card>

              {/* Data Encryption */}
              <Card className="bg-card border-border text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">256-bit SSL</h3>
                  <p className="text-sm text-muted-foreground">Bank-grade encryption for all data</p>
                </CardContent>
              </Card>
            </div>

            {/* Trust guarantees */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">99.99% Uptime</h3>
                <p className="text-sm text-muted-foreground">Guaranteed uptime with automatic failover and redundancy</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">Enterprise Security</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-layer security with continuous monitoring and threat detection
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plug className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">API-First Architecture</h3>
                <p className="text-sm text-muted-foreground">Built for scale with modern, secure API infrastructure</p>
              </div>
            </div>

            {/* Security badges */}
            <div className="text-center mt-16">
              <p className="text-sm text-muted-foreground mb-6">Trusted by enterprise customers worldwide</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">ISO 27001</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-50"></div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Zap className="w-4 h-4 mr-1" />
                Ready to get started?
              </Badge>

              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                Ready to launch your affiliate program in <span className="text-primary">15 minutes?</span>
              </h2>

              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                Join 500+ SaaS companies growing with affiliate marketing. Start your free trial today and see the
                difference enterprise features make.
              </p>

              {/* Multiple CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Free 14-Day Trial
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Book Demo Call
                </Button>
                <Button
                    variant="ghost"
                    size="lg"
                    className="px-8 py-4 text-lg text-muted-foreground hover:text-foreground"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  See Pricing
                </Button>
              </div>

              {/* Final trust elements */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Setup in 15 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted/50 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main footer content */}
            <div className="py-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Company info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center mr-3">
                      <span className="text-primary-foreground font-bold">AP</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">AffiliateFlow</span>
                  </div>
                  <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
                    Enterprise affiliate management for growing SaaS companies. Get PartnerStack-level features at
                    Tolt-level pricing.
                  </p>

                  {/* Contact info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>hello@affiliateflow.com</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>San Francisco, CA</span>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="flex items-center gap-4">
                    <a
                        href="#"
                        className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    </a>
                    <a
                        href="#"
                        className="w-10 h-10 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                    >
                      <Github className="w-5 h-5 text-muted-foreground hover:text-primary" />
                    </a>
                  </div>
                </div>

                {/* Product links */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Product</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                          href="#features"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Features
                      </a>
                    </li>
                    <li>
                      <a
                          href="#pricing"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Pricing
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        API Docs
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Integrations
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Changelog
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company links */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Company</h3>
                  <ul className="space-y-3">
                    <li>
                      <a
                          href="#customers"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Customers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Press Kit
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Support links */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Support</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Status Page
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        Security
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        System Status
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer bottom */}
            <div className="py-8 border-t border-border">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>© 2024 AffiliateFlow. All rights reserved.</span>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
  )
}
