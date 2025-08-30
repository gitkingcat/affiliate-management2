"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface EmailSetting {
  id: string
  title: string
  description: string
  enabled: boolean
  hasCustomizeOption: boolean
}

const emailSettings: EmailSetting[] = [
  {
    id: "welcome",
    title: "Welcome email",
    description: "Sends a welcome email when a partner signs up.",
    enabled: true,
    hasCustomizeOption: true
  },
  {
    id: "first-referral",
    title: "Partner gets first referral",
    description: "Sends an email when a partner receives their first referral.",
    enabled: true,
    hasCustomizeOption: true
  },
  {
    id: "new-referral",
    title: "Partner gets a new referral",
    description: "Sends an email for every new referral a partner receives.",
    enabled: true,
    hasCustomizeOption: true
  },
  {
    id: "partner-paid",
    title: "Partner gets paid",
    description: "Sends an email when a partner is paid.",
    enabled: true,
    hasCustomizeOption: true
  },
  {
    id: "partner-invitation",
    title: "Partner invitation email",
    description: "Sends an email when a partner is invited to your program.",
    enabled: false,
    hasCustomizeOption: true
  },
  {
    id: "partner-approval",
    title: "Partner approval email",
    description: "Sends an email when a partner is approved for your program.",
    enabled: false,
    hasCustomizeOption: true
  },
  {
    id: "partner-declined",
    title: "Partner declined email",
    description: "Sends an email when a partner is declined from your program.",
    enabled: false,
    hasCustomizeOption: true
  }
]

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState("notification")
  const [emailStates, setEmailStates] = useState<Record<string, boolean>>(
      emailSettings.reduce((acc, setting) => ({ ...acc, [setting.id]: setting.enabled }), {})
  )

  const toggleEmail = (emailId: string) => {
    setEmailStates(prev => ({
      ...prev,
      [emailId]: !prev[emailId]
    }))
  }

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Send one-off email
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Emails</h1>
              </div>
              <div className="space-y-6">
                {/* Tabs Navigation */}
                <div className="flex gap-2 border-b">
                  <Button
                      variant={activeTab === "notification" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("notification")}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Notification emails
                  </Button>
                  <Button
                      variant={activeTab === "one-off" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("one-off")}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground"
                  >
                    One-off emails (Coming soon)
                  </Button>
                </div>

                {/* Content */}
                {activeTab === "notification" && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-lg font-medium mb-6">Notification emails sent to your partners</h2>

                        <div className="space-y-0 border rounded-lg overflow-hidden">
                          {emailSettings.map((setting, index) => (
                              <div
                                  key={setting.id}
                                  className={`p-6 flex items-center justify-between ${
                                      index !== emailSettings.length - 1 ? 'border-b' : ''
                                  }`}
                              >
                                <div className="flex-1">
                                  <h3 className="font-medium mb-1">{setting.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {setting.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-3 ml-6">
                                  <Switch
                                      checked={emailStates[setting.id]}
                                      onCheckedChange={() => toggleEmail(setting.id)}
                                      className="data-[state=checked]:bg-black"
                                  />

                                  {setting.hasCustomizeOption && (
                                      <Button
                                          variant="ghost"
                                          size="sm"
                                          className={`text-sm ${
                                              !emailStates[setting.id]
                                                  ? 'text-muted-foreground pointer-events-none'
                                                  : 'text-blue-600 hover:text-blue-700'
                                          }`}
                                          disabled={!emailStates[setting.id]}
                                      >
                                        Customize email
                                      </Button>
                                  )}
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>
                )}

                {activeTab === "one-off" && (
                    <div className="space-y-6">
                      <Card>
                        <CardContent className="py-12 text-center">
                          <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                            <p className="text-muted-foreground mb-4">
                              One-off email functionality will be available soon. You'll be able to send custom emails
                              to your partners.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}