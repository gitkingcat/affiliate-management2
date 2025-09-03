"use client"

import React, { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter, MoreHorizontal, Plus, UserPlus, Bell, Mail } from "lucide-react"
import Reports from "@/src/app/reports/charts";
import {DashboardHeader} from "@/src/headers/dashboardHeader";



export default function ReportsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("Active")
  const [searchQuery, setSearchQuery] = useState("")
  const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedPeriod, setSelectedPeriod] = useState(30);



  const formatCurrency = (amount: number) => {
    return amount === 0 ? "$0.00" : `$${amount.toFixed(2)}`
  }

  return (
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <MedicalSidebar/>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
          />


          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              < Reports/>
            </div>
          </main>
        </div>
      </div>
  )
}