"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Plus } from "lucide-react"
import ProgramSettingsHeader from "@/src/headers/programSettingsHeader"
import FlowCard from "@/src/app/flows/flowCard"
import InfoBanner from "@/src/utils/infoBanner";

interface Flow {
  id: number
  name: string
  description: string
  dateCreated: string
  isDefault: boolean
  isActive: boolean
  type: "standard" | "yearly" | "premium"
}

const flows: Flow[] = [
  {
    id: 1,
    name: "Standard plan flow",
    description: "35% for every paid referral.",
    dateCreated: "February 25, 2025 at 04:37 PM",
    isDefault: true,
    isActive: true,
    type: "standard"
  },
  {
    id: 2,
    name: "Yearly plans flow",
    description: "20% commission for yearly subscriptions.",
    dateCreated: "February 25, 2025 at 04:36 PM",
    isDefault: true,
    isActive: true,
    type: "yearly"
  },
  {
    id: 3,
    name: "Premium plan flow",
    description: "Earn 55% for every paid referral.",
    dateCreated: "May 16, 2024 at 12:38 PM",
    isDefault: true,
    isActive: true,
    type: "premium"
  }
]

export default function FlowsPage() {
  const [showInfoBanner, setShowInfoBanner] = useState(true)
  const [flowStates, setFlowStates] = useState<Record<number, boolean>>(
      flows.reduce((acc, flow) => ({ ...acc, [flow.id]: flow.isActive }), {})
  )

  const toggleFlow = (flowId: number) => {
    setFlowStates(prev => ({
      ...prev,
      [flowId]: !prev[flowId]
    }))
  }

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar/>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ProgramSettingsHeader/>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Flows</h1>
                <div className="flex gap-2">
                  <Button>
                    <Plus className="h-4 w-4 mr-2"/>
                    Create Flow
                  </Button>
                </div>
              </div>
              <InfoBanner
                  description="Flows enable you to set and adjust commission rates for your partners using automated rules."
                  show={showInfoBanner}
                  onClose={() => setShowInfoBanner(false)}
              />

              <div className="space-y-6">
                <div>
                  <div className="space-y-4">
                    {flows.map((flow) => (
                        <FlowCard
                            key={flow.id}
                            flow={flow}
                            isActive={flowStates[flow.id]}
                            onToggle={toggleFlow}
                        />
                    ))}
                  </div>

                  {flows.length === 0 && (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-medium mb-2">No flows created yet</h3>
                            <p className="text-muted-foreground mb-4">
                              Create your first flow to start managing commission rates for your partners.
                            </p>
                            <Button>
                              <Plus className="h-4 w-4 mr-2"/>
                              Create your first flow
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}