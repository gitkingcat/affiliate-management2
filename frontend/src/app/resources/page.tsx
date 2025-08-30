"use client"

import { useState } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Upload, FileText, MoreHorizontal } from "lucide-react"

interface Resource {
  id: number
  name: string
  type: "PNG" | "PDF" | "DOC" | "JPG"
  groups: string
  imageUrl?: string
  selected: boolean
}

const resources: Resource[] = [
  {
    id: 1,
    name: "Integrations",
    type: "PNG",
    groups: "All groups",
    imageUrl: "/api/placeholder/280/200",
    selected: false
  },
  {
    id: 2,
    name: "Dashboard",
    type: "PNG",
    groups: "All groups",
    imageUrl: "/api/placeholder/280/200",
    selected: false
  },
  {
    id: 3,
    name: "Brand Mark",
    type: "PNG",
    groups: "All groups",
    imageUrl: "/api/placeholder/280/200",
    selected: false
  }
]

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("files")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedResources, setSelectedResources] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const filteredResources = resources.filter((resource) => {
    return searchQuery === "" ||
        resource.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const totalItems = filteredResources.length
  const itemsPerPage = 12
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleSelectResource = (resourceId: number) => {
    setSelectedResources(prev =>
        prev.includes(resourceId)
            ? prev.filter(id => id !== resourceId)
            : [...prev, resourceId]
    )
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedResources(filteredResources.map(r => r.id))
    } else {
      setSelectedResources([])
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "PNG":
        return "bg-green-100 text-green-800"
      case "PDF":
        return "bg-red-100 text-red-800"
      case "DOC":
        return "bg-blue-100 text-blue-800"
      case "JPG":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold"></h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2"/>
                Upload file
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2"/>
                Create document
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
              </div>
              <div className="space-y-6">
                {/* Tabs Navigation */}
                <div className="flex gap-1 border-b">
                  <Button
                      variant={activeTab === "files" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("files")}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Files (3)
                  </Button>
                  <Button
                      variant={activeTab === "documents" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("documents")}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary text-muted-foreground"
                  >
                    Documents (Coming soon!)
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                    <Input
                        placeholder="Search by file name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                  </div>
                </div>

                {/* Content */}
                {activeTab === "files" && (
                    <div className="space-y-6">
                      {/* Files Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map((resource) => (
                            <div key={resource.id} className="group relative">
                              <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                {/* Checkbox */}
                                <div className="absolute top-3 left-3 z-10">
                                  <Checkbox
                                      checked={selectedResources.includes(resource.id)}
                                      onCheckedChange={() => handleSelectResource(resource.id)}
                                      className="bg-white shadow-sm"
                                  />
                                </div>

                                {/* More Options */}
                                <div
                                    className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white shadow-sm">
                                    <MoreHorizontal className="h-4 w-4"/>
                                  </Button>
                                </div>

                                {/* Image/Preview */}
                                <div
                                    className="aspect-[4/3] bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                                  {resource.name === "Integrations" && (
                                      <div className="grid grid-cols-2 gap-2 p-6">
                                        <div
                                            className="bg-gray-800 rounded p-2 text-white text-xs text-center">integra
                                        </div>
                                        <div
                                            className="bg-green-600 rounded p-2 text-white text-xs text-center flex items-center justify-center">
                                          <div className="w-4 h-4 bg-white rounded-sm"></div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-2 text-white text-xs text-center">paddle
                                        </div>
                                        <div className="bg-black rounded p-2 text-white text-xs text-center">stripe
                                        </div>
                                      </div>
                                  )}
                                  {resource.name === "Dashboard" && (
                                      <div className="p-4 w-full">
                                        <div className="bg-white rounded p-2 text-xs">
                                          <div className="space-y-1">
                                            <div className="h-2 bg-gray-200 rounded"></div>
                                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                          </div>
                                          <div className="mt-2 text-center text-green-600 font-bold">
                                            Ditch the manual tracking,<br/>
                                            say hello to real-time insights
                                          </div>
                                        </div>
                                      </div>
                                  )}
                                  {resource.name === "Brand Mark" && (
                                      <div className="flex items-center justify-center">
                                        <div className="flex">
                                          <div className="w-8 h-12 bg-gray-800 rounded-l-full"></div>
                                          <div className="w-8 h-12 bg-gray-600 rounded-r-full"></div>
                                        </div>
                                      </div>
                                  )}
                                </div>

                                {/* File Info */}
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">{resource.groups}</span>
                                    <Button variant="ghost" size="sm"
                                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <MoreHorizontal className="h-4 w-4"/>
                                    </Button>
                                  </div>

                                  <h3 className="font-medium text-base mb-2">{resource.name}</h3>

                                  <Badge
                                      variant="secondary"
                                      className={`text-xs ${getFileTypeColor(resource.type)}`}
                                  >
                                    {resource.type}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>

                      {filteredResources.length === 0 && (
                          <div className="text-center py-12">
                            <div className="max-w-md mx-auto">
                              <h3 className="text-lg font-medium mb-2">No files found</h3>
                              <p className="text-muted-foreground mb-4">
                                Try adjusting your search or upload your first file.
                              </p>
                              <Button>
                                <Upload className="h-4 w-4 mr-2"/>
                                Upload file
                              </Button>
                            </div>
                          </div>
                      )}

                      {/* Pagination */}
                      {totalItems > 0 && (
                          <div className="flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4"/>
                            </Button>

                            <span className="text-sm text-muted-foreground px-2">
                                                1 of 1
                                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4"/>
                            </Button>
                          </div>
                      )}
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground mb-4">
                          Document management functionality will be available soon.
                        </p>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}