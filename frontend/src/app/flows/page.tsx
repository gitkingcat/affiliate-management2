"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Card,
  CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Eye, MoreHorizontal } from "lucide-react"
import ProgramSettingsHeader from "@/src/headers/programSettingsHeader";

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
              </div>
              {showInfoBanner && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
                    <button
                        onClick={() => setShowInfoBanner(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4"/>
                    </button>
                    <h3 className="font-semibold mb-2">What are flows?</h3>
                    <p className="text-sm text-gray-700">
                      Flows enable you to set and adjust commission rates for your partners using automated rules. For
                      example, you can assign a 20% commission for the Starter plan and 15% for the Pro plan, giving you
                      more flexibility in managing commissions. You can even set different rates for individual partners
                      or groups.
                      <a href="#" className="text-blue-600 hover:underline ml-1">Learn more.</a>
                    </p>
                  </div>
              )}

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-4">All created flows</h2>

                  <div className="space-y-4">
                    {flows.map((flow) => (
                        <Card key={flow.id} className="transition-all hover:shadow-sm">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-medium text-lg">{flow.name}</h3>
                                  {flow.isDefault && (
                                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                        Default
                                      </Badge>
                                  )}
                                </div>

                                <p className="text-muted-foreground mb-3">
                                  {flow.description}
                                </p>

                                <p className="text-sm text-muted-foreground">
                                  Default | {flow.dateCreated}
                                </p>
                              </div>

                              <div className="flex items-center gap-3 ml-6">
                                <div className="flex items-center gap-2">
                                  <Switch
                                      checked={flowStates[flow.id]}
                                      onCheckedChange={() => toggleFlow(flow.id)}
                                      className="data-[state=checked]:bg-black"
                                  />
                                </div>

                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                  <Eye className="h-4 w-4"/>
                                </Button>

                                <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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