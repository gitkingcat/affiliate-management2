"use client"

import { useState, useRef } from "react"
import { MedicalSidebar } from "@/components/medical-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Search, Upload, FileText, MoreHorizontal, X, Plus } from "lucide-react"
import ProgramSettingsHeader from "@/src/headers/programSettingsHeader";

interface Resource {
  id: number
  name: string
  type: "PNG" | "PDF" | "DOC" | "JPG"
  groups: string
  imageUrl?: string
  selected: boolean
}

const initialResources: Resource[] = [
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
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    group: 'All groups',
    file: null as File | null
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const getFileType = (file: File): "PNG" | "PDF" | "DOC" | "JPG" => {
    const extension = file.name.split('.').pop()?.toUpperCase()
    if (['PNG', 'JPG', 'JPEG'].includes(extension || '')) {
      return extension === 'JPEG' ? 'JPG' : extension as "PNG" | "JPG"
    }
    if (extension === 'PDF') return 'PDF'
    if (['DOC', 'DOCX'].includes(extension || '')) return 'DOC'
    return 'PNG' // default
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, file }))

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const handleAddResource = () => {
    if (!formData.name.trim() || !formData.file) return

    const newResource: Resource = {
      id: Date.now(), // Simple ID generation for demo
      name: formData.name,
      type: getFileType(formData.file),
      groups: formData.group,
      imageUrl: previewUrl || undefined,
      selected: false
    }

    setResources(prev => [...prev, newResource])
    setShowAddModal(false)
    setFormData({ name: '', group: 'All groups', file: null })
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const resetForm = () => {
    setShowAddModal(false)
    setFormData({ name: '', group: 'All groups', file: null })
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
      <div className="flex h-screen bg-background">
        <MedicalSidebar/>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ProgramSettingsHeader/>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            <div className="container mx-auto px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
                <Button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Resource</span>
                </Button>
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
                    Files ({resources.length})
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
                                <div className="aspect-[4/3] bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                                  {resource.imageUrl ? (
                                      <img
                                          src={resource.imageUrl}
                                          alt={resource.name}
                                          className="w-full h-full object-cover"
                                      />
                                  ) : resource.name === "Integrations" ? (
                                      <div className="grid grid-cols-2 gap-2 p-6">
                                        <div className="bg-gray-800 rounded p-2 text-white text-xs text-center">integra</div>
                                        <div className="bg-green-600 rounded p-2 text-white text-xs text-center flex items-center justify-center">
                                          <div className="w-4 h-4 bg-white rounded-sm"></div>
                                        </div>
                                        <div className="bg-gray-700 rounded p-2 text-white text-xs text-center">paddle</div>
                                        <div className="bg-black rounded p-2 text-white text-xs text-center">stripe</div>
                                      </div>
                                  ) : resource.name === "Dashboard" ? (
                                      <div className="text-center p-6">
                                        <div className="bg-blue-600 rounded-lg p-4 text-white text-sm font-medium">
                                          Dashboard Preview
                                        </div>
                                      </div>
                                  ) : resource.name === "Brand Mark" ? (
                                      <div className="text-center p-6">
                                        <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg">
                                          B
                                        </div>
                                      </div>
                                  ) : (
                                      <div className="flex items-center justify-center">
                                        <FileText className="h-12 w-12 text-gray-400" />
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
                              <Button onClick={() => setShowAddModal(true)}>
                                <Upload className="h-4 w-4 mr-2"/>
                                Add Resource
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
                              1 of {totalPages}
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

        {/* Add Resource Modal */}
        {showAddModal && (
            <div className="fixed inset-0 bg-black/15 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Resource</h3>
                  <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Promo Banner, Brand Logo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Upload *
                    </label>
                    <div className="flex flex-col gap-2">
                      <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,.pdf,.doc,.docx"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {previewUrl && (
                          <div className="mt-2">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-20 h-20 object-cover rounded border"
                            />
                          </div>
                      )}
                      {formData.file && !previewUrl && (
                          <div className="mt-2 p-2 bg-gray-50 rounded border">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-center text-gray-600">{formData.file.name}</p>
                          </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group
                    </label>
                    <select
                        value={formData.group}
                        onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="All groups">All groups</option>
                      <option value="Premium Partners">Premium Partners</option>
                      <option value="Basic Partners">Basic Partners</option>
                      <option value="New Partners">New Partners</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleAddResource}
                      disabled={!formData.name.trim() || !formData.file}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add Resource
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}