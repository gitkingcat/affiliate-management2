"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import GeneralSettings from "@/src/app/program-settings/generalSettings";
import PartnerExperience from "@/src/app/program-settings/partnerExperience";
import MarketingAndTracking from "@/src/app/program-settings/marketingAndTracking";
import PartnerGroups from "@/src/app/program-settings/partnerGroups";
import CustomDomains from "@/src/app/program-settings/customDomains";

export default function ProgramSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const tabs = [
    { id: "general", label: "General settings" },
    { id: "partner-experience", label: "Partner experience" },
    { id: "marketing", label: "Marketing and tracking" },
    { id: "partner-groups", label: "Partner groups" },
    { id: "custom-domains", label: "Custom domains" }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings />
      case "partner-experience":
        return <PartnerExperience />
      case "marketing":
        return <MarketingAndTracking/>
      case "partner-groups":
        return <PartnerGroups/>
      case "custom-domains":
        return <CustomDomains/>
      default:
        return <GeneralSettings />
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