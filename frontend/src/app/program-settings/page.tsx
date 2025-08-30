"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {ExternalLink, MoreHorizontal, Upload} from "lucide-react"

export default function ProgramSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [customFieldsEnabled, setCustomFieldsEnabled] = useState(true)

  const tabs = [
    { id: "general", label: "General settings" },
    { id: "partner-experience", label: "Partner experience" },
    { id: "marketing", label: "Marketing and tracking" },
    { id: "partner-groups", label: "Partner groups" },
    { id: "custom-domains", label: "Custom domains" }
  ]

  const renderGeneralSettings = () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Program details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program-id">Program ID</Label>
                <Input
                    id="program-id"
                    value="598f3ba9-b1b8-4bb8-ba78-4ed3c6375cec"
                    readOnly
                    className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-name">Product name</Label>
                <div className="flex gap-2">
                  <Input id="product-name" value="DunderMifflin" />
                  <Button variant="outline" size="sm">Update product name</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-name">Partner program name</Label>
                <div className="flex gap-2">
                  <Input id="program-name" value="Demo Partner Program" />
                  <Button variant="outline" size="sm">Update program name</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website-url">Website URL</Label>
                <div className="flex gap-2">
                  <Input id="website-url" value="https://tolt.io" />
                  <Button variant="outline" size="sm">Update website URL</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Program currency</Label>
                <div className="flex gap-2">
                  <Input id="currency" value="USD (United States dollar)" />
                  <Button variant="outline" size="sm">Update currency</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-type">Program type</Label>
                <div className="flex gap-2">
                  <Input id="program-type" value="Public" />
                  <Button variant="outline" size="sm">Update program type</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Portal subdomain</Label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <Input id="subdomain" value="demoprogram.tolt.io" className="flex-1" />
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm">Update subdomain</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-of-service">Terms of Service</Label>
                <div className="flex gap-2">
                  <Input id="terms-of-service" value="https://tolt.io/terms-of-service" />
                  <Button variant="outline" size="sm">Update ToS link</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payout details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="min-payout">Minimum payout threshold</Label>
                <div className="flex gap-2">
                  <Input id="min-payout" value="$99.00" />
                  <Button variant="outline" size="sm">Update threshold</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payout-term">Payout term</Label>
                <div className="flex gap-2">
                  <Input id="payout-term" value="NET-15" />
                  <Button variant="outline" size="sm">Update payout term</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payout-methods">Payout methods</Label>
                <div className="flex gap-2">
                  <Input id="payout-methods" value="PayPal, Wise, Wire/SWIFT, Local Bank, Crypto" />
                  <Button variant="outline" size="sm">Manage methods</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="crypto-tokens">Crypto tokens</Label>
                <div className="flex gap-2">
                  <Input id="crypto-tokens" value="BTC, ETH, SOL, ADA, USDT" />
                  <Button variant="outline" size="sm">Manage tokens</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Custom fields</CardTitle>
              <CardDescription>
                Learn more.    * indicates that the field is required
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="custom-fields-toggle">Show custom fields in the partner sign-up flow</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">ON</Badge>
                    <span className="text-sm text-muted-foreground">1 CUSTOM FIELDS</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                      id="custom-fields-toggle"
                      checked={customFieldsEnabled}
                      onCheckedChange={setCustomFieldsEnabled}
                  />
                  <Button variant="outline" size="sm">Add custom field</Button>
                </div>
              </div>

              {customFieldsEnabled && (
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="text-muted-foreground">Single answer *</span>
                      </div>
                    </div>
                    <div className="pl-4">
                      <Input
                          value="Where will you promote Tolt?"
                          className="mb-2"
                      />
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )

  const renderPartnerExperience = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Partner Portal Settings</CardTitle>
            <CardDescription>Configure the partner experience and portal settings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Partner experience settings will be configured here.</p>
          </CardContent>
        </Card>
      </div>
  )

  const renderMarketingAndTracking = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Marketing and Tracking</CardTitle>
            <CardDescription>Set up tracking pixels and marketing integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Marketing and tracking settings will be configured here.</p>
          </CardContent>
        </Card>
      </div>
  )

  const renderPartnerGroups = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Partner Groups</CardTitle>
            <CardDescription>Organize partners into groups with different commission structures</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Partner groups will be managed here.</p>
          </CardContent>
        </Card>
      </div>
  )

  const renderCustomDomains = () => (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Custom Domains</CardTitle>
            <CardDescription>Configure custom domains for your partner portal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Custom domain settings will be configured here.</p>
          </CardContent>
        </Card>
      </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return renderGeneralSettings()
      case "partner-experience":
        return renderPartnerExperience()
      case "marketing":
        return renderMarketingAndTracking()
      case "partner-groups":
        return renderPartnerGroups()
      case "custom-domains":
        return renderCustomDomains()
      default:
        return renderGeneralSettings()
    }
  }

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Program settings</h1>
              </div>
              <div className="space-y-6">
                {/* Tabs Navigation */}
                <div className="flex gap-1 border-b">
                  {tabs.map((tab) => (
                      <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setActiveTab(tab.id)}
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                      >
                        {tab.label}
                      </Button>
                  ))}
                </div>

                {/* Tab Content */}
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}